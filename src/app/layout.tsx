import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChipFeed — Daily Hardware & AI News",
  description:
    "Daily aggregation of trending GitHub repos and arXiv papers in hardware design, AI accelerators, and related topics.",
};

function Nav() {
  return (
    <nav className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            ChipFeed
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Today
            </Link>
            <Link href="/archive" className="hover:text-blue-600 dark:hover:text-blue-400">
              Archive
            </Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
              About
            </Link>
          </div>
        </div>
        <ThemeToggle />
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
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
