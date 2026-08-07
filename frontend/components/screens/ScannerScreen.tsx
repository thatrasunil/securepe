"use client";

import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { ScreenId } from "../BottomNav";

interface ScannerScreenProps {
  onNavigate: (target: ScreenId) => void;
  onScanComplete: (payload: string) => void;
}

export const PRESET_SCENARIOS = {
  authentic_merchant: "upi://pay?pa=ramesh.chai@upi&pn=Ramesh%20Chai%20Corner&am=50",
  phishing_sticker: "upi://pay?pa=paytm-support@ybl&pn=Paytm%20Refund%20Support&am=1500",
  shortened_url: "https://bit.ly/paytm-cashback-claim-99",
  apk_download: "https://paytm-security-update.net/app-v2.apk",
};

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ onNavigate, onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [flashOn, setFlashOn] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animFrameId: number;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute("playsinline", "true");
            await videoRef.current.play();
            scanFrame();
          }
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setErrorMsg("Camera preview unavailable. Upload QR image or pick a test scenario below.");
      }
    }

    function scanFrame() {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data) {
            handleDecodedPayload(code.data);
            return;
          }
        }
      }
      animFrameId = requestAnimationFrame(scanFrame);
    }

    initCamera();

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const toggleTorch = async () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      if (track && "applyConstraints" in track) {
        try {
          await (track as any).applyConstraints({
            advanced: [{ torch: !flashOn }],
          });
          setFlashOn(!flashOn);
        } catch (e) {
          console.warn("Torch not supported on this device.");
        }
      }
    }
  };

  const handleDecodedPayload = (payload: string) => {
    onScanComplete(payload);
    onNavigate("processing");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            handleDecodedPayload(code.data);
          } else {
            alert("No QR code detected in image file.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#020617", position: "relative" }} className="animate-fade">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />

      {/* Top Header Overlay Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(180deg, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0) 100%)",
        }}
      >
        <button
          onClick={() => onNavigate("home")}
          style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "42px", height: "42px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          title="Close Scanner"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <span className="badge badge-safe" style={{ background: "rgba(16,185,129,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)", fontSize: "0.8rem", padding: "6px 14px" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          AI Shield Active
        </span>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={toggleTorch}
            style={{ background: flashOn ? "var(--accent-blue)" : "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "42px", height: "42px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Toggle Flashlight"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", width: "42px", height: "42px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Upload Image from Gallery"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
        </div>
      </div>

      {/* Camera Viewfinder Container */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />

        {/* High-Tech Cyber Viewfinder Reticle */}
        <div
          style={{
            position: "relative",
            width: "240px",
            height: "240px",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.72)",
            borderRadius: "28px",
          }}
        >
          {/* Corner Brackets */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "32px", height: "32px", borderTop: "4px solid var(--accent-cyan)", borderLeft: "4px solid var(--accent-cyan)", borderTopLeftRadius: "16px" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "32px", height: "32px", borderTop: "4px solid var(--accent-cyan)", borderRight: "4px solid var(--accent-cyan)", borderTopRightRadius: "16px" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, width: "32px", height: "32px", borderBottom: "4px solid var(--accent-cyan)", borderLeft: "4px solid var(--accent-cyan)", borderBottomLeftRadius: "16px" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "32px", height: "32px", borderBottom: "4px solid var(--accent-cyan)", borderRight: "4px solid var(--accent-cyan)", borderBottomRightRadius: "16px" }} />

          {/* Sweeping Laser Line */}
          <div style={{ position: "absolute", width: "90%", height: "3px", background: "linear-gradient(90deg, transparent, var(--accent-cyan), transparent)", boxShadow: "0 0 15px var(--accent-cyan)", animation: "laserScan 2.2s infinite ease-in-out" }} />
        </div>

        <div style={{ marginTop: "24px", padding: "8px 18px", borderRadius: "20px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)", color: "#ffffff", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Align QR code inside frame
        </div>

        {errorMsg && (
          <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px", background: "rgba(239,68,68,0.9)", color: "#fff", padding: "12px", borderRadius: "14px", fontSize: "0.82rem", textAlign: "center" }}>
            {errorMsg}
          </div>
        )}
      </div>

      {/* Bottom Sheet Panel (32px Top Radius Card) */}
      <div
        style={{
          padding: "20px 24px 28px 24px",
          background: "var(--bg-card)",
          borderTopLeftRadius: "var(--bottom-sheet-radius)",
          borderTopRightRadius: "var(--bottom-sheet-radius)",
          borderTop: "1px solid var(--bg-card-border)",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.3)",
          zIndex: 20,
        }}
      >
        <div style={{ width: "36px", height: "4px", background: "var(--bg-card-border)", borderRadius: "2px", margin: "0 auto 16px auto" }} />

        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "700", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Test Scenario Presets
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          <button
            onClick={() => handleDecodedPayload(PRESET_SCENARIOS.authentic_merchant)}
            style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--color-safe-bg)", border: "1px solid rgba(16,185,129,0.4)", color: "var(--color-safe)", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Authentic Shop
          </button>

          <button
            onClick={() => handleDecodedPayload(PRESET_SCENARIOS.phishing_sticker)}
            style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--color-danger-bg)", border: "1px solid rgba(239,68,68,0.4)", color: "var(--color-danger)", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            Fake Paytm Sticker
          </button>

          <button
            onClick={() => handleDecodedPayload(PRESET_SCENARIOS.shortened_url)}
            style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--color-caution-bg)", border: "1px solid rgba(245,158,11,0.4)", color: "var(--color-caution)", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Shortened Link
          </button>

          <button
            onClick={() => handleDecodedPayload(PRESET_SCENARIOS.apk_download)}
            style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--color-danger-bg)", border: "1px solid rgba(239,68,68,0.4)", color: "var(--color-danger)", fontSize: "0.82rem", fontWeight: "700", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Direct APK File
          </button>
        </div>

        {/* Manual String Entry */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            className="input-field font-mono"
            placeholder="Or paste QR payload string..."
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{ fontSize: "0.85rem", height: "48px" }}
          />
          <button
            className="btn-primary"
            onClick={() => manualInput && handleDecodedPayload(manualInput)}
            style={{ width: "100px", height: "48px", fontSize: "0.9rem" }}
          >
            Inspect
          </button>
        </div>
      </div>
    </div>
  );
};
