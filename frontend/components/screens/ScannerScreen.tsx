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
  const [errorMsg, setErrorMsg] = useState("");
  const [scanState, setScanState] = useState<"ready" | "detected" | "capturing">("ready");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPresetsPanel, setShowPresetsPanel] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);

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
            videoRef.current
              .play()
              .then(() => scanFrame())
              .catch(() => {});
          }
        }
      } catch (err: any) {
        if (err?.name !== "AbortError" && err?.name !== "NotAllowedError") {
          console.warn("Camera access warning:", err);
        }
        setErrorMsg("Camera preview unavailable. Upload QR image or pick a scenario below.");
      }
    }

    function scanFrame() {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.height = videoRef.current.videoHeight;
          canvas.width = videoRef.current.videoWidth;
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data) {
            triggerAutoCaptureSequence(code.data);
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

  const triggerAutoCaptureSequence = (payload: string) => {
    setScanState("detected");
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([40]);
      } catch (e) {}
    }

    setTimeout(() => {
      setScanState("capturing");
      setTimeout(() => {
        onScanComplete(payload);
        onNavigate("processing");
      }, 400);
    }, 450);
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            triggerAutoCaptureSequence(code.data);
          } else {
            setErrorMsg("No scannable QR code detected in selected image file.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const triggerVoiceAssist = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const text =
        scanState === "detected" || scanState === "capturing"
          ? "QR code detected. Capturing payload for pre-transaction AI risk analysis."
          : "Align the QR code inside the frame. SentinelQR will automatically detect and analyze destination safety before you pay.";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setVoiceActive(true);
      utterance.onend = () => setVoiceActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", background: "#0B1320", position: "relative", overflow: "hidden" }} className="animate-fade">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} onChange={handleFileUpload} />

      {/* 1. Full-Bleed Camera Feed (Absolute Inset 0 to fill 100% of background!) */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
        muted
      />

      {/* 2. Header Section (80px Height, Z-Index 30) */}
      <div
        style={{
          position: "relative",
          height: "80px",
          zIndex: 30,
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(180deg, rgba(11,19,32,0.92) 0%, rgba(11,19,32,0) 100%)",
          flexShrink: 0,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => onNavigate("home")}
          style={{
            background: "rgba(11,19,32,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
          title="Back to Home"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Title & Subtitle */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.35rem", fontWeight: "600", color: "#f8fafc", fontFamily: "Poppins, sans-serif", lineHeight: "1.2" }}>
            Secure Scanner
          </div>
          <div style={{ fontSize: "0.82rem", color: "#06D6A0", fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "2px" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06D6A0" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            AI Protection Active
          </div>
        </div>

        {/* Flash Toggle */}
        <button
          onClick={toggleTorch}
          style={{
            background: flashOn ? "#2563EB" : "rgba(11,19,32,0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: flashOn ? "0 0 16px #2563EB" : "none",
          }}
          title="Toggle Flashlight"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </button>
      </div>

      {/* 3. Reticle Viewfinder Container (Spacious Flex: 1) */}
      <div style={{ flex: 1, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

        {/* AI Scan Frame (Fixed 240px x 240px with Box-Shadow Mask Outside!) */}
        <div
          style={{
            position: "relative",
            width: "240px",
            height: "240px",
            minWidth: "240px",
            minHeight: "240px",
            flexShrink: 0,
            borderRadius: "24px",
            border: scanState === "detected" ? "3px solid #06D6A0" : scanState === "capturing" ? "3px solid #2563EB" : "2px solid rgba(37, 99, 235, 0.5)",
            boxShadow: scanState === "detected"
              ? "0 0 0 9999px rgba(11, 19, 32, 0.72), 0 0 32px rgba(6, 214, 160, 0.8)"
              : "0 0 0 9999px rgba(11, 19, 32, 0.72), 0 0 24px rgba(37, 99, 235, 0.5)",
            background: "transparent",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 4 Corner Indicators (Royal Blue #2563EB) */}
          <div style={{ position: "absolute", top: "-2px", left: "-2px", width: "36px", height: "36px", borderTop: "4px solid #2563EB", borderLeft: "4px solid #2563EB", borderTopLeftRadius: "20px" }} />
          <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "36px", height: "36px", borderTop: "4px solid #2563EB", borderRight: "4px solid #2563EB", borderTopRightRadius: "20px" }} />
          <div style={{ position: "absolute", bottom: "-2px", left: "-2px", width: "36px", height: "36px", borderBottom: "4px solid #2563EB", borderLeft: "4px solid #2563EB", borderBottomLeftRadius: "20px" }} />
          <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "36px", height: "36px", borderBottom: "4px solid #2563EB", borderRight: "4px solid #2563EB", borderBottomRightRadius: "20px" }} />

          {/* Moving Scan Line Animation (Electric Cyan Line) */}
          {scanState === "ready" && (
            <>
              <div
                style={{
                  position: "absolute",
                  width: "92%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, #06D6A0, transparent)",
                  boxShadow: "0 0 16px #06D6A0",
                  animation: "laserScan 1.0s infinite ease-in-out",
                }}
              />
              <div style={{ color: "rgba(248, 250, 252, 0.9)", fontSize: "0.85rem", fontWeight: "500", textAlign: "center" }}>
                Align QR code<br />within the frame
              </div>
            </>
          )}

          {/* State 2: QR Detected Feedback */}
          {scanState === "detected" && (
            <div style={{ textAlign: "center" }} className="animate-scale-up">
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#06D6A0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ color: "#06D6A0", fontWeight: "600", fontSize: "0.88rem" }}>QR code detected</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem" }}>Hold steady...</div>
            </div>
          )}

          {/* State 3: Capturing Confirmation */}
          {scanState === "capturing" && (
            <div style={{ textAlign: "center" }} className="animate-scale-up">
              <div style={{ width: "28px", height: "28px", border: "3px solid #2563EB", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px auto" }} />
              <div style={{ color: "#2563EB", fontWeight: "600", fontSize: "0.88rem" }}>Capturing QR code...</div>
            </div>
          )}
        </div>

        {/* Live Guidance Badge Pill */}
        <div
          style={{
            zIndex: 10,
            marginTop: "20px",
            padding: "8px 20px",
            borderRadius: "20px",
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#06D6A0", fontSize: "0.84rem", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Scanning is automatic
          </div>
          <div style={{ color: "#E5E7EB", fontSize: "0.74rem", marginTop: "2px" }}>
            We'll detect and analyze instantly
          </div>
        </div>

        {errorMsg && (
          <div style={{ position: "absolute", bottom: "16px", left: "20px", right: "20px", zIndex: 15, background: "rgba(239,68,68,0.95)", color: "#fff", padding: "12px 16px", borderRadius: "14px", fontSize: "0.82rem", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{errorMsg}</span>
            <button onClick={toggleTorch} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", padding: "4px 10px", borderRadius: "8px", fontSize: "0.75rem", cursor: "pointer", fontWeight: "700" }}>
              Turn On Flash
            </button>
          </div>
        )}
      </div>

      {/* 4. Minimal Sleek Floating Status Sheet Card (Card Surface #1A2233) */}
      <div
        style={{
          padding: "16px 20px 24px 20px",
          background: "#1A2233",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
          zIndex: 20,
          flexShrink: 0,
        }}
      >
        <div style={{ width: "36px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "0 auto 12px auto" }} />

        {/* Minimal Live Status Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06D6A0", boxShadow: "0 0 8px #06D6A0" }} />
            <div>
              <div style={{ fontSize: "0.85rem", color: "#f8fafc", fontWeight: "600" }}>Protected by SentinelQR AI</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>Pre-Transaction Payment Trust Shield</div>
            </div>
          </div>

          {/* Minimal Quick Action Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#2563EB",
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Upload Image from Gallery"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>

            <button
              onClick={triggerVoiceAssist}
              style={{
                background: voiceActive ? "rgba(6, 214, 160, 0.2)" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#06D6A0",
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Voice Guidance Assist"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              </svg>
            </button>

            <button
              onClick={() => setShowPresetsPanel(!showPresetsPanel)}
              style={{
                background: showPresetsPanel ? "rgba(37, 99, 235, 0.2)" : "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#3b82f6",
                height: "40px",
                padding: "0 12px",
                borderRadius: "14px",
                cursor: "pointer",
                fontSize: "0.76rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
              title="Toggle Demo Presets"
            >
              Test Scenarios {showPresetsPanel ? "▼" : "▲"}
            </button>
          </div>
        </div>

        {/* Collapsible Demo Presets Bar */}
        {showPresetsPanel && (
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.1)" }} className="animate-fade">
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginBottom: "10px", textTransform: "uppercase" }}>
              Live Demo Presets
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                onClick={() => triggerAutoCaptureSequence(PRESET_SCENARIOS.authentic_merchant)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "1px solid rgba(16, 185, 129, 0.35)",
                  color: "#10B981",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#10B981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: "600" }}>Authentic Shop</div>
                  <div style={{ fontSize: "0.64rem", opacity: 0.8 }}>Low Risk 5/100</div>
                </div>
              </button>

              <button
                onClick={() => triggerAutoCaptureSequence(PRESET_SCENARIOS.phishing_sticker)}
                style={{
                  padding: "10px 12px",
                  borderRadius: "14px",
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  color: "#EF4444",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#EF4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", fontWeight: "600" }}>Fake QR Alert</div>
                  <div style={{ fontSize: "0.64rem", opacity: 0.8 }}>Danger 88/100</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Help Explainer Modal */}
      {showHelpModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#1A2233",
              borderRadius: "24px",
              padding: "24px",
              maxWidth: "340px",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            className="animate-scale-up"
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "10px", color: "#2563EB", fontFamily: "Poppins, sans-serif" }}>
              How SentinelQR Protects You
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: "1.5", marginBottom: "16px" }}>
              SentinelQR does not just decode QR codes. Once scanned, our multi-signal trust engine inspects the destination for domain age, imposter VPAs, physical sticker swaps, and community fraud flags before you authorize payment.
            </p>
            <button className="btn-primary" onClick={() => setShowHelpModal(false)}>
              Got it
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
