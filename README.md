# SentinelQR — Pre-Transaction Payment Trust Engine

> **"Evaluating payment destinations using Sentinel Memory™ privacy-preserving trust graphs, multi-signal risk analysis, and explainable AI before users authorize a transaction."**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 Signature USP: Sentinel Memory™

> **Sentinel Memory™ — A privacy-preserving trust graph that learns trusted QR payment destinations over time. Instead of judging a QR image, it compares the current payment destination with historical trust patterns, geofenced location context, merchant verification, and community intelligence to detect unexpected changes before users pay.**

Most QR scanners only answer:
> *"What does this QR contain?"*

SentinelQR adds historical context & memory:
> **"What have we historically observed at this physical location?"**

---

## ⚡ How SentinelQR Works

```text
Camera ──► Decode QR ──► Extract Destination ──► Sentinel Memory™ Graph ──► 20+ Trust Checks ──► Confidence Score (0-100) ──► AI Explainer ──► User Decides
```

### 📡 Multi-Signal Risk Engine & Sentinel Memory™ Model
1. **Sentinel Memory™ Geofence Baseline**: Privacy-preserving payload hashes matched against historical scan confidence (+20 location, +30 repeat payload, +20 confirmations).
2. **Defensible Tamper Alerting**: Flags *"Potential QR replacement detected. The payment destination differs from previous trusted scans at this location."*
3. **QR Type Identification**: Routes `UPI`, `Website`, `APK`, `PDF`, `Wi-Fi`, or `Contact` payloads to custom verification suites.
4. **UPI Validation**: Verifies handle structure, VPA formatting, and imposter merchant name mismatches.
5. **Website Reputation**: Evaluates HTTPS, domain registration age, redirect depth, Levenshtein brand similarity, and URL shortener expansion.
6. **Community Intelligence**: Escalates risk automatically when multiple crowd-sourced reports flag a destination.
7. **Merchant Verification *(Optional Trust Layer)***: Enrolled shopkeepers register their official QR payload baseline.

### 📊 Confidence-Based Risk Tiers
* **🟢 0 – 29 (LOW RISK)**: Low observed risk based on available signals.
* **🟡 30 – 69 (SUSPICIOUS)**: Suspicious indicators detected. Review before proceeding.
* **🔴 70 – 100 (CRITICAL DANGER)**: Multiple high-risk indicators detected. Payment is **not recommended**.

---

## 🎤 The Golden Judge Defense Pitch

> **Q: "How does your AI know if a QR code is fake?"**  
> **A**: *"A QR code itself is just raw data—you cannot know if an image is fake. SentinelQR evaluates the payment destination and location context. Through Sentinel Memory™, we check whether the payload matches historical trust baselines for that physical location before money leaves the user's account."*

> **Q: "What if a merchant legitimately changes their QR code?"**  
> **A**: *"We avoid overclaiming 'Fake Sticker'. SentinelQR flags a 'Potential QR replacement detected—destination differs from previous trusted scans'. It calculates a confidence score and prompts the user to verify with the shopkeeper."*

---

## ✨ Key Features

- 🧠 **Sentinel Memory™ Graph**: Privacy-preserving SHA-256 payload hashing and geofenced location memory.
- 🛡️ **Sub-10ms AI Threat Engine**: Real-time deterministic evaluation of domain entropy, Punycode tricks, shortener expansion, and VPA validation.
- 🔥 **Firebase Serverless Architecture**: Real-time Firestore synchronization for scans, threat alerts, and fraud broadcasts.
- 📷 **Full-Bleed Reticle Viewfinder**: High-tech camera scanner with 4 Electric Cyan corner brackets, sweeping laser animation, torch toggle, and gallery image decoding.
- 🔊 **Voice Safety Assistant (Read Aloud)**: Web Speech API text-to-speech integration designed for senior citizens and visually impaired users.
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
- **JUDGE_DEFENSE_AND_USP.md**: Master Pitch & Defense Playbook

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
