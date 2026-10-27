import { execFileSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  renameSync,
} from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const envFile = `${root}/.env.elevenlabs`;
if (existsSync(envFile)) process.loadEnvFile(envFile);
const key = process.env.ELEVENLABS_API_KEY;
if (process.argv.includes("--check")) {
  console.log(
    key
      ? "ElevenLabs key is configured locally."
      : "ElevenLabs key is not saved yet.",
  );
  process.exit(key ? 0 : 2);
}
if (!key)
  throw Error(
    "Save ELEVENLABS_API_KEY in video/.env.elevenlabs. Do not paste it into chat.",
  );
const headers = { "xi-api-key": key, "Content-Type": "application/json" };
async function api(endpoint, body) {
  const response = await fetch(`https://api.elevenlabs.io${endpoint}`, {
    headers,
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const status = data.detail?.status || response.status;
    const detail = String(data.detail?.message || "")
      .replaceAll(key, "[redacted]")
      .slice(0, 400);
    throw Error(`ElevenLabs request failed (${status}). ${detail}`);
  }
  return response.json();
}
const voices = (await api("/v2/voices?page_size=100")).voices || [];
if (process.argv.includes("--voices")) {
  console.log(
    JSON.stringify(
      voices.map((v) => ({
        id: v.voice_id,
        name: v.name,
        category: v.category,
        description: v.description,
        labels: v.labels,
      })),
      null,
      2,
    ),
  );
  process.exit(0);
}
const preferred = ["George", "Brian", "Adam", "Rachel", "Sarah"];
const publicVoices = voices.filter(
  (v) => v.category === "premade" || v.category === "default",
);
const voice = process.env.ELEVENLABS_VOICE_ID
  ? voices.find((v) => v.voice_id === process.env.ELEVENLABS_VOICE_ID)
  : preferred
      .map((name) =>
        publicVoices.find((v) =>
          v.name.toLowerCase().startsWith(name.toLowerCase()),
        ),
      )
      .find(Boolean) ||
    publicVoices.find((v) =>
      /narrat|story|warm/i.test(
        [v.description, ...Object.values(v.labels || {})].join(" "),
      ),
    );
const voiceId = process.env.ELEVENLABS_VOICE_ID || voice?.voice_id;
if (!voiceId)
  throw Error(
    "Choose a voice from npm run audio:voices and save its ID as ELEVENLABS_VOICE_ID in the local env file.",
  );
const model = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";
const parts = JSON.parse(readFileSync(`${root}/src/narration.json`, "utf8"));
const cache = `${root}/raw/elevenlabs`;
mkdirSync(cache, { recursive: true });
console.log(`Narrator: ${voice?.name || "selected voice"} · ${model}`);
const captions = [];
const finalized = [];
for (const [i, p] of parts.entries()) {
  const primaryId = createHash("sha256")
    .update(JSON.stringify({ voiceId, model, text: p.text, version: 1 }))
    .digest("hex")
    .slice(0, 20);
  const segmentModel = existsSync(`${cache}/${primaryId}.mp3`)
    ? model
    : process.env.ELEVENLABS_REMAINING_MODEL || model;
  const id = createHash("sha256")
    .update(
      JSON.stringify({
        voiceId,
        model: segmentModel,
        text: p.text,
        version: 1,
      }),
    )
    .digest("hex")
    .slice(0, 20);
  const mp3 = `${cache}/${id}.mp3`,
    alignmentFile = `${cache}/${id}.json`;
  let alignment;
  if (existsSync(mp3) && existsSync(alignmentFile)) {
    alignment = JSON.parse(readFileSync(alignmentFile, "utf8"));
    console.log(`Reusing cached segment ${i + 1}`);
  } else {
    const result = await api(
      `/v1/text-to-speech/${encodeURIComponent(voiceId)}/with-timestamps?output_format=mp3_44100_128`,
      {
        text: p.text,
        model_id: segmentModel,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.75,
          style: 0.25,
          use_speaker_boost: true,
          speed: 1.05,
        },
        previous_text: i ? parts[i - 1].text : undefined,
        next_text: parts[i + 1]?.text,
        seed: 20261027,
      },
    );
    if (!result.audio_base64) throw Error("ElevenLabs returned no audio.");
    writeFileSync(mp3, Buffer.from(result.audio_base64, "base64"));
    alignment = result.normalized_alignment || result.alignment;
    if (!alignment?.characters?.length)
      throw Error("ElevenLabs returned no timing alignment.");
    writeFileSync(alignmentFile, JSON.stringify(alignment));
  }
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
        mp3,
      ],
      { encoding: "utf8" },
    ),
  );
  const speed = Math.max(1, duration / (p.end - p.start));
  const wav = `${cache}/voice-${i}.wav`;
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    mp3,
    "-af",
    `atempo=${speed.toFixed(6)},highpass=f=80,loudnorm=I=-17:TP=-2:LRA=8`,
    "-ar",
    "48000",
    wav,
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
        wav,
      ],
      { encoding: "utf8" },
    ),
  );
  finalized.push({ ...p, duration: outputDuration, model: segmentModel });
  let first = 0;
  for (let j = 0; j < alignment.characters.length; j++) {
    if (
      /[.!?]/.test(alignment.characters[j]) ||
      j === alignment.characters.length - 1
    ) {
      const text = alignment.characters
        .slice(first, j + 1)
        .join("")
        .trim()
        .replace("C plus plus", "C++");
      if (text) {
        const start =
          p.start + alignment.character_start_times_seconds[first] / speed;
        const end = Math.min(
          p.start + outputDuration,
          p.start + alignment.character_end_times_seconds[j] / speed + 0.1,
        );
        captions.push({ start, end, text });
      }
      first = j + 1;
    }
  }
  console.log(
    `Segment ${i + 1}: ${outputDuration.toFixed(2)} seconds, aligned to scene.`,
  );
}
// Install generated audio only after every segment succeeds.
for (let i = 0; i < parts.length; i++)
  copyFileSync(
    `${cache}/voice-${i}.wav`,
    `${root}/public/audio/voice-${i}.wav`,
  );
