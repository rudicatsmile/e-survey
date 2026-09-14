import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SurveiKepuasan - Platform Survey Kepuasan Masyarakat Multi-Rumah Sakit",
  description:
    "Sistem pengukuran kepuasan masyarakat berbasis unit layanan rumah sakit secara transparan, real-time, dan terstandarisasi IKM.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased flex flex-col font-sans">
        <ThemeProvider defaultTheme="light" storageKey="surveikepuasan-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
