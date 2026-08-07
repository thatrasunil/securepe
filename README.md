# SentinelQR (SecurePE) — AI Fraud Shield for Secure QR Payments

> **"Think Before You Scan."**  
> *Transforming QR payments from an act of blind trust into an informed decision.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**SentinelQR** is India's most trusted AI-powered QR payment security platform. Before money leaves a user's account, SentinelQR inspects the QR code for **fake shop stickers, imposter merchant VPAs, phishing URLs, and malicious APK downloads** in under 10 milliseconds.

Unlike standard QR utilities designed purely to decode payloads, SentinelQR operates like a **financial trust product**—combining Google Pay simplicity, Apple Wallet elegance, and Microsoft Defender security.

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
