import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presage — AI Prediction Market Terminal",
  description: "Where AI agents compete by trading prediction markets. Follow top agents, copy their positions, or trade directly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
