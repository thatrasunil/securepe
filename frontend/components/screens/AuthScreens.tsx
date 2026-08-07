"use client";

import React, { useState } from "react";
import { ScreenId } from "../BottomNav";
import {
  auth,
  googleProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
} from "@/lib/firebase";

interface ScreenProps {
  onNavigate: (target: ScreenId) => void;
  onUserLogin?: (user: User) => void;
}

export const PermissionsScreen: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [notifAllowed, setNotifAllowed] = useState(true);
  const [locationAllowed, setLocationAllowed] = useState(true);

  const handleAllow = () => {
    localStorage.setItem("sqr_onboarded", "true");
    onNavigate("login");
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
      <div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.3)", padding: "6px 14px", borderRadius: "20px", fontSize: "0.75rem", color: "var(--accent-blue)", fontWeight: "600", marginBottom: "16px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Security Guard Configuration
        </div>

        <h2 style={{ fontSize: "1.65rem", fontWeight: "700", marginBottom: "8px" }}>
          Enable Permissions
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "28px", lineHeight: "1.5" }}>
          SentinelQR requires access to protect your account before scanning live payments.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Camera */}
          <div
            style={{
              padding: "18px",
              borderRadius: "var(--card-radius)",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(37,99,235,0.12)", color: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Camera Access</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Scan physical QR codes at shops.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={cameraAllowed}
              onChange={(e) => setCameraAllowed(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--accent-blue)" }}
            />
          </div>

          {/* Notifications */}
          <div
            style={{
              padding: "18px",
              borderRadius: "var(--card-radius)",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "rgba(6,182,212,0.12)", color: "var(--accent-cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Live Threat Alerts</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Instant alerts for reported scams.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifAllowed}
              onChange={(e) => setNotifAllowed(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--accent-blue)" }}
            />
          </div>

          {/* Location */}
          <div
            style={{
              padding: "18px",
              borderRadius: "var(--card-radius)",
              background: "var(--bg-card)",
              border: "1px solid var(--bg-card-border)",
              boxShadow: "var(--card-shadow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "14px", background: "var(--color-safe-bg)", color: "var(--color-safe)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "0.95rem" }}>Location (Optional)</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Verifies nearby shop geofences.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={locationAllowed}
              onChange={(e) => setLocationAllowed(e.target.checked)}
              style={{ width: "20px", height: "20px", accentColor: "var(--accent-blue)" }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button className="btn-primary" onClick={handleAllow}>
          Grant Permissions & Continue
        </button>
        <button className="btn-secondary" onClick={() => onNavigate("login")}>
          Skip For Now
        </button>
      </div>
    </div>
  );
};

export const LoginScreen: React.FC<ScreenProps> = ({ onNavigate, onUserLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAuthError("");
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (onUserLogin) onUserLogin(res.user);
      onNavigate("home");
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setAuthError("Google Sign-In failed or was cancelled.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setAuthError("");
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }
      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmResult(confirmation);
      setShowOtpInput(true);
    } catch (err: any) {
      console.error("Phone Auth error:", err);
      if (err.code === "auth/billing-not-enabled") {
        setAuthError("Firebase live SMS requires a paid Firebase Blaze plan or Test Phone Numbers. Please use 'Continue with Google' or 'Continue as Guest'.");
      } else if (err.code === "auth/operation-not-allowed") {
        setAuthError("Firebase Phone SMS is disabled for this region in Firebase Console. Please use 'Continue with Google' or 'Continue as Guest'.");
      } else {
        setAuthError(err.message || "Failed to send SMS OTP. Please try 'Continue with Google'.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmResult || !otpCode) return;
    setLoading(true);
    setAuthError("");
    try {
      const res = await confirmResult.confirm(otpCode);
      if (onUserLogin) onUserLogin(res.user);
      onNavigate("home");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setAuthError("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <div id="recaptcha-container" />

      {/* Brand Header */}
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: "22px",
            background: "linear-gradient(135deg, var(--brand-navy), var(--accent-blue))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            margin: "0 auto 16px auto",
            boxShadow: "0 10px 28px rgba(37, 99, 235, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        <h2 style={{ fontSize: "1.65rem", fontWeight: "700", marginBottom: "6px" }}>
          Welcome to SentinelQR
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: "1.4" }}>
          Secure your payment profile with bank-grade fraud shield.
        </p>
      </div>

      {authError && (
        <div style={{ padding: "12px 16px", borderRadius: "14px", background: "var(--color-danger-bg)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--color-danger)", fontSize: "0.82rem", lineHeight: "1.4", textAlign: "center" }}>
          {authError}
        </div>
      )}

      {/* Auth Actions Block */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Google Authentication Button */}
        <button
          className="btn-secondary"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            background: "#ffffff",
            color: "#0f172a",
            border: "none",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Divider Line */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "2px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--bg-card-border)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "600" }}>
            OR PHONE OTP
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--bg-card-border)" }} />
        </div>

        {/* Phone OTP Form */}
        {!showOtpInput ? (
          <form onSubmit={handleSendPhoneOtp} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <div
                style={{
                  width: "60px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--bg-card-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "0.88rem",
                  color: "var(--accent-blue)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                +91
              </div>
              <input
                className="input-field font-mono"
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ height: "52px", fontSize: "0.95rem", flex: 1 }}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: "50px" }}>
              {loading ? "Sending OTP..." : "Send Verification OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              className="input-field font-mono"
              placeholder="Enter 6-Digit OTP Code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              style={{ height: "52px", fontSize: "1rem", textAlign: "center", letterSpacing: "0.2em" }}
              required
            />
            <button type="submit" className="btn-success" disabled={loading} style={{ height: "50px" }}>
              {loading ? "Verifying..." : "Verify & Complete Login"}
            </button>
          </form>
        )}

        {/* Continue as Guest Pill */}
        <button
          className="btn-secondary"
          onClick={() => onNavigate("home")}
          style={{
            height: "48px",
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            background: "var(--bg-card)",
            border: "1px solid var(--bg-card-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Continue as Guest
        </button>
      </div>

      {/* Security Privacy Badge */}
      <div
        style={{
          padding: "10px 14px",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--bg-card-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          color: "var(--text-secondary)",
          fontSize: "0.78rem",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-safe)" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Bank-grade AES-256 encrypted authentication.
      </div>
    </div>
  );
};

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}
