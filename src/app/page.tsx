import Link from "next/link";
import { getSkills } from "@/lib/skills";

const FEATURES = [
  {
    emoji: "🗺️",
    title: "迷わないセットアップ",
    body: "Mac / Windows / WSL を選ぶだけで、あなた専用の手順が表示されます。コマンドはコピーして貼るだけ。つまずきやすい所には先回りの注意書き付き。",
  },
  {
    emoji: "🧰",
    title: "すぐ使えるスキル集",
    body: "「新規プロジェクトの一発作成」「繰り返し作業の自動化」など、実際に使われているスキルをそのまま導入できます。",
  },
  {
    emoji: "💬",
    title: "話しかけるだけ",
    body: "導入後は「新しいサイトを作りたい」のように日本語で話しかけるだけ。スキルが自動で発動して作業を進めてくれます。",
  },
];

export default async function Home() {
  const skills = await getSkills();

  return (
    <div className="space-y-16">
      <section className="pt-8 text-center">
        <h1 className="text-3xl font-bold leading-snug sm:text-4xl">
          Claude Code を、
          <br className="sm:hidden" />
          <span className="text-orange-600 dark:text-orange-400">今日から使いこなす</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600 dark:text-zinc-300">
          AIコーディングエージェント「Claude Code」のインストールから、
          実戦で使えるスキルの導入までをステップバイステップでナビゲートします。
          ターミナルに慣れていなくても大丈夫。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/setup/"
            className="rounded-xl bg-orange-600 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-orange-500"
          >
            セットアップを始める →
          </Link>
          <Link
            href="/skills/"
            className="rounded-xl border border-zinc-300 bg-white px-6 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            スキルを見る
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-2xl">{f.emoji}</div>
            <h2 className="mt-2 font-bold">{f.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {f.body}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold">収録スキル</h2>
        <div className="mt-4 space-y-3">
          {skills.map((skill) => (
            <Link
              key={skill.name}
              href={`/skills/${skill.name}/`}
              className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-orange-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500"
            >
              <div className="font-mono font-bold text-orange-600 dark:text-orange-400">
                /{skill.name}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {skill.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
