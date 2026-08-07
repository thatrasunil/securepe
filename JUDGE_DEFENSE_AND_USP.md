# 🛡️ SentinelQR — Core USP & Hackathon Judge Defense Playbook

> **Core Positioning**: SentinelQR is a **Pre-Transaction Payment Trust Engine** powered by **Sentinel Memory™** and **Smart Payment Intent Validation** — evaluating *where* a payment goes and *whether the payment request itself is consistent with expected merchant behavior* before users authorize a transaction.

---

## 🎯 Final Hackathon USP Statement

> **"SentinelQR doesn't just verify where your money is going—it verifies whether the payment request itself is consistent with expected merchant behavior. Our Payment Intent Validation Engine detects suspicious characteristics, such as unexpected pre-filled amounts combined with other trust signals, helping users catch potentially manipulated payment requests before authorizing the transaction."**

---

## ⭐ Signal #8: Smart Payment Intent Validation Engine

### Concept
SentinelQR doesn't just verify **who receives the money**. It verifies **whether the payment request itself looks suspicious**.

### Detection Heuristics & Weighted Rule Engine

| Payment Intent Signal Vector | Weighted Risk Score |
| :--- | :---: |
| **Pre-filled payment amount (`am` present)** | `+10` |
| **No transaction reference (`tr` missing/empty)** | `+15` |
| **Merchant profile suggests static QR** | `+10` |
| **Amount unusually high ($\ge$ ₹2,000)** | `+15` |
| **Merchant VPA handle mismatch** | `+20` |
| **Community fraud reports on destination** | `+30` |

### Factual & User-Friendly Alerting
Instead of declaring *"Fake QR"*, SentinelQR presents a factual, non-overclaiming prompt:

> **⚠️ Review Payment Details: This QR already contains a payment amount. Static merchant QR codes commonly require customers to enter the amount manually. Please verify the amount with the merchant before proceeding.**

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

| # | Signal Vector | Category | Weight ($w_i$) |
| :-: | :--- | :--- | :---: |
| **1** | **QR Type Detection** | Protocol Classifier | Baseline |
| **2** | **UPI Handle & VPA Validation** | Handle Inspector | `+35` |
| **3** | **Website Reputation & Shortener Unrolling** | Domain Intelligence | `+25..45` |
| **4** | **Threat Intelligence (SafeBrowsing / PhishTank)** | Blacklist Feeds | `+40` |
| **5** | **Community Intelligence** | Crowd-sourced Alerts | `+30` |
| **6** | **Merchant Verification Baseline** | Enrolled Hash Matching | `+20` |
| **7** | **Historical Trust Memory (Sentinel Memory™)** | Geofenced Trust Graph | `+20..30` |
| **⭐ 8** | **Payment Intent Validation Engine** | Payment Request Analysis | `+10..40` |
| **9** | **Explainable AI (XAI Summary)** | Gemini 1.5 Flash Translation | Human Summary |

---

## 🎙️ Judge Q&A Playbook

### Q1: "Why is a pre-filled amount on a QR code suspicious?"
> *"We avoid claiming legitimate static QRs never carry amounts. There are valid use cases where an amount is set. Instead, SentinelQR treats an unexpected pre-filled amount—especially when lacking dynamic transaction references—as a strong risk signal. It increases the risk score and asks the user to confirm the amount with the shopkeeper before proceeding."*

### Q2: "How does your solution differ from standard virus/blacklist scanners?"
> *"Most teams focus on URL blacklists or VirusTotal API calls. SentinelQR analyzes payment intent and historical location context. We evaluate whether the payment request structure matches expected merchant behavior before money leaves the user's account."*
