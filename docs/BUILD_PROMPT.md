# MASTER BUILD PROMPT — A DAY-BASED CAREER PREPARATION OPERATING SYSTEM

> Paste this entire prompt into a coding agent (Codex, Claude Code, Cursor, etc.). Put `Product_Company_Career_Roadmap_2026-2029_SOURCE.md` in the repository under `content/source/` first, or provide its correct local path. The source is the curriculum of record; this instruction is the implementation specification.

## ROLE AND NON-NEGOTIABLE OBJECTIVE

You are a senior product designer, UX engineer, full-stack Next.js engineer, database architect, and QA lead. **Actually implement and test** a polished, fast, responsive, accessible, multi-user career-preparation web application for an Indian undergraduate aspiring to top software-engineering internships and product-company placements. The app's working name is **FOUNDATION**; keep the name in a centralized constant for later renaming.

This is **not** a landing-page-only mockup, Notion clone, generic AI-generated dashboard, or collection of disconnected cards. It is a serious **personal study operating system**: each user gets a coherent ordered program, clear daily work, checkpoints, revision, projects, application tracking, measured progress, and realistic adaptations to their study capacity. The website must have functional persistence, not merely UI states stored in memory.

**Essential interpretation change from the attached source:** The Markdown roadmap contains historical absolute-date and semester estimates. **Do NOT surface, copy, calculate, or schedule from those dates.** Do not put calendars, due dates, countdowns, start dates, “overdue”, months, year ranges, or time-to-hire guarantees anywhere in the learner-facing roadmap. The governing structure is strictly:

`Track → Phase → Module → Learning Day 01, 02, 03... → Focus Tasks → Review Tasks → Evidence → Readiness Gate`.

Display user-facing labels such as **Phase 0 · Day 01**, **Learning Day 18**, **Next session**, **Study days completed**, **Ready for the next phase**. The integer `learning_day_index` is a *learning sequence*, not an elapsed calendar-day counter. If a user pauses for several real days, they return to the same learning day with no penalty. Internships may refer to academic eligibility as **2-2 / 3-1 / 3-2 / 4-1** (or configurable semester); never map these to fixed dates in the curriculum. Internal server timestamps may be persisted for event ordering, data integrity and analytics, but no absolute calendar dates appear in the learning UX.

## FIRST ACTIONS — MUST PERFORM, NOT JUST DESCRIBE

1. Inspect the repository and read **all** of `content/source/Product_Company_Career_Roadmap_2026-2029_SOURCE.md`. If missing, search the workspace; if still missing, report precisely that you need the original source and do not fabricate its content.
2. Extract stable phase IDs `P0`–`P8`, module IDs such as `P0.01`, subject IDs, all project gates, source-supported resource IDs `R01`–`R41`, syllabus sections, internship/placement guidance and source confidence labels. Note that the original source contains a first-12-week illustration that must be re-authored as learning-day sequences without fixed dates or weekday assumptions.
3. Before implementation, create `docs/CONTENT_MAPPING.md`, `docs/INFORMATION_ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/DATA_MODEL.md`, `docs/IMPLEMENTATION_PLAN.md`, and an initial migration/seed strategy. These are working specifications, not substitutes for code.
4. Implement in dependency order, run commands/tests, and fix failures. Provide actual working pages and persistence. Do not stop after mockups or documentation.

## PRODUCT PHILOSOPHY AND DAILY LEARNING RULES

Target **90–120 minutes per ordinary study day**, adjustable per user to **45, 60, 90, 120 or 150 minutes**; 12–15 focused hours per normal college week is a general guideline, not a rigid requirement. Provide **Light Day (30–45 minutes)**, **Normal (75–110 minutes)** and **Deep Focus (120–150 minutes)** options, determined by the learner's choice, not by surveillance. During exams, offer **Maintenance Mode**: 15–30 minutes of optional reviews only, pausing new required material. Returning from breaks must be guilt-free.

**Each learning day** consists of a realistic, finite plan:
- Goal (one sentence): what the student will actually be able to do by the end.
- **Learn** (20–35 minutes): specific resource, exact assigned sections from the master file, purpose, what to skip, “Open resource”.
- **Practice** (35–55 minutes): one or two concrete exercises/problems, expected deliverable, appropriate difficulty and any starter material.
- **Apply / Explain** (15–25 minutes): small code change, commit, conceptual explanation, SQL query, debugging or output artifact.
- **Review** (10–15 minutes): recall an older concept where appropriate, using spaced repetition; show review items separately from new content.
- **Finish**: optional self-rating (Confident / Needs Review), notes, evidence link, time spent, “Finish Day”.

