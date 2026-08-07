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
    <div style={{ padding: "20px 20px 40px 20px", background: "var(--bg-primary)", minHeight: "100dvh", color: "var(--text-main)" }} className="animate-fade">

      {/* 1. Header Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "var(--text-main)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", fontFamily: "Poppins, sans-serif" }}>
          Verified Merchant Details
        </h2>
      </div>

      {/* 2. Top Verified Merchant Status Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)",
          borderRadius: "24px",
          padding: "24px 20px",
          border: "2px solid #10B981",
          boxShadow: "0 10px 28px rgba(16, 185, 129, 0.15)",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {/* Verified Badge Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background: "#10B981",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px auto",
            boxShadow: "0 0 24px rgba(16, 185, 129, 0.4)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0F172A", marginBottom: "4px", fontFamily: "Poppins, sans-serif" }}>
          Ramesh Chai Corner
        </h3>

        <div className="font-mono" style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "700", marginBottom: "12px" }}>
          ramesh.chai@upi • ID #MCH-8821
        </div>

        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: "700",
            padding: "5px 12px",
            borderRadius: "14px",
            background: "rgba(16, 185, 129, 0.15)",
            color: "#059669",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          98% Safety Confidence Score
        </span>
      </div>

      {/* 3. Security Verification Specs Section */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid var(--bg-card-border)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "24px",
        }}
      >
        <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "14px", fontFamily: "Poppins, sans-serif" }}>
          Security Verification Specs
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Spec 1: Geofence */}
          <div style={{ padding: "14px 16px", background: "var(--bg-primary)", borderRadius: "16px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "4px" }}>
              Geofence Baseline
            </div>
            <div style={{ fontSize: "0.88rem", color: "#10B981", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              MG Road Stand (12.9716, 77.5946) — 100% Match
            </div>
          </div>

          {/* Spec 2: Sticker Protection */}
          <div style={{ padding: "14px 16px", background: "var(--bg-primary)", borderRadius: "16px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "4px" }}>
              Sticker Tamper Protection
            </div>
            <div style={{ fontSize: "0.88rem", color: "#10B981", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Hardware Stand Baseline Active & Guarded
            </div>
          </div>

          {/* Spec 3: Customer Scans */}
          <div style={{ padding: "14px 16px", background: "var(--bg-primary)", borderRadius: "16px", border: "1px solid var(--bg-card-border)" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "4px" }}>
              Customer Scans Today
            </div>
            <div style={{ fontSize: "0.88rem", color: "var(--text-main)", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              142 Scans (Zero Fraud Reports)
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action CTA Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={() => onNavigate("scanner")}
          style={{
            width: "100%",
            height: "54px",
            borderRadius: "18px",
            background: "#10B981",
            color: "#ffffff",
            fontSize: "1rem",
            fontWeight: "800",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <path d="M14 14h3v3h-3z" />
          </svg>
          Scan Merchant QR Code
        </button>

        <button
          onClick={() => onNavigate("report")}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "16px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid #EF4444",
            color: "#EF4444",
            fontSize: "0.88rem",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Report Issue with Merchant
        </button>
      </div>
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
    <div style={{ padding: "20px 20px 40px 20px", background: "var(--bg-primary)", minHeight: "100dvh", color: "var(--text-main)" }} className="animate-fade">
      {/* Header Bar */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "var(--text-main)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", fontFamily: "Poppins, sans-serif" }}>
          Broadcast Fraud Report
        </h2>
      </div>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px auto", boxShadow: "0 0 20px rgba(16,185,129,0.3)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "8px", fontFamily: "Poppins, sans-serif" }}>Report Broadcasted!</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "24px", lineHeight: "1.5" }}>
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
            <label style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
              Target Payload / Address
            </label>
            <input
              className="input-field font-mono"
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              style={{ fontSize: "0.9rem", padding: "14px 16px", borderRadius: "16px" }}
              required
            />
          </div>

          {/* Scam Category Dropdown */}
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
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
                fontSize: "0.9rem",
                fontWeight: "600",
                height: "52px",
                borderRadius: "16px",
                padding: "0 16px",
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
            <label style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
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
                fontSize: "0.88rem",
                lineHeight: "1.4",
                resize: "none",
                background: "var(--bg-card)",
                color: "var(--text-main)",
                border: "1px solid var(--bg-card-border)",
                borderRadius: "16px",
              }}
            />
          </div>

          {/* Photo Evidence Attachment Box */}
          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "600", display: "block", marginBottom: "8px" }}>
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
                color: hasPhoto ? "#10B981" : "var(--text-secondary)",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.85rem",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              {hasPhoto ? "Photo Attached (qr_sticker_photo.jpg)" : "+ Upload Photo of QR Sticker"}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-danger" style={{ marginTop: "10px", height: "54px", fontSize: "1rem", borderRadius: "18px" }}>
            Broadcast Fraud Report
          </button>
        </form>
      )}
    </div>
  );
};
