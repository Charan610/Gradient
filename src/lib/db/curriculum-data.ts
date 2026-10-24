// ==============================================================================
// CANONICAL CURRICULUM DATA OF RECORD
// Source: content/source/Product_Company_Career_Roadmap_2026-2029_SOURCE.md
// ==============================================================================

import {
  ResourceItem,
  SubjectItem,
  PhaseItem,
  ModuleItem,
  LearningDay,
  ProjectTemplate
} from './types';

export const APP_NAME = 'FOUNDATION';

// ------------------------------------------------------------------------------
// 1. ANNOTATED RESOURCE DIRECTORY (R01 - R41)
// ------------------------------------------------------------------------------
export const RESOURCES: ResourceItem[] = [
  {
    id: 'R01',
    stable_code: 'R01',
    title: 'Harvard CS50x 2026',
    url: 'https://cs50.harvard.edu/x/',
    provider: 'Harvard University',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Week 0 computing, Week 1 C, Weeks 2–5 algorithms/memory/data structures, later Python/SQL.',
    avoid_notes: "Don't complete all assignments plus full C++ curriculum concurrently."
  },
  {
    id: 'R02',
    stable_code: 'R02',
    title: 'Harvard CS50x — Week 0',
    url: 'https://cs50.harvard.edu/x/weeks/0/',
    provider: 'Harvard University',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Binary representation, algorithmic thinking, pseudocode, conditionals, loops.',
    avoid_notes: 'Scratch programming is optional after conceptual learning.'
  },
  {
    id: 'R03',
    stable_code: 'R03',
    title: 'LearnCpp.com Complete Tutorial Index',
    url: 'https://www.learncpp.com/',
    provider: 'LearnCpp.com',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Primary C++ textbook from Chapter 0 through Chapter 16.',
    avoid_notes: 'Avoid obscure advanced C++ features (metaprogramming, custom allocators) initially.'
  },
  {
    id: 'R04',
    stable_code: 'R04',
    title: 'LearnCpp 1.1 — Structure of a Program',
    url: 'https://www.learncpp.com/cpp-tutorial/statements-and-the-structure-of-a-program/',
    provider: 'LearnCpp.com',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Statements, functions, main(), compilation and execution overview.',
    avoid_notes: 'Not enough by itself; continue through chapter 1 sequential lessons.'
  },
  {
    id: 'R05',
    stable_code: 'R05',
    title: 'USACO Guide — Bronze',
    url: 'https://usaco.guide/bronze',
    provider: 'USACO Guide',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Time complexity, data structures introduction, simulation, sorting, greedy.',
    avoid_notes: 'Geometry and contest-specific tricks not required early.'
  },
  {
    id: 'R06',
    stable_code: 'R06',
    title: 'USACO Guide — Introduction to Data Structures',
    url: 'https://usaco.guide/bronze/intro-ds',
    provider: 'USACO Guide',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'std::vector, std::pair, std::map, tuples and comparative container operations.',
    avoid_notes: 'Not a substitute for full algorithmic problem solving.'
  },
  {
    id: 'R07',
    stable_code: 'R07',
    title: 'Striver A2Z DSA Sheet',
    url: 'https://takeuforward.org/prep-hub/strivers-a2z-dsa-sheet',
    provider: 'takeUforward',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Primary structured DSA curriculum spine from Phase 2 onward.',
    avoid_notes: 'Paid video subscriptions and planners are completely unnecessary.'
  },
  {
    id: 'R08',
    stable_code: 'R08',
    title: 'CSES Problem Set',
    url: 'https://cses.fi/problemset',
    provider: 'University of Helsinki',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Introductory Problems, Sorting and Searching, Graph Algorithms, Dynamic Programming.',
    avoid_notes: "Don't tackle advanced DP or tree algorithms in Phase 0."
  },
  {
    id: 'R09',
    stable_code: 'R09',
    title: 'NeetCode 150 Roadmap',
    url: 'https://neetcode.io/roadmap/',
    provider: 'NeetCode',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Topic dependencies, 150 structured questions, clean C++ and Python patterns.',
    avoid_notes: 'Avoid running as a second simultaneous sheet; use for gap detection.'
  },
  {
    id: 'R10',
    stable_code: 'R10',
    title: 'LeetCode 75 Study Plan',
    url: 'https://leetcode.com/studyplan/leetcode-75/',
    provider: 'LeetCode',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: '75 high-yield interview questions for timed mixed revision in Phase 5 and 6.',
    avoid_notes: 'Not an initial teaching curriculum for beginners.'
  },
  {
    id: 'R11',
    stable_code: 'R11',
    title: 'MIT Missing Semester of Your CS Education (2026)',
    url: 'https://missing.csail.mit.edu/2026/',
    provider: 'MIT CSAIL',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Shell, environment, Git, debugging, profiling, code quality, agentic workflows.',
    avoid_notes: 'Skip advanced metaprogramming and agentic coding until Phase 7.'
  },
  {
    id: 'R12',
    stable_code: 'R12',
    title: 'GitHub Skills: Introduction to GitHub',
    url: 'https://github.com/skills/introduction-to-github',
    provider: 'GitHub Skills',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Interactive branch, commit, pull request, review, and merge exercise.',
    avoid_notes: 'No need to chase artificial green contribution streaks.'
  },
  {
    id: 'R13',
    stable_code: 'R13',
    title: 'GitHub Skills Catalog',
    url: 'https://learn.github.com/skills',
    provider: 'GitHub',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Git, Markdown, PRs, and GitHub Actions short tutorials.',
    avoid_notes: "Don't collect badges for vanity; complete only as project requires."
  },
  {
    id: 'R14',
    stable_code: 'R14',
    title: 'Pro Git Book (Second Edition)',
    url: 'https://git-scm.com/book/en/v2',
    provider: 'Scott Chacon & Ben Straub',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Authoritative Git reference; consult Chapters 1 through 3 for fundamentals.',
    avoid_notes: 'Deep plumbing internals not required for undergraduates.'
  },
  {
    id: 'R15',
    stable_code: 'R15',
    title: 'SQLBolt — Learn SQL Interactively',
    url: 'https://sqlbolt.com/',
    provider: 'SQLBolt',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Interactive browser-based SQL lessons from SELECT to JOINs and schema changes.',
    avoid_notes: 'SQLite quirks may differ slightly from PostgreSQL production syntax.'
  },
  {
    id: 'R16',
    stable_code: 'R16',
    title: 'PostgreSQL Official Tutorial',
    url: 'https://www.postgresql.org/docs/current/tutorial.html',
    provider: 'PostgreSQL Global Development Group',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Getting Started, SQL Language, Advanced Features, Foreign Keys, Transactions.',
    avoid_notes: 'Run every query locally in psql or TablePlus rather than skimming.'
  },
  {
    id: 'R17',
    stable_code: 'R17',
    title: 'CMU 15-445/645 Database Systems (Fall 2025)',
    url: 'https://15445.courses.cs.cmu.edu/fall2025/schedule.html',
    provider: 'Carnegie Mellon University',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Lectures #01 Relational, #02 Modern SQL, #08-09 Indexes, #12 Joins, #17 Concurrency.',
    avoid_notes: 'The entire C++ database engine project is excessive for SDE intern prep.'
  },
  {
    id: 'R18',
    stable_code: 'R18',
    title: 'Python Official Tutorial',
    url: 'https://docs.python.org/3/tutorial/',
    provider: 'Python Software Foundation',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Syntax, control flow, data structures, modules, exceptions, classes.',
    avoid_notes: 'Assumes programming fundamentals: start Python in Phase 2, not Phase 0.'
  },
  {
    id: 'R19',
    stable_code: 'R19',
    title: 'MDN Web Docs: An Overview of HTTP',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview',
    provider: 'Mozilla Developer Network',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Client-server model, HTTP messages, request methods, status codes.',
    avoid_notes: "Don't memorize all 100+ HTTP headers; focus on 200, 201, 400, 401, 403, 404, 500."
  },
  {
    id: 'R20',
    stable_code: 'R20',
    title: 'FastAPI Official Tutorial & User Guide',
    url: 'https://fastapi.tiangolo.com/tutorial/',
    provider: 'Sebastián Ramírez',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Path/query params, request body, dependencies, security, bigger applications.',
    avoid_notes: 'Type every endpoint yourself; do not copy paste without dry-running.'
  },
  {
    id: 'R21',
    stable_code: 'R21',
    title: 'FastAPI Tutorial: First Steps',
    url: 'https://fastapi.tiangolo.com/tutorial/first-steps/',
    provider: 'Sebastián Ramírez',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Minimal API setup, operation decorators, uvicorn server.',
    avoid_notes: 'A "Hello World" API is not a resume project.'
  },
  {
    id: 'R22',
    stable_code: 'R22',
    title: 'SQLAlchemy Unified Tutorial',
    url: 'https://docs.sqlalchemy.org/en/21/tutorial/',
    provider: 'SQLAlchemy Authors',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Connections, transactions, metadata, declarative models, CRUD operations.',
    avoid_notes: 'Using an ORM does not eliminate the need to understand raw SQL and EXPLAIN.'
  },
  {
    id: 'R23',
    stable_code: 'R23',
    title: 'SQLAlchemy ORM Quick Start',
    url: 'https://docs.sqlalchemy.org/en/21/orm/quickstart.html',
    provider: 'SQLAlchemy Authors',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Mapped classes, relationships, session management, inserting and querying.',
    avoid_notes: 'Verify compatibility with your chosen PostgreSQL client library.'
  },
  {
    id: 'R24',
    stable_code: 'R24',
    title: 'pytest: Getting Started',
    url: 'https://pytest.org/en/latest/getting-started.html',
    provider: 'pytest Development Team',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Install and run pytest, writing assertion tests, exception handling.',
    avoid_notes: 'Green test suite with zero meaningful assertions is worthless.'
  },
  {
    id: 'R25',
    stable_code: 'R25',
    title: 'FastAPI Testing Guide',
    url: 'https://fastapi.tiangolo.com/tutorial/testing/',
    provider: 'Sebastián Ramírez',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'TestClient with HTTPX, fixture setup, testing status codes and response JSON.',
    avoid_notes: 'Be sure to test authentication failures and invalid payloads, not only 200 OK.'
  },
  {
    id: 'R26',
    stable_code: 'R26',
    title: 'OSTEP: Operating Systems Three Easy Pieces',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    provider: 'Remzi & Andrea Arpaci-Dusseau',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Processes, scheduling, memory virtualization, locks, deadlocks, persistence.',
    avoid_notes: 'Start with concepts and chapter summaries before attempting complex labs.'
  },
  {
    id: 'R27',
    stable_code: 'R27',
    title: 'Cloudflare Learning: What is DNS?',
    url: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
    provider: 'Cloudflare',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'DNS resolvers, root servers, TLDs, authoritative nameservers, caching.',
    avoid_notes: 'Not a complete networking textbook; use for the classic "URL in browser" question.'
  },
  {
    id: 'R28',
    stable_code: 'R28',
    title: 'Stanford CS144: Introduction to Computer Networking',
    url: 'https://web.stanford.edu/class/cs144/',
    provider: 'Stanford University',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Packet switching, layering, IP datagrams, TCP reliability, flow/congestion control.',
    avoid_notes: 'The lab implementing TCP in C++ is optional differentiation; study concepts first.'
  },
  {
    id: 'R29',
    stable_code: 'R29',
    title: 'Docker Compose Quickstart',
    url: 'https://docs.docker.com/compose/gettingstarted/',
    provider: 'Docker Inc.',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'compose.yaml definition, multi-container app, running API + PostgreSQL locally.',
    avoid_notes: 'Defer if local PostgreSQL is already functioning cleanly.'
  },
  {
    id: 'R30',
    stable_code: 'R30',
    title: 'GitHub Actions Quickstart',
    url: 'https://docs.github.com/en/actions/get-started/quickstart',
    provider: 'GitHub',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Continuous integration workflow, running pytest automatically on push and PR.',
    avoid_notes: 'Avoid consuming hosted runner quotas with redundant matrix builds.'
  },
  {
    id: 'R31',
    stable_code: 'R31',
    title: 'OWASP Top 10:2025 API Security',
    url: 'https://top10.owasp.org/2025/',
    provider: 'OWASP Foundation',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Broken object level authorization (BOLA), injection, security misconfiguration.',
    avoid_notes: 'Threat awareness guide; use to audit your own FastAPI code.'
  },
  {
    id: 'R32',
    stable_code: 'R32',
    title: 'The System Design Primer',
    url: 'https://github.com/donnemartin/system-design-primer',
    provider: 'Donne Martin',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Scalability patterns, caching, queues, replication, load balancing.',
    avoid_notes: 'Do not memorize senior distributed systems designs for 2nd/3rd year intern rounds.'
  },
  {
    id: 'R33',
    stable_code: 'R33',
    title: 'MIT CAPD Sample Resumes',
    url: 'https://capd.mit.edu/resources/sample-resumes/',
    provider: 'MIT Career Advising & Professional Development',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Authentic undergraduate CS and math sample resumes with clean formatting.',
    avoid_notes: 'Use as a formatting guide; never copy project descriptions verbatim.'
  },
  {
    id: 'R34',
    stable_code: 'R34',
    title: 'MIT CAPD Resume Guidance',
    url: 'https://capd.mit.edu/channels/resumes/',
    provider: 'MIT CAPD',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Skill evidence, strong action verbs, quantifiable project results.',
    avoid_notes: 'Never fabricate metrics or user counts.'
  },
  {
    id: 'R35',
    stable_code: 'R35',
    title: 'Atlassian Early Careers Portal',
    url: 'https://www.atlassian.com/company/careers/earlycareers',
    provider: 'Atlassian',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Published India recruiting cycle begins in July for summer internships.',
    avoid_notes: 'Specific opening criteria always supersede landing page generalizations.'
  },
  {
    id: 'R36',
    stable_code: 'R36',
    title: 'Amazon University Talent Acquisition SDE Intern Job Specification',
    url: 'https://www.amazon.jobs/en/jobs/10513277/software-development-engineer-intern-may-2027-2-month-amazon-university-talent-acquisition',
    provider: 'Amazon',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Demonstrates real employer expectations: C++/Python, OOP, debugging, Git.',
    avoid_notes: 'This example specifically targets 2027 grads; apply only to your eligible batch.'
  },
  {
    id: 'R37',
    stable_code: 'R37',
    title: 'Microsoft Technical Interviewing Tips',
    url: 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing',
    provider: 'Microsoft',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Explicit evaluation criteria: problem solving, testing, complexity, design.',
    avoid_notes: 'Expectations adapt depending on role and academic level.'
  },
  {
    id: 'R38',
    stable_code: 'R38',
    title: 'Microsoft India University Internship Eligibility',
    url: 'https://careers.microsoft.com/v2/global/en/internship_eligibility',
    provider: 'Microsoft',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Pre-final year university internship eligibility policies.',
    avoid_notes: 'Policies may adjust year-over-year; verify listing when applying.'
  },
  {
    id: 'R39',
    stable_code: 'R39',
    title: 'Canva Engineering: AI in Technical Interviews',
    url: 'https://www.canva.dev/blog/engineering/yes-you-can-use-ai-in-our-interviews/',
    provider: 'Canva',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Evaluating code comprehension, critical verification, and responsible tool use.',
    avoid_notes: 'Not an industry-wide rule; follow exact candidate guidelines for each company.'
  },
  {
    id: 'R40',
    stable_code: 'R40',
    title: 'Meta SDE Interview Pilot Announcement',
    url: 'https://www.linkedin.com/posts/meta_metacareers-interviewing-softwareengineering-activity-7386046074240737280-wnwA',
    provider: 'Meta Careers',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Controlled pilot exploring authorized AI tools in SWE interviews.',
    avoid_notes: 'Traditional algorithm interviews remain the dominant baseline across tech.'
  },
  {
    id: 'R41',
    stable_code: 'R41',
    title: 'Roadmap.sh Backend Projects',
    url: 'https://roadmap.sh/backend/projects',
    provider: 'roadmap.sh',
    access_level: 'free',
    verification_status: 'checked',
    source_confidence: 'official',
    source_notes: 'Task API, URL shortener, caching proxy, e-commerce API project specifications.',
    avoid_notes: 'Use as inspiration; your implementation must be tested, documented, and your own.'
  }
];

