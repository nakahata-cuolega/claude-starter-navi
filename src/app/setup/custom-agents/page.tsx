import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "役割ごとのカスタムエージェントを作る",
  description:
    "Claude Codeのサブエージェント機能で、役割ごとに特化したAIを定義し、必要な時だけ委譲する方法。",
};

function Code({ text }: { text: string }) {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#1d1a17] p-3 dark:bg-black">
      <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed whitespace-pre text-stone-100">
        {text}
      </pre>
      <CopyButton text={text} />
    </div>
  );
}

const RESEARCHER_AGENT = `---
name: researcher
description: 特定のテーマについて外部情報を調べ、要点をまとめる。「〜について調べて」「〜の最新動向を知りたい」と言われたら使う。
model: sonnet
tools: WebSearch, WebFetch, Read
---

あなたはリサーチ専任のエージェントです。

与えられたテーマについて情報を集め、要点を3〜5個の箇条書きで返してください。
実装や意見の主張はせず、事実の整理に徹してください。`;

const ROLE_EXAMPLES = [
  {
    role: "researcher",
    trigger: "「〜について調べて」で使う",
    job: "外部情報の収集・要約に専念させる",
    model: "sonnet(正確さ重視)",
  },
  {
    role: "writer",
    trigger: "「ブログ書いて」「コピー案考えて」で使う",
    job: "文章・コピーの下書きを何本も出させる",
    model: "発想の広さを優先するモデル",
  },
  {
    role: "reviewer",
    trigger: "「レビューして」「粗探しして」で使う",
    job: "コードや文章の問題点を指摘させる(実装はさせない)",
    model: "sonnet(精度重視)",
  },
];

export default function CustomAgentsPage() {
  return (
    <div className="pt-10">
      <p className="text-sm font-semibold text-crail dark:text-coral">応用編</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-balance">
        役割ごとのカスタムエージェントを作る
      </h1>
      <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
        調べ物も、文章の下書きも、コードのレビューも同じ1つの会話に混ぜていると、指示が増えるほど
        「今どのルールを優先すべきか」が曖昧になっていきます。役割ごとに専用のエージェントを
        1体ずつ用意しておくと、それぞれに必要なルールだけを持たせられます。
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">仕組み</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude/agents/</code>
          に1つのMarkdownファイルを置くだけです。冒頭のfrontmatterで名前・呼び出し条件・使うモデル・使えるツールを指定し、
          本文にその役割専用の振る舞いを書きます。
        </p>
        <Code text={RESEARCHER_AGENT} />
        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">description</code> はメイン側が
          「この依頼をどのエージェントに振るか」を判断する材料になります。ユーザーが実際に言いそうな言葉(トリガーフレーズ)を
          具体的に書くほど、狙った場面で委譲されやすくなります。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">役割の例</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          汎用的な3つの例です。自分の作業に合わせて名前・トリガー・モデルを入れ替えれば、そのまま使えます。
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 dark:bg-stone-900 dark:text-stone-400">
              <tr>
                <th className="p-3 font-semibold">役割</th>
                <th className="p-3 font-semibold">呼び出され方</th>
                <th className="p-3 font-semibold">やらせること</th>
                <th className="p-3 font-semibold">モデルの考え方</th>
              </tr>
            </thead>
            <tbody>
              {ROLE_EXAMPLES.map((r) => (
                <tr key={r.role} className="border-t border-stone-200 dark:border-stone-800">
                  <td className="p-3 font-mono text-xs">{r.role}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">{r.trigger}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">{r.job}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300">{r.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">委譲は一時的</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          エージェントへの委譲は、その依頼が終わるまでだけ有効です。作業が終われば、会話は自動的に
          もとのメインのやり取りへ戻ります。「ずっとこの役割で話したい」という場合は、委譲ではなく
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">/model</code>
          コマンドでセッション全体のモデルを切り替える方法もあります。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">モデルを役割ごとに使い分ける</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          エージェントごとに<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">model</code>を指定できるので、
          アイデア出しのように発想の幅がほしい役割と、実装やレビューのように正確さがほしい役割とで、
          異なるモデルを割り当てられます。1つのモデルに全部やらせるより、役割に合った特性のモデルを選んだほうが
          結果が安定することがあります。
        </p>
      </section>

      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm text-stone-600 dark:text-stone-300">
          作ったエージェントを他のPCでも使えるようにする方法は
          {" "}
          <Link href="/setup/multi-pc/" className="text-crail underline underline-offset-4 dark:text-coral">
            複数のPCで同じ環境を使う
          </Link>
          へ。導入したスキルの使い方は
          {" "}
          <Link href="/skills/" className="text-crail underline underline-offset-4 dark:text-coral">
            スキル一覧
          </Link>
          へ。
        </p>
      </div>
    </div>
  );
}
