# 🛡️ SentinelQR — Core USP & Hackathon Judge Defense Playbook

> **Core Positioning**: SentinelQR is a **Pre-Transaction Payment Trust Engine** powered by **Sentinel Memory™** and the **Payment Intent Validation Engine** — evaluating *where* a payment goes and *how* the payment request is constructed before users authorize a transaction.

---

## 🎯 Signature Pitch: "Where It Goes + How It's Constructed"

> **"Most QR security solutions only analyze where the payment goes. SentinelQR also analyzes how the payment request is constructed. Our Payment Intent Validation Engine detects suspicious UPI payment requests—such as unexpected pre-filled amounts on static merchant QR codes—and combines that with Sentinel Memory™ trust history, merchant verification, and community intelligence to generate an explainable risk assessment before users authorize payment."**

---

## ⭐ Signal #8: Payment Intent Validation Engine

### Concept
SentinelQR doesn't just verify **who you're paying**. It verifies **how the payment request is structured**.

A standard static merchant QR code (at tea shops, grocery stands, etc.) encodes:
```text
upi://pay?pa=merchant@ybl&pn=ABC%20Store
```
Customers manually type the amount they want to pay.

### Scam Scenario & Detection
Scammers paste stickers pre-filling an amount:
```text
upi://pay?pa=scammer@ybl&pn=ABC%20Store&am=5000
```
- Customers scan and pay, assuming they are entering the amount, but `am=5000` is already set.
- **Detection Logic**: `UPI Scheme` + `Static Merchant Profile` + `Pre-filled Amount (am)` + `Missing Transaction Ref (tr)` $\rightarrow$ **Risk Score +30**.

### Non-Overclaiming User Warning
Instead of declaring *"Fake QR"*, SentinelQR outputs:
> **⚠️ Payment Review Required: Unexpected pre-filled payment amount detected. Trusted static merchant QR codes usually ask you to enter the amount manually. Please confirm with the merchant before proceeding.**

---

## 🧠 Sentinel Memory™ (Privacy-Preserving Trust Graph)

SentinelQR builds a privacy-preserving memory of trusted QR payment destinations over time.

- **Hashed Payload Baseline**: SHA-256 payload hashes (zero plain text sensitive storage).
- **Geofenced Location Context**: Geofenced latitude/longitude matching.
- **Historical Scan Patterns**: Anonymous scan counts & repeat confirmations.

### Defensible Tamper Alerting
> **"Potential QR replacement detected. The payment destination differs from previous trusted scans at this location. Please verify the merchant before proceeding."**

---

## 📊 Complete 9-Signal Vector Matrix

| # | Signal Vector | Category |
| :-: | :--- | :--- |
| **1** | **QR Type Detection** | Protocol Classifier |
| **2** | **UPI Handle & VPA Validation** | Handle Inspector |
| **3** | **Website Reputation & Shortener Unrolling** | Domain Intelligence |
| **4** | **Threat Intelligence (SafeBrowsing / PhishTank)** | Blacklist Feeds |
| **5** | **Community Intelligence** | Crowd-sourced Alerts |
| **6** | **Merchant Verification Baseline** | Enrolled Hash Matching |
| **7** | **Historical Trust Memory (Sentinel Memory™)** | Geofenced Trust Graph |
| **⭐ 8** | **Payment Intent Validation Engine** | Payment Request Analysis |
| **9** | **Explainable AI (XAI Summary)** | Gemini 1.5 Flash Translation |

---

## 🎙️ Judge Q&A Playbook

### Q1: "Why is a pre-filled amount on a QR code suspicious?"
> *"Static merchant QR codes generally don't pre-fill payment amounts. If a QR unexpectedly includes an amount while lacking characteristics typically associated with dynamic payment requests (like transaction references), SentinelQR increases the risk score and asks the user to verify the payment before proceeding."*

### Q2: "How do you know if a QR code is fake?"
> *"A QR code itself is just raw data—you cannot know if an image is fake. SentinelQR evaluates the payment destination, request structure, and location context. Through Sentinel Memory™ and Payment Intent Analysis, we check whether the payload matches historical trust baselines for that physical location before money leaves the user's account."*
