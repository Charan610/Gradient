# Gradient 2.0 — final implementation and release report

**Status: local implementation and QA handoff. Production release is on hold.** Gradient still serves the same 136 legacy lessons and uses the same theme, routes, accounts, and browser-scoped learner records. The follow-up is prepared for the deployment-disabled branch. No draft has been published and no migration or production deployment has been performed.

## What was delivered

1. **Repository and curriculum audit.** Read the ten blueprint documents; inventoried all 136 lesson IDs and their outcomes and tasks, and recorded theme tokens and mobile/desktop screenshots. The six actual course counts are 45 C++, 45 DSA, 12 SQL/database, 12 systems, 12 backend, and 10 AI. The old 50-lesson README figure was not the audit baseline. The branch already contained a separate QA patch; it was preserved.
2. **Content contracts.** Added a versioned TypeScript/Zod manifest for tracks, modules, skills, resources, exercises and lesson drafts. Checks reject broken references, duplicate IDs, prerequisite cycles, mismatched assessments, and invalid publication metadata. The dry-run adapter enumerates all 136 existing routes and task IDs. It transfers zero mastery records and changes no saved sequence indexes.
3. **Navigation and theme.** Made Practice and Build direct destinations, separated browsing from resuming, added lesson jumps and a primary reference with optional further reading, and surfaced the next saved project milestone on Today. Palette tokens, Manrope, light/dark behavior and background source stayed intact.
4. **Practice and recovery.** Added one local C++ prediction pilot on the existing Practice page. Guided attempts and independent passes are distinct; a failed answer preserves earlier evidence. The pilot supports revision and snooze. Evidence uses the existing scoped profile, lock and v1 backup pathway; no new DB or sync service was added.
5. **Curriculum preparation.** Kept 13 units in draft: three Phase 2 pilot units (C++ reference/value, binary-search boundaries and SQL isolation); five foundations units (Python collections, control flow, functions, testing and Git); and five later units (SQL joins, task ownership, TCP framing, cited lexical search and project defense). None are published. The Phase 4 pilot is a separate in-app prediction check, not publication of a draft course.
6. **Release QA.** Verified the candidate locally. Results, dependency findings and unresolved release gates are below.

## Corrected 12-month rollout

| Window | Learning sequence and evidence |
|---|---|
| 1 | C++ setup, loops, functions and arrays; small Python scripts, debugging and Git. Compile, trace and commit an explained change. |
| 2 | STL, Python collections, hashing, sorting, two pointers, sliding windows and boundary tests. Solve and explain an unseen beginner pattern. |
| 3 | Binary search, linked lists, stacks and queues; SQL joins and HTTP. Build a small CLI or API and explain a relational report. |
| 4 | Trees, recursion and backtracking; normalization, Python typing and FastAPI validation. Build database-backed CRUD. |
| 5 | Heaps, OS basics, authorization, migrations and failure tests. TaskFlow MVP: prove owner isolation and invalid-input behavior. |
| 6 | Graphs, transactions, indexes, Docker, CI and networking. Reproduce a TaskFlow build, explain failure modes, then review eligible applications. |
| 7 | Graph traversal, greedy, introductory DP, OS and DBMS interview drills. Demonstrate unseen mixed practice. |
| 8 | DP patterns, API reliability, security and performance. Extend TaskFlow only where the MVP evidence supports it. |
| 9 | LLM interfaces and structured outputs; Codebase Intelligence lexical baseline with exact revision/path/line citations and labeled queries. |
| 10 | Embeddings, hybrid retrieval, evaluation, and injection boundaries. Compare against lexical baseline before adding optional generation. |
| 11 | Target weak DSA and core CS topics, introductory design, mock project defense and behavioral examples. |
| 12 | Timed mocks, portfolio polish, communication and application follow-up. |

These are flexible recommendation windows, not hard route locks. Communication, recall and applications run in parallel. TaskFlow and Codebase Intelligence are candidates for mapping the existing backend/retrieval projects; their old milestone IDs and evidence remain authoritative until an equivalence review. Do not infer internship eligibility or placement outcomes from completion.

## Content sources and evidence

