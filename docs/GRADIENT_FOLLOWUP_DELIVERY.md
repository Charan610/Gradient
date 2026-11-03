# Gradient follow-up delivery — 3 November 2026

This report covers the follow-up to the data-safety fixes and the request to implement the remaining suggestions. It supersedes earlier completion counts for this patch. The delivery branch is `codex/gradient-followup`; its automatic Vercel deployments are disabled so publishing the code does not release it to production.

## Implemented

### Data safety

The preceding restore/export fixes remain included. Ordinary reads do not replay a restore undo image. Emergency export waits for the account lock. After downloading the preserved copy, the existing recovery screen explains how **Try again** explicitly recovers the original records. Fresh-tab local workspaces can also find their validated recovery copy. Account changes and changed journals are checked before recovery.

### Motion and performance

- The 3D loader respects reduced-motion preferences, including changes while it is running. Its default appearance, geometry, layout, and animation timing remain intact.
- Loader exit completes once, including its fallback timer, and exits promptly with reduced motion.
- Loader/background animation stops while hidden and after WebGL context loss. Cleanup removes listeners, RAF callbacks, and renderer resources.
- The background cannot accidentally start a second RAF chain when visibility and motion preferences change together.
- Shared course validation and command search use a small navigation index instead of importing every expanded lab. Course titles and search destinations are unchanged and tested.
- Build output after the index split reduced most workspace routes by approximately 13–14 kB of reported First Load JS compared with the intermediate expanded-content build. This is a bundle measurement, not a Lighthouse score or a claim of a universal speedup.

### Learning content

All 16 existing DB, CS, Backend, and AI outline checkpoints now contain substantive explanations, safe local exercises, expected outputs, boundary cases, and self-check reasoning. Course/topic IDs, titles, counts, and the existing paragraph/accordion structure are preserved. C++ and DSA lessons are unchanged. These are still self-directed outlines, not newly claimed guided courses.

- SQL: temporary schema and constraints, LEFT JOIN/count behavior, failed and successful transaction transfers, index/query-plan measurements.
- CS: separate process state, deterministic lost updates and real locked workers, HTTP request inspection, and distinguishing transport failures from application responses.
- Backend: input boundaries, transactional rollback, owner-scoped writes, isolated tests, and verified references to existing project milestones.
- AI: offline keyword retrieval, explicit query expansion versus embeddings, reviewed evidence and abstention, and worked macro/pooled Recall@2 calculations.

