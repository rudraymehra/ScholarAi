import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ScholarAI - AI-Powered Research Assistant",
  description:
    "Ask any research question and get instant, cited answers from 200M+ academic papers. Powered by Veritus Search API.",
  keywords: [
    "research",
    "AI",
    "academic",
    "papers",
    "citations",
    "Veritus",
    "machine learning",
    "science",
  ],
  authors: [{ name: "ScholarAI Team" }],
  openGraph: {
    title: "ScholarAI - AI-Powered Research Assistant",
    description:
      "Ask any research question and get instant, cited answers from 200M+ academic papers.",
    type: "website",
    locale: "en_US",
    siteName: "ScholarAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScholarAI - AI-Powered Research Assistant",
    description:
      "Ask any research question and get instant, cited answers from 200M+ academic papers.",
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
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
