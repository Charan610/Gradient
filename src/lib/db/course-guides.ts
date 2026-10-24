export interface CourseTopic {
  title: string;
  learn: string;
  practice: string;
  proof: string;
}
export interface CourseGuide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  prerequisite: string;
  outcome: string;
  defer: string;
  phase: string;
  symbol: string;
  resources: { title: string; url: string; focus: string }[];
  topics: CourseTopic[];
}

// Original study outlines. Only CPP currently has scheduled daily lessons.
export const COURSE_GUIDES: CourseGuide[] = [
  {
    id: 'CPP', title: 'C++ Foundations', tagline: 'Start here. Build your programming instincts.',
    description: 'Go from your first executable to functions, arrays, debugging, and a small program you can explain confidently.',
    prerequisite: 'No programming experience required. Have access to a C++ compiler and a place to save your code.',
    outcome: 'Build an array statistics tool from a blank editor and explain its input validation, loops, and tests.',
    defer: 'Templates, custom allocators, advanced inheritance, and competitive programming tricks.', phase: 'P0 → P1', symbol: '</>',
    resources: [{ title: 'LearnCpp', url: 'https://www.learncpp.com/', focus: 'Use as your main reference. Read the topic assigned to the lesson, then write your own code.' }],
    topics: [
      { title: 'Start, compile, and reason', learn: 'Program execution, variables, input, arithmetic, and branching.', practice: 'Complete Days 01–05; predict the output before running each example.', proof: 'A working build command, tested inputs, and an explanation of the first error you fixed.' },
      { title: 'Loops and problem decomposition', learn: 'Loop invariants, accumulators, digit operations, and bounded search.', practice: 'Complete Days 06–12, including primality and iterative Fibonacci.', proof: 'Passing boundary cases and a short explanation of why each loop terminates.' },
      { title: 'Functions and collections', learn: 'Parameters, local state, arrays, strings, and matrix traversal.', practice: 'Complete Days 13–25 and separate a program into source and header files.', proof: 'Reusable functions with explicit input limits and reproducible test cases.' },
      { title: 'Debug, explain, and demonstrate', learn: 'Debugger use, sanitizers, manual tracing, and independent assessment.', practice: 'Complete Days 26–30 and attempt the Phase 0 readiness rubric.', proof: 'A documented statistics tool that builds from a fresh checkout.' },
    ],
  },
  {
    id: 'DSA', title: 'Data Structures & Algorithms', tagline: 'Learn the pattern. Explain the tradeoff.',
    description: 'Build a reasoning process for unfamiliar problems, from array scans to trees, graphs, and dynamic programming.',
    prerequisite: 'C++ functions and arrays, basic STL containers, and the ability to debug a small program independently.',
    outcome: 'Explain a brute-force approach, improve it, justify complexity, and test the final solution.',
    defer: 'Advanced segment trees, exotic graph algorithms, and collecting multiple problem sheets at once.', phase: 'P1 → P2', symbol: 'O(n)',
    resources: [{ title: 'USACO Guide — Bronze', url: 'https://usaco.guide/bronze', focus: 'Start with complexity, simulation, complete search, sorting, and sets.' }, { title: 'CSES Problem Set', url: 'https://cses.fi/problemset', focus: 'Pick problems matching the topic you have studied; do not work through every section immediately.' }],
    topics: [
      { title: 'Complexity and array patterns', learn: 'Time/space costs, frequency maps, prefix sums, and two pointers.', practice: 'Implement duplicate detection, range sums, and a sorted pair-sum search. Start with a brute-force version.', proof: 'State the invariant and compare runtime and memory for both approaches.' },
      { title: 'Searching and windows', learn: 'Binary search boundaries and fixed/variable sliding windows.', practice: 'Find the first occurrence in a sorted array and the maximum sum of a fixed-length subarray.', proof: 'Test empty input, duplicates, missing values, and windows equal to the entire array.' },
      { title: 'Recursive structures', learn: 'Call stacks, linked lists, tree traversal, stacks, and queues.', practice: 'Reverse a linked list and write recursive and iterative tree traversals.', proof: 'Trace pointer changes and explain when recursion depth becomes a risk.' },
      { title: 'Graphs and dynamic programming', learn: 'BFS/DFS, visited state, state definitions, transitions, and base cases.', practice: 'Count connected components, then derive a memoized solution for a small counting problem.', proof: 'Explain the graph model or DP state before coding, and test cycles or boundary states.' },
      { title: 'Mixed problem practice', learn: 'Choosing a technique without a topic label.', practice: 'Attempt an unseen problem, record help used, and revisit your weakest pattern in a later session.', proof: 'An independent explanation, correct edge cases, and a complexity argument—not just an accepted submission.' },
    ],
  },
  {
    id: 'DB', title: 'SQL & Database Design', tagline: 'Turn messy data into reliable answers.',
    description: 'Learn relational modeling, queries, joins, transactions, and how to investigate a slow query.',
    prerequisite: 'Basic programming and comfort reading small tables of data.',
    outcome: 'Design a course-enrollment database with correct joins, constraints, and a tested transaction.',
    defer: 'Database engine internals and distributed databases until you can write and explain everyday queries.', phase: 'P2 → P3', symbol: 'SQL',
    resources: [{ title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', focus: 'Work through tables, queries, joins, aggregates, foreign keys, and transactions in a local database.' }],
    topics: [
      { title: 'Model and constrain', learn: 'Tables, primary keys, foreign keys, uniqueness, and nullability.', practice: 'Create students, courses, and enrollments tables with a unique student/course pair.', proof: 'Duplicate enrollments and references to missing students are rejected by the database.' },
      { title: 'Query and join', learn: 'Filtering, joins, grouping, aggregates, and NULL behavior.', practice: 'List every course and its enrollment count, including courses with zero enrollments.', proof: 'Explain why LEFT JOIN and COUNT of the joined key behave differently from COUNT(*).' },
      { title: 'Transactions and consistency', learn: 'Atomic updates, rollback, and concurrent modifications.', practice: 'Transfer a student between two course sections in one transaction; simulate failure halfway.', proof: 'The failure leaves no partial transfer, and you can explain your concurrency assumptions.' },
      { title: 'Indexes and query plans', learn: 'Index lookup, scan costs, and the write/storage tradeoff.', practice: 'Compare an enrollment query plan before and after an appropriate index on a larger test dataset.', proof: 'Record the plan and measured result; do not claim that every small-table query must improve.' },
    ],
  },
  {
    id: 'CS', title: 'Computer Science Core', tagline: 'Understand what your code runs on.',
    description: 'Connect your programs to processes, memory, concurrency, and the network requests they make.',
    prerequisite: 'Basic programming, functions, and familiarity with the command line.',
    outcome: 'Explain a request from browser to server, and diagnose a simple process or concurrency issue.',
    defer: 'Kernel implementation and deep protocol details before building a clear conceptual model.', phase: 'P3 → P4', symbol: 'SYS',
    resources: [{ title: 'Operating Systems: Three Easy Pieces', url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/', focus: 'Start with processes, memory virtualization, and concurrency introductions. Use chapter exercises to check understanding.' }, { title: 'MDN — HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview', focus: 'Read request/response structure, methods, status codes, and the role of clients and intermediaries.' }],
    topics: [
      { title: 'Processes and memory', learn: 'Program versus process, address spaces, stack/heap concepts, and virtual memory.', practice: 'Run two copies of a small program; inspect their process IDs and explain their separate state.', proof: 'A diagram of each process and an explanation of which resources are isolated.' },
      { title: 'Concurrency and synchronization', learn: 'Threads, interleaving, race conditions, and mutual exclusion.', practice: 'Trace two workers incrementing a shared counter, then protect the operation with a lock.', proof: 'Show a lost-update interleaving and explain the critical section.' },
      { title: 'From URL to response', learn: 'DNS, TCP, TLS, HTTP, request headers, and responses.', practice: 'Inspect one request in browser developer tools and narrate the path it takes.', proof: 'Identify the method, status, relevant headers, and the difference between DNS and HTTP.' },
      { title: 'Reason about failure', learn: 'Timeouts, retries, caching, resource limits, and observability.', practice: 'Stop a local server, observe the failed request, and compare it with a successful 404 response.', proof: 'Distinguish a transport failure from an application response and suggest the next diagnostic step.' },
    ],
  },
  {
    id: 'BE', title: 'Backend Engineering', tagline: 'Build something another person can use.',
    description: 'Connect Python, HTTP, a database, authorization, and tests into a small, dependable API.',
    prerequisite: 'Basic Python, SQL queries and constraints, plus an understanding of HTTP requests.',
    outcome: 'Ship a task API with persistence, ownership checks, meaningful tests, and reproducible setup.',
    defer: 'Microservices, Kubernetes, and a complex deployment before one service is correct and testable.', phase: 'P3 → P5', symbol: 'API',
    resources: [{ title: 'FastAPI tutorial', url: 'https://fastapi.tiangolo.com/tutorial/', focus: 'Follow first steps, request bodies, validation, dependencies, security, and testing as your project needs them.' }, { title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', focus: 'Apply schema constraints and transactions to the API’s data rather than relying only on request validation.' }],
    topics: [
      { title: 'HTTP contracts', learn: 'Routes, methods, validation, response shapes, and error status codes.', practice: 'Implement create, list, retrieve, update, and delete endpoints for tasks.', proof: 'Valid requests work; malformed inputs and unknown IDs return deliberate, documented errors.' },
      { title: 'Persistent state', learn: 'Database sessions, schemas, migrations, and transactional writes.', practice: 'Replace in-memory tasks with database storage and restart the server.', proof: 'Data survives a restart and failed writes do not leave partial state.' },
      { title: 'Authentication and ownership', learn: 'Identity versus permission and checks at the data boundary.', practice: 'Create two test users and ensure one cannot read or mutate the other’s tasks.', proof: 'Tests cover missing credentials, wrong-owner access, and allowed operations.' },
      { title: 'Test and deliver', learn: 'Fixtures, isolated test data, configuration, and reproducible builds.', practice: 'Write a setup guide and run the tests from a clean environment.', proof: 'A reviewer can start the service, run a sample request, and reproduce the test results.' },
    ],
  },
  {
    id: 'AI', title: 'Applied AI & Retrieval', tagline: 'Make useful systems. Measure their limits.',
    description: 'Build a small document or repository search tool, evaluate its answers, and understand when it should abstain.',
    prerequisite: 'A working backend project, Python, tests, and comfort evaluating imperfect outputs.',
    outcome: 'A search prototype with source citations, a small evaluation set, and documented failure cases.',
    defer: 'Training large models, elaborate agent frameworks, and paid infrastructure before establishing a useful baseline.', phase: 'P7 · Optional', symbol: '{AI}',
    resources: [{ title: 'Hugging Face LLM Course', url: 'https://huggingface.co/learn/llm-course/chapter1/1', focus: 'Use the introductory material for model concepts; this is a reference, not a second full-time curriculum.' }, { title: 'Sentence Transformers — semantic search', url: 'https://www.sbert.net/examples/sentence_transformer/applications/semantic-search/README.html', focus: 'Understand query/document embeddings and retrieval before adding generated answers.' }],
    topics: [
      { title: 'Build a search baseline', learn: 'Document boundaries, chunking, metadata, and keyword retrieval.', practice: 'Index a small public repository and retrieve matching files for five concrete questions.', proof: 'Each result identifies its source and the exact passage that supports it.' },
      { title: 'Semantic retrieval', learn: 'Embeddings, similarity scores, and the limits of semantic matching.', practice: 'Compare keyword search with embedding search on the same small question set.', proof: 'Record which expected passages appear in the top results, including failures.' },
      { title: 'Grounded answers', learn: 'Context selection, citations, uncertainty, and untrusted source content.', practice: 'Answer only from retrieved passages and return “insufficient evidence” when support is missing.', proof: 'Test an unanswerable question and an instruction embedded in a retrieved document.' },
      { title: 'Evaluate before expanding', learn: 'Retrieval quality, answer support, latency, and cost.', practice: 'Create at least ten representative questions and manually review every answer against its sources.', proof: 'A repeatable evaluation report with baseline comparison and specific limitations.' },
    ],
  },
];
