import { bundle } from "@remotion/bundler";
import {
  selectComposition,
  renderMedia,
  renderStill,
} from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
mkdirSync(`${root}/out`, { recursive: true });
const browserExecutable =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const serveUrl = await bundle({
  entryPoint: `${root}/src/index.tsx`,
  publicDir: `${root}/public`,
});
const common = { serveUrl, browserExecutable };
const captioned = process.argv.includes("--captioned");
const composition = await selectComposition({
  ...common,
  id: "GradientFilm",
  inputProps: { captions: captioned },
});
if (process.argv.includes("--stills")) {
  for (const frame of [
    140, 300, 430, 720, 1055, 1200, 1520, 1710, 1880, 2290,
  ]) {
    await renderStill({
      ...common,
      composition,
      output: `${root}/out/check-${frame}.png`,
      frame,
      inputProps: { captions: frame === 1200 },
    });
    console.log(`Frame ${frame} ready`);
  }
} else {
  let last = -1;
  await renderMedia({
    ...common,
    composition,
    codec: "h264",
    crf: 18,
    pixelFormat: "yuv420p",
    concurrency: 2,
    outputLocation: `${root}/out/${captioned ? "gradient-demo-captioned" : "gradient-demo"}.mp4`,
    inputProps: { captions: captioned },
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p > last) {
        last = p;
        console.log(`Rendering ${p * 10}%`);
      }
    },
  });
  const thumbnail = await selectComposition({
    ...common,
    id: "GradientThumbnail",
  });
  await renderStill({
    ...common,
    composition: thumbnail,
    output: `${root}/out/gradient-thumbnail.png`,
    frame: 0,
  });
  console.log("Master film and thumbnail rendered.");
}
