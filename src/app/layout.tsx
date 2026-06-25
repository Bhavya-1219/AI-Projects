import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "GourmetGo | Premium Food Delivery & Restaurant Finder",
    template: "%s | GourmetGo"
  },
  description: "Craving delicious food? GourmetGo delivers hot, fresh, premium meals from the best local restaurants straight to your doorstep. Fast, reliable, and trackable.",
  keywords: ["food delivery", "gourmet", "restaurants near me", "order food online", "veggie options", "fast delivery"],
  authors: [{ name: "GourmetGo" }],
  openGraph: {
    title: "GourmetGo | Premium Food Delivery",
    description: "Craving delicious food? GourmetGo delivers hot, fresh, premium meals from the best local restaurants.",
    url: "https://gourmetgo.com",
    siteName: "GourmetGo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GourmetGo | Premium Food Delivery",
    description: "Craving delicious food? GourmetGo delivers hot, fresh, premium meals.",
  },
  icons: {
    icon: "/favicon.ico",
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

