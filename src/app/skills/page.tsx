import type { Metadata } from "next";
import Link from "next/link";
import { getSkills, REPO_URL } from "@/lib/skills";
import { CATEGORY_ORDER, skillCategory } from "@/lib/skill-meta";

export const metadata: Metadata = {
  title: "スキル一覧",
  description: "導入できるClaude Codeスキルの一覧です。",
};

export default async function SkillsPage() {
  const skills = await getSkills();
  const ordered = [...skills].sort((a, b) => {
    const diff =
      CATEGORY_ORDER.indexOf(skillCategory(a.name)) -
      CATEGORY_ORDER.indexOf(skillCategory(b.name));
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  return (
    <div className="pt-10">
      <h1 className="font-display text-3xl font-bold">スキル一覧</h1>
      <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
        <a href={REPO_URL} className="text-crail underline underline-offset-4 dark:text-coral">
          claude-starter リポジトリ
        </a>
        に収録されているスキルです。セットアップを終えると、Claude Code に話しかけるだけで使えます。
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {ordered.map((skill) => (
          <Link
            key={skill.name}
            href={`/skills/${skill.name}/`}
            className="rounded-xl border border-stone-200 bg-white p-4 transition hover:border-crail/60 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:hover:border-coral/60"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-base font-bold text-crail dark:text-coral">
                /{skill.name}
              </span>
              <span className="rounded-full bg-clay-50 px-2.5 py-0.5 text-[11px] font-medium text-crail dark:bg-clay-900 dark:text-coral">
                {skillCategory(skill.name)}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
              {skill.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
