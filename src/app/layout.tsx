import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { REPO_URL } from "@/lib/skills";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://claude-starter-navi.onrender.com";
const DESCRIPTION =
  "Claude Codeのセットアップから、すぐ使えるスキルの導入までをステップバイステップでナビゲートします。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Claude Code スターターナビ",
    template: "%s | Claude Code スターターナビ",
  },
  description: DESCRIPTION,
  openGraph: {
    title: "Claude Code スターターナビ",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Claude Code スターターナビ",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/ogp.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claude Code スターターナビ",
    description: DESCRIPTION,
    images: ["/ogp.jpg"],
  },
};

const NAV = [
  { href: "/setup/", label: "セットアップ" },
  { href: "/skills/", label: "スキル" },
  { href: "/faq/", label: "FAQ" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-3 sm:px-4">
            <Link href="/" className="flex min-w-0 items-center gap-1.5 font-bold whitespace-nowrap">
              <span className="text-lg">🧭</span>
              <span className="text-sm sm:text-base">
                <span className="hidden sm:inline">Claude Code </span>
                スターターナビ
              </span>
            </Link>
            <nav className="flex shrink-0 items-center gap-0.5 text-xs sm:gap-1 sm:text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-2 py-1.5 whitespace-nowrap text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 sm:px-3 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <a href={REPO_URL} className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100">
            GitHub: claude-starter
          </a>
        </footer>
      </body>
    </html>
  );
}
