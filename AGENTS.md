# SentinelQR — Autonomous Agent & Engineering Guidelines
**Framework Integration**: Ponytail Token Ruleset + gstack 23-Tool Engineering Stack

---

## 1. Ponytail Token Minimization & Code Rules
* **High Information Density**: Eliminate verbose boilerplate, redundant abstractions, and dead code.
* **Deterministic Risk Engine**: The 0–100 risk score calculation is strictly deterministic in `backend/main.py`. AI agents (Gemini XAI) must NEVER alter or override the computed score.
* **80/20 High Leverage**: Prioritize features that directly increase user safety and prevent money loss (< 2s scan SLA, geofenced sticker tamper check, Voice TTS).

---

## 2. gstack Engineering Workflow Commands

* **CEO Review (`/plan-ceo-review`)**: Evaluate product vision, painkiller positioning, and TAM market opportunity.
* **Engineering Review (`/plan-eng-review`)**: Verify API SLAs, FastAPI async throughput, and Supabase PostGIS schemas.
* **QA & Test Suite (`python scripts/gstack_qa.py`)**: Automated execution of backend unittests, endpoint health checks, and API latency measurements.
* **Pre-Flight Ship (`python scripts/gstack_ship.py`)**: Automated release readiness verification, git clean checks, and deployment verification.
