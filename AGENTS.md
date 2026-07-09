<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# claude-starter-navi

Claude Code のセットアップとスキル導入をナビゲートする日本語の静的サイト。

- 技術: Next.js (App Router, `output: "export"` で静的エクスポート) + TypeScript + Tailwind CSS v4
- スキルカタログ(/skills)は **ビルド時に** GitHub の公開リポジトリ
  `nakahata-cuolega/claude-starter` から SKILL.md を取得して生成する(`src/lib/skills.ts`)。
  スキルを更新したらこのサイトを再ビルド(再デプロイ)すると反映される。
- セットアップ手順のデータは `src/lib/setup-steps.ts`(OS別: mac / windows / wsl)
- 起動: `npm run dev` / ビルド: `npm run build`(出力は `out/`)
- デプロイ: Render Static Site(`render.yaml` 参照。buildCommand: npm ci && npm run build, publish: out)
