"use client";

import React, { useState } from "react";
import { ScreenId } from "../BottomNav";
import { ScanResult } from "@/lib/api";

interface PaymentReviewProps {
  result: ScanResult | null;
  onNavigate: (target: ScreenId) => void;
  simAmount: number;
  setSimAmount: (val: number) => void;
}

export const PaymentReviewScreen: React.FC<PaymentReviewProps> = ({
  result,
  onNavigate,
  simAmount,
  setSimAmount,
}) => {
  const intent = result?.signals?.payment_intent;
  const isDanger = (result?.risk_score ?? 0) >= 70;
  const isCaution = (result?.risk_score ?? 0) >= 30 && (result?.risk_score ?? 0) < 70;

  const merchantName = result?.signals?.display_name || "ABC Tea Stall";
  const vpaHandle = result?.signals?.vpa || "abc@ybl";
  const defaultAmount = intent?.amount_value || (simAmount > 0 ? simAmount : 100);

  return (
    <div style={{ padding: "20px 20px 100px 20px" }} className="animate-fade">
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => onNavigate("result")}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "var(--bg-card)",
            border: "1px solid var(--bg-card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-main)",
            cursor: "pointer",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "800", fontFamily: "Poppins, sans-serif" }}>
            Review Payment
          </h2>
          <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontWeight: "600" }}>
            Verify payment intent before proceeding
          </div>
        </div>
      </div>

      {/* Merchant Card */}
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "24px",
          padding: "20px",
          border: "1px solid var(--bg-card-border)",
          boxShadow: "var(--card-shadow)",
          marginBottom: "18px",
        }}
      >
        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
          Paying to
        </div>

        <div style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif", marginBottom: "2px" }}>
          {merchantName}
        </div>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "#38BDF8", marginBottom: "16px" }}>
          {vpaHandle}
        </div>

        {/* Amount Input Box */}
        <div style={{ background: "var(--bg-primary)", borderRadius: "18px", padding: "16px", border: "1.5px solid rgba(56, 189, 248, 0.3)" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "700", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Enter Payment Amount
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "#38BDF8", fontFamily: "Poppins, sans-serif" }}>₹</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={simAmount || defaultAmount}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setSimAmount(val ? Number(val) : 0);
              }}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                fontSize: "1.8rem",
                fontWeight: "800",
                color: "var(--text-main)",
                fontFamily: "Poppins, sans-serif",
                outline: "none",
              }}
              placeholder="0"
            />
          </div>

          {/* Quick Amount Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
            {[50, 100, 500, 1000, 2000].map((preset) => (
              <button
                key={preset}
                onClick={() => setSimAmount(preset)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "12px",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  background: (simAmount || defaultAmount) === preset ? "#2563EB" : "var(--bg-card)",
                  color: (simAmount || defaultAmount) === preset ? "#ffffff" : "var(--text-main)",
                  border: (simAmount || defaultAmount) === preset ? "1px solid #2563EB" : "1px solid var(--bg-card-border)",
                  cursor: "pointer",
                  boxShadow: (simAmount || defaultAmount) === preset ? "0 4px 12px rgba(37,99,235,0.3)" : "none",
                }}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>

        {/* Suspicious Prefill Warning */}
        {intent?.is_suspicious_static_prefill && (
          <div style={{ marginTop: "14px", padding: "10px 14px", borderRadius: "14px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid #F59E0B", color: "#F59E0B", fontSize: "0.78rem", fontWeight: "600", lineHeight: "1.45", display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{flexShrink:0,marginTop:"1px"}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span><strong>Amount pre-filled in QR:</strong> Normal shop QR codes require entering the amount manually. Please double-check with the shopkeeper before paying.</span>
          </div>
        )}
      </div>

      {/* SecurePE Verification Summary Box */}
      <div
        style={{
          background: isDanger
            ? "rgba(239, 68, 68, 0.08)"
            : isCaution
            ? "rgba(245, 158, 11, 0.08)"
            : "rgba(16, 185, 129, 0.08)",
          borderRadius: "20px",
          padding: "16px 18px",
          border: `1.5px solid ${isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981"}`,
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <div style={{ fontSize: "0.9rem", fontWeight: "800", color: isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981", fontFamily: "Poppins, sans-serif" }}>
            SecurePE Safety Summary
          </div>
          <span style={{ fontSize: "0.74rem", fontWeight: "800", color: isDanger ? "#EF4444" : isCaution ? "#F59E0B" : "#10B981" }}>
            {result?.risk_score ?? 12}/100 RISK
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.8rem", color: "var(--text-main)", fontWeight: "600" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Shop name and payment address verified</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Amount matches normal shop payments</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {intent?.is_suspicious_static_prefill ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            )}
            <span>{intent?.is_suspicious_static_prefill ? "Amount pre-set in QR code" : "No hidden extra charges found"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Matches previous safe scans at this shop</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        className="btn-primary"
        onClick={() => {
          if (!simAmount) setSimAmount(defaultAmount);
          onNavigate("payment_sim");
        }}
        style={{
          height: "54px",
          fontSize: "1.05rem",
          fontWeight: "800",
          borderRadius: "18px",
          background: isDanger ? "#EF4444" : "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
          boxShadow: isDanger ? "0 8px 24px rgba(239,68,68,0.4)" : "0 8px 24px rgba(37,99,235,0.4)",
        }}
      >
        Simulate Pay ₹{simAmount || defaultAmount} →
      </button>

      <button
        onClick={() => onNavigate("scanner")}
        style={{
          width: "100%",
          height: "44px",
          background: "none",
          border: "none",
          color: "var(--text-secondary)",
          fontSize: "0.88rem",
          fontWeight: "700",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        ← Cancel & Scan Another QR
      </button>
    </div>
  );
};

export const PaymentSimulationScreen: React.FC<PaymentReviewProps> = ({
  result,
  onNavigate,
  simAmount,
}) => {
  const [loading, setLoading] = useState(false);

  const merchantName = result?.signals?.display_name || "ABC Tea Stall";
  const vpaHandle = result?.signals?.vpa || "abc@ybl";

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate("payment_success");
    }, 1200);
  };

  return (
    <div style={{ padding: "20px 20px 100px 20px", textAlign: "center" }} className="animate-fade">
      <h2 style={{ fontSize: "1.3rem", fontWeight: "800", fontFamily: "Poppins, sans-serif", marginBottom: "4px" }}>
        Simulated UPI Payment
      </h2>
      <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "24px" }}>
        SecurePE Pre-Transaction Demo Mode
      </div>

      {/* Payment Amount Card */}
      <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "24px 20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)", marginBottom: "20px" }}>
        <div style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
          Paying Merchant
        </div>
        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif" }}>
          {merchantName}
        </div>
        <div className="font-mono" style={{ fontSize: "0.85rem", color: "#38BDF8", marginBottom: "16px" }}>
          {vpaHandle}
        </div>

        <div style={{ fontSize: "2.3rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif" }}>
          ₹{simAmount || 100}
        </div>
      </div>

      {/* Payment Source Wallet */}
      <div style={{ background: "rgba(37,99,235,0.08)", borderRadius: "18px", padding: "14px 16px", border: "1px solid rgba(37,99,235,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600" }}>Payment Method</div>
          <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--text-main)" }}>SecurePE Demo Wallet</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", fontWeight: "600" }}>Balance</div>
          <div style={{ fontSize: "0.9rem", fontWeight: "800", color: "#10B981" }}>₹10,000</div>
        </div>
      </div>

      {/* Visible Simulation Disclaimer Box */}
      <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid #F59E0B", color: "#F59E0B", fontSize: "0.78rem", fontWeight: "700", marginBottom: "24px", lineHeight: "1.4" }}>
        🔒 DEMO SIMULATION MODE — No real money will be transferred.
      </div>

      {/* CTA Button */}
      <button
        className="btn-primary"
        onClick={handlePay}
        disabled={loading}
        style={{
          height: "54px",
          fontSize: "1.1rem",
          fontWeight: "800",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
          boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Simulating Payment..." : `Pay ₹${simAmount || 100}`}
      </button>

      <button
        onClick={() => onNavigate("payment_review")}
        style={{ width: "100%", height: "44px", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "0.88rem", fontWeight: "700", marginTop: "10px", cursor: "pointer" }}
      >
        ← Cancel
      </button>
    </div>
  );
};

