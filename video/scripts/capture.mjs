import { chromium } from "playwright";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const base = process.env.GRADIENT_URL || "http://localhost:3102";
mkdirSync(`${root}/raw`, { recursive: true });
mkdirSync(`${root}/public/captures`, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: `${root}/raw`, size: { width: 1440, height: 900 } },
  deviceScaleFactor: 1,
  colorScheme: "light",
});
// A fresh, isolated context owns this sample profile. No personal browser state is used.
const setup = await context.newPage();
await setup.goto(`${base}/sign-up`);
await setup.getByLabel("What should we call you?").fill("Alex · Demo");
await setup.getByRole("button", { name: "Open my study plan" }).click();
await setup.waitForURL("**/app/today");
await setup.close();
const manifest = existsSync(`${root}/public/captures/manifest.json`)
  ? JSON.parse(readFileSync(`${root}/public/captures/manifest.json`, "utf8"))
  : [];
async function pointer(page) {
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "film-pointer";
    cursor.setAttribute("aria-hidden", "true");
    cursor.style.cssText =
      "position:fixed;top:0;left:0;width:26px;height:32px;pointer-events:none;z-index:2147483647;filter:drop-shadow(0 2px 3px #0005);transform:translate(1300px,800px)";
    cursor.innerHTML =
      '<svg width="26" height="32" viewBox="0 0 26 32"><path d="M3 2L3 26L10 20L15 30L20 27L15 18L24 17Z" fill="#fffaf2" stroke="#302722" stroke-width="1.7"/></svg>';
    document.body.append(cursor);
    document.addEventListener("pointermove", (e) => {
      cursor.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    });
  });
}
async function move(page, locator, click = true) {
  const box = await locator.boundingBox();
  if (!box) throw Error("Target has no bounds");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, {
    steps: 35,
  });
  await page.waitForTimeout(300);
  if (click)
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}
async function shot(name, url, prepare, action, seconds = 6) {
  if (process.env.ONLY && process.env.ONLY !== name) return;
  const start = performance.now();
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(650);
  if (prepare) await prepare(page);
  await pointer(page);
  await page.waitForTimeout(400);
  const cut = (performance.now() - start) / 1000;
  await page.screenshot({ path: `${root}/public/captures/${name}.png` });
  const contentStart = performance.now();
  if (action) await action(page);
  await page.waitForTimeout(
    Math.max(500, seconds * 1000 - (performance.now() - contentStart)),
  );
  const video = page.video();
  await page.close();
  const raw = await video.path();
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-ss",
    cut.toFixed(3),
    "-i",
    raw,
    "-t",
    String(seconds),
    "-vf",
    "fps=30,format=yuv420p",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "18",
    `${root}/public/captures/${name}.mp4`,
  ]);
  const previous = manifest.findIndex((item) => item.name === name);
  if (previous >= 0) manifest.splice(previous, 1);
  manifest.push({ name, url: base + url, seconds, errors });
  writeFileSync(
    `${root}/public/captures/manifest.json`,
    JSON.stringify(manifest, null, 2),
  );
  console.log(`Recorded ${name}: ${url}`);
}
try {
  await shot(
    "today",
    "/app/today",
    null,
    async (p) => {
      await p.mouse.move(1050, 440, { steps: 35 });
    },
    6,
  );
  await shot(
    "hero",
    "/",
    null,
    async (p) => {
      await p.mouse.move(1120, 420, { steps: 40 });
    },
    9,
  );
  await shot(
    "hello",
    "/",
    async (p) => {
      await p
        .getByText("THE FIRST OF MANY SMALL WINS", { exact: true })
        .evaluate((el) =>
          el.closest("[class*=heroWindow]").scrollIntoView({ block: "center" }),
        );
      await p.waitForTimeout(800);
    },
    async (p) => {
      await p.mouse.move(1040, 490, { steps: 30 });
    },
    5,
  );
  await shot(
    "courses",
    "/app/subjects",
    null,
    async (p) => {
      await p.evaluate(() => window.scrollTo({ top: 420, behavior: "smooth" }));
      await p.waitForTimeout(900);
      await move(p, p.locator("details").first().locator("summary"));
    },
    6,
  );
  await shot(
    "course-path",
    "/app/subjects/cpp",
    null,
    async (p) => {
      await move(p, p.getByText("Open study guide +"));
      await p.waitForTimeout(700);
    },
    5,
  );
  await shot(
    "lesson",
    "/app/learn/P0/P0-D01",
    async (p) => {
      await p
        .getByText("Understand it. Build it. Explain it.", { exact: true })
        .scrollIntoViewIfNeeded();
      await p.waitForTimeout(600);
    },
    async (p) => {
      const summary = p.getByText("Read exactly what you need", {
        exact: true,
      });
      await summary.scrollIntoViewIfNeeded();
      await move(p, summary);
      await p.waitForTimeout(700);
    },
    6,
  );
  await shot(
    "resources",
    "/app/resources",
    async (p) => {
      await p
        .getByRole("button", { name: "Current lesson", exact: true })
        .scrollIntoViewIfNeeded();
      await p.waitForTimeout(600);
    },
    async (p) => {
      await move(
        p,
        p.getByRole("button", { name: "Current lesson", exact: true }),
      );
      await p.evaluate(() => window.scrollBy({ top: 330, behavior: "smooth" }));
      await p.waitForTimeout(750);
    },
    6,
  );
  await shot(
    "focus",
    "/#studio",
    async (p) => {
      await p
        .locator('[aria-label="Interactive workspace preview"]')
        .scrollIntoViewIfNeeded();
      await p.waitForTimeout(800);
    },
    async (p) => {
      await move(
        p,
        p.getByRole("button", { name: "Start session", exact: true }),
      );
      await p.waitForTimeout(1400);
    },
    6,
  );
  await shot(
    "recall",
    "/#studio",
    async (p) => {
      await p
        .locator('[aria-label="Interactive workspace preview"]')
        .scrollIntoViewIfNeeded();
      await p.getByRole("tab", { name: "Quick recall" }).click();
      await p.waitForTimeout(800);
    },
    async (p) => {
      await move(p, p.getByRole("button", { name: "Reveal explanation" }));
      await p.waitForTimeout(1300);
    },
    6,
  );
  await shot(
    "projects",
    "/app/projects",
    null,
    async (p) => {
      await move(
        p,
        p
          .getByRole("link", { name: "Open Project Workspace & Milestones" })
          .first(),
      );
      await p.waitForTimeout(1000);
    },
    6,
  );
  await shot(
    "internships",
    "/app/career/internships",
    null,
    async (p) => {
      await p.mouse.move(930, 470, { steps: 35 });
      await p.waitForTimeout(2000);
    },
    6,
  );
  await shot(
    "settings",
    "/app/settings",
    async (p) => {
      await p
        .getByText("Export Private Data (JSON)", { exact: true })
        .scrollIntoViewIfNeeded();
      await p.waitForTimeout(600);
    },
    async (p) => {
      await move(
        p,
        p.getByRole("button", { name: "Export Private Data (JSON)" }),
        false,
      );
    },
    8,
  );
  await shot(
    "onboarding",
    "/sign-up",
    null,
    async (p) => {
      await p.mouse.move(750, 510, { steps: 35 });
    },
    5,
  );
  // Inspect the true empty recall queue, without manufacturing completed learning days.
  const review = await context.newPage();
  await review.goto(`${base}/app/review`);
  await review.waitForTimeout(700);
  await review.screenshot({
    path: `${root}/public/captures/review-inspected.png`,
  });
  manifest.push({
    name: "review-inspection",
    url: base + "/app/review",
    note: "Empty queue inspected; film uses explicitly labeled practice preview instead.",
  });
  await review.close();
  writeFileSync(
    `${root}/public/captures/manifest.json`,
    JSON.stringify(manifest, null, 2),
  );
} finally {
  await context.close();
  await browser.close();
}
