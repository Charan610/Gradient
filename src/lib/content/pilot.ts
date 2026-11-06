import { validateManifest } from './manifest';

export const pilotInput = {
  schemaVersion: 1,
  tracks: [
    ['CPP', 'C++ Foundations'], ['DSA', 'Data Structures & Algorithms'], ['PY', 'Python Fundamentals'],
    ['SQL', 'Relational Data'], ['WEB', 'Web and Backend'], ['CS', 'Core Computer Science'],
    ['TOOL', 'Engineering Workflow'], ['AI', 'Applied AI'], ['PROJ', 'Projects'], ['CAREER', 'Career'],
  ].map(([id, title]) => ({ id, title })),
  modules: [
    { id:'CPP-FUNCTIONS', trackId:'CPP', title:'Functions', month:1 },
    { id:'DSA-SEARCH', trackId:'DSA', title:'Search boundaries', month:3 },
    { id:'SQL-TRANSACTIONS', trackId:'SQL', title:'Transactions', month:6 },
  ],
  skills: [
    { id:'CPP-02', moduleId:'CPP-FUNCTIONS', title:'Trace parameter changes', prerequisites:[] },
    { id:'DSA-03', moduleId:'DSA-SEARCH', title:'Find a sorted boundary', prerequisites:['CPP-02'] },
    { id:'SQL-03', moduleId:'SQL-TRANSACTIONS', title:'Observe committed row versions', prerequisites:[] },
  ],
  resources: [
    { id:'RES-LEARNCPP', title:'LearnCpp', provider:'LearnCpp', url:'https://www.learncpp.com/', status:'unreviewed' },
    { id:'RES-MIT-ALGORITHMS', title:'MIT 6.006', provider:'MIT OpenCourseWare', url:'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', status:'unreviewed' },
    { id:'RES-PG-ISOLATION', title:'Transaction isolation', provider:'PostgreSQL', url:'https://www.postgresql.org/docs/current/transaction-iso.html', status:'landing-checked', checkedOn:'2026-11-06' },
    { id:'RES-HELSINKI-2026', title:'Python Programming MOOC 2026', provider:'University of Helsinki', url:'https://programming-26.mooc.fi/', status:'landing-checked', checkedOn:'2026-11-06', availableThrough:'2026-12-31' },
  ].map(row => ({ ...row, access:'unknown', license:'link-only' })),
  exercises: [
    { id:'EX-CPP-REFERENCE', version:'0.1.0', skillId:'CPP-02', title:'Compare parameter effects', rubric:'Show that only the reference call mutates the caller.', fixture:'references.cpp' },
    { id:'EX-DSA-BOUNDARY', version:'0.1.0', skillId:'DSA-03', title:'Trace the first matching boundary', rubric:'Return the first index with a value at least the target, or the size if none exists.', fixture:'boundary.cpp' },
    { id:'EX-SQL-SNAPSHOT', version:'0.1.0', skillId:'SQL-03', title:'Observe a concurrent transfer', rubric:'Observe the original balances before commit and both updated balances afterward.', fixture:'check-fixtures.sh' },
  ],
  lessons: [
    { id:'LESSON-CPP-REFERENCE', slug:'value-and-reference', skillId:'CPP-02', title:'Value and reference parameters', resourceIds:['RES-LEARNCPP'], exerciseIds:['EX-CPP-REFERENCE'], objective:'Predict whether a call changes the original integer.', body:'An int parameter receives a copy of the value. An int& parameter aliases the original object. Start at 3, increment by value, then by reference. Predict 3 after the first call and 4 after the second.' },
    { id:'LESSON-DSA-BOUNDARY', slug:'binary-search-boundaries', skillId:'DSA-03', title:'Binary search boundaries', resourceIds:['RES-MIT-ALGORITHMS'], exerciseIds:['EX-DSA-BOUNDARY'], objective:'Find the first qualifying index in sorted data.', body:'Keep a half-open interval [lo, hi). Use lo + (hi - lo) / 2 with 0 <= lo <= hi <= size. A qualifying midpoint moves hi to mid; otherwise move lo to mid + 1. In [1, 3, 3, 8], target 3 returns index 1.' },
    { id:'LESSON-SQL-SNAPSHOT', slug:'read-committed-transfer', skillId:'SQL-03', title:'Read Committed and transfers', resourceIds:['RES-PG-ISOLATION'], exerciseIds:['EX-SQL-SNAPSHOT'], objective:'Compare what another transaction sees before and after a transfer commits.', body:'An ordinary SELECT at PostgreSQL Read Committed sees data committed before that statement began. Another session sees neither uncommitted balance change. After commit a new SELECT can see both changes.' },
  ].map(row => ({ ...row, version:'0.1.0', status:'draft' })),
};

export const pilotManifest = validateManifest(pilotInput);