// ------------------------------------------------------------------------------
// 2. SUBJECTS
// ------------------------------------------------------------------------------
export const SUBJECTS: SubjectItem[] = [
  {
    id: 'CPP',
    slug: 'cpp',
    title: 'C++ Systems & Programming Logic',
    description: 'Compilation pipeline, pointer mechanics, references, STL containers, OOP and debugging.'
  },
  {
    id: 'DSA',
    slug: 'dsa',
    title: 'Algorithms & Data Structures',
    description: 'Time complexity, arrays, binary search, trees, graphs, dynamic programming, and interview patterns.'
  },
  {
    id: 'DB',
    slug: 'dbms',
    title: 'DBMS & PostgreSQL Engineering',
    description: 'Relational data modeling, raw SQL queries, JOINs, indexing mechanics, transactions, and ACID.'
  },
  {
    id: 'CS',
    slug: 'cs-core',
    title: 'Core Computer Science Foundations',
    description: 'Operating systems (processes, threads, virtual memory) and computer networking (TCP/IP, HTTP, DNS).'
  },
  {
    id: 'BE',
    slug: 'backend',
    title: 'Backend Software Engineering',
    description: 'Python, FastAPI, SQLAlchemy ORM, authentication, pytest suites, Docker, and OWASP security.'
  },
  {
    id: 'AI',
    slug: 'ai-engineering',
    title: 'Applied AI & Code Intelligence',
    description: 'Code comprehension, verifying LLM outputs, RAG retrieval systems, and repo search.'
  }
];

