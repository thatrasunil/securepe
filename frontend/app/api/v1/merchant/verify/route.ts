import { NextResponse } from "next/server";
import { evaluateServerlessThreat } from "@/lib/threatEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { merchant_id, qr_payload } = body;

    if (!qr_payload) {
      return NextResponse.json(
        { status: "error", message: "qr_payload is required" },
        { status: 400 }
      );
    }

    const threatResult = evaluateServerlessThreat(qr_payload);
    const isImpersonated = !!threatResult.signals.brand_impersonation;
    const isTampered = threatResult.signals.sticker_tamper_detected;

    const isVerified = !isImpersonated && !isTampered && threatResult.risk_level === "SAFE";

    return NextResponse.json({
      status: "success",
      api_version: "v1.0",
      data: {
        merchant_id: merchant_id || "MCH-8821",
        verified: isVerified,
        display_name: threatResult.signals.display_name || "Merchant Store",
        vpa: threatResult.signals.vpa || qr_payload,
        trust_score: Math.max(0, 100 - threatResult.risk_score),
        historical_scans: threatResult.signals.sentinel_memory?.historical_scans_count || 142,
        reason: isVerified
          ? "MERCHANT_AUTHENTICITY_CONFIRMED"
          : isImpersonated
          ? "PAYMENT_DESTINATION_IMPERSONATION_DETECTED"
          : "HIGH_RISK_SUSPICIOUS_PAYLOAD",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to verify merchant QR" },
      { status: 500 }
    );
  }
}
