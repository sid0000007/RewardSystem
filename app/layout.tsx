import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import StoreInitializer from "@/components/StoreInitializer";
import DailyLoginReward from "@/components/DailyLoginReward";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real Mint - Collect Rewards",
  description:
    "A gamified reward collection app. Scan codes, watch videos, check in at locations, and collect unique digital rewards!",
  keywords: ["rewards", "gamification", "collection", "mobile", "app"],
  authors: [{ name: "Real Mint Team" }],
  creator: "Real Mint",
  publisher: "Real Mint",
  applicationName: "Real Mint",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://realmint.app",
    title: "Real Mint - Collect Rewards",
    description:
      "A gamified reward collection app. Scan codes, watch videos, check in at locations, and collect unique digital rewards!",
    siteName: "Real Mint",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Mint - Collect Rewards",
    description:
      "A gamified reward collection app. Scan codes, watch videos, check in at locations, and collect unique digital rewards!",
    creator: "@realmint",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            {/* Animated background with purple/pink particles */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-100 dark:from-black dark:via-purple-900/20 dark:to-black">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNhODU1ZjciIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10 dark:opacity-30"></div>
            </div>
            <main className="relative z-10 min-h-screen">
              <StoreInitializer />
              <AppLayout>{children}</AppLayout>
              <DailyLoginReward />
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
