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
  const [scanStats, setScanStats] = useState({ total: 14209, blocked: 342, safeCount: 13867 });
  const [recentScans, setRecentScans] = useState<Array<{ id: string; name: string; payload: string; date: string; riskScore: number; level: "SAFE" | "CAUTION" | "HIGH_RISK" }>>([
    {
      id: "s1",
      name: "Ramesh Chai Corner",
      payload: "ramesh.chai@upi · UPI Payment",
      date: "10:30 AM",
      riskScore: 5,
      level: "SAFE",
    },
    {
      id: "s2",
      name: "Fake Support Sticker",
      payload: "paytm-support@ybl",
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
    <div style={{ minHeight: "100%", background: "#050C1A", color: "#f8fafc", paddingBottom: "180px" }} className="animate-fade">

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
          {/* Top Row: Badge + 3D Shield Image */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#38bdf8", fontWeight: "800", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                AI PAYMENT FRAUD SHIELD
              </div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif", lineHeight: "1.15" }}>
                Think Before<br />You Scan
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
              <span style={{ fontSize: "0.7rem", background: "rgba(6, 214, 160, 0.18)", color: "#06D6A0", border: "1px solid rgba(6, 214, 160, 0.4)", padding: "3px 8px", borderRadius: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#06D6A0" }} /> Live Realtime
              </span>

              {/* High-Tech 3D Cyber Security Shield Graphic */}
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", overflow: "hidden", border: "2px solid #38BDF8", boxShadow: "0 0 24px rgba(56, 189, 248, 0.5)", background: "#0F172A" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sentinel_hero_shield.jpg"
                  alt="3D Cyber Security Shield"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.82rem", color: "#cbd5e1", lineHeight: "1.45", marginBottom: "16px" }}>
            We inspect payment QR codes for fake stickers, phishing links & imposter merchants before money leaves your account.
          </p>

          {/* Stat Badges Box (Live Dynamic Realtime Stream) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "rgba(5, 12, 26, 0.65)", padding: "10px 14px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.25)", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Scans Inspected</div>
                <div key={scanStats.total} className="animate-scale-up" style={{ fontSize: "0.95rem", fontWeight: "800", color: "#38BDF8", fontFamily: "var(--font-mono)" }}>
                  {scanStats.total.toLocaleString()} <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "400" }}>Today</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "12px", background: "rgba(239, 68, 68, 0.2)", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>Fake Stickers Blocked</div>
                <div key={scanStats.blocked} className="animate-scale-up" style={{ fontSize: "0.95rem", fontWeight: "800", color: "#EF4444", fontFamily: "var(--font-mono)" }}>
                  {scanStats.blocked.toLocaleString()} <span style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "400" }}>Today</span>
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
          padding: "24px 14px 100px 14px",
          marginTop: "-8px",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.2)",
        }}
      >

        {/* 3. Quick Actions 4-Column Icons Grid */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "14px", color: "#0F172A", fontFamily: "Poppins, sans-serif", paddingLeft: "6px" }}>
            Quick Actions
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px" }}>
            {/* Scan QR */}
            <button
              onClick={() => onNavigate("scanner")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "4px 2px",
              }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#0B1F3A", border: "2px solid #2563EB", boxShadow: "0 6px 16px rgba(37, 99, 235, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", marginBottom: "6px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <path d="M14 14h3v3h-3z" />
                  <path d="M18 18h3v3h-3z" />
                </svg>
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0F172A", lineHeight: "1.1", whiteSpace: "nowrap" }}>Scan QR</span>
              <span style={{ fontSize: "0.6rem", color: "#64748B", marginTop: "2px", whiteSpace: "nowrap" }}>AI Scan</span>
            </button>

            {/* Verify Merchant */}
            <button
              onClick={() => onNavigate("merchant")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "4px 2px",
              }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#E6F7F2", border: "1px solid #A7F3D0", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: "6px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span style={{ fontSize: "0.76rem", fontWeight: "700", color: "#0F172A", lineHeight: "1.1", whiteSpace: "nowrap" }}>Merchant</span>
              <span style={{ fontSize: "0.6rem", color: "#64748B", marginTop: "2px", whiteSpace: "nowrap" }}>Verify Stand</span>
            </button>

            {/* Scan History */}
            <button
              onClick={() => onNavigate("history")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "4px 2px",
              }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", marginBottom: "6px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0F172A", lineHeight: "1.1", whiteSpace: "nowrap" }}>History</span>
              <span style={{ fontSize: "0.6rem", color: "#64748B", marginTop: "2px", whiteSpace: "nowrap" }}>Past Scans</span>
            </button>

            {/* Community Report */}
            <button
              onClick={() => onNavigate("report")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "4px 2px",
              }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#F3E8FF", border: "1px solid #E9D5FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED", marginBottom: "6px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#0F172A", lineHeight: "1.1", whiteSpace: "nowrap" }}>Community</span>
              <span style={{ fontSize: "0.6rem", color: "#64748B", marginTop: "2px", whiteSpace: "nowrap" }}>Report Fraud</span>
            </button>
          </div>
        </div>

        {/* 4. "Your Money. Our Priority." 3D Lock Security Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            borderRadius: "24px",
            padding: "16px 18px",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "14px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.4)", color: "#38BDF8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#ffffff", fontFamily: "Poppins, sans-serif" }}>
                Your Money. Our Priority.
              </div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>
                Multi-signal pre-transaction fraud prevention engine.
              </div>
            </div>
          </div>
        </div>

        {/* 5. Live Community Scam Broadcasts Section */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingLeft: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>
              Live Fraud Alerts
            </h3>
            <button
              onClick={() => onNavigate("alerts")}
              style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
            >
              View Feed →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {feed.slice(0, 2).map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: "18px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "#FEE2E2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A" }}>{item.title}</div>
                    <div className="font-mono" style={{ fontSize: "0.72rem", color: "#64748B" }}>{item.payload}</div>
                  </div>
                </div>

                <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#EF4444", background: "rgba(239, 68, 68, 0.1)", padding: "4px 8px", borderRadius: "10px" }}>
                  {item.reports_count} Reports
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Recent Scans History Section */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingLeft: "6px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#0F172A", fontFamily: "Poppins, sans-serif" }}>
              Recent Scans
            </h3>
            <button
              onClick={() => onNavigate("history")}
              style={{ background: "none", border: "none", color: "#2563EB", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
            >
              See All →
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {recentScans.map((scan) => (
              <div
                key={scan.id}
                style={{
                  padding: "14px 16px",
                  borderRadius: "18px",
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: scan.level === "SAFE" ? "#D1FAE5" : "#FEE2E2", color: scan.level === "SAFE" ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {scan.level === "SAFE" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#0F172A" }}>{scan.name}</div>
                    <div className="font-mono" style={{ fontSize: "0.72rem", color: "#64748B" }}>{scan.payload}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: scan.level === "SAFE" ? "#10B981" : "#EF4444" }}>
                    {scan.level}
                  </span>
                  <div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>{scan.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
