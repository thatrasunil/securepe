"""
SentinelQR Master Documentation Compiler
Concatenates all 14 master documentation artifacts into a unified,
publication-ready master markdown file: SentinelQR_Master_Documentation_Suite.md
"""

import os

ARTIFACT_DIR = r"C:\Users\thatr\.gemini\antigravity\brain\2942d4b5-f6fe-4bb8-892d-27587f1ee29c"
OUTPUT_FILE = r"D:\SSN-university\sentinelqr\SentinelQR_Master_Documentation_Suite.md"

DOC_FILES_ORDER = [
    "doc1_prd.md",
    "doc2_trd.md",
    "doc3_srs.md",
    "doc4_sdd.md",
    "doc5_api.md",
    "doc6_database.md",
    "07_AI_ENGINE.md",
    "08_UI_UX.md",
    "09_TESTING.md",
    "10_DEVOPS.md",
    "doc8_business_gtm.md",
    "12_PITCH_GUIDE.md",
    "13_STRATEGY_BLUE_OCEAN_PAINKILLER.md",
    "14_SYSTEM_DESIGN_ARCHITECTURE.md"
]

def compile_docs():
    print("[*] Compiling SentinelQR Master Documentation Suite...")
    compiled_content = []
    
    header = """# SentinelQR — Complete Master Product & Engineering Suite
**Project**: SentinelQR – AI Fraud Shield for Secure QR Payments
**Tagline**: *Think Before You Scan.*
**Date**: August 2026

---

## Master Table of Contents
1. Product Requirements Document (PRD)
2. Technical Requirements Document (TRD)
3. Software Requirements Specification (SRS - IEEE 830)
4. System Design Document (SDD)
5. REST API Endpoint Specifications
6. Supabase PostgreSQL & PostGIS Database DDL
7. Gemini 1.5 Flash AI Engine & XAI Guidelines
8. Enterprise Cyber Trust UI/UX Design System & 16-Screen State Machine Specs
9. Comprehensive Testing & Pen-Test QA Plan
10. DevOps, CI/CD Pipeline & Docker Infrastructure
11. Business Model, TAM/SAM/SOM & GTM Strategy
12. Hackathon 5-Minute Pitch & Judge Q&A Guide
13. Painkiller Blue Ocean Strategy & Ponytail 80/20 Efficiency
14. Master System Design Architecture (HLD & LLD Blueprint)

---
\n"""
    compiled_content.append(header)

    for doc_name in DOC_FILES_ORDER:
        file_path = os.path.join(ARTIFACT_DIR, doc_name)
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                compiled_content.append(f"\n\n<!-- PAGE BREAK: {doc_name} -->\n\n")
                compiled_content.append(content)
                print(f"[+] Appended: {doc_name}")
        else:
            print(f"[-] Warning: File not found: {file_path}")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("\n".join(compiled_content))

    print(f"\n[SUCCESS] Master Documentation Suite compiled to:\n{OUTPUT_FILE}")

if __name__ == "__main__":
    compile_docs()