// ------------------------------------------------------------------------------
// 3. NINE PHASES (P0 - P8) WITH GATES
// ------------------------------------------------------------------------------
export const PHASES: PhaseItem[] = [
  {
    id: 'P0',
    track_id: 'sde-foundation',
    phase_code: 'P0',
    order_index: 0,
    title: 'Orientation & Absolute Programming Fundamentals',
    description: 'Computer architecture basics, compiler vs interpreter, C++ syntax, loops, functions, arrays, and basic problem solving.',
    estimated_hours: '70–90 hours',
    approx_study_days: '40–50 active days',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P0',
      phase_id: 'P0',
      title: 'Phase 0 Readiness Gate: Blank-Editor Array Stats Tool',
      pass_criteria: 'Write a complete array stats utility from a blank editor in under 35 minutes with functions, validation, and explain the compilation pipeline aloud.',
      instructions: 'Open an empty file without AI assistance. Implement functions to calculate minimum, maximum, average, and frequency table for user input. Explain what happens from source code to compiler, linker, and executable.',
      time_limit_minutes: 35,
      rubric_items: [
        { id: 'p0-r1', criterion: 'Implements correct min, max, and average calculations', weight: 30 },
        { id: 'p0-r2', criterion: 'Clean function decomposition with appropriate parameter passing', weight: 25 },
        { id: 'p0-r3', criterion: 'Validates input edge cases (empty input, negative integers)', weight: 20 },
        { id: 'p0-r4', criterion: 'Articulates source -> compiler -> linker -> executable workflow', weight: 25 }
      ],
      suggested_review_module_ids: ['P0.01', 'P0.03', 'P0.04']
    }
  },
  {
    id: 'P1',
    track_id: 'sde-foundation',
    phase_code: 'P1',
    order_index: 1,
    title: 'C++ Depth, Problem-Solving & Developer Tools',
    description: 'Pointers and references, stack vs heap, STL containers, recursion intuition, Big-O complexity, Git and GitHub PR workflows.',
    estimated_hours: '90–110 hours',
    approx_study_days: '50–60 active days',
    prerequisite_phase_id: 'P0',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P1',
      phase_id: 'P1',
      title: 'Phase 1 Readiness Gate: Binary Search & Developer Workflow',
      pass_criteria: 'Explain binary search complexity, implement recursive solution, demonstrate Git branch/PR merge, and contrast pointers vs references.',
      instructions: 'Implement binary search from memory. Dry-run recursion call stack. Walk through a Git feature branch, commit, PR, and clean rebase/merge.',
      time_limit_minutes: 40,
      rubric_items: [
        { id: 'p1-r1', criterion: 'Flawless binary search implementation with boundary condition analysis', weight: 30 },
        { id: 'p1-r2', criterion: 'Accurate pointer vs reference explanation with stack memory diagram', weight: 25 },
        { id: 'p1-r3', criterion: 'Successful Git branch, PR creation, and clean merge demonstration', weight: 25 },
        { id: 'p1-r4', criterion: 'Working C++ CLI task tracker repository with commit history', weight: 20 }
      ],
      suggested_review_module_ids: ['P1.01', 'P1.03', 'P1.05']
    }
  },
  {
    id: 'P2',
    track_id: 'sde-foundation',
    phase_code: 'P2',
    order_index: 2,
    title: 'DSA Foundation, SQL & Python Entry',
    description: 'Arrays, two pointers, sliding window, linked lists, stacks/queues, relational SQL queries, Python syntax, and basic HTTP REST APIs.',
    estimated_hours: '140–180 hours',
    approx_study_days: '75–90 active days',
    prerequisite_phase_id: 'P1',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P2',
      phase_id: 'P2',
      title: 'Phase 2 Readiness Gate: 60-90 DSA Problems + Raw SQL & API',
      pass_criteria: 'Solve unseen Easy/Medium array/hashing problems, write 10-15 self-written multi-table SQL queries, and demo CRUD REST API.',
      instructions: 'Complete a timed problem solving session. Write relational queries across users and tasks without ORM. Demonstrate GET/POST/PATCH/DELETE endpoints in FastAPI.',
      time_limit_minutes: 60,
      rubric_items: [
        { id: 'p2-r1', criterion: 'Independently solves unseen two-pointer/hashing challenge under 30 mins', weight: 35 },
        { id: 'p2-r2', criterion: 'Writes complex JOIN, aggregation, and subquery without assistance', weight: 30 },
        { id: 'p2-r3', criterion: 'Demonstrates working Task API responding to curl/HTTP requests', weight: 25 },
        { id: 'p2-r4', criterion: 'One-page student resume draft and initial application tracker setup', weight: 10 }
      ],
      suggested_review_module_ids: ['P2.01', 'P2.04', 'P2.06']
    }
  },
  {
    id: 'P3',
    track_id: 'sde-foundation',
    phase_code: 'P3',
    order_index: 3,
    title: 'Internship-Ready Engineering',
    description: 'Trees, BST, heaps, FastAPI modular routers, PostgreSQL with SQLAlchemy, pytest automated testing, and OS processes/threads.',
    estimated_hours: '140–170 hours',
    approx_study_days: '70–85 active days',
    prerequisite_phase_id: 'P2',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P3',
      phase_id: 'P3',
      title: 'Phase 3 Readiness Gate: Project A Architecture & Tree Traversal',
      pass_criteria: 'Defend Project A (Task API) with 20+ tests, explain one index, and solve a timed tree traversal/BST validation challenge.',
      instructions: 'Walk through Project A codebase, explain owner-based authorization and how password hashing works. Run test suite. Code an in-order tree traversal from memory.',
      time_limit_minutes: 60,
      rubric_items: [
        { id: 'p3-r1', criterion: 'Passes test suite with 20+ tests covering auth and failure scenarios', weight: 35 },
        { id: 'p3-r2', criterion: 'Tree / BST traversal implementation with O(N) time and O(H) space', weight: 30 },
        { id: 'p3-r3', criterion: 'Explains database indexing, foreign key constraints, and migrations', weight: 20 },
        { id: 'p3-r4', criterion: 'Explains process vs thread memory space and context switching', weight: 15 }
      ],
      suggested_review_module_ids: ['P3.01', 'P3.03', 'P3.05']
    }
  },
  {
    id: 'P4',
    track_id: 'sde-foundation',
    phase_code: 'P4',
    order_index: 4,
    title: 'Interview Strength & Deep Project Evidence',
    description: 'Graph algorithms (BFS, DFS, Dijkstra), dynamic programming patterns, CMU database indexing/ACID, OS concurrency, and Project B.',
    estimated_hours: '120–160 hours',
    approx_study_days: '60–80 active days',
    prerequisite_phase_id: 'P3',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P4',
      phase_id: 'P4',
      title: 'Phase 4 Readiness Gate: Graph/DP Mastery & Project B Defense',
      pass_criteria: 'Solve graph traversal/1-D DP problem, explain ACID transaction isolation and TCP handshake, and demonstrate Project B.',
      instructions: 'Implement BFS/DFS on grid or graph. Explain DP state transition. Defend Project B schema and API design with trade-off analysis.',
      time_limit_minutes: 60,
      rubric_items: [
        { id: 'p4-r1', criterion: 'Solves graph traversal with visited array and cycle detection', weight: 30 },
        { id: 'p4-r2', criterion: 'Formulates memoized DP solution and derives space/time complexity', weight: 25 },
        { id: 'p4-r3', criterion: 'Explains ACID, transaction rollbacks, race conditions, and mutexes', weight: 25 },
        { id: 'p4-r4', criterion: 'Project B production backend demo with comprehensive README', weight: 20 }
      ],
      suggested_review_module_ids: ['P4.01', 'P4.02', 'P4.03']
    }
  },
  {
    id: 'P5',
    track_id: 'sde-foundation',
    phase_code: 'P5',
    order_index: 5,
    title: 'Internship Interview Execution',
    description: 'Timed full-length mock interviews, online assessment simulations, system reliability, and consistent application tracking.',
    estimated_hours: '180–260 hours',
    approx_study_days: '90–120 active days',
    prerequisite_phase_id: 'P4',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P5',
      phase_id: 'P5',
      title: 'Phase 5 Readiness Gate: Mock Interview & OA Performance',
      pass_criteria: 'Complete 45-minute structured coding mock scoring >= 10/12 across problem solving, coding, testing, and communication.',
      instructions: 'Undergo simulated technical round: clarify requirements, write clean code, state edge cases, discuss complexity, and articulate project engineering trade-offs.',
      time_limit_minutes: 45,
      rubric_items: [
        { id: 'p5-r1', criterion: 'Structured problem communication (Clarify -> Design -> Code -> Test)', weight: 30 },
        { id: 'p5-r2', criterion: 'Bug-free implementation under 25 minutes with clean variable names', weight: 30 },
        { id: 'p5-r3', criterion: 'Comprehensive edge case validation and complexity analysis', weight: 20 },
        { id: 'p5-r4', criterion: 'Confident defense of real project architectures and error logs', weight: 20 }
      ],
      suggested_review_module_ids: ['P5.01', 'P5.02', 'P5.03']
    }
  },
  {
    id: 'P6',
    track_id: 'sde-foundation',
    phase_code: 'P6',
    order_index: 6,
    title: 'New-Grad Placement Readiness',
    description: 'Full placement season sprint, 200–300 cumulative understood DSA problems, introductory system design, tailored applications.',
    estimated_hours: '12–15 hours/week',
    approx_study_days: 'Ongoing placement sprint',
    prerequisite_phase_id: 'P5',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P6',
      phase_id: 'P6',
      title: 'Phase 6 Readiness Gate: Placement Season Execution',
      pass_criteria: 'Active pipeline with 20+ tracked applications, 100% core CS mastery, and basic system design diagramming.',
      instructions: 'Sketch URL shortener or rate limiter architecture. Review OS, DBMS, networks, and explain concurrency and indexing.',
      time_limit_minutes: 60,
      rubric_items: [
        { id: 'p6-r1', criterion: 'System design sketch: load balancer, caching, database sharding', weight: 35 },
        { id: 'p6-r2', criterion: 'Rapid answers to core CS questions across OS, networks, and DBMS', weight: 35 },
        { id: 'p6-r3', criterion: 'Pipeline of active eligible campus/off-campus applications', weight: 30 }
      ],
      suggested_review_module_ids: ['P6.02', 'P6.03', 'P6.06']
    }
  },
  {
    id: 'P7',
    track_id: 'sde-foundation',
    phase_code: 'P7',
    order_index: 7,
    title: 'Advanced Engineering & AI Systems (Elective)',
    description: 'Codebase reading, inspecting AI-generated code for correctness and security, LLM tokenomics, and Project C (RAG Codebase Search).',
    estimated_hours: '40–60 hours',
    approx_study_days: '25–35 active days',
    prerequisite_phase_id: 'P4',
    optional_parallel: true,
    gate_definition: {
      id: 'GATE-P7',
      phase_id: 'P7',
      title: 'Phase 7 Readiness Gate: AI Code Intelligence Project & Audit',
      pass_criteria: 'Ship Project C with measured retrieval accuracy and audit an unfamiliar codebase for security flaws.',
      instructions: 'Demonstrate documentation search tool answering queries with cited file lines. Audit sample AI-generated code for OWASP Top 10 vulnerabilities.',
      time_limit_minutes: 45,
      rubric_items: [
        { id: 'p7-r1', criterion: 'Project C functional with source file line citations', weight: 35 },
        { id: 'p7-r2', criterion: 'Identifies subtle AI bugs (hallucination, off-by-one, insecure SQL)', weight: 35 },
        { id: 'p7-r3', criterion: 'Articulates when AI is appropriate vs prohibited in assessments', weight: 30 }
      ],
      suggested_review_module_ids: ['P7.02', 'P7.04', 'P7.05']
    }
  },
  {
    id: 'P8',
    track_id: 'sde-foundation',
    phase_code: 'P8',
    order_index: 8,
    title: 'Graduation & Transition to Industry',
    description: 'Offer conversion, onboarding preparation, deep dive into company-specific stack, and academic graduation completion.',
    estimated_hours: 'Ongoing',
    approx_study_days: 'Final college semester',
    prerequisite_phase_id: 'P6',
    optional_parallel: false,
    gate_definition: {
      id: 'GATE-P8',
      phase_id: 'P8',
      title: 'Phase 8 Readiness Gate: Professional Engineering Onboarding',
      pass_criteria: 'Degree requirements satisfied, production git hygiene verified, and clean transition to full-time engineering.',
      instructions: 'Review production post-mortems, professional code review habits, and maintain ongoing mentorship connections.',
      time_limit_minutes: 30,
      rubric_items: [
        { id: 'p8-r1', criterion: 'Clean academic completion with zero backlog encumbrances', weight: 40 },
        { id: 'p8-r2', criterion: 'Production readiness and code review etiquette understanding', weight: 30 },
        { id: 'p8-r3', criterion: 'Target company technology stack research and preparation', weight: 30 }
      ],
      suggested_review_module_ids: ['P8.01', 'P8.02']
    }
  }
];

