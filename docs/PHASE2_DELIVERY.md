# Phase 2 — core learning

Delivered November 2, 2026. This phase keeps Gradient’s warm identity and self-paced lesson progression. The installed landing-page-design guidance informed readable spacing, clear actions and complete states; the user’s existing brand constraints took precedence over generic font and motion rules.

## What changed and why

- Added a complete introductory DSA in C++ path: 20 original lessons, 80 activities, worked examples, independent exercises, checks, hints, recall and focused reference links. Existing P0 lesson/task IDs remain intact. P2-D01..20 append global sequences 31–50; other Phase 2 topics remain outlines.
- Made Home’s recall panel show actual concepts. Learners can explicitly open the next scheduled recall set, including after completing both courses, without moving their active lesson. Spacing uses learning steps, never elapsed calendar days or overdue penalties.
- Added multiline lesson notes beside the guide, autosave, explicit save, visible errors and recoverable tab drafts. Saved notes round-trip in existing version-1 backups. Restore/reset rotates a workspace-specific draft revision so stale tabs cannot overwrite newly restored notes. Blocked storage reads leave the editor and its text available.
- Added a resume link to the next incomplete required activity. Task evidence accepts multiple lines and reports save state. Removed the optional countdown studio from the lesson flow.
- Updated course-relative navigation, Home, progress, roadmap and public claims for two guided paths. Outline interests are explicitly saved on this browser and included in backups; they are not release-notification subscriptions.

## Verification

69 tests passed across 11 files; TypeScript and the optimized production build passed. A regression completes all 50 lessons, checks sequential advancement and one recall concept per lesson, restores DSA notes, and opens another recall set after the last lesson. Existing backup and interrupted-completion regressions still pass.

All 20 DSA example/exercise checks compiled and ran as C++17, both normally and with AddressSanitizer/UndefinedBehaviorSanitizer. The reference implementation checks bounded assumptions and edge cases; this is not proof of every learner program’s correctness.

Isolated browser checks covered note autosave/reload, failed writes and draft recovery, next-activity resume, a seeded foundation graduate completing the first DSA lesson, recall ratings and next-set progression, saved outline interests, actual JSON download/restore through Settings, and stale-draft safety after restore. A blocked revision read kept typed text visible without a page error. Keyboard checks covered the skip link, library search/Escape, and notes on the final DSA lesson under reduced motion. Browser tests used mocked account GET responses; no real learner storage was modified. Authentication implementation is unchanged from Phase 1 and was not revalidated against the remote service in this phase.

Axe-core 4.14.0 on the final optimized frontend reported zero automated violations and zero horizontal overflow in 32 combinations: landing, Home, C++ lesson, first/final DSA lesson, recall, SQL outline and library at 375/1440px in light/dark themes. Incomplete color-contrast and library aria checks still require manual review. This is not WCAG certification or a complete site audit.

Lighthouse 13.6.0 local production lab runs: landing mobile scored 100 performance / 100 accessibility / 96 best practices / 100 SEO; landing desktop and mobile Home, C++ lesson, DSA lesson, library and recall each scored 100 in all four categories. Mobile landing’s best-practices deduction was the missing favicon.ico. LCP was 0.2–1.1s, TBT 0–10ms, CLS 0 except Home at 0.005. The account GET was mocked through a local proxy; these numbers measure the production frontend, not remote auth latency or field performance. Lighthouse preceded the last draft-read guard; the final build, browser failure check and 32-case axe scan include that guard. No visual/style changes followed Lighthouse.

Phase 1’s individual local runs reported 100 in each category. The current cold-browser favicon deduction shows why those numbers do not establish complete metadata/assets coverage; favicon and SEO assets remain Phase 3 work.

## Review artifacts

Before/after screenshots, the axe results and Lighthouse HTML reports live in the local `gradient-phase2` artifact folder linked in the delivery chat. The gallery compares Phase 1 Home/lesson screens with Phase 2 and includes DSA mobile/desktop, library and recall views.

## Deliberate limits and next phase

The in-browser C++ compiler was deferred: a reliable sandbox/runtime, download size, input limits and failure handling deserve separate work. Learners compile in their own environment; the interface states this plainly. Real release notifications were not built or claimed. Notes, interests and study state remain browser-local; account sign-in does not sync them automatically.

Phase 3 remains the next review boundary: supporting-tool accessibility, mobile target checks, consistent microcopy, accurate privacy text, metadata/OG, sitemap, robots and favicon assets. This delivery does not claim a completed Phase 3 or a 10/10 product.

The user requested a push during Phase 2. Checkpoint 65be322 was pushed first, followed by curriculum integration and draft-safety fixes after verification. No manual frontend deployment or database migration was performed; connected hosting may deploy GitHub pushes independently.
