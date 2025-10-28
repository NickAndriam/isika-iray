import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/Layout";
import I18nProvider from "@/components/I18nProvider";
import SessionProvider from "@/components/SessionProvider";
import TopLoader from "@/components/TopLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Isika iray - Fiaraha-miasa ho an'ny fahafinaretana",
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
      <body className={inter.className}>
        <TopLoader />
        <SessionProvider>
          <I18nProvider>
            <Layout>{children}</Layout>
          </I18nProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