These time bands are *templates*; the sum must never silently exceed the configured budget. Some sessions will have no coding exercise, but each has meaningful proof of learning. All durations are estimates, not timers forced on the learner. **Two required substantial tasks maximum for normal weekday sessions**; anything else is optional or a short review. Split hard subjects over multiple days. Never give three medium LeetCode problems to a beginner on Day 2.

**Progress rules:** Each task has `not_started`, `in_progress`, `completed`, `skipped_optional`; task records are private per user. Required items must be checked before a normal day becomes `completed`. Optional items do not block. “Mark Done” must save to database immediately and correctly on refresh and a second device; optimistic updates must roll back on failure. A study day can span any number of real-life days. Clicking `Finish Day` with incomplete mandatory items must show which items remain and offer `Keep Working`, **not silently advance**. Add a deliberate “Mark mastered / Skip topic” route with self-assessment and recorded reason for users who already know something, but require the phase gate before unlocking the next phase.

**Phase advancement:** Show prior/current/next phases and dependencies. A readiness gate is a user-run assessment with clear pass criteria, evidence and a manual retry path. Do not promote a phase just because a target duration passes or a percent reaches 100. Keep advanced modules browsable as read-only previews without undermining ordered learning.

**Revision:** Create a small recall queue per concept with learning-day offsets `+1, +3, +7, +21, +45` *completed learning days* after the initial exposure, not literal days of the week. Increase/decrease intervals based on self-rated recall and failed assessments. Due reviews should appear at the top of the next active learning session; limit to a configurable review budget (e.g. 15 minutes) and roll excess forward. A review queue must not auto-mark a day complete. Avoid penalizing missed reviews. Store historical attempts and mistake tags.

**Hard behavior to test:** Finish Day 01, log out, sign in on a second browser, and see Day 02. Leave Day 02 untouched for any length of time: it remains Day 02. On a new account, start at P0-D001 unless onboarding demonstrates mastery. If all required content is done but the exit assessment fails, remain in current phase and recommend targeted revision.

## SITE MAP — IMPLEMENT THESE AS REAL ROUTES

Public: `/` (minimal product intro, access to browse), `/explore` (read-only roadmap), `/sign-in`, `/sign-up`, `/privacy`.

Authenticated:
- `/app/today` — core daily cockpit and `Continue learning` action.
- `/app/roadmap` — all nine phases, dependencies, milestones, confidence labels.
- `/app/roadmap/[phaseId]` — phase overview, modules, gate requirements, linked resources.
- `/app/learn/[phaseId]/[dayId]` — the *actual* study session; task checklists, resource details, evidence, notes, review.
- `/app/subjects/[subjectId]` — persistent skill syllabus for C++, DSA, DBMS, OS, networking, backend, system design and AI engineering.
- `/app/resources` — searchable annotated resource catalog with direct original links and “study this section” details.
- `/app/review` — recall queue, mistakes and spaced-repetition attempts.
- `/app/projects` and `/app/projects/[projectId]` — three canonical projects, task milestones, evidence, readme/deployment checklists.
- `/app/career/internships` and `/app/career/placements` — readiness, official career links, eligibility checklists, preparation tracks.
- `/app/career/applications` — manually entered internship/job application pipeline, status and interview notes. **Do not imply openings are live without a real feed.**
- `/app/insights` — calm, truthful study insights rather than gamification pressure.
- `/app/settings` — time budget, profile, semester, modes, theme, export/delete private data.

Provide a global `⌘K / Ctrl+K` **command palette** for search/navigation (phases, topics, resources, projects) and actions such as “Continue Day”, “Open review queue”, “Add application”. On mobile make the equivalent accessible through the search affordance, not a keyboard requirement.

## VISUAL INSPIRATION — OPEN EACH URL AND STUDY A SPECIFIC PATTERN

**References are cues, not permission to copy assets, proprietary layouts, trademarks or source code. Combine recognizable interaction principles into original UI.** Before coding, review these pages and note which elements actually fit this product:

