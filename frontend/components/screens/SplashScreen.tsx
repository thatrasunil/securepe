"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";

interface SplashScreenProps {
  onNext: (target: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNext }) => {
  // Scene state machine: 1 to 7
  const [scene, setScene] = useState<number>(1);

  useEffect(() => {
    // Precise Scene Timeline (0.0s to 3.8s)
    const t2 = setTimeout(() => setScene(2), 300);   // Scene 2: AI Neural Grid (0.3s)
    const t3 = setTimeout(() => setScene(3), 800);   // Scene 3: QR Code Forms (0.8s)
    const t4 = setTimeout(() => setScene(4), 1500);  // Scene 4: Shield Locks (1.5s)
    const t5 = setTimeout(() => setScene(5), 2200);  // Scene 5: AI Laser Scan (2.2s)
    const t6 = setTimeout(() => setScene(6), 2900);  // Scene 6: Verified Checkmark (2.9s)
    const t7 = setTimeout(() => setScene(7), 3300);  // Scene 7: Brand Reveal (3.3s)

    // Scene 8: Transition into Home/Onboarding at 4.2s
    const tEnd = setTimeout(() => {
      const onboarded = localStorage.getItem("sqr_onboarded");
      onNext(onboarded ? "home" : "onboard1");
    }, 4200);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
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
        background: scene >= 2
          ? "radial-gradient(circle at 50% 40%, #0B1F3A 0%, #020617 100%)"
          : "#020617",
        transition: "background 0.4s ease-in-out",
        padding: "32px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
      className="animate-fade"
    >
      {/* Dynamic Background Depth Orbs */}
      {scene >= 2 && (
        <div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            background: "radial-gradient(circle, rgba(37,99,235,0.35) 0%, rgba(6,182,212,0) 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Animation Stage Canvas */}
      <div style={{ position: "relative", width: "160px", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
        
        {/* SCENE 2: AI NEURAL GRID PARTICLES */}
        {scene === 2 && (
          <div className="neural-grid-container" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="140" height="140" viewBox="0 0 100 100">
              <line x1="20" y1="20" x2="80" y2="20" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />
              <line x1="80" y1="20" x2="80" y2="80" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />
              <line x1="80" y1="80" x2="20" y2="80" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />
              <line x1="20" y1="80" x2="20" y2="20" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />
              <line x1="20" y1="20" x2="80" y2="80" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 4" className="line-anim" />

              <circle cx="20" cy="20" r="4" fill="#06B6D4" className="pulse-node" />
              <circle cx="80" cy="20" r="4" fill="#06B6D4" className="pulse-node" />
              <circle cx="80" cy="80" r="4" fill="#06B6D4" className="pulse-node" />
              <circle cx="20" cy="80" r="4" fill="#06B6D4" className="pulse-node" />
              <circle cx="50" cy="50" r="5" fill="#2563EB" className="pulse-node" />
            </svg>
          </div>
        )}

        {/* SCENE 3, 4, 5, 6, 7: QR MATRIX & SHIELD */}
        {scene >= 3 && (
          <div
            style={{
              position: "relative",
              width: "120px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: scene === 3 ? "rotate(8deg) scale(0.95)" : "rotate(0deg) scale(1)",
              transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* SCENE 4+: GLOWING SHIELD BORDER */}
            {scene >= 4 && (
              <div
                style={{
                  position: "absolute",
                  inset: "-12px",
                  borderRadius: "28px",
                  background: scene >= 6
                    ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, transparent 70%)"
                    : "radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)",
                  border: scene >= 6 ? "2.5px solid #10B981" : "2.5px solid #2563EB",
                  boxShadow: scene >= 6
                    ? "0 0 35px rgba(16,185,129,0.6)"
                    : "0 0 35px rgba(37,99,235,0.6)",
                  transform: scene === 4 ? "scale(0.85)" : "scale(1)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}

            {/* QR MATRIX GRAPHIC */}
            <svg width="84" height="84" viewBox="0 0 24 24" fill="none" style={{ opacity: scene >= 3 ? 1 : 0, transition: "opacity 0.4s ease" }}>
              {/* Corner Finder Patterns */}
              <rect x="2" y="2" width="6" height="6" rx="1.5" stroke={scene >= 5 ? "#06B6D4" : "#64748b"} strokeWidth="2" fill={scene >= 5 ? "rgba(6,182,212,0.2)" : "none"} />
              <rect x="4" y="4" width="2" height="2" fill={scene >= 5 ? "#06B6D4" : "#64748b"} />

              <rect x="16" y="2" width="6" height="6" rx="1.5" stroke={scene >= 5 ? "#06B6D4" : "#64748b"} strokeWidth="2" fill={scene >= 5 ? "rgba(6,182,212,0.2)" : "none"} />
              <rect x="18" y="4" width="2" height="2" fill={scene >= 5 ? "#06B6D4" : "#64748b"} />

              <rect x="2" y="16" width="6" height="6" rx="1.5" stroke={scene >= 5 ? "#06B6D4" : "#64748b"} strokeWidth="2" fill={scene >= 5 ? "rgba(6,182,212,0.2)" : "none"} />
              <rect x="4" y="18" width="2" height="2" fill={scene >= 5 ? "#06B6D4" : "#64748b"} />

              {/* Data Blocks */}
              <rect x="10" y="3" width="2" height="2" rx="0.5" fill={scene >= 5 ? "#2563EB" : "#475569"} />
              <rect x="10" y="7" width="2" height="2" rx="0.5" fill={scene >= 5 ? "#2563EB" : "#475569"} />
              <rect x="14" y="10" width="2" height="2" rx="0.5" fill={scene >= 5 ? "#06B6D4" : "#475569"} />
              <rect x="10" y="14" width="4" height="2" rx="0.5" fill={scene >= 5 ? "#2563EB" : "#475569"} />
              <rect x="16" y="16" width="4" height="4" rx="1" stroke={scene >= 5 ? "#2563EB" : "#475569"} strokeWidth="1.5" />
            </svg>

            {/* SCENE 5: AI CYAN SCAN LASER LINE */}
            {scene === 5 && (
              <div
                style={{
                  position: "absolute",
                  left: "-10px",
                  right: "-10px",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #06B6D4, #ffffff, #06B6D4, transparent)",
                  boxShadow: "0 0 15px #06B6D4, 0 0 30px #06B6D4",
                  animation: "scanSweep 0.7s linear infinite",
                }}
              />
            )}

            {/* SCENE 6+: VERIFIED EMERALD GREEN CHECKMARK */}
            {scene >= 6 && (
              <div
                style={{
                  position: "absolute",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#10B981",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 30px rgba(16, 185, 129, 0.9)",
                  animation: "popCheckmark 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SCENE 7: BRAND REVEAL & MANIFESTO */}
      <div
        style={{
          opacity: scene >= 7 ? 1 : 0,
          transform: scene >= 7 ? "translateY(0px)" : "translateY(12px)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 3,
        }}
      >
        <h1 style={{ fontSize: "clamp(2.3rem, 7vw, 2.8rem)", fontWeight: "800", color: "#ffffff", marginBottom: "4px", letterSpacing: "-0.03em", fontFamily: "Poppins, sans-serif" }}>
          Secure<span style={{ color: "#38bdf8" }}>PE</span>
        </h1>
        
        <p style={{ fontSize: "1rem", color: "#38bdf8", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.03em" }}>
          Pre-Transaction Payment Trust Engine
        </p>

        <div style={{ fontSize: "0.82rem", color: "#cbd5e1", fontWeight: "600" }}>
          🛡️ Protected by Sentinel Memory™ & Payment Intent AI
        </div>
      </div>

      <style jsx>{`
        @keyframes scanSweep {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes popCheckmark {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.18); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulseNode {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        .pulse-node {
          animation: pulseNode 1.2s infinite ease-in-out;
        }

        .line-anim {
          animation: fadeIn 0.4s ease-in;
        }
      `}</style>
    </div>
  );
};