export const PaymentSuccessScreen: React.FC<PaymentReviewProps> = ({
  result,
  onNavigate,
  simAmount,
}) => {
  const [remembered, setRemembered] = useState(false);

  const merchantName = result?.signals?.display_name || "ABC Tea Stall";
  const vpaHandle = result?.signals?.vpa || "abc@ybl";

  return (
    <div style={{ padding: "30px 20px 100px 20px", textAlign: "center" }} className="animate-fade">
      {/* Animated Success Checkmark */}
      <div style={{ width: "76px", height: "76px", borderRadius: "50%", background: "#10B981", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 35px rgba(16,185,129,0.6)", marginBottom: "18px" }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 style={{ fontSize: "1.4rem", fontWeight: "800", fontFamily: "Poppins, sans-serif", marginBottom: "4px" }}>
        Payment Simulated
      </h2>
      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", fontWeight: "600", marginBottom: "20px" }}>
        SecurePE protected this payment decision.
      </div>

      {/* Transaction Details Card */}
      <div style={{ background: "var(--bg-card)", borderRadius: "24px", padding: "20px", border: "1px solid var(--bg-card-border)", boxShadow: "var(--card-shadow)", marginBottom: "20px" }}>
        <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "Poppins, sans-serif", marginBottom: "8px" }}>
          ₹{simAmount || 100}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: "700", color: "var(--text-main)" }}>{merchantName}</div>
        <div className="font-mono" style={{ fontSize: "0.82rem", color: "#38BDF8", marginBottom: "14px" }}>{vpaHandle}</div>

        <div style={{ fontSize: "0.74rem", color: "var(--text-secondary)", background: "rgba(0,0,0,0.04)", padding: "8px 12px", borderRadius: "10px" }}>
          Demo transaction only. No money was transferred.<br />
          <strong>Txn ID: DEMO-SQP-7A92F</strong>
        </div>
      </div>

      {/* "Remember this merchant?" Sentinel Memory™ Integration Card */}
      <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(6,182,212,0.1) 100%)", borderRadius: "22px", padding: "18px", border: "1.5px solid #2563EB", marginBottom: "24px", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{ fontSize: "1.2rem" }}>🛡️</span>
          <div style={{ fontSize: "0.92rem", fontWeight: "800", color: "#2563EB", fontFamily: "Poppins, sans-serif" }}>
            Remember this QR?
          </div>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--text-main)", lineHeight: "1.45", marginBottom: "12px", fontWeight: "600" }}>
          SecurePE can use this trusted QR history to identify unexpected changes in future scans.
        </p>

        <button
          onClick={() => setRemembered(true)}
          disabled={remembered}
          style={{
            width: "100%",
            height: "42px",
            borderRadius: "14px",
            background: remembered ? "#10B981" : "#2563EB",
            color: "#ffffff",
            fontSize: "0.82rem",
            fontWeight: "700",
            border: "none",
            cursor: remembered ? "default" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {remembered ? "✓ Added to Sentinel Memory™ Graph!" : "Remember QR Payload"}
        </button>
      </div>

      {/* Return Home */}
      <button
        className="btn-primary"
        onClick={() => onNavigate("home")}
        style={{ height: "50px", fontSize: "1rem", fontWeight: "800", borderRadius: "16px" }}
      >
        Done & Return Home
      </button>
    </div>
  );
};