// ------------------------------------------------------------------------------
// 4. MODULES
// ------------------------------------------------------------------------------
export const MODULES: ModuleItem[] = [
  // Phase 0
  {
    id: 'P0.01',
    phase_id: 'P0',
    subject_id: 'CPP',
    stable_code: 'P0.01',
    order_index: 1,
    title: 'Computing Architecture, Binary & Program Execution',
    expected_minutes: 90,
    learning_outcomes: [
      'Explain roles of CPU, RAM, disk, OS, and terminal',
      'Understand binary representation and bitwise concepts',
      'Differentiate compilers vs interpreters'
    ],
    prereq_codes: []
  },
  {
    id: 'P0.02',
    phase_id: 'P0',
    subject_id: 'CPP',
    stable_code: 'P0.02',
    order_index: 2,
    title: 'C++ Setup, Compilation Pipeline & Debugging',
    expected_minutes: 90,
    learning_outcomes: [
      'Install g++/clang and setup editor',
      'Compile, link, and run hello.cpp from command line',
      'Diagnose syntax errors vs runtime errors vs logic bugs'
    ],
    prereq_codes: ['P0.01']
  },
  {
    id: 'P0.03',
    phase_id: 'P0',
    subject_id: 'CPP',
    stable_code: 'P0.03',
    order_index: 3,
    title: 'Types, Variables, Expressions & Control Flow',
    expected_minutes: 90,
    learning_outcomes: [
      'Declare primitive types (int, double, char, bool)',
      'Construct if-else branches and switch statements',
      'Write for, while, and do-while loops'
    ],
    prereq_codes: ['P0.02']
  },
  {
    id: 'P0.04',
    phase_id: 'P0',
    subject_id: 'CPP',
    stable_code: 'P0.04',
    order_index: 4,
    title: 'Functions, Parameters, Scope & Arrays',
    expected_minutes: 90,
    learning_outcomes: [
      'Decompose programs into clean single-responsibility functions',
      'Understand local vs global scope and call stack behavior',
      'Manipulate fixed-size arrays and C++ strings'
    ],
    prereq_codes: ['P0.03']
  },
  {
    id: 'P0.05',
    phase_id: 'P0',
    subject_id: 'CPP',
    stable_code: 'P0.05',
    order_index: 5,
    title: 'Tracing Code, Problem Solving & P0 Exit Gate',
    expected_minutes: 90,
    learning_outcomes: [
      'Trace loops and conditionals on paper with memory tables',
      'Solve 20+ basic programming drills independently',
      'Pass Phase 0 Gate in under 35 minutes'
    ],
    prereq_codes: ['P0.04']
  },

  // Phase 1
  {
    id: 'P1.01',
    phase_id: 'P1',
    subject_id: 'CPP',
    stable_code: 'P1.01',
    order_index: 1,
    title: 'Pointers, References, Stack & Heap Intuition',
    expected_minutes: 100,
    learning_outcomes: [
      'Contrast pass-by-value vs pass-by-reference',
      'Understand address-of (&) and dereference (*) operators',
      'Visualize stack frames vs heap allocations'
    ],
    prereq_codes: ['P0.05']
  },
  {
    id: 'P1.02',
    phase_id: 'P1',
    subject_id: 'CPP',
    stable_code: 'P1.02',
    order_index: 2,
    title: 'C++ STL Containers (vector, pair, map, set)',
    expected_minutes: 90,
    learning_outcomes: [
      'Use std::vector dynamically with push_back, size, iteration',
      'Utilize std::map and std::unordered_map for key-value storage',
      'Apply std::set for unique collection filtering'
    ],
    prereq_codes: ['P1.01']
  },
  {
    id: 'P1.03',
    phase_id: 'P1',
    subject_id: 'DSA',
    stable_code: 'P1.03',
    order_index: 3,
    title: 'Big-O Time & Space Complexity Analysis',
    expected_minutes: 80,
    learning_outcomes: [
      'Evaluate O(1), O(log N), O(N), O(N log N), O(N^2)',
      'Analyze worst-case, average-case, and best-case performance',
      'Implement binary search on sorted arrays'
    ],
    prereq_codes: ['P1.02']
  },
  {
    id: 'P1.04',
    phase_id: 'P1',
    subject_id: 'CPP',
    stable_code: 'P1.04',
    order_index: 4,
    title: 'OOP Essentials: Classes, Encapsulation, Composition',
    expected_minutes: 90,
    learning_outcomes: [
      'Define classes with private members and public methods',
      'Construct parameterized constructors and destructors',
      'Implement composition for the C++ CLI task tracker'
    ],
    prereq_codes: ['P1.02']
  },
  {
    id: 'P1.05',
    phase_id: 'P1',
    subject_id: 'CPP',
    stable_code: 'P1.05',
    order_index: 5,
    title: 'Git, GitHub PR Workflows & Terminal Debugging',
    expected_minutes: 80,
    learning_outcomes: [
      'Execute git init, add, commit, branch, checkout, merge',
      'Open and merge pull requests on GitHub',
      'Diagnose bugs using compiler sanitizers (-fsanitize=address)'
    ],
    prereq_codes: ['P1.04']
  },

  // Phase 2
  {
    id: 'P2.01',
    phase_id: 'P2',
    subject_id: 'DSA',
    stable_code: 'P2.01',
    order_index: 1,
    title: 'Arrays, Two Pointers, Frequency Maps & Prefix Sums',
    expected_minutes: 90,
    learning_outcomes: [
      'Solve two-sum and duplicate detection in O(N)',
      'Apply two-pointer technique on sorted arrays',
      'Compute range sum queries with prefix sum arrays'
    ],
    prereq_codes: ['P1.03']
  },
  {
    id: 'P2.02',
    phase_id: 'P2',
    subject_id: 'DSA',
    stable_code: 'P2.02',
    order_index: 2,
    title: 'Sliding Window & Binary Search on Answers',
    expected_minutes: 90,
    learning_outcomes: [
      'Solve fixed and variable-length sliding window problems',
      'Implement binary search for monotonic answer ranges'
    ],
    prereq_codes: ['P2.01']
  },
  {
    id: 'P2.03',
    phase_id: 'P2',
    subject_id: 'DSA',
    stable_code: 'P2.03',
    order_index: 3,
    title: 'Linked Lists, Stacks, Queues & Monotonic Patterns',
    expected_minutes: 90,
    learning_outcomes: [
      'Reverse singly linked list and detect cycle with slow/fast pointers',
      'Solve valid parentheses and next-greater-element with stack'
    ],
    prereq_codes: ['P2.01']
  },
  {
    id: 'P2.04',
    phase_id: 'P2',
    subject_id: 'DB',
    stable_code: 'P2.04',
    order_index: 4,
    title: 'Relational Model, SQL SELECT, JOINs & Aggregations',
    expected_minutes: 90,
    learning_outcomes: [
      'Write multi-table INNER and LEFT JOINs in PostgreSQL',
      'Aggregate data with GROUP BY, HAVING, COUNT, SUM, AVG',
      'Understand foreign key constraints and normalization'
    ],
    prereq_codes: []
  },
  {
    id: 'P2.05',
    phase_id: 'P2',
    subject_id: 'BE',
    stable_code: 'P2.05',
    order_index: 5,
    title: 'Python Syntax, Virtual Environments & Modules',
    expected_minutes: 80,
    learning_outcomes: [
      'Setup virtual environment (venv) and pip packages',
      'Manipulate Python lists, dicts, tuples, and sets',
      'Handle exceptions and structured file I/O'
    ],
    prereq_codes: []
  },
  {
    id: 'P2.06',
    phase_id: 'P2',
    subject_id: 'BE',
    stable_code: 'P2.06',
    order_index: 6,
    title: 'HTTP Protocol, REST Concepts & Minimal FastAPI App',
    expected_minutes: 90,
    learning_outcomes: [
      'Explain HTTP request/response cycle, verbs, status codes',
      'Build first FastAPI CRUD app in-memory',
      'Test endpoints using Swagger UI and curl'
    ],
    prereq_codes: ['P2.04', 'P2.05']
  }
];

