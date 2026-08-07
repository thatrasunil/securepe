"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";

interface SplashScreenProps {
  onNext: (target: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    const timer = setTimeout(() => {
      const onboarded = localStorage.getItem("sqr_onboarded");
      onNext(onboarded ? "home" : "onboard1");
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onNext]);

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        background: "linear-gradient(180deg, #0B1F3A 0%, #020617 100%)",
        padding: "48px 24px 40px 24px",
        textAlign: "center",
      }}
      className="animate-fade"
    >
      <div style={{ height: "20px" }} />

      {/* Central Brand Identity Emblem */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "28px",
            background: "linear-gradient(135deg, var(--brand-navy), var(--accent-blue))",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            marginBottom: "24px",
            boxShadow: "0 12px 36px rgba(37, 99, 235, 0.5)",
            animation: "pulseHeroScan 2.5s infinite ease-in-out",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 6vw, 2.4rem)", fontWeight: "800", color: "#ffffff", marginBottom: "6px", letterSpacing: "-0.02em" }}>
          SentinelQR
        </h1>
        
        <p style={{ fontSize: "1rem", color: "#38bdf8", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.04em" }}>
          Think Before You Scan.
        </p>

        <p style={{ fontSize: "0.82rem", color: "#cbd5e1", fontWeight: "500" }}>
          AI Fraud Shield for Secure QR Payments
        </p>
      </div>

      {/* High-Contrast Progress Bar & Loading Text */}
      <div style={{ width: "100%", maxWidth: "280px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", color: "#ffffff", fontSize: "0.85rem", fontWeight: "600" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 8px var(--accent-cyan)" }} />
            Initializing Cyber Trust Shield...
          </span>
          <span className="font-mono" style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>{progress}%</span>
        </div>

        {/* 0-100% Animated Loading Track */}
        <div style={{ width: "100%", height: "6px", background: "rgba(255, 255, 255, 0.12)", borderRadius: "3px", overflow: "hidden" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))",
              borderRadius: "3px",
              boxShadow: "0 0 10px var(--accent-cyan)",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
};
