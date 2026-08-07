"use client";

import React, { useState } from "react";
import { submitFraudReport } from "@/lib/api";
import { ScreenId } from "../BottomNav";

interface ScreenProps {
  onNavigate: (target: ScreenId) => void;
  scannedPayload?: string;
}

export const MerchantScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: "20px 20px 120px 20px" }} className="animate-fade">
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--bg-card-border)",
            color: "var(--text-main)",
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "700" }}>Verified Merchant Details</h2>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, var(--color-safe-bg), var(--bg-card))",
          borderRadius: "var(--card-radius)",
          padding: "24px",
          border: "1px solid rgba(16, 185, 129, 0.4)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "24px",
            background: "var(--color-safe)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px auto",
            boxShadow: "0 0 25px rgba(16, 185, 129, 0.5)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        </div>

        <h3 style={{ fontSize: "1.45rem", fontWeight: "700", marginBottom: "4px" }}>
          Ramesh Chai Corner
        </h3>

        <div className="font-mono" style={{ fontSize: "0.9rem", color: "var(--color-safe)", fontWeight: "600", marginBottom: "12px" }}>
          ramesh.chai@upi • ID #MCH-8821
        </div>

        <span className="badge badge-safe">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          98% Safety Confidence Score
        </span>
      </div>

      <div style={{ background: "var(--bg-card)", borderRadius: "var(--card-radius)", padding: "18px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)", marginBottom: "24px" }}>
        <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>Security Verification Specs</h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "12px", background: "rgba(0,0,0,0.06)", borderRadius: "14px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Geofence Baseline</div>
            <div style={{ fontSize: "0.88rem", color: "var(--color-safe)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              MG Road Stand (12.9716, 77.5946) — 100% Match
            </div>
          </div>

          <div style={{ padding: "12px", background: "rgba(0,0,0,0.06)", borderRadius: "14px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Sticker Tamper Protection</div>
            <div style={{ fontSize: "0.88rem", color: "var(--color-safe)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Hardware Stand Baseline Active & Guarded
            </div>
          </div>

          <div style={{ padding: "12px", background: "rgba(0,0,0,0.06)", borderRadius: "14px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Customer Scans Today</div>
            <div style={{ fontSize: "0.88rem", fontWeight: "700" }}>
              142 Scans (Zero Fraud Reports)
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => onNavigate("scanner")}>
        Scan Merchant QR Code
      </button>
    </div>
  );
};

export const ReportFraudScreen: React.FC<ScreenProps> = ({ onNavigate, scannedPayload }) => {
  const [payload, setPayload] = useState(scannedPayload || "paytm-support@ybl");
  const [category, setCategory] = useState("IMPOSTER_PAYMENT");
  const [notes, setNotes] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFraudReport(payload, category, notes);
    setSubmitted(true);
  };

  return (
    <div style={{ padding: "20px 20px 120px 20px" }} className="animate-fade">
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--bg-card-border)",
            color: "var(--text-main)",
            width: "42px",
            height: "42px",
            borderRadius: "14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "700" }}>Broadcast Fraud Report</h2>
      </div>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--color-safe-bg)", color: "var(--color-safe)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "8px" }}>Report Broadcasted!</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "24px", lineHeight: "1.5" }}>
            Your report has been broadcasted to all SentinelQR clients to shield the community.
          </p>
          <button className="btn-primary" onClick={() => onNavigate("home")}>
            Back to Home
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Target Payload Field */}
          <div>
            <label style={{ fontSize: "0.88rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Target Payload / Address
            </label>
            <input
              className="input-field font-mono"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{ fontSize: "0.95rem" }}
              required
            />
          </div>

          {/* Scam Category Dropdown */}
          <div>
            <label style={{ fontSize: "0.88rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Scam Category
            </label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                background: "var(--bg-card)",
                color: "var(--text-main)",
                border: "1px solid var(--bg-card-border)",
                fontSize: "0.92rem",
                fontWeight: "600",
                height: "52px",
                borderRadius: "16px",
              }}
            >
              <option value="IMPOSTER_PAYMENT">Imposter Merchant / Support Sticker</option>
              <option value="PHISHING_URL">Phishing / Credential Harvesting URL</option>
              <option value="MALICIOUS_APK">Direct APK / Malware Download</option>
              <option value="OTHER_FRAUD">Other Fraudulent Activity</option>
            </select>
          </div>

          {/* Additional Notes */}
          <div>
            <label style={{ fontSize: "0.88rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Additional Details / Location Notes
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Where was this QR found? (e.g. Sticker pasted over tea shop QR code)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                height: "110px",
                padding: "14px 16px",
                fontSize: "0.9rem",
                lineHeight: "1.4",
                resize: "none",
                background: "var(--bg-card)",
                color: "var(--text-main)",
                border: "1px solid var(--bg-card-border)",
              }}
            />
          </div>

          {/* Photo Evidence Attachment Box */}
          <div>
            <label style={{ fontSize: "0.88rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Attach Photo Evidence (Optional)
            </label>
            <div
              onClick={() => setHasPhoto(!hasPhoto)}
              style={{
                padding: "16px",
                borderRadius: "16px",
                background: "var(--bg-card)",
                border: "2px dashed var(--bg-card-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: hasPhoto ? "var(--color-safe)" : "var(--text-muted)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.88rem",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {hasPhoto ? "Photo Attached ✓ (qr_sticker_photo.jpg)" : "+ Upload Photo of QR Sticker"}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-danger" style={{ marginTop: "10px", height: "56px", fontSize: "1rem" }}>
            Broadcast Fraud Report
          </button>
        </form>
      )}
    </div>
  );
};
