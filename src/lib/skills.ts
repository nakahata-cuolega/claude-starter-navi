import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const REPO = "nakahata-cuolega/claude-starter";
const BRANCH = "main";

// Populated by the build command (git clone of claude-starter); when present,
// skills are read from disk instead of the GitHub API, whose unauthenticated
// rate limits are easily hit on shared CI runners like Render.
const LOCAL_SKILLS_DIR = path.join(process.cwd(), ".skills-data", "skills");

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

function toSkill(name: string, text: string): Skill {
  const { meta, body } = parseFrontmatter(text);
  return {
    name: meta.name ?? name,
    description: meta.description ?? "",
    body,
  };
}

export function getSkill(name: string): Promise<Skill> {
  const cached = skillCache.get(name);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const text = await readFile(path.join(LOCAL_SKILLS_DIR, name, "SKILL.md"), "utf8");
      return toSkill(name, text);
    } catch {
      // No local clone (e.g. plain `npm run dev`) — fall back to the network.
    }
    const res = await fetchWithRetry(
      `https://raw.githubusercontent.com/${REPO}/${BRANCH}/skills/${name}/SKILL.md`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch skill "${name}": ${res.status}`);
    }
    return toSkill(name, await res.text());
  })();
  promise.catch(() => skillCache.delete(name));
  skillCache.set(name, promise);
  return promise;
}

export function getSkills(): Promise<Skill[]> {
  if (skillListCache) return skillListCache;
  const promise = (async () => {
    let dirs: string[];
    try {
      const entries = await readdir(LOCAL_SKILLS_DIR, { withFileTypes: true });
      dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    } catch {
      // No local clone (e.g. plain `npm run dev`) — fall back to the network.
      const res = await fetchWithRetry(
        `https://api.github.com/repos/${REPO}/contents/skills?ref=${BRANCH}`
      );
      if (!res.ok) {
        throw new Error(`Failed to list skills from ${REPO}: ${res.status}`);
      }
      const entries: { name: string; type: string }[] = await res.json();
      dirs = entries.filter((e) => e.type === "dir").map((e) => e.name);
    }
    const skills = await Promise.all(dirs.map(getSkill));
    return skills.sort((a, b) => a.name.localeCompare(b.name));
  })();
  promise.catch(() => {
    skillListCache = null;
  });
  skillListCache = promise;
  return promise;
}
