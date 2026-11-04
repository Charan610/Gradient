# Gradient curriculum expansion — 4 November 2026

Implemented locally from the supplied master audit. The existing design system, scroll effects, account verification gate, and browser-local workspace model remain in place.

| Course | Guided lessons |
| --- | ---: |
| C++ Foundations and Systems Depth | 45 |
| Data Structures and Algorithms | 45 |
| SQL and Database Design | 12 |
| Computer Science Core | 12 |
| Backend Engineering | 12 |
| Applied AI and Retrieval | 10 |
| **Total** | **136** |

The first 50 lesson records retain their original IDs, tasks, content, and sequence positions. The 86 new lessons start at sequence 51. This preserves the meaning of active-day indexes in existing workspaces and version-1 exports. Existing practice checkpoints and saved interests remain available on course pages.

Each new lesson includes an explanation, worked input/output example, independent lab, verification cases, recovery hint, self-check answer, and topic-specific reference. New content is split into six downloadable modules. The generated lesson index contains titles, goals, pacing, and recall prompts/answers; saving completion does not wait on a content download. After editing lesson source, regenerate the catalog with `node scripts/generate-lesson-index.mjs`.

All nine roadmap phases connect to guided lessons, projects, or the applied deliverables specified for P5, P6, and P8. Project C retains its previous milestone IDs and gains a fourth milestone. Projects A and B keep their existing milestone identifiers and evidence. Insights displays all six course totals and progress for the three projects. The course return link preserves catalog search and filters independently of the lesson list's filters.

Version-1 backups, restore rollback, and recovery exports recognize the new lesson families while continuing to accept historical P-number IDs. The existing account lock, note serialization, and completion profile re-read remain in place. The course library reads progress in one scoped operation instead of acquiring a separate lock for each lesson.

The existing public feedback link uses a safe prefilled title and body. It does not force a label: [GitHub documents](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-an-issue#creating-an-issue-from-a-url-query) that issue links with restricted query actions can return 404 for users without permission. No issue was submitted.

Verification: 222 automated tests, TypeScript, and isolated production build. Automated tests complete the entire sequence and round-trip notes, task records, and recall. Browser checks covered all six catalogs, a preserved in-page return link, Project C, Insights, roadmap links, desktop homepage, and all 86 new lesson routes at 375px. Each new guide loaded, with no horizontal overflow or browser errors. Browser tests used a mocked account in an isolated context, not real student data.

Delivery branch: `codex/gradient-followup`. Automatic deployments are disabled on this branch. Publishing it does not merge into main, deploy the app, or change the production database.
