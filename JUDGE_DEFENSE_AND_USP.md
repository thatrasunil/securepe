# 🛡️ SentinelQR — Core USP & Hackathon Judge Defense Playbook

> **Core Positioning**: SentinelQR is a **Pre-Transaction Payment Trust Engine** powered by **Sentinel Memory™** — a privacy-preserving trust graph that evaluates QR payment destinations using multi-signal risk analysis, location context, and explainable AI before users authorize a transaction.

---

## 🎯 Signature USP: Sentinel Memory™ (Privacy-Preserving Trust Graph)

Most QR scanners only answer:
> *"What does this QR contain?"*

SentinelQR adds historical context & memory:
> **"What have we historically observed at this physical location?"**

### 🧠 Sentinel Memory™ Concept
SentinelQR builds a **privacy-preserving memory** of trusted QR payment destinations over time.

Instead of judging a raw QR image, SentinelQR compares the current payment destination against:
1. **Hashed Payload Baseline**: SHA-256 payload hashes (zero plain text sensitive storage).
2. **Geofenced Location Context**: Geofenced latitude/longitude matching.
3. **Historical Scan Patterns**: Anonymous scan counts & repeat confirmations.
4. **Merchant Verification**: Baseline hash matching.

---

## 🔍 Defensible Non-Overclaiming Tamper Detection

When a scammer pastes a fraudulent sticker over a merchant's QR stand, SentinelQR does **not** make reckless claims like *"Fake Sticker Detected"*.

Instead, it outputs a defensible, evidence-based warning:
> **"Potential QR replacement detected. The payment destination differs from previous trusted scans at this location. Please verify the merchant before proceeding."**

### 📊 Sentinel Memory™ Confidence Model

| Trust Signal | Score |
| :--- | :--- |
| **Same Location Seen Before** | `+20` |
| **Same Payload Repeatedly Scanned** | `+30` |
| **Multiple Successful Confirmations** | `+20` |
| **Merchant Verified** | `+20` |
| **Community Trust** | `+10` |
| **Total Maximum Confidence** | `100` |

---

## 🔒 Privacy & Defense Protocol

Judges will ask: *"How do you handle user privacy?"*

**SentinelQR Privacy Guarantees**:
- ❌ **Zero PIN Storage**: UPI PINs or banking credentials are never touched.
- ❌ **Zero User Identity Exposure**: No personal PII linked to trust memory entries.
- ❌ **Zero Payment Amount Tracking**: Transaction amounts are never logged.
- ✅ **Payload Hashes Only**: Only non-reversible hashed payloads and approximate geofences are stored.

---

## 🔄 Processing Pipeline

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
       │ Extract Destination │ (URL, VPA Handle, IP, File Path)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Sentinel Memory™    │ (Check Hashed Payload vs Geofence History)
       └──────┬──────────────┘
              │
              ▼
       ┌─────────────────────┐
       │ Run 20+ Trust Checks│ (Domain Age, Brand Similarity, Blacklists)
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
       │ User Decides │ (Proceed or Leave Safely)
       └──────────────┘
```

---

## 🎙️ Judge Q&A Playbook

### Q1: "How do you know if a QR code is fake?"
> *"A QR code itself is just raw data—you cannot know if an image is fake. SentinelQR evaluates the payment destination and location context. Through Sentinel Memory™, we check whether the payload matches historical trust baselines for that physical location before money leaves the user's account."*

### Q2: "What if a merchant legitimately changes their QR code?"
> *"We avoid overclaiming 'Fake Sticker'. SentinelQR flags a 'Potential QR replacement detected—destination differs from previous trusted scans'. It calculates a confidence score and prompts the user to verify with the shopkeeper."*
