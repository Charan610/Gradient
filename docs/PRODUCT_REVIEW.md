# FOUNDATION product review

Reviewed 24 October 2026. Scope: source inspection and the existing unit suite. Browser behavior and live Supabase deployment have not been verified. No product code changed during this review.

## Assessment

The day-based learning model is useful, but several implementation details undermine the promises of reliable progress, complete data ownership, and cloud accounts. Make these behaviors dependable before expanding the product.

## Findings, in priority order

1. **Account identity is not connected to workspace data.** Today and other screens pass `local_user`, even after Supabase sign-in. Repository operations select cloud storage based on configuration and often silently fall back to local storage on failure. A successful login therefore does not establish that the displayed progress belongs to that account. Resolve authenticated identity centrally, explicitly select local versus cloud mode, and surface failed cloud saves.
2. **Sequence completion can jump ahead or loop to the beginning.** `finishLearningDay` advances using the submitted day's sequence without checking that it is the active day. Today falls back to the first day when no matching lesson exists, including after the final available lesson. Enforce sequential completion and provide an explicit curriculum-complete state.
3. **Review scheduling loses information.** Scheduling replaces all cards for a module, so successive tasks overwrite one another. Rating uses the original `last_day_index`, allowing delayed reviews to remain overdue. The review screen excludes stable cards from the ready queue even when due. The default seed card is not persisted, so rating it cannot update it. Use stable concept identities, actual review-day scheduling, and due dates independent of the latest confidence rating.
4. **Export and reset are incomplete.** Export contains only profile and applications. Tasks, days, gates, reviews, and project evidence are missing. Reset only removes one local-storage prefix; project keys use a different prefix, and cloud records are not deleted. Scope the UI promises accurately and implement complete export/reset for the selected storage mode.
5. **Task evidence can be discarded.** Toggling a task calls `updateTaskProgress` without evidence; the repository replaces the record instead of preserving existing evidence. Checklist state is initialized from props once and can retain the prior day's task map when Today advances without remounting. Preserve evidence and synchronize checklist state with the active day.
6. **Curriculum completeness is overstated.** Only Phase 0 has executable daily lessons; Days 6–30 reuse generic task instructions and validation criteria. Later phases are roadmap content. Label availability clearly and replace generic exercises with precise inputs, expected outputs, edge cases, and submission criteria.
7. **Metrics and verification language overstate the evidence.** Module progress is estimated from the day number, phase charts assume Phase 0, and gates are self-assessed checkboxes plus text. Report completion from saved records and distinguish self-assessment from external verification.
8. **New workspaces include artificial activity.** A seeded application and review appear as personal data. Use honest empty states, with examples clearly separated from saved records.

## Verification

`npm test`: 10 tests passed. These tests do not establish end-to-end correctness. For example, resource verification checks a stored `checked` flag and a nonempty URL; it does not check the destination. The repeated-completion test does not establish that reviews and timestamps remain unchanged.

Required regression coverage: future-day rejection, repeat completion without side effects, final-day handling, preserved evidence, overdue review rescheduling, due stable cards, full export/reset, account isolation, and failed cloud writes. Browser verification should cover onboarding → task evidence → completion → next day → reload, plus narrow-screen navigation.

## Suggested improvement paths

- **Personal study tool:** make local persistence complete, fix progression and reviews, add truthful empty/completion states, improve Phase 0 assignments, and polish responsive layouts. Recommended first step for this repository.
- **Public application:** includes the same learning improvements plus authenticated routing, account-scoped repositories, cloud schema/identifier consistency, explicit synchronization failures, and verified cloud deletion/export. This needs broader implementation and a configured service for end-to-end validation.
- **Visual refresh only:** improves presentation but leaves the reliability findings unresolved. Not recommended as the first pass.

Preserve the existing Next.js/React stack, sage-and-stone visual language, and learning-day progression model. The remaining scope decision is whether the immediate target is personal use or public accounts.


## Implemented improvement pass

The user prioritized personal study guidance and authorized proceeding with judgment. The active workspace now deliberately uses local storage; account forms were replaced with honest browser-local setup and resume screens. Existing Supabase scaffolding remains unverified and is not presented as a functioning cloud account.

Implemented specific original exercises, expected checks, and recall explanations for all 30 foundation days; a session-budget guide and recovery steps; sequential and maintenance-mode completion checks; preserved evidence; synchronous local task merges; idempotent completed-day submissions; distinct concept reviews; review timing from the current learning day; due stable cards; an explicit curriculum-complete screen; complete local record export/reset; saved-record metrics; truthful roadmap and privacy copy; and mobile header fixes.

