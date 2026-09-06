const fs = require("fs");
const path = require("path");

const envVars = {
  PORT: 3000,
  NODE_ENV: "production",
};

const envPath = path.resolve(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      envVars[key] = val;
    }
  });
}

module.exports = {
  apps: [
    {
      name: "hdmpro",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      cwd: __dirname,
      env: envVars,
    },
  ],
};
