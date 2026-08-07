"use client";

import React, { useEffect, useState } from "react";
import { ScanResult } from "@/lib/api";
import { ScreenId } from "../BottomNav";

interface RiskResultScreenProps {
  result: ScanResult | null;
  latencyMs: number;
  onNavigate: (target: ScreenId) => void;
  ttsEnabled: boolean;
}

export const RiskResultScreen: React.FC<RiskResultScreenProps> = ({
  result,
  latencyMs,
  onNavigate,
  ttsEnabled,
}) => {
  const [speechActive, setSpeechActive] = useState(false);
  const [showBypassModal, setShowBypassModal] = useState(false);

  useEffect(() => {
    if (result && ttsEnabled && "speechSynthesis" in window) {
      speakText(`${result.explanation.summary}. ${result.explanation.recommended_action}`);
    }
  }, [result, ttsEnabled]);

  useEffect(() => {
    if (showBypassModal) {
      const container = document.querySelector(".screen-container");
      if (container) {
        container.scrollTop = 0;
      }
    }
  }, [showBypassModal]);

  if (!result) return null;

  const score = result.risk_score;
  const level = result.risk_level;
  const memory = result.signals?.sentinel_memory;

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getThemeColor = () => {
    if (score >= 70) return "#EF4444";       /* Critical Danger Red */
    if (score >= 30) return "#F59E0B";       /* Suspicious Orange */
    return "#10B981";                        /* Low Risk Safe Green */
  };

  const getTierLabel = () => {
    if (score >= 70) return "CRITICAL DANGER";
    if (score >= 30) return "SUSPICIOUS";
    return "LOW RISK";
  };

  const themeColor = getThemeColor();
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ padding: "20px 20px 40px 20px", background: "var(--bg-primary)", minHeight: "100dvh", color: "var(--text-main)", position: "relative" }} className="animate-fade">
      {/* 1. Header Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
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
          }}
          title="Back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <h3 style={{ fontSize: "1.15rem", fontWeight: "700", fontFamily: "Poppins, sans-serif" }}>
          Scan Analysis Result
        </h3>

        <div style={{ width: "40px" }} />
      </div>

      {/* 2. Top Risk Status Banner */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "20px",
          background: level === "HIGH_RISK" ? "#FEE2E2" : level === "CAUTION" ? "#FEF3C7" : "#D1FAE5",
          border: `2px solid ${themeColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
          boxShadow: `0 8px 24px ${themeColor}25`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: themeColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 4px 12px ${themeColor}50` }}>
            {level === "HIGH_RISK" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ) : level === "CAUTION" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800", color: themeColor, fontFamily: "Poppins, sans-serif", lineHeight: "1.2" }}>
              {getTierLabel()}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#334155", fontWeight: "600" }}>
              {result.qr_type} Payload Evaluation
            </div>
          </div>
        </div>

        {/* Latency Pill */}
        <span style={{ background: "#0F172A", color: "#38BDF8", border: "1px solid #1E293B", padding: "6px 12px", borderRadius: "14px", fontSize: "0.75rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          {latencyMs}ms
        </span>
      </div>

      {/* 3. Score Gauge & Decoded Payload Section */}
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
        {/* SVG Circular Gauge */}
        <div style={{ position: "relative", width: "88px", height: "88px", flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="35%" stopColor="#84CC16" />
                <stop offset="65%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#EF4444" />
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

      {/* 4. Sentinel Memory™ Privacy-Preserving Trust Graph Card */}
      {memory && (
        <div
          style={{
            background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
            borderRadius: "24px",
            padding: "18px 20px",
            border: "1px solid rgba(6, 182, 212, 0.25)",
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

      {/* 5. Purple AI Reasoning Card (#7C3AED Accent) */}
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

        {/* Reasoning Items with Professional Vector SVG Icons */}
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

        {/* High-Contrast Recommendation Box */}
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

      {/* 6. Bottom Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {level === "HIGH_RISK" ? (
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
              Leave Safely (Recommended)
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={() => onNavigate("report")}
                style={{
                  height: "48px",
                  borderRadius: "16px",
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid #EF4444",
                  color: "#EF4444",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                Report Fraud
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
                Continue Anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate("home")}
              style={{
                width: "100%",
                height: "56px",
                borderRadius: "18px",
                background: "#10B981",
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
              Proceed with Payment
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

      {/* Sleek Custom Warning Bypass Modal Dialog */}
      {showBypassModal && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            background: "rgba(0, 0, 0, 0.88)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            minHeight: "100%",
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
            {/* Warning Shield Icon */}
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
              SentinelQR AI has flagged high-risk scam indicators for this payment destination. Proceeding may result in financial loss or credential theft.
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
                  onNavigate("home");
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
                Confirm Unverified Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
