# Content Mapping Specification
**Authoritative Source:** `content/source/Product_Company_Career_Roadmap_2026-2029_SOURCE.md`  
**System Name:** FOUNDATION — Day-Based Career Preparation Operating System  
**Version:** 1.0.0

---

## 1. Governing Transformation Principles

The master source roadmap contains chronological date estimates (e.g. "Dec 2026 - Mar 2027", "Semester 3-1", "W01 - Dec 16-22"). 
**Per non-negotiable requirements:**
1. **Zero Calendar Dates in Learner UI:** All dates, overdue states, and countdown clocks are removed from the learner curriculum.
2. **Sequential Progression:** Progress is governed by `Track → Phase → Module → Learning Day (01, 02, 03...) → Task → Review → Phase Readiness Gate`.
3. **Sequence Index:** The integer `learning_day_index` is incremented exclusively upon explicit completion of mandatory daily work. Pauses or breaks incur zero overdue debt.
4. **Academic Eligibility:** Academic terms (e.g., 2-2, 3-1, 3-2, 4-1) denote student eligibility milestones, never rigid temporal deadlines.

---

## 2. Phase Taxonomy and Structure (`P0` through `P8`)

| Phase ID | Code | Phase Name | Primary Subject Focus | Approx Effort | Prerequisite | Milestone Readiness Gate |
|---|---|---|---|---|---|---|
| `P0` | `P0` | Orientation & Absolute Programming Fundamentals | C++, Computer Architecture, Program Execution | ~70–90h | None | **Gate P0:** 35-min array stats tool from blank editor + explanation of compilation pipeline. |
| `P1` | `P1` | C++ Depth, Problem-Solving & Developer Tools | C++ STL, Pointers/Refs, Big-O, Git/CLI | ~90–110h | `P0` Gate | **Gate P1:** Binary search + recursion explanation + Git branch/PR + pointer vs ref. |
| `P2` | `P2` | DSA Foundation, SQL & Python Entry | DSA (Arrays to Linked Lists), PostgreSQL, Python Basics, HTTP APIs | ~140–180h | `P1` Gate | **Gate P2:** 60-90 solved DSA problems + 15 raw SQL queries + working CRUD REST API. |
| `P3` | `P3` | Internship-Ready Engineering | Intermediate DSA (Trees/Heaps), FastAPI, SQLAlchemy, OS Processes/Threads | ~140–170h | `P2` Gate | **Gate P3:** Project A (Task API) with auth + tests + 100-140 DSA problems. |
| `P4` | `P4` | Interview Strength & Deep Project Evidence | Graphs, DP, Advanced DBMS (Indexing/ACID), OS & Networks | ~120–160h | `P3` Gate | **Gate P4:** Project B (CourseCairn) + timed Mediums + OS/DBMS deep dive. |
| `P5` | `P5` | Internship Interview Execution | Timed Mocks, Full DSA Sheet Revision, System Reliability, OA Preparation | ~180–260h | `P3`/`P4` | **Gate P5:** OA and mock interview readiness; 150-220 DSA problems; project defense. |
| `P6` | `P6` | New-Grad Placement Readiness | Full Placement Sprint, Timed Assessments, System Design Basics, Tailored Apps | 12–15h/wk | `P5` Gate | **Gate P6:** Real interviews taken, 200-300 solved problems, system design basics. |
| `P7` | `P7` | Advanced Engineering & AI Systems (Elective) | Code Comprehension, AI Debugging, LLM RAG Systems, Distributed Concepts | Elective | `P4` Gate | **Gate P7:** Project C (AI Codebase Assistant) with measured retrieval metrics. |
| `P8` | `P8` | Graduation & Transition to Industry | Capstone, Production Onboarding, Tech Stack Specialization | Ongoing | `P6` Gate | **Gate P8:** Offer conversion pipeline + degree completion. |

---

## 3. Subject Identifiers and Skill Taxonomies

1. **`CPP` — C++ Programming & Systems Language**
   - `CPP-01`: Compilation, syntax, values, types, I/O
   - `CPP-02`: Conditionals, loops, functions, scope
   - `CPP-03`: Arrays, strings, references, pointers
   - `CPP-04`: STL containers (`vector`, `pair`, `map`, `unordered_map`, `set`, `stack`, `queue`)
   - `CPP-05`: Recursion, call stack, backtracking intuition
   - `CPP-06`: Classes, constructors, encapsulation, composition
   - `CPP-07`: Debugging, sanitizers, terminal profiling

2. **`DSA` — Algorithms & Data Structures**
   - `DSA-01` to `DSA-22`: Complexity, Arrays, Sorting/Binary Search, Hashing, Prefix Sums, Two Pointers, Sliding Window, Linked Lists, Stack/Queue, Recursion/Backtracking, Trees/BST, Heap, Greedy, Intervals, Graphs (BFS/DFS, Topological, Dijkstra, DSU), DP (1D, Grid, Knapsack, LIS), Tries/Bits, Timed Mixed Practice.

3. **`DB` — Database Management Systems & SQL**
   - `DB-01` to `DB-07`: Relational model, interactive SQL queries, JOINs & subqueries, normalization (1NF-3NF), B-tree indexes & EXPLAIN, ACID transactions & locks, migrations & production engineering.

