# Implementation Plan & Execution Roadmap
**System Name:** FOUNDATION — Day-Based Career Preparation Operating System  
**Version:** 1.0.0

---

## 1. High-Level Delivery Strategy

In strict adherence to `docs/BUILD_PROMPT.md`, the platform is implemented through **vertical slices** ensuring that the Day 01 learning loop, real progress tracking, and database persistence are fully functional before proceeding to decorative elements.

```
Slice A: Foundation & Shared Curriculum Ingestion
    ├── Project initialization (Next.js 15, React 19, TypeScript strict, SCSS Modules)
    ├── Sass Design Tokens & Custom CSS Properties (Light/Dark themes, No Blue)
    ├── Database Migrations (Postgres, RLS policies, Atomic RPC functions)
    ├── Seed Pipeline (P0-P8 phases, 41 resources, first 30 hand-authored learning days)
    └── App Shell (Responsive Navigation, Sidebar, Mobile Bottom Bar)

Slice B: Core Learner Loop (Mission-Critical Priority)
    ├── Auth provider (Supabase Auth + Local Dev Fallback Provider for instant testing)
    ├── Daily Cockpit (`/app/today`) with sequence-based active day resolution
    ├── Study Session (`/app/learn/[phaseId]/[dayId]`) with real task checklists
    ├── Instantaneous Task Persistence with optimistic updates & rollback
    ├── Atomic `finishLearningDay` validation (Blocking incomplete required tasks)
    ├── Spaced Repetition Queue (`/app/review`) on active day offsets (+1, +3, +7, +21, +45)
    └── Phase Gates (`/app/roadmap/[phaseId]`) with rubric evaluation & retry pathways

Slice C: Depth & Knowledge Repository
    ├── Subject Syllabi (`/app/subjects/[subjectId]`) for C++, DSA, DBMS, CS, Backend, AI
    ├── Annotated Resource Catalog (`/app/resources`) with search, filter, and section guides
    ├── Portfolio Studio (`/app/projects` & `/app/projects/[projectId]`) with milestone tracking
    └── Insights Dashboard (`/app/insights`) with honest SQL-derived metrics

Slice D: Career Readiness & Pipeline CRM
    ├── Internship Guidance & Official Portals (`/app/career/internships`)
    ├── Placement Sprint Strategy (`/app/career/placements`)
    └── Personal Application Tracker (`/app/career/applications`) with status progression

Slice E: Polish, Command Architecture & Rigorous QA
    ├── Global Command Palette (`⌘K` / `Ctrl+K`)
    ├── WCAG 2.2 AA Contrast & Keyboard Navigation verification
    ├── Vitest test suite for progression logic, review math, and gate security
    ├── Playwright E2E tests for mobile/desktop user journeys
    └── Production build verification & documentation
```

---

## 2. Technical Dependencies & Configurations

- **Framework:** Next.js (App Router, Server Components by default)
- **Styling:** Sass (`sass`), SCSS Modules (`*.module.scss`), `@use` architecture, zero Tailwind
- **Primitives:** Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-checkbox`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`)
- **Icons:** `lucide-react`
- **Data Access:** `@supabase/supabase-js`, `@supabase/ssr` with robust server-side data layer
- **Testing:** Vitest, Testing Library, Playwright
