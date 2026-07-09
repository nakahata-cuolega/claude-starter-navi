import type { Metadata } from "next";
import Link from "next/link";
import { getSkills, REPO_URL } from "@/lib/skills";

export const metadata: Metadata = {
  title: "スキル一覧",
  description: "導入できるClaude Codeスキルの一覧です。",
};

export default async function SkillsPage() {
  const skills = await getSkills();

  return (
    <div>
      <h1 className="text-2xl font-bold">スキル一覧</h1>
      <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-300">
        <a href={REPO_URL} className="underline underline-offset-4">
          claude-starter リポジトリ
        </a>
        に収録されているスキルです。セットアップを終えると、Claude Code に話しかけるだけで使えます。
      </p>
      <div className="mt-6 space-y-3">
        {skills.map((skill) => (
          <Link
            key={skill.name}
            href={`/skills/${skill.name}/`}
            className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-orange-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-500"
          >
            <div className="font-mono text-lg font-bold text-orange-600 dark:text-orange-400">
              /{skill.name}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {skill.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
