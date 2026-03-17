import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConspiracyWebSG — Searchable database of conspiracy theories in Singapore",
  description:
    "An educational prototype. Browse claims, verification status, and related articles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-background text-text font-sans">
        <AppShell>
          <main className="flex-1">{children}</main>
        </AppShell>
      </body>
    </html>
  );
}
