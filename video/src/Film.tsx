import React from "react";
import {
  AbsoluteFill,
  Sequence,
  OffthreadVideo,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
  Easing,
  spring,
} from "remotion";
import { Audio } from "@remotion/media";
import narration from "./narration.json";
import subtitles from "./captions.json";
import "./style.css";
const C = {
  bg: "#181512",
  cream: "#f5f0e7",
  muted: "#b0a496",
  metal: "#d2b898",
  line: "#cdb89726",
};
const ease = Easing.bezier(0.18, 0.72, 0.2, 1);
const tween = (frame: number, start: number, end: number, a = 0, b = 1) =>
  interpolate(frame, [start, end], [a, b], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
function Rise({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        opacity: tween(f, delay, delay + 22),
        transform: `translateY(${tween(f, delay, delay + 28, 30, 0)}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Background({ light = false }: { light?: boolean }) {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ background: light ? "#eee7dc" : C.bg, overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.7,
          background: light
            ? "radial-gradient(ellipse at 80% 20%,#ffffff,transparent 65%)"
            : "radial-gradient(ellipse at 80% 10%,#8b68472a,transparent 58%)",
        }}
      />
      <svg
        width="1920"
        height="1080"
        style={{
          position: "absolute",
          opacity: light ? 0.16 : 0.24,
          transform: `translateX(${Math.sin(f / 170) * 12}px)`,
        }}
      >
        <defs>
          <pattern
            id="grid"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 96 0 L 0 0 0 96"
              fill="none"
              stroke={light ? "#66554344" : "#d2b89819"}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </AbsoluteFill>
  );
}
function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="brand" style={{ color: light ? "#302722" : C.cream }}>
      <span className="brand-mark">
        G<span>.</span>
      </span>
      <span>Gradient</span>
    </div>
  );
}
function Footer({
  section = 0,
  light = false,
}: {
  section?: number;
  light?: boolean;
}) {
  const f = useCurrentFrame();
  const labels = ["DIRECTION", "FOUNDATIONS", "PRACTICE", "POSSIBILITY"];
  return (
    <div className="footer" style={{ color: light ? "#766657" : C.muted }}>
      <div style={{ display: "flex", gap: 28 }}>
        {labels.map((label, i) => (
          <span
            key={label}
            style={{
              color: i === section ? (light ? "#302722" : C.cream) : undefined,
              opacity: i === section ? 1 : 0.5,
            }}
          >
            <b>{String(i + 1).padStart(2, "0")}</b> {label}
          </span>
        ))}
      </div>
      <span>LEARN AT YOUR OWN PACE ↗</span>
    </div>
  );
}
function Intro() {
  const f = useCurrentFrame();
  const second = f > 98;
  return (
    <AbsoluteFill>
      <Background />
      <div className="topbar">
        <Brand />
        <span className="micro">A PERSONAL LEARNING SYSTEM</span>
      </div>
      <div style={{ position: "absolute", left: 132, top: 300 }}>
        <Rise delay={5}>
          <div className="eyebrow">FOR THE WAY WE LEARN NOW</div>
        </Rise>
        <div style={{ height: 260, marginTop: 28, position: "relative" }}>
          <div
            style={{
              opacity: 1 - tween(f, 90, 109),
              transform: `translateY(${tween(f, 90, 112, 0, -35)}px)`,
            }}
          >
            <Rise delay={12}>
              <h1>
                AI is changing
                <br />
                how we <em>build.</em>
              </h1>
            </Rise>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: tween(f, 100, 126),
              transform: `translateY(${tween(f, 100, 129, 34, 0)}px)`,
            }}
          >
            <h1>
              Understanding
              <br />
              still <em>matters.</em>
            </h1>
          </div>
        </div>
        <Rise delay={134}>
          <p className="intro-note">
            Fundamentals. Practice. A clear next step.
          </p>
        </Rise>
      </div>
      <svg
        width="740"
        height="650"
        viewBox="0 0 740 650"
        style={{ position: "absolute", right: -70, top: 230, opacity: 0.8 }}
      >
        <path
          d="M0 550 H130 Q170 550 170 510 V380 Q170 340 210 340 H340 Q380 340 380 300 V170 Q380 130 420 130 H650"
          fill="none"
          stroke={C.metal}
          strokeWidth="2"
          strokeDasharray="1100"
          strokeDashoffset={1100 * (1 - tween(f, 18, 205))}
        />
        {[
          [170, 550],
          [380, 340],
          [650, 130],
        ].map(([x, y], i) => (
          <g key={i} opacity={tween(f, 50 + i * 45, 80 + i * 45)}>
            <circle cx={x} cy={y} r="25" fill={C.bg} stroke={C.line} />
            <circle cx={x} cy={y} r="5" fill={C.metal} />
          </g>
        ))}
      </svg>
      <Footer />
    </AbsoluteFill>
  );
}
type ShotProps = {
  clip: string;
  title: React.ReactNode;
  label: string;
  section?: number;
  note?: string;
  duration: number;
  light?: boolean;
  still?: boolean;
  start?: number;
};
function Shot({
  clip,
  title,
  label,
  section = 1,
  note,
  duration,
  light = false,
  still = false,
  start = 0,
}: ShotProps) {
  const f = useCurrentFrame();
  const enter = spring({
    frame: f,
    fps: 30,
    config: { damping: 200, stiffness: 90, mass: 0.8 },
  });
  const leave = tween(f, duration - 12, duration, 1, 0);
  const crop =
    (
      {
        hero: 80,
        hello: 200,
        focus: 330,
        recall: 330,
        settings: 80,
        internships: 100,
        projects: 80,
        onboarding: 160,
      } as Record<string, number>
    )[clip] || 0;
  const mediaStyle = {
    width: "100%",
    display: "block",
    transform: `translateY(${(-crop * 1700) / 1440}px)`,
  };
  return (
    <AbsoluteFill style={{ opacity: leave }}>
      <Background light={light} />
      <div className="topbar">
        <Brand light={light} />
        <span className="micro" style={{ color: light ? "#6b5144" : C.muted }}>
          {label}
        </span>
      </div>
      <div
        className="shot-title"
        style={{ color: light ? "#302722" : C.cream }}
      >
        <Rise>
          <h2>{title}</h2>
        </Rise>
        <Rise delay={8}>
          <span className="shot-counter">
            RECORDED IN GRADIENT · LOCAL DEMO
          </span>
        </Rise>
      </div>
      <div
        className="screen"
        style={{
          opacity: enter,
          transform: `translateY(${(1 - enter) * 36}px) scale(${interpolate(f, [0, duration], [0.985, 1.015])})`,
          boxShadow: light ? "0 40px 100px #39271920" : "0 40px 100px #0007",
        }}
      >
        <div className="screen-bar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>
          <span>
            gradient /{" "}
            {clip === "hero" ? "your next step" : label.toLowerCase()}
          </span>
          <span style={{ fontSize: 12 }}>↗</span>
        </div>
        <div
          className="screen-content"
          style={{
            background: ["hero", "hello", "focus", "recall"].includes(clip)
              ? "#100f0d"
              : "#f7f4ef",
          }}
        >
          {still ? (
            <Img src={staticFile(`captures/${clip}.png`)} style={mediaStyle} />
          ) : (
            <OffthreadVideo
              muted
              src={staticFile(`captures/${clip}.mp4`)}
              trimBefore={start}
              style={mediaStyle}
            />
          )}
        </div>
      </div>
      {note && (
        <div
          className="shot-note"
          style={{ color: light ? "#625345" : C.muted }}
        >
          {note}
        </div>
      )}
      <Footer section={section} light={light} />
    </AbsoluteFill>
  );
}
function CareerPath() {
  const f = useCurrentFrame();
  const labels = [
    "Fundamentals",
    "Practice",
    "Projects",
    "Internship\npreparation",
  ];
  return (
    <AbsoluteFill>
      <Background />
      <div className="topbar">
        <Brand />
        <span className="micro">BUILD TOWARD WHAT COMES NEXT</span>
      </div>
      <div style={{ margin: "265px 120px 0" }}>
        <Rise>
          <div className="eyebrow">A FOUNDATION YOU CAN BUILD ON</div>
          <h1 style={{ fontSize: 100, marginTop: 20 }}>
            Small steps.
            <br />
            <em>Real possibilities.</em>
          </h1>
        </Rise>
      </div>
      <div className="path-row">
        <div
          className="path-line"
          style={{ transform: `scaleX(${tween(f, 15, 100)})` }}
        />
        {labels.map((label, i) => (
          <div
            key={label}
            style={{
              opacity: tween(f, 12 + i * 18, 32 + i * 18),
              transform: `translateY(${tween(f, 12 + i * 18, 38 + i * 18, 20, 0)}px)`,
            }}
          >
            <span className="path-point">{String(i + 1).padStart(2, "0")}</span>
            <strong>
              {label.split("\n").map((line, j) => (
                <React.Fragment key={line}>
                  {j > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </strong>
          </div>
        ))}
      </div>
      <Footer section={3} />
    </AbsoluteFill>
  );
}
function Scope() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background light />
      <div className="topbar">
        <Brand light />
        <span className="micro" style={{ color: "#6b5144" }}>
          A CLEAR START. AN HONEST SCOPE.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 230,
          width: 760,
          color: "#302722",
        }}
      >
        <Rise>
          <div className="eyebrow" style={{ color: "#6b5144" }}>
            START WITH THE FOUNDATIONS
          </div>
          <h1 style={{ fontSize: 100, marginTop: 22 }}>
            30 guided
            <br />
            <em>C++ lessons.</em>
          </h1>
        </Rise>
        <Rise delay={18}>
          <p
            style={{
              fontSize: 27,
              lineHeight: 1.6,
              color: "#6b5c4e",
              marginTop: 26,
            }}
          >
            DSA · SQL · CS · Backend · AI
            <br />
            Self-directed study outlines
          </p>
        </Rise>
      </div>
      <div
        style={{
          position: "absolute",
          left: 970,
          top: 182,
          width: 800,
          height: 700,
          overflow: "hidden",
          borderRadius: 20,
          border: "1px solid #d7c9ba",
          boxShadow: "0 30px 80px #30272215",
          transform: `translateY(${tween(f, 0, 35, 30, 0)}px)`,
        }}
      >
        <Img
          src={staticFile("captures/courses.png")}
          style={{
            width: 1280,
            maxWidth: "none",
            transform: "translateX(-245px)",
            display: "block",
          }}
        />
      </div>
      <Footer section={3} light />
    </AbsoluteFill>
  );
}
function Outro() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background />
      <svg
        width="1920"
        height="1080"
        style={{ position: "absolute", opacity: 0.25 }}
      >
        <g
          transform={`translate(960 540) rotate(${f * 0.025})`}
          stroke={C.metal}
          fill="none"
        >
          <ellipse rx="810" ry="310" />
          <ellipse rx="810" ry="310" transform="rotate(18)" />
          <ellipse rx="810" ry="310" transform="rotate(-18)" />
        </g>
      </svg>
      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Rise>
          <Brand />
        </Rise>
        <Rise delay={7}>
          <h1 style={{ textAlign: "center", fontSize: 100, marginTop: 42 }}>
            A little direction.
            <br />A lot of <em>possibility.</em>
          </h1>
        </Rise>
        <Rise delay={20}>
          <div className="end-cta">
            Start learning. <span>↗</span>
          </div>
        </Rise>
        <Rise delay={26}>
          <p style={{ fontSize: 20, color: C.muted, marginTop: 26 }}>
            gradient-inky.vercel.app
          </p>
        </Rise>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 54,
          width: "100%",
          textAlign: "center",
          fontSize: 15,
          letterSpacing: 2,
          color: C.muted,
        }}
      >
        DAY-BASED CAREER PREPARATION OPERATING SYSTEM
      </div>
    </AbsoluteFill>
  );
}
const scenes = [
  {
    at: 8,
    duration: 5,
    clip: "hero",
    title: (
      <>
        A little direction.<span> A place to begin.</span>
      </>
    ),
    label: "MEET YOUR WORKSPACE",
    section: 0,
  },
  {
    at: 13,
    duration: 4,
    clip: "hello",
    title: (
      <>
        Your first program <span>just needs to run.</span>
      </>
    ),
    label: "HELLO, WORLD",
    note: "Illustrative code example · Gradient does not compile code",
    section: 1,
  },
  {
    at: 17,
    duration: 5,
    clip: "courses",
    title: (
      <>
        A path, <span>not another playlist.</span>
      </>
    ),
    label: "THE LEARNING LIBRARY",
    section: 1,
  },
  {
    at: 22,
    duration: 4,
    clip: "course-path",
    title: (
      <>
        30 lessons. <span>One clear sequence.</span>
      </>
    ),
    label: "C++ FOUNDATIONS",
    section: 1,
  },
  {
    at: 26,
    duration: 4,
    clip: "lesson",
    title: (
      <>
        Exercise. Self-check. <span>Clear next step.</span>
      </>
    ),
    label: "YOUR STUDY GUIDE",
    note: "Exercises are self-assessed. Code is not automatically graded.",
    section: 1,
  },
  {
    at: 30,
    duration: 4,
    clip: "resources",
    title: (
      <>
        Read with a question. <span>Build with intent.</span>
      </>
    ),
    label: "EXACT SECTIONS. USEFUL SOURCES.",
    section: 2,
  },
  {
    at: 34,
    duration: 4,
    clip: "focus",
    title: (
      <>
        25 quiet minutes. <span>One thing at a time.</span>
      </>
    ),
    label: "FOCUS SESSION",
    note: "Adjustable sessions · 5–60 minutes",
    section: 2,
  },
  {
    at: 38,
    duration: 5,
    clip: "recall",
    title: (
      <>
        Could you explain it <span>without your notes?</span>
      </>
    ),
    label: "RETRIEVE. THEN REVEAL.",
    note: "Practice preview · Review intervals use learning days: +1, +3, +7, +21, +45",
    section: 2,
  },
  {
    at: 47,
    duration: 4,
    clip: "projects",
    title: (
      <>
        Keep the work. <span>Show your thinking.</span>
      </>
    ),
    label: "PROJECT WORKSPACE",
    section: 3,
  },
  {
    at: 51,
    duration: 5,
    clip: "internships",
    title: (
      <>
        Prepare for internships. <span>With evidence.</span>
      </>
    ),
    label: "BUILD YOUR READINESS",
    note: "Career preparation guidance · Outcomes depend on your work and opportunity",
    section: 3,
  },
  {
    at: 60,
    duration: 7,
    clip: "settings",
    title: (
      <>
        Your progress. <span>In your browser.</span>
      </>
    ),
    label: "LOCAL FIRST. NO ACCOUNT REQUIRED.",
    note: "Transfer with JSON backup · Automatic cloud sync is not available",
    section: 3,
    light: true,
  },
  {
    at: 67,
    duration: 4,
    clip: "onboarding",
    title: (
      <>
        Make it yours. <span>Then begin.</span>
      </>
    ),
    label: "YOUR NEXT STEP IS SMALL",
    section: 0,
  },
  {
    at: 71,
    duration: 3,
    clip: "hero",
    title: (
      <>
        You need <span>a clear next step.</span>
      </>
    ),
    label: "START WITH GRADIENT",
    section: 0,
  },
];
export function GradientFilm({ captions = false }: { captions?: boolean }) {
  const f = useCurrentFrame();
  const current = subtitles.find((s) => f / 30 >= s.start && f / 30 < s.end);
  return (
    <AbsoluteFill className="film">
      <Sequence durationInFrames={240}>
        <Intro />
      </Sequence>
      {scenes.map((s) => (
        <Sequence
          key={s.at}
          from={s.at * 30}
          durationInFrames={s.duration * 30}
        >
          <Shot {...s} duration={s.duration * 30} />
        </Sequence>
      ))}
      <Sequence from={43 * 30} durationInFrames={120}>
        <CareerPath />
      </Sequence>
      <Sequence from={56 * 30} durationInFrames={120}>
        <Scope />
      </Sequence>
      <Sequence from={74 * 30} durationInFrames={120}>
        <Outro />
      </Sequence>
      <Audio src={staticFile("audio/ambient-original.wav")} volume={0.36} />
      {narration.map((n, i) => (
        <Sequence
          key={i}
          from={Math.round(n.start * 30)}
          durationInFrames={Math.ceil(n.duration * 30) + 1}
        >
          <Audio src={staticFile(`audio/voice-${i}.wav`)} />
        </Sequence>
      ))}
      {captions && current && (
        <div className="captions">
          <span>{current.text}</span>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          width: `${(f / 2339) * 100}%`,
          background: C.metal,
        }}
      />
    </AbsoluteFill>
  );
}
export function GradientThumbnail() {
  return (
    <AbsoluteFill className="film">
      <Background />
      <div className="topbar">
        <Brand />
        <span className="micro">YOUR NEXT STEP STARTS HERE</span>
      </div>
      <div style={{ position: "absolute", left: 115, top: 310, width: 820 }}>
        <div className="eyebrow">FROM FUNDAMENTALS TO POSSIBILITY</div>
        <h1 style={{ fontSize: 115, marginTop: 30 }}>
          A little
          <br />
          direction.
          <br />
          <em>A lot ahead.</em>
        </h1>
        <p style={{ fontSize: 26, color: C.muted, marginTop: 28 }}>
          The Gradient workspace, introduced.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1010,
          top: 200,
          width: 1010,
          height: 720,
          overflow: "hidden",
          borderRadius: 24,
          border: `1px solid ${C.line}`,
          transform: "perspective(1800px) rotateY(-10deg) rotateZ(2deg)",
          boxShadow: "0 40px 100px #0008",
        }}
      >
        <Img
          src={staticFile("captures/hero.png")}
          style={{
            width: 1150,
            maxWidth: "none",
            transform: "translateX(-70px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