1. **Linear** — https://linear.app/ and https://linear.app/docs/conceptual-model ; inspiration: compact left navigation, dense but readable list rows, understated interactive states, clear status hierarchy, keyboard-first behavior. **Borrow for:** desktop shell, phase navigator, module rows and application pipeline. **Don't copy:** branding, purple/blue accents or issue tracker vocabulary verbatim.
2. **Vercel Geist** — https://vercel.com/geist/introduction , https://vercel.com/geist/typography , https://vercel.com/geist/colors ; inspiration: crisp hierarchy, restrained typography, disciplined scale, subtle borders and accessible contrast. **Borrow for:** design tokens, page rhythm, subtle panels and typography. **Don't borrow:** its blue accent; use grayscale/sage instead.
3. **Things 3** — https://culturedcode.com/things/features/ and https://culturedcode.com/things/support/articles/4001304/ ; inspiration: serene, minimal today-oriented task view, generous vertical breathing room, satisfying completion feedback. **Borrow for:** Day view, ordered task groups, progress without pressure. **Don't copy:** app-specific icons or screenshots.
4. **GitHub Projects** — https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects ; inspiration: table/board views, rich filters, useful metadata. **Borrow for:** job application statuses and project milestone list. **Avoid** its calendar-based roadmap timeline; this application is **sequence-based**.
5. **roadmap.sh** — https://roadmap.sh/ and https://roadmap.sh/backend ; inspiration: clear dependency order and visible learning map. **Borrow for:** node/phase dependency visualization and topic granularity. **Do not** replicate its exact diagrams or overwhelm mobile with a huge canvas.
6. **Notion projects** — https://www.notion.com/help/guides/getting-started-with-projects-and-tasks ; inspiration: linked project/task structures and inline metadata. **Borrow for:** evidence notes and project workspaces, but make the interface more opinionated than a generic database builder.
7. **Raycast** — https://www.raycast.com/ and https://manual.raycast.com/quicklinks ; inspiration: rapid command search, clean interaction states, keyboard affordances. **Borrow for:** command palette and quick navigation.
8. **Mobbin** — https://mobbin.com/explore/mobile/screens ; browse *today lists, onboarding steps, checklist, progress, details, bottom navigation* screenshots for mobile interaction consistency. Inspiration only; access may be sign-in limited.
9. **Radix Primitives** — https://www.radix-ui.com/primitives and **shadcn/ui** — https://ui.shadcn.com/docs/components/base/sidebar , https://ui.shadcn.com/docs/components/base/checkbox , https://ui.shadcn.com/docs/components/base/progress , https://ui.shadcn.com/docs/components/base/sheet , https://ui.shadcn.com/docs/components/base/chart . **Borrow accessible interaction primitives and patterns; restyle in our SCSS system**.
10. **Vercel Web Interface Guidelines** — https://vercel.com/design/guidelines ; use as a QA checklist for responsive states, keyboard accessibility, feedback, forms and performance.

Create `docs/DESIGN_REFERENCES.md` with a reference-to-component matrix, the URL, observed/verified detail, proposed adaptation and why it improves learning. If a page cannot be accessed, record that fact rather than invent its appearance.

## EXACT ART DIRECTION — NO BLUE, NO LOUD COLORS

Design language: **Editorial Productivity / Quiet Technical Luxury**. Feels like a polished developer tool blended with a focused study notebook, not a fintech dashboard, startup admin template, children's education app or neon cyberpunk site.

