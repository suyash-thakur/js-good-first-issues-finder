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
  title: "FirstIssue - Find Your First Open Source Contribution",
  description: "Discover beginner-friendly GitHub issues from top repositories. Start your open source journey with curated good first issues that match your skills.",
  keywords: "open source, github, first contribution, good first issue, beginner friendly, coding, programming",
  openGraph: {
    title: "FirstIssue - Open Source Gateway",
    description: "Find your perfect first open source contribution from curated GitHub issues",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Enhanced decorative background with gradient mesh */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Primary gradient orb */}
          <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/15 via-cyan-400/15 to-teal-400/15 blur-3xl" />
          
          {/* Secondary gradient orb */}
          <div className="absolute top-1/2 -right-48 h-96 w-96 rounded-full bg-gradient-to-bl from-blue-400/15 via-sky-400/15 to-cyan-400/15 blur-3xl" />
          
          {/* Tertiary gradient orb */}
          <div className="absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-gradient-to-tr from-teal-400/15 via-emerald-400/15 to-green-400/15 blur-3xl" />
          
          {/* Mesh overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,theme(colors.background))]" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,theme(colors.foreground)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.foreground)_1px,transparent_1px)] [background-size:64px_64px]" />
          
          {/* Noise texture for depth */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light noise-texture" />
        </div>

        {children}
      </body>
    </html>
  );
}
