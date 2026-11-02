# Phase 1 — Reliable first steps

2 November 2026. Phase 0 was approved with “continue.” This phase preserves Gradient’s learning-day sequence, calm voice, warm palette, and version-1 backups.

## Changed and why

- **Signup:** generated password-free credentials now use 24 cryptographically random bytes encoded as 48 hex characters. Both validation boundaries limit chosen passwords to 72 UTF-8 bytes, matching the observed provider limit. The existing Supabase account function was updated to version 2 with its authentication hash, rate limits and schema preserved. Real password-free signup subsequently returned HTTP 200 and opened the workspace on both localhost and the live site.
- **Interrupted completion:** a workspace-scoped write-ahead record now preserves the intended profile, completion and recall writes. Reads finish pending writes when storage is writable again. Retry repairs older partially completed records too, preserving notes and rated reviews. Reset and restore clear pending completion records so they cannot resurrect replaced work. No existing record IDs or portable backup format changed.
- **Mature recall backups:** validation accepts all five actual scheduler states. Tested actual exported state at every interval, including step 5, without resetting confidence.
- **C++ setup:** a public `/setup/cpp` guide covers macOS, MSYS2 UCRT64 on supported Windows machines, and Ubuntu/Debian or Fedora Linux. It includes installation checks, a first build, expected output and common errors. Links appear beside the landing action and in lesson one. Installation time is explicitly variable. The sample was compiled with the installed macOS compiler; Windows/Linux installation was checked against official documentation, not executed on those operating systems.
- **Backups:** Home offers a copy after meaningful progress. Dismissal or starting a download pauses the reminder until five further completed lessons. Restore/reset rebase the reminder history. No calendar or repeated notification is involved. Copy says “download started,” because the browser cannot confirm the user saved a file to disk.
- **Restore:** Settings validates the whole file, then opens a native, keyboard-accessible review dialog showing the file name, saved-record count and completed lessons before replacement. Users can cancel or export current work first. Existing rollback and account isolation are retained.
- **Connection and storage recovery:** account loading is bounded to eight seconds. During an error, a read-only export is available only for the identity already verified in this tab, including a previously verified local-only workspace. A known sign-out clears account identity. It does not switch to another saved account or open authenticated pages without verification. Pending completion data can be exported without writing it back to full browser storage.
- **Accessibility:** slightly darker muted/sage text preserves the palette while correcting contrast failures. Search uses its visible text as its name with an icon-only fallback; code blocks can receive keyboard focus for horizontal scrolling. Reduced motion remains supported.

## Requested design skills

Installed `landing-page-design` and `figma-designer` from `elayadesign/ai-design-skills` into `.agents/skills`, with `skills-lock.json`. Applied the relevant guidance on spacing, readable text, clear CTAs, complete states, keyboard support and honest copy. Gradient’s explicit identity and restrained-motion requirements take precedence over generic font/palette/reveal mandates. Figma guidance is available for future Figma work; this phase did not create or claim to edit a Figma file.

## Verification

- **58 tests passed** across nine files; TypeScript passed. New regressions cover provider byte limits, every scheduler-state backup, failure at each completion-write boundary, reload recovery, old partial completion, reset safety, reminder rebasing and account-scoped recovery exports.
- Optimized Next.js production build passed in an isolated source copy, leaving localhost development available on port 3000.
- Full isolated browser journey: public setup platform choices → actual password-free signup → lesson one → prediction and evidence → injected completion-write failure → retry → 1/30 on Home → reminder download → reload without reminder → recall to interval step 5 → export → review dialog → restore. No page errors observed in that journey.
- Also checked Escape cancellation, account-request failure/reconnect, an eight-second account timeout, recovery export while storage writes persistently fail, and the local-only workspace recovery branch. Tests never overwrote the user’s actual browser progress.
- **axe-core 4.14.0:** zero automated violations in 24 combinations: landing, setup, Home, lesson, Settings and courses × 375/1440px × light/dark. Some checks remain marked incomplete for human review; this is not a full WCAG certification. Known application-overlay issues outside these routes remain for Phase 3.
- **Lighthouse 13.6.0:** landing mobile and desktop, authenticated mobile Home/lesson, and mobile setup each scored **100 performance / 100 accessibility / 100 best practices / 100 SEO** in individual lab runs of the optimized local build. Largest contentful paint was 0.2–1.1s; total blocking time 0–10ms; CLS 0 except Home 0.005. Prepared sessions and local serving differ from the live Phase 0 baseline, so these are not a claim of measured field-speed improvement.

## Before and after

Phase 0 landing mobile: 100 / 96 / 96 / 100; desktop: 100 / 96 / 100 / 100. Phase 0 mobile lesson: 100 / 96 / 100 / 100. Phase 1 local build scans above: 100 in each category. The score difference does not prove sitemap/favicon work is complete; those assets are still scheduled for Phase 3.

Phase 0 default signup: HTTP 503. Phase 1 live signup: HTTP 200.

Phase 0 mature backup: rejected. Phase 1 mature backup: previewed and restored.

Phase 0 interrupted completion: day completed, Home stayed at lesson 1, recall absent. Phase 1: journal replay/retry advances Home and retains recall/evidence.

## Delivery boundary

The frontend changes are committed locally and available at http://localhost:3000/. They have not been pushed or deployed to Vercel as part of this phase. The small shared account-function fix is live in Supabase because it is required for signup to work. No database migration or destructive operation was performed.

Phase 2 has not started. Guided DSA content, richer lesson notes/resume, long-term review-session progression and honest outline-interest handling remain Phase 2 work. Remaining accessibility across supporting tools, SEO assets, privacy wording, timer/copy cleanup and repeatable lint/browser CI remain Phase 3. An in-browser C++ compiler is deliberately deferred pending a reliable, measured implementation.

## Setup sources

- [Apple command line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools)
- [MSYS2 getting started](https://www.msys2.org/)
- [Microsoft GCC/MinGW guide](https://code.visualstudio.com/docs/cpp/config-mingw)
- [Microsoft Linux C++ guide](https://code.visualstudio.com/docs/cpp/config-linux)
- [Supabase password security](https://supabase.com/docs/guides/auth/password-security)