- **Light theme (default):** `--canvas:#F7F7F3`, `--surface:#FFFFFF`, `--surface-soft:#F0F0EC`, `--ink:#21231F`, `--muted:#676B64`, `--hairline:#E1E3DC`, `--accent:#485B49` (deep muted sage), `--accent-soft:#E8EDE6`, `--warning:#80674D` (earthy muted brown). Prefer monochrome labels; green is reserved for achievement/completion and never used as a loud gradient. Validate contrast, adjust if necessary.
- **Dark theme:** `--canvas:#121412`, `--surface:#1B1E1A`, `--surface-soft:#252922`, `--ink:#ECEEE7`, `--muted:#B0B7AB`, `--hairline:#353B34`, `--accent:#A5B49D`. Keep neutral rather than pure black. Validate contrast independently.
- **Absolutely no blue hues** in charts, focus states, links, gradients, icon fills, loaders, shadows or primary/secondary buttons. No saturated purple, neon orange, glassmorphism, aurora gradients, huge glowing shadows, heavy 3D tilt, bouncing badges or confetti.
- Use **Geist Sans** or **Inter** for UI, **Geist Mono** or **IBM Plex Mono** for phase IDs, code labels and numeric data. Keep type 13–16px for UI, base body 15–16px, page headline 30–36px desktop / 25–29px mobile, major section 20–24px, eyebrow 11–12px with careful tracking. Line height 1.45–1.6 for reading.
- **8px spacing rhythm** with 4px micro increments: 4/8/12/16/24/32/40/48/64. Surface radius 14–18px; inputs 10–12px; button corners 10–13px; chips 8px or subtle pills. Borders 1px and soft neutral shadows (`0 3px 16px rgba(20,25,20,.045)`), not large floating panels.
- Use **SVG/Lucide** line icons, consistent stroke ~1.7px, size 16–20px. No emoji as main interface iconography. Prefer meaningful empty-state line illustrations drawn locally with CSS/SVG; avoid generic stock photos.
- Motion: 140–220ms ease-out for hover/transitions, 180–260ms for sheet/dialog entry; tiny 1–2px motion only where useful. Respect `prefers-reduced-motion`. No decorative infinite animations.
- **Signature button language:** Primary action is dark-ink/sage filled with an unusual but tasteful **trailing inset icon capsule** (`Continue learning ↗` or `Start Day 01 →`), balanced padding and a micro 1px lift on hover. Secondary button is surface + hairline border, quiet arrow/glyph. Tertiary appears as a text action with an animated short underline. Button states: hover, active, disabled, pending, focus-visible; touch target >=44x44px. Make buttons distinct without making the UI gimmicky. Never put gradients or floating shadows on every button.
- Use a subtle **architectural vertical rail** along phases, a compact progress numeral in mono, refined completion checkboxes, understated separators, and a muted horizontal progress track. No giant circular dashboard gauges, full-screen calendar or meaningless stock charts.

## RESPONSIVE LAYOUT SPECS — BUILD BOTH, NOT DESKTOP SHRUNK DOWN

Breakpoints (CSS, mobile first): **360 / 390 / 768 / 1024 / 1440 / 1920px**. All layouts must also work at 320px without horizontal overflow. Use fluid spacing and `clamp()` for appropriate type/containers; no fixed widths that clip text.

**Desktop ≥1024px**: persistent left sidebar **248–264px**; optional collapsible icon rail **68–76px**; app content max-width **1,240–1,320px** within its available region. Main dashboard 12-column CSS grid: **primary work 7 columns / supporting context 5 columns** (7:5), 24px gutter. On very wide screens use surrounding breathing room rather than stretching cards. Roadmap overview can use 8:4 for diagram vs details. Lesson reader max comfortable text measure **66–74ch**, with right metadata rail ~280px if space permits. Use sticky header **64–72px**, but avoid double-sticky collisions.

**Tablet 768–1023px**: narrow icon rail or collapsible nav drawer; two-column dashboard **6:6** where enough room; most forms/tasks single column; 20px gutters.

**Phone 320–767px**: full-width single-column experience, **16px horizontal gutters**, compact 56–64px top bar, sticky bottom navigation (Today / Roadmap / Review / Career / You) with readable icon + text labels; bottom safe-area padding via `env(safe-area-inset-bottom)`. Content must clear the tab bar. A dominant **Continue Day** action appears early, with a sensible sticky action only on lesson pages when it does not obscure content. Roadmap nodes become stacked phase accordions, not an unreadable zoomed-out graph. Application table becomes cards. Edit forms use bottom sheets or full-page flows. No fake phone frame around the UI.

**Specific proportions:** dashboard top focus area 7:5; intro strip maximum 180px tall desktop and content-sized mobile; metric row max 3 meaningful statistics (not 8 vanity cards); 2-up cards on tablet and 1-up on phone; phase cards roughly 3:2 *when appropriate*, but never fix height when text needs more lines; resource thumbnail optional at natural ratio (do not invent imagery); progress rail ~4–6px tall; empty state centered within a max 360px width area.

Design and implement page-specific layouts, do not reuse exactly the same card template for all screens. The mobile UX deserves its own information hierarchy.

## CORE SCREEN SPECIFICATIONS

**Today / daily cockpit**: top label `Your workspace` with `Phase 0 · Day 01` and a concise, supportive subhead. Hero = title of current study session, estimated effort and the single dominant action `Continue Day 01`; also `Light day` toggle. Show **three compact truthful indicators** (study days completed, current phase modules passed, queued reviews) only when applicable. Below: (A) today's task list grouped Learn / Practice / Apply, real checkboxes and estimated minutes; (B) review queue with due concept, confidence; (C) one next milestone and small project/internship readiness glance. Exclude distracting fake charts.