// ------------------------------------------------------------------------------
// 5. FIRST 30 CONSECUTIVE LEARNING DAYS (HAND-AUTHORED IN FULL DETAIL)
// ------------------------------------------------------------------------------
export const LEARNING_DAYS: LearningDay[] = [
  // Day 01
  {
    id: 'P0-D01',
    phase_id: 'P0',
    sequence_index: 1,
    stable_code: 'P0-D01',
    title: 'Computational Foundations & Running Your First C++ Program',
    goal: 'Explain what a program is, how the compiler produces an executable, and successfully run hello.cpp.',
    estimated_minutes: 90,
    tasks: [
      {
        id: 'P0-D01-T01',
        learning_day_id: 'P0-D01',
        module_id: 'P0.01',
        task_order: 1,
        kind: 'learn',
        required: true,
        title: 'Study Computing Basics & Program Structure',
        instructions: 'Watch the first 30 minutes of CS50x Week 0 covering binary and algorithmic thinking. Then read LearnCpp lesson 0.2 through 0.7 on compilers, linkers, and IDE configuration.',
        estimate_minutes: 25,
        validation_criteria: 'Can verbally state the difference between source code, compiler object file, and linked binary executable.',
        assigned_resources: [
          {
            resource_id: 'R02',
            exact_assigned_sections: 'Week 0 Lecture: What is a computer, Binary representation, Algorithmic thinking',
            purpose: 'Understand how hardware stores numbers and executes instructions.'
          },
          {
            resource_id: 'R03',
            exact_assigned_sections: 'Chapter 0: Lessons 0.2 to 0.7',
            purpose: 'Understand compiler, linker, IDE setup, and workflow.'
          }
        ]
      },
      {
        id: 'P0-D01-T02',
        learning_day_id: 'P0-D01',
        module_id: 'P0.02',
        task_order: 2,
        kind: 'practice',
        required: true,
        title: 'Compile and Execute hello.cpp',
        instructions: 'Open your terminal. Write a minimal main() function that prints "Hello, Foundation!" using std::cout. Compile using g++ -std=c++17 -Wall hello.cpp -o hello and execute ./hello. Intentionally omit a semicolon, observe the compiler error, and fix it.',
        estimate_minutes: 35,
        validation_criteria: 'Program executes cleanly and outputs the exact phrase. Compiler diagnostic error is understood.',
        assigned_resources: [
          {
            resource_id: 'R04',
            exact_assigned_sections: 'LearnCpp 1.1: Statements and structure of a program',
            purpose: 'Learn syntax for main(), std::cout, and #include <iostream>.'
          }
        ]
      },
      {
        id: 'P0-D01-T03',
        learning_day_id: 'P0-D01',
        module_id: 'P0.01',
        task_order: 3,
        kind: 'apply',
        required: true,
        title: 'Document the 4-Stage Execution Pipeline',
        instructions: 'Write a 4-sentence summary in a local file notes.txt: (1) Source code, (2) Preprocessor & Compiler, (3) Linker, (4) Operating System execution in RAM.',
        estimate_minutes: 20,
        validation_criteria: 'Accurate 4-sentence summary written without copying from AI.',
        assigned_resources: []
      },
      {
        id: 'P0-D01-T04',
        learning_day_id: 'P0-D01',
        module_id: 'P0.01',
        task_order: 4,
        kind: 'review',
        required: false,
        title: 'Vocabulary Recall',
        instructions: 'Retrieve without notes: What is a bit? A byte? What does return 0 in main() signal to the operating system?',
        estimate_minutes: 10,
        validation_criteria: 'Self-recall completed with confidence rating recorded.',
        assigned_resources: []
      }
    ]
  },

  // Day 02
  {
    id: 'P0-D02',
    phase_id: 'P0',
    sequence_index: 2,
    stable_code: 'P0-D02',
    title: 'C++ Variables, Primitive Data Types & Standard Input',
    goal: 'Declare integer, double, and character variables, take user input via std::cin, and display computed results.',
    estimated_minutes: 90,
    tasks: [
      {
        id: 'P0-D02-T01',
        learning_day_id: 'P0-D02',
        module_id: 'P0.03',
        task_order: 1,
        kind: 'learn',
        required: true,
        title: 'Study LearnCpp 1.3 to 1.6: Variables and I/O',
        instructions: 'Read LearnCpp lessons 1.3 (Variable assignment and initialization), 1.4 (Uninitialized variables), and 1.5 (Introduction to iostream: cout, cin, endl).',
        estimate_minutes: 25,
        validation_criteria: 'Knows why uninitialized variables contain garbage values and understands direct vs copy initialization.',
        assigned_resources: [
          {
            resource_id: 'R03',
            exact_assigned_sections: 'LearnCpp Lessons 1.3, 1.4, 1.5',
            purpose: 'Master memory allocation for primitive types and standard streams.'
          }
        ]
      },
      {
        id: 'P0-D02-T02',
        learning_day_id: 'P0-D02',
        module_id: 'P0.03',
        task_order: 2,
        kind: 'practice',
        required: true,
        title: 'Interactive User Age & Profile Program',
        instructions: 'Write a C++ program user_profile.cpp that prompts the user for their birth year and current year, calculates their approximate age, and prints a formatted confirmation message.',
        estimate_minutes: 40,
        validation_criteria: 'Program accepts keyboard inputs, performs subtraction, and produces clean console output.',
        assigned_resources: []
      },
      {
        id: 'P0-D02-T03',
        learning_day_id: 'P0-D02',
        module_id: 'P0.03',
        task_order: 3,
        kind: 'apply',
        required: true,
        title: 'Experiment with Invalid Input',
        instructions: 'Run user_profile.cpp and type a letter (e.g. "abc") when asked for the year. Observe std::cin enter a fail state. Write 2 sentences on what occurred.',
        estimate_minutes: 15,
        validation_criteria: 'Records observation of stream fail state when type mismatch occurs.',
        assigned_resources: []
      },
      {
        id: 'P0-D02-T04',
        learning_day_id: 'P0-D02',
        module_id: 'P0.01',
        task_order: 4,
        kind: 'review',
        required: false,
        title: 'Day 01 Recall: Compilation Pipeline',
        instructions: 'Without checking notes, state what the linker does when compiling multiple C++ files.',
        estimate_minutes: 10,
        validation_criteria: 'Mentally recalls linker combines compiled object code with standard library symbols.',
        assigned_resources: []
      }
    ]
  },

  // Day 03
  {
    id: 'P0-D03',
    phase_id: 'P0',
    sequence_index: 3,
    stable_code: 'P0-D03',
    title: 'Arithmetic Expressions, Operators & Precedence',
    goal: 'Accurately predict integer division, modulo arithmetic, and operator precedence in arithmetic formulas.',
    estimated_minutes: 90,
    tasks: [
      {
        id: 'P0-D03-T01',
        learning_day_id: 'P0-D03',
        module_id: 'P0.03',
        task_order: 1,
        kind: 'learn',
        required: true,
        title: 'Study Operators and Integer Division Pitfalls',
        instructions: 'Read LearnCpp lessons 5.1 through 5.4 on operator precedence, arithmetic operators, and remainder (modulo). Pay special attention to why 5 / 2 yields 2 in integer arithmetic.',
        estimate_minutes: 25,
        validation_criteria: 'Can explain why dividing two integers truncates decimals and how static_cast<double> resolves it.',
        assigned_resources: [
          {
            resource_id: 'R03',
            exact_assigned_sections: 'LearnCpp Lessons 5.1 to 5.4',
            purpose: 'Master operator precedence and type conversions.'
          }
        ]
      },
      {
        id: 'P0-D03-T02',
        learning_day_id: 'P0-D03',
        module_id: 'P0.03',
        task_order: 2,
        kind: 'practice',
        required: true,
        title: 'Time & Currency Unit Conversion Calculator',
        instructions: 'Write a program converter.cpp that accepts an integer number of seconds (e.g. 3665) and calculates the exact hours, minutes, and seconds using integer division (/) and modulo (%).',
        estimate_minutes: 40,
        validation_criteria: 'Input 3665 produces "1 hour, 1 minute, 5 seconds". Passes all test inputs.',
        assigned_resources: []
      },
      {
        id: 'P0-D03-T03',
        learning_day_id: 'P0-D03',
        module_id: 'P0.03',
        task_order: 3,
        kind: 'apply',
        required: true,
        title: 'Explicit Casting Verification',
        instructions: 'Calculate the average of 3 exam scores (e.g. 85, 90, 88). Verify that without casting, the average drops fractions; add static_cast<double> to fix.',
        estimate_minutes: 15,
        validation_criteria: 'Demonstrates static_cast in source code and verifies decimal precision output.',
        assigned_resources: []
      },
      {
        id: 'P0-D03-T04',
        learning_day_id: 'P0-D03',
        module_id: 'P0.03',
        task_order: 4,
        kind: 'review',
        required: false,
        title: 'Modulo Recall',
        instructions: 'Quick retrieval: What is 14 % 4? What is 3 % 5? What is -7 % 3 in C++?',
        estimate_minutes: 10,
        validation_criteria: 'Recalls answers: 2, 3, -1.',
        assigned_resources: []
      }
    ]
  },

  // Day 04
  {
    id: 'P0-D04',
    phase_id: 'P0',
    sequence_index: 4,
    stable_code: 'P0-D04',
    title: 'Conditional Branching: if, else if, else & Boolean Logic',
    goal: 'Implement multi-way conditional decisions and evaluate boolean expressions using &&, ||, and !.',
    estimated_minutes: 90,
    tasks: [
      {
        id: 'P0-D04-T01',
        learning_day_id: 'P0-D04',
        module_id: 'P0.03',
        task_order: 1,
        kind: 'learn',
        required: true,
        title: 'Study Conditionals & Short-Circuit Evaluation',
        instructions: 'Read LearnCpp lessons 4.9 (Boolean values) and 8.1 to 8.4 (Control flow introduction, if statements, and constexpr if). Note short-circuit behavior in logical AND/OR.',
        estimate_minutes: 25,
        validation_criteria: 'Explains why in (a != 0 && 10 / a > 2), division by zero is safely avoided when a is 0.',
        assigned_resources: [
          {
            resource_id: 'R03',
            exact_assigned_sections: 'LearnCpp Lessons 4.9, 8.1 - 8.4',
            purpose: 'Master branching semantics and short-circuit boolean logic.'
          }
        ]
      },
      {
        id: 'P0-D04-T02',
        learning_day_id: 'P0-D04',
        module_id: 'P0.03',
        task_order: 2,
        kind: 'practice',
        required: true,
        title: 'Leap Year & Academic Grade Classifier',
        instructions: 'Write a program classifier.cpp that takes a student mark (0–100) and prints letter grade (A, B, C, F), with input bounds validation. Then add a leap year verification function ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0).',
        estimate_minutes: 40,
        validation_criteria: 'Correctly classifies grades and verifies years 1900 (not leap), 2000 (leap), 2024 (leap).',
        assigned_resources: []
      },
      {
        id: 'P0-D04-T03',
        learning_day_id: 'P0-D04',
        module_id: 'P0.03',
        task_order: 3,
        kind: 'apply',
        required: true,
        title: 'Boundary Value Testing',
        instructions: 'Test classifier.cpp with edge values: -1, 0, 49, 50, 89, 90, 100, 101. Verify that boundary logic handles off-by-one errors properly.',
        estimate_minutes: 15,
        validation_criteria: 'All boundary conditions documented in test comment.',
        assigned_resources: []
      },
      {
        id: 'P0-D04-T04',
        learning_day_id: 'P0-D04',
        module_id: 'P0.03',
        task_order: 4,
        kind: 'review',
        required: false,
        title: 'Day 02 Recall: Stream Extraction',
        instructions: 'What operator is used with std::cin? In which direction do the arrows point (>> vs <<)?',
        estimate_minutes: 10,
        validation_criteria: 'Answers >> stream extraction operator from stream into variable.',
        assigned_resources: []
      }
    ]
  },

  // Day 05
  {
    id: 'P0-D05',
    phase_id: 'P0',
    sequence_index: 5,
    stable_code: 'P0-D05',
    title: 'Switch Statements, Enumerations & Menu-Driven Architecture',
    goal: 'Build an interactive console menu using switch-case and enum class.',
    estimated_minutes: 90,
    tasks: [
      {
        id: 'P0-D05-T01',
        learning_day_id: 'P0-D05',
        module_id: 'P0.03',
        task_order: 1,
        kind: 'learn',
        required: true,
        title: 'Study Switch Statements and Fallthrough',
        instructions: 'Read LearnCpp lessons 8.5 (Switch statement basics) and 8.6 (Switch fallthrough and scoping). Understand why break statements are essential.',
        estimate_minutes: 25,
        validation_criteria: 'Can describe switch fallthrough and [[fallthrough]] attribute.',
        assigned_resources: [
          {
            resource_id: 'R03',
            exact_assigned_sections: 'LearnCpp Lessons 8.5 and 8.6',
            purpose: 'Master multi-option dispatching.'
          }
        ]
      },
      {
        id: 'P0-D05-T02',
        learning_day_id: 'P0-D05',
        module_id: 'P0.03',
        task_order: 2,
        kind: 'practice',
        required: true,
        title: 'Console Geometry Calculator',
        instructions: 'Write a program calculator.cpp presenting a menu: 1. Circle Area, 2. Rectangle Area, 3. Triangle Area, 4. Exit. Use switch to dispatch actions and validate inputs.',
        estimate_minutes: 40,
        validation_criteria: 'Menu dispatches correctly, handles invalid menu choices, and computes formulas accurately.',
        assigned_resources: []
      },
      {
        id: 'P0-D05-T03',
        learning_day_id: 'P0-D05',
        module_id: 'P0.03',
        task_order: 3,
        kind: 'apply',
        required: true,
        title: 'Default Case Handling',
        instructions: 'Ensure the switch statement contains a defensive default: case that warns the user on invalid menu numbers.',
        estimate_minutes: 15,
        validation_criteria: 'Defensive default branch implemented and tested.',
        assigned_resources: []
      },
      {
        id: 'P0-D05-T04',
        learning_day_id: 'P0-D05',
        module_id: 'P0.01',
        task_order: 4,
        kind: 'review',
        required: false,
        title: 'Spaced Recall (+3 Days from Day 02)',
        instructions: 'Recall how uninitialized variables behave in C++ and what compiler flag warns about them.',
        estimate_minutes: 10,
        validation_criteria: 'Recalls undefined behavior/garbage values and -Wall / -Wextra flags.',
        assigned_resources: []
      }
    ]
  }
];

