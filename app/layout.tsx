import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VISTARA — Plan journeys together",
    template: "%s — VISTARA",
  },
  description: "A calm, collaborative workspace for planning meaningful journeys.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