**Roadmap**: two complementary views. `Journey` shows P0–P8 as vertical track, dependencies and states `Locked`, `Available`, `In progress`, `Gate pending`, `Passed`; `All topics` is searchable subject/module list. Every phase has specific outcomes, estimated **active study days/hours** (clearly approximate), resources, tasks, prerequisites and exit test. On desktop, selecting a phase opens persistent detail panel. On mobile, tap expands detail or navigates to a screen. No horizontal spaghetti-node canvas.

**Learning Day page**: left/main progress header (`Phase 0 / Day 01`, title, skill tags, 95-minute estimate, optional pause), exactly specified tasks and notes. Resource card must say `Study: LearnCpp lessons 0.2–0.7`, not just `Go learn C++`; show why this resource, sections, what to ignore, verified source URL and estimated time. Problem/exercise cards include instructions, constraints and expected result. Add `Open resource` with `target=_blank`, `rel=noopener noreferrer`. Task checkboxes save immediately; evidence may be GitHub URL or short text. A timed focus timer is **optional, local-only**, and must not inflate logged work automatically.

**Review queue**: no calendar; show `Ready to review`, `Review later`, `Stable concepts`, grouped by difficulty and learning-day interval. Flashcard-style recall prompt first, hidden answer/reasoning afterward; store recall self-rating and mistake category. Encourage retries without shame.

**Projects**: canonical progression: C++ CLI mini-project; reliable FastAPI/PostgreSQL task/issue API; CourseCairn-style production backend; optional AI Codebase Intelligence Assistant. Match phase eligibility and prerequisites. Each project has goal, architecture questions, sequential feature checklist, testing/security/deployment requirements, notes and evidence links. Do not auto-grade linked GitHub code without actually fetching or verifying it; otherwise label it self-reported.

**Career center**: internship/placement readiness checklist (`resume`, `DSA gate`, `project explanation`, `core CS`, `mock OA`, `eligibility checked`), academic semester selector, official company career portals, and **user-entered** applications. Stage model: `Saved → Applied → Assessment → Interview → Offer / Rejected / Withdrawn`; support status changes, company/role/location/source URL, eligibility notes, reflections and optional follow-up notes. Since dates are excluded from the study plan, show applications in status order / recently changed order rather than calendar deadlines. Never invent live openings, CGPA thresholds, salaries, interview counts or employer endorsements. Explain that CGPA policy depends on the exact listing; target 8.0+/8.5+ can be a **planning preference**, not employer requirement.

**Insights**: real derived analytics only: completed active study days by phase, task completion by subject, review confidence, time logged explicitly by user, areas needing work, gates passed, number of applications in each stage. No fake streak rewards and no implication that page views = mastery. Show an `Evidence level` distinction (`self-reported`, `gate-verified`, `externally verified` only when supported).

**Settings + onboarding**: short skippable onboarding: learning starting level (Beginner / Some experience / Diagnostic), academic semester, target role, C++ baseline, backend interest, study time budget, maintenance mode, theme; optional CGPA stored privately with opt-in. Don't request sensitive information unnecessary for the service. Preview the curriculum publicly; users sign in to save progress. Auth supports secure email/password or magic link; OAuth optional if appropriately configured. Provide export JSON/CSV and account-data deletion with confirmation.

## CONTENT ENGINE AND REALISTIC DAY PLANNING

**Do not inject the original Markdown as one massive article**. Convert it into editable, versioned, structured content: `Track > Phase > Module > Learning Day > Day Task > Assigned Resource/Section > Checkpoint`. Preserve references to the original source section, stable IDs and official/plan/emerging/prediction confidence markers. Explain any reordering in `docs/CONTENT_MAPPING.md`. Maintain the nine phases `P0`–`P8` and original dependencies; optionally label P7 as an **advanced parallel elective** once prerequisites are satisfied rather than a forced blocker for placement readiness.

Seed **complete usable learning-day content**, not placeholders for the later phases. Original phases have effort targets in hours; derive a **plausible range** of active study days from each phase's hours and normal daily budget. Never advertise exact placement timelines. No need to hand-write hundreds of identical tasks: implement a reusable, content-versioned day plan generator/seed pipeline that deterministically breaks each verified module into taught lessons, practice, recall and assessments. **However, generated content must not be generic**: every day needs specific subjects, useful exercise specifications, accurate resource-section links and proof criteria. Hand-author and QA at least the **first 30 consecutive learning days** in detail, covering P0 essentials at beginner speed. Seed substantial task sequences/checkpoint coverage across all remaining modules, and provide validation reports flagging missing resources, empty days, repeated filler and implausible duration totals. Only declare a later phase fully populated if it actually is; otherwise visibly mark content as planned and ship a properly populated vertical slice rather than fake completeness.

