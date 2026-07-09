// Clones the public claude-starter repo into .skills-data so the build can
// read SKILL.md files from disk (GitHub API rate limits are unreliable on CI).
import { rmSync } from "node:fs";
import { execFileSync } from "node:child_process";

const DEST = ".skills-data";
const REPO_URL = "https://github.com/nakahata-cuolega/claude-starter.git";

try {
  rmSync(DEST, { recursive: true, force: true });
  execFileSync("git", ["clone", "--depth", "1", REPO_URL, DEST], {
    stdio: "inherit",
  });
} catch (err) {
  // Non-fatal: src/lib/skills.ts falls back to fetching from GitHub directly.
  console.warn(`WARN: could not clone ${REPO_URL}: ${err.message}`);
}
