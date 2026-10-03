import { execFileSync } from "node:child_process";
import { unstable_noStore as noStore } from "next/cache";

const DISPLAY_TIME_ZONE = "Asia/Hong_Kong";
const DATE_PREFIX = "📌";

function runGit(args: string[]) {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return "";
  }
}

function formatUpdatedOn(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric"
  }).formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";

  return `${DATE_PREFIX} ${month} ${day} ${year}`;
}

function getLastUpdatedDate() {
  const hasRepo = Boolean(runGit(["rev-parse", "--show-toplevel"]));

  if (hasRepo) {
    const hasLocalChanges = Boolean(runGit(["status", "--porcelain"]));

    if (hasLocalChanges) {
      return new Date();
    }

    const commitDate = runGit(["log", "-1", "--format=%cI"]);

    if (commitDate) {
      return new Date(commitDate);
    }
  }

  const vercelCommitDate = process.env.VERCEL_GIT_COMMIT_DATE;

  if (vercelCommitDate) {
    return new Date(vercelCommitDate);
  }

  return new Date();
}

export function getLastUpdatedLabel() {
  // In local preview, re-read git on each request so the date updates
  // as soon as the working tree changes — no restart required.
  if (process.env.NODE_ENV === "development") {
    noStore();
  }

  return formatUpdatedOn(getLastUpdatedDate());
}
