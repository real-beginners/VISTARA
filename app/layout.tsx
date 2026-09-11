import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VISTARA — Plan journeys together",
    template: "%s — VISTARA",
  },
  description: "Discover places, plan journeys, and create memories together with Vistara.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