Primary references: [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [Python SQLite](https://docs.python.org/3/library/sqlite3.html), [threading](https://docs.python.org/3/library/threading.html), [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/), [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html), [retrieval evaluation](https://nlp.stanford.edu/IR-book/pdf/08eval.pdf), and OWASP [authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) / [prompt injection](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

### Feedback

Settings has a link to the verified, public `Charan610/Gradient` GitHub issue-review flow. The student reviews and submits on GitHub; opening the link sends no message. The draft includes only sanitized route context. Queries, fragments, arbitrary dynamic route values, learner aliases, notes, and application records are excluded. An adjacent notice explains that submitted issues are public. There is no local-only submission log or false “sent” confirmation.

### Optional cloud backups

The implementation includes an authenticated API, manual Settings controls, and a reviewed database migration:

- No study data is uploaded automatically. Opening the controls only requests metadata.
- A manual save creates a separate snapshot. Ten insert-only slots bound source storage to 30 MiB per account, with a 3 MiB limit per copy. Existing local exports keep their 5 MiB limit.
- Racing saves cannot overwrite an existing snapshot. A slot conflict is reported for retry; old copies are never evicted automatically.
- Users can download or explicitly delete a selected cloud copy. Downloading never restores browser records; the existing local import preview remains the restore boundary.
- The server verifies the session identity and the browser's captured account ID. Ownership filters and Supabase RLS protect reads and deletion; write requests require the same origin. No service-role key is used by this feature.
- Payloads are bounded while streaming and validated with the existing backup parser before insertion. Responses are not cached.
- Upload timeouts/network failures report an unknown outcome, because a server may have committed after the connection was interrupted. Save remains disabled until a validated list refresh succeeds.
- A failed refresh after a confirmed mutation preserves the true success message, marks the list stale, and clears a deleted selection immediately.
- Cloud availability does not affect local exports/imports. If setup is missing, the controls explain that and disable upload.

Ownership design follows [Supabase's grants and RLS model](https://supabase.com/docs/guides/database/postgres/row-level-security). Privacy text now accurately describes manual cloud uploads, deletion, public GitHub feedback, and the distinction between local reset and cloud deletion.

## Verification

- **209 automated tests passed across 25 files**, including the original data-safety suite, cloud API/client cases, 27 feedback privacy cases, 12 animation lifecycle cases, and 12 content integrity/execution cases.
- TypeScript passed with `npx tsc --noEmit --incremental false`.
- The isolated production build passed, including framework validation and 28 generated static pages. It includes `/api/backups`.
- `python3 scripts/test-cloud-backups.py` passed against disposable local PostgreSQL. It applies the actual migration and verifies owner reads, foreign/anonymous denial, insert ownership, absent UPDATE privileges, byte/slot limits, deletion isolation, and a real two-session insert race. It never reads project credentials or connects to production.
- Every copyable inline Python example executes in the content tests. The SQL labs were also run against local PostgreSQL, including expected constraint failures, joins, rollback, transfers, and lookup results.
- Browser checks at **375px and 1440px** verified manual cloud save/download/delete, no automatic requests before opening the controls, captured account headers, unknown-upload retry blocking, stale-list deletion behavior, public-feedback notice, unchanged local storage, and no page errors/overflow. Cloud service responses and account GET responses were mocked in isolated contexts for these tests.
- With the real local API left unconfigured, browser checks confirmed its honest unavailable message, disabled cloud upload, and working local backup export/restore controls.
- All four expanded subjects were checked with every checkpoint open at mobile/desktop widths in confirmed light/dark themes: no horizontal or paragraph overflow and no page errors.
- Instrumented real WebGL calls: 154 calls during the sampled normal-motion interval, 0 after reduced motion settled, 0 while visibility was simulated hidden, and 154 after resuming. This verifies behavior in this browser, not battery-life or frame-rate claims across devices.
- The earlier note autosave/reload, browser Back/filter, two-tab export-lock, and explicit recovery checks remain recorded in `GRADIENT_DATA_SAFETY_VERIFICATION.md`.
- Independent reviews found recovery-access and cloud error-state issues during implementation; these were fixed. Final reviews reported no remaining concrete blockers in their inspected scope.

## Activation and remaining limits

Cloud backup is implemented but **not active in production**. Its new table does not yet exist in the production project. Before enabling it in a separately approved release:

1. Review and apply only `supabase/migrations/20261103093845_study_backup_snapshots.sql` to the intended project. Do not blindly replay older migrations.
2. Set the server-only deployment variable `GRADIENT_CLOUD_BACKUPS_ENABLED=true` after the migration succeeds. Existing Supabase URL/key and account session configuration remain required. Leaving the flag unset keeps the API unavailable safely.
3. Deploy the reviewed application and verify two real authenticated accounts: each can manage its own snapshots and cannot access the other's. Run production security advisors after the approved schema change.

No production migration, environment change, test-user creation, public issue submission, or deployment was performed here. The API tests use mocked session/database clients; the SQL tests use real local PostgreSQL with a representative `auth.uid()` function. They do not replace the production identity/RLS smoke check after activation.

There is no automatic cross-device merge/sync or end-to-end encryption. Cloud snapshots intentionally require an explicit restore review. Browser storage clearing, disk failures, uncooperative older tabs, and malformed historical records remain outside a blanket “no data can ever be lost” guarantee. A reported browser download means initiation, not proof the user retained the file.

The site's visual identity and existing page structures were retained. This request adds small functional Settings controls and updates educational/privacy text; it is not a claim that every screenshot is pixel-identical. No full Lighthouse, WCAG certification, or multi-browser device study was run.

## Delivery status

The changes are packaged on `codex/gradient-followup`. The last inspected production baseline was `4012bc6`. Publishing this branch does not merge it into `main`, apply the database migration, enable cloud backups, or release the application. Review the branch before a separately approved release.
