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
  const [showEngineInfo, setShowEngineInfo] = useState(false);
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
      ? "🚨 DANGER — DO NOT PAY"
      : level === "CAUTION"
      ? "⚠️ BE CAREFUL — CHECK FIRST"
      : "✅ LOOKS SAFE TO PAY";

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
          You are paying money to:
        </div>
        <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif", marginBottom: "2px" }}>
          {result.signals.display_name || "Unknown Shop / Person"}
        </div>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "#38BDF8", marginBottom: "12px", wordBreak: "break-all" }}>
          {result.signals.vpa || result.raw_payload}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "0.72rem", background: "rgba(37,99,235,0.1)", color: "#2563EB", padding: "4px 10px", borderRadius: "10px", fontWeight: "700" }}>
            {result.qr_type === "UPI_PAYMENT" ? "UPI Money Payment" : result.qr_type === "WEBSITE_URL" ? "Opens a Website" : result.qr_type === "APK_DOWNLOAD" ? "Tries to Install an App" : "QR Code"}
          </span>
          {result.signals.brand_impersonation && (
            <span style={{ fontSize: "0.72rem", background: "rgba(239,68,68,0.1)", color: "#EF4444", padding: "4px 10px", borderRadius: "10px", fontWeight: "700" }}>
              ⚠️ Fake copy of: {result.signals.brand_impersonation}
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
            <span style={{ fontSize: "0.62rem", color: "var(--text-secondary)", fontWeight: "700" }}>RISK SCORE</span>
          </div>
        </div>

        {/* Decoded Payload Box */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontWeight: "600" }}>QR Code Contents:</span>
            <button
              onClick={() => setShowEngineInfo(true)}
              style={{ background: "none", border: "none", color: "#38BDF8", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
            >
              💡 What does this mean?
            </button>
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
                Check the Amount Before Paying
              </div>
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600" }}>
                SecurePE spotted something unusual
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.84rem", color: "var(--text-main)", lineHeight: "1.45", marginBottom: "10px", fontWeight: "600" }}>
            This QR has already set an amount of <strong>{intent.amount_value ? `₹${intent.amount_value.toLocaleString()}` : "some money"}</strong> that will be charged to you.
          </p>

          <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", background: "rgba(0,0,0,0.05)", padding: "10px 12px", borderRadius: "12px", lineHeight: "1.45" }}>
            💡 <strong>What to do:</strong> Normal shop QR codes do NOT pre-set any amount — you type it yourself. Ask the shopkeeper to confirm this amount before you pay.
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
            The amount <strong>₹{intent.amount_value}</strong> was already set in this QR. SecurePE has verified this is normal for this shop — it matches what other customers paid here before.
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
              Has SecurePE seen this before?
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
              {memory.trust_pattern_mismatch ? "⚠️ Something Changed" : `✅ Seen ${memory.historical_scans_count}x — All Safe`}
            </span>
          </div>

          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "12px" }}>
            {memory.trust_pattern_mismatch
              ? `⚠️ Warning: Other people have scanned a DIFFERENT QR at this location before. The payment address has changed, which is unusual. Please verify with the shopkeeper.`
              : `SecurePE has seen this exact QR code ${memory.historical_scans_count} times before. Every time, it led to the same safe shop. This is a good sign.`
            }
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.04)", borderRadius: "12px", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              🔍 Scanned before: <span style={{ color: "var(--text-main)", fontWeight: "700" }}>{memory.historical_scans_count} times</span>
            </div>
            <div style={{ padding: "10px 12px", background: "rgba(0,0,0,0.04)", borderRadius: "12px", fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>
              📍 Location match: <span style={{ color: "#10B981", fontWeight: "700" }}>{memory.location_match_confidence}%</span>
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
            Why does SecurePE say this?
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

        <div style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "14px", lineHeight: "1.5", padding: "12px 14px", background: level === "HIGH_RISK" ? "rgba(239,68,68,0.08)" : level === "CAUTION" ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)", borderRadius: "14px", borderLeft: `4px solid ${themeColor}` }}>
          {level === "HIGH_RISK"
            ? "🚨 This QR code has multiple warning signs of a scam. SecurePE strongly recommends you do NOT pay."
            : level === "CAUTION"
            ? "⚠️ SecurePE found some unusual things about this QR. It may be fine, but please double-check before paying."
            : "✅ SecurePE checked this QR thoroughly. Everything looks normal. It appears safe to pay."}
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
          {level === "HIGH_RISK"
            ? "⛔ SecurePE says: DO NOT pay. Close this and walk away."
            : level === "CAUTION"
            ? "⚠️ SecurePE says: Ask the shopkeeper to confirm details first."
            : "✅ SecurePE says: Safe to proceed."}
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
              🛡️ Don't pay — stay safe
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
                Why is this risky?
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
                I still want to pay
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
              ✅ Proceed to payment →
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
              🔍 Scan a different QR code
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
                🤔 Why should I be careful?
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

      {/* How SecurePE Works Modal */}
      {showEngineInfo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(2, 6, 23, 0.92)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          className="animate-fade"
        >
          <div
            style={{
              background: "#0F172A",
              borderRadius: "28px",
              padding: "22px 20px",
              maxWidth: "420px",
              width: "100%",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.95)",
              color: "#ffffff",
              maxHeight: "88vh",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <div style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
                  How SecurePE checks a QR code
                </div>
                <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: "600", marginTop: "2px" }}>
                  3 checks happen automatically when you scan
                </div>
              </div>
              <button
                onClick={() => setShowEngineInfo(false)}
                style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1E293B", color: "#94A3B8", border: "1px solid #334155", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Step 1 */}
            <div style={{ background: "#1E293B", borderRadius: "16px", padding: "14px", marginBottom: "8px", borderLeft: "3px solid #38BDF8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(56,189,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#38BDF8" }}>Check 1 — Reads the QR instantly</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {[
                  "Payment QR, website link, or dangerous app download?",
                  "Shop name and payment address look legitimate?",
                  "Pretending to be a bank or famous payment app?",
                  "Amount secretly pre-set without your knowledge?",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.78rem", color: "#94A3B8", lineHeight: "1.45" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="3" style={{ marginTop: "3px", flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: "#1E293B", borderRadius: "16px", padding: "14px", marginBottom: "8px", borderLeft: "3px solid #10B981" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#10B981" }}>Check 2 — Seen before?</div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: "1.55", marginBottom: "8px" }}>
                SecurePE remembers QR codes other users scanned safely. A QR seen many times at the same shop = trusted.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <div style={{ background: "rgba(16,185,129,0.08)", borderRadius: "10px", padding: "8px 10px", fontSize: "0.76rem", color: "#10B981", fontWeight: "700", display: "flex", alignItems: "center", gap: "7px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Same QR seen 142× at this shop — trusted
                </div>
                <div style={{ background: "rgba(239,68,68,0.08)", borderRadius: "10px", padding: "8px 10px", fontSize: "0.76rem", color: "#EF4444", fontWeight: "700", display: "flex", alignItems: "center", gap: "7px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Different QR at same shop location — possible swap
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ background: "#1E293B", borderRadius: "16px", padding: "14px", marginBottom: "12px", borderLeft: "3px solid #A855F7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#A855F7" }}>Check 3 — Community reports</div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#CBD5E1", lineHeight: "1.55" }}>
                If other users flagged this QR as a scam, you are warned immediately — before you pay.
              </div>
            </div>

            {/* Key note */}
            <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: "14px", padding: "12px 14px", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ flexShrink: 0, marginTop: "1px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div style={{ fontSize: "0.79rem", color: "#FDE68A", lineHeight: "1.55" }}>
                <strong style={{ color: "#F59E0B" }}>Never seen this QR?</strong> SecurePE still runs all 3 checks. A brand-new QR is not automatically safe.
              </div>
            </div>

            <button
              onClick={() => setShowEngineInfo(false)}
              style={{ width: "100%", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)", color: "#fff", fontSize: "0.95rem", fontWeight: "800", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

