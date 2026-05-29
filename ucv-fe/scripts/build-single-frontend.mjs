import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const feRoot = path.resolve(__dirname, "..");
const outDir = path.join(feRoot, ".single-build");
const jsPath = path.join(outDir, "index-frontend.js");
const finalPath = path.resolve(feRoot, "..", "index-frontend.js");

execSync("npx vite build --config vite.single.config.ts", {
  cwd: feRoot,
  stdio: "inherit",
});

if (!fs.existsSync(jsPath)) {
  throw new Error(`Build output not found: ${jsPath}`);
}

const js = fs.readFileSync(jsPath, "utf8");
const cssFile = fs
  .readdirSync(outDir)
  .find((fileName) => fileName.toLowerCase().endsWith(".css"));
const css = cssFile
  ? fs.readFileSync(path.join(outDir, cssFile), "utf8")
  : "";

const cssInjector = css
  ? `(function(){var css=${JSON.stringify(
      css
    )};var s=document.createElement("style");s.setAttribute("data-bundle","index-frontend");s.textContent=css;document.head.appendChild(s);}());\n`
  : "";

fs.writeFileSync(finalPath, `${cssInjector}${js}`, "utf8");

console.log(`Created single bundle: ${finalPath}`);
