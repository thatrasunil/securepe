"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";

interface SplashScreenProps {
  onNext: (target: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  const [scene, setScene] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>("Initializing Threat Engine...");

  useEffect(() => {
    // Smooth progress counter from 0 to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const t2 = setTimeout(() => {
      setScene(2);
      setStatusText("Loading Sentinel Memory™ Trust Graph...");
    }, 600);

    const t3 = setTimeout(() => {
      setScene(3);
      setStatusText("Configuring Payment Intent Validators...");
    }, 1400);

    const t4 = setTimeout(() => {
      setScene(4);
      setStatusText("Locking Geofence Baselines...");
    }, 2200);

    const t5 = setTimeout(() => {
      setScene(5);
      setStatusText("Pre-Transaction AI Shield Ready.");
    }, 3000);

    const tEnd = setTimeout(() => {
      const onboarded = localStorage.getItem("sqr_onboarded");
      onNext(onboarded ? "home" : "onboard1");
    }, 3600);

    return () => {
      clearInterval(interval);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tEnd);
    };
  }, [onNext]);

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 35%, #0F172A 0%, #050C1A 100%)",
        padding: "32px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        color: "#ffffff",
      }}
      className="animate-fade"
    >
      {/* Ambient Pulsing Glow Orbs */}
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          background: scene >= 4 ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)" : "radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
          transition: "all 0.6s ease",
        }}
      />

      {/* Futuristic Radar Pulse Rings */}
      <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(56, 189, 248, 0.25)",
            animation: "pulseRing 2s infinite ease-out",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "-16px",
            borderRadius: "50%",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            animation: "pulseRing 2s 0.6s infinite ease-out",
          }}
        />

        {/* 3D Shield Image Icon */}
        <div
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "28px",
            overflow: "hidden",
            boxShadow: scene >= 4 ? "0 0 35px rgba(16, 185, 129, 0.5)" : "0 0 35px rgba(56, 189, 248, 0.5)",
            border: scene >= 4 ? "2px solid #10B981" : "2px solid #38BDF8",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: scene === 3 ? "scale(1.08) rotate(3deg)" : "scale(1)",
            background: "#0F172A",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/sentinel_hero_shield.jpg"
            alt="SentinelQR Shield"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Emerald Checkmark Overlay on Ready */}
        {scene >= 4 && (
          <div
            style={{
              position: "absolute",
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#10B981",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bottom: "-6px",
              right: "-6px",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.8)",
              animation: "popCheck 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Brand Title & Tagline */}
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#ffffff", marginBottom: "4px", letterSpacing: "-0.03em", fontFamily: "Poppins, sans-serif" }}>
        Sentinel<span style={{ color: "#38BDF8" }}>QR</span>
      </h1>

      <p style={{ fontSize: "1.05rem", color: "#38BDF8", fontWeight: "700", marginBottom: "20px", letterSpacing: "0.02em" }}>
        Think Before You Scan.
      </p>

      {/* Progress Bar & Status Text */}
      <div style={{ width: "240px", marginBottom: "12px" }}>
        <div style={{ height: "6px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #38BDF8, #10B981)",
              borderRadius: "10px",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <div style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: "600", fontFamily: "var(--font-mono)" }}>
        {statusText}
      </div>

      <style jsx>{`
        @keyframes pulseRing {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes popCheck {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
