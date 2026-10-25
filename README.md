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

The active UI uses `local_user` and browser storage, even if Supabase environment variables exist. Setup does not require credentials and preserves existing progress. Supabase repository branches and SQL files remain as unfinished integration scaffolding; cloud authentication, sync, cloud export, and cloud deletion are not exposed as working features. Browser data can be cleared by the user or browser, so export regularly. There is no backup-import interface yet.

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

The responsive UI is checked from 390px to 2560px, with scrolling sidebar navigation on short desktop windows. The full test suite has 29 tests. Course guidance lives in `src/lib/db/course-guides.ts`; library filtering and workspace search have dedicated regression tests.


## Moving study progress between devices or website addresses

In Settings, export your study records as JSON, then open Settings on the destination browser or deployed site and choose **Restore a study backup**. Localhost and the production domain have separate browser storage. Restore validates the complete version 1 backup, asks before replacing study records, and rolls back writes if browser storage fails. Theme settings and unrelated browser records are preserved. Keep the JSON file private because it contains notes and task evidence. Backups are limited to 5 MB; this is a manual transfer, not cloud sync.
