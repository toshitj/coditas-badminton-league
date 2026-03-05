const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const api_dir = path.join(__dirname, "..", "app", "api");
const api_backup = path.join(__dirname, "..", "_api_backup");

function copy_dir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copy_dir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function rm_dir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
}

const has_api = fs.existsSync(api_dir);

try {
  if (has_api) {
    rm_dir(api_backup);
    copy_dir(api_dir, api_backup);
    rm_dir(api_dir);
    console.log("Moved app/api -> _api_backup (excluded from static export)");
  }

  execSync("npx next build", { stdio: "inherit" });
} finally {
  if (has_api && fs.existsSync(api_backup)) {
    rm_dir(api_dir);
    copy_dir(api_backup, api_dir);
    rm_dir(api_backup);
    console.log("Restored _api_backup -> app/api");
  }
}
