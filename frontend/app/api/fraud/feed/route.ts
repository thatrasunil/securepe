import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET() {
  const feed = [
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

  return NextResponse.json({ status: "success", feed });
}
