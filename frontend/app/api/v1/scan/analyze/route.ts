import { NextResponse } from "next/server";
import { evaluateServerlessThreat } from "@/lib/threatEngine";

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const rawPayload = body.qr_payload || body.raw_payload;
    const context = body.context;

    if (!rawPayload) {
      return NextResponse.json(
        { status: "error", message: "qr_payload is required" },
        { status: 400 }
      );
    }

    const result = evaluateServerlessThreat(rawPayload, context?.location);
    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      status: "success",
      api_version: "v1.0",
      latency_ms: latencyMs,
      timestamp: new Date().toISOString(),
      data: {
        risk_score: result.risk_score,
        risk_level: result.risk_level,
        recommendation: result.explanation.recommended_action,
        qr_type: result.qr_type,
        signals: result.signals,
        explanation: result.explanation,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Internal trust engine execution error" },
      { status: 500 }
    );
  }
}
