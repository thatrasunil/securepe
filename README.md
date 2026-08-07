# SentinelQR — Pre-Transaction Payment Trust Engine

> **"Evaluating payment destinations using Sentinel Memory™ privacy-preserving trust graphs, Payment Intent Validation, multi-signal risk analysis, and explainable AI before users authorize a transaction."**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 Signature Hackathon Pitch

> **"Most QR security solutions only analyze *where* the payment goes. SentinelQR also analyzes *how* the payment request is constructed. Our Payment Intent Validation Engine detects suspicious UPI payment requests—such as unexpected pre-filled amounts on static merchant QR codes—and combines that with Sentinel Memory™ trust history, merchant verification, and community intelligence to generate an explainable risk assessment before users authorize payment."**

---

## ⚡ How SentinelQR Works

```text
Camera ──► Decode QR ──► Extract Destination ──► Payment Intent Engine ──► Sentinel Memory™ Graph ──► 20+ Trust Checks ──► Confidence Score (0-100) ──► AI Explainer ──► User Decides
```

### 📡 The 9 Core Signal Vectors
1. **QR Type Identification**: Routes `UPI`, `Website`, `APK`, `PDF`, `Wi-Fi`, or `Contact` payloads to custom verification suites.
2. **UPI Handle & VPA Validation**: Verifies handle structure, VPA formatting, and imposter merchant name mismatches.
3. **Website Reputation**: Evaluates HTTPS, domain registration age, redirect depth, Levenshtein brand similarity, and URL shortener expansion.
4. **Threat Intelligence**: Cross-references Google Safe Browsing, PhishTank, and internal threat caches.
5. **Community Intelligence**: Escalates risk automatically when multiple crowd-sourced reports flag a destination.
6. **Merchant Verification *(Optional Trust Layer)***: Enrolled shopkeepers register their official QR payload baseline.
7. **Sentinel Memory™ Geofence Baseline**: Privacy-preserving payload hashes matched against historical scan confidence (+20 location, +30 repeat payload, +20 confirmations).
8. **⭐ Payment Intent Validation Engine**: Detects unexpected pre-filled payment amounts (`am`) lacking dynamic transaction references (`tr`) on static merchant QRs.
9. **Explainable AI (XAI)**: Gemini 1.5 Flash translates deterministic JSON threat evidence into plain-English reasoning.

### 📊 Confidence-Based Risk Tiers
* **🟢 0 – 29 (LOW RISK)**: Destination matches historical trust pattern. Safe to proceed.
* **🟡 30 – 69 (SUSPICIOUS)**: Unexpected pre-filled amount or unverified handle detected. Caution required.
* **🔴 70 – 100 (CRITICAL DANGER)**: Potential QR replacement or phishing attempt detected. Payment is **not recommended**.

---

## 🎤 The Golden Judge Defense Pitch

> **Q: "Why is a pre-filled amount on a QR code suspicious?"**  
> **A**: *"Static merchant QR codes generally don't pre-fill payment amounts. If a QR unexpectedly includes an amount while lacking characteristics typically associated with dynamic payment requests (like transaction references), SentinelQR increases the risk score and asks the user to verify the payment before proceeding."*

> **Q: "How does your AI know if a QR code is fake?"**  
> **A**: *"A QR code itself is just raw data—you cannot know if an image is fake. SentinelQR evaluates the payment destination, request structure, and location context. Through Sentinel Memory™ and Payment Intent Analysis, we check whether the payload matches historical trust baselines for that physical location before money leaves the user's account."*

---

## ✨ Key Features

- 🧠 **Sentinel Memory™ Graph**: Privacy-preserving SHA-256 payload hashing and geofenced location memory.
- ⚡ **Payment Intent Validation Engine**: Detects sneaky pre-filled amounts (`am`) on static shop QR stickers.
- 🛡️ **Sub-10ms AI Threat Engine**: Real-time deterministic evaluation of domain entropy, Punycode tricks, shortener expansion, and VPA validation.
- 🔥 **Firebase Serverless Architecture**: Real-time Firestore synchronization for scans, threat alerts, and fraud broadcasts.
- 📷 **Full-Bleed Reticle Viewfinder**: High-tech camera scanner with 4 Electric Cyan corner brackets, sweeping laser animation, torch toggle, and gallery image decoding.
- 🔊 **Voice Safety Assistant (Read Aloud)**: Web Speech API text-to-speech integration designed for senior citizens and visually impaired users.
- 🚨 **Community Fraud Broadcasts**: Instant real-time crowd-sourced reporting of malicious shop stickers to protect surrounding merchants.

---

## 🏗️ Architecture & Technology Stack

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

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