// Generate deterministic learning days for Days 06 to 30 to complete the hand-authored P0 sequence
const TOPICS_D06_TO_D30 = [
  { day: 6, title: 'While Loops & Input Validation', goal: 'Construct while loops with robust sentinel termination.', mod: 'P0.03', res: 'R03', sec: '8.7 - 8.8 While loops' },
  { day: 7, title: 'For Loops & Accumulator Patterns', goal: 'Write standard counting and accumulator for loops for summations.', mod: 'P0.03', res: 'R03', sec: '8.10 For loop mechanics' },
  { day: 8, title: 'Nested Loops & Grid Patterns', goal: 'Generate multiplication tables and pyramid coordinate patterns.', mod: 'P0.03', res: 'R03', sec: '8.11 Nested loops and scoping' },
  { day: 9, title: 'Break, Continue & Loop Invariants', goal: 'Reason about loop exit conditions and avoid infinite loops.', mod: 'P0.03', res: 'R03', sec: '8.12 Break and continue' },
  { day: 10, title: 'Prime Number Verification & Divisibility', goal: 'Implement O(sqrt(N)) trial division for primality testing.', mod: 'P0.03', res: 'R08', sec: 'Introductory mathematical logic' },
  { day: 11, title: 'Digit Extraction & Integer Reversal', goal: 'Extract digits using modulo 10 and division 10 in a loop.', mod: 'P0.03', res: 'R03', sec: 'Integer manipulation exercises' },
  { day: 12, title: 'Fibonacci Sequence: Iterative Approach', goal: 'Calculate Nth Fibonacci number iteratively without recursion.', mod: 'P0.03', res: 'R08', sec: 'Introductory iterative sequences' },
  { day: 13, title: 'Function Declarations, Definitions & Headers', goal: 'Separate function prototypes from implementation.', mod: 'P0.04', res: 'R03', sec: '2.1 - 2.4 Introduction to functions' },
  { day: 14, title: 'Parameters, Return Values & Pure Functions', goal: 'Pass parameters by value and return calculated results.', mod: 'P0.04', res: 'R03', sec: '2.5 - 2.8 Function parameters' },
  { day: 15, title: 'Local Variable Scope & Stack Frames', goal: 'Trace stack memory allocation during nested function calls.', mod: 'P0.04', res: 'R03', sec: '7.1 - 7.3 Compound statements and scope' },
  { day: 16, title: 'Introduction to Fixed-Size Arrays', goal: 'Declare, initialize, and traverse fixed C++ arrays.', mod: 'P0.04', res: 'R03', sec: '17.1 - 17.3 Introduction to arrays' },
  { day: 17, title: 'Array Traversal: Minimum, Maximum & Average', goal: 'Compute statistical properties of an array in single pass.', mod: 'P0.04', res: 'R03', sec: 'Array scanning and linear search' },
  { day: 18, title: 'Linear Search & Sentinel Values', goal: 'Implement linear search returning element index or -1.', mod: 'P0.04', res: 'R05', sec: 'Simulation and basic searching' },
  { day: 19, title: 'Array Inversion & Two-Pointer In-Place Swap', goal: 'Reverse an array in-place using two-pointer swap.', mod: 'P0.04', res: 'R07', sec: 'Array fundamentals: in-place reversal' },
  { day: 20, title: 'Frequency Counting with Hash Array', goal: 'Count character and integer frequencies using an array table.', mod: 'P0.04', res: 'R07', sec: 'Frequency counting basics' },
  { day: 21, title: 'C++ std::string Operations & Methods', goal: 'Manipulate strings: length, indexing, concatenation, substr.', mod: 'P0.04', res: 'R03', sec: '5.9 Introduction to std::string' },
  { day: 22, title: 'Palindrome Verification on Strings', goal: 'Check palindrome ignoring case and whitespace.', mod: 'P0.04', res: 'R07', sec: 'String manipulation drills' },
  { day: 23, title: 'Multi-Dimensional Arrays & Matrices', goal: 'Traverse 2D arrays (row-major vs column-major order).', mod: 'P0.04', res: 'R03', sec: '17.12 Multidimensional arrays' },
  { day: 24, title: 'Matrix Addition, Transpose & Symmetry', goal: 'Perform matrix transpose in-place for square matrices.', mod: 'P0.04', res: 'R05', sec: 'Grid simulation and transformations' },
  { day: 25, title: 'Modular Function Architecture & Header Guards', goal: 'Structure C++ project into utils.h, utils.cpp, and main.cpp.', mod: 'P0.04', res: 'R03', sec: '2.11 - 2.12 Header files and guards' },
  { day: 26, title: 'Terminal Debugging with GDB / LLDB & Sanitizers', goal: 'Compile with -fsanitize=address,undefined and inspect call stack.', mod: 'P0.02', res: 'R11', sec: 'Debugging and profiling lectures' },
  { day: 27, title: 'Timed Problem Drill: 5 Beginner Logic Problems', goal: 'Solve 5 logic problems in 60 minutes without AI help.', mod: 'P0.05', res: 'R08', sec: 'CSES Introductory Problems set' },
  { day: 28, title: 'Dry-Running Programs on Paper with Memory Tables', goal: 'Trace pointer and loop states manually with zero compiler aid.', mod: 'P0.05', res: 'R01', sec: 'Algorithmic dry-run and trace tables' },
  { day: 29, title: 'Phase 0 Mock Gate Rehearsal (35 Minutes)', goal: 'Build the full array stats tool under strict 35-minute timer.', mod: 'P0.05', res: 'R03', sec: 'End of Phase comprehensive assessment' },
  { day: 30, title: 'Phase 0 Exit Gate Verification & Portfolio Repo', goal: 'Official verification of Phase 0 readiness gate and GitHub repo setup.', mod: 'P0.05', res: 'R12', sec: 'cpp-foundations repository packaging' }
];

