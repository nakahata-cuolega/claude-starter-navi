import Link from "next/link";
import { getSkills } from "@/lib/skills";
import { FEATURED_SKILLS, skillCategory } from "@/lib/skill-meta";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    title: "迷わないセットアップ",
    body: "Mac / Windows / WSL を選ぶだけで、あなた専用の手順が表示されます。コマンドはコピーして貼るだけ。つまずきやすい所には先回りの注意書き付き。",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "すぐ使えるスキル集",
    body: "「新規プロジェクトの一発作成」「繰り返し作業の自動化」など、実際に使われているスキルをそのまま導入できます。",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z" />
      </svg>
    ),
    title: "話しかけるだけ",
    body: "導入後は「新しいサイトを作りたい」のように日本語で話しかけるだけ。スキルが自動で発動して作業を進めてくれます。",
  },
];

const TERM_LINES = [
  { delay: "0.2s", prompt: true, text: "新しいサイトを作りたい" },
  { delay: "1.0s", prompt: false, text: "✻ 了解です。Next.js でプロジェクトを作成します…" },
  { delay: "1.8s", prompt: false, text: "✓ ポートフォリオサイトができました" },
];

export default async function Home() {
  const skills = await getSkills();
  const featured = FEATURED_SKILLS.map((name) =>
    skills.find((s) => s.name === name)
  ).filter((s) => s !== undefined);
  const picks = featured.length > 0 ? featured : skills.slice(0, 4);

  return (
    <div>
      <section className="aurora full-bleed">
        <div className="mx-auto grid max-w-4xl items-center gap-10 px-4 py-16 sm:grid-cols-[1.1fr_1fr] sm:py-24">
          <div className="text-center sm:text-left">
            <h1 className="font-display text-4xl font-bold leading-snug tracking-tight sm:text-5xl">
              Claude Code を、
              <br />
              <span className="text-crail dark:text-coral">今日から使いこなす</span>
            </h1>
            <p className="mt-5 leading-relaxed text-stone-700 dark:text-stone-300">
              AIコーディングエージェント「Claude Code」のインストールから、
              実戦で使えるスキルの導入までをステップバイステップでナビゲートします。
              ターミナルに慣れていなくても大丈夫。
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link
                href="/setup/"
                className="rounded-xl bg-crail px-6 py-3 font-bold text-white shadow-sm transition hover:bg-coral"
              >
                セットアップを始める →
              </Link>
              <Link
                href="/skills/"
                className="rounded-xl border border-stone-300/80 bg-white/60 px-6 py-3 font-bold text-stone-700 backdrop-blur transition hover:bg-white dark:border-stone-700 dark:bg-stone-900/60 dark:text-stone-200 dark:hover:bg-stone-900"
              >
                スキルを見る
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-xl border border-stone-700/60 bg-[#1d1a17] shadow-xl shadow-crail/10">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="ml-2 font-mono text-[11px] text-stone-400">claude</span>
              </div>
              <div className="space-y-2.5 px-4 py-4 font-mono text-[13px] leading-relaxed">
                {TERM_LINES.map((line) => (
                  <p
                    key={line.text}
                    className={`term-line ${
                      line.prompt ? "text-stone-100" : "text-stone-400"
                    } ${line.text.startsWith("✓") ? "text-emerald-400/90" : ""}`}
                    style={{ animationDelay: line.delay }}
                  >
                    {line.prompt && <span className="mr-2 text-coral">❯</span>}
                    {line.text}
                  </p>
                ))}
                <p className="term-line text-stone-100" style={{ animationDelay: "2.5s" }}>
                  <span className="mr-2 text-coral">❯</span>
                  <span className="term-caret" aria-hidden="true" />
                </p>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-stone-500 dark:text-stone-400">
              導入後の Claude Code との会話イメージ
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="inline-flex rounded-lg bg-clay-50 p-2.5 text-crail dark:bg-clay-900 dark:text-coral">
              {f.icon}
            </div>
            <h2 className="mt-3 font-bold">{f.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {f.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold">収録スキル</h2>
          <Link
            href="/skills/"
            className="text-sm font-medium text-crail hover:underline underline-offset-4 dark:text-coral"
          >
            すべて見る({skills.length}) →
          </Link>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {picks.map((skill) => (
            <Link
              key={skill.name}
              href={`/skills/${skill.name}/`}
              className="group rounded-xl border border-stone-200 bg-white p-4 transition hover:border-crail/60 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:hover:border-coral/60"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-crail dark:text-coral">
                  /{skill.name}
                </span>
                <span className="rounded-full bg-clay-50 px-2.5 py-0.5 text-[11px] font-medium text-crail dark:bg-clay-900 dark:text-coral">
                  {skillCategory(skill.name)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                {skill.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
