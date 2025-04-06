import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const font = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "Logofy",
  description: "Make your logo in seconds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
