# Gradient 2.0 — Phase 3 journal

**Navigation decision.** Desktop: Home, Learn, Practice, Build, Career. Mobile: Home, Learn, Practice, Build, You. Career and Progress remain accessible from the workspace menu; Practice also links to Progress. Learn offers Resume lesson separately from browsing courses. Existing URLs are unchanged.

**Lesson and Today.** Added keyboard-operable jumps to the guide, activity checklist, and notes; surfaced the first existing resource with remaining references in a disclosure. Kept original URLs, explanations and rubrics. Today can show the next unchecked milestone for an already-started project, using existing read-only project access. Existing recall, saved lessons, notes, and backup flows retain their storage contracts.

**Verification.** 226 tests in 28 files, TypeScript, production build, and git diff check passed. Synthetic browser flow passed at 320, 900 and 1440 px: next saved project milestone, keyboard activation of Practice, Build navigation, resume at lesson 51, Notes jump, and no document overflow. Mobile navigation targets measured at least 44 × 44 px. First browser run caught an undefined fifth icon; corrected with group-based mapping and rebuilt. Agent Desktop verified the signed-out local entry screen. No real account was used.

Compared 32 screenshots at 360 and 1440 px in both themes with the Phase 1 capture matrix; computed theme, font, canvas and accent matched. No overflow or uncaught page errors in the final captures. Existing global theme tokens, typography and background source were not edited. This is not a full accessibility or moderated usability review. Evidence: ~/Downloads/Gradient_2_0_Phase3_QA.

**Rollback.** Revert only the Phase 3 component and Sass diffs plus this journal. Preserve pre-existing QA and Phase 2 changes. No data or database rollback is needed. No push or deployment. Phase 4 is held for approval.
