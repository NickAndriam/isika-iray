import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isika iray - Fiaraha-miasa ho an'ny taninjanaka",
  description:
    "A revolutionary, mobile-first social-good platform built for Madagascar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mg">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
