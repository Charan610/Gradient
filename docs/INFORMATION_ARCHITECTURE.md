# Information Architecture Specification
**System Name:** FOUNDATION — Day-Based Career Preparation Operating System  
**Version:** 1.0.0

---

## 1. Route Map & Navigation Structure

```
/ (Public Landing & Value Proposition)
├── /explore (Read-Only Interactive Curriculum Explorer)
├── /sign-in (Authentication)
├── /sign-up (Registration & Onboarding Entry)
├── /privacy (Data Privacy & Zero Tracking Pledge)
│
└── /app (Protected Application Workspace)
    ├── /app/today (Daily Cockpit & Active Learning Session)
    ├── /app/roadmap (Curriculum Overview: Phases P0-P8, Milestones, Gates)
    │   └── /app/roadmap/[phaseId] (Phase Detail, Modules, Gate Status)
    ├── /app/learn/[phaseId]/[dayId] (Active Learning Day Workspace)
    ├── /app/subjects (All 6 Subject Tracks: C++, DSA, DBMS, CS, Backend, AI)
    │   └── /app/subjects/[subjectId] (Deep Subject Syllabus & Problem Index)
    ├── /app/resources (Annotated 41-Resource Directory & Section Guides)
    ├── /app/review (Spaced Repetition Recall Queue & Mistake Log)
    ├── /app/projects (Project Portfolio Overview: Projects A, B, C)
    │   └── /app/projects/[projectId] (Project Workspace, Architecture, Milestones)
    ├── /app/career
    │   ├── /app/career/internships (Readiness Checklist, Timing, Portal Links)
    │   ├── /app/career/placements (Placement Sprint Playbook & Criteria)
    │   └── /app/career/applications (Personal Application Pipeline & CRM)
    ├── /app/insights (Honest Analytics, Study Time, Gate Progress)
    └── /app/settings (Time Budget, Semester, Maintenance Mode, Data Export/Delete)
```

---

## 2. Page Hierarchy & Content Responsibilities

### 2.1 `/app/today` (The Daily Cockpit)
- **Top Bar:** Current Phase & Day indicator (e.g. `Phase 0 · Day 01`), session subtitle, effort indicator.
- **Hero Card:** Current learning day title, one-sentence capability goal, primary CTA button (`Continue Day 01 ↗`), session mode switch (`Light Day (45m)` / `Normal (90m)` / `Deep (120m)`).
- **Core Indicators (Max 3):**
  1. Study days completed (integer sequence)
  2. Current phase modules verified
  3. Queued spaced-repetition reviews
- **Today's Working Checklist:**
  - Learn Task (Resource card with exact sections)
  - Practice Task (Concrete exercises)
  - Apply / Explain Task (Artifact / code commit)
- **Due Reviews Strip:** Spaced repetition flashcards due for this active day.
- **Next Milestone Glance:** Current phase readiness gate criteria and progress.

### 2.2 `/app/learn/[phaseId]/[dayId]` (The Study Session Workspace)
- **Header:** Phase Code, Day Sequence Number, Estimated Duration, Pacing Tag, Pause/Resume toggle.
- **Goal Banner:** One-sentence capability objective.
- **Resource Drawer / Cards:**
  - Resource Title, Verified Direct Link (`target="_blank"`), Assigned Sections, What to Skip, Study Instructions.
- **Task Execution Flow:**
  - Checkbox per task with instantaneous optimistic persistence.
  - Required vs Optional visual indicator.
  - Evidence input (Text reflection or GitHub URL).
- **Review Question:** Embedded recall retrieval card.
- **Session Footer:**
  - Self-rating (Confident / Needs Review), minutes logged, Finish Day action with blocking validation for incomplete required tasks.

### 2.3 `/app/roadmap` and `/app/roadmap/[phaseId]` (Sequence Journey)
- **Journey View:** Vertical architectural rail showing phases P0 through P8 with status badges (`Locked`, `Available`, `In Progress`, `Gate Pending`, `Passed`).
- **All Topics View:** Searchable filterable module grid with subject tags.
- **Phase Detail Panel:**
  - Learning Outcomes
  - Estimated study hours & approximate days
  - Module sequence list
  - Phase Exit Gate rubric, test instructions, and pass submission interface.

### 2.4 `/app/review` (Spaced Repetition System)
- **Recall Queue:** Due reviews scheduled on learning-day sequence offsets (`+1, +3, +7, +21, +45`).
- **Review Card:**
  - Front: Concept prompt / code snippet / scenario.
  - Flip: Authoritative explanation, memory hook, reference link.
  - Outcome Buttons: `Needs Work` (shortens interval), `Stable` (advances interval).
  - Mistake Tagging: Syntax, Invariant/Boundary, Memory/Pointer, Algorithmic, System.

### 2.5 `/app/projects` & `[projectId]` (Portfolio Studio)
- **Canonical Projects:**
  - Project A: Reliable Task/Issue Management API (`FastAPI`, `PostgreSQL`, `SQLAlchemy`, `pytest`)
  - Project B: CourseCairn Production Learning Platform Backend
  - Project C: AI Codebase Intelligence Assistant (RAG / Lexical Search)
- **Project Detail:**
  - System architecture diagram
  - Sequential milestone checklist (A0 through A4)
  - Test suite coverage requirements
  - Evidence artifact links (GitHub repository, deployed demo, demo video)

### 2.6 `/app/career/applications` (Application Tracker)
- **Kanban / Pipeline Board & Data Table:**
  - Stages: `Saved` → `Applied` → `Assessment` → `Interview` → `Offer` / `Rejected` / `Withdrawn`
  - Record metadata: Company, Role, Location, Graduation Batch Eligibility, Official Portal URL, Notes, Status History.
  - Zero false job postings: Strictly user-entered personal pipeline.

---

## 3. Global Interaction Modals & Triggers
- **Command Palette (`⌘K` / `Ctrl+K`):** Global fuzzy search across all phases, modules, resources, projects, and direct actions (`Jump to Today`, `Open Review Queue`, `Add Application`).
- **Phase Gate Modal:** Verification rubric with code submission / reflection checklist.
- **Settings Sheet:** Dynamic budget re-allocation, Maintenance Mode toggle, JSON data export, and full account erasure.
