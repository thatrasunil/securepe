"use client";

import React, { useEffect, useState } from "react";
import { analyzeScan, ScanResult } from "@/lib/api";
import { ScreenId } from "../BottomNav";

interface ProcessingScreenProps {
  payload: string;
  onNavigate: (target: ScreenId) => void;
  onAnalysisDone: (result: ScanResult, latencyMs: number) => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  payload,
  onNavigate,
  onAnalysisDone,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Detecting QR Payload",
    "Checking Merchant Database",
    "Checking Community Fraud Feed",
    "Analyzing Threat Signals",
    "Generating XAI Explanation",
  ];

  useEffect(() => {
    let isMounted = true;
    
    const runAnimation = async () => {
      for (let i = 0; i < steps.length; i++) {
        if (!isMounted) return;
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, 350));
      }

      if (!isMounted) return;
      const { data, latencyMs } = await analyzeScan(payload);
      onAnalysisDone(data, latencyMs);
      onNavigate("result");
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, [payload, onAnalysisDone, onNavigate]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        textAlign: "center",
      }}
      className="animate-fade"
    >
      <div
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "28px",
          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          marginBottom: "32px",
          boxShadow: "0 0 36px rgba(37, 99, 235, 0.5)",
          animation: "pulseGlow 1.5s infinite ease-in-out",
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>

      <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "8px" }}>
        AI Threat Analysis
      </h2>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "32px" }}>
        Evaluating payment risk & fraud signatures in real time...
      </p>

      <div style={{ width: "100%", maxWidth: "320px", display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
        {steps.map((stepLabel, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 16px",
                borderRadius: "14px",
                background: isCurrent
                  ? "rgba(37, 99, 235, 0.15)"
                  : isDone
                  ? "var(--color-safe-bg)"
                  : "rgba(255, 255, 255, 0.03)",
                border: isCurrent
                  ? "1px solid var(--accent-cyan)"
                  : isDone
                  ? "1px solid rgba(16, 185, 129, 0.3)"
                  : "1px solid var(--bg-card-border)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  background: isDone ? "var(--color-safe)" : isCurrent ? "var(--accent-blue)" : "rgba(255,255,255,0.08)",
                  color: "#fff",
                }}
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isCurrent ? (
                  <div style={{ width: "12px", height: "12px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                ) : (
                  idx + 1
                )}
              </div>

              <span
                style={{
                  fontSize: "0.88rem",
                  fontWeight: isCurrent ? "600" : "500",
                  color: isDone ? "var(--color-safe)" : isCurrent ? "#f8fafc" : "var(--text-secondary)",
                }}
              >
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