Example of **real Day 01** in P0 (adapt to source):
- Goal: explain what a program is, what the compiler does, and run a minimal C++ file.
- Learn (25 min): CS50 Week 0 computer representation/binary overview; LearnCpp 0.2–0.7 setup and compiler concepts. Short guided skim allowed to fit budget.
- Practice (35 min): compile and run `hello.cpp`; change the displayed text; intentionally introduce a syntax error; fix it using compiler feedback.
- Apply (20 min): write 4 sentences: source code → compiler → executable → output; save first GitHub/local note only if version control already installed.
- Review (10 min): retrieve new vocabulary without notes and self-rate confidence.
- Finish: three required outcomes with checkbox evidence. Total ~90 min.

Example Day 02: basic C++ statements, first variables/input/output with LearnCpp's relevant Chapter 1 lessons, simple name/age program, one debugging exercise, 10-min recall of Day 01. Do not jump to arrays/linked lists instantly. Progression must stay dependency-aware.

**Support pacing:** `quick`, `standard`, `deep` controls how much *optional* work appears or splits large sessions; it must never hide fundamental required concepts to give illusion of faster progress. `catch-up` does not increase workload after a break. Learned modules must remain searchable/revisitable. A user may adjust difficulty with diagnostic confirmation, not with arbitrary automatic acceleration based on checkmarks.

**Resource directory:** Import the master source's `R01`–`R41` entries, each with `title`, `url`, `provider`, `resource_type`, `free/paid/unknown`, `assigned_sections`, `phase/module`, `why`, `avoid`, `link_verification_status`, `last_checked_at` (internal only), `source_confidence`. Never invent video timestamps, paywall claims or section links; if the canonical link points to a course homepage only, label that accurately. Preserve the original notes on what to study and skip. Provide a `Report broken link` feature storing a review request; actual checking can be done with a one-shot validation script, not magical live verification.

## TECHNICAL STACK AND ENGINEERING CHOICES

Use current stable compatible versions, pin them in a lockfile, and verify official documentation. Suggested stack:
- **Next.js App Router + React + TypeScript strict**, route groups, Server Components by default, client boundaries only for interactive controls.
- **Sass/SCSS Modules** (`*.module.scss`) for component styles, `styles/_tokens.scss`, `_mixins.scss`, `globals.scss` and CSS custom properties for live theme switching. Use Sass's `@use`/`@forward`, **not** deprecated global imports. Avoid mixing Tailwind and Sass design systems; implement original styling in SCSS. Next.js Sass guide: https://nextjs.org/docs/app/guides/sass
- **Radix UI primitives** for accessible dialogs, popovers, select, checkbox, sheet-equivalent patterns; use shadcn examples selectively as learning references, but ensure the visual system is custom and consistent. **Lucide React** icons. **Motion for React** only where transitions materially help, with reduced-motion support.
- **Supabase Postgres + Supabase Auth + RLS** as database/auth backbone, via `@supabase/supabase-js` and `@supabase/ssr` following current docs. Do not add a redundant standalone FastAPI backend; this website and user's **learning projects** are separate concerns. Use server-only typed data-access helpers, Zod validation, and appropriate Next.js server actions/route handlers. Prefer straightforward SQL migrations over excessive layers and dependencies.
- **Vitest** for pure progress/learning-day engine and validation; **React Testing Library** for components; **Playwright** for E2E mobile/desktop. Optional basic charts: Recharts only where data exists and story is meaningful. ESLint, formatting, typecheck, CI script.
- Deployability: Vercel + Supabase (free allowances are conditional; no promise of unlimited free usage). Include `.env.example`, migration instructions, seed command, local-development README and safe production configuration. No hardcoded secrets, and no pretend connected database.

Official docs: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs ; https://supabase.com/docs/guides/database/postgres/row-level-security ; https://nextjs.org/docs/app/guides/data-security ; https://nextjs.org/docs/app/guides/sass .

## POSTGRES DATA MODEL — CREATE MIGRATIONS + RLS POLICIES

Normalize a **read-only shared curriculum** separately from **private per-user progress**.

