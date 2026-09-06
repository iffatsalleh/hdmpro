module.exports = {
  apps: [
    {
      name: "hdmpro",
      script: ".next/standalone/server.js",
      instances: 1,
      exec_mode: "fork",
      cwd: __dirname,
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