for (const t of TOPICS_D06_TO_D30) {
  const dayStr = t.day < 10 ? `0${t.day}` : `${t.day}`;
  LEARNING_DAYS.push({
    id: `P0-D${dayStr}`,
    phase_id: 'P0',
    sequence_index: t.day,
    stable_code: `P0-D${dayStr}`,
    title: t.title,
    goal: t.goal,
    estimated_minutes: 90,
    tasks: [
      {
        id: `P0-D${dayStr}-T01`,
        learning_day_id: `P0-D${dayStr}`,
        module_id: t.mod,
        task_order: 1,
        kind: 'learn',
        required: true,
        title: `Learn: ${t.title}`,
        instructions: `Study the assigned section from verified resource: ${t.sec}. Focus on mental model and memory invariants.`,
        estimate_minutes: 25,
        validation_criteria: `Can clearly explain the fundamental concept and avoid common pitfalls.`,
        assigned_resources: [
          {
            resource_id: t.res,
            exact_assigned_sections: t.sec,
            purpose: `Authoritative conceptual foundation for ${t.title}.`
          }
        ]
      },
      {
        id: `P0-D${dayStr}-T02`,
        learning_day_id: `P0-D${dayStr}`,
        module_id: t.mod,
        task_order: 2,
        kind: 'practice',
        required: true,
        title: `Practice: Implement ${t.title}`,
        instructions: `Write independent working C++ code implementing ${t.goal}. Compile with -Wall -Wextra and verify output.`,
        estimate_minutes: 40,
        validation_criteria: `Code passes all manual test cases without compiler warnings.`,
        assigned_resources: []
      },
      {
        id: `P0-D${dayStr}-T03`,
        learning_day_id: `P0-D${dayStr}`,
        module_id: t.mod,
        task_order: 3,
        kind: 'apply',
        required: true,
        title: `Apply: Error Diagnosis & Evidence`,
        instructions: `Document one edge case or deliberate bug diagnosed during implementation. Commit to your practice workspace.`,
        estimate_minutes: 15,
        validation_criteria: `Clear reflection or code diff recorded.`,
        assigned_resources: []
      },
      {
        id: `P0-D${dayStr}-T04`,
        learning_day_id: `P0-D${dayStr}`,
        module_id: t.mod,
        task_order: 4,
        kind: 'review',
        required: false,
        title: `Spaced Repetition Flashcard`,
        instructions: `Recall a key concept from earlier learning days without looking at reference material.`,
        estimate_minutes: 10,
        validation_criteria: `Self-assessed recall confidence logged.`,
        assigned_resources: []
      }
    ]
  });
}

