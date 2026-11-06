# Gradient 2.0 — Phase 2 journal and dry-run report

2026-11-06 · Gate 1: local pilot checks passed. No publication or migration performed.

**Decision.** Keep source-controlled TypeScript and existing Zod. A versioned manifest can be validated without a CMS, database migration or executable MDX. Tracks/modules/skills, resources, exercises and draft lesson definitions have distinct identifiers. Month numbers describe a recommended path only. The pilot is not imported by any page, so lesson bodies, assessment keys and the theme currently visible to learners remain exactly as before.

**Demonstrator.** Three original draft units cover reference/value parameters, sorted binary-search boundaries and PostgreSQL Read Committed transfer visibility. Fixtures use C++20 and a disposable PostgreSQL cluster with no TCP listener; they are repository checks, not a learner runner. Automated results are not human review. The PostgreSQL and Helsinki landing pages were checked during Phase 1; other links and exact section/access fit remain unreviewed. Helsinki 2026 is marked time-limited. Resources are link-only and use separate IDs: legacy R01 remains CS50x, never an implicit alias for LearnCpp.

**Dry run.** The read-only legacy adapter enumerated 136 unique lesson IDs and existing sequences 1–136 (45 CPP, 45 DSA, 12 DB, 12 CS, 12 BE, 10 AI). All keep original routes and task IDs. It maps only candidate tracks (DB→SQL, BE→WEB, others retain their track IDs). All 136 competency equivalences remain unreviewed, zero evidence records transferred, zero changes to progress, zero missing candidate tracks. The full legacy ID/outcome inventory remains in the Phase 1 audit. Before any later migration, review equivalence against exact outcomes and verify synthetic backup/restore, rerun and rollback.

**Verification.** npm test: 226 passed across 28 files. Strict TypeScript check and isolated production build passed. npm run content:validate targets the contract tests. npm run content:fixtures passed with Clang and PostgreSQL 16 binaries on PATH. The pre-existing standalone lint setup gap remains. No new dependencies.

**Rollback.** Remove src/lib/content/{manifest,pilot,legacy}.ts, tests/content-manifest.test.ts, tests/fixtures/content, this report, and the two content npm scripts. No database or learner data rollback is required. A private source checkpoint of the audited files was created alongside the Phase 1 audit before edits; it excludes local secrets and learner data. The unrelated QA patch remains in the worktree.

**Next gate.** Review the pilot before authorizing Phase 3. Human technical and educational review, precise resource mapping, and full corrected 12-month publication are still ahead. Deployment was not attempted.
