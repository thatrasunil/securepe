"use client";

import React from "react";

export type ScreenId =
  | "splash"
  | "onboard1"
  | "onboard2"
  | "onboard3"
  | "permissions"
  | "login"
  | "home"
  | "scanner"
  | "processing"
  | "result"
  | "merchant"
  | "report"
  | "history"
  | "alerts"
  | "profile"
  | "payment_review"
  | "payment_sim"
  | "payment_success";

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const hiddenScreens: ScreenId[] = [
    "splash",
    "onboard1",
    "onboard2",
    "onboard3",
    "permissions",
    "login",
    "scanner",
    "processing",
    "result",
    "merchant",
    "report",
    "payment_review",
    "payment_sim",
    "payment_success",
  ];

  if (hiddenScreens.includes(currentScreen)) return null;

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-item ${currentScreen === "home" ? "active" : ""}`}
        onClick={() => onNavigate("home")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`nav-item ${currentScreen === "history" ? "active" : ""}`}
        onClick={() => onNavigate("history")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>History</span>
      </button>

      {/* Floating Hero SCAN Button */}
      <button
        className="scan-center-btn"
        onClick={() => onNavigate("scanner")}
        title="Scan Any QR Code"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 7V5a2 2 0 0 1 2-2h2" />
          <path d="M17 3h2a2 2 0 0 1 2 2v2" />
          <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
        <span style={{ fontSize: "0.62rem", fontWeight: "800", letterSpacing: "0.04em", marginTop: "2px" }}>
          SCAN QR
        </span>
      </button>

      <button
        className={`nav-item ${currentScreen === "alerts" ? "active" : ""}`}
        onClick={() => onNavigate("alerts")}
        style={{ position: "relative" }}
      >
        <div style={{ position: "relative" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-6px",
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              background: "var(--color-danger)",
              color: "#fff",
              fontSize: "0.62rem",
              fontWeight: "800",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            3
          </span>
        </div>
        <span>Alerts</span>
      </button>

      <button
        className={`nav-item ${currentScreen === "profile" ? "active" : ""}`}
        onClick={() => onNavigate("profile")}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span>Profile</span>
      </button>
    </nav>
  );
};
