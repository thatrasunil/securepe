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
    const itemName = item?.name || (item as any)?.title || "Scan Result";
    const itemPayload = item?.payload || "";
    const itemLevel = item?.level || (item as any)?.riskLevel || "SAFE";

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      itemName.toLowerCase().includes(query) ||
      itemPayload.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "ALL" || itemLevel === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: "20px 20px 140px 20px" }} className="animate-fade">
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: "800", fontFamily: "Poppins, sans-serif" }}>
          Scan History
        </h2>
        <span
          style={{
            background: "rgba(16, 185, 129, 0.12)",
            color: "#10B981",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            fontSize: "0.72rem",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
          Firebase Live
        </span>
      </div>

      {/* Search Bar */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <input
          className="input-field"
          placeholder="Search scans by shop or payload..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: "44px", height: "48px", fontSize: "0.88rem", borderRadius: "16px" }}
        />
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-secondary)"
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
              fontSize: "0.76rem",
              fontWeight: "700",
              border: activeFilter === filterKey ? "none" : "1px solid var(--bg-card-border)",
              background:
                activeFilter === filterKey
                  ? filterKey === "HIGH_RISK"
                    ? "#EF4444"
                    : filterKey === "CAUTION"
                    ? "#F59E0B"
                    : filterKey === "SAFE"
                    ? "#10B981"
                    : "#2563EB"
                  : "var(--bg-card)",
              color: activeFilter === filterKey ? "#ffffff" : "var(--text-main)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
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
                borderRadius: "20px",
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
                  width: "42px",
                  height: "42px",
                  borderRadius: "14px",
                  background: isDanger ? "rgba(239, 68, 68, 0.12)" : isCaution ? "rgba(245, 158, 11, 0.12)" : "rgba(16, 185, 129, 0.12)",
                  color: isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isDanger ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                ) : isCaution ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: "700",
                      padding: "2px 8px",
                      borderRadius: "8px",
                      background: isDanger ? "rgba(239, 68, 68, 0.15)" : isCaution ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                      color: isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981",
                    }}
                  >
                    {item.level.replace("_", " ")}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>{item.date}</span>
                </div>

                <div style={{ fontWeight: "700", fontSize: "0.95rem", fontFamily: "Poppins, sans-serif" }}>{item.name}</div>
                <div className="font-mono" style={{ fontSize: "0.76rem", color: "#38BDF8", wordBreak: "break-all", marginTop: "2px" }}>{item.payload}</div>
              </div>

              {/* Risk Score */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="font-mono" style={{ fontSize: "1.25rem", fontWeight: "800", color: isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981" }}>
                  {item.riskScore}
                </div>
                <div style={{ fontSize: "0.62rem", color: "var(--text-secondary)", fontWeight: "700" }}>RISK</div>
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
    <div style={{ padding: "20px 20px 140px 20px", minHeight: "100dvh" }} className="animate-fade">
      
      {/* 1. Header Bar (Single Line Layout without text wrap!) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
        <h2 style={{ fontSize: "1.35rem", fontWeight: "800", fontFamily: "Poppins, sans-serif", color: "var(--text-main)" }}>
          Security Alerts
        </h2>

        <button
          onClick={() => onNavigate("report")}
          style={{
            height: "38px",
            padding: "0 14px",
            fontSize: "0.82rem",
            fontWeight: "700",
            borderRadius: "14px",
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid #EF4444",
            color: "#EF4444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Report Scam
        </button>
      </div>

      {/* Subtitle Row */}
      <div style={{ fontSize: "0.78rem", color: "#EF4444", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px", marginBottom: "18px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 8px #EF4444" }} />
        Live Realtime Threat Intelligence Feed
      </div>

      {/* 2. Threat Alert Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {feed.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "18px",
              borderRadius: "22px",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            {/* Warning Shield Icon Badge */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "16px",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            {/* Alert Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "800", fontSize: "1rem", color: "var(--text-main)", marginBottom: "4px", fontFamily: "Poppins, sans-serif" }}>
                {item.title}
              </div>

              {/* Monospace Dark Payload Pill */}
              <code
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  background: "#0F172A",
                  color: "#38BDF8",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  border: "1px solid #1E293B",
                  fontFamily: "var(--font-mono)",
                  wordBreak: "break-all",
                  marginBottom: "10px",
                  lineHeight: "1.4",
                }}
              >
                {item.payload}
              </code>

              {/* Metadata Badges Row */}
              <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600", display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {item.location || "Bengaluru"}
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#EF4444" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  {item.reports_count} Flags
                </span>

                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {item.timestamp}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
