const REPO = "nakahata-cuolega/claude-starter";
const BRANCH = "main";

export type Skill = {
  name: string;
  description: string;
  body: string;
};

export const REPO_URL = `https://github.com/${REPO}`;

function parseFrontmatter(text: string): { meta: Record<string, string>; body: string } {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, body: text.slice(match[0].length) };
}

export async function getSkill(name: string): Promise<Skill> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${REPO}/${BRANCH}/skills/${name}/SKILL.md`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch skill "${name}": ${res.status}`);
  }
  const { meta, body } = parseFrontmatter(await res.text());
  return {
    name: meta.name ?? name,
    description: meta.description ?? "",
    body,
  };
}

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/skills?ref=${BRANCH}`);
  if (!res.ok) {
    throw new Error(`Failed to list skills from ${REPO}: ${res.status}`);
  }
  const entries: { name: string; type: string }[] = await res.json();
  const dirs = entries.filter((e) => e.type === "dir").map((e) => e.name);
  const skills = await Promise.all(dirs.map(getSkill));
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}