Shared tables (owned by service/admin migration role; public read if intentionally granted):
`curriculum_versions(id, source_sha256, status)`;
`tracks(id, slug, title)`;
`phases(id, track_id, phase_code, order_index, title, description, gate_definition, optional_parallel)`;
`subjects(id, slug, title)`;
`modules(id, phase_id, subject_id, stable_code, order_index, title, expected_minutes, learning_outcomes, prereq_codes[])`;
`learning_days(id, phase_id, sequence_index, stable_code, title, goal, estimated_minutes, curriculum_version_id)`;
`day_tasks(id, learning_day_id, module_id, task_order, kind, required, title, instructions, estimate_minutes, validation_criteria)`;
`resources(id, stable_code, title, url, provider, access_level, verification_status, source_notes)`;
`task_resources(task_id, resource_id, exact_assigned_sections, purpose, note_what_to_skip)`;
`phase_gates(id, phase_id, gate_type, rubric_json)`;
`project_templates(id, phase_id, name, description, milestones_json)`.

Private user tables (all contain `user_id UUID NOT NULL` and strict ownership):
`profiles(user_id PK, alias, academic_semester, target_role, optional_cgpa, preferred_daily_minutes, preferred_mode, theme, onboarding_status)`;
`user_phase_progress(user_id, phase_id, state, gate_passed, active_day_index, PRIMARY KEY(user_id,phase_id))`;
`user_day_progress(user_id, learning_day_id, state, started_at, completed_at, notes, PRIMARY KEY(user_id,learning_day_id))`;
`user_task_progress(user_id, day_task_id, status, evidence_text, evidence_url, completed_at, PRIMARY KEY(user_id,day_task_id))`;
`study_sessions(id, user_id, learning_day_id, self_reported_minutes, reflection, created_at)`;
`concept_reviews(id, user_id, module_id, last_day_index, next_due_day_index, interval_step, latest_confidence, mistake_tag)`;
`review_attempts(id, user_id, module_id, learning_day_index, rating, notes, created_at)`;
`gate_attempts(id, user_id, phase_id, score_json, passed, evidence, created_at)`;
`user_project_milestones(user_id, project_template_id, milestone_code, status, evidence_url)`;
`applications(id, user_id, company, role, location, url, kind, status, eligibility_note, notes, updated_at)`;
`user_preferences(user_id PK, ... as needed)`;
`resource_feedback(id, user_id, resource_id, reason, state)`.

Adjust exact names as appropriate, but document every deviation and retain stable source codes. Foreign keys and unique constraints must ensure **no duplicate task completions**, no accidental cross-user overwrite, and stable curriculum upgrades. Define a clear curriculum-version migration rule: existing user progress maps by stable identifiers on a new seed; never silently erase progress during a content update. Index `user_id` and common composite filters. The server must compute the day/day task state from authoritative persisted data; never trust client-provided `user_id`.

**RLS SECURITY REQUIREMENTS:** Enable RLS for all exposed tables. For private tables: authenticated users can only `SELECT/INSERT/UPDATE/DELETE` their own rows; `WITH CHECK` on writes; protect `user_id` against reassignment; no anonymous reads. Shared curriculum is read-only from clients, written through trusted migrations; appropriately restrict grants, not just policies. Never expose a Supabase `service_role` secret in browser, public env vars or client actions. Test with two different users and verify no cross-account reads, writes or application tracking access. Derive auth identity on server and reauthorize every mutation. Use short, validated inputs and escape user-generated notes. If auth setup cannot be completed automatically, produce explicit configuration instructions; never fake a successful sync.

**Atomic workflow:** `finishLearningDay(userId, dayId)` must be server-authoritative and transactional: validate ownership, all required task completions, prerequisites and phase gate status, then update day progress, increment active sequence (only once), and enqueue spaced-review intervals without duplicate insertion. Make mutations idempotent under retries/double clicks. Consider a SQL/RPC function for atomic transitions with security-invoker/definer safeguards reviewed carefully. Keep review scheduling keyed to **completed learning-day sequence**, not elapsed timestamps.

## IMPLEMENTATION SEQUENCE — DELIVER WORKING VERTICAL SLICES

**Slice A — foundation:** source ingestion, curriculum schema and seed, auth, profile, theme tokens, responsive shell, real navigation and loading/empty/error states. The first 30 study days are real and browsable.

**Slice B — core learner loop (ship before decorative extras):** onboarding, Today, one complete learning-day page, individual persistent checkboxes, Finish Day transaction, Phase overview, phase gates, multi-device persistence, 45–120 minute pacing, review queue. This is the most important part of the entire product.

