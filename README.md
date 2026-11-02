# GRADIENT — Personal Study Workspace

A browser-local learning companion for undergraduate programming preparation. Keep the existing learning-day sequence: a lesson advances when its required tasks are marked complete, not when a calendar day passes.

## What works today

- 30 Phase 0 foundation lessons with specific C++ exercises, example checks, recall explanations, and a recovery plan when stuck.
- Session-budget guidance: a learning day can span multiple shorter sessions.
- Sequential completion, saved task evidence, maintenance mode, and an explicit end-of-lessons screen.
- Review gaps of 1, 3, 7, 21, and 45 learning days measured from the latest attempt. Stable cards return when due.
- Local application tracking, project notes, self-assessed phase rubrics, and metrics derived from saved lesson records.
- JSON export of local workspace records, including tasks, reviews, gates, and project notes; local reset.

## Limits

Phases 1–8 are study outlines, not implemented daily lessons. Tasks and rubrics are self-assessed: this app does not execute code, verify repository evidence, or certify interview readiness. Resource links and chapter labels can change; the unit tests do not verify live URLs.

The study UI uses browser-local records scoped to the current workspace. Supabase stores account identity, optional password hashes, and account preferences; it does not automatically sync study progress. Sign-in uses HttpOnly cookies. Settings provides version-1 JSON export and a validated restore preview. Keep a separate backup before clearing browser data. Resetting local progress does not delete the remote account.

Completion uses an internal recovery record so a failed browser-storage write can finish on retry or reload. Portable backups keep their existing record IDs and format. During a connection or storage error, a previously verified workspace in the current tab can export a read-only recovery copy without switching identities.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a separate test workspace use `npm run dev -- --port 3100`; browser storage is origin-specific.

```bash
npm test
npx tsc --noEmit
npm run build
```

The regression suite covers sequence validation, evidence preservation, concurrent task saves, repeat completion, review retention/rescheduling, local export/reset, and maintenance mode. Browser verification is documented in `docs/PRODUCT_REVIEW.md`.

## Content

`src/lib/db/study-guidance.ts` contains the original exercises and recall explanations. `src/lib/db/curriculum-data.ts` supplies the roadmap, modules, and resource catalog. Start with the assigned resource rather than accumulating courses.

Learning references consulted during the improvement pass: [LearnCpp loop explanation](https://www.learncpp.com/cpp-tutorial/introduction-to-loops-and-while-statements/) and [Harvard CS50 debugging practice](https://cs50.harvard.edu/x/2025/practice/debug/). Exercises in this project are original self-check prompts, not copied course assignments.

## Course library and navigation

Open `/app/subjects` for six course tracks. C++ has the 30 guided lessons; DSA, SQL, CS core, backend, and AI have self-directed practice outlines and resource shelves. Search or filter lessons, revisit completed work, and preview future lessons. Press Ctrl+K (Windows/Linux) or Command+K (macOS) to search lessons, courses, phases, projects, and resources. Use arrow keys and Enter or normal Tab navigation.

The responsive UI is checked from 390px to 2560px, with scrolling sidebar navigation on short desktop windows. The full test suite has 58 tests. Course guidance lives in `src/lib/db/course-guides.ts`; library filtering and workspace search have dedicated regression tests.


## Moving study progress between devices or website addresses

In Settings, export your study records as JSON, then open Settings on the destination browser or deployed site and choose **Restore a study backup**. Localhost and the production domain have separate browser storage. Restore validates the complete version 1 backup, asks before replacing study records, and rolls back writes if browser storage fails. Theme settings and unrelated browser records are preserved. Keep the JSON file private because it contains notes and task evidence. Backups are limited to 5 MB; this is a manual transfer, not cloud sync.


See [the interaction checklist](docs/INTERACTION_CHECKLIST.md) for loading states, optimistic saves, Undo, mobile search, cache refresh, keyboard accessibility, and browser-specific enhancements.

## First C++ setup and current improvement phase

Open `/setup/cpp` for compiler setup, a first build, and troubleshooting on macOS, Windows, or Linux. Setup commands refer to official vendor documentation; the Windows route uses the MSYS2 UCRT64 terminal.

Home offers a gentle backup prompt after meaningful progress, with one-click download and a Later option. Settings previews restore before replacing the current workspace. See [Phase 1 delivery](docs/PHASE1_DELIVERY.md) for the verified flows and remaining Phase 2/3 work.

The requested Elaya design skills are installed in `.agents/skills`. Use their relevant guidance for future design work while preserving Gradient’s explicit calm identity and honest feature descriptions.
