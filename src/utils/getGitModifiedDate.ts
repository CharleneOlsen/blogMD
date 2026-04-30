import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export function getGitModifiedDate(filePath?: string): Date | null {
  if (!filePath) return null;

  try {
    // Use git to get the committer date in ISO 8601
    const cwd = process.cwd();
    const fullPath = path.resolve(cwd, filePath);
    const out = execSync(`git log -1 --format=%cI -- "${fullPath}"`, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    if (out) return new Date(out);
  } catch {
    // ignore git errors (e.g., not a git repo)
  }

  try {
    const fullPath = path.resolve(process.cwd(), filePath);
    const stats = fs.statSync(fullPath);
    return stats.mtime;
  } catch {
    return null;
  }
}

export default getGitModifiedDate;
