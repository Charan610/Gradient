import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const files = [
  "gradient-demo.mp4",
  "gradient-demo-captioned.mp4",
  "gradient-subtitles.srt",
  "gradient-thumbnail.png",
];
for (const file of files)
  if (!existsSync(`${root}/out/${file}`)) throw Error(`Missing ${file}`);
const output = `${root}/out/Gradient-Remotion-Project.zip`;
if (existsSync(output)) unlinkSync(output);
// Explicit allowlist prevents including local credentials, node_modules, or raw files.
execFileSync(
  "zip",
  [
    "-qr",
    output,
    "src",
    "scripts",
    "public",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "captioned.json",
    "README.md",
    "BRIEF.md",
    ".gitignore",
  ],
  { cwd: root },
);
writeFileSync(
  `${root}/out/index.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Gradient · The film</title><style>*{box-sizing:border-box}body{margin:0;background:#181512;color:#f5f0e7;font-family:system-ui,sans-serif;padding:40px clamp(20px,5vw,90px)}header{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}h1{font-size:24px;letter-spacing:-1px}p{font-size:14px;color:#b0a496}video{display:block;width:100%;max-height:78vh;background:#100e0c;border:1px solid #d2b89833;border-radius:14px}nav{display:flex;flex-wrap:wrap;gap:24px;margin-top:24px}a{color:#d2b898;text-underline-offset:5px}small{display:block;margin-top:24px;color:#b0a496}</style><header><h1>Gradient<span style="color:#d2b898">.</span></h1><p>78 seconds · 1080p · Real website recordings</p></header><video controls playsinline preload="metadata" poster="gradient-thumbnail.png"><source src="gradient-demo-captioned.mp4" type="video/mp4"></video><nav><a href="gradient-demo-captioned.mp4" download>Captioned video</a><a href="gradient-demo.mp4" download>Clean master</a><a href="Gradient-Remotion-Project.zip" download>Editable Remotion project</a><a href="gradient-subtitles.srt" download>Subtitles</a><a href="gradient-thumbnail.png" download>Thumbnail</a></nav><small>A little direction. A lot of possibility.</small></html>`,
);
console.log(
  "Portable Remotion project and preview page ready. Credentials excluded.",
);
