import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "TTS Blog",
    template: "%s | TTS Blog",
  },
  description: "Hệ thống chuyển văn bản thành giọng nói - TTS Blog chia sẻ kiến thức về công nghệ Text-to-Speech",
  keywords: ["TTS", "text to speech", "giọng nói", "chuyển văn bản thành giọng nói", "AI voice"],
  authors: [{ name: "Phú Nguyễn" }],
  openGraph: {
    title: "TTS Blog",
    description: "Hệ thống chuyển văn bản thành giọng nói",
    images: ["/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
