// Generate the lightweight catalog without bundling lesson explanations up front.
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const folder = new URL('../src/lib/db/', import.meta.url);
const files = { P1: 'advanced-cpp', P3: 'advanced-dsa', DB: 'database-lessons', CS: 'systems-lessons', BE: 'backend-lessons', AI: 'ai-lessons' };
const index = {};
for (const [prefix, filename] of Object.entries(files)) {
  const source = readFileSync(new URL(`${filename}.ts`, folder), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exports = {};
  runInNewContext(outputText, { exports }, { filename, timeout: 1000 });
  index[prefix] = Array.from(exports.default, ({ title, goal, minutes, prompt, answer }) => ({ title, goal, minutes, prompt, answer }));
}
writeFileSync(new URL('expanded-lesson-index.json', folder), JSON.stringify(index, null, 2) + '\n');
