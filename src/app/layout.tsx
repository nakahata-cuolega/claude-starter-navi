import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Noto_Sans_JP, Zen_Old_Mincho } from "next/font/google";
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

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  preload: false,
});

const zenOldMincho = Zen_Old_Mincho({
  variable: "--font-zen-old-mincho",
  weight: ["700", "900"],
  subsets: ["latin"],
  preload: false,
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

function CompassMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${zenOldMincho.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink dark:bg-ink dark:text-stone-100 font-sans">
        <header className="sticky top-0 z-10 border-b border-stone-200/70 bg-paper/85 backdrop-blur dark:border-stone-800/70 dark:bg-ink/85">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-2 px-3 sm:px-4">
            <Link href="/" className="flex min-w-0 items-center gap-2 font-bold whitespace-nowrap">
              <CompassMark className="size-5 shrink-0 text-crail dark:text-coral" />
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
                  className="rounded-md px-2 py-1.5 whitespace-nowrap text-stone-600 transition hover:bg-clay-50 hover:text-ink sm:px-3 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-16">{children}</main>
        <footer className="border-t border-stone-200 py-10 dark:border-stone-800">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
            <div>
              <div className="flex items-center justify-center gap-2 font-bold sm:justify-start">
                <CompassMark className="size-4 text-crail dark:text-coral" />
                Claude Code スターターナビ
              </div>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                インストールからスキル導入まで、迷わずたどり着くための道案内。
              </p>
            </div>
            <div className="flex gap-8 text-sm">
              <nav className="flex flex-col gap-2">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-stone-600 hover:text-crail dark:text-stone-400 dark:hover:text-coral"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2">
                <a
                  href={REPO_URL}
                  className="text-stone-600 hover:text-crail dark:text-stone-400 dark:hover:text-coral"
                >
                  GitHub: claude-starter
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
