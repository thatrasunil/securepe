import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { raw_payload, category, notes } = body;

    return NextResponse.json({
      status: "success",
      message: `Community fraud report for ${raw_payload} logged successfully.`,
      data: { raw_payload, category, notes, timestamp: new Date().toISOString() },
    });
  } catch (err) {
    return NextResponse.json({ status: "error", message: "Failed to submit report" }, { status: 500 });
  }
}
