import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { COURSE_GUIDES } from '../src/lib/db/course-guides';
import { PROJECT_TEMPLATES } from '../src/lib/db/curriculum-data';

const guide = (id: string) => COURSE_GUIDES.find(course => course.id === id)!;

// Execute the actual copyable examples, not separate implementations of them.
// No shell, network, package installs, or persistent database is involved.
function snippets(id: string, topic: number): string[] {
  return [...guide(id).topics[topic].practice.matchAll(/python3 -c '([^']+)'/g)]
    .map(match => match[1]);
}

function runPython(code: string, assertions = '') {
  const result = spawnSync('python3', ['-B', '-c', `${code}\n${assertions}`], {
    encoding: 'utf8',
    timeout: 10_000,
  });
  expect(result.error).toBeUndefined();
  expect(result.status, result.stderr).toBe(0);
  return { stdout: result.stdout.trim(), stderr: result.stderr };
}

const pythonAvailable = spawnSync('python3', ['-B', '--version']).status === 0;

describe('Course outline content integrity', () => {
  it('preserves course identities and the four existing checkpoint titles', () => {
    expect(COURSE_GUIDES.map(course => course.id)).toEqual(['CPP', 'DSA', 'DB', 'CS', 'BE', 'AI']);
    const titles: Record<string, string[]> = {
      DB: ['Model and constrain', 'Query and join', 'Transactions and consistency', 'Indexes and query plans'],
      CS: ['Processes and memory', 'Concurrency and synchronization', 'From URL to response', 'Reason about failure'],
      BE: ['HTTP contracts', 'Persistent state', 'Authentication and ownership', 'Test and deliver'],
      AI: ['Build a search baseline', 'Semantic retrieval', 'Grounded answers', 'Evaluate before expanding'],
    };
    for (const [id, expected] of Object.entries(titles)) {
      expect(guide(id).topics.map(topic => topic.title)).toEqual(expected);
      for (const topic of guide(id).topics) {
        expect(Object.keys(topic).sort()).toEqual(['learn', 'practice', 'proof', 'title']);
      }
    }
  });

  it('resolves backend project and milestone references against the curriculum', () => {
    const text = JSON.stringify(guide('BE').topics);
    const ids = [...new Set(text.match(/PROJ-[A-Z]+/g))];
    expect(ids.sort()).toEqual(['PROJ-A', 'PROJ-B']);
    for (const id of ids) {
      const project = PROJECT_TEMPLATES.find(project => project.id === id);
      expect(project).toBeDefined();
      expect(text).toContain(project!.name);
      const milestones = new Set(project!.milestones.map(milestone => milestone.code));
      const prefix = id.slice(-1);
      for (const code of text.match(new RegExp(`\\b${prefix}\\d+\\b`, 'g')) ?? []) {
        expect(milestones.has(code), `${id}: ${code}`).toBe(true);
      }
    }
  });
});

describe.skipIf(!pythonAvailable)('Runnable standard-library outline examples (Python 3)', () => {
  it('demonstrates separate process state without assuming fixed PIDs', () => {
    const code = snippets('CS', 0);
    expect(code).toHaveLength(1);
    const lines = runPython(code[0]).stdout.split('\n');
    expect(lines[0]).toMatch(/^child \d+ 1$/);
    expect(lines[1]).toMatch(/^parent \d+ 0$/);
    expect(lines[0].split(' ')[1]).not.toBe(lines[1].split(' ')[1]);
  });

  it('reproduces a lost update deterministically and protects the real workers', () => {
    const code = snippets('CS', 1);
    expect(code).toHaveLength(2);
    expect(runPython(code[0]).stdout).toBe('1');
    expect(runPython(code[1]).stdout).toBe('2000');
  });

  it('distinguishes malformed JSON, invalid shapes, and title boundaries', () => {
    const code = snippets('BE', 0);
    expect(code).toHaveLength(1);
    const checks = [
      'assert create_status(json.dumps({})) == 422',
      'assert create_status(json.dumps({"title": None})) == 422',
      'assert create_status(json.dumps({"title": "a" * 80})) == 201',
      'assert create_status(json.dumps({"title": "a" * 81})) == 422',
      'assert create_status(json.dumps({"title": "  a  "})) == 201',
    ].join('\n');
    expect(runPython(code[0], checks).stdout).toBe('[201, 422, 422, 422, 400]');
  });

  it('rolls back the first insert after the second insert fails', () => {
    const code = snippets('BE', 1);
    expect(code).toHaveLength(1);
    expect(runPython(code[0]).stdout).toBe('rolled back\n0');
  });

  it('leaves another owner’s task unchanged while allowing the owner’s update', () => {
    const code = snippets('BE', 2);
    expect(code).toHaveLength(1);
    expect(runPython(code[0]).stdout).toBe("0\n1\n[(1, 'done'), (2, 'Lin task')]");
  });

  it('runs both fixture-isolated backend boundary checks', () => {
    const code = snippets('BE', 3);
    expect(code).toHaveLength(1);
    const result = runPython(code[0]);
    expect(result.stderr).toContain('Ran 2 tests');
    expect(result.stderr).toMatch(/\bOK\b/);
  });

  it('retrieves cited passages and handles ties, repeated words, and empty results', () => {
    const code = snippets('AI', 0);
    expect(code).toHaveLength(1);
    const checks = [
      'assert [row[0] for row in search("settings")] == ["auth.md:1", "backup.md:1"]',
      'assert search("RESET, password!") == search("reset password")',
      'assert search("password password")[0][1] == 1',
      'assert search("passwords")[0][0] == "policy.md:1"',
      'assert search("password")[0][0] == "auth.md:1"',
      'assert search("!!!") == []',
      'assert search("settings", -1) == []',
      'assert len(search("settings", 99)) == 2',
      'assert all(source in docs and passage == docs[source] for source, score, passage in search("settings"))',
    ].join('\n');
    expect(runPython(code[0], checks).stdout).toBe(
      "[('auth.md:1', 2, 'Reset password from settings.')]\n[]\n[]\n[]",
    );
  });

  it('shows a vocabulary miss and an explicit offline query expansion', () => {
    const code = snippets('AI', 1);
    expect(code).toHaveLength(1);
    expect(runPython(code[0]).stdout).toBe("[]\n[('auth.md:1', 2, 'Reset password from settings.')]");
  });

  it('keeps the adversarial retrieval out of the manually reviewed evidence', () => {
    const code = snippets('AI', 2);
    expect(code).toHaveLength(1);
    expect(runPython(code[0]).stdout).toBe(
      "[('auth.md:1', 'Reset password from settings.')]\ninsufficient evidence",
    );
  });

  it('uses relevant-set denominators and distinguishes macro from pooled Recall@2', () => {
    const code = snippets('AI', 3);
    expect(code).toHaveLength(1);
    const checks = [
      'assert len(gold) == 2 and all(gold)',
      'assert hits == [1, 1]',
      'assert len(gold[0] & set(["auth.md:1", "auth.md:1"])) / len(gold[0]) == 0.5',
    ].join('\n');
    expect(runPython(code[0], checks).stdout).toBe('[0.5, 1.0]\n0.75\n0.6666666666666666');
  });
});
