"use client";

import React, { useEffect, useState } from "react";
import { fetchCommunityFeed, FeedItem, subscribeRealtimeHistory, subscribeRealtimeAlerts } from "@/lib/api";
import { ScreenId } from "../BottomNav";

interface ScreenProps {
  onNavigate: (target: ScreenId) => void;
}

export interface ScanHistoryItem {
  id: string;
  name: string;
  payload: string;
  date: string;
  riskScore: number;
  level: "SAFE" | "CAUTION" | "HIGH_RISK";
}

export const HistoryScreen: React.FC<ScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "SAFE" | "CAUTION" | "HIGH_RISK">("ALL");

  const [history, setHistory] = useState<ScanHistoryItem[]>([
    {
      id: "h1",
      name: "Ramesh Chai Corner",
      payload: "upi://pay?pa=ramesh.chai@upi...",
      date: "Yesterday, 4:15 PM",
      riskScore: 5,
      level: "SAFE",
    },
    {
      id: "h2",
      name: "Fake Paytm Refund Sticker",
      payload: "paytm-support@ybl",
      date: "Today, 10:30 AM",
      riskScore: 88,
      level: "HIGH_RISK",
    },
    {
      id: "h3",
      name: "Cashback Reward Offer",
      payload: "https://bit.ly/paytm-cashback...",
      date: "3 days ago",
      riskScore: 55,
      level: "CAUTION",
    },
  ]);

  useEffect(() => {
    // Subscribe to Firebase Firestore Real-Time Scans Database
    const unsubscribe = subscribeRealtimeHistory((items) => {
      if (items.length > 0) {
        setHistory(items);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payload.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "ALL" || item.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "20px 20px 130px 20px" }} className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "700" }}>
          Scan History
        </h2>
        <span className="badge badge-safe" style={{ background: "rgba(16,185,129,0.15)", color: "var(--color-safe)", border: "1px solid rgba(16,185,129,0.3)", fontSize: "0.75rem" }}>
          🔥 Firebase Realtime Live
        </span>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <input
          className="input-field"
          placeholder="Search scans by shop or payload..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: "44px", height: "48px", fontSize: "0.9rem" }}
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2.5"
          style={{ position: "absolute", left: "16px", top: "15px" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Filter Pills */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "18px", overflowX: "auto" }}>
        {(["ALL", "SAFE", "CAUTION", "HIGH_RISK"] as const).map((filterKey) => (
          <button
            key={filterKey}
            onClick={() => setActiveFilter(filterKey)}
            style={{
              padding: "6px 14px",
              borderRadius: "14px",
              fontSize: "0.78rem",
              fontWeight: "700",
              border: activeFilter === filterKey ? "none" : "1px solid var(--bg-card-border)",
              background:
                activeFilter === filterKey
                  ? filterKey === "HIGH_RISK"
                    ? "var(--color-danger)"
                    : filterKey === "CAUTION"
                    ? "var(--color-caution)"
                    : filterKey === "SAFE"
                    ? "var(--color-safe)"
                    : "var(--accent-blue)"
                  : "var(--bg-card)",
              color: activeFilter === filterKey ? "#ffffff" : "var(--text-main)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {filterKey.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Scan History Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredHistory.map((item) => {
          const isDanger = item.level === "HIGH_RISK";
          const isCaution = item.level === "CAUTION";

          return (
            <div
              key={item.id}
              style={{
                padding: "16px",
                borderRadius: "var(--card-radius)",
                background: "var(--bg-card)",
                border: `1px solid ${isDanger ? "rgba(239,68,68,0.4)" : isCaution ? "rgba(245,158,11,0.4)" : "rgba(16,185,129,0.3)"}`,
                boxShadow: "var(--card-shadow)",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              {/* Risk Icon */}
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: isDanger ? "var(--color-danger-bg)" : isCaution ? "var(--color-caution-bg)" : "var(--color-safe-bg)",
                  color: isDanger ? "var(--color-danger)" : isCaution ? "var(--color-caution)" : "var(--color-safe)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isDanger ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                ) : isCaution ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span className={`badge ${isDanger ? "badge-danger" : isCaution ? "badge-caution" : "badge-safe"}`}>
                    {item.level.replace("_", " ")}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontWeight: "500" }}>{item.date}</span>
                </div>

                <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{item.name}</div>
                <div className="font-mono" style={{ fontSize: "0.78rem", color: "var(--text-muted)", wordBreak: "break-all" }}>{item.payload}</div>
              </div>

              {/* Risk Score */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="font-mono" style={{ fontSize: "1.2rem", fontWeight: "700", color: isDanger ? "var(--color-danger)" : isCaution ? "var(--color-caution)" : "var(--color-safe)" }}>
                  {item.riskScore}
                </div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: "600" }}>RISK</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AlertsScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    fetchCommunityFeed().then(setFeed);
    // Subscribe to Firebase Firestore Real-time Fraud Reports Database
    const unsubscribe = subscribeRealtimeAlerts((liveFeed) => {
      setFeed((prev) => {
        const combined = [...liveFeed, ...prev];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        return unique;
      });
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px 20px 130px 20px" }} className="animate-fade">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: "700" }}>Security Alerts</h2>
          <div style={{ fontSize: "0.8rem", color: "var(--color-danger)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-danger)" }} />
            Firebase Realtime Live Alerts
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() => onNavigate("report")}
          style={{ height: "36px", padding: "0 12px", fontSize: "0.8rem" }}
        >
          + Report Scam
        </button>
      </div>

      {/* Threat Alert Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {feed.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "16px",
              borderRadius: "var(--card-radius)",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: item.icon.includes("🔴") ? "var(--color-danger-bg)" : "var(--color-caution-bg)", color: item.icon.includes("🔴") ? "var(--color-danger)" : "var(--color-caution)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "600", fontSize: "0.95rem", marginBottom: "2px" }}>{item.title}</div>
              <div className="font-mono" style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", marginBottom: "6px", wordBreak: "break-all" }}>
                {item.payload}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{item.location}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{item.reports_count} Flags</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>{item.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
