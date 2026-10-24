---
title: "From Second Year to Top Product-Company Software Engineer"
subtitle: "India-focused, fundamentals-first internship + placement master roadmap"
version: "1.0"
last_researched: "2026-10-24"
plan_start: "2026-12-16"
academic_status: "Second-year first semester (2-1) finishing by 2026-12-15"
assumed_graduation: "2029 (verify with college)"
primary_role: "Software Development Engineer / Backend Software Engineer"
primary_dsa_language: "C++"
backend_stack: "Python, FastAPI, PostgreSQL"
normal_weekly_hours: "12–15 hours"
exam_weekly_hours: "5–7 hours"
holiday_weekly_hours: "15–18 hours, optional"
internship_target: "Begin applying in 3-1; compete for summer 2028 and other eligible 3-2 opportunities"
job_target: "2028–2029 campus and off-campus new-grad positions"
content_type: "Canonical Markdown source: suitable for reading and later converting into a website"
confidence_note: "Planning targets are not admissions or employment guarantees. Recheck job-specific eligibility."
---

# FROM SECOND YEAR TO A TOP PRODUCT-COMPANY SDE

> **The master source document — version 1.0, researched October 24, 2026**  
> **Start date:** December 16, 2026 | **Country:** India | **Default learning time:** 12–15 hours/week | **Target:** strong internships in third year, strong new-grad placements in fourth year.  
> **Target companies:** Google, Microsoft, Amazon, Meta, Apple, Atlassian, Adobe, Uber, NVIDIA, Salesforce, Intuit, LinkedIn, and comparable product-led employers. **These are aspiration targets, not guaranteed hiring opportunities in your location/year.**

## 0. The roadmap — your first-page overview

| Stage | Calendar estimate | Primary focus | Evidence you should have |
|---|---|---|---|
| **Foundation** | Dec 2026 – Mar 2027 | C++ and programming logic, debugging, Git, very basic DSA | Working C++ practice repo and CLI mini-project |
| **First developer skills** | Apr – Jun 2027 | Arrays-to-recursion DSA, SQL, Python, HTTP, first API | Can independently solve beginner problems and demonstrate an API |
| **Internship application sprint** | **Jul – Dec 2027 (3-1)** | Trees/greedy, FastAPI/Postgres, OS basics, tests, resume and eligible applications | One substantial test-backed project; real applications under way |
| **Internship interview target** | **Jan – Jun 2028 (3-2)** | Graphs/DP, DBMS/OS/networks, mocks, projects and recruitment | Solid interview readiness; internship if an offer is earned |
| **New-grad placement sprint** | **Jul – Dec 2028 (4-1)** | Mixed DSA, practical engineering, core CS, interviews and tailored applications | Ready for eligible 2029-batch SDE processes |
| **Conversion and graduation** | Jan – mid 2029 (4-2) | Continue applications, interviews, academic completion and job readiness | Degree completed and strongest achievable offer pipeline |

**Every week, throughout:** protect academics/CGPA, study ~12–15 hours rather than 5–6 hours per day, revisit older DSA, and improve real software. **This is an estimate, not a promise of an internship or placement.**

## 0.1 How to use this file (read this first)

This is a **source document, not a deployed website**. It has reusable headings, stable topic identifiers, checklists, a resource directory, time estimates, readiness tests, and application workflows. You can later split it into website pages and add a database without rewriting the academic content.

**Your context and assumptions**
- You finish B.Tech **2-1 around 15 December 2026** and start organized preparation **16 December 2026**.
- Assuming a conventional four-year 2025–2029 B.Tech, third year is approximately mid-2027 to mid-2028, fourth year approximately mid-2028 to mid-2029. **College calendars vary: update these dates to your actual semester schedule.**
- Assume **beginner-to-intermediate exposure, but restart fundamentals properly** instead of assuming older work counts as mastery.
- Your main target is **general software development engineering**, with a **backend-specialization advantage**, *not* an AI researcher-only or competitive-programmer-only profile.
- Learn **C++ deeply for DSA** and **Python + FastAPI + PostgreSQL for backend projects**. You can use other languages when a particular job demands them, but do not fragment attention now.
- **12–15 hours/week** is the long-run sustainable baseline, generally around **1–2 hours on most college days plus a longer weekend block**. Neither 5–6 daily hours nor a perfect streak is assumed.
- Academic performance and sleep come first near exams; missing one week does **not** mean restarting a phase.

**Evidence labels:** **[OFFICIAL]** = employer, course, or vendor publication checked on the research date. **[PLAN]** = an advised preparation target, not a company promise. **[EMERGING]** = a real practice at some companies but not industry-wide. **[PREDICTION]** = possible future emphasis; verify again before actual interviews.

**Rule:** *Move forward when the readiness gate is passed, not merely when its target date arrives.* The calendar is a planning tool. The gates are the curriculum.

---

# PART I — STRATEGY AND EMPLOYER REALITY

## 1. North-star goals and honest milestone dates [PLAN]

| When | Milestone | What a realistic success looks like |
|---|---|---|
| Dec 2026 – Feb 2027 | Programming foundation | Confident C++ basics, debugging, small programs, GitHub habits |
| Mar – Jun 2027 | First internship-capable skills | Core DSA patterns + SQL + first API + functioning resume draft |
| Jul – Dec 2027 (likely 3-1) | **Active internship applications** | One credible project, interview fundamentals, timed coding practice, apply continuously when eligible |
| Jan – Jun 2028 (likely 3-2) | **Strong internship target window** | Better DSA, tested backend project, core CS, projects explained clearly; interviews/possible summer internship |
| Jul – Dec 2028 (likely 4-1) | **Primary placement season** | Full revision, applications for 2029 graduates, coding interviews, CS and project interviews |
| Jan – graduation 2029 | Continue placement + off-campus | Apply, improve weaknesses, complete a capstone, prepare for job transition |

**Do not confuse these concepts:** *internship-ready* means you can apply competitively; *interview-ready* means you are prepared for several likely assessment types; *receiving an offer* depends on openings, eligibility, resume screening, tests, interviews, and luck. No ethical roadmap can promise an offer by 3-1 or 3-2.

**Practical truth about third year:** Getting a major-company internship by the **start** of 3-1 from a beginner start in Dec 2026 is **ambitious**. You can be ready to **start applying** during 3-1 and target roles taking place in 3-2 or summer 2028. Student recruitment often opens months before the internship: don't wait until the course is finished.

## 2. Why this path, not five disconnected courses?

You need **four always-on tracks** introduced gradually:

1. **Algorithms and independent problem-solving:** starts gently in Phase 0, remains active until graduation.
2. **Building software:** tools → SQL → API → tested backend → deployed project → larger engineering.
3. **Core CS foundations:** programming/memory → OOP → DBMS → OS → networks → system-design basics.
4. **Career preparation:** CGPA → public evidence of work → resume → applications → assessments and mock interviews.

AI-assisted coding becomes a **fifth, lighter track** only after you can understand and debug a program yourself. It is a *skill multiplier*, not a replacement for foundations.

## 3. What top product companies actually request [OFFICIAL]

**Don't invent a single "FAANG requirement".** Requirements vary by role, region, level, and hiring season. These are *examples of published employer evidence*, followed by how this roadmap responds.

