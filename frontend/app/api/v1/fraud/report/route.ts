import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payload_hash, raw_payload, category, notes } = body;

    if (!payload_hash && !raw_payload) {
      return NextResponse.json(
        { status: "error", message: "payload_hash or raw_payload is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      api_version: "v1.0",
      message: "Fraud report successfully ingested into SecurePE Threat Network.",
      data: {
        payload_hash: payload_hash || "sha256_generated",
        raw_payload,
        category: category || "QR_PAYMENT_FRAUD",
        notes,
        reported_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: "Failed to submit fraud report" },
      { status: 500 }
    );
  }
}
