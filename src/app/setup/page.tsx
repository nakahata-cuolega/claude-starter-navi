import type { Metadata } from "next";
import SetupWizard from "@/components/SetupWizard";

export const metadata: Metadata = {
  title: "セットアップ",
  description: "Claude Codeとスキル一式のセットアップ手順をOS別にナビゲートします。",
};

const ROADMAP = [
  { title: "インストール", body: "Node.js と Claude Code を入れる" },
  { title: "初期設定", body: "ログインして動作確認" },
  { title: "スキル導入", body: "スキル一式をコピーして完了" },
];

export default function SetupPage() {
  return (
    <div className="pt-10">
      <h1 className="font-display text-3xl font-bold">セットアップ</h1>
      <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
        所要時間は15〜30分です。進み具合はこのブラウザに保存されるので、途中で閉じても続きから再開できます。
      </p>

      <ol className="mt-8 mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
        {ROADMAP.map((step, i) => (
          <li key={step.title} className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
            <div className="flex w-full items-center gap-3 sm:justify-center">
              <span className="hidden h-px flex-1 bg-stone-200 sm:block dark:bg-stone-800" style={i === 0 ? { visibility: "hidden" } : undefined} />
              <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-crail bg-white font-bold text-crail dark:border-coral dark:bg-stone-900 dark:text-coral">
                {i + 1}
              </span>
              <span className="hidden h-px flex-1 bg-stone-200 sm:block dark:bg-stone-800" style={i === ROADMAP.length - 1 ? { visibility: "hidden" } : undefined} />
            </div>
            <div>
              <div className="font-bold">{step.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                {step.body}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <SetupWizard />
    </div>
  );
}