Browser verification on an isolated localhost:3100 workspace covered setup, 45-minute pacing, evidence entry, three required task completions, advancement to a fresh Day 2 checklist, persistence after reload, stable review return, maintenance mode, preference updates preserving progress, an unavailable lesson, the final-lesson state, and horizontal overflow at 390px and 1440px widths. The only observed browser console resource error was the pre-existing missing favicon.ico. No live cloud integration or automated code grading was tested.

The regression suite now contains 19 tests, including overlapping task writes and workspace-prefix isolation. Final build and test results are reported in the chat. Screenshots accompany this review.

Remaining limits: later-phase daily lessons, cloud sync, backup import, and automated code/evidence assessment are not implemented. Resource availability and every external chapter reference have not been individually verified.

## Course library and desktop scaling pass

The course library now includes six tracks: C++ Foundations, DSA, SQL/database design, CS core, backend engineering, and applied AI. Five self-directed outlines provide concrete practice/evidence checkpoints and primary reference links; C++ exposes all 30 existing daily lessons with topic search, saved completion states, and preview labels. Empty subject pages and unknown-subject fallback were replaced with useful outlines and an explicit not-found state.

The Today page, course cards, resource heading, navigation, and search dialog were refreshed in the existing sage/stone visual language. Ctrl/Command+K now opens the library search; arrow keys and Enter navigate results, and the native dialog handles modal focus and Escape. Search includes courses, lessons, phases, projects, and resources.

Desktop layout reflows to a single content column below 1280px, the sidebar scrolls on short displays, content width adapts to wide monitors, and cards avoid minimum-width overflow. Browser checks covered five pages at 390, 960, 1024, 1280, 1440, 1920, and 2560 CSS pixels (35 combinations), with no horizontal overflow. These effective viewport widths cover common zoom/scaling layouts; OS display settings were not changed. Course filtering, no-result recovery, 30 lesson links, lesson-code search, keyboard navigation, four CS-core checkpoints, invalid course handling, and dark mode were checked. The test suite now contains 25 tests.

Reference pages opened during content work: LearnCpp, USACO Bronze, PostgreSQL tutorial, FastAPI tutorial, OSTEP, MDN HTTP overview, Hugging Face LLM Course, and Sentence Transformers semantic-search documentation. Outlines and practice checkpoints are original guidance, not republished lessons.

## SaaS interface refresh — October 25, 2026

- Soft ivory, espresso, taupe, and muted champagne palette in light and dark modes; no purple or blue accents.
- Dashboard summary cards, prominent lesson banner, and an interactive 30-lesson map derived from saved completion records.
- Updated course cards, segmented filters, sidebar selection, translucent header, task controls, and command palette.
- Brief CSS entrance and hover transitions; reduced-motion preferences respected without an additional animation dependency.
- Verification: 29 regression tests passed, production build passed, 20 responsive checks across four routes at 390–2560px passed. Checked both themes, lesson-map navigation, evidence expansion, course filtering, command palette, and reduced-motion styles in the browser.

## Interactive component pass — October 25, 2026

Used https://bytune.space/#features as a visual and interaction reference, adapting the layered surfaces, floating navigation, feature previews, and switchable controls with original Gradient content and the requested neutral palette.

- Rebuilt the homepage with espresso/champagne surfaces, feature cards, original C++ preview, live Study Studio, local-data explanation, and accessible FAQ disclosures.
- Added the same Study Studio beneath the current lesson on Today: adjustable 5–60 minute timer, start/pause/resume/reset, revealable recall, and a clickable plan populated from the actual lesson.
- Timer uses a wall-clock deadline and recalculates on visibility changes; switching tool tabs keeps it running. It does not save progress or complete tasks. Leaving the page ends the timer.
- Browser checks: 5-minute timer reached 04:50 after 10 seconds; paused value stayed fixed; resume and elapsed completion reached 00:00; reset returned 05:00. Recall answer, keyboard tab navigation, task selection and FAQ passed. Homepage and Today had no horizontal overflow at 375, 768, 1024, 1440, or 2560px. Tested reduced-motion and dark presentation.
- All 29 existing regression tests passed. The final production build, including scroll reveals, passed.

## Futuristic visual refinement — October 26, 2026

Added muted orbital framing, precision grids, layered panel borders, metallic typography, an instrument-style focus dial, and reusable pointer-reactive lighting. Lighting uses requestAnimationFrame without per-move React renders, is mouse-only, and is disabled for reduced motion. Existing espresso/champagne preferences are retained.

Validation: 29 tests and production build passed. Homepage and Today fit 375, 768, 1440, and 2560px without horizontal overflow. Browser-tested recall, timer start/pause, pointer lighting, and reduced-motion behavior.
