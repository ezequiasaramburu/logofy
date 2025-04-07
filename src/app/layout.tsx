import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const font = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "SimpleLogo - Make Cool Logos & Favicons in Seconds for Free",
  description:
    "Create beautiful custom logos and favicons instantly with SimpleLogo. Free, easy-to-use logo maker with real-time preview. Export in SVG, PNG, and ICO formats. No signup required.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body
        className={cn(
          " bg-background antialiased overflow-y-hidden",
          font.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
