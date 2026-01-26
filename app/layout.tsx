import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import AuthGate from "@/components/auth-gate";
import StructuredData from "@/components/structured-data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Keith O'Brien | B2B Tech Ghostwriter",
    template: "%s | Keith O'Brien",
  },
  description:
    "B2B tech ghostwriter helping executives and companies create thought leadership content that builds authority and drives results.",
  keywords: [
    "ghostwriter",
    "B2B content",
    "thought leadership",
    "tech writing",
    "executive ghostwriter",
    "LinkedIn ghostwriter",
    "content strategy",
  ],
  authors: [{ name: "Keith O'Brien" }],
  creator: "Keith O'Brien",
  metadataBase: new URL("https://keithobrien.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://keithobrien.com",
    siteName: "Keith O'Brien",
    title: "Keith O'Brien | B2B Tech Ghostwriter",
    description:
      "B2B tech ghostwriter helping executives and companies create thought leadership content that builds authority and drives results.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keith O'Brien | B2B Tech Ghostwriter",
    description:
      "B2B tech ghostwriter helping executives and companies create thought leadership content that builds authority and drives results.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-white text-gray-900`}
      >
        <AuthGate>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <Nav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthGate>
      </body>
    </html>
  );
}