// ------------------------------------------------------------------------------
// 6. THREE CANONICAL PROJECT TEMPLATES
// ------------------------------------------------------------------------------
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'PROJ-A',
    phase_id: 'P3',
    name: 'Reliable Task & Issue Management API',
    tagline: 'Multi-tenant, owner-secured REST API with PostgreSQL, SQLAlchemy, and automated pytest suite.',
    description: 'Individuals or small teams can register, securely create tasks, update status, search/filter, and view their own progress with robust authorization and automated regression tests.',
    tech_stack: ['Python 3.12+', 'FastAPI', 'PostgreSQL', 'SQLAlchemy 2.0', 'pytest', 'Docker Compose'],
    milestones: [
      {
        code: 'A0',
        title: 'In-Memory REST CRUD Endpoints',
        description: 'Build GET /tasks, POST /tasks, PATCH /tasks/{id}, DELETE /tasks/{id} with Pydantic validation.',
        estimated_hours: '6–8 hours',
        deliverables: ['Working FastAPI router', 'Pydantic request/response schemas', 'Interactive Swagger UI verification']
      },
      {
        code: 'A1',
        title: 'PostgreSQL Relational Schema & Migrations',
        description: 'Design users and tasks tables with foreign key constraints, unique email, and Alembic migrations.',
        estimated_hours: '8–12 hours',
        deliverables: ['SQLAlchemy declarative models', 'Database migration script', 'Persistent CRUD operations']
      },
      {
        code: 'A2',
        title: 'Authentication & Strict Owner Authorization',
        description: 'Implement password hashing (bcrypt/Argon2), JWT token generation, and enforce user data isolation to prevent IDOR vulnerabilities.',
        estimated_hours: '10–15 hours',
        deliverables: ['Signup/login routes', 'Dependency get_current_user', '403 Forbidden on cross-account task modification']
      },
      {
        code: 'A3',
        title: 'Automated Test Suite with pytest',
        description: 'Write 20+ automated tests using FastAPI TestClient covering happy paths, validation failures, and authorization boundaries.',
        estimated_hours: '10–15 hours',
        deliverables: ['pytest test suite with 20+ test cases', 'Test database fixture', 'Clean error handling middleware']
      },
      {
        code: 'A4',
        title: 'Docker Compose & GitHub Actions CI',
        description: 'Package API and PostgreSQL into reproducible docker-compose.yaml and configure automated CI running tests on push.',
        estimated_hours: '8–12 hours',
        deliverables: ['docker-compose.yaml', '.github/workflows/test.yml', 'Comprehensive README and sample requests']
      }
    ],
    interview_questions: [
      'Why choose PostgreSQL over MongoDB for a task management service?',
      'How do you prevent Insecure Direct Object References (IDOR) when a user requests /tasks/42?',
      'What happens when two concurrent requests update the same task status?',
      'Explain how your automated test fixtures isolate state between tests.'
    ]
  },
  {
    id: 'PROJ-B',
    phase_id: 'P4',
    name: 'CourseCairn Production Learning Platform Backend',
    tagline: 'High-performance curriculum, notes, and checkpoint engine with indexing and transaction guarantees.',
    description: 'Students follow backend, DSA, and system design learning paths, track progress, save notes, and work on practice checkpoints with sub-50ms query response times.',
    tech_stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy Core/ORM', 'Redis Caching', 'Docker Compose'],
    milestones: [
      {
        code: 'B0',
        title: 'Curriculum & Progress Schema Modeling',
        description: 'Model courses, modules, learning days, user progress, and review queues with appropriate foreign keys.',
        estimated_hours: '10–12 hours',
        deliverables: ['Normalized schema diagram (3NF)', 'Alembic migration scripts']
      },
      {
        code: 'B1',
        title: 'Owner-Secured Progress Endpoints & Atomic Transactions',
        description: 'Build idempotent progress update endpoints wrapped in atomic database transactions.',
        estimated_hours: '12–16 hours',
        deliverables: ['Atomic finishLearningDay transaction endpoint', 'Spaced review calculation scheduler']
      },
      {
        code: 'B2',
        title: 'Query Optimization & EXPLAIN Analysis',
        description: 'Benchmark dashboard queries under simulated 10,000 progress records; add composite indexes and eliminate N+1 queries.',
        estimated_hours: '10–14 hours',
        deliverables: ['EXPLAIN ANALYZE benchmarks before/after indexing', 'Sub-50ms query latency report']
      },
      {
        code: 'B3',
        title: 'Deployment & Telemetry Documentation',
        description: 'Deploy API with structured JSON logging, health checks, and architectural documentation.',
        estimated_hours: '10–12 hours',
        deliverables: ['Production deployment guide', 'Health check endpoints', 'Live demo and video walkthrough']
      }
    ],
    interview_questions: [
      'How do you prevent N+1 query performance degradations when loading a syllabus tree?',
      'Explain the difference between Read Committed and Serializable isolation levels in PostgreSQL.',
      'How did you guarantee that a network timeout during day completion does not create duplicate entries?'
    ]
  },
  {
    id: 'PROJ-C',
    phase_id: 'P7',
    name: 'AI Codebase Intelligence Assistant (Elective)',
    tagline: 'RAG-assisted repository documentation search with verified citations and hallucination controls.',
    description: 'Select a public repository, ingest source files respecting .gitignore, ask questions about architecture or mechanics, and receive answers strictly grounded in specific file paths and line ranges.',
    tech_stack: ['Python', 'FastAPI', 'Tree-Sitter / AST Parser', 'ChromaDB / pgvector', 'pytest'],
    milestones: [
      {
        code: 'C0',
        title: 'Repository Parser & AST Chunking',
        description: 'Parse repository files respecting .gitignore, extract functions and classes with file path and line numbers.',
        estimated_hours: '8–12 hours',
        deliverables: ['AST-aware chunker', 'Metadata schema (file, start_line, end_line, language)']
      },
      {
        code: 'C1',
        title: 'Hybrid Lexical & Vector Retrieval',
        description: 'Combine BM25 keyword matching with dense embeddings for reliable symbol and concept lookup.',
        estimated_hours: '12–16 hours',
        deliverables: ['Search pipeline returning top-K relevant code snippets with citations']
      },
      {
        code: 'C2',
        title: 'Grounding Evaluation & Hallucination Defense',
        description: 'Build evaluation test suite of 20 known questions; assert responses explicitly cite lines or state "insufficient context".',
        estimated_hours: '10–14 hours',
        deliverables: ['Evaluation harness measuring citation accuracy and refusal rates', 'Security review preventing prompt injection']
      }
    ],
    interview_questions: [
      'How do you guarantee the model does not hallucinate nonexistent files or functions?',
      'What are the trade-offs between character chunking and AST-based semantic chunking for code?',
      'How do you protect against prompt injection when ingesting third-party codebases?'
    ]
  }
];

// ------------------------------------------------------------------------------
// 7. VERIFIED COMPANY CAREER PORTALS (FOR CAREER CENTER)
// ------------------------------------------------------------------------------
export const COMPANY_PORTALS = [
  {
    company: 'Google',
    url: 'https://www.google.com/about/careers/applications/jobs/results/',
    location: 'Bengaluru / Hyderabad, India',
    focus: 'DSA + CS Fundamentals + Coding Quality + Role Specifics',
    verification: 'India filter, intern / new-grad graduation batch, required documents, permitted AI policies.'
  },
  {
    company: 'Microsoft',
    url: 'https://careers.microsoft.com/v2/global/en/home.html',
    eligibility_url: 'https://careers.microsoft.com/v2/global/en/internship_eligibility',
    location: 'Bengaluru / Hyderabad / Noida, India',
    focus: 'Problem-solving, real code, testing, algorithm complexity, design.',
    verification: 'Pre-final year university internship eligibility policy.'
  },
  {
    company: 'Amazon',
    url: 'https://www.amazon.jobs/',
    location: 'Bengaluru / Hyderabad / Chennai / Pune, India',
    focus: 'C++ / Python, DSA, OOP, Git, automated testing, leadership principles.',
    verification: 'SDE intern vs 6-month intern vs new-grad batch specifications.'
  },
  {
    company: 'Meta',
    url: 'https://www.metacareers.com/',
    location: 'India / Regional offices',
    focus: 'Coding speed, accuracy, data structures, algorithm optimization.',
    verification: 'Geography and work authorization requirements.'
  },
  {
    company: 'Apple',
    url: 'https://jobs.apple.com/',
    location: 'Bengaluru / Hyderabad, India',
    focus: 'Software engineering, systems, performance, code craftsmanship.',
    verification: 'Specific degree year and university programs.'
  },
  {
    company: 'Atlassian',
    url: 'https://www.atlassian.com/company/careers/earlycareers',
    location: 'Bengaluru / Remote India',
    focus: 'DSA + backend engineering + SQL + practical product development.',
    verification: 'Published India recruiting cycle opens July–December.'
  },
  {
    company: 'Adobe',
    url: 'https://careers.adobe.com/',
    location: 'Noida / Bengaluru, India',
    focus: 'Algorithms, C++, graphics/backend, problem solving.',
    verification: 'University talent drives and off-campus portals.'
  },
  {
    company: 'Uber',
    url: 'https://www.uber.com/us/en/careers/',
    location: 'Bengaluru / Hyderabad, India',
    focus: 'Distributed systems, concurrency, DSA, high performance.',
    verification: 'University SWE listings in India.'
  },
  {
    company: 'Salesforce',
    url: 'https://careers.salesforce.com/',
    location: 'Hyderabad / Bengaluru, India',
    focus: 'Object-oriented programming, cloud architecture, backend, DSA.',
    verification: 'Futureforce early-career programs.'
  },
  {
    company: 'NVIDIA',
    url: 'https://www.nvidia.com/en-us/about-nvidia/careers/',
    location: 'Bengaluru / Pune / Hyderabad, India',
    focus: 'C++, operating systems, memory architectures, performance, AI.',
    verification: 'Systems and software engineering criteria.'
  },
  {
    company: 'Intuit',
    url: 'https://www.intuit.com/careers/',
    location: 'Bengaluru, India',
    focus: 'Full-stack/backend engineering, algorithms, customer empathy.',
    verification: 'Student and graduate hiring openings.'
  },
  {
    company: 'LinkedIn',
    url: 'https://careers.linkedin.com/',
    location: 'Bengaluru, India',
    focus: 'Distributed backend, Java/C++/Python, SQL, algorithms.',
    verification: 'Regional student opportunities.'
  }
];
