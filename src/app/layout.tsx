import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import {
  THEME_BOOT_SCRIPT,
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
} from "@/lib/theme/theme";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Agily",
  description: "Local team workspace. Own SQLite. No cloud APIs.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Agily",
    statusBarStyle: "default",
  },
  icons: {
    apple: [{ url: "/globe.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR_DARK },
    { color: THEME_COLOR_LIGHT },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full light", "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-ink text-paper antialiased">
        <Script
          id="agily-theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
