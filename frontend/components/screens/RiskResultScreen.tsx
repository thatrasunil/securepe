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

  useEffect(() => {
    if (result && ttsEnabled && "speechSynthesis" in window) {
      speakText(`${result.explanation.summary}. ${result.explanation.recommended_action}`);
    }
  }, [result, ttsEnabled]);

  if (!result) return null;

  const score = result.risk_score;
  const level = result.risk_level;

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
    if (score >= 70) return "#dc2626";       /* Danger Red */
    if (score >= 50) return "#f97316";       /* Orange */
    if (score >= 30) return "#eab308";       /* Amber */
    if (score >= 15) return "#84cc16";       /* Lime */
    return "#22c55e";                        /* Safe Green */
  };

  const themeColor = getThemeColor();
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={{ padding: "clamp(16px, 4vw, 24px)" }} className="animate-fade">
      {/* Risk Banner */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: "20px",
          background: level === "HIGH_RISK" ? "var(--color-danger-bg)" : level === "CAUTION" ? "var(--color-caution-bg)" : "var(--color-safe-bg)",
          border: `1px solid ${themeColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: themeColor, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {level === "HIGH_RISK" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            ) : level === "CAUTION" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: "700", color: themeColor }}>
              {level.replace("_", " ")}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {result.qr_type} Payload Evaluation
            </div>
          </div>
        </div>

        <span className="badge" style={{ background: "rgba(0,0,0,0.3)", color: "var(--accent-cyan)", border: "1px solid rgba(6, 182, 212, 0.3)", display: "flex", alignItems: "center", gap: "4px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          {latencyMs}ms
        </span>
      </div>

      {/* Score Gauge & Decoded String */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid var(--bg-card-border)",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* SVG Circular Gauge with Risk Gradient */}
        <div style={{ position: "relative", width: "90px", height: "90px" }}>
          <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="25%" stopColor="#84cc16" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
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
              fontWeight: "700",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span style={{ fontSize: "1.4rem", color: themeColor, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>/100 RISK</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "4px" }}>Decoded Payload String:</div>
          <code
            style={{
              display: "block",
              fontSize: "0.78rem",
              background: "rgba(0,0,0,0.3)",
              padding: "8px 10px",
              borderRadius: "10px",
              color: "var(--accent-cyan)",
              fontFamily: "var(--font-mono)",
              wordBreak: "break-all",
            }}
          >
            {result.raw_payload}
          </code>
        </div>
      </div>

      {/* Purple AI Reasoning Card (#7C3AED Accent) */}
      <div
        style={{
          background: "var(--ai-card-bg)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--accent-purple)", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            AI Security Reasoning
          </h4>
          <button
            onClick={() => speakText(`${result.explanation.summary}. ${result.explanation.recommended_action}`)}
            style={{
              padding: "4px 12px",
              borderRadius: "10px",
              background: speechActive ? "rgba(124, 58, 237, 0.4)" : "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.4)",
              color: "var(--accent-purple)",
              fontSize: "0.75rem",
              fontWeight: "600",
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

        <div style={{ fontSize: "0.88rem", fontWeight: "600", color: "var(--text-main)", marginBottom: "12px" }}>
          {result.explanation.summary}
        </div>

        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {result.explanation.reasons.map((r, idx) => (
            <li
              key={idx}
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                padding: "10px 12px",
                background: "var(--ai-reasoning-bg)",
                borderRadius: "10px",
                borderLeft: `3px solid var(--accent-purple)`,
                lineHeight: "1.4",
              }}
            >
              {r}
            </li>
          ))}
        </ul>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.05)",
            fontSize: "0.85rem",
            fontWeight: "600",
            color: "var(--accent-cyan)",
          }}
        >
          Recommendation: {result.explanation.recommended_action}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {level === "HIGH_RISK" ? (
          <>
            <button className="btn-primary" onClick={() => onNavigate("home")}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              Leave Safely (Recommended)
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button className="btn-danger" onClick={() => onNavigate("report")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                Report Fraud
              </button>
              <button
                className="btn-secondary"
                onClick={() => alert("Warning: Proceeding with unverified transaction.")}
                style={{ fontSize: "0.82rem" }}
              >
                Continue Anyway
              </button>
            </div>
          </>
        ) : (
          <>
            <button className="btn-success" onClick={() => onNavigate("home")}>
              Proceed with Payment
            </button>
            <button className="btn-secondary" onClick={() => onNavigate("report")}>
              Report Issue
            </button>
          </>
        )}
      </div>
    </div>
  );
};