4. **`CS` — Computer Systems Foundations**
   - `CS-OOP-01` to `02`: Object-oriented design & composition
   - `CS-OS-01` to `03`: Processes, threads, context switching, scheduling, mutexes, deadlocks, virtual memory
   - `CS-NET-01` to `03`: TCP/IP, UDP, DNS, HTTP/HTTPS, caching, timeouts
   - `CS-SD-01`: System design fundamentals (load balancers, caches, queues, replication)

5. **`BE` — Backend Software Engineering**
   - `BE-01` to `BE-08`: Python fundamentals, HTTP/REST, FastAPI routing/validation, PostgreSQL & SQLAlchemy ORM, JWT auth & owner authorization, pytest automation, Docker Compose/CI, query optimization & OWASP security.

6. **`AI` — Applied AI & Developer Tooling**
   - `AI-01` to `AI-06`: Code comprehension, AI bug hunting, test generation, LLM tokenomics & RAG architectures, repo documentation assistant, prompt engineering evaluation.

---

## 4. Resource Catalog Mapping (`R01` through `R41`)

All 41 canonical resources from the source document are preserved with exact stable codes, direct URLs, verified usage instructions, and assigned sections.

- `R01`: CS50x 2026 (Weeks 0-5)
- `R02`: CS50 Week 0 (Computational thinking & binary)
- `R03`: LearnCpp Complete Course (Chapters 0-16)
- `R04`: LearnCpp 1.1 (First program syntax)
- `R05`: USACO Bronze Guide (Complexity, Data structures)
- `R06`: USACO Intro to Data Structures (STL containers)
- `R07`: Striver A2Z DSA Sheet (Free core curriculum)
- `R08`: CSES Problem Set (Introductory, Sorting/Searching, Graph, DP)
- `R09`: NeetCode 150 Roadmap (Revision & Gap analysis)
- `R10`: LeetCode 75 (Timed mixed preparation)
- `R11`: MIT Missing Semester 2026 (Shell, Git, Debugging, AI code quality)
- `R12`: GitHub Intro Skill (Interactive repository workflow)
- `R13`: GitHub Skills (Actions, Markdown, PR workflows)
- `R14`: Pro Git (Chapters 1-3)
- `R15`: SQLBolt (Interactive SQL exercises)
- `R16`: PostgreSQL Official Tutorial (Getting Started through Transactions)
- `R17`: CMU 15-445 Database Systems (Lectures #01, #02, #08-09, #12, #17)
- `R18`: Python Official Tutorial (Control flow, data structures, modules)
- `R19`: MDN HTTP Overview (Client-server, request/response, verbs, status codes)
- `R20`: FastAPI Official Tutorial (Routes, parameters, dependencies, security)
- `R21`: FastAPI First Steps (Minimal API setup)
- `R22`: SQLAlchemy Unified Tutorial (Core + ORM patterns)
- `R23`: SQLAlchemy ORM Quick Start (Declarative mapping)
- `R24`: pytest Getting Started (Assertions and test runners)
- `R25`: FastAPI Testing (TestClient & integration tests)
- `R26`: OSTEP: Operating Systems Three Easy Pieces (Processes, Memory, Concurrency)
- `R27`: Cloudflare DNS Explainer (Name resolution mechanics)
- `R28`: Stanford CS144 Computer Networking (Selected lecture notes)
- `R29`: Docker Compose Quickstart (Multi-container orchestration)
- `R30`: GitHub Actions Quickstart (Automated CI pipelines)
- `R31`: OWASP Top 10:2025 (API security standards)
- `R32`: System Design Primer (Scalability fundamentals)
- `R33`: MIT Student Sample Resumes (CS undergraduate templates)
- `R34`: MIT CAPD Resume Guide (Action verbs & quantifiable metrics)
- `R35`: Atlassian Early Careers Portal (Verified early-career cycle)
- `R36`: Amazon SDE Intern Guidance (Job specification benchmarking)
- `R37`: Microsoft Technical Interview Tips (Official assessment evaluation criteria)
- `R38`: Microsoft India Intern Eligibility (Pre-final year criteria)
- `R39`: Canva AI Interview Engineering Blog (AI tool usage in assessments)
- `R40`: Meta Technical Interview Pilot (Authorized AI evaluation guidelines)
- `R41`: Roadmap.sh Backend Projects (Practical backend project prompts)

---

## 5. Day Structure Breakdown

Each learning day adheres to the canonical 4-part structure:
1. **One-Sentence Goal:** Actionable statement of capability.
2. **Learn Block (20–35m):** Exact resource URL, specific chapters/sections, purpose, and skip recommendations.
3. **Practice Block (35–55m):** Concrete programming/SQL exercises with expected output and constraints.
4. **Apply / Explain Block (15–25m):** Code commit, technical explanation, schema snippet, or error diagnosis.
5. **Review Block (10–15m):** Flashcard recall prompt from spaced repetition queue.
6. **Finish Day Gate:** Required outcome validation before sequence advancement.
