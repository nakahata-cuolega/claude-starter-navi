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

// GitHub rate-limits unauthenticated requests; memoize per process and
// retry with backoff so dev-server page loads don't refetch and fail.
const skillCache = new Map<string, Promise<Skill>>();
let skillListCache: Promise<Skill[]> | null = null;

async function fetchWithRetry(url: string): Promise<Response> {
  let res: Response = await fetch(url, { cache: "force-cache" });
  for (let attempt = 1; attempt <= 2 && (res.status === 429 || res.status === 403); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, attempt * 3000));
    res = await fetch(url, { cache: "force-cache" });
  }
  return res;
}

export function getSkill(name: string): Promise<Skill> {
  const cached = skillCache.get(name);
  if (cached) return cached;
  const promise = (async () => {
    const res = await fetchWithRetry(
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
  })();
  promise.catch(() => skillCache.delete(name));
  skillCache.set(name, promise);
  return promise;
}

export function getSkills(): Promise<Skill[]> {
  if (skillListCache) return skillListCache;
  const promise = (async () => {
    const res = await fetchWithRetry(
      `https://api.github.com/repos/${REPO}/contents/skills?ref=${BRANCH}`
    );
    if (!res.ok) {
      throw new Error(`Failed to list skills from ${REPO}: ${res.status}`);
    }
    const entries: { name: string; type: string }[] = await res.json();
    const dirs = entries.filter((e) => e.type === "dir").map((e) => e.name);
    const skills = await Promise.all(dirs.map(getSkill));
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  })();
  promise.catch(() => {
    skillListCache = null;
  });
  skillListCache = promise;
  return promise;
}
