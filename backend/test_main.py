import unittest
from fastapi.testclient import TestClient
from main import app

class TestSentinelQRBackend(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_healthz(self):
        response = self.client.get("/healthz")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_safe_upi_scan(self):
        payload = "upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50"
        response = self.client.post("/api/v1/scan/analyze", json={"raw_payload": payload})
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertLess(data["risk_score"], 30)
        self.assertEqual(data["risk_level"], "SAFE")

    def test_imposter_upi_scan(self):
        payload = "upi://pay?pa=paytm-support@ybl&pn=Paytm%20Refund%20Support&am=1500"
        response = self.client.post("/api/v1/scan/analyze", json={"raw_payload": payload})
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertGreaterEqual(data["risk_score"], 70)
        self.assertEqual(data["risk_level"], "HIGH_RISK")
        self.assertTrue(len(data["explanation"]["reasons"]) > 0)

    def test_fraud_report_and_community_propagation(self):
        new_payload = "upi://pay?pa=scammer99@ybl&pn=Scam%20Target"
        # First scan before report
        res1 = self.client.post("/api/v1/scan/analyze", json={"raw_payload": new_payload}).json()["data"]
        initial_score = res1["risk_score"]

        # Submit fraud report
        rep_res = self.client.post("/api/v1/fraud/report", json={
            "raw_payload": new_payload,
            "category": "IMPOSTER_PAYMENT",
            "notes": "Fake payment QR"
        })
        self.assertEqual(rep_res.status_code, 200)

        # Second scan after report
        res2 = self.client.post("/api/v1/scan/analyze", json={"raw_payload": new_payload}).json()["data"]
        self.assertGreater(res2["risk_score"], initial_score)
        self.assertGreaterEqual(res2["signals"]["community_reports_count"], 1)

if __name__ == "__main__":
    unittest.main()
