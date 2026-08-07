import { NextResponse } from "next/server";
import { evaluateServerlessThreat } from "@/lib/threatEngine";

export async function POST(request: Request) {
  const startTime = performance.now();
  try {
    const body = await request.json();
    const rawPayload = body.raw_payload;
    const clientMeta = body.client_meta;

    if (!rawPayload) {
      return NextResponse.json({ status: "error", message: "raw_payload is required" }, { status: 400 });
    }

    const result = evaluateServerlessThreat(rawPayload, clientMeta);
    const latencyMs = Math.round(performance.now() - startTime);

    return NextResponse.json({
      status: "success",
      latency_ms: latencyMs,
      data: result,
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: "Serverless execution error" }, { status: 500 });
  }
}
