"use client";

import React, { useState } from "react";
import { ScreenId } from "../BottomNav";

interface ApiExplorerScreenProps {
  onNavigate: (target: ScreenId) => void;
}

export const ApiExplorerScreen: React.FC<ApiExplorerScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<"analyze" | "verify" | "report">("analyze");
  const [payloadInput, setPayloadInput] = useState("upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50");
  const [merchantInput, setMerchantInput] = useState("MCH-8821");
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const samplePayloads = [
    { label: "🟢 Safe Merchant QR", value: "upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50" },
    { label: "⚠️ Suspicious Link", value: "http://secure-update-app.com/pay.apk" },
    { label: "🔴 Imposter / Fake Paytm", value: "upi://pay?pa=paytm-support@ybl&pn=Paytm%20Support&am=5000" },
  ];

  const handleExecute = async () => {
    setLoading(true);
    setApiResponse(null);
    setLatency(null);
    const start = performance.now();

    try {
      let url = "/api/v1/scan/analyze";
      let body: any = {};

      if (activeTab === "analyze") {
        url = "/api/v1/scan/analyze";
        body = { qr_payload: payloadInput, context: { location: { lat: 12.9716, lng: 77.5946 } } };
      } else if (activeTab === "verify") {
        url = "/api/v1/merchant/verify";
        body = { merchant_id: merchantInput, qr_payload: payloadInput };
      } else if (activeTab === "report") {
        url = "/api/v1/fraud/report";
        body = { raw_payload: payloadInput, category: "QR_PAYMENT_FRAUD", notes: "Fake QR sticker reported by user" };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setApiResponse(data);
      setLatency(elapsed);
    } catch (err: any) {
      setApiResponse({ status: "error", message: err.message || "Failed to execute request" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px 20px 120px 20px", background: "#050C1A", minHeight: "100dvh", color: "#f8fafc" }} className="animate-fade">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#1E293B", color: "#fff", border: "1px solid #334155", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
            SecurePE Trust API Explorer
          </h2>
          <div style={{ fontSize: "0.75rem", color: "#38BDF8", fontWeight: "600" }}>
            Pre-Transaction Payment Risk Intelligence API v1.0
          </div>
        </div>
      </div>

      {/* Hero Badge Banner */}
      <div style={{ background: "linear-gradient(135deg, #0A192F 0%, #1E3A5F 100%)", borderRadius: "20px", padding: "16px", border: "1px solid rgba(56, 189, 248, 0.3)", marginBottom: "20px" }}>
        <div style={{ fontSize: "0.75rem", color: "#38BDF8", fontWeight: "800", letterSpacing: "0.05em", marginBottom: "4px" }}>
          ⚡ DEVELOPER PLAYGROUND FOR JUDGES
        </div>
        <div style={{ fontSize: "0.86rem", color: "#CBD5E1", lineHeight: "1.45" }}>
          Test the live API endpoints directly. Any UPI payment app can integrate this API to run deterministic risk analysis before authorizing money transfers.
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {[
          { id: "analyze", label: "POST /scan/analyze" },
          { id: "verify", label: "POST /merchant/verify" },
          { id: "report", label: "POST /fraud/report" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: "14px",
              fontSize: "0.76rem",
              fontWeight: "800",
              border: activeTab === tab.id ? "1.5px solid #38BDF8" : "1px solid #334155",
              background: activeTab === tab.id ? "rgba(56, 189, 248, 0.15)" : "#0F172A",
              color: activeTab === tab.id ? "#38BDF8" : "#94A3B8",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quick Sample Selector */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ fontSize: "0.74rem", color: "#94A3B8", fontWeight: "600", marginBottom: "6px" }}>Sample Payloads to Test:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {samplePayloads.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setPayloadInput(s.value)}
              style={{
                fontSize: "0.72rem",
                background: "#1E293B",
                color: "#F8FAFC",
                border: "1px solid #334155",
                borderRadius: "10px",
                padding: "4px 10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payload Input Form */}
      <div style={{ background: "#0F172A", borderRadius: "20px", padding: "16px", border: "1px solid #1E293B", marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "0.76rem", color: "#94A3B8", fontWeight: "700", marginBottom: "6px" }}>
          Request Body — <code style={{ color: "#38BDF8" }}>qr_payload</code>
        </label>
        <textarea
          value={payloadInput}
          onChange={(e) => setPayloadInput(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            background: "#050C1A",
            border: "1px solid #334155",
            borderRadius: "12px",
            color: "#38BDF8",
            padding: "10px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            marginBottom: "12px",
            resize: "none",
          }}
        />

        {activeTab === "verify" && (
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "0.76rem", color: "#94A3B8", fontWeight: "700", marginBottom: "4px" }}>
              Merchant ID
            </label>
            <input
              type="text"
              value={merchantInput}
              onChange={(e) => setMerchantInput(e.target.value)}
              style={{
                width: "100%",
                background: "#050C1A",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#fff",
                padding: "8px 10px",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
              }}
            />
          </div>
        )}

        <button
          onClick={handleExecute}
          disabled={loading}
          style={{
            width: "100%",
            height: "46px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #2563EB 0%, #0284c7 100%)",
            color: "#fff",
            fontSize: "0.92rem",
            fontWeight: "800",
            border: "none",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {loading ? "Executing API Engine..." : "⚡ Execute API Request"}
        </button>
      </div>

      {/* Response Box */}
      {apiResponse && (
        <div style={{ background: "#0F172A", borderRadius: "20px", padding: "16px", border: "1.5px solid #2563EB" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: "800", color: "#10B981" }}>
              HTTP 200 OK
            </span>
            {latency && (
              <span style={{ fontSize: "0.72rem", background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", padding: "3px 8px", borderRadius: "10px", fontWeight: "700" }}>
                ⚡ {latency} ms latency
              </span>
            )}
          </div>

          <pre
            style={{
              background: "#050C1A",
              color: "#A7F3D0",
              padding: "14px",
              borderRadius: "14px",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              overflowX: "auto",
              maxHeight: "340px",
              border: "1px solid #1E293B",
              lineHeight: "1.45",
            }}
          >
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
