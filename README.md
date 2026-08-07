# SentinelQR — Pre-Transaction Payment Trust Engine

> **"Evaluating payment destinations using multi-signal risk analysis and explainable AI before users authorize a transaction."**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 The Core USP & Philosophy

> **"SentinelQR is a Pre-Transaction Payment Trust Engine that evaluates QR payment destinations using multi-signal risk analysis and explainable AI before users authorize a transaction."**

A QR code image is simply encoded data; you **cannot determine from the QR image alone** whether it is genuine or fraudulent. 

Instead of asking **"Is this QR fake?"**, SentinelQR asks:
👉 **"Is this payment destination trustworthy?"**

---

## ⚡ How SentinelQR Works

```text
Camera ──► Decode QR ──► Identify Type ──► Extract Destination ──► 20+ Trust Checks ──► Confidence Score (0-100) ──► AI Explainer ──► User Decides
```

### 📡 Multi-Signal Risk Engine (7 Independent Signals)
1. **QR Type Identification**: Routes `UPI`, `Website`, `APK`, `PDF`, `Wi-Fi`, or `Contact` payloads to custom verification suites.
2. **UPI Validation**: Verifies handle structure, VPA formatting, and imposter merchant name mismatches.
3. **Website Reputation**: Evaluates HTTPS, domain registration age, redirect depth, Levenshtein brand similarity, and URL shortener expansion.
4. **Threat Intelligence**: Cross-references Google Safe Browsing, PhishTank, and internal threat caches.
5. **Community Intelligence**: Escalates risk automatically when multiple crowd-sourced reports flag a destination.
6. **Merchant Verification *(Optional Trust Layer)***: Enrolled shopkeepers register their official QR payload. If a scanned QR at the store differs from the registered QR, SentinelQR warns of a possible QR replacement. If a merchant isn't registered, SentinelQR protects users via the remaining 6 signals.
7. **Physical Context**: Evaluates merchant geofencing, scan history, and device proximity.

### 📊 Confidence-Based Risk Tiers
* **🟢 0 – 29**: Low observed risk based on available signals.
* **🟡 30 – 69**: Suspicious indicators detected. Review before proceeding.
* **🔴 70 – 100**: Multiple high-risk indicators detected. Payment is **not recommended**.

---

## 🎤 The Golden Judge Defense Pitch

> **Q: "How does your AI know if a QR code is fake?"**  
> **A**: *"We don't rely on AI to decide whether a QR is fake. The QR code is decoded and evaluated using multiple measurable trust signals—such as merchant verification, destination validation, threat intelligence, and community reports. These signals produce a deterministic risk score. Our AI then explains that score in clear language so users understand why a payment may be risky."*

> **Q: "What if the merchant never registers?"**  
> **A**: *"Merchant verification is an optional trust layer, not a single point of failure. If a merchant isn't enrolled, SentinelQR relies on the remaining trust signals—such as domain age, URL unrolling, UPI syntax validation, threat intelligence databases, and community reports—to assess destination risk."*


---

## ✨ Key Features


- 🛡️ **Sub-10ms AI Threat Engine**: Real-time deterministic evaluation of domain entropy, Punycode tricks, shortener expansion, VPA validation, and geofence baselines.
- 🔥 **Firebase Serverless Architecture**: Real-time Firestore synchronization for scans, threat alerts, and fraud broadcasts, alongside Google Popup and Phone OTP authentication (`ssn-university`).
- 📷 **Full-Bleed Reticle Viewfinder**: High-tech camera scanner with 4 Electric Cyan corner brackets, sweeping laser animation, torch toggle, and gallery image decoding.
- 🔊 **Voice Safety Assistant (Read Aloud)**: Web Speech API text-to-speech integration designed for senior citizens and visually impaired users to hear threat assessments out loud.
- 🌗 **Cyber Trust Theme Strategy**: Seamless live switching between Light Mode ☀️ and Dark Mode 🌙 persisted in local storage.
- 🚨 **Community Fraud Broadcasts**: Instant real-time crowd-sourced reporting of malicious shop stickers to protect surrounding merchants.

---

## 🏗️ Architecture & Technology Stack

```
                                  ┌───────────────────────────┐
                                  │      Client (Next.js)     │
                                  └─────────────┬─────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
        ┌─────────────────────────────┐                   ┌─────────────────────────────┐
        │  Next.js Serverless Route   │                   │  Firebase Serverless Cloud  │
        │    /api/scan/analyze        │                   │    Auth & Realtime Firestore│
        └─────────────────────────────┘                   └─────────────────────────────┘
```

- **Frontend Framework**: Next.js 16.3 (Turbopack) with React 19 & TypeScript.
- **Styling**: Vanilla CSS Design System with custom HSL/HEX CSS Tokens (`globals.css`).
- **Database & Auth**: Firebase Auth (Google & Phone OTP) + Firestore Real-Time Database.
- **Deployment**: Vercel & Firebase Serverless setup.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/thatrasunil/securepe.git
   cd securepe/frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied) in your browser.

---

## 📄 Documentation

For architectural design and FAANG-level product strategy, view our design documents in `docs/`:
- **Document 0**: Product Strategy & Design Philosophy
- **Document 14**: SentinelQR Design Philosophy & Experience Strategy

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
