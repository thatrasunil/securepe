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
  const [scanStats, setScanStats] = useState({ total: 12, blocked: 3, safeCount: 9 });
  const [recentScans, setRecentScans] = useState<Array<{ id: string; name: string; payload: string; date: string; riskScore: number; level: "SAFE" | "CAUTION" | "HIGH_RISK" }>>([
    {
      id: "s1",
      name: "ABC Store",
      payload: "abc@ybl · UPI Payment",
      date: "10:30 AM",
      riskScore: 5,
      level: "SAFE",
    },
    {
      id: "s2",
      name: "Fake Paytm Support",
      payload: "paytm-secure-login.net",
      date: "Yesterday",
      riskScore: 88,
      level: "HIGH_RISK",
    },
    {
      id: "s3",
      name: "Grocery Mart",
      payload: "gmart@ybl · UPI Payment",
      date: "Yesterday",
      riskScore: 4,
      level: "SAFE",
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    const storedName = localStorage.getItem("sqr_user_name");
    if (currentUser?.displayName) {
      setUserName(currentUser.displayName);
    } else if (storedName) {
      setUserName(storedName);
    }

    fetchCommunityFeed().then(setFeed);

    const unsubscribe = subscribeRealtimeHomeStats((data) => {
      setScanStats({
        total: data.total,
        blocked: data.blocked,
        safeCount: Math.max(0, data.total - data.blocked),
      });
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
        `Hello ${userName}, SentinelQR AI protection is active. We inspect payment QR codes for fake stickers, phishing links, and imposter merchants before money leaves your account.`
      );
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ minHeight: "100%", background: "#050C1A", color: "#f8fafc", paddingBottom: "160px" }} className="animate-fade">

      {/* Top Header & Hero Card Container (Dark Navy #050C1A) */}
      <div style={{ padding: "16px 20px 20px 20px" }}>

        {/* 1. Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
              Hello, {userName}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#06D6A0", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#06D6A0", boxShadow: "0 0 6px #06D6A0" }} />
              AI Protection Active
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Read Aloud Voice Button */}
            <button
              onClick={speakScreen}
              style={{
                height: "36px",
                padding: "0 10px",
                borderRadius: "18px",
                background: isSpeaking ? "rgba(6, 214, 160, 0.2)" : "rgba(37, 99, 235, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                color: "#3b82f6",
                fontSize: "0.74rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
              title="Read Screen Out Loud"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
              {isSpeaking ? "Speaking..." : "Read Aloud"}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => onNavigate("alerts")}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span style={{ position: "absolute", top: "0px", right: "0px", background: "#EF4444", color: "#fff", fontSize: "0.6rem", fontWeight: "800", width: "15px", height: "15px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                3
              </span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => onNavigate("profile")}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* 2. Hero Card (AI PAYMENT FRAUD SHIELD) */}
        <div
          style={{
            background: "linear-gradient(135deg, #0A192F 0%, #112D4E 100%)",
            borderRadius: "24px",
            padding: "20px 18px",
            border: "1px solid rgba(37, 99, 235, 0.35)",
            boxShadow: "0 12px 32px rgba(5, 12, 26, 0.5)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top Row: Badge + 3D Shield */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#38bdf8", fontWeight: "800", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                SECUREPE PROTECTION ACTIVE
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif", lineHeight: "1.15" }}>
                Your Money,<br />We Watch It
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <span style={{ fontSize: "0.7rem", background: "rgba(6, 214, 160, 0.18)", color: "#06D6A0", border: "1px solid rgba(6, 214, 160, 0.4)", padding: "3px 8px", borderRadius: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#06D6A0" }} /> Live Realtime
              </span>

              {/* 3D Glowing Shield Icon */}
              <div style={{ width: "58px", height: "58px", borderRadius: "18px", background: "linear-gradient(135deg, #2563EB, #0284c7)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(37, 99, 235, 0.6)", border: "2px solid rgba(255,255,255,0.25)" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.5", marginBottom: "16px" }}>
            Before you pay, SecurePE checks if the QR is fake, tampered, or a scam — in under 2 seconds.
          </p>

          {/* Stat Badges Box */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "rgba(5, 12, 26, 0.65)", padding: "10px 14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.25)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "600" }}>QRs Checked Today</div>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
                  {scanStats.total} <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "500" }}>scans</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.25)", color: "#f87171", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "600" }}>Scams Blocked Today</div>
                <div style={{ fontSize: "1.15rem", fontWeight: "800", color: "#ef4444", fontFamily: "Poppins, sans-serif" }}>
                  {scanStats.blocked} <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: "500" }}>blocked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Main Content Area (Pristine Card Surface #FFFFFF in Light / #0B1320 in Dark) */}
      <div
        style={{
          background: "#ffffff",
          color: "#0F172A",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          padding: "24px 20px 30px 20px",
          marginTop: "-8px",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
        }}
      >

        {/* 3. Quick Actions — 2×2 Big Tiles */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>
            Quick Actions
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>

            {/* Scan QR — Primary Big Tile */}
            <button
              onClick={() => onNavigate("scanner")}
              style={{
                background: "linear-gradient(135deg, #1E3A5F 0%, #0B1F3A 100%)",
                border: "1.5px solid rgba(37,99,235,0.5)",
                borderRadius: "20px",
                padding: "16px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
                boxShadow: "0 4px 16px rgba(37,99,235,0.2)",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "rgba(37,99,235,0.3)", border: "1px solid rgba(37,99,235,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", marginBottom: "10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <path d="M14 14h3v3h-3z" />
                  <path d="M18 18h3v3h-3z" />
                </svg>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#ffffff", marginBottom: "3px" }}>Scan a QR</div>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8", lineHeight: "1.35" }}>Check if it's safe before paying</div>
            </button>

            {/* Verify Merchant */}
            <button
              onClick={() => onNavigate("merchant")}
              style={{
                background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
                border: "1.5px solid #A7F3D0",
                borderRadius: "20px",
                padding: "16px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", marginBottom: "10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#065F46", marginBottom: "3px" }}>Check a Shop</div>
              <div style={{ fontSize: "0.7rem", color: "#059669", lineHeight: "1.35" }}>Is this merchant real and safe?</div>
            </button>

            {/* Scan History */}
            <button
              onClick={() => onNavigate("history")}
              style={{
                background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9E7 100%)",
                border: "1.5px solid #FDE68A",
                borderRadius: "20px",
                padding: "16px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", marginBottom: "10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#78350F", marginBottom: "3px" }}>My Scan History</div>
              <div style={{ fontSize: "0.7rem", color: "#D97706", lineHeight: "1.35" }}>See all QRs you scanned before</div>
            </button>

            {/* Community Reports */}
            <button
              onClick={() => onNavigate("alerts")}
              style={{
                background: "linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)",
                border: "1.5px solid #DDD6FE",
                borderRadius: "20px",
                padding: "16px 14px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <div style={{ width: "42px", height: "42px", borderRadius: "13px", background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED", marginBottom: "10px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: "800", color: "#4C1D95", marginBottom: "3px" }}>Scam Alerts</div>
              <div style={{ fontSize: "0.7rem", color: "#7C3AED", lineHeight: "1.35" }}>See what others reported near you</div>
            </button>

          </div>
        </div>

        {/* 4. Protection at a Glance Stats Row */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>
              Protection at a Glance
            </h3>
            <span style={{ fontSize: "0.85rem", color: "#64748B", cursor: "pointer" }}>›</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            <div style={{ padding: "14px 10px", borderRadius: "16px", background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)", border: "1px solid #A7F3D0", minWidth: 0 }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#065F46", fontFamily: "Poppins, sans-serif" }}>98%</div>
              <div style={{ fontSize: "0.65rem", color: "#059669", fontWeight: "700", marginTop: "2px" }}>Protected</div>
            </div>

            <div style={{ padding: "14px 10px", borderRadius: "16px", background: "#F8FAFC", border: "1px solid #E2E8F0", minWidth: 0 }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#D1FAE5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>{scanStats.safeCount}</div>
              <div style={{ fontSize: "0.65rem", color: "#64748B", fontWeight: "600", marginTop: "2px" }}>Safe Today</div>
            </div>

            <div style={{ padding: "14px 10px", borderRadius: "16px", background: "#FFF5F5", border: "1px solid #FECACA", minWidth: 0 }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "#DC2626", fontFamily: "Poppins, sans-serif" }}>{scanStats.blocked}</div>
              <div style={{ fontSize: "0.65rem", color: "#DC2626", fontWeight: "600", marginTop: "2px" }}>Blocked Today</div>
            </div>
          </div>
        </div>

        {/* 5. Educational Reassurance Banner ("Your Money. Our Priority.") */}
        <div
          style={{
            background: "linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)",
            borderRadius: "20px",
            padding: "16px 18px",
            border: "1px solid #A7F3D0",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: "0.92rem", fontWeight: "700", color: "#065F46", marginBottom: "4px", fontFamily: "Poppins, sans-serif" }}>
              SecurePE protects your money
            </h4>
            <p style={{ fontSize: "0.76rem", color: "#047857", lineHeight: "1.4", marginBottom: "8px" }}>
              Every QR you scan gets checked for fake stickers, scam links, and impersonation — all before you pay.
            </p>
            <button
              onClick={() => onNavigate("merchant")}
              style={{
                background: "#059669",
                border: "none",
                borderRadius: "10px",
                color: "#fff",
                fontSize: "0.76rem",
                fontWeight: "700",
                cursor: "pointer",
                padding: "6px 12px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              See how it works
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* 3D Lock Illustration */}
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", flexShrink: 0, boxShadow: "0 4px 12px rgba(5, 150, 105, 0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* 6. Recent Scans Preview Section */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>Recent Scans</h3>
            <button onClick={() => onNavigate("history")} style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer" }}>
              View All
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentScans.map((scan) => {
              const isDanger = scan.level === "HIGH_RISK";
              const isCaution = scan.level === "CAUTION";

              return (
                <div
                  key={scan.id}
                  onClick={() => onNavigate(isDanger ? "report" : "merchant")}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "16px",
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, minWidth: 0, paddingRight: "8px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: isDanger ? "#FEE2E2" : isCaution ? "#FEF3C7" : "#D1FAE5", color: isDanger ? "#DC2626" : isCaution ? "#D97706" : "#059669", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {isDanger ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      )}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: "700", fontSize: "0.88rem", color: "#0F172A" }}>{scan.name}</div>
                      <div style={{ fontSize: "0.72rem", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{scan.payload}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        padding: "3px 8px",
                        borderRadius: "10px",
                        background: isDanger ? "#FEE2E2" : isCaution ? "#FEF3C7" : "#D1FAE5",
                        color: isDanger ? "#DC2626" : isCaution ? "#D97706" : "#059669",
                      }}
                    >
                      {isDanger ? "High Risk" : isCaution ? "Caution" : "Safe"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{scan.date}</span>
                    <span style={{ color: "#CBD5E1", fontSize: "0.85rem" }}>›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
