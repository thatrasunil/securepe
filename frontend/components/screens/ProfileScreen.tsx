"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";
import { auth, signOut, User } from "@/lib/firebase";

interface ProfileScreenProps {
  onNavigate: (target: ScreenId) => void;
  ttsEnabled: boolean;
  onToggleTts: () => void;
  theme: string;
  onToggleTheme: () => void;
  currentUser?: User | null;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  ttsEnabled,
  onToggleTts,
  theme,
  onToggleTheme,
  currentUser,
}) => {
  const [language, setLanguage] = useState("English");
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("sqr_user_name");
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    } else if (storedName) {
      setDisplayName(storedName);
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onNavigate("login");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div style={{ padding: "20px 20px 120px 20px" }} className="animate-fade">
      {/* Profile Header Card (Royal Navy Gradient with White High-Contrast Text) */}
      <div
        style={{
          background: "linear-gradient(135deg, #0b1f3a 0%, #1e3a8a 100%)",
          borderRadius: "var(--card-radius)",
          padding: "22px 20px",
          border: "1px solid rgba(37, 99, 235, 0.4)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "22px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          color: "#ffffff",
        }}
      >
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile Avatar"
            style={{ width: "64px", height: "64px", borderRadius: "50%", border: "3px solid #38bdf8", boxShadow: "0 0 16px rgba(56,189,248,0.4)" }}
          />
        ) : (
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1.4rem",
              fontWeight: "700",
              boxShadow: "0 0 16px rgba(37,99,235,0.4)",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

          <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "1.25rem", fontWeight: "700", color: "#ffffff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {displayName}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#38bdf8", fontWeight: "600" }}>
            {currentUser?.email || (currentUser?.phoneNumber ? currentUser.phoneNumber : "Protected SecurePE Member")}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            Protected by SecurePE
          </div>
        </div>
      </div>

      {/* Security Statistics Overview */}
      <div style={{ marginBottom: "26px" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>Security Overview</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>Total Scans</div>
            <div className="font-mono" style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--text-main)", marginTop: "2px" }}>142</div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>Scams Blocked</div>
            <div className="font-mono" style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--color-danger)", marginTop: "2px" }}>18</div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>Reports Submitted</div>
            <div className="font-mono" style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--accent-cyan)", marginTop: "2px" }}>4</div>
          </div>

          <div style={{ background: "var(--bg-card)", padding: "16px", borderRadius: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "600" }}>Scam Losses Avoided</div>
            <div className="font-mono" style={{ fontSize: "1.45rem", fontWeight: "700", color: "var(--color-safe)", marginTop: "2px" }}>₹24,500</div>
          </div>
        </div>
      </div>

      {/* Preferences & Settings */}
      <div>
        <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>Preferences & Settings</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Theme Switcher Row */}
          <div
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(37,99,235,0.12)", color: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>App Theme</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}</div>
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              style={{
                padding: "8px 16px",
                borderRadius: "14px",
                background: "var(--accent-blue)",
                border: "none",
                color: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
              }}
            >
              {theme === "dark" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  Switch to Light
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  Switch to Dark
                </>
              )}
            </button>
          </div>

          {/* Voice Guidance (TTS) */}
          <div
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(124,58,237,0.12)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>Read Aloud Guidance</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Speak warnings out loud when scanning</div>
              </div>
            </div>

            <button
              onClick={onToggleTts}
              style={{
                padding: "8px 14px",
                borderRadius: "14px",
                background: ttsEnabled ? "var(--color-safe-bg)" : "rgba(255,255,255,0.08)",
                border: ttsEnabled ? "1px solid var(--color-safe)" : "1px solid var(--bg-card-border)",
                color: ttsEnabled ? "var(--color-safe)" : "var(--text-muted)",
                fontSize: "0.82rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              {ttsEnabled ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  ON
                </>
              ) : "OFF"}
            </button>
          </div>

          {/* Language Selection */}
          <div
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(6,182,212,0.12)", color: "var(--accent-cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>App Language</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Select your language</div>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ background: "var(--bg-primary)", color: "var(--text-main)", border: "1px solid var(--bg-card-border)", padding: "6px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" }}
            >
              <option value="English">English</option>
              <option value="Hindi">हिंदी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Sign Out / Reset Button */}
          {currentUser ? (
            <button
              className="btn-danger"
              onClick={handleSignOut}
              style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out of Profile
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => {
                localStorage.removeItem("sqr_onboarded");
                onNavigate("splash");
              }}
              style={{ marginTop: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Replay Onboarding Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
