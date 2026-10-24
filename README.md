# FOUNDATION — Day-Based Career Preparation Operating System

> **A personal study operating system for ambitious undergraduate software engineers.**  
> Target: Top product companies (Google, Microsoft, Amazon, Meta, Atlassian, Uber, etc.).  
> Core Philosophy: **Zero arbitrary calendar deadlines. Zero guilt from college exam breaks.** Progress is governed by `Phase → Learning Day 01, 02... → Concrete Tasks → Spaced Review → Readiness Gate`.

---

## 1. Key Architectural Decisions

1. **Sequential vs Temporal Progression:**
   - The learner sequence `learning_day_index` is a pure integer counter. It advances **only** when mandatory daily tasks are marked completed and verified.
   - Taking a break for college exams or illness creates zero overdue notifications or task debt.
2. **Minimalist Editorial Productivity Design:**
   - Absolutely **no blue or saturated rainbow hues**. Designed with quiet luxury tones: Warm stone canvas (`#F7F7F3`), crisp surface white (`#FFFFFF`), charcoal reading ink (`#21231F`), and deep muted sage green (`#485B49`).
   - Clean custom SCSS modules (`styles/_tokens.scss`, `_mixins.scss`, `globals.scss`) utilizing Sass `@use` architecture.
   - Signature button language with an unusual inset trailing icon capsule (`Continue learning ↗`).
3. **Dual Persistence Architecture:**
   - **Local Storage Provider:** Out of the box, all progress, task completions, spaced reviews, and job applications save instantly to browser storage. Works without external database friction.
   - **Supabase PostgreSQL + RLS:** When `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are provided in `.env.local`, the platform automatically syncs with Supabase Auth, PostgreSQL tables, Row Level Security policies, and atomic RPC functions (`finish_learning_day`).

---

## 2. Complete Application Routes

| Route | Purpose & Responsibilities |
|---|---|
| `/` | Public product introduction, value proposition, zero-guilt philosophy. |
| `/explore` | Public, read-only 9-phase roadmap and 41-resource curriculum index. |
| `/privacy` | Privacy pledge: Zero ad tracking, multi-tenant RLS isolation, data export/delete. |
| `/sign-in` | Supabase Auth sign-in with local storage fallback option. |
| `/sign-up` | Onboarding setup: semester, daily budget (45–150m), starting level. |
| `/app/today` | **Daily Cockpit:** Active learning day, focus tasks checklist, blocking finish validation, due spaced reviews, milestone glance. |
| `/app/learn/[phaseId]/[dayId]` | **Study Session Workspace:** Assigned resource cards with exact sections and what to skip, concrete coding drills, proof criteria, task completion. |
| `/app/roadmap` | **Sequence Roadmap:** Vertical architectural rail of all 9 phases (`P0` to `P8`), dependencies, hours, study days. |
| `/app/roadmap/[phaseId]` | **Phase Detail & Readiness Gate:** All phase modules, learning outcomes, exit gate rubric, and defense submission interface. |
| `/app/subjects` | **Core CS Syllabi:** C++, DSA, DBMS, CS Fundamentals, Backend, Applied AI. |
| `/app/subjects/[subjectId]` | **Subject Deep Dive:** Individual module outcomes, what to study, what to defer. |
| `/app/resources` | **Annotated Resource Catalog:** Complete 41 verified resources (`R01` to `R41`) with direct URLs, section assignments, and broken link reporter. |
| `/app/review` | **Spaced Repetition Queue:** Concept flashcards scheduled on `+1, +3, +7, +21, +45` completed learning-day sequence offsets. |
| `/app/projects` | **Project Portfolio Studio:** Three canonical builds (Task API, CourseCairn Backend, AI Codebase Search). |
| `/app/projects/[projectId]` | **Project Workspace:** Architecture questions, milestone checklists (A0-A4), deliverables, interview defense questions. |
| `/app/career/internships` | **Internship Preparation:** Readiness checklist, Sunday sweep playbook, 12 official company portals. |
| `/app/career/placements` | **Placement Sprint:** 45-minute coding mock playbook, OA algorithm, 6 STAR behavioral stories. |
| `/app/career/applications` | **Personal CRM Pipeline:** Manage applications (`Saved → Applied → OA → Interview → Offer`), notes, and eligibility. |
| `/app/insights` | **Honest Analytics:** State-derived progress metrics, phase distribution, review mastery, zero fake streaks. |
| `/app/settings` | **Preferences & Governance:** Daily time budget (45/60/90/120/150m), exam maintenance mode, theme toggle, JSON data export, account reset. |

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18+ (tested on Node v26)
- npm 9+

### Installation & Execution
```bash
# 1. Install dependencies
npm install

# 2. Run automated test suite (Vitest)
npm test

# 3. Build for production (Next.js 15)
npm run build

# 4. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Supabase Database Configuration & Migrations

To connect your own cloud Supabase instance:

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Fill in your project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
4. Run the SQL migration scripts in order in the Supabase SQL Editor:
   - `supabase/migrations/20261024000000_init_schema.sql` (Creates all shared curriculum tables, private user progress tables, RLS policies, and the atomic `finish_learning_day` stored procedure).
   - `supabase/migrations/20261024000001_seed_curriculum.sql` (Optional bulk seed if migrating shared curriculum to cloud).

---

## 5. Testing & Verification Status

- **Unit Tests:** `npm test` runs 10 exhaustive unit tests covering:
  - 41 resources checked and verified
  - 30 consecutive hand-authored learning days for Phase 0
  - Zero calendar dates constraint in curriculum
  - Blocking validation when attempting to finish a day with incomplete required tasks
  - Atomic advancement upon completing mandatory tasks
  - Optional tasks non-blocking verification
  - Transactional idempotency (multiple clicks do not advance sequence multiple times)
  - Spaced review scheduling on integer learning-day sequence offsets (+1, +3, +7, +21, +45)
  - Review confidence intervals (needs work vs stable)
  - Phase gate attempt and rubric verification
- **Production Compilation:** `npm run build` compiled 100% cleanly across all 20 static and dynamic routes.
- **Route Health Check:** Verified 20/20 HTTP 200 OK responses on the active development server.
