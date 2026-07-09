// Presentation metadata for skills. The catalog itself comes from the
// claude-starter repo at build time; anything not listed here falls back
// to the default category.
export const SKILL_CATEGORIES: Record<string, string> = {
  "new-project": "つくる",
  "gen-image": "画像",
  "gen-ogp": "画像",
  "gen-banner": "広告",
  "ad-copy": "広告",
  analyze: "分析",
  ship: "運用",
  "screenshot-check": "運用",
  "wrap-up": "運用",
  "make-skill": "スキル管理",
  "publish-skill": "スキル管理",
};

export const CATEGORY_ORDER = ["つくる", "画像", "広告", "分析", "運用", "スキル管理", "その他"];

export function skillCategory(name: string): string {
  return SKILL_CATEGORIES[name] ?? "その他";
}

// Skills highlighted on the home page, in display order.
export const FEATURED_SKILLS = ["new-project", "gen-image", "analyze", "ship"];
