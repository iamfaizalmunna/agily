import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agily",
  description: "Local team workspace. Own SQLite. No cloud APIs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#12100e",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-dvh flex-col bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