- Foundations: [Python functions](https://docs.python.org/3/tutorial/controlflow.html#defining-functions), [unittest](https://docs.python.org/3/library/unittest.html#basic-example), and [Pro Git: recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository). Original examples cover returned counts, a test that detects a strict-comparison bug, and staging versus working-tree edits in a disposable repository.
- Engineering: [PostgreSQL joins](https://www.postgresql.org/docs/current/tutorial-join.html), [Read Committed](https://www.postgresql.org/docs/current/transaction-iso.html), [HTTP 404](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.5), [TCP data communication](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.7), [PostgreSQL text search](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING), and [GitHub pull request review](https://docs.github.com/en/pull-requests/reference/pull-requests#working-with-pull-requests). These links are references, not copied course text. The ownership lab tests a lookup model, not real HTTP auth. The framing lab tests supplied byte chunks, not network performance. Project defense is a human rubric and is not automatically graded.
- The [Helsinki MOOC 2026](https://programming-26.mooc.fi/) advertises access through end of 2026. Recheck the edition before 2027 recommendations. Recheck exact fit, access and licensing before publishing each resource.
- Fixture passes establish the tested behavior only. No learner code runner, AI tutor, or new privileged integration was added. Read Committed examples show no dirty reads; lexical ranking is not mislabeled as built-in BM25. Do not reuse research claims about fixed pointer addresses, universal problem counts, or prompts as a complete injection defense.

## Release decision and rollback

**Do not release this candidate yet.** Independent technical and educational review is still required before publishing the drafts. The full 12-month curriculum remains a rollout plan; these batches are not complete coverage. Real sign-in, cross-user authorization, hosted recovery, assistive technology, and performance on physical devices still need staging verification. Phase 1 metadata showed the configured Supabase project had no cloud backup table. Local and mocked backup tests are not proof of hosted backups or sync. No remote schema was changed.

The original source checkpoint and the dirty QA patch were preserved privately. Before any deployment, compare the exact candidate with staging, export a private study backup and verify recovery with synthetic data, and agree on the known-good deployment to restore if rollback is needed. Keep the 136 legacy route IDs, task IDs and sequence values stable. Reverting the practice UI does not require deleting the optional evidence field. Do not restore an old backup automatically or delete learner records. Existing v1 backups remain supported; a user-confirmed restore still replaces the current workspace with the selected backup.

Complete standalone lint setup and real staging checks before signing off. Do not force a dependency migration or enable cloud storage as part of rollout without testing those changes. Obtain explicit production authorization separately.

## Final check log

| Check | Result |
|---|---|
| Unit and regression suite | 232 passed across 31 files with `npm test -- --maxWorkers=2 --testTimeout=20000`. The earlier run during build hit two 5-second timeouts. Both passed on the controlled rerun. |
| TypeScript and whitespace | `npx tsc --noEmit --incremental false` and `git diff --check` passed. |
| Production build | Isolated `npm run build` completed on Next.js 15.5.29; local server started. |
| Executable content | C++20 reference and boundary examples, PostgreSQL 16 isolation/join/search checks, Python count/boundary/ownership/framing, and the isolated Git lab passed. Project defense is a review worksheet. |
| Theme and legacy source integrity | Global tokens, theme provider, 3D background, curriculum source and course index match their audited hashes. |
| Local headers | Contact returned 200 with CSP, frame denial, nosniff, referrer and permissions policies. The CSP allows inline bootstrap script/style as configured; this is not a strict nonce policy. |
| Production dependency audit | Pinned Next.js 15.5.29 and updated the lockfile. Critical findings went from one affected package to zero, including the version range in [Next.js's image optimization advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw). The follow-up upgrades Zod to 4.6.7 and pins patched Next.js transitive dependencies (PostCSS 8.5.32, sharp 0.35.5). The production audit then returned zero known vulnerabilities. |
| Navigation in Chromium | Passed at 320, 900 and 1440 px with a synthetic account: project milestone, keyboard Practice navigation, Build, resume at lesson 51, and Notes jump. No document overflow in those flows. |
| Practice in Chromium | Passed at 320 and 1440 px: keyboard answer, guided versus independent result, save while offline, and persistence after reload. No document overflow or uncaught page errors in those flows. |
| Agent Desktop | Confirmed the Contact and support page in Chrome on the patched local build. |
| Final theme matrix | 32 matched captures over eight routes at 360 and 1440 px in both themes. Theme, font, canvas and accent matched Phase 1; no capture failures, document overflow or uncaught page errors. This checks theme parity, not pixel identity of the updated navigation. |

The proposed first publication batch is **Python collections → control flow → functions**. It reuses the functions draft and keeps the new Python lessons out of learner routes until reviewed. Official references: [Python data structures](https://docs.python.org/3/tutorial/datastructures.html) and [Python for statements](https://docs.python.org/3/tutorial/controlflow.html#for-statements).

**Follow-up verification:** Re-ran all 232 tests, TypeScript, and the isolated production build with the patched dependencies and the expanded Python draft batch. The local image optimization endpoint returned a valid WebP using the updated sharp package. Practice saved offline and survived reload in Chromium at 320 and 1440 px. Real staging authentication and hosted recovery remain unverified.
