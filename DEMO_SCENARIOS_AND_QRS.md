# 📱 SentinelQR — Live Hackathon Demo Playbook & Scannable QR Cards

> **Core Positioning**: SentinelQR is a **Pre-Transaction Payment Trust Engine** that evaluates QR payment destinations using multi-signal risk analysis and explainable AI before users authorize a transaction.

---

## 🎯 Scannable Demo QR Cards (Scan Directly From Screen or Print)

Scan these QR codes using the SentinelQR live camera viewfinder or import them from your photo gallery:

````carousel
![Scenario 1: Authentic Merchant Scan](file:///C:/Users/thatr/.gemini/antigravity/brain/0f5d947a-d0eb-4587-a632-dbffa29b3af4/qr1_safe_merchant.png)
<!-- slide -->
![Scenario 2: Suspicious Shortened Link Scan](file:///C:/Users/thatr/.gemini/antigravity/brain/0f5d947a-d0eb-4587-a632-dbffa29b3af4/qr2_suspicious_link.png)
<!-- slide -->
![Scenario 3: Sticker Swap Scam Scan](file:///C:/Users/thatr/.gemini/antigravity/brain/0f5d947a-d0eb-4587-a632-dbffa29b3af4/qr3_critical_scam.png)
````

---

## 🧪 Live Demo Scenario Breakdown

### Scenario 1 — Verified Authentic Merchant Scan (🟢 LOW RISK)
- **Target Payload**: `upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50`
- **Evaluated Score**: **5 / 100 (🟢 Low Risk)**
- **Triggered Signals**:
  - `✓` Valid UPI handle format (`ramesh.chai@upi`).
  - `✓` Matches registered merchant store baseline (GPS proximity verified).
  - `✓` Zero community fraud reports.
- **Gemini XAI Explanation**:
  > *"Safe & Verified: Payment destination matches the official registered VPA for Ramesh Chai Corner. No suspicious redirects or imposter flags detected. Safe to proceed."*

---

### Scenario 2 — Suspicious Shortened Link (🟡 SUSPICIOUS)
- **Target Payload**: `https://bit.ly/paytm-cashback-claim-99`
- **Evaluated Score**: **45 / 100 (🟡 Suspicious)**
- **Triggered Signals**:
  - `⚠️` Shortened domain (`bit.ly`) concealing destination (`+25`).
  - `⚠️` Fintech brand impersonation keyword (`paytm-cashback`) (`+20`).
- **Gemini XAI Explanation**:
  > *"Caution Required: This QR code uses a shortened URL (bit.ly) to mask its destination and includes cashback lure keywords. Review the unrolled URL carefully before providing any credentials."*

---

### Scenario 3 — Sticker Swap & Imposter Scam (🔴 CRITICAL DANGER)
- **Target Payload**: `upi://pay?pa=paytm-support@ybl&pn=Paytm%20Refund%20Support&am=1500`
- **Evaluated Score**: **88 / 100 (🔴 Critical Danger)**
- **Triggered Signals**:
  - `⚠️` Imposter customer support handle (`paytm-support@ybl`) (`+35`).
  - `⚠️` 18 recent community fraud reports (`+30`).
  - `⚠️` Imposter display name ("Paytm Refund Support") (`+20`).
- **Gemini XAI Explanation**:
  > *"CRITICAL DANGER: High probability of financial scam. This QR code points to an unverified VPA claiming to be Paytm Customer Support and has been reported 18 times by other users. DO NOT proceed with payment or share your UPI PIN."*

---

## 🎤 5-Minute Live Presentation Script

1. **[0:00 - 1:00] The Hook**:
   *"Millions of people scan QR codes daily without knowing where money actually goes. Scammers paste fake QR stickers over legitimate shop stands. SentinelQR is a Pre-Transaction Payment Trust Engine that evaluates destination trust before you pay."*

2. **[1:00 - 2:00] Scenario 1 Demo (Authentic Merchant)**:
   Scan `qr1_safe_merchant.png` $\rightarrow$ Show **🟢 Low Risk (5/100)** green badge & location match.

3. **[2:00 - 3:30] Scenario 3 Demo (Sticker Swap Scam)**:
   Scan `qr3_critical_scam.png` $\rightarrow$ Show **🔴 Critical Danger (88/100)** modal. Tap **Listen** to trigger Voice Shield narration. Show Gemini XAI plain-language breakdown.

4. **[3:30 - 4:15] Real-Time Community Broadcast**:
   Click **Report Fraud** $\rightarrow$ Show real-time Firestore synchronization on secondary device.

5. **[4:15 - 5:00] The Technical Close**:
   *"We don't claim to identify fake QR images. We decode the QR, analyze the destination using multiple measurable trust signals, calculate a deterministic risk score, and then use AI to explain the findings in plain language before the user decides whether to pay."*
