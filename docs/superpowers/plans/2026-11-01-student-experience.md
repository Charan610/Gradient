# Student Experience Implementation Plan

Goal: make the next learning action immediately understandable, while preserving saved work.
Architecture: retain existing routes and repository; derive Home from saved profile/tasks; share primary and contextual navigation. Existing Next.js, React and SCSS, no new services.
Spec: docs/superpowers/specs/2026-11-01-student-experience-design.md

- [x] Add and test a pure home-journey resolver. Guard missing lessons, incomplete records and end-of-content.
- [x] Consolidate desktop/mobile navigation into Home, Learn, Progress, Career, with profile settings and contextual links preserving every capability.
- [x] Replace dashboard duplication with a focused, responsive Home and real saved state, first-task guidance, progress, next lessons, optional recall and recovery states.
- [x] Simplify lesson labels/resources, disclose supplementary detail, add next-step completion action and preview/error states.
- [x] Correct progress labels and estimated effort, surface learning review and projects.
- [x] Test regressions and production build; verify actual desktop/mobile journeys using browser automation. Document remaining limitations.

Review focus: browser storage failures must not look like zero progress; preview cannot advance sequence; completed plan cannot loop back to lesson 30 as current; maintenance cannot suggest required new work; alternate study outlines must not claim tracked guided completion.
