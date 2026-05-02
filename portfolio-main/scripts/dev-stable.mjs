import { rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = process.env.PORT || "3003";
const devDistDir = process.env.NEXT_DIST_DIR || ".next-dev";

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: options.stdio ?? "pipe",
      ...options
    });

    let output = "";

    child.stdout?.on("data", (chunk) => {
      output += chunk.toString();
    });

    child.stderr?.on("data", (chunk) => {
      output += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(output.trim() || `${command} exited with code ${code}`));
      }
    });
  });
}

async function findPortPids() {
  try {
    const output = await run("lsof", ["-ti", `tcp:${port}`]);
    return output.split(/\s+/).filter(Boolean);
  } catch {
    return [];
  }
}

async function findProjectNextPids() {
  try {
    const output = await run("ps", ["-axo", "pid=,command="]);

    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const firstSpace = line.indexOf(" ");

        if (firstSpace === -1) {
          return null;
        }

        return {
          pid: line.slice(0, firstSpace).trim(),
          command: line.slice(firstSpace + 1).trim()
        };
      })
      .filter((entry) => {
        if (!entry) {
          return false;
        }

        // Only target dev servers started from this project folder.
        return entry.command.includes(rootDir) && /next(\s|$).*dev|next-dev-server/.test(entry.command);
      })
      .map((entry) => entry.pid);
  } catch {
    return [];
  }
}

async function isNextProcess(pid) {
  try {
    const command = await run("ps", ["-p", pid, "-o", "command="]);
    return /next(-server)?|next dev/.test(command);
  } catch {
    return false;
  }
}

async function stopStaleNextServers() {
  const pids = new Set([...(await findPortPids()), ...(await findProjectNextPids())]);
  const terminatedPids = [];

  for (const pid of pids) {
    if (Number(pid) === process.pid) {
      continue;
    }

    if (await isNextProcess(pid)) {
      process.stdout.write(`Stopping stale Next.js process (pid ${pid})...\n`);
      try {
        process.kill(Number(pid), "SIGTERM");
        terminatedPids.push(pid);
      } catch {
        // The process may have already exited between lsof and kill.
      }
    }
  }

  if (terminatedPids.length === 0) {
    return;
  }

  // Give Next.js processes a short grace period before forcing shutdown.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  for (const pid of terminatedPids) {
    if (await isNextProcess(pid)) {
      process.stdout.write(`Force stopping stale Next.js process (pid ${pid})...\n`);
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        // The process may have already exited.
      }
    }
  }
}

async function main() {
  process.stdout.write(`Preparing stable portfolio preview on http://localhost:${port}\n`);
  await stopStaleNextServers();
  await rm(path.join(rootDir, devDistDir), { force: true, recursive: true });
  await run("npm", ["run", "sync:tokens"], { stdio: "inherit" });

  const nextBin = path.join(rootDir, "node_modules", ".bin", "next");
  const next = spawn(nextBin, ["dev", "-p", port], {
    cwd: rootDir,
    env: {
      ...process.env,
      NEXT_DIST_DIR: devDistDir
    },
    stdio: "inherit"
  });

  next.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
