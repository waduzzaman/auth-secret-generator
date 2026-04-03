import * as React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecretGen | Secure Auth Secret Generator",
  description: "Generate cryptographically strong, high-entropy authentication secrets for your applications. Supports Hex, Base64, and Base64URL formats.",
  keywords: ["secret generator", "auth secret", "cryptography", "web crypto api", "security tool", "developer tools"],
  authors: [{ name: "SecretGen Team" }],
  openGraph: {
    title: "SecretGen | Secure Auth Secret Generator",
    description: "Generate cryptographically strong authentication secrets locally in your browser.",
    type: "website",
    url: "https://secretgen.app",
    siteName: "SecretGen",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecretGen | Secure Auth Secret Generator",
    description: "Generate cryptographically strong authentication secrets locally in your browser.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased selection:bg-primary/30`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative min-h-screen overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 -z-10 bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500" />
            <div className="fixed inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
            
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
