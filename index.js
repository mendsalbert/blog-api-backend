// Entry point for Render deployment
// This file imports the compiled TypeScript code
console.log("Starting application...");
console.log("Current working directory:", process.cwd());
console.log("Looking for dist/index.js...");

import("./dist/index.js").catch((err) => {
  console.error("Failed to start application:", err);
  console.error("Error details:", err.message);
  console.error("Stack trace:", err.stack);
  process.exit(1);
});
