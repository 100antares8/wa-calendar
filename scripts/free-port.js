/* Free port before dev — avoids zombie Next on :3333 showing "missing required error components". */
const { execFileSync } = require("child_process");

const port = String(process.argv[2] || "3333");

function killPidWin(pid) {
  try {
    execFileSync("taskkill", ["/PID", pid, "/F"], { stdio: "ignore" });
  } catch {
    /* ignore */
  }
}

if (process.platform === "win32") {
  try {
    const out = execFileSync("cmd", ["/c", `netstat -ano | findstr :${port}`], {
      encoding: "utf8",
    });
    const seen = new Set();
    for (const line of out.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 5) continue;
      const state = parts[parts.length - 2];
      const pid = parts[parts.length - 1];
      if (state === "LISTENING" && /^\d+$/.test(pid) && !seen.has(pid)) {
        seen.add(pid);
        killPidWin(pid);
      }
    }
  } catch {
    /* no listeners */
  }
} else {
  try {
    const out = execFileSync("sh", ["-c", `lsof -tiTCP:${port} -sTCP:LISTEN 2>/dev/null || true`], {
      encoding: "utf8",
    });
    for (const pid of out.trim().split(/\s+/).filter(Boolean)) {
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* ignore */
  }
}
