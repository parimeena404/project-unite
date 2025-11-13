import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project UNITE",
  description: "Reconnecting the World Digitally - Project UNITE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-[#050406] via-[#071428] to-[#001219] text-zinc-100`}
      >
        <header className="mx-auto max-w-7xl px-6 py-6">
          <nav className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <span className="inline-block h-9 w-9 rounded-full bg-gradient-to-br from-[#00f6ff] to-[#6bffb8] shadow-[0_0_20px_rgba(107,255,184,0.12)]" />
              <span className="font-semibold text-lg tracking-tight">Project UNITE</span>
            </a>
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a href="/" className="hover:text-[#6bffb8]">Home</a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-[#6bffb8]">Dashboard</a>
              </li>
              <li>
                <a href="/login" className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800/60">Login</a>
              </li>
            </ul>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