| Evidence from employer | What it actually tells you | Your response |
|---|---|---|
| [Amazon India 2027 SDE Intern](https://www.amazon.jobs/en/jobs/10513277/software-development-engineer-intern-may-2027-2-month-amazon-university-talent-acquisition) | Basic qualifications mention a programming language, algorithms/data structures/OOP; preferences include practical projects, debugging, version control, databases, AI productivity tools, cloud | C++ DSA + one substantial API + Git/tests, then AI tooling |
| [Amazon India 2027 six-month intern](https://www.amazon.jobs/en/jobs/10541345/sde-i-intern-amazon-university-talent-acquisition) | CS fundamentals including OS, DSA and complexity; example is **specifically for 2027 graduates** | Learn these subjects; **do not apply to the example unless your batch is eligible** |
| [Microsoft technical interview guidance](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) | Explicitly evaluates problem-solving, real code, design, testing, algorithms, data structures; role-dependent networking/AI/design | Timed explanation + working code + tests + fundamentals |
| [Microsoft internship eligibility: India](https://careers.microsoft.com/v2/global/en/internship_eligibility) | India university interns generally must be in their **pre-final year** under its published policy; other constraints apply | Prepare during 2nd year, check in 3rd year; verify every listing |
| [Google 2027 SWE internship example (Singapore)](https://www.google.com/about/careers/applications/jobs/results/104489346874122950) | This **Singapore**, not India, listing asks for coding, Unix/Linux, algorithms/data structures, software design, English; illustrates common role competencies | Build strong language/DSA/Unix skills, but seek **India-specific** listings when applying |
| [Atlassian early careers](https://www.atlassian.com/company/careers/earlycareers) | Published **India recruiting period: July–December**; summer internship generally May–August, subject to change | Begin monitoring in **July 2027** for potentially eligible 2028 positions |
| [Canva engineering hiring](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/) | Canva has required/encouraged authorized AI-tool use in certain technical interviews; evaluates more realistic engineering work | Add AI-assisted code comprehension, debugging and testing |
| [Meta's AI interview pilot announcement](https://www.linkedin.com/posts/meta_metacareers-interviewing-softwareengineering-activity-7386046074240737280-wnwA) | Meta confirmed a pilot for selected candidates, **not a universal replacement for traditional DSA** | Be able to operate in both AI-allowed and AI-disallowed interviews |

**No official blanket cutoff was found for “all of Google, Amazon, Microsoft, Meta”**; don't trust viral claims such as “FAANG requires exactly 8.5 CGPA,” “DSA is dead,” or “you must know Kubernetes.”

### 3.1 Company target groups (for outreach, not promises)

| Tier in *your search*, not an official ranking | Companies to monitor | What to emphasize |
|---|---|---|
| Global large product/consumer/cloud | Google, Microsoft, Amazon, Meta, Apple | DSA + CS + coding quality + role-specific requirements |
| Strong product/platform/dev tools | Atlassian, Adobe, Salesforce, Intuit, LinkedIn | DSA + backend + SQL + practical product engineering |
| Infrastructure/mobility/hardware/software | Uber, NVIDIA, other relevant firms | DSA + systems + language/role specialization |
| Additional targets | Good funded product startups, SaaS firms, developer-tool companies, Indian product-led employers | Ship usable software, debug, communicate, adapt |

A **foreign-headquartered company with an India role** is usually a more direct early target than an overseas vacancy requiring work authorization or visa sponsorship. Don't rule overseas roles out, but always check location, degree year and sponsorship requirements.

## 4. CGPA, degree eligibility, backlogs, and academic priorities

**[OFFICIAL + PLAN]** CGPA is often a **screening variable**, especially in campus drives, but not universally the strongest technical-selection variable. Eligibility restrictions sometimes come from your college's placement cell, sometimes from an employer's particular drive. Published international job listings may not state any numeric CGPA cutoff at all.

**Your target (not an employer rule):** **8.0+**, preferably **8.5+ if sustainable**. Do not sacrifice DSA/development for a tiny CGPA improvement; also do not ignore academics and lose eligibility.

- **9.0+**: strong academic margin, still must clear interviews.
- **8.5–8.99**: useful personal target for options and confidence, not a guaranteed advantage.
- **8.0–8.49**: solid if you also build skills; check drive-by-drive cutoffs.
- **7.0–7.99**: eligible for many pathways but some drives may restrict you; expand off-campus efforts.
- **Below 7.0**: prioritize improving grades, finishing any backlogs, strong referrals/projects, and openings without hard academic filters.

**Before each application, record:** permitted graduating batch, minimum CGPA/% (if explicitly listed), history of backlogs, degree/branch restrictions, citizenship/work authorization, campus-only/off-campus, graduation status, transcript availability, and remote/on-site rules. **Never fabricate eligibility.**

**Academics workflow:** weekly lecture revision (30–45 min for a course that needs it), start exam-focused study 2–3 weeks ahead, retain 1–2 short DSA recall sessions during exams, return to your normal schedule afterward.

## 5. Interview formats: current, emerging, unknown

| Interview stage | Likely baseline | Your training |
|---|---|---|
| Resume/eligibility | Graduation year, relevant skills, project evidence, eligibility | Accurate one-page student resume + project demos |
| Online assessment | Timed programming/DSA, sometimes aptitude/CS MCQs depending on employer | Timed unseen questions; practice under constraints |
| Coding interviews | Explain approach, correctness, complexity, edge cases | Clarify → design → code → test → optimize |
| CS technical discussion | OOP, DBMS, OS, networking depending on role | Concept explanations and use-case examples |
| Project/development round | Architecture, debugging, SQL, testing, trade-offs | Live walkthrough and reproducible test runs |
| Design | Basic class/API/database design for interns; larger system design often at experienced levels | API & schema design; introductory scaling concepts |
| Behavioral | Collaboration, learning, conflict, ownership | STAR stories from real projects |
| **[EMERGING]** AI-allowed assessment | Understand code, iterate, verify, use tool responsibly | Alternate no-AI and authorized-AI mock sessions |

**[PREDICTION, not a company promise]** By placements in 2028–2029, employers *may* put more weight on code comprehension, practical repo work, correctness/testing, security, debugging, and AI-supervised engineering. **Do not stop DSA based on this prediction.** Recheck hiring guidance every 3–4 months.

---

# PART II — WORKLOAD, TIMELINE, AND MEMORY SYSTEM

## 6. Realistic student workload (no 5–6 hour days)

| Type of week | Study goal | Example distribution | When |
|---|---:|---|---|
| **Normal semester** | **12–15h** | Mon–Fri 1.5h/day (7.5h) + Sat 3h + Sun 2h = 12.5h | Default |
| **Busy college week** | **7–9h** | Four 1h sessions + one 3h block | Labs/assignments/events |
| **Exam week** | **5–7h max for roadmap** | Three 45min recalls + one 2–3h block; academics get first priority | Internal/external exams |
| **Holiday** | **15–18h optional** | Three 2h weekdays + two 3h blocks + revision | Only if sustainable |

**Never owe “missed hours.”** If last week was 3 hours, use the next week's normal plan, not 24 hours of compensatory work. Consistency beats intensity.

### 6.1 Changing the time allocation across phases

| Phase type | DSA | Programming/backend/projects | Core CS/tools | Review + career |
|---|---:|---:|---:|---:|
| Foundations (Dec–Feb) | 2h basic logic | 7h C++/small programs | 2h computer/tools | 1–2h |
| First build (Mar–Jun) | 5h | 4h SQL/Python/API | 1.5h | 2h |
| Internship push (Jul–Dec) | 5h | 4h substantial project | 2h DBMS/OS/networks | 2h applications/review |
| Interview push (2028+) | 5–6h | 3–4h projects/practical | 1.5–2h CS | 2–3h mocks/applications |

These allocations are templates; sum and adjust to fit the actual 12–15 hours you have.

### 6.2 Sample weekly timetable: a college week (12.5h)

| Day | Time | Task |
|---|---:|---|
| Monday | 1.5h | New topic and examples (C++/DSA) |
| Tuesday | 1.5h | Practice 1–2 problems or one applied exercise |
| Wednesday | 1.5h | Backend/SQL/CS block |
| Thursday | 1.5h | New DSA problem + analyze mistakes |
| Friday | 1.5h | Project implementation, tests, Git commit |
| Saturday | 3h | Deep project work + one difficult problem |
| Sunday | 2h | Review, spaced repetition, weekly audit, career tasks |

**Beginner exception:** Through February 2027, use the DSA-labelled blocks for **C++ learning and simple logic problems** until you meet the C++ readiness gate.

### 6.3 Revision architecture (non-negotiable)

Every concept is maintained in a lightweight **Review Queue**: **D0 → D1 → D3 → D7 → D21 → D45**, counted from first learning. Each revisit is 5–20 minutes; no need for a complete rewatch.

Use one row per concept:

| Field | Example |
|---|---|
| topic_id | `DSA-BS-01` |
| first_learned | `2027-03-14` |
| next_review | `2027-03-15` |
| last_result | `could explain, code had off-by-one error` |
| mistake_tag | `boundary / invariant` |
| retrieval_method | `write binary search from blank editor` |
| status | `needs work / stable` |

**The test of memory:** Can you implement/explain the idea **without looking** on D7? If not, treat it as not yet learned and reschedule.

**Weekly system:** 60% new material, 25% applied practice, 15% deliberate recall while learning; 1 older mixed problem each week from month 3 onward, 1 small timed session every 2 weeks from month 5 onward, 1 full cumulative mini-assessment each month.

**Solve-loop for DSA:** (1) Read/clarify, (2) make examples, (3) think 15–30 minutes depending on difficulty, (4) if stuck study a hint/concept, (5) solve independently from scratch, (6) time/space analysis, (7) test edge cases, (8) schedule revisit. Watching a solution is *not* a solved problem.

---

# PART III — THE NINE LEARNING PHASES

**Phase IDs are stable identifiers for a future website.** A phase includes dependencies, outcomes, must-build items, readiness gates, and the main resources. Dates are approximate to fit a college calendar.

## PHASE 0 — Orientation + absolute programming fundamentals (`P0`)

**Window:** Dec 16, 2026 – Jan 31, 2027 | **Effort:** ~70–90h at 12–15h/week | **Prerequisites:** none.

**Learn in this order:**
- `P0.01` What is a computer/program? CPU, RAM, storage, files, OS, input/output, binary, compiler vs interpreter, basic terminal.
- `P0.02` Install compiler/editor; compile, run, and debug a C++ `main()` program; warnings, syntax vs runtime vs logic errors.
- `P0.03` Types, variables, expressions, input/output; `if`, `else`, `switch`, loops.
- `P0.04` Functions, parameters, return values, scope, arrays and strings.
- `P0.05` Trace code by hand; basic integer/array/string exercises; explain solutions aloud.

**Exact resources and assigned usage:**
- [Harvard CS50x 2026 — Week 0](https://cs50.harvard.edu/x/weeks/0/): use the lecture sections on computing, binary, algorithms, pseudocode. **Do not try to finish the whole CS50 course as a separate obligation.**
- [LearnCpp — Chapter 0](https://www.learncpp.com/): lessons **0.2–0.7** on programs, compiler/linker, IDE and first program; **Chapter 1** (1.1–1.11) for statements, variables, I/O and expressions; then relevant lessons on conditionals, loops and functions.
- [LearnCpp — 1.1](https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/): read first as your initial C++ lesson.

**Must-do practice:** 20–30 tiny programs across max/min, prime check, digit sum, multiplication table, Fibonacci iterative, grade calculator, array sum, linear search, string reverse, vowel counts, frequency table. Write 1–2 simple mini-programs with functions and input validation.

**Deliverables:** `cpp-foundations` GitHub repo, 20+ working programs organized by topic, README containing build/run instructions, a 1-page error log.

**Gate P0:** From a blank editor, in 35 minutes write an array stats tool with functions, input handling, minimum/maximum/average and clear output; describe what happens between source code and execution. Do not use AI to write it.

## PHASE 1 — C++ depth + problem-solving + developer tools (`P1`)

**Window:** Feb – Mar 2027 | **Effort:** ~90–110h | **Prerequisite:** P0 gate.

**Order:**
- `P1.01` References, pointers, stack and heap intuition, const, passing by value/reference, vectors, basic STL (`vector`, `string`, `pair`, `map`, `unordered_map`, `set`, `sort`).
- `P1.02` Recursion basics and dry-running call stacks; simple pattern/array problems.
- `P1.03` Big-O time and memory; brute-force vs optimized; linear/binary search; basic sorting.
- `P1.04` OOP essentials: classes/objects, constructors, encapsulation, composition; deeper design later.
- `P1.05` Git (`init`, `status`, `add`, `commit`, `branch`, `merge`, `pull`), GitHub PR basics, terminal and editor debugging.

**Resources:**
- [LearnCpp — full chapter index](https://www.learncpp.com/): follow topics on references, pointers, `std::vector`, recursion, classes, algorithms, and containers, rather than studying every advanced language feature.
- [USACO Guide Bronze](https://usaco.guide/bronze): **Time Complexity**, **Introduction to Data Structures**, **Simulation**, **Introduction to Sorting**; use **C++** examples.
- [MIT Missing Semester 2026](https://missing.csail.mit.edu/2026/): specifically **Introduction to the Shell**, **Version Control and Git**, **Debugging and Profiling**; defer agentic coding until later.
- [GitHub Skills: Introduction to GitHub](https://github.com/skills/introduction-to-github): complete branch → commit → pull request → merge exercise.

**Build:** console CLI task tracker in C++ (add/list/complete/remove/search tasks, persistence to text file, error handling). This is a learning build; do not market it as your flagship internship project.

**Gate P1:** Explain binary search and complexity; use vector/map; independently implement one recursion problem; demonstrate branching, pull request and a merged change; explain pointer vs reference at beginner level.

## PHASE 2 — DSA foundation + SQL + Python entry (`P2`)

**Window:** Apr – Jun 2027 | **Effort:** ~140–180h | **Prerequisites:** P1 for DSA, C++ programming basics for Python.

**Order — rotate every week, not isolated three-month subjects:**
- `P2.01` Arrays and strings, frequency counting/hash maps, prefix sums.
- `P2.02` Sorting, two pointers, sliding window, binary search on data and answer.
- `P2.03` Linked lists, stacks, queues, basic recursion, elementary backtracking.
- `P2.04` Relational model, SQL SELECT/WHERE/ORDER BY, joins, aggregation, group by, keys, constraints, normalization basics.
- `P2.05` Python syntax, collections, functions, virtual environments, exceptions, imports.
- `P2.06` Internet/API basics: URLs, HTTP methods/status codes, JSON, client–server, request–response.

**Resources:**
- [Striver A2Z DSA Sheet](https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet) **FREE sheet**: first modules on basics, sorting, arrays, binary search, strings, linked lists, stack/queue. Optional paid tools are **not required**.
- [CSES Problem Set](https://cses.fi/problemset): start **Introductory Problems**, then accessible **Sorting and Searching**. Skip advanced graph/DP problems for now.
- [SQLBolt](https://sqlbolt.com/): complete interactive lessons covering SELECT, filtering, sorting, JOIN, aggregates, and schema operations.
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html): **Getting Started** → **The SQL Language** → **Foreign Keys** and **Transactions**; run queries locally.
- [Python official tutorial](https://docs.python.org/3/tutorial/): work through control flow, data structures, functions, modules, errors and classes. It assumes programming basics: that's why Python starts *now*, not before P0.
- [MDN: Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview): read overview, messages/methods/status concept; try requests with `curl` or an API client.

**Build:** a small **Task Manager REST API**. Version 1: in-memory CRUD endpoints; version 2: persistent PostgreSQL schema with users/tasks; document endpoints and sample requests. Project exists to teach SQL and APIs, not to accumulate complex features.

**Gate P2:** Independently solve unseen easy problems in arrays/maps/two pointers; explain when to use hash maps vs sorting; write 10–15 SQL queries without copying; demonstrate GET/POST/PATCH/DELETE on a working API. A reasonable cumulative DSA count is **60–90 well-understood problems**, not 300 rushed ones.

**Career action:** Draft one-page resume and GitHub profile; set up an application tracker; watch second-year-eligible internships and smaller startup roles **now**. Eligibility can open earlier than this roadmap anticipates.

## PHASE 3 — Internship-ready engineering (`P3`)

**Window:** Jul – Sep 2027 (start of probable 3-1) | **Effort:** ~140–170h | **Prerequisite:** P2 gate.

**Order:**
- `P3.01` Intermediate DSA: trees, BST, traversal, heap/priority queue, sliding window deeper, basic greedy.
- `P3.02` Stronger DBMS: schema relationships, joins, indexing intuition, ACID and transactions, explain plans.
- `P3.03` FastAPI router structure, Pydantic validation, SQLAlchemy ORM, migrations, test database, pytest/TestClient.
- `P3.04` Authentication fundamentals, authorization by owner/role, safe secrets/config management, standardized errors, pagination.
- `P3.05` Computer architecture/OS first pass: process vs thread, scheduling, memory, files, concurrency problems.
- `P3.06` Resume and timed assessments; start monitoring larger company intern cycles **immediately**.

**Resources:**
- [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/): **First Steps**, **Path Parameters**, **Request Body**, **Dependencies**, **Bigger Applications**, **Security**, **Testing**. Build each step, don't only read.
- [SQLAlchemy ORM Quick Start](https://docs.sqlalchemy.org/en/21/orm/quickstart.html): models, relationships, sessions, CRUD. Then use [Unified Tutorial](https://docs.sqlalchemy.org/en/21/tutorial/) for transactions and selects.
- [pytest: Get Started](https://pytest.org/en/latest/getting-started.html) then [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/): test happy paths, bad input, authorization, and missing records.
- [OSTEP official book](https://pages.cs.wisc.edu/~remzi/OSTEP/): **Processes**, **Scheduling**, **Address Spaces** early chapters; don't attempt the entire book yet.
- [Atlassian Early Careers](https://www.atlassian.com/company/careers/earlycareers): verify current India deadlines; published recruiting period begins July.

**Flagship Project 1 (upgrade Task Manager):** modular FastAPI app, PostgreSQL schema, account signup/login, password hashing, user-owned tasks, task status and due dates, tests, migration history, API docs, GitHub Actions test workflow, deployed demo if feasible. At least one other person should test it using README-only instructions.

**Gate P3:** You can design three related tables, implement an endpoint from a requirement, explain one index, run tests, fix a deliberately introduced API bug, and solve a timed easy+medium mix. DSA cumulative target **100–140 quality problems**.

**Applications:** Check internship openings 1–2 times/week. Apply **as soon as you meet an actual listing's batch and prerequisites**, even if you've not finished advanced graphs or system design.

## PHASE 4 — Interview strength + strong project evidence (`P4`)

**Window:** Oct – Dec 2027 | **Effort:** ~120–160h, reduced around semester exams | **Prerequisite:** P3.

**Order:**
- `P4.01` Graphs: BFS/DFS, connected components, topological sorting, shortest-path intuition.
- `P4.02` Dynamic programming introduction: memoization/tabulation, 1-D patterns, grid patterns, knapsack/LIS intuition.
- `P4.03` DBMS: indexing and EXPLAIN, query plans, transactions, isolation concepts.
- `P4.04` OS: threads, locks, deadlocks, virtual memory, file systems. Networking: DNS, TCP/UDP, HTTPS, caching.
- `P4.05` Project reliability: testing strategy, logs, deployment, Docker Compose, request validation, rate limiting intuition.
- `P4.06` Weekly mock interview and practical code comprehension.

**Resources:**
- [NeetCode 150 Roadmap](https://neetcode.io/roadmap/): use **Graphs, 1-D/2-D DP, Advanced Graphs** only after tree/recursion foundations. Some videos/paid conveniences may be optional; use free problems.
- [CSES Problem Set](https://cses.fi/problemset): targeted **Graph Algorithms** and **Dynamic Programming**, progressing carefully.
- [CMU 15-445 Fall 2025 Schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html): watch **#01 Relational Model**, **#02 Modern SQL**, **#08–09 Indexes**, **#12 Joins**, **#17 Concurrency Theory** selectively. Full graduate-level projects are **optional** and not an undergraduate-placement prerequisite.
- [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/): select **Concurrency and Threads**, **Locks**, **Deadlocks**, **Virtual Memory**, **File Systems**.
- [Stanford CS144](https://web.stanford.edu/class/cs144/): use lecture material on datagrams, reliability, TCP, and packet switching for depth *if time allows*. Do not treat its implementation labs as mandatory.
- [Cloudflare DNS explainer](https://www.cloudflare.com/learning/dns/what-is-dns/) and [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) for beginner-level understanding first.

**Flagship Project 2:** extend **CourseCairn** with backend-managed notes, learning progress, course enrollment, review/practice results, secure API and performant SQL queries. Document how frontend interacts with backend. If the pre-existing project doesn't need these features, use a different genuinely useful backend product instead.

**Gate P4:** Timed medium questions are increasingly solvable; explain processes vs threads, ACID, indexing, TCP vs UDP, and one real project trade-off. A usable project demo + 15–25 meaningful tests + deployment/readme are more valuable than raw feature count.

## PHASE 5 — Internship interview execution (`P5`)

**Window:** Jan – Jun 2028 (probable 3-2) | **Effort:** ~180–260h depending on exams and actual internships | **Prerequisite:** P3 core; P4 ongoing.

**Workstreams:**
- `P5.01` Mixed DSA revision: arrays → advanced structures, patterns under time limits, correctly articulated complexity.
- `P5.02` Interview-oriented DBMS/OS/networks/OOP review; fast explanations and applied examples.
- `P5.03` Timed mocks: coding, project, behavioral; some no-AI, some AI-permitted practice.
- `P5.04` Consistent intern applications, alumni outreach, referrals when appropriate, interview follow-ups.
- `P5.05` Project 1/2 hardening: tests, security audit, telemetry basics, one performance optimization.

**Practice targets [PLAN]:** aim toward **150–220 deeply understood DSA problems** by the end of this phase *if studying at 12–15h/week*, at least **two presentable projects**, 6+ timed mocks spread across the term. Counts are guidelines, not employer thresholds.

**Internship fallback paths:** company internship → smaller product-company internship → campus research assistantship → credible open-source contribution → shipped product with real users. The key is *evidence of engineering*, not a fake internship certificate.

**If you get an internship:** cut roadmap hours; prioritize doing an excellent job, documenting impact, code reviews, technical mentorship and ethical handling of employer code. An internship is not a guaranteed return offer.

**Gate P5:** Ready to take an actual OA and technical interview this month; comfortable defending both projects, debugging unfamiliar code and giving a structured explanation for a failed approach.

## PHASE 6 — New-grad placement readiness (`P6`)

**Window:** Jul – Dec 2028 (probable 4-1) | **Effort:** ~12–15h/week with placement priority | **Prerequisite:** foundational curriculum; apply while improving.

**Order:**
- `P6.01` Identify company, role, year, and specific assessment format from official posting.
- `P6.02` DSA revisions 4–6h/week; weekly mixed easy/medium/hard *only as appropriate to readiness*.
- `P6.03` Core CS 1–2h/week; project architecture and practical debugging 2–3h/week.
- `P6.04` At least one timed mock per week when interviews approach.
- `P6.05` Apply on-campus and off-campus; adapt resume and track status.
- `P6.06` Basic system design and OO design; avoid overlearning senior-level distributed systems for intern/new-grad positions.

**Resources:** [Microsoft technical interviewing](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing), [LeetCode 75](https://leetcode.com/studyplan/leetcode-75/), [System Design Primer](https://github.com/donnemartin/system-design-primer), [MIT student resume samples](https://capd.mit.edu/resources/sample-resumes/).

**Gate P6:** Your primary success metric is **real interviews taken + feedback incorporated + eligible roles applied to**, not another certificate or course completion percentage.

## PHASE 7 — Advanced engineering and AI readiness (`P7`, parallel from 2028)

**Window:** Optional **1–2h/week from early 2028**, more after placement milestones | **Prerequisite:** can build/debug normal apps without AI.

**Topics, in sequence:**
- `P7.01` Read unfamiliar Python/C++ code; trace data flow and runtime behavior.
- `P7.02` Inspect AI-generated code for subtle security, correctness and performance mistakes.
- `P7.03` Automated testing, CI, reviews, profiling; disciplined AI coding-agent workflows.
- `P7.04` LLM basics: tokens, context limits, embedding similarity, retrieval, grounding, failure modes.
- `P7.05` Build a small RAG-assisted **codebase documentation search** app; evaluate answers against known repository facts, include citations and failure cases.
- `P7.06` Scaling basics: caching, queueing, DB indexes, performance budgets and failure recovery.

**Resources:** [MIT Missing Semester 2026 — Agentic Coding and Code Quality lectures](https://missing.csail.mit.edu/2026/), [Canva's hiring write-up](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/), [System Design Primer](https://github.com/donnemartin/system-design-primer), [OWASP Top 10:2025](https://top10.owasp.org/2025/).

**Crucial rule:** interview instructions control AI usage. An AI agent is **not** permission to use AI on a prohibited assessment. Never upload confidential code or interview questions to unapproved tools.

## PHASE 8 — Graduation and conversion to work (`P8`)

**Window:** Jan – graduation 2029 or until your first job | **Focus:** efficient applications, finishing degree, interview lessons, onboarding skills, optional advanced projects.

**Priorities:** close any academic gaps; apply to 2029-batch eligible new-grad roles; update projects; revisit weak algorithms; interview regularly; maintain relationships with mentors. Learn a company's chosen stack **after** receiving a role-specific need rather than learning every tool in advance.

---

# PART IV — DETAILED SUBJECT SYLLABI (WHAT TO STUDY / WHAT TO SKIP)

## 7. C++ curriculum — one language deep enough for interviews (`CPP`)

| ID | Essential topics | Practice/output | Source |
|---|---|---|---|
| `CPP-01` | Compilation, output/input, values/types, expressions | 5 tiny scripts, explain compile-run workflow | [LearnCpp Chapters 0–1](https://www.learncpp.com/) |
| `CPP-02` | Conditionals, loops, functions, scope | 15 logic exercises | [LearnCpp](https://www.learncpp.com/) |
| `CPP-03` | Arrays, strings, references, pointers | reverse array, frequency table, trace pass-by-reference | [LearnCpp](https://www.learncpp.com/) |
| `CPP-04` | `vector`, `pair`, `map`, `unordered_map`, `set`, `stack`, `queue` | rewrite same problem using two containers | [USACO Introduction to Data Structures](https://usaco.guide/bronze/intro-ds) |
| `CPP-05` | Recursion, backtracking intuition, stack memory | recursion tree and subset generation | [CS50x Weeks 3–5](https://cs50.harvard.edu/x/) |
| `CPP-06` | Classes, constructors, encapsulation, composition | console task-tracker model | [LearnCpp](https://www.learncpp.com/) |
| `CPP-07` | Debugging, warnings, sanitizer basics, tests | find 5 deliberately introduced bugs | [MIT Missing Semester 2026](https://missing.csail.mit.edu/2026/) |

**Defer initially:** advanced templates/metaprogramming, obscure C++ internals, compiler construction, smart-pointer design deep dives. Understand common modern C++ practices well enough to avoid memory bugs; learn more as projects need them.

## 8. DSA curriculum in dependency order (`DSA`)

**Primary teaching spine:** [Striver A2Z free sheet](https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet); **visual explanation:** [USACO Guide](https://usaco.guide/bronze), [VisuAlgo](https://visualgo.net/en) (optional visualization); **independent practice:** [CSES](https://cses.fi/problemset) and [LeetCode](https://leetcode.com/problemset/); **final structured review:** [NeetCode 150](https://neetcode.io/roadmap/). **Don't run four full sheets at once.**

| Order | Topic | Minimum mastery task | Introduce | Revisit thereafter |
|---|---|---|---|---|
| `DSA-01` | Complexity + basic math | Compare O(n), O(n log n), O(n²) on examples | P1 | Monthly |
| `DSA-02` | Arrays + strings | scans, transforms, frequency counting | P1–P2 | Weekly |
| `DSA-03` | Sorting + binary search | lower/upper bound, off-by-one tests | P1–P2 | Weekly |
| `DSA-04` | Hashing | counts, duplicates, two-sum-like problems | P2 | Weekly |
| `DSA-05` | Prefix sums | subarray-sum calculations | P2 | Biweekly |
| `DSA-06` | Two pointers | sorted array pairs, deduplication | P2 | Biweekly |
| `DSA-07` | Sliding window | fixed and variable window | P2 | Biweekly |
| `DSA-08` | Linked lists | reverse, detect cycle, merge | P2 | Monthly |
| `DSA-09` | Stack + queue | parentheses, next-greater, BFS queue | P2 | Monthly |
| `DSA-10` | Recursion/backtracking | subsets, permutations, choices | P2–P3 | Biweekly |
| `DSA-11` | Trees + BST | 3 traversals, depth, BST validation | P3 | Biweekly |
| `DSA-12` | Heap / priority queue | top-K, merge streams intuition | P3 | Monthly |
| `DSA-13` | Greedy | reason why local choice works or fails | P3 | Monthly |
| `DSA-14` | Intervals | merge/schedule intervals | P3 | Monthly |
| `DSA-15` | Graph traversal | BFS/DFS, components, grids | P4 | Biweekly |
| `DSA-16` | Graph ordering | topological sort, directed cycles | P4 | Monthly |
| `DSA-17` | Shortest paths | Dijkstra intuition and implementation | P4 | Monthly |
| `DSA-18` | Disjoint set union | union/find, components | P4–P5 | Monthly |
| `DSA-19` | DP foundations | overlapping subproblems, memo vs table | P4 | Biweekly |
| `DSA-20` | Common DP patterns | stairs, grid, 0/1 knapsack, LIS | P4–P5 | Biweekly |
| `DSA-21` | Tries and bit manipulation | prefix lookup; XOR/bit masks basics | P5 | Monthly |
| `DSA-22` | Timed mixed application | design + code + edge cases + complexity | P3 onward | Weekly |

**Problem progression targets [PLAN, not hiring rules]:** end P0: 20–30 programming drills; end P2: 60–90 **DSA** problems; end P3: 100–140; end P5: 150–220; during placements: up to **200–300 unique, understood** problems if time permits. Review old problems more often than adding new ones. A correctly mastered set of 150 can beat 500 copied solutions.

**Difficulty:** early 70–80% Easy, 20–30% approachable Medium; in late third year gradually favor Medium; Hard is optional enrichment and should not displace revision/core CS.

## 9. DBMS + SQL curriculum (`DB`)

| Order | Topic | Proof of mastery | Where to learn |
|---|---|---|---|
| `DB-01` | Rows, tables, relations, keys, constraints | Draw 3-table schema | [SQLBolt](https://sqlbolt.com/) + [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) |
| `DB-02` | SELECT, filters, sort, grouping | 12 self-written SELECT queries | [SQLBolt interactive lessons](https://sqlbolt.com/) |
| `DB-03` | Inner/outer joins, aggregates, subqueries | 8 joins across users/tasks/courses | [PostgreSQL Tutorial: SQL Language](https://www.postgresql.org/docs/current/tutorial.html) |
| `DB-04` | Normalization + relationships | Explain 1NF–3NF and trade-offs | [CMU #01 Relational Model](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) |
| `DB-05` | Indexes + query plans | Use EXPLAIN and discuss trade-offs | [CMU #08–09 Indexes](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) |
| `DB-06` | ACID, transactions, isolation, locks | Show rollback and race-condition scenario | [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) + [CMU #17](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) |
| `DB-07` | DB engineering | migrations, backups, safe parameterization | [PostgreSQL Documentation](https://www.postgresql.org/docs/current/) |

**Don't start with database internals** (buffer managers, distributed consensus). SQL and a correctly designed schema come first; deeper internals are optional differentiation.

## 10. OOP + OS + networks (`CS`)

| ID | Topic | Minimum question you should answer | Verified reference |
|---|---|---|---|
| `CS-OOP-01` | Classes/objects/encapsulation/composition | How would you model a learning course? | [LearnCpp](https://www.learncpp.com/) |
| `CS-OOP-02` | Inheritance, polymorphism, abstraction, interfaces | When is composition better than inheritance? | [LearnCpp](https://www.learncpp.com/) |
| `CS-OS-01` | OS overview, processes, threads, context switch | Process vs thread with concrete example | [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) |
| `CS-OS-02` | Scheduling + sync | Race condition, mutex, deadlock | [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) |
| `CS-OS-03` | Virtual memory, paging, files | Why do apps appear to have private memory? | [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) |
| `CS-NET-01` | TCP/IP, UDP, ports, request/reply | TCP vs UDP, packet loss | [Stanford CS144](https://web.stanford.edu/class/cs144/) |
| `CS-NET-02` | DNS + HTTP + HTTPS/TLS | What happens when entering a URL? | [Cloudflare DNS](https://www.cloudflare.com/learning/dns/what-is-dns/) + [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) |
| `CS-NET-03` | Timeouts, retries, API errors, caching | Why can retrying POST create duplicates? | [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) |
| `CS-SD-01` | Load balancers, caches, queues, DB replication | Sketch a URL shortener | [System Design Primer](https://github.com/donnemartin/system-design-primer) |

**Order matters:** DB first through your real backend project; OOP starts with C++, OS+networks first-pass begins in P3 and deepens in P4; system design comes only after you can explain what an API, database and HTTP request are.

## 11. Python backend curriculum (`BE`)

| ID | Topic | Build task | Verified reference |
|---|---|---|---|
| `BE-01` | Python functions, modules, collections, exceptions, venv | Python CLI program | [Python tutorial](https://docs.python.org/3/tutorial/) |
| `BE-02` | HTTP, JSON, REST, endpoints/status | 4-endpoint in-memory API | [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) + [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) |
| `BE-03` | FastAPI requests, validation, dependencies, routers | Refactor API across modules | [FastAPI user guide](https://fastapi.tiangolo.com/tutorial/) |
| `BE-04` | PostgreSQL schema + SQLAlchemy sessions/models | Multi-table persisted app | [Postgres tutorial](https://www.postgresql.org/docs/current/tutorial.html) + [SQLAlchemy tutorial](https://docs.sqlalchemy.org/en/21/tutorial/) |
| `BE-05` | Authentication, authorization, secrets | Prevent one account reading another user's record | [FastAPI user guide: Security](https://fastapi.tiangolo.com/tutorial/) |
| `BE-06` | pytest and API test client | 15+ happy and failure cases | [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/) + [pytest](https://pytest.org/en/latest/getting-started.html) |
| `BE-07` | Docker/Compose, CI and deployment | One-command reproducible local stack; CI green | [Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/) + [GitHub Actions](https://docs.github.com/en/actions/get-started/quickstart) |
| `BE-08` | Indexes, pagination, monitoring/logs, errors, security | Diagnose slow query and failed request | [Postgres docs](https://www.postgresql.org/docs/current/) + [OWASP Top 10:2025](https://top10.owasp.org/2025/) |

**Do not overlearn:** Kubernetes, event-driven microservices, paid cloud certifications, a new ORM weekly, 15 deployment platforms, complicated auth frameworks, or deep distributed systems before you have a stable monolith and tests.

---

# PART V — PROJECT PORTFOLIO: TWO STRONG PROJECTS + OPTIONAL DIFFERENTIATOR

## 12. Project rules (apply to every serious build)

**Minimum portfolio evidence:** problem statement, features, working code, instructions, screenshots/demo video, data model, API examples, testing strategy, security notes, technical decisions, honest limitations, and exact personal contribution.

A project is **resume-ready** only if:
- [ ] Fresh clone can be set up using README instructions.
- [ ] Main workflow runs end-to-end without manually changing source.
- [ ] Tests cover primary paths and failures and run locally.
- [ ] Secrets are **not** committed; `.env.example` documents variables.
- [ ] API docs and schema diagram accurately match implementation.
- [ ] At least one real bug was diagnosed and recorded.
- [ ] You can explain one performance, data model and security decision.
- [ ] You can demo it **without pretending AI-generated code was all manually written**.

### Project A — Reliable Task/Issue Management API (`PROJ-A`, P2–P3)

**User story:** Individuals or small teams can register, securely create tasks, update status, search/filter, and view their own progress.

**Incremental milestones:**
1. **A0 (first 6–8h):** create GET/POST/PATCH/DELETE CRUD using in-memory data.
2. **A1 (8–12h):** PostgreSQL users/tasks schema; constraints, FK relationships, migrations; persistent CRUD.
3. **A2 (10–15h):** authentication; user ownership checks; validated input; pagination.
4. **A3 (10–15h):** 20 meaningful automated tests, error handling, logs, README, sample API calls.
5. **A4 (8–12h):** GitHub Actions CI, optional Docker Compose, deployment and 2-minute demo.

**Possible models:** `users(id,email,password_hash,created_at)`, `tasks(id,user_id,title,status,due_at,created_at)`; optional `task_events` for audit history. Unique email, FK from tasks to users, status constraint. Store passwords **hashed, never plain text**.

**Interview questions to answer:** Why SQL? How do you prevent IDOR/user data leakage? What happens on two concurrent updates? How does pagination work? How would you handle 10x traffic? What tests catch unauthorized access?

### Project B — CourseCairn Production Backend (`PROJ-B`, P4–P5)

**User story:** Students can follow backend/DSA/system-design learning paths, track progress, save notes, and work on practice checkpoints. **Build only features that genuinely improve the existing product.**

**Milestones:**
1. Model `courses`, `modules`, `lessons`, `user_progress`, `notes`, `practice_attempts` with reasonable constraints.
2. Build versioned REST API with filtering and owner-secured progress endpoints.
3. Support the already-deployed site via a documented integration; keep API and front-end responsibilities clear.
4. Add integration tests, indexes for progress queries, seed data, error handling and a migration path.
5. Publish architecture diagram, project decisions, truthful usage/performance evidence and deployment guide.

**Proof points:** show data model; explain N+1 queries, progress update idempotency, API auth, caching opportunities and failure handling. If you do not own every part of a collaborative project, indicate contributions precisely.

### Project C — AI Codebase Intelligence Assistant (`PROJ-C`, optional, P7)

**User story:** Select a public repository, ingest/read selected files, ask about architecture or source locations, and receive answers tied to specific files/lines.

**Before building:** Can you already use Python, files, APIs, databases and tests? If not, defer.

**Minimum credible features:** repository loader respecting ignore rules, chunking strategy, metadata/source references, lexical/retrieval search, optional embeddings, answer with file paths and evidence, evaluation set (20 known questions) with measured accuracy, explicit uncertainty when evidence absent, secret avoidance, and a human review loop.

**Evaluation:** hallucinated path rate, retrieval hit rate, evidence coverage, latency, cost (if any), and security/permission considerations. **Don't promise 1M context or autonomous code correctness.**

---

# PART VI — INTERNSHIP + PLACEMENT EXECUTION PLAN

## 13. Exact application timeline by semester [PLAN]

| Your likely stage | Application tasks | Skill profile expected |
|---|---|---|
| **2-2 (early 2027)** | Apply to second-year-eligible programs, small product internships, research/open-source; develop resume | C++ basics + starter DSA + Git + first small project |
| **3-1 (Jul–Dec 2027)** | **Primary summer-2028 internship application push**; track employers weekly; campus PPO routes | DSA easy/medium foundation + working backend + SQL, CS starting |
| **3-2 (Jan–Jun 2028)** | Continue live 2028 applications; interviews; try internships/research | 1–2 projects, stronger coding, OS/DBMS/networks, mocks |
| **4-1 (Jul–Dec 2028)** | **Primary new-grad 2029 placement push**; on-campus and off-campus | Strong mixed DSA, CS, projects, ready-to-interview |
| **4-2 (Jan–Jun 2029)** | Remaining full-time rounds, off-campus, startups, referrals, graduate programs | Interview iteration and high-signal project achievements |

**Research-backed recruiting example:** [Atlassian publishes India recruiting July–December and summer internship May–August](https://www.atlassian.com/company/careers/earlycareers). This is an example, not a fixed timetable for every employer/year. **Some applications close much earlier**—create alerts and check official boards continuously.

### 13.1 Every Sunday: 30-minute internship/job opportunity sweep

1. Visit **official** career portals (links below), select India and internship/new-grad/SDE filters.
2. Read **actual** eligibility and expected graduation year **before** applying.
3. Record role URL, title, location, graduation batch, required skills, posting date, deadline if stated, OA date, referral/contact status.
4. Apply within the specified window; don't postpone to finish 500 DSA problems.
5. If eligible, make a tailored truthful resume; don't spam employees or claim a connection you don't have.
6. Check official email and spam folder, document OA instructions, and prepare with permitted tools only.

### 13.2 Official starting points (not claims of current vacancies)

| Employer | Start here | What to verify |
|---|---|---|
| Google | [Google Careers](https://www.google.com/about/careers/applications/jobs/results/) | India, intern/new-grad, graduation year, degree, documents, permitted AI |
| Microsoft | [Microsoft Careers](https://careers.microsoft.com/v2/global/en/home.html) and [eligibility](https://careers.microsoft.com/v2/global/en/internship_eligibility) | India pre-final rule and specific opening |
| Amazon | [Amazon Jobs](https://www.amazon.jobs/) | SDE intern vs new-grad, graduation year, work location, OA instructions |
| Meta | [Meta Careers](https://www.metacareers.com/) | Geography and work authorization, role/level |
| Apple | [Apple Jobs](https://jobs.apple.com/) | Software Engineering/IS&T/intern roles and geography |
| Atlassian | [Atlassian Early Careers](https://www.atlassian.com/company/careers/earlycareers) | India recruiting windows, graduation eligibility |
| Adobe | [Adobe Careers](https://careers.adobe.com/) | University programs, software roles, eligibility |
| Uber | [Uber Careers](https://www.uber.com/us/en/careers/) | University/SWE roles and location |
| Salesforce | [Salesforce Careers](https://careers.salesforce.com/) | Futureforce/new-grad roles, India filters |
| NVIDIA | [NVIDIA Careers](https://www.nvidia.com/en-us/about-nvidia/careers/) | Role-specific C++/systems/AI requirements |
| Intuit | [Intuit Careers](https://www.intuit.com/careers/) | Student/engineering hiring in India |
| LinkedIn | [LinkedIn Careers](https://careers.linkedin.com/) | Actual new-grad or intern listings in region |

**Link note:** Employers can redesign portals. These are starting points, not live job guarantees. Recheck them at the application date. Don't pay to apply; verify recruiter communications through official domains and company instructions.

## 14. Application tracker (`CAREER-TRACKER`)

Create a spreadsheet or database with these fields (future website-ready):

`application_id | company | role_title | level | official_url | location | required_graduation | my_eligibility | date_found | deadline | date_applied | source (campus/off-campus/referral) | resume_version | OA_date | status | next_action | followup_date | rejection_reason_if_known | notes`

**Status values:** `watchlist`, `eligible`, `applied`, `OA`, `interview`, `offer`, `rejected`, `withdrawn`, `ineligible`, `expired`.

**Application quality rule:** prioritize fit and speed. An unsent “perfect” application is worth nothing. Respect limits on number of applications to the same company.

## 15. Resume + GitHub strategy

**Resume:** one page as a student unless actual experience justifies more; contact and links, education, technical skills you can defend, projects with *your contribution*, relevant experience, noteworthy achievements. Use impact language only for **measured** results.

**Strong example (when true):** “Built a FastAPI task service backed by PostgreSQL, added authorization checks and 24 automated tests; reduced a measured search endpoint latency by X% using an index.”

**Weak example:** “Developed a world-class scalable AI application” without users, metrics, tested behavior or evidence.

**Resources:** [MIT sample resumes](https://capd.mit.edu/resources/sample-resumes/) → open the **undergraduate CS/math-related sample**; [MIT resume advice](https://capd.mit.edu/channels/resumes/) → read skill evidence, action verbs and measurable results; [GitHub Skills](https://learn.github.com/skills) → Intro to GitHub and pull requests.

**GitHub profile:** pin Project A and B, each with setup, architecture, tests, demo and limitations. 2 polished repos > 15 dead tutorial repos. Use genuine commits rather than artificial streaks.

## 16. OA, technical interview and behavioral playbooks

### OA algorithm (during an assessment)

1. Read all questions and constraints; determine scoring/time limits.
2. Start with a question you can solve reliably, unless scoring format dictates otherwise.
3. Clarify assumptions if format permits; write brute-force idea then optimize.
4. Test empty/single, duplicate, sorted/reversed, max-size and overflow cases.
5. Compile and test when permitted. Manage time; don't leave a good solution unsubmitted.

### 45-minute coding mock template

- 0–5 min: restate problem, input/output/constraints, ask questions.
- 5–12 min: solution options, choose approach, time and memory complexity.
- 12–30 min: implement readable code.
- 30–38 min: run through normal/edge cases, fix bugs.
- 38–45 min: discuss optimization, alternatives and trade-offs.

**Self-grade 0–2 each:** communication, approach, implementation, complexity, testing, recovery when stuck. Record video/audio only if consented and permitted.

### Practical engineering mock (60–90 min)

Clone a *public or your own* unfamiliar repo. Read README and dependency structure; explain module flow; reproduce a failing test; isolate bug; fix it; write regression test; explain whether an AI suggestion was correct. Once per month practice with permitted AI, and once per month without it. Interview rules always override your practice habit.

### Behavioral stories

Prepare 6 real STAR stories: difficult bug, collaborating with someone, learning a tool quickly, receiving criticism, simplifying a messy implementation, taking ownership after a failure. Do **not** fabricate past internships, scale metrics or user adoption.

## 17. Campus vs off-campus vs referrals

- **Campus:** follow your college placement cell's timeline, CGPA/backlog policies and registration rules; identify who is eligible for each drive. Some companies recruit only from selected campuses in particular seasons.
- **Off-campus:** apply via the real company portal and role URL. Batch eligibility matters. Track roles across India, including Bengaluru/Hyderabad/Pune/Chennai and other valid locations, but apply only where you can actually work.
- **Referrals:** ask respectfully with concise resume, exact job link and a short explanation of fit. A referral does not override hiring standards or guarantee interview.
- **Open source:** choose small reproducible bug/documentation/test improvements; review contribution guidelines and earn trust before large PRs. Never count an abandoned fork as a contribution.
- **Alternatives:** internships at smaller engineering teams with code reviews, tests and real ownership can produce strong experience. Prioritize learning quality over logo alone.

---

# PART VII — RESOURCE DIRECTORY (VERIFIED CONTENT + EXACT ASSIGNMENT)

**Research note:** Links marked **CHECKED** were opened or located through official/reliable pages during the research on 2026-10-24, and the described material was verified at page or site level. Some employer career landing pages are *watchlist URLs* and must be rechecked before applying; no availability is implied. Free access to core learning content is prioritized; optional upgrades, account requirements and platform changes may exist.

| ID | Resource (direct link) | Provider / access | Verified content | Exact use for this roadmap | Skip / warning |
|---|---|---|---|---|---|
| `R01` | [CS50x 2026](https://cs50.harvard.edu/x/) | Harvard, free course content, CHECKED | Week 0 computing, Week 1 C, Weeks 2–5 algorithms/memory/data structures, later Python/SQL | **P0:** Week 0; **P1:** selected algorithm/memory explanations | Don't complete all assignments plus full C++ curriculum concurrently |
| `R02` | [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/) | Harvard, free, CHECKED | binary, algorithmic thinking, pseudocode, conditions, loops | First 2–3 sessions in P0 | Scratch programming optional after conceptual learning |
| `R03` | [LearnCpp course index](https://www.learncpp.com/) | Free text tutorial, CHECKED | Chapter 0 setup, Chapter 1 syntax, subsequent modern C++ | **Primary C++ book** P0–P1 | Avoid obscure advanced C++ features initially |
| `R04` | [LearnCpp 1.1](https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/) | Free, CHECKED | statements/functions/`main()` | Your first live program explanation | Not enough by itself—continue chapter |
| `R05` | [USACO Bronze](https://usaco.guide/bronze) | Free guide, CHECKED | complexity, DS intro, simulation, sorting, greedy | P1 and early P2 *C++ learning* | Geometry/special contest modules not required early |
| `R06` | [USACO Intro to DS](https://usaco.guide/bronze/intro-ds) | Free, CHECKED | vectors/pairs/tuples, how DS operations differ | P1 STL exercises | Not a substitute for all DSA |
| `R07` | [Striver A2Z DSA Sheet](https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet) | **Free sheet**, optional paid extras, CHECKED | structured DSA modules from basics onward | Main guided DSA ordering from P2 | Paid videos/planners unnecessary |
| `R08` | [CSES Problem Set](https://cses.fi/problemset) | Free problems, CHECKED | introductory, sorting/search, graph, DP sets | Independent code practice by phase | Don't randomly tackle advanced DP in P0 |
| `R09` | [NeetCode 150 Roadmap](https://neetcode.io/roadmap/) | Free roadmap/problem access with optional upgrades, CHECKED | topic dependencies, 150 structured questions, C++ solutions | P4–P6 **revision and gap detection** | Avoid treating as a second full simultaneous sheet |
| `R10` | [LeetCode 75](https://leetcode.com/studyplan/leetcode-75/) | Study plan; some site features paid, CHECKED | 75 selected interview questions | P5–P6 timed mixed revision | Not initial teaching curriculum |
| `R11` | [MIT Missing Semester 2026](https://missing.csail.mit.edu/2026/) | Free notes/videos, CHECKED | shell, environment, Git, debugging, packaging, agentic coding, code quality | P1 shell/Git/debugging; P7 AI/code quality | Skip advanced bits until relevant |
| `R12` | [GitHub Intro Skill](https://github.com/skills/introduction-to-github) | Free interactive repo, CHECKED | branch, commit, PR, merge | Complete in P1 | No need to chase green contribution streaks |
| `R13` | [GitHub Skills](https://learn.github.com/skills) | Free, CHECKED | Git, Markdown, PRs, Actions courses | Pick one lesson per workflow need | Don't collect badges for their own sake |
| `R14` | [Pro Git](https://git-scm.com/book/en/v2) | Free book, CHECKED | Git basics, branching, collaboration | Consult Chapters 1–3 as needed | Not all internals required |
| `R15` | [SQLBolt](https://sqlbolt.com/) | Free interactive lessons, CHECKED | SELECT, joins, aggregation, table changes | Work through all core SQL lessons in P2 | SQLite examples may differ from PostgreSQL specifics |
| `R16` | [PostgreSQL official tutorial](https://www.postgresql.org/docs/current/tutorial.html) | Free official docs, CHECKED | install/access DB, table operations, joins, aggregates, FKs, transactions | P2–P3 run every chosen query yourself | Docs version may advance; concepts persist |
| `R17` | [CMU 15-445 lecture schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html) | Free lecture notes/video links, CHECKED | relations/SQL/indexes/joins/transactions/storage | P4 select lectures #01, #02, #08–09, #12, #17 | Entire graduate project course is excessive for this plan |
| `R18` | [Python official tutorial](https://docs.python.org/3/tutorial/) | Free official docs, CHECKED | syntax, flow, functions, data structures, modules, errors, classes | P2 only after basic C++ foundations | Tutorial assumes programming knowledge |
| `R19` | [MDN HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) | Free documentation, CHECKED | HTTP client/server, messages, protocol | P2–P3 request/response and methods | Don't memorize all HTTP headers |
| `R20` | [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/) | Free official docs, CHECKED | routes, path/query, body, deps, security, test | P2–P3 build Task API | Read and implement, not copy without understanding |
| `R21` | [FastAPI First Steps](https://fastapi.tiangolo.com/tutorial/first-steps/) | Free official docs, CHECKED | minimal API, route decorators, operation methods | First backend coding session in P2 | Don't deploy a Hello World as flagship |
| `R22` | [SQLAlchemy Unified Tutorial](https://docs.sqlalchemy.org/en/21/tutorial/) | Free official docs, CHECKED | connections, transactions, metadata, CRUD, ORM relationships | P3 persisted API | ORM must not replace learning raw SQL |
| `R23` | [SQLAlchemy ORM Quick Start](https://docs.sqlalchemy.org/en/21/orm/quickstart.html) | Free official docs, CHECKED | typed mappings, relationships, sessions and CRUD | First ORM model for P3 | Check version compatibility with your app |
| `R24` | [pytest Getting Started](https://pytest.org/en/latest/getting-started.html) | Free official docs, CHECKED | install/run pytest, assertions, failing tests | Write first tests in P3 | Green badge without useful assertions is meaningless |
| `R25` | [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/) | Free official docs, CHECKED | TestClient, HTTPX, pytest integration | P3–P4 endpoint tests | Cover auth errors and bad inputs too |
| `R26` | [OSTEP](https://pages.cs.wisc.edu/~remzi/OSTEP/) | Free chapter PDFs, CHECKED | virtualization, processes, memory, concurrency, persistence | P3–P5 OS chapters in that order | Start with overview, not dense labs |
| `R27` | [Cloudflare DNS explained](https://www.cloudflare.com/learning/dns/what-is-dns/) | Free primer, CHECKED | domain to IP resolution, DNS roles | P4 URL-in-browser explanation | Not a complete networking textbook |
| `R28` | [Stanford CS144](https://web.stanford.edu/class/cs144/) | Public lecture materials, CHECKED | datagrams, TCP, reliability, congestion and packet switching | P4–P5 targeted networking topics | Deep TCP implementation labs optional |
| `R29` | [Docker Compose Quickstart](https://docs.docker.com/compose/gettingstarted/) | Free official docs, CHECKED | multi-container stack, YAML and run commands | P4 run API + Postgres in one command | Can defer if local DB setup already works |
| `R30` | [GitHub Actions Quickstart](https://docs.github.com/en/actions/get-started/quickstart) | Free docs; hosted runner quotas vary, CHECKED | CI workflow and results | P3–P4 run tests on push/PR | Avoid unneeded paid CI usage |
| `R31` | [OWASP Top 10:2025](https://top10.owasp.org/2025/) | Free security standard, CHECKED | access control, injection, misconfiguration, auth and more | P4–P7 audit own API for common risks | Threat awareness, not a substitute for security review |
| `R32` | [System Design Primer](https://github.com/donnemartin/system-design-primer) | Free open-source guide, CHECKED | scaling, caching, queues, load balancing and design examples | Intro only from P5–P7 | Defer highly distributed designs |
| `R33` | [MIT resume examples](https://capd.mit.edu/resources/sample-resumes/) | Free resource, CHECKED | undergrad resumes incl. math/CS sample | First resume P2, revisions before applications | Use as guide, not a verbatim template |
| `R34` | [MIT resume channel](https://capd.mit.edu/channels/resumes/) | Free resource, CHECKED | evidence, concise formatting, actionable bullet guidance | P3 resume review | Never invent impact numbers |
| `R35` | [Atlassian Early Careers](https://www.atlassian.com/company/careers/earlycareers) | Official company, CHECKED | India recruiting window and internship process information | Monitor from Jul 2027 | Role-specific criteria supersede webpage |
| `R36` | [Amazon SDE Intern example](https://www.amazon.jobs/en/jobs/10513277/software-development-engineer-intern-may-2027-2-month-amazon-university-talent-acquisition) | Official sample job, CHECKED | baseline and preferred qualifications including AI productivity | Reverse-engineer skills required, **do not apply if batch ineligible** | The linked role explicitly targets 2027 grads |
| `R37` | [Microsoft technical interview](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing) | Official guide, CHECKED | coding, algorithms, testing, design and CS areas | Benchmark interviews and mock scoring | Role-dependent topics |
| `R38` | [Microsoft India intern eligibility](https://careers.microsoft.com/v2/global/en/internship_eligibility) | Official policy page, CHECKED | India pre-final-year criteria | Check before third-year application | Could change before 2028 |
| `R39` | [Canva AI interviews](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/) | First-party engineering blog, CHECKED | AI-assisted technical interview philosophy, code reading and judgment | P7 emerging interview mock design | Not a policy for all companies |
| `R40` | [Meta AI interview pilot](https://www.linkedin.com/posts/meta_metacareers-interviewing-softwareengineering-activity-7386046074240737280-wnwA) | Official Meta announcement on LinkedIn, CHECKED | selected interview pilot with authorized AI | Understand the trend without exaggeration | Pilot is not universal |
| `R41` | [Roadmap.sh backend projects](https://roadmap.sh/backend/projects) | Free project ideas, CHECKED | task API, URL shortener, caching proxy, e-commerce API | Alternative simple project specs | Use ideas, not as proof of production skills |

**Link quality disclaimer:** Each named learning resource has been checked at its source/official page as of the research date, but the internet can change. Some external site functions require sign-in, and not every sublesson/video was individually watched. This file deliberately **does not invent video timestamps or promise specific links will remain permanently free**. When building your future learning website, revalidate URLs and license conditions.

---

# PART VIII — YOUR FIRST 12 WEEKS, DAY-TO-DAY LEVEL

## 18. Dates, outcomes and workload

| Week | Approx dates | Main topics | Practical output | Review checkpoint |
|---|---|---|---|---|
| `W01` | Dec 16–22, 2026 | How computer/program works; compiler and C++ setup | Hello world + 4 tiny programs | Explain source → compile → run |
| `W02` | Dec 23–29 | Variables, I/O, operators, conditions | Calculator, grade classifier, max of 3 | Rebuild one without notes |
| `W03` | Dec 30–Jan 5 | Loops, functions, scope | Prime check, sum of digits, table | Trace 3 programs on paper |
| `W04` | Jan 6–12 | Arrays and strings | Array stats, reverse string, frequencies | P0 mini-assessment |
| `W05` | Jan 13–19 | More arrays, debugging, functions | Reusable array utilities | Revisit W01–W04 |
| `W06` | Jan 20–26 | Simple algorithms, pseudocode, edge cases | Linear search, sorting by hand, bug log | 35-minute blank-file exercise |
| `W07` | Jan 27–Feb 2 | C++ `vector`, strings, reference basics | Vector operations; explain pass-by-ref | P0 exit gate; delay if needed |
| `W08` | Feb 3–9 | Pointers + recursion introduction | Recursive factorial/sum and traces | Review reference vs pointer |
| `W09` | Feb 10–16 | STL maps/sets/pairs | Word frequency counter | Reimplement without copying |
| `W10` | Feb 17–23 | Time complexity, sorting and search | Linear vs binary search comparison | Timed 2 beginner problems |
| `W11` | Feb 24–Mar 2 | Git, GitHub, shell, debugging | First branch and PR, clean README | Revisit recursion/search |
| `W12` | Mar 3–9 | Basic classes; CLI Task Tracker | First tiny complete program project | P1-style rehearsal |

**In every week:**
- Choose **3–5 focused 1–2 hour sessions** and one longer block; do not stretch content to fill all available time.
- 10–20 minutes of old-topic recall twice per week.
- End the week with one Git commit and a 5-minute note: learned / blocked / next action.
- Exams override this sequence. Weeks can slide; learning order stays intact.

**First evening, December 16:** Open [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/), work through the high-level computing concepts, then open [LearnCpp 0.2–0.7](https://www.learncpp.com/) and set up a minimal compiler workflow; compile and run one C++ file. That is enough for Day 1.

---

# PART IX — MEASUREMENT AND RESPONSIBLE ADJUSTMENT

## 19. Quarterly scorecard: grade your capabilities, not just hours

**Use red/amber/green for each capability:** red = cannot do independently; amber = needs notes/hints; green = independent, can explain and test.

| Assessment date | Independent coding | DSA | CS/backend | Portfolio/career |
|---|---|---|---|---|
| Mar 2027 | Functions/arrays/classes and debugging | Search/sort/complexity | Git + terminal | CLI repo |
| Jun 2027 | C++ comfortable | 60–90 quality DSA | SQL + simple Python API | Resume v1, applications when eligible |
| Sep 2027 | Timed easy/medium mix | 100–140 quality DSA | tested FastAPI + Postgres; OS basics | flagship project, internships tracked |
| Dec 2027 | Graph/DP first pass | mixed easy/medium competence | OS/networks/DBMS fundamentals | CourseCairn or comparable backend demo |
| Jun 2028 | Interview problem solving | 150–220 quality DSA | project diagnosis/design/testing | internship interviews and experience attempt |
| Dec 2028 | high reliability in mocks | revision coverage, not raw count | discuss architecture + trade-offs | active campus/off-campus job pipeline |

## 20. Monthly audit template (copy each month)

```markdown
# Monthly Review — YYYY-MM
Normal/Exam/Holiday weeks: __ / __ / __
Actual focused hours: __ (not a punishment metric)
New independently solved DSA problems: __
Old problems re-solved without help: __
Top 3 concepts still red/amber: __
Software shipped or tested: __
One bug I diagnosed myself: __
Core CS concept I can explain: __
CGPA/academics status and upcoming exams: __
Applications (eligible/applied/OA/interview): __ / __ / __ / __
Next month: keep doing __; stop wasting time on __; change __.
```

## 21. If you fall behind, follow the recovery policy

| Situation | Action |
|---|---|
| Missed 1–2 weeks due to exams | Do one 60-minute retrieval session; continue from current module; move dates |
| Forgot arrays/binary search | Two focused reimplementation sessions; add D1/D7 reminders |
| Stuck on a single DP problem for hours | Reduce difficulty; revisit recursion/subproblem definition; don't marathon it |
| No internship by end of 3-1 | Continue applications and project depth; this is not a career failure |
| No internship by end of 3-2 | Seek research/startup/open-source opportunities; intensify full-time preparation |
| Lower than ideal CGPA | Check actual cutoffs; recover academics; widen off-campus roles |
| AI is writing everything | Use 2 no-AI sessions/week; read every diff and write your own tests |
| Too many courses | Return to **one** teaching source per subject and **one** main project |

## 22. What NOT to prioritize yet

Don't lose your first year of serious preparation on: learning five languages, paid certificates, deeply training LLMs, chasing every trending AI agent, hundreds of copied LeetCode answers, grand system design before HTTP/SQL, Kubernetes before Docker, or a resume with ten superficial apps. None replaces core engineering competence.

---

# PART X — WEBSITE-CONVERSION CONTRACT FOR THE FUTURE

## 23. Information architecture (for later, not a website request now)

When you want to build a website, this Markdown is the **canonical content source**. Suggested routes:

- `/roadmap` → high-level timeline, requirements, duration and milestone gates.
- `/phases/P0` through `/phases/P8` → objectives, tasks, dependencies, resources and checklists.
- `/subjects/cpp`, `/subjects/dsa`, `/subjects/dbms`, `/subjects/os`, `/subjects/networks`, `/subjects/backend`, `/subjects/ai` → individual syllabi.
- `/resources` → annotated verified links and suggested order.
- `/projects` → builds, test criteria, portfolio artifacts.
- `/internships` → eligibility guidance, official links and application tracker.
- `/placements` → mocks, company practices, career planning.
- `/dashboard` → personal progress, review queue, exam mode.

**Never turn estimated roadmap dates into promised internship/job dates.** Separate explanatory content from per-user study history and live job postings. Allow users to change start date, hours/week, degree length, semester dates, existing skills, and target geography. Avoid adding backend complexity until needed.

### 23.1 Data model suggestion

```text
profiles(id, graduation_year, degree, target_role, start_date, hours_per_week, timezone)
phases(id, name, sequence, suggested_months, prerequisite_ids, readiness_gate)
modules(id, phase_id, subject_id, title, prerequisite_ids, estimated_hours, objective)
resources(id, title, url, access, purpose, verified_at, source_provider)
module_resources(module_id, resource_id, assigned_sections, priority)
module_progress(user_id, module_id, status, started_at, completed_at, evidence_link)
reviews(id, user_id, module_id, due_date, last_result, mistake_tag)
projects(id, title, milestones, tech_stack, success_criteria)
applications(id, user_id, company, role, url, eligibility, status, follow_up_at)
monthly_reviews(id, user_id, month, self_assessment, next_actions)
```

**Website implementation guardrails:** link to original course pages (do not scrape/rehost protected course videos); follow resource license terms; provide external links with descriptive titles; treat CGPA cutoffs and job availability as dynamic; clearly label [PLAN] vs [OFFICIAL] vs [PREDICTION]; never claim employer endorsements. Courses and tools can change after Oct 2026.

---

# PART XI — MAINTENANCE AND SOURCES

## 24. When to update this roadmap

- **Every month:** your actual progress, course links that failed, DSA error patterns, projects and applications.
- **Every quarter:** new internship/new-grad job descriptions, third-year eligibility, interview policy (including AI), career pages and semester dates.
- **Before each application:** graduation year, region, degree, documentation, CGPA/backlogs if specified, current role requirements, AI rules, visa/work authorization and deadline.
- **After every interview:** identify the specific gap, then change only the needed module; do not rebuild your learning plan from zero.

## 25. Primary evidence that shaped the recommendations

1. [Amazon India SDE intern listing — required C++/Python/DSA plus preferred engineering practices and AI tools](https://www.amazon.jobs/en/jobs/10513277/software-development-engineer-intern-may-2027-2-month-amazon-university-talent-acquisition) (example role for 2027 grads, not a future opening promise).
2. [Amazon India six-month SDE intern listing — CS fundamentals and graduation-year limitations](https://www.amazon.jobs/en/jobs/10541345/sde-i-intern-amazon-university-talent-acquisition).
3. [Microsoft technical interviewing — coding, algorithms, data structures, testing, problem-solving, design](https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing).
4. [Microsoft internship eligibility — India university interns in pre-final year](https://careers.microsoft.com/v2/global/en/internship_eligibility).
5. [Atlassian early careers — published India recruiting calendar](https://www.atlassian.com/company/careers/earlycareers).
6. [Canva engineering — AI-assisted technical interviews and code comprehension](https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/).
7. [Meta public announcement — selected AI-enabled coding pilot](https://www.linkedin.com/posts/meta_metacareers-interviewing-softwareengineering-activity-7386046074240737280-wnwA).
8. [Google 2027 Singapore software intern example — specific coding/Unix/DSA qualifications, geography clearly identified](https://www.google.com/about/careers/applications/jobs/results/104489346874122950).
9. [MIT student resume samples](https://capd.mit.edu/resources/sample-resumes/).
10. Official course documentation in **Part VII (Resources R01–R41)**.

**Uncertainties intentionally left visible:** exact future campus company roster, your institution's placement cutoffs, your real CGPA, confirmed semester calendar, number of internships open for 2028/2029, each employer's assessment format, and any changes in AI-permitted interview policy. These must be verified when they become knowable.

## 26. One-page final operating plan

1. **Dec 16, 2026:** begin C++ and computing basics—small daily blocks.
2. **Dec–Mar:** learn independent programming, pointers/STL basics, complexity, Git and debugging. **Don't rush.**
3. **Apr–Jun:** grow DSA steadily; add SQL, Python and first API; prepare truthful resume.
4. **Jul–Dec 2027:** **apply to eligible 2028 internships** while building a tested FastAPI/PostgreSQL project and studying CS fundamentals.
5. **Jan–Jun 2028:** strengthen algorithms, mocks and projects; pursue paid engineering internships or credible alternatives.
6. **Jul–Dec 2028:** prioritize actual campus/off-campus 2029 graduate roles, timed interviews, and targeted revisions.
7. **Throughout:** protect CGPA and academics, revise continuously, do not use unauthorized AI in assessments, and judge progress by independent capability and real shipped work.

> **Your ambition is top-tier; your daily plan should be normal-student sustainable.** A steady 12–15 hours/week over many semesters, paired with academic eligibility and honest engineering projects, is a much stronger strategy than a short burst of 6-hour days and abandoning everything after exams.

*End of canonical source — revise version/date when updating substantial facts.*
