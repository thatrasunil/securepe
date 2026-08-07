# 🛡️ SentinelQR — Core USP & Hackathon Judge Defense Playbook

> **Core Positioning**: SentinelQR is a **Pre-Transaction Payment Trust Engine** that evaluates QR payment destinations using multi-signal risk analysis and explainable AI before users authorize a transaction.

---

## 🎯 The Core Philosophy: "Destination Trust, Not Image Classification"

### ❌ The Common Flaw (What Most Teams Say)
* *"Our AI scans the QR image and detects if it's fake or real."*
* **Why it fails under judge scrutiny**: A QR code is simply a matrix barcode encoding raw text/URL data. You **cannot determine from the QR image alone** whether it is genuine or fraudulent. 

### ✅ The Defensible USP (What SentinelQR Does)
Instead of asking:
> **"Is this QR fake?"**

SentinelQR asks:
> **"Is this payment destination trustworthy?"**

The QR image is merely a medium. SentinelQR decodes the payload and evaluates the **destination and context** before money leaves the user's account.

---

## 🔄 How SentinelQR Works (Processing Pipeline)

```text
       ┌──────────────┐
       │ Device Camera│
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │  Decode QR   │
       └──────┬───────┘
              │
              ▼
       ┌─────────────────────┐
       │ Identify QR Type    │ (UPI, Website, APK, PDF, Wi-Fi, Contact)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Extract Destination │ (URL, VPA Handle, IP, File Path)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Run 20+ Trust Checks│ (Domain Age, Brand Similarity, Blacklists, Merchant Hash)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Compute Risk Score  │ (Deterministic 0-100 Confidence Tier)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Explain the Result  │ (LLM Translates JSON Evidence -> Plain English)
       └──────┬──────────────┘
              │
              ▼
       ┌──────────────┐
       │ User Decides │
       └──────────────┘
```

---

## 📡 The Multi-Signal Risk Engine (7 Core Trust Signals)

SentinelQR does not guess—it aggregates measurable evidence across 7 independent signal vectors:

| Signal | Category | Key Checks & Verification Logic |
| :--- | :--- | :--- |
| **Signal 1** | **QR Type Identification** | Categorizes payload (`UPI`, `Website`, `APK`, `PDF`, `Wi-Fi`, `Contact`) to apply type-specific validation rules. |
| **Signal 2** | **UPI Validation** | Validates UPI handle syntax, expected payment parameters, VPA structure, and matches recipient name against known imposter patterns. |
| **Signal 3** | **Website Reputation** | Evaluates SSL/HTTPS, domain registration age, redirect chain depth, Levenshtein brand similarity, IDN Punycode homographs, and URL shortener expansion. |
| **Signal 4** | **Threat Intelligence** | Cross-references URLs & VPAs against Google Safe Browsing, PhishTank, open-source phishing databases, and internal threat caches. |
| **Signal 5** | **Community Intelligence** | Crowd-sourced fraud reports. If multiple users flag a payload/destination, risk score scales up automatically. |
| **Signal 6** | **Merchant Verification *(Optional Trust Layer)*** | Participating merchants can voluntarily register their official QR payload. If a scanned QR at the store differs from the registered QR, SentinelQR flags a **possible QR sticker replacement**. If a merchant is not registered, SentinelQR continues to protect the user using the remaining 6 independent signals. |
| **Signal 7** | **Physical Context (Future)** | Verifies physical shop location, device GPS proximity, previously registered store QR baseline, and historical scan anomalies. |

---

## 📊 Confidence-Based Risk Score Tiers

SentinelQR defines its 0–100 score as a **confidence-based risk assessment** rather than an absolute binary call:

| Risk Score Tier | Level | Technical & Operational Meaning |
| :---: | :--- | :--- |
| **0 – 29** | **🟢 Low Risk** | Low observed risk based on available signals. Transaction appears normal. |
| **30 – 69** | **🟡 Suspicious** | Suspicious indicators detected (e.g., brand similarity or shortener). Review carefully before proceeding. |
| **70 – 100** | **🔴 Critical Danger** | Multiple high-risk indicators detected (e.g., sticker swap, phishing domain, community flags). Payment is **not recommended**. |

### Scoring Weight Breakdown Example:

| Signal Evidence Triggered | Score Contribution |
| :--- | ---: |
| Community Scam Reports ($\ge 5$ flags) | **+30** |
| Merchant VPA / QR Hash Mismatch (Sticker Swap) | **+20** |
| Brand Similarity (Imposter domain e.g., `paytm-secure-login.net`) | **+20** |
| Domain Age (< 14 days old) | **+15** |
| Unsafe Multi-Hop Redirects ($\ge 3$ redirects) | **+10** |
| URL Shortener Masking (`bit.ly`, `tinyurl`) | **+5** |
| **Total Computed Risk Score** | **82 / 100 (CRITICAL DANGER)** |

---

## 🤖 The True Role of AI (Explainability, Not Fraud Detection)

> **Crucial Distinction**: The AI **does NOT detect fraud**; the deterministic Risk Engine computes the score. The AI acts as an **Explainable AI (XAI) Translator**.

### Input to LLM (Structured Evidence JSON):
```json
{
  "risk_score": 82,
  "merchant_mismatch": true,
  "community_reports": 18,
  "brand_similarity": "paytm.com",
  "domain_age_days": 4
}
```

### Output from LLM (Human-Readable Explanation):
> *"This QR code appears highly risky (82/100) because it points to a payment destination that closely resembles Paytm, has been reported 18 times by other users, and does not match the registered merchant's official UPI details. We strongly recommend NOT proceeding with this payment."*

---

## 🎤 The Golden Hackathon Pitch & Judge Defense Script

### The Golden Summary:
> *"We don't claim to identify fake QR images. We decode the QR, analyze the destination using multiple measurable trust signals, calculate a deterministic risk score, and then use AI to explain the findings in plain language before the user decides whether to pay."*

### Key Judge Questions & Bulletproof Answers:

#### Q1: "How does your AI know if a QR code is fake?"
* **Answer**: *"We don't rely on AI to decide whether a QR code is fake. A QR image is just encoded data. Once decoded, SentinelQR evaluates the payment destination across multiple measurable trust signals—such as merchant verification, destination validation, threat intelligence, and community reports. These signals produce a deterministic risk score. Our AI then translates that raw evidence into plain language so users understand why a payment may be risky before they pay."*

#### Q2: "What if the merchant never registers?"
* **Answer**: *"Merchant verification is an optional trust layer, not a single point of failure. If a merchant isn't enrolled, SentinelQR relies on the remaining trust signals—such as domain age, URL unrolling, UPI syntax validation, threat intelligence databases, and community reports—to assess destination risk. Merchant registration simply adds an extra layer of sticker replacement protection for participating shopkeepers."*

---

## ⚡ What Makes SentinelQR Different?

| Feature | Generic QR Scanners | SentinelQR |
| :--- | :--- | :--- |
| **Core Question Asked** | *"What data is inside this QR?"* | **"Based on everything we know about where this QR leads, how risky is it to continue?"** |
| **Fraud Detection Strategy** | None (pure decoder) | Multi-signal deterministic trust engine |
| **Merchant Safety** | Blind execution | Optional QR sticker swap & VPA tampering detection |
| **AI Utilization** | Marketing buzzword / LLM hallucination risk | Strict Explainable AI (XAI) translator of verified evidence |
| **Timing** | Post-scan / Post-click | **Pre-transaction security shield** |
