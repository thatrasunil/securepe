"use client";

import React, { useState } from "react";
import { ScreenId } from "../BottomNav";

interface OnboardProps {
  onNavigate: (target: ScreenId) => void;
  theme?: "dark" | "light";
  onSelectTheme?: (mode: "dark" | "light") => void;
}

export const Onboard1Screen: React.FC<OnboardProps> = ({ onNavigate }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 24px",
      }}
      className="animate-fade"
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => onNavigate("permissions")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" }}
        >
          Skip
        </button>
      </div>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <div
          style={{
            width: "180px",
            height: "180px",
            margin: "0 auto 32px auto",
            borderRadius: "32px",
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(6, 182, 212, 0.15))",
            border: "1px solid rgba(37, 99, 235, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "#ffffff",
            boxShadow: "0 12px 32px rgba(37, 99, 235, 0.25)",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M14 14h3v3h-3z" />
            <path d="M18 18h3v3h-3z" />
            <path d="M14 18h3v3h-3z" />
            <path d="M18 14h3v3h-3z" />
          </svg>
          <span style={{ fontSize: "0.8rem", fontWeight: "800", letterSpacing: "0.08em", color: "#38bdf8" }}>PAYMENT SCANNER</span>
        </div>

        <h2 style={{ fontSize: "1.65rem", fontWeight: "800", marginBottom: "12px" }}>
          Pay Safely. Scan Smart.
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.5" }}>
          Protect yourself from fake QR code stickers placed over legitimate shop payments before making transactions.
        </p>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ width: "24px", height: "8px", borderRadius: "4px", background: "var(--accent-blue)" }} />
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
        </div>

        <button className="btn-primary" onClick={() => onNavigate("onboard2")}>
          Next →
        </button>
      </div>
    </div>
  );
};

export const Onboard2Screen: React.FC<OnboardProps> = ({ onNavigate }) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 24px",
      }}
      className="animate-fade"
    >
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => onNavigate("permissions")}
          style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer" }}
        >
          Skip
        </button>
      </div>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <div
          style={{
            width: "180px",
            height: "180px",
            margin: "0 auto 32px auto",
            borderRadius: "32px",
            background: "linear-gradient(135deg, rgba(124, 58, 237, 0.28), rgba(168, 85, 247, 0.16))",
            border: "1px solid rgba(168, 85, 247, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            color: "#ffffff",
            boxShadow: "0 12px 32px rgba(124, 58, 237, 0.3)",
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2.2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2" />
            <path d="M15 20v2" />
            <path d="M2 15h2" />
            <path d="M2 9h2" />
            <path d="M20 15h2" />
            <path d="M20 9h2" />
            <path d="M9 2v2" />
            <path d="M9 20v2" />
          </svg>
          <span style={{ fontSize: "0.8rem", fontWeight: "800", letterSpacing: "0.08em", color: "#e9d5ff" }}>
            XAI REASONING ENGINE
          </span>
        </div>

        <h2 style={{ fontSize: "1.65rem", fontWeight: "800", marginBottom: "14px" }}>
          AI Detects Hidden Risks
        </h2>
        
        <div style={{ textAlign: "left", background: "var(--bg-card)", padding: "18px", borderRadius: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)" }}>
          <div style={{ fontSize: "0.88rem", color: "var(--color-danger)", fontWeight: "700", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Proactively Identifies:
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--color-danger)" }}>•</span>
              Imposter Paytm / GPay Support stickers
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--color-caution)" }}>•</span>
              Phishing links concealing behind bit.ly URLs
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "var(--accent-blue)" }}>•</span>
              Physical QR sticker tampering at shops
            </div>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: "24px", height: "8px", borderRadius: "4px", background: "var(--accent-blue)" }} />
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
        </div>

        <button className="btn-primary" onClick={() => onNavigate("onboard3")}>
          Next →
        </button>
      </div>
    </div>
  );
};

export const Onboard3Screen: React.FC<OnboardProps> = ({ onNavigate, theme = "dark", onSelectTheme }) => {
  const [name, setName] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sqr_user_name") || "Sunil";
    }
    return "Sunil";
  });

  const handleFinishOnboarding = () => {
    const finalName = name.trim() || "Sunil";
    localStorage.setItem("sqr_user_name", finalName);
    onNavigate("permissions");
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "32px 24px",
      }}
      className="animate-fade"
    >
      <div style={{ textAlign: "center", marginTop: "8px" }}>
        <h2 style={{ fontSize: "1.55rem", fontWeight: "800", marginBottom: "6px" }}>
          Setup Profile & Appearance
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
          Personalize your SecurePE security shield.
        </p>
      </div>

      {/* User Name Input Section */}
      <div style={{ margin: "16px 0 8px 0" }}>
        <label style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--text-main)", display: "block", marginBottom: "8px" }}>
          Enter Your Name
        </label>
        <input
          className="input-field"
          placeholder="e.g. Sunil"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            height: "54px",
            fontSize: "1.05rem",
            fontWeight: "600",
            borderRadius: "16px",
            background: "var(--bg-card)",
            color: "var(--text-main)",
            border: "1px solid var(--bg-card-border)",
            padding: "0 18px",
          }}
        />
      </div>

      {/* Interactive Theme Selection Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "8px 0 16px 0" }}>
        {/* Dark Mode Card */}
        <div
          onClick={() => onSelectTheme && onSelectTheme("dark")}
          style={{
            padding: "18px 12px",
            borderRadius: "20px",
            background: "#0f172a",
            border: theme === "dark" ? "2px solid var(--accent-blue)" : "1px solid #1e293b",
            boxShadow: theme === "dark" ? "0 0 20px rgba(37,99,235,0.3)" : "none",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.25s ease",
            position: "relative",
          }}
        >
          {theme === "dark" && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--accent-blue)",
                color: "#fff",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              ✓
            </span>
          )}

          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "#0b1f3a",
              color: "#38bdf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px auto",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>

          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#f8fafc", marginBottom: "3px" }}>Dark Mode</div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Cyber Trust Navy</div>
        </div>

        {/* Light Mode Card */}
        <div
          onClick={() => onSelectTheme && onSelectTheme("light")}
          style={{
            padding: "18px 12px",
            borderRadius: "20px",
            background: "#ffffff",
            border: theme === "light" ? "2px solid var(--accent-blue)" : "1px solid #e2e8f0",
            boxShadow: theme === "light" ? "0 0 20px rgba(37,99,235,0.3)" : "none",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.25s ease",
            position: "relative",
          }}
        >
          {theme === "light" && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "var(--accent-blue)",
                color: "#fff",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
              }}
            >
              ✓
            </span>
          )}

          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "14px",
              background: "#ecfdf5",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 10px auto",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>

          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#0f172a", marginBottom: "3px" }}>Light Mode</div>
          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Clean Banking UI</div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
          <span style={{ width: "24px", height: "8px", borderRadius: "4px", background: "var(--accent-blue)" }} />
        </div>

        <button className="btn-primary" onClick={handleFinishOnboarding}>
          Get Started as {name.trim() || "Sunil"}
        </button>
      </div>
    </div>
  );
};