writeFileSync(
  `${root}/src/narration.json`,
  JSON.stringify(finalized, null, 2) + "\n",
);
writeFileSync(
  `${root}/src/captions.json`,
  JSON.stringify(captions, null, 2) + "\n",
);
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
writeFileSync(
  `${root}/public/audio/narration-provider.json`,
  JSON.stringify(
    {
      provider: "ElevenLabs",
      voiceName: voice?.name || "Selected voice",
      voiceId,
      models: [...new Set(finalized.map((p) => p.model))],
      generatedAt: new Date().toISOString(),
      segments: 7,
    },
    null,
    2,
  ) + "\n",
);
// Reuse the rendered picture and replace the complete audio mix, with no quality loss to video.
const inputs = [
  "-i",
  `${root}/out/gradient-demo.mp4`,
  "-i",
  `${root}/public/audio/ambient-original.wav`,
];
for (let i = 0; i < parts.length; i++)
  inputs.push("-i", `${root}/public/audio/voice-${i}.wav`);
const filters = ["[1:a]volume=0.36[bed]"];
for (let i = 0; i < parts.length; i++)
  filters.push(
    `[${i + 2}:a]adelay=${Math.round(parts[i].start * 1000)}:all=1[v${i}]`,
  );
filters.push(
  `[bed]${parts.map((_, i) => `[v${i}]`).join("")}amix=inputs=8:duration=longest:normalize=0,alimiter=limit=0.95:level=0[mix]`,
);
execFileSync(
  "ffmpeg",
  [
    "-y",
    "-loglevel",
    "error",
    ...inputs,
    "-filter_complex",
    filters.join(";"),
    "-map",
    "0:v:0",
    "-map",
    "[mix]",
    "-c:v",
    "copy",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-t",
    "78",
    "-movflags",
    "+faststart",
    `${root}/out/gradient-elevenlabs-tmp.mp4`,
  ],
  { stdio: "inherit" },
);
renameSync(
  `${root}/out/gradient-elevenlabs-tmp.mp4`,
  `${root}/out/gradient-demo.mp4`,
);
console.log(
  "ElevenLabs narration installed and mixed into the master. Run npm run render:captioned to refresh open captions.",
);
