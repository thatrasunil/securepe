import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelQR — Fintech Payment Fraud Shield AI",
  description: "AI-powered pre-transaction security shield for payment QR codes. Detects fake stickers, phishing URLs, and imposter merchants before you lose money.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
