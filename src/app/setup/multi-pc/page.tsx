import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "複数のPCで同じ環境を使う",
  description:
    "設定・スキル・長期メモリをGitリポジトリで管理し、symlinkで複数のMac/Windowsに同じClaude Code環境を再現する方法。",
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

const INSTALL_SH = `#!/bin/bash
# claude-env installer: symlinks Claude Code config into ~/.claude
# Usage: ./install.sh   (safe to re-run; backs up existing real files)
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
BACKUP_DIR="$CLAUDE_DIR/pre-claude-env-backup-$(date +%Y%m%d%H%M%S)"

mkdir -p "$CLAUDE_DIR"

link() {
  local src="$REPO_DIR/claude/$1"
  local dst="$CLAUDE_DIR/$1"
  if [ -e "$dst" ] && [ ! -L "$dst" ]; then
    mkdir -p "$BACKUP_DIR"
    mv "$dst" "$BACKUP_DIR/"
  fi
  ln -sfn "$src" "$dst"
  echo "linked $dst -> $src"
}

link CLAUDE.md
link settings.json
link skills
link agents

# Memory lives under a home-path-encoded folder name, so compute it here.
HOME_PROJECT_DIR="$CLAUDE_DIR/projects/$(echo "$HOME" | tr '/.' '--')"
MEMORY_DST="$HOME_PROJECT_DIR/memory"
mkdir -p "$REPO_DIR/claude/memory/home" "$HOME_PROJECT_DIR"
if [ -e "$MEMORY_DST" ] && [ ! -L "$MEMORY_DST" ]; then
  mkdir -p "$BACKUP_DIR"
  mv "$MEMORY_DST" "$BACKUP_DIR/memory"
fi
ln -sfn "$REPO_DIR/claude/memory/home" "$MEMORY_DST"
echo "linked $MEMORY_DST -> $REPO_DIR/claude/memory/home"

echo "Done. New Claude Code sessions will pick up this config."`;

const INSTALL_PS1 = `# claude-env installer for Windows (PowerShell)
# Requires: Developer Mode ON (Settings > System > For developers)
$ErrorActionPreference = "Stop"

$RepoDir = $PSScriptRoot
$ClaudeDir = Join-Path $HOME ".claude"

function Link-Item($name) {
    $src = Join-Path $RepoDir "claude\\$name"
    $dst = Join-Path $ClaudeDir $name
    if (Test-Path $dst) { Remove-Item $dst -Force -Recurse:$false }
    New-Item -ItemType SymbolicLink -Path $dst -Target $src | Out-Null
    Write-Host "linked $dst -> $src"
}

Link-Item "CLAUDE.md"
Link-Item "settings.json"
Link-Item "skills"
Link-Item "agents"

# Memory lives under a home-path-encoded folder name, so compute it here.
$HomeProjectName = $HOME -replace '[:\\\\/.]', '-'
$MemoryDst = Join-Path $ClaudeDir "projects\\$HomeProjectName\\memory"
$MemorySrc = Join-Path $RepoDir "claude\\memory\\home"
New-Item -ItemType Directory -Force -Path $MemorySrc, (Split-Path $MemoryDst) | Out-Null
if (Test-Path $MemoryDst) { Remove-Item $MemoryDst -Force -Recurse:$false }
New-Item -ItemType SymbolicLink -Path $MemoryDst -Target $MemorySrc | Out-Null
Write-Host "linked $MemoryDst -> $MemorySrc"`;

const GITIGNORE = `.DS_Store
*.local.json
.env*
!.env.example
node_modules/`;

const CLONE_MAC = `gh repo clone <あなたのGitHubアカウント>/claude-env ~/claude-env
cd ~/claude-env && ./install.sh`;

const CLONE_WIN = `gh repo clone <あなたのGitHubアカウント>/claude-env $HOME\\claude-env
cd $HOME\\claude-env
powershell -ExecutionPolicy Bypass -File .\\install.ps1`;

