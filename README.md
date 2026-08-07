# SentinelQR — Pre-Transaction Payment Trust Engine

> **"Evaluating payment destinations using Sentinel Memory™ privacy-preserving trust graphs, Smart Payment Intent Validation, multi-signal risk analysis, and explainable AI before users authorize a transaction."**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 Signature Pitch & USP Statement

> **"SentinelQR doesn't just verify where your money is going—it verifies whether the payment request itself is consistent with expected merchant behavior. Our Payment Intent Validation Engine detects suspicious characteristics, such as unexpected pre-filled amounts combined with other trust signals, helping users catch potentially manipulated payment requests before authorizing the transaction."**

---

## ⚡ How SentinelQR Works

```text
Camera ──► Decode QR ──► Extract Payload ──► Smart Payment Intent Engine ──► Sentinel Memory™ Graph ──► 9-Signal Risk Engine ──► AI Explainer ──► User Decides
```

### 📡 The 9 Core Signal Vectors
1. **QR Type Identification**: Routes `UPI`, `Website`, `APK`, `PDF`, `Wi-Fi`, or `Contact` payloads to custom verification suites.
2. **UPI Handle & VPA Validation**: Verifies handle structure, VPA formatting, and imposter merchant name mismatches (`+35`).
3. **Website Reputation**: Evaluates HTTPS, domain registration age, redirect depth, Levenshtein brand similarity, and URL shortener expansion.
4. **Threat Intelligence**: Cross-references Google Safe Browsing, PhishTank, and internal threat caches (`+40`).
5. **Community Intelligence**: Escalates risk automatically when multiple crowd-sourced reports flag a destination (`+30`).
6. **Merchant Verification *(Optional Trust Layer)***: Enrolled shopkeepers register their official QR payload baseline (`+20`).
7. **Sentinel Memory™ Geofence Baseline**: Privacy-preserving payload hashes matched against historical scan confidence (+20 location, +30 repeat payload).
8. **⭐ Smart Payment Intent Validation Engine**: Evaluates pre-filled amounts (`+10`), missing transaction references (`+15`), static merchant profiles (`+10`), and high amounts (`+15`).
9. **Explainable AI (XAI)**: Gemini 1.5 Flash translates deterministic JSON threat evidence into plain-English reasoning.

### 📊 Confidence-Based Risk Tiers
* **🟢 0 – 29 (LOW RISK)**: Payment intent & destination match expected behavior. Safe to proceed.
* **🟡 30 – 69 (SUSPICIOUS)**: Unexpected pre-filled amount or unverified handle detected. Caution required.
* **🔴 70 – 100 (CRITICAL DANGER)**: Potential QR replacement or phishing attempt detected. Payment is **not recommended**.

---

## 🎤 Golden Judge Defense Playbook

> **Q: "Why is a pre-filled amount on a QR code suspicious?"**  
> **A**: *"We avoid claiming legitimate static QRs never carry amounts. There are valid use cases where an amount is set. Instead, SentinelQR treats an unexpected pre-filled amount—especially when lacking dynamic transaction references—as a strong risk signal. It increases the risk score and asks the user to confirm the amount with the shopkeeper before proceeding."*

> **Q: "How does your solution differ from standard virus/blacklist scanners?"**  
> **A**: *"Most teams focus on URL blacklists or VirusTotal API calls. SentinelQR analyzes payment intent and historical location context. We evaluate whether the payment request structure matches expected merchant behavior before money leaves the user's account."*

---

## ✨ Key Features

- ⚡ **Smart Payment Intent Validation**: Multi-tier weighted heuristics for pre-filled amounts (`am`), transaction refs (`tr`), and high amount thresholds.
- 🧠 **Sentinel Memory™ Graph**: Privacy-preserving SHA-256 payload hashing and geofenced location memory.
- 🛡️ **Sub-10ms AI Threat Engine**: Real-time deterministic evaluation of domain entropy, Punycode tricks, shortener expansion, and VPA validation.
- 🔥 **Firebase Serverless Architecture**: Real-time Firestore synchronization for scans, threat alerts, and fraud broadcasts.
- 📷 **Full-Bleed Reticle Viewfinder**: High-tech camera scanner with 4 Electric Cyan corner brackets, sweeping laser animation, torch toggle, and gallery image decoding.
- 🔊 **Voice Safety Assistant (Read Aloud)**: Web Speech API text-to-speech integration designed for senior citizens and visually impaired users.
- 🚨 **Community Fraud Broadcasts**: Instant real-time crowd-sourced reporting of malicious shop stickers to protect surrounding merchants.

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

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
