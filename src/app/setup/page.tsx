import type { Metadata } from "next";
import SetupWizard from "@/components/SetupWizard";

export const metadata: Metadata = {
  title: "セットアップ",
  description: "Claude Codeとスキル一式のセットアップ手順をOS別にナビゲートします。",
};

export default function SetupPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">セットアップ</h1>
      <p className="mt-2 mb-8 leading-relaxed text-zinc-600 dark:text-zinc-300">
        所要時間は15〜30分です。進み具合はこのブラウザに保存されるので、途中で閉じても続きから再開できます。
      </p>
      <SetupWizard />
    </div>
  );
}
