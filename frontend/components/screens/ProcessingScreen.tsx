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
  const [phase, setPhase] = useState<"processing" | "complete" | "redirecting">("processing");
  const [activeStep, setActiveStep] = useState(0);

  const checklist = [
    "Decoding QR Payload",
    "Analyzing Payment Destination",
    "Checking Multi-Signal Risk Engine",
    "Querying Community Fraud Feed",
    "Generating XAI Explanation",
  ];

  useEffect(() => {
    let isMounted = true;

    const runProcessingPipeline = async () => {
      const { data, latencyMs } = await analyzeScan(payload);
      if (!isMounted) return;
      onAnalysisDone(data, latencyMs);
      onNavigate("result");
    };

    runProcessingPipeline();

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
        background: "#0B1320",
        color: "#f8fafc",
      }}
      className="animate-fade"
    >
      {/* 4. Processing Phase */}
      {phase === "processing" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="animate-fade">
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.15)",
              border: "2px solid #2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563EB",
              marginBottom: "28px",
              boxShadow: "0 0 40px rgba(37, 99, 235, 0.4)",
              animation: "pulseGlow 1.5s infinite ease-in-out",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <h2 style={{ fontSize: "1.35rem", fontWeight: "600", marginBottom: "8px", fontFamily: "Poppins, sans-serif" }}>
            AI Analysis in Progress
          </h2>
          <p style={{ fontSize: "0.84rem", color: "#94a3b8", marginBottom: "28px" }}>
            Evaluating payment destination risk signals...
          </p>

          <div style={{ width: "100%", maxWidth: "300px", display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
            {checklist.map((label, idx) => {
              const isDone = idx < activeStep;
              const isCurrent = idx === activeStep;

              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    background: isCurrent ? "rgba(37, 99, 235, 0.15)" : isDone ? "rgba(6, 214, 160, 0.1)" : "rgba(255, 255, 255, 0.03)",
                    border: isCurrent ? "1px solid #06D6A0" : isDone ? "1px solid rgba(6, 214, 160, 0.3)" : "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      background: isDone ? "#06D6A0" : isCurrent ? "#2563EB" : "rgba(255,255,255,0.1)",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isCurrent ? (
                      <div style={{ width: "10px", height: "10px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    ) : (
                      "•"
                    )}
                  </div>
                  <span style={{ fontSize: "0.84rem", fontWeight: isCurrent ? "600" : "500", color: isDone ? "#06D6A0" : isCurrent ? "#f8fafc" : "#94a3b8" }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Analysis Complete Phase */}
      {phase === "complete" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="animate-scale-up">
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background: "rgba(6, 214, 160, 0.15)",
              border: "3px solid #06D6A0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06D6A0",
              marginBottom: "24px",
              boxShadow: "0 0 40px rgba(6, 214, 160, 0.5)",
            }}
          >
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: "600", marginBottom: "6px", fontFamily: "Poppins, sans-serif" }}>
            Analysis Complete!
          </h2>
          <p style={{ fontSize: "0.84rem", color: "#94a3b8" }}>Preparing results...</p>
        </div>
      )}

      {/* 6. Move to Result Phase */}
      {phase === "redirecting" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} className="animate-scale-up">
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.2)",
              border: "3px solid #2563EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3b82f6",
              marginBottom: "24px",
              boxShadow: "0 0 40px rgba(37, 99, 235, 0.5)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: "600", marginBottom: "6px", fontFamily: "Poppins, sans-serif" }}>
            Redirecting to Results...
          </h2>
          <p style={{ fontSize: "0.84rem", color: "#94a3b8" }}>Pre-Transaction Risk Report Ready</p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