const DELEGATE_PROMPT = `このPCに、前のPCと同じClaude Code環境を再現してください。

1. \`gh auth status\` を確認し、未ログインなら \`gh auth login\` を実行して(ブラウザ認証は私がやります)
2. \`gh repo clone <あなたのGitHubアカウント>/claude-env ~/claude-env\` でリポジトリを取得
3. \`cd ~/claude-env\` で \`./install.sh\`(Windowsネイティブなら \`install.ps1\`)を実行
4. うまくリンクできたか、\`ls -la ~/.claude\` の結果を見せてください`;

export default function MultiPcSetupPage() {
  return (
    <div className="pt-10">
      <p className="text-sm font-semibold text-crail dark:text-coral">応用編</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-balance">
        複数のPCで同じ環境を使う
      </h1>
      <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
        <Link href="/setup/" className="text-crail underline underline-offset-4 dark:text-coral">
          セットアップ
        </Link>
        を終えたPCが2台目、3台目になってくると、「あのスキル、こっちのPCには入れてないな」が起き始めます。
        設定・スキル・長期メモリの実体をGitリポジトリに置き、<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude</code>
        からはそこへのシンボリックリンクを張るようにしておくと、新しいPCでは「リポジトリをcloneしてスクリプトを1本実行する」だけで済むようになります。
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">なぜsymlink方式なのか</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude</code> の中身をそのままGit管理下に置くこともできますが、
          Claude Code自体には手を加えたくありません。そこで実体は別のリポジトリフォルダに置き、
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude/skills</code> のような場所からはリンクを張るだけにします。
          Claude Codeからは今まで通りの場所に見えるので、動作は何も変わりません。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">1. 専用リポジトリを作る</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          GitHubにprivateリポジトリを1つ作り(設定には仕事のやり方や固有名詞が写り込むので、privateを推奨)、次の構成にします。
        </p>
        <Code
          text={`claude/
  CLAUDE.md       # グローバル指示(全プロジェクト共通)
  settings.json   # モデル・権限などの設定
  skills/         # 自作スキル
  agents/         # カスタムサブエージェント定義
  memory/home/    # 長期メモリの実体
install.sh        # macOS / Linux / WSL 用インストーラ
install.ps1       # Windowsネイティブ用インストーラ`}
        />
        <p className="mt-3 leading-relaxed text-stone-600 dark:text-stone-300">
          APIキーなどのシークレットは<strong>絶対にこのリポジトリへ入れません</strong>。<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">.gitignore</code> を必ず用意します。
        </p>
        <Code text={GITIGNORE} />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">2. install.sh / install.ps1 を用意する</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          役割は「<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">CLAUDE.md</code>・<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">settings.json</code>・<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">skills</code>・<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">agents</code>」をリンクし、既存の実体があれば上書きせずバックアップに退避してからリンクを張る」だけです。そのままコピーして使えます。
        </p>
        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">macOS / Linux / WSL 用(install.sh)</p>
        <Code text={INSTALL_SH} />
        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Windowsネイティブ用(install.ps1)</p>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          事前に「設定 &gt; システム &gt; 開発者向け &gt; 開発者モード」を<strong>オン</strong>にしてください(シンボリックリンク作成に必要)。
        </p>
        <Code text={INSTALL_PS1} />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">3. 長期メモリのパスに注意する</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          Claude Codeの長期メモリは <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude/skills</code> のような固定パスではなく、
          <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">~/.claude/projects/&lt;ホームパスをエンコードした名前&gt;/memory</code> という、
          PCごとに変わるパスに保存されます。上のスクリプトはその場でホームパスから同じ名前を計算してリンクを張るので、
          手作業でパスを調べる必要はありません。なお、会話履歴(セッションのログ)はこのフォルダの隣に別ファイルとして保存されますが、
          同期対象には含めていません。ログには機微な内容が残りやすいため、同期するのは学習済みのメモリ内容だけにするのが安全です。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">4. 新しいPCで反映する</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          <Link href="/setup/" className="text-crail underline underline-offset-4 dark:text-coral">
            セットアップ
          </Link>
          でNode.jsとClaude Codeを入れたあと、GitHub CLIでリポジトリを取得してインストーラを実行するだけです。
        </p>
        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">macOS / Linux / WSL</p>
        <Code text={CLONE_MAC} />
        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Windowsネイティブ(PowerShell)</p>
        <Code text={CLONE_WIN} />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">5. Claude Code自身にやらせる</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          新しいPCで <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">claude</code> を起動できたら、
          手でコマンドを打つ代わりに、そのまま指示してしまう方法もあります。ブラウザでの認証を求められたときだけ自分で操作すれば完了します。
        </p>
        <Code text={DELEGATE_PROMPT} />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">6. 認証まわりのチェックリスト</h2>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          install.shがリンクを張ってくれるのは設定ファイルだけです。以下は各ツール側にログイン状態を持たせる仕組みなので、PCごとに一度だけ手動で通す必要があります。
        </p>

        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">GitHub CLI(git操作全般)</p>
        <Code text={"gh auth login"} />
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          確認: <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">gh auth status</code>
        </p>

        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">Codex CLI(画像生成系スキルを使う場合)</p>
        <Code text={"codex login"} />
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          ブラウザが開くのでChatGPTアカウントでログインします。詳しくは
          {" "}
          <Link href="/skills/gen-image/" className="text-crail underline underline-offset-4 dark:text-coral">
            gen-imageスキル
          </Link>
          のページを参照してください。
        </p>

        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">MCPサーバー(外部ツール連携を使う場合)</p>
        <p className="mt-2 leading-relaxed text-stone-600 dark:text-stone-300">
          Claude Code内で次のどちらかを実行し、案内に沿って認証します。
        </p>
        <Code text={"/mcp"} />

        <p className="mt-4 text-sm font-semibold text-stone-500 dark:text-stone-400">SSH鍵(git@github.com形式のリポジトリをclone/pushする場合)</p>
        <Code
          text={`ssh-keygen -t ed25519 -C "自分のメールアドレス"
gh ssh-key add ~/.ssh/id_ed25519.pub --title "このPCの名前"`}
        />
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          確認: <code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">ssh -T git@github.com</code> で認証成功のメッセージが出ればOKです。
        </p>
      </section>

      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/40">
        <div className="font-bold text-amber-900 dark:text-amber-200">💡 忘れやすいポイント</div>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-amber-800 dark:text-amber-200">
          <li>各プロジェクトのAPIキー(<code className="rounded bg-white/60 px-1 py-0.5 text-[0.85em] dark:bg-black/30">.env.local</code>)はこのリポジトリでは同期されません。プロジェクトごとに個別管理してください。</li>
          <li>スキルやCLAUDE.mdを更新したら、<code className="rounded bg-white/60 px-1 py-0.5 text-[0.85em] dark:bg-black/30">git commit && git push</code> を忘れると他のPCに反映されません。</li>
          <li>作業を終えるときにメモリをpushしておくと、別のPCでも続きから会話できます。</li>
        </ul>
      </div>

      <div className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-center dark:border-stone-800 dark:bg-stone-900">
        <p className="text-sm text-stone-600 dark:text-stone-300">
          まだこのPCでの初回セットアップが済んでいない場合は、先に
          {" "}
          <Link href="/setup/" className="text-crail underline underline-offset-4 dark:text-coral">
            セットアップ手順
          </Link>
          を。導入したスキルの使い方は
          {" "}
          <Link href="/skills/" className="text-crail underline underline-offset-4 dark:text-coral">
            スキル一覧
          </Link>
          へ。<code className="rounded bg-clay-50 px-1 py-0.5 text-[0.85em] dark:bg-clay-900">agents/</code> フォルダに置く役割ごとのカスタムエージェントの作り方は
          {" "}
          <Link href="/setup/custom-agents/" className="text-crail underline underline-offset-4 dark:text-coral">
            こちら
          </Link>
          。
        </p>
      </div>
    </div>
  );
}
