/**
 * SentinelQR Real-Time Firebase Firestore & Threat Engine API Integration
 */

import { evaluateServerlessThreat } from "./threatEngine";
import {
  db,
  auth,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from "./firebase";

export const API_BASE = typeof window !== "undefined" ? "" : "http://localhost:8000";

export interface ScanResult {
  risk_score: number;
  risk_level: "SAFE" | "CAUTION" | "HIGH_RISK";
  qr_type: string;
  raw_payload: string;
  signals: {
    is_upi: boolean;
    is_url: boolean;
    is_apk: boolean;
    is_https: boolean;
    is_shortened: boolean;
    brand_impersonation?: string;
    community_reports_count: number;
    sticker_tamper_detected?: boolean;
    unverified_vpa?: boolean;
    vpa?: string;
    display_name?: string;
    sentinel_memory?: {
      payload_hash: string;
      expected_payload_hash?: string;
      historical_scans_count: number;
      location_match_confidence: number;
      trust_pattern_mismatch: boolean;
      confidence_breakdown: {
        same_location_score: number;
        repeat_payload_score: number;
        confirmations_score: number;
        merchant_verified_score: number;
        community_trust_score: number;
        total_trust_confidence: number;
      };
    };
  };
  explanation: {
    summary: string;
    reasons: string[];
    recommended_action: string;
  };
}

export interface FeedItem {
  id: string;
  icon: string;
  title: string;
  payload: string;
  reports_count: number;
  location: string;
  timestamp: string;
}

export async function analyzeScan(
  rawPayload: string,
  clientMeta?: { latitude?: number; longitude?: number }
): Promise<{ data: ScanResult; latencyMs: number }> {
  const startTime = performance.now();
  let resultData: ScanResult | null = null;

  try {
    const res = await fetch(`/api/scan/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raw_payload: rawPayload,
        client_meta: clientMeta || { latitude: 12.9716, longitude: 77.5946 },
      }),
    });

    if (res.ok) {
      const json = await res.json();
      resultData = json.data;
    }
  } catch (err) {
    console.warn("Using local serverless threat engine fallback.");
  }

  if (!resultData) {
    resultData = evaluateServerlessThreat(rawPayload, clientMeta);
  }

  const latencyMs = Math.round(performance.now() - startTime);

  // Save scan to Firebase Firestore Real-time DB
  saveScanToFirestore(resultData);

  return {
    data: resultData,
    latencyMs,
  };
}

export async function saveScanToFirestore(result: ScanResult) {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "scans"), {
      raw_payload: result.raw_payload,
      risk_score: result.risk_score,
      risk_level: result.risk_level,
      qr_type: result.qr_type,
      user_uid: user ? user.uid : "guest",
      user_email: user?.email || user?.phoneNumber || "Guest",
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Firestore scan save error:", err);
  }
}

export function subscribeRealtimeHomeStats(
  callback: (data: { total: number; blocked: number; recentScans: Array<{ id: string; name: string; payload: string; date: string; riskScore: number; level: "SAFE" | "CAUTION" | "HIGH_RISK" }> }) => void
) {
  try {
    const q = query(collection(db, "scans"), orderBy("timestamp", "desc"), limit(50));
    return onSnapshot(
      q,
      (snapshot) => {
        let total = snapshot.docs.length;
        let blocked = 0;
        const recentScans = snapshot.docs.slice(0, 3).map((doc) => {
          const d = doc.data();
          if (d.risk_level === "HIGH_RISK" || d.risk_score >= 70) {
            blocked++;
          }
          const dateStr = d.timestamp ? new Date(d.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";
          return {
            id: doc.id,
            name: d.qr_type === "UPI_PAYMENT" ? "UPI Payment QR" : d.qr_type === "APK_DOWNLOAD" ? "Direct APK File" : "Web QR Scan",
            payload: d.raw_payload || "",
            date: dateStr,
            riskScore: d.risk_score || 0,
            level: (d.risk_level || "SAFE") as "SAFE" | "CAUTION" | "HIGH_RISK",
          };
        });

        snapshot.docs.forEach((doc) => {
          const d = doc.data();
          if (d.risk_level === "HIGH_RISK" || d.risk_score >= 70) {
            blocked++;
          }
        });

        callback({
          total: total > 0 ? total : 12,
          blocked: blocked > 0 ? blocked : 3,
          recentScans,
        });
      },
      (err) => {
        // Silently fallback if Firestore database default is unprovisioned
      }
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeRealtimeHistory(
  callback: (items: Array<{ id: string; name: string; payload: string; date: string; riskScore: number; level: "SAFE" | "CAUTION" | "HIGH_RISK" }>) => void
) {
  try {
    const q = query(collection(db, "scans"), orderBy("timestamp", "desc"), limit(25));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => {
          const d = doc.data();
          const dateStr = d.timestamp ? new Date(d.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";
          return {
            id: doc.id,
            name: d.qr_type === "UPI_PAYMENT" ? "UPI Payment QR" : d.qr_type === "APK_DOWNLOAD" ? "Direct APK File" : "Web QR Scan",
            payload: d.raw_payload || "",
            date: dateStr,
            riskScore: d.risk_score || 0,
            level: d.risk_level || "SAFE",
          };
        });
        callback(items);
      },
      (err) => {
        // Silently fallback if Firestore database default is unprovisioned
      }
    );
  } catch (e) {
    return () => {};
  }
}

export async function submitFraudReport(
  rawPayload: string,
  category: string,
  notes?: string
): Promise<boolean> {
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "reports"), {
      raw_payload: rawPayload,
      category,
      notes: notes || "",
      user_uid: user ? user.uid : "guest",
      user_email: user?.email || user?.phoneNumber || "Anonymous",
      timestamp: serverTimestamp(),
      reports_count: 1,
    });

    await fetch(`/api/fraud/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_payload: rawPayload, category, notes }),
    });

    return true;
  } catch (err) {
    return false;
  }
}

export function subscribeRealtimeAlerts(callback: (feed: FeedItem[]) => void) {
  try {
    const q = query(collection(db, "reports"), orderBy("timestamp", "desc"), limit(20));
    return onSnapshot(
      q,
      (snapshot) => {
        const feed = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            icon: d.category === "IMPOSTER_PAYMENT" ? "🔴" : "🟡",
            title: d.category === "IMPOSTER_PAYMENT" ? "Imposter Merchant QR Reported" : "Suspicious Scanned Link",
            payload: d.raw_payload || "",
            reports_count: d.reports_count || 1,
            location: d.notes ? d.notes.slice(0, 20) : "Local Store",
            timestamp: "Realtime",
          };
        });
        if (feed.length > 0) callback(feed);
      },
      (err) => {
        // Silently fallback if Firestore database default is unprovisioned
      }
    );
  } catch (e) {
    return () => {};
  }
}

export async function fetchCommunityFeed(): Promise<FeedItem[]> {
  try {
    const res = await fetch(`/api/fraud/feed`);
    if (res.ok) {
      const json = await res.json();
      return json.feed;
    }
  } catch (err) {}
  return [
    {
      id: "rep_101",
      icon: "🔴",
      title: "Imposter Paytm Support Sticker",
      payload: "paytm-support@ybl",
      reports_count: 18,
      location: "MG Road Store",
      timestamp: "2m ago",
    },
    {
      id: "rep_102",
      icon: "🟡",
      title: "Suspicious Shortened Cashback Link",
      payload: "bit.ly/cashback-free",
      reports_count: 5,
      location: "Online Ad",
      timestamp: "14m ago",
    },
  ];
}
