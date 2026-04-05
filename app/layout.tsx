import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "KOBUL - výsledkový výcuc z ORISu",
  description: "Jednoduchý výsledkový výcuc z ORISu pro KOBUL",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