**Slice C — depth:** subject pages, annotated resource directory with assigned sections, projects and evidence, progress insights. Test progress math; completed optional tasks must not misrepresent mastery.

**Slice D — career:** internship/placement readiness, accurate eligibility guidance and manual application tracker with status transitions. Official employer links are **guides/portals**; do not create fictional opportunities.

**Slice E — polish:** command palette, keyboard shortcuts, beautiful empty states, light/dark themes, subtle motion, export/delete, small-screen edge cases, loading skeletons and solid error messages. Only then add optional enhancements such as local focus timer and visualizations.

Create clean components, e.g. `AppShell`, `SidebarNavigation`, `MobileTabBar`, `SectionHeading`, `LearningDayHero`, `TaskChecklist`, `TaskRow`, `ResourceAssignmentCard`, `PhaseRail`, `PhaseGatePanel`, `ReviewCard`, `ApplicationCard`, `ApplicationTable`, `CommandPalette`, `MetricStrip`, `EmptyState`, `ConfirmDialog`. All must support keyboard and screen reader access. Avoid building a general-purpose WYSIWYG editor or a highly complicated drag-and-drop canvas.

## QUALITY BAR / ACCEPTANCE TESTS (MUST PASS)

1. First visit shows beautiful, **real** desktop and mobile layouts and one meaningful public path into the curriculum.
2. User A signs up, chooses 90 minutes, sees `Phase 0 · Day 01`, and can read *specific* LearnCpp/CS50 sections and complete checklist tasks.
3. Refresh / browser restart / second device shows saved checkboxes. Clicking Finish Day with missing required tasks **does not advance**. Completing them **does advance exactly once**.
4. User B starts independently at Day 01 and can never read/modify A's progress, profile, CGPA, applications, notes or evidence. RLS tests prove this.
5. A user can resume after a break on the same day with no overdue guilt. No calendar dates or countdown language appear in learner-facing roadmap or career center. Any audit timestamps stay internal.
6. On completing a concept, review items become due after `+1/+3/+7/+21/+45` *active study days*, with historical attempts and bounded review workload.
7. A failed phase gate prevents automatic progression and suggests specific weak module revision; a passed gate unlocks the next phase once.
8. Phase/task counts, completion percentages and session minutes are real SQL-derived data; no mocked user stats ship into production.
9. Every resource links to the correct originating page with **specific assigned sections** where documented; run link validation and show “unverified” if not actually checked.
10. Applications can be created, edited, status-updated and deleted privately. Career readiness makes no guaranteed-outcome claims.
11. UI fits 320, 360, 390, 768, 1024, 1440 and 1920px; touch targets >=44px; no horizontal overflow; dialogs/menus work with keyboard and screen reader; text contrast passes WCAG 2.2 AA for applicable criteria.
12. Dark theme is intentionally designed, not inverted colors; **no blue or loud accent colors** leak from third-party components, browser default focus styles or charts.
13. At least unit tests for day progression, score calculation, required vs optional tasks, review scheduling, idempotency and gate behavior; Playwright E2E for signup/session (or authenticated test fixture), finish day, persistence, responsive nav and cross-user isolation. Run lint, typecheck, tests, production build, and document exactly which pass/fail.
14. All pages have purpose-built loading/empty/error states; keyboard command palette and navigation work; public pages don't expose private data.
15. `README.md` covers local setup, Supabase migrations/seed, environment configuration, deployment, import/update flow, tests and how to change design tokens. Do not claim “production ready” if external auth/database/E2E remain unverified.

**Definition of done:** a learner can sign in, follow a genuinely useful Day 01, return without losing progress, continue through real structured content, recall old topics, pass or retry gates, attach project evidence and track applications, all within a calm highly polished phone/desktop interface. This functionality is more important than animated landing-page flourishes.

## HOW TO REPORT IMPLEMENTATION

Before writing code, show a short plan and the source-content mapping findings. Then work through slices, commit logically if Git is available, use actual screenshots/browser inspection at mobile and desktop sizes, and identify incomplete areas openly. In your final report provide: (1) what was built, (2) exact routes and files, (3) setup/run commands, (4) migrations and seed status, (5) tests executed and results, (6) UI responsiveness observations, (7) external configuration still needed, (8) known limitations. **No dummy buttons, no invented backend success, no temporary sample metrics passed off as a real account, and no early stopping after a “design preview.”**

Now begin by inspecting the attached Markdown roadmap, extracting its structure and resource directory, and implementing Slice A and Slice B completely before advancing to later slices.
