import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientInitializer } from "@/components/layout/ClientInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IPO Tracker",
  description: "Halka Arz Takip Uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div className="mesh-background" />
        <ClientInitializer />
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto py-6 relative z-10">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
