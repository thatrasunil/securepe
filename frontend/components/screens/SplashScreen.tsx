"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";

interface SplashScreenProps {
  onNext: (target: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing Quantum Cyber Guard...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 4;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }

        if (next > 70) {
          setStatusText("SecurePE Payment Shield Active!");
        } else if (next > 35) {
          setStatusText("Calibrating Sub-10ms Fraud AI...");
        } else {
          setStatusText("Initializing Quantum Cyber Guard...");
        }

        return next;
      });
    }, 70);

    const timer = setTimeout(() => {
      const onboarded = localStorage.getItem("sqr_onboarded");
      onNext(onboarded ? "home" : "onboard1");
    }, 2400);

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
        background: "radial-gradient(circle at 50% 30%, #0b1f3a 0%, #020617 100%)",
        padding: "48px 24px 44px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
      className="animate-fade"
    >
      {/* Background Matrix Glow Orbs */}
      <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: "260px", height: "260px", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, rgba(6,182,212,0) 70%)", filter: "blur(30px)", pointerEvents: "none" }} />

      <div style={{ height: "24px" }} />

      {/* Central High-Tech Animated Emblem */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
        <div
          style={{
            position: "relative",
            width: "104px",
            height: "104px",
            marginBottom: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer Orbit Pulse Ring */}
          <div
            style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "36px",
              border: "2px dashed var(--accent-cyan)",
              animation: "spinOrbit 10s linear infinite",
              opacity: 0.7,
            }}
          />

          {/* Main Glowing Shield Container */}
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "28px",
              background: "linear-gradient(135deg, var(--brand-navy), var(--accent-blue))",
              border: "1.5px solid rgba(56, 189, 248, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 0 45px rgba(6, 182, 212, 0.5), 0 12px 36px rgba(37, 99, 235, 0.6)",
              animation: "pulseHeroScan 2.5s infinite ease-in-out",
            }}
          >
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>

        {/* SecurePE Brand Title */}
        <h1 style={{ fontSize: "clamp(2.2rem, 7vw, 2.6rem)", fontWeight: "800", color: "#ffffff", marginBottom: "6px", letterSpacing: "-0.03em" }}>
          Secure<span style={{ color: "#38bdf8" }}>PE</span>
        </h1>
        
        <p style={{ fontSize: "1.05rem", color: "#38bdf8", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.05em" }}>
          Think Before You Scan.
        </p>

        <p style={{ fontSize: "0.82rem", color: "#cbd5e1", fontWeight: "500" }}>
          AI Fraud Shield for Secure QR Payments
        </p>
      </div>

      {/* High-Tech Dynamic Progress Track */}
      <div style={{ width: "100%", maxWidth: "290px", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", color: "#ffffff", fontSize: "0.82rem", fontWeight: "600" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-cyan)", boxShadow: "0 0 10px var(--accent-cyan)" }} />
            {statusText}
          </span>
          <span className="font-mono" style={{ color: "var(--accent-cyan)", fontWeight: "700" }}>{progress}%</span>
        </div>

        {/* 0-100% Precision Glowing Bar */}
        <div style={{ width: "100%", height: "7px", background: "rgba(255, 255, 255, 0.12)", borderRadius: "4px", overflow: "hidden" }}>
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-blue), var(--accent-cyan), #34d399)",
              borderRadius: "4px",
              boxShadow: "0 0 12px var(--accent-cyan)",
              transition: "width 0.08s linear",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes spinOrbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
