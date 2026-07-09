import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import { getSkill, getSkills } from "@/lib/skills";

export async function generateStaticParams() {
  const skills = await getSkills();
  return skills.map((skill) => ({ name: skill.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const skill = await getSkill(name);
  return { title: `/${skill.name}`, description: skill.description };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const skill = await getSkill(name);
  const html = marked.parse(skill.body) as string;

  return (
    <div className="pt-10">
      <Link
        href="/skills/"
        className="text-sm text-stone-500 underline underline-offset-4 dark:text-stone-400"
      >
        ← スキル一覧に戻る
      </Link>
      <h1 className="mt-4 font-mono text-3xl font-bold text-crail dark:text-coral">
        /{skill.name}
      </h1>
      <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
        {skill.description}
      </p>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 text-sm dark:border-stone-800 dark:bg-stone-900">
        <span className="font-bold">使い方:</span>{" "}
        Claude Code で <code className="rounded bg-clay-50 px-1.5 py-0.5 font-mono dark:bg-clay-900">/{skill.name}</code>{" "}
        と入力するか、上の説明にあるような内容を日本語で話しかけると自動で発動します。
      </div>
      <h2 className="mt-10 mb-3 text-sm font-semibold text-stone-500 dark:text-stone-400">
        スキルの中身(Claude への指示書)
      </h2>
      <article
        className="skill-md overflow-hidden rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
