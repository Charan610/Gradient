import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
mkdirSync(`${root}/raw`, { recursive: true });
mkdirSync(`${root}/public/audio`, { recursive: true });
mkdirSync(`${root}/out`, { recursive: true });
const parts = [
  {
    start: 0.5,
    end: 7.6,
    text: "AI is changing how we build. Understanding why your code works still starts with the fundamentals.",
  },
  {
    start: 8.4,
    end: 16.6,
    text: "Meet Gradient. A personal workspace for turning your next learning step into something you can build, test, and explain.",
  },
  {
    start: 17.4,
    end: 29.4,
    text: "Start with thirty guided C plus plus lessons. Write something small. Check your understanding. Save the work that shows what you learned. One exercise. One clear next step.",
  },
  {
    start: 30.4,
    end: 42.5,
    text: "Know what to read, what to practice, and what to check. Make space for focused work, then return to the ideas you want to remember.",
  },
  {
    start: 43.4,
    end: 55.4,
    text: "As your foundation grows, connect practice to projects and organize your internship preparation. Build evidence of your thinking, one working result at a time.",
  },
  {
    start: 56.3,
    end: 66.7,
    text: "Start without an account. Your progress stays in your browser. Transfer it with a JSON backup, and explore self-directed outlines when you are ready.",
  },
  {
    start: 67.5,
    end: 77.2,
    text: "You do not need to learn everything today. You need a clear next step. A little direction. A lot of possibility. Start with Gradient.",
  },
];
const captions = [];
for (const [i, p] of parts.entries()) {
  const raw = `${root}/raw/voice-${i}.aiff`;
  const file = `${root}/public/audio/voice-${i}.wav`;
  execFileSync("say", [
    "-v",
    process.env.GRADIENT_VOICE || "Samantha",
    "-r",
    "170",
    "-o",
    raw,
    p.text,
  ]);
  const duration = Number(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        raw,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
  const speed = Math.max(1, duration / (p.end - p.start));
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    raw,
    "-af",
    `atempo=${speed.toFixed(5)},highpass=f=90,lowpass=f=11000,loudnorm=I=-17:TP=-2:LRA=8`,
    "-ar",
    "48000",
    file,
  ]);
  const outputDuration = Number(
    execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "csv=p=0",
        file,
      ],
      { encoding: "utf8" },
    ).trim(),
  );
  p.duration = outputDuration;
  const chunks = p.text.match(/[^.!?]+[.!?]+/g) || [p.text];
  const total = chunks.reduce((n, s) => n + s.trim().split(/\s+/).length, 0);
  let cursor = p.start;
  for (const line of chunks) {
    const weight = line.trim().split(/\s+/).length;
    const end = cursor + (outputDuration * weight) / total;
    captions.push({ start: cursor, end, text: line.trim() });
    cursor = end;
  }
  console.log(
    `Narration ${i + 1}: ${outputDuration.toFixed(2)}s in ${(p.end - p.start).toFixed(1)}s window`,
  );
}
writeFileSync(`${root}/src/narration.json`, JSON.stringify(parts, null, 2));
writeFileSync(`${root}/src/captions.json`, JSON.stringify(captions, null, 2));
function stamp(sec) {
  const ms = Math.round(sec * 1000);
  return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
}
writeFileSync(
  `${root}/out/gradient-subtitles.srt`,
  captions
    .map(
      (c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`,
    )
    .join("\n"),
);
// Original instrumental bed: evolving suspended chords, soft piano-like harmonics,
// a restrained pulse and quiet scene accents. No third-party music or samples.
const sr = 24000,
  seconds = 78,
  count = sr * seconds;
const buffer = Buffer.alloc(44 + count * 4);
buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + count * 4, 4);
buffer.write("WAVEfmt ", 8);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);
buffer.writeUInt16LE(2, 22);
buffer.writeUInt32LE(sr, 24);
buffer.writeUInt32LE(sr * 4, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(count * 4, 40);
const chords = [
  [130.81, 196, 261.63, 293.66],
  [110, 164.81, 220, 261.63],
  [87.31, 130.81, 174.61, 220],
  [98, 146.83, 196, 261.63],
];
for (let i = 0; i < count; i++) {
  const t = i / sr,
    segment = Math.floor(t / 8),
    local = t % 8,
    chord = chords[segment % 4];
  let l = 0,
    r = 0;
  const envelope = Math.min(1, local / 1.8) * Math.min(1, (8 - local) / 1.5);
  for (let n = 0; n < 4; n++) {
    const f = chord[n];
    const amplitude = 0.024 * envelope * (1 + 0.12 * Math.sin(t * 0.8 + n));
    l +=
      amplitude *
      (Math.sin(2 * Math.PI * f * t) +
        0.25 * Math.sin(2 * Math.PI * f * 2 * t));
    r +=
      amplitude *
      (Math.sin(2 * Math.PI * f * 1.001 * t) +
        0.25 * Math.sin(2 * Math.PI * f * 2.001 * t));
  }
  const beat = t % 1.25,
    note = chord[Math.floor(t / 1.25) % 4] * 2;
  const bell =
    Math.exp(-beat * 4) *
    Math.min(1, beat / 0.014) *
    0.028 *
    (Math.sin(2 * Math.PI * note * t) +
      0.3 * Math.sin(2 * Math.PI * note * 2 * t));
  l += bell;
  r += bell;
  if (t > 17 && t < 68) {
    const pulse = t % 0.75;
    const kick =
      Math.exp(-pulse * 23) *
      0.025 *
      Math.sin(2 * Math.PI * (48 * pulse + 2 * Math.exp(-pulse * 15)));
    l += kick;
    r += kick;
  }
  const fade = Math.min(1, t / 2) * Math.min(1, (seconds - t) / 3.5);
  l *= fade;
  r *= fade;
  buffer.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, l)) * 32767),
    44 + i * 4,
  );
  buffer.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, r)) * 32767),
    46 + i * 4,
  );
}
writeFileSync(`${root}/public/audio/ambient-original.wav`, buffer);
console.log("Original ambient soundtrack and subtitles created.");
