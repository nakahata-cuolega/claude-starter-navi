import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ・トラブルシューティング",
  description: "セットアップでつまずきやすいポイントと解決方法をまとめています。",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "「claude: command not found」と出る",
    a: "インストール直後はターミナルが新しいコマンドを認識していないことがあります。ターミナル(PowerShell)をいったん閉じて開き直してから、もう一度「claude」と入力してください。それでも出る場合は「npm install -g @anthropic-ai/claude-code」が成功しているか確認を。",
  },
  {
    q: "npm install で「EACCES」や「permission denied」エラーが出る",
    a: "権限の問題です。「sudo」を付けるのは推奨されません。Macの場合はHomebrewでNode.jsを入れ直す(brew install node)と解消します。それでも出る場合はエラーメッセージ全文をClaude(claude.ai)に貼り付けて聞くのが早道です。",
  },
  {
    q: "ログイン時の認証がうまくいかない / コードがどこに出るかわからない",
    a: "認証用のコードや確認メッセージは、ブラウザではなくターミナルの画面に表示されます。ブラウザでの承認が終わったらターミナルに戻って確認してください。見失った場合はターミナルを上にスクロールすると残っています。やり直しは何度でもOKです。",
  },
  {
    q: "Claude Code の利用にお金はかかる?",
    a: "Claudeの有料プラン(Pro または Max)に加入していればその範囲内で使えます。プランなしの場合はAPIキー(従量課金)でも利用できます。",
  },
  {
    q: "スキルを入れたのに /new-project が出てこない",
    a: "スキルは Claude Code の起動時に読み込まれます。すでに起動していた場合は、いったん終了(exitと入力 or Ctrl+C)して起動し直してください。それでも出ない場合は「ls ~/.claude/skills」でスキルのフォルダが存在するか確認を(Windowsは「dir $HOME\\.claude\\skills」)。",
  },
  {
    q: "PowerShellで「スクリプトの実行が無効」と出る",
    a: "PowerShellのセキュリティ設定によるものです。「Set-ExecutionPolicy -Scope CurrentUser RemoteSigned」を実行してから再試行してください。",
  },
  {
    q: "スキルを最新版に更新したい",
    a: "最初にcloneしたclaude-starterフォルダで「git pull」を実行し、もう一度コピーのコマンド(cp -r claude-starter/skills/* ~/.claude/skills/)を実行してください。",
  },
  {
    q: "エラーが解決できない",
    a: "エラーメッセージをそのままコピーして、claude.ai や Claude Code 自身に貼り付けて質問するのがいちばん確実です。「このエラーを解決して」と頼めば具体的な手順を教えてくれます。",
  },
];

export default function FaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">FAQ・トラブルシューティング</h1>
      <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-300">
        つまずきやすいポイントをまとめました。質問をクリックすると答えが開きます。
      </p>
      <div className="mt-6 space-y-3">
        {FAQS.map((faq) => (
          <details
            key={faq.q}
            className="group rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          >
            <summary className="cursor-pointer list-none p-4 font-bold marker:hidden">
              <span className="mr-2 text-orange-600 dark:text-orange-400">Q.</span>
              {faq.q}
            </summary>
            <p className="border-t border-zinc-100 p-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
