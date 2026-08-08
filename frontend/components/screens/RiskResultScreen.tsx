"use client";

import React, { useState, useEffect, useRef } from "react";
import { ScreenId } from "../BottomNav";
import { ScanResult } from "@/lib/api";

interface RiskResultScreenProps {
  result: ScanResult | null;
  onNavigate: (target: ScreenId) => void;
}

export const RiskResultScreen: React.FC<RiskResultScreenProps> = ({ result, onNavigate }) => {
  const [speechActive, setSpeechActive] = useState(false);
  const [showBypassModal, setShowBypassModal] = useState(false);
  const [showWhySheet, setShowWhySheet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top immediately when screen mounts or modal opens
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [showBypassModal, showWhySheet]);

  if (!result) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <h3>No scan result available</h3>
        <button className="btn-primary" onClick={() => onNavigate("scanner")} style={{ marginTop: "16px" }}>
          Back to Scanner
        </button>
      </div>
    );
  }

  const score = result.risk_score;
  const level = result.risk_level;
  const intent = result.signals?.payment_intent;
  const memory = result.signals?.sentinel_memory;

  // Modern Color Palette mapping
  const themeColor =
    level === "HIGH_RISK" ? "#EF4444" : level === "CAUTION" ? "#F59E0B" : "#10B981";

  const badgeBg =
    level === "HIGH_RISK"
      ? "rgba(239, 68, 68, 0.15)"
      : level === "CAUTION"
      ? "rgba(245, 158, 11, 0.15)"
      : "rgba(16, 185, 129, 0.15)";

  const badgeBorder =
    level === "HIGH_RISK"
      ? "rgba(239, 68, 68, 0.3)"
      : level === "CAUTION"
      ? "rgba(245, 158, 11, 0.3)"
      : "rgba(16, 185, 129, 0.3)";

  const statusLabel =
    level === "HIGH_RISK"
      ? "HIGH RISK (CRITICAL SCAM DANGER)"
      : level === "CAUTION"
      ? "CAUTION (POTENTIAL UNVERIFIED THREAT)"
      : "SAFE & VERIFIED DESTINATION";

  // Speech Synthesizer
  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    if (speechActive) {
      window.speechSynthesis.cancel();
      setSpeechActive(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);
    setSpeechActive(true);
    window.speechSynthesis.speak(utterance);
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      ref={containerRef}
      style={{
        padding: "20px 20px 140px 20px",
        position: "relative",
        minHeight: "100dvh",
        background: level === "HIGH_RISK" ? "radial-gradient(circle at 50% 0%, #1a0505 0%, var(--bg-app) 100%)" : "var(--bg-app)",
      }}
      className="animate-fade"
    >
      {/* 1. Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--bg-card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-main)",
            cursor: "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>

        <span
          style={{
            background: badgeBg,
            color: themeColor,
            border: `1px solid ${badgeBorder}`,
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "0.78rem",
            fontWeight: "800",
            letterSpacing: "0.03em",
          }}
        >
          {statusLabel}
        </span>

        <button
          onClick={() => speakText(`${statusLabel}. Risk Score ${score} out of 100. ${result.explanation.summary}`)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: speechActive ? "rgba(37, 99, 235, 0.2)" : "var(--bg-card)",
            border: speechActive ? "1px solid #2563EB" : "1px solid var(--bg-card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: speechActive ? "#2563EB" : "var(--text-main)",
            cursor: "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
        </button>
      </div>

      {/* 2. Merchant & VPA Headline Box */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "20px",
          border: `1px solid ${badgeBorder}`,
          boxShadow: "var(--card-shadow)",
          marginBottom: "18px",
        }}
      >
        <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
          Target Merchant / Destination
        </div>
        <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif", marginBottom: "2px" }}>
          {result.signals.display_name || "Unverified Merchant"}
        </div>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "#38BDF8", marginBottom: "12px", wordBreak: "break-all" }}>
          {result.signals.vpa || result.raw_payload}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563EB", padding: "4px 10px", borderRadius: "10px", fontWeight: "700" }}>
            Protocol: {result.qr_type}
          </span>
          {result.signals.brand_impersonation && (
            <span style={{ fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "4px 10px", borderRadius: "10px", fontWeight: "700" }}>
              ⚠️ Imposter: {result.signals.brand_impersonation}
            </span>
          )}
        </div>
      </div>

      {/* 3. Radial Risk Meter Card */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid var(--bg-card-border)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "18px",
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
          <svg width="90" height="90" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
            <defs>
              <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={themeColor} />
                <stop offset="100%" stopColor={`${themeColor}dd`} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#riskGrad)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "800",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ fontSize: "1.45rem", color: themeColor, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "0.62rem", color: "var(--text-secondary)", fontWeight: "700" }}>/100 RISK</span>
          </div>
        </div>

        {/* Decoded Payload Box */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "6px" }}>
            Decoded Payload String:
          </div>
          <code
            style={{
              display: "block",
              fontSize: "0.78rem",
              background: "#0F172A",
              color: "#38BDF8",
              padding: "10px 12px",
              borderRadius: "12px",
              border: "1px solid #1E293B",
              fontFamily: "var(--font-mono)",
              wordBreak: "break-all",
              lineHeight: "1.4",
            }}
          >
            {result.raw_payload}
          </code>
        </div>
      </div>

      {/* 4. Signal #8: Smart Payment Intent Analysis Warning Card (Only for CAUTION or HIGH_RISK) */}
      {intent?.is_suspicious_static_prefill && level !== "SAFE" && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.12) 100%)",
            borderRadius: "24px",
            padding: "18px 20px",
            border: "1.5px solid #F59E0B",
            marginBottom: "18px",
            boxShadow: "0 8px 20px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "#F59E0B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <div>
              <div style={{ fontSize: "0.98rem", fontWeight: "800", color: "#F59E0B", fontFamily: "Poppins, sans-serif" }}>
                Review Payment Details
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                Payment Intent Validation Engine (Signal #8)
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.84rem", color: "var(--text-main)", lineHeight: "1.45", marginBottom: "10px", fontWeight: "600" }}>
            This QR contains an unexpected pre-filled payment amount ({intent.amount_value ? `₹${intent.amount_value.toLocaleString()}` : "Set Amount"}).
          </p>

          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", background: "rgba(0,0,0,0.05)", padding: "10px 12px", borderRadius: "12px", lineHeight: "1.45" }}>
            💡 <strong>Security Note:</strong> Static merchant QR codes commonly require customers to enter the amount manually. Please verify the amount with the merchant before proceeding.
          </div>
        </div>
      )}

      {/* SAFE Tier Pre-filled Amount Chip */}
      {level === "SAFE" && intent?.has_prefilled_amount && (
        <div
          style={{
            background: "rgba(16, 185, 129, 0.08)",
            borderRadius: "18px",
            padding: "12px 16px",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-main)", fontWeight: "600" }}>
            Payment amount <strong>₹{intent.amount_value}</strong> is pre-filled & verified for shop billing.
          </div>
        </div>
      )}

      {/* 5. Sentinel Memory™ Card */}
      {memory && (
        <div
          style={{
            background: "var(--bg-card)",
            borderRadius: "24px",
            padding: "18px 20px",
            border: "1px solid var(--bg-card-border)",
            boxShadow: "var(--card-shadow)",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0284c7", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Poppins, sans-serif" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Sentinel Memory™ Trust Graph
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: "700",
                padding: "4px 10px",
                borderRadius: "12px",
                background: memory.trust_pattern_mismatch ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
                color: memory.trust_pattern_mismatch ? "#EF4444" : "#10B981",
                border: memory.trust_pattern_mismatch ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(16,185,129,0.3)",
              }}
            >
              {memory.trust_pattern_mismatch ? "Pattern Mismatch" : "Trust Match 98%"}
            </span>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.45", marginBottom: "12px" }}>
            Privacy-preserving historical trust model for this location based on {memory.historical_scans_count} previous user scans.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ padding: "8px 10px", background: "rgba(0,0,0,0.04)", borderRadius: "10px", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
              Payload Hash: <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-main)", fontWeight: "700" }}>{memory.payload_hash}</span>
            </div>
            <div style={{ padding: "8px 10px", background: "rgba(0,0,0,0.04)", borderRadius: "10px", fontSize: "0.72rem", color: "var(--text-secondary)" }}>
              Location Confidence: <span style={{ color: "#10B981", fontWeight: "700" }}>{memory.location_match_confidence}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI Reasoning Card */}
      <div
        style={{
          background: "rgba(124, 58, 237, 0.08)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid rgba(124, 58, 237, 0.25)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#7C3AED", display: "flex", alignItems: "center", gap: "8px", fontFamily: "Poppins, sans-serif" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            AI Security Reasoning
          </h4>
          <button
            onClick={() => speakText(`${result.explanation.summary}. ${result.explanation.recommended_action}`)}
            style={{
              padding: "5px 12px",
              borderRadius: "12px",
              background: speechActive ? "rgba(124, 58, 237, 0.3)" : "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              color: "#7C3AED",
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            {speechActive ? "Speaking..." : "Listen"}
          </button>
        </div>

        <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "14px", lineHeight: "1.4" }}>
          {result.explanation.summary}
        </div>

        {/* Reasoning Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "18px" }}>
          {result.explanation.reasons.map((r, idx) => {
            const cleanText = r.replace(/^[\u26A0\u2713\uFE0F\s]+/, "");
            const isDangerReason = level === "HIGH_RISK" || level === "CAUTION";

            return (
              <div
                key={idx}
                style={{
                  fontSize: "0.84rem",
                  color: "var(--text-main)",
                  padding: "12px 14px",
                  background: "rgba(255, 255, 255, 0.85)",
                  borderRadius: "14px",
                  borderLeft: isDangerReason ? "4px solid #EF4444" : "4px solid #10B981",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  lineHeight: "1.45",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: isDangerReason ? "#FEE2E2" : "#D1FAE5",
                    color: isDangerReason ? "#EF4444" : "#10B981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  {isDangerReason ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span>{cleanText}</span>
              </div>
            );
          })}
        </div>

        {/* Recommendation Box */}
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "16px",
            background: themeColor,
            color: "#ffffff",
            fontSize: "0.9rem",
            fontWeight: "800",
            boxShadow: `0 6px 18px ${themeColor}40`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          Recommendation: {result.explanation.recommended_action}
        </div>
      </div>

      {/* 7. Bottom Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {level === "HIGH_RISK" || level === "CAUTION" ? (
          <>
            <button
              onClick={() => onNavigate("home")}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "18px",
                background: "#EF4444",
                color: "#ffffff",
                fontSize: "1.05rem",
                fontWeight: "800",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              Cancel Payment (Recommended)
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={() => setShowWhySheet(true)}
                style={{
                  height: "48px",
                  borderRadius: "16px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid #F59E0B",
                  color: "#F59E0B",
                  fontSize: "0.88rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                Review Why
              </button>

              <button
                onClick={() => setShowBypassModal(true)}
                style={{
                  height: "48px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "var(--text-secondary)",
                  fontSize: "0.84rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Proceed Anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate("payment_review")}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "18px",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                color: "#ffffff",
                fontSize: "1.05rem",
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
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Proceed to Payment →
            </button>

            <button
              onClick={() => onNavigate("scanner")}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "16px",
                background: "rgba(37, 99, 235, 0.12)",
                border: "1px solid #2563EB",
                color: "#2563EB",
                fontSize: "0.9rem",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              Scan Another QR
            </button>
          </>
        )}
      </div>

      {/* Why are we warning you? Bottom Sheet */}
      {showWhySheet && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(2, 6, 23, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
          className="animate-fade"
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#0F172A",
              borderTopLeftRadius: "28px",
              borderTopRightRadius: "28px",
              padding: "24px 20px 36px 20px",
              border: "1.5px solid #F59E0B",
              color: "#ffffff",
              boxShadow: "0 -20px 50px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "#F59E0B", fontFamily: "Poppins, sans-serif" }}>
                Why are we warning you?
              </div>
              <button
                onClick={() => setShowWhySheet(false)}
                style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1E293B", color: "#fff", border: "none", cursor: "pointer", fontWeight: "800" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ background: "#1E293B", padding: "12px 14px", borderRadius: "14px", borderLeft: "4px solid #F59E0B" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#F59E0B", marginBottom: "2px" }}>
                  ⚠️ Pre-filled Payment Amount
                </div>
                <div style={{ fontSize: "0.78rem", color: "#CBD5E1", lineHeight: "1.4" }}>
                  {intent?.amount_value ? `₹${intent.amount_value}` : "An amount"} is already pre-set in the QR code. Static shop QR stands typically ask customers to type the amount manually.
                </div>
              </div>

              <div style={{ background: "#1E293B", padding: "12px 14px", borderRadius: "14px", borderLeft: "4px solid #38BDF8" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#38BDF8", marginBottom: "2px" }}>
                  ⚠️ Merchant Pattern Mismatch
                </div>
                <div style={{ fontSize: "0.78rem", color: "#CBD5E1", lineHeight: "1.4" }}>
                  This payment request structure resembles a static printed sticker rather than a dynamic POS bill terminal.
                </div>
              </div>

              <div style={{ background: "#1E293B", padding: "12px 14px", borderRadius: "14px", borderLeft: "4px solid #EF4444" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#EF4444", marginBottom: "2px" }}>
                  ⚠️ Missing Transaction Reference
                </div>
                <div style={{ fontSize: "0.78rem", color: "#CBD5E1", lineHeight: "1.4" }}>
                  No dynamic transaction reference code was attached to validate payment intent.
                </div>
              </div>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(16,185,129,0.12)", border: "1px solid #10B981", color: "#10B981", fontSize: "0.78rem", fontWeight: "700", textAlign: "center", marginBottom: "16px" }}>
              💡 Recommendation: Verify the amount with the merchant before proceeding.
            </div>

            <button
              onClick={() => setShowWhySheet(false)}
              style={{ width: "100%", height: "48px", borderRadius: "14px", background: "#2563EB", color: "#fff", fontSize: "0.95rem", fontWeight: "700", border: "none", cursor: "pointer" }}
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Sleek Custom Warning Bypass Modal Dialog */}
      {showBypassModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#1A2233",
              borderRadius: "28px",
              padding: "24px",
              maxWidth: "360px",
              width: "100%",
              border: "1px solid rgba(239, 68, 68, 0.4)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              textAlign: "center",
            }}
            className="animate-scale-up"
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.18)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px auto",
                boxShadow: "0 0 24px rgba(239, 68, 68, 0.4)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#f8fafc", marginBottom: "8px", fontFamily: "Poppins, sans-serif" }}>
              Unverified Transaction Warning
            </h3>

            <p style={{ fontSize: "0.85rem", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "20px" }}>
              SecurePe AI has flagged high-risk scam indicators for this payment destination. Proceeding may result in financial loss.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => setShowBypassModal(false)}
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "16px",
                  background: "#10B981",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel & Return Safely (Recommended)
              </button>

              <button
                onClick={() => {
                  setShowBypassModal(false);
                  onNavigate("payment_review");
                }}
                style={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "14px",
                  background: "transparent",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#EF4444",
                  fontSize: "0.84rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Confirm & Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
