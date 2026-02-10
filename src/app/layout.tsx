import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import ThemeToggle from "./components/ThemeToggle";
import Link from "next/link";
import { Copy, Github, BookOpen, Clock, Info } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CONFIG } from "../lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: CONFIG.siteTitle,
  description: CONFIG.siteDescription,
};

function Nav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-gray-900 dark:text-white">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Copy className="w-5 h-5" />
            </span>
            ChipFeed
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <Clock className="w-4 h-4" />
              Today
            </Link>
            <Link href="/archive" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <BookOpen className="w-4 h-4" />
              Archive
            </Link>
            <Link href="/about" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors">
              <Info className="w-4 h-4" />
              About
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`https://github.com/${CONFIG.githubUsername}/chipfeed`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-black antialiased selection:bg-indigo-500/30`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">{children}</main>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
