"use client";

import React, { useEffect, useState } from "react";
import { ScreenId } from "../BottomNav";
import { fetchCommunityFeed, FeedItem, subscribeRealtimeHomeStats } from "@/lib/api";
import { auth } from "@/lib/firebase";

interface HomeScreenProps {
  onNavigate: (target: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [userName, setUserName] = useState("Sunil");
  const [scanStats, setScanStats] = useState({ total: 12, blocked: 3 });
  const [recentScans, setRecentScans] = useState<Array<{ id: string; name: string; payload: string; date: string; riskScore: number; level: "SAFE" | "CAUTION" | "HIGH_RISK" }>>([
    {
      id: "s1",
      name: "ABC General Store",
      payload: "upi://pay?pa=abcstore@upi",
      date: "Today",
      riskScore: 5,
      level: "SAFE",
    },
    {
      id: "s2",
      name: "Fake Paytm Support",
      payload: "paytm-support@ybl",
      date: "Yesterday",
      riskScore: 88,
      level: "HIGH_RISK",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Dynamic user name from Firebase Auth or Local Storage onboarding
    const currentUser = auth.currentUser;
    const storedName = localStorage.getItem("sqr_user_name");
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    } else if (storedName) {
      setUserName(storedName);
    }

    fetchCommunityFeed().then(setFeed);

    // Subscribe to Realtime Firebase Firestore Home Stats & Recent Scans
    const unsubscribe = subscribeRealtimeHomeStats((data) => {
      setScanStats({ total: data.total, blocked: data.blocked });
      if (data.recentScans.length > 0) {
        setRecentScans(data.recentScans);
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const speakScreen = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hello ${userName}, SecurePE is your AI payment fraud shield. We inspect payment QR codes for fake stickers and imposter shop merchants before money leaves your account. You are fully protected today with ${scanStats.total} scans inspected and ${scanStats.blocked} scam attempts blocked.`
      );
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ padding: "clamp(16px, 4vw, 24px)", paddingBottom: "140px" }} className="animate-fade">
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingTop: "4px" }}>
        <div>
          <div style={{ fontSize: "1.35rem", fontWeight: "700" }}>Hello {userName}</div>
          <div style={{ fontSize: "0.82rem", color: "var(--color-safe)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-safe)", boxShadow: "0 0 8px var(--color-safe)" }} />
            AI Protection Active
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Senior Voice Audio Assistant */}
          <button
            onClick={speakScreen}
            style={{
              height: "38px",
              padding: "0 12px",
              borderRadius: "20px",
              background: isSpeaking ? "var(--color-safe-bg)" : "rgba(37,99,235,0.12)",
              border: "1px solid var(--accent-blue)",
              color: "var(--accent-blue)",
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title="Read screen out loud for senior safety"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            {isSpeaking ? "Speaking..." : "Read Aloud"}
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => onNavigate("alerts")}
            style={{ width: "42px", height: "42px", borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--bg-card-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-main)", cursor: "pointer", position: "relative" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span style={{ position: "absolute", top: "2px", right: "2px", width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-danger)" }} />
          </button>

          {/* Profile Avatar */}
          <button
            onClick={() => onNavigate("profile")}
            style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", cursor: "pointer" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {/* CORE APPLICATION PURPOSE HERO CARD */}
      <div
        style={{
          background: "linear-gradient(135deg, #0B1F3A 0%, #1E3A8A 100%)",
          borderRadius: "var(--card-radius)",
          padding: "22px 20px",
          border: "1px solid rgba(37, 99, 235, 0.4)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "20px",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(56,189,248,0.2)", color: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", color: "#38bdf8", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                AI PAYMENT FRAUD SHIELD
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ffffff" }}>Think Before You Scan</div>
            </div>
          </div>

          <span className="badge badge-safe" style={{ background: "rgba(16,185,129,0.25)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)", fontSize: "0.72rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399" }} /> Live Realtime
          </span>
        </div>

        {/* Clear Purpose Statement */}
        <p style={{ fontSize: "0.88rem", color: "#e2e8f0", lineHeight: "1.5", marginBottom: "18px" }}>
          We inspect payment QR codes for fake shop stickers, phishing links & imposter merchants <strong style={{ color: "#ffffff" }}>before money leaves your account</strong>.
        </p>

        {/* Clean Formatted Stats Box */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "rgba(0,0,0,0.35)", padding: "14px 18px", borderRadius: "18px" }}>
          <div>
            <div style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>Scans Inspected</div>
            <div className="font-mono" style={{ fontSize: "1.5rem", fontWeight: "700", color: "#ffffff" }}>{scanStats.total}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.76rem", color: "#94a3b8", fontWeight: "600", marginBottom: "4px" }}>Fake Stickers Blocked</div>
            <div className="font-mono" style={{ fontSize: "1.5rem", fontWeight: "700", color: "#f87171" }}>{scanStats.blocked}</div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS — 3 STEP SAFETY GUARANTEE CARD */}
      <div style={{ background: "var(--bg-card)", borderRadius: "var(--card-radius)", padding: "18px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)", marginBottom: "22px" }}>
        <div style={{ fontSize: "0.92rem", fontWeight: "700", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--text-main)" }}>
          <span>How SecurePE Protects Your Money</span>
          <span style={{ fontSize: "0.78rem", color: "var(--accent-blue)", fontWeight: "700" }}>3 Steps</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "rgba(0,0,0,0.04)", borderRadius: "14px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(37,99,235,0.15)", color: "var(--accent-blue)", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>1</div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Tap "SCAN QR" Below</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Point camera at shop sticker or online payment link.</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "rgba(0,0,0,0.04)", borderRadius: "14px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(6,182,212,0.15)", color: "var(--accent-cyan)", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>2</div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Sub-10ms AI Analysis</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Checks merchant baseline & scam reports.</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: "rgba(0,0,0,0.04)", borderRadius: "14px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--color-safe-bg)", color: "var(--color-safe)", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>3</div>
            <div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Pay Safely with Confidence</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Get green light to proceed or red scam warning.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Services Grid */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "12px", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Quick Services
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button
            onClick={() => onNavigate("history")}
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              color: "var(--text-main)",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(37,99,235,0.12)", color: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            Scan History
          </button>

          <button
            onClick={() => onNavigate("merchant")}
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              color: "var(--text-main)",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--color-safe-bg)", color: "var(--color-safe)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            Verify Shop
          </button>

          <button
            onClick={() => onNavigate("report")}
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              color: "var(--text-main)",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--color-danger-bg)", color: "var(--color-danger)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            </div>
            Report Scam
          </button>

          <button
            onClick={() => onNavigate("merchant")}
            style={{
              padding: "16px",
              borderRadius: "20px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              color: "var(--text-main)",
              fontSize: "0.92rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textAlign: "left",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(6,182,212,0.12)", color: "var(--accent-cyan)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            Nearby Shops
          </button>
        </div>
      </div>

      {/* Real-time Recent Scans Activity */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: "700" }}>Recent Scans Activity</h3>
          <button onClick={() => onNavigate("history")} style={{ background: "none", border: "none", color: "var(--accent-blue)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>
            View All →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentScans.map((scan) => {
            const isDanger = scan.level === "HIGH_RISK";
            const isCaution = scan.level === "CAUTION";
            return (
              <div
                key={scan.id}
                onClick={() => onNavigate(isDanger ? "report" : "merchant")}
                style={{
                  padding: "16px",
                  borderRadius: "var(--card-radius)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--bg-card-border)",
                  boxShadow: "var(--card-shadow)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0, paddingRight: "10px" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: isDanger ? "var(--color-danger-bg)" : isCaution ? "var(--color-caution-bg)" : "var(--color-safe-bg)", color: isDanger ? "var(--color-danger)" : isCaution ? "var(--color-caution)" : "var(--color-safe)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {isDanger ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: "700", fontSize: "0.98rem" }}>{scan.name}</div>
                    <div className="font-mono" style={{ fontSize: "0.78rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.payload}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span className={`badge ${isDanger ? "badge-danger" : isCaution ? "badge-caution" : "badge-safe"}`}>
                    {scan.level.replace("_", " ")}
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "3px" }}>{scan.date}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
