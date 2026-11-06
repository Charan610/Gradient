import { foundationsManifest } from './foundations';
import { validateManifest } from './manifest';

const drafts = [
  {
    key: 'SQL-LEFT-JOIN', trackId: 'SQL', month: 3, title: 'Keep unmatched rows in a report',
    slug: 'keep-unmatched-rows', objective: 'Explain how a LEFT JOIN keeps a project with no open tasks.',
    provider: 'PostgreSQL', url: 'https://www.postgresql.org/docs/current/tutorial-join.html',
    fixture: 'engineering.sql',
    rubric: 'Return both projects, give the project without open tasks a count of zero, and explain why the status condition belongs in ON.',
    body: 'Build a list of all projects and their open task counts. A left join keeps the project even when no task satisfies the join condition. Put the open status condition in ON, and count the non-null task ID rather than counting all joined rows. For two projects, one with an open task and one with only closed tasks, predict counts of 1 and 0. Move the condition to WHERE and explain which project disappears. Then add a project with no task records and verify it also appears with zero.',
  },
  {
    key: 'WEB-OWNERSHIP', trackId: 'WEB', month: 5, title: 'Read a task without exposing another account',
    slug: 'read-an-owned-task', objective: 'Test that a task endpoint cannot return records belonging to another account.',
    provider: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-15.5.5',
    fixture: 'test_engineering.py',
    rubric: 'Return the authorized task, and use the same 404 response for a missing task and a task belonging to another user. Explain why the caller identity must come from the verified session.',
    body: 'For the TaskFlow MVP, use the verified caller identity and the requested task ID together when looking up a record. This lab starts after authentication, so caller identity is an input from the server, not a parameter that the client can choose. Make a missing task and another owner’s task return the same status and body; this API chooses 404 for both. A test using only the owner misses the security boundary. Add two negative cases, then explain the lookup and what still needs testing at the actual HTTP/session boundary.',
  },
  {
    key: 'CS-STREAM-FRAMING', trackId: 'CS', month: 6, title: 'Decode messages from a stream',
    slug: 'decode-stream-messages', objective: 'Decode complete messages even when read boundaries split or combine them.',
    provider: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc9293.html#section-3.7',
    fixture: 'test_engineering.py',
    rubric: 'Produce the same messages for split and coalesced input, and reject a nonempty unfinished final frame.',
    body: 'TCP presents a byte stream, so a read is not a reliable application message boundary. In this lab, messages are nonempty ASCII words separated by newlines. Buffer the bytes after the most recent newline and emit only complete words. For chunks containing he, then llo followed by a newline and wo, then rld followed by a newline, predict the messages and buffered suffix after each step. Compare the output with receiving both words in one chunk. At end of stream, report a trailing incomplete frame rather than silently treating it as a full message. This small fixture demonstrates framing; a real parser also needs limits on buffered input.',
  },
  {
    key: 'AI-LEXICAL-BASELINE', trackId: 'AI', month: 9, title: 'Build a lexical search baseline with citations',
    slug: 'build-a-cited-search-baseline', objective: 'Check that search returns the correct source revision, path, and line before adding generation.',
    provider: 'PostgreSQL', url: 'https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING',
    fixture: 'engineering.sql',
    rubric: 'Resolve a matching result to its original revision, path and line. Show an empty result for an unsupported query and explain why the score is not confidence in an answer.',
    body: 'Start Codebase Intelligence with lexical retrieval and a small labeled corpus. Store each excerpt with revision, path and line. Use the same text search configuration to tokenize excerpts and queries. Filter using the text search match operator, then rank matches with ts_rank and a stable tie break. Test that the query ownership finds the expected source and that an unrelated query yields no matches. Follow the returned path and line to verify the citation. The ranking score orders retrieval results; it does not prove an explanation is true. Treat source text as untrusted data and give it no authority over tools.',
  },
  {
    key: 'CAREER-PROJECT-DEFENSE', trackId: 'CAREER', month: 11, title: 'Explain a change using evidence',
    slug: 'explain-a-project-change', objective: 'Give a short project defense that a reviewer can verify.',
    provider: 'GitHub', url: 'https://docs.github.com/en/pull-requests/reference/pull-requests#working-with-pull-requests',
    fixture: 'project-defense.md',
    rubric: 'Name the problem, point to a real change, show a relevant check, and identify one remaining limitation. Use only evidence you can reproduce.',
    body: 'Choose an existing change from a local project. Explain who it helps, what behavior changed and why you chose that approach. Point to the relevant file or diff and rerun one test that supports your claim. Describe one boundary or tradeoff the test does not cover. Practice the explanation with a peer and ask them to find the evidence without your help. You can do this with a local commit or diff; publishing a pull request is optional.',
  },
];

export const engineeringManifest = validateManifest({
  ...foundationsManifest,
  modules: [...foundationsManifest.modules, ...drafts.map(d => ({ id: `MOD-${d.key}`, title: d.title, trackId: d.trackId, month: d.month }))],
  skills: [...foundationsManifest.skills, ...drafts.map(d => ({ id: `SKILL-${d.key}`, title: d.title, moduleId: `MOD-${d.key}`, prerequisites: [] }))],
  resources: [...foundationsManifest.resources, ...drafts.map(d => ({
    id: `RES-${d.key}`, title: d.provider + ' reference', provider: d.provider, url: d.url,
    access: 'free-read', checkedOn: '2026-11-06', status: 'section-reviewed', license: 'link-only',
  }))],
  exercises: [...foundationsManifest.exercises, ...drafts.map(d => ({
    id: `EX-${d.key}`, title: d.title, version: '0.1.0', skillId: `SKILL-${d.key}`, rubric: d.rubric, fixture: d.fixture,
  }))],
  lessons: [...foundationsManifest.lessons, ...drafts.map(d => ({
    id: `LESSON-${d.key}`, title: d.title, slug: d.slug, version: '0.1.0', skillId: `SKILL-${d.key}`,
    objective: d.objective, body: d.body, resourceIds: [`RES-${d.key}`], exerciseIds: [`EX-${d.key}`], status: 'draft',
  }))],
});
