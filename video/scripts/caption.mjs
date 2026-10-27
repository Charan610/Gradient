import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const master = `${root}/out/gradient-demo.mp4`;
if (!existsSync(master)) throw Error("Run npm run render first.");
const captions = JSON.parse(readFileSync(`${root}/src/captions.json`, "utf8"));
const dir = `${root}/raw/captions`;
mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 120 },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    '<style>html,body{margin:0;width:1600px;height:120px;background:transparent}body{display:flex;align-items:flex-end;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}span{box-sizing:border-box;max-width:1460px;padding:12px 24px;border-radius:10px;background:#171310ee;color:#fffaf1;font-size:25px;line-height:1.35;text-align:center;box-shadow:0 2px 15px #0002}</style><span></span>',
  );
  await page.locator("span").evaluate((el) => (el.style.display = "none"));
  await page.screenshot({ path: `${dir}/blank.png`, omitBackground: true });
  for (const [i, c] of captions.entries()) {
    await page.locator("span").evaluate(
      (el, text) => {
        el.style.display = "block";
        el.textContent = text;
      },
      c.text.replace("C plus plus", "C++"),
    );
    await page.screenshot({ path: `${dir}/${i}.png`, omitBackground: true });
  }
} finally {
  await browser.close();
}
const boundaries = [
  ...new Set([0, 78, ...captions.flatMap((c) => [c.start, c.end])]),
].sort((a, b) => a - b);
let list = "ffconcat version 1.0\n";
for (let i = 0; i < boundaries.length - 1; i++) {
  const a = boundaries[i],
    b = boundaries[i + 1],
    index = captions.findIndex(
      (c) => (a + b) / 2 >= c.start && (a + b) / 2 < c.end,
    );
  list += `file '${dir}/${index < 0 ? "blank" : index}.png'\nduration ${(b - a).toFixed(6)}\n`;
}
list += `file '${dir}/blank.png'\n`;
writeFileSync(`${dir}/captions.ffconcat`, list);
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    `${dir}/captions.ffconcat`,
    "-r",
    "30",
    "-fps_mode",
    "cfr",
    "-c:v",
    "qtrle",
    "-pix_fmt",
    "argb",
    "-t",
    "78",
    `${root}/raw/caption-track.mov`,
  ],
  { stdio: "inherit" },
);
console.log("Caption overlay rendered. Finishing captioned MP4…");
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    "-i",
    master,
    "-i",
    `${root}/raw/caption-track.mov`,
    "-filter_complex",
    "[0:v][1:v]overlay=(W-w)/2:H-h-126:format=auto[v]",
    "-map",
    "[v]",
    "-map",
    "0:a",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    `${root}/out/gradient-demo-captioned.mp4`,
  ],
  { stdio: "inherit" },
);
console.log("Captioned film ready.");
