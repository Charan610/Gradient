import { z } from 'zod';

const id = z.string().regex(/^[A-Z][A-Z0-9-]*$/);
const version = z.string().regex(/^\d+\.\d+\.\d+$/);
const date = z.string().date();
const identified = z.object({ id, title: z.string().min(1) });
export const manifestSchema = z.object({
  schemaVersion: z.literal(1),
  tracks: z.array(identified),
  modules: z.array(identified.extend({ trackId: id, month: z.number().int().min(1).max(12) })),
  skills: z.array(identified.extend({ moduleId: id, prerequisites: z.array(id) })),
  resources: z.array(identified.extend({
    url: z.string().url().refine(value => value.startsWith('https://')),
    provider: z.string().min(1),
    access: z.enum(['free-read', 'account-required', 'unknown']),
    checkedOn: date.optional(),
    availableThrough: date.optional(),
    status: z.enum(['unreviewed', 'landing-checked', 'section-reviewed']),
    license: z.literal('link-only'),
  })),
  exercises: z.array(identified.extend({
    version, skillId: id, rubric: z.string().min(1), fixture: z.string().min(1),
  })),
  lessons: z.array(identified.extend({
    version, slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    skillId: id, objective: z.string().min(1), resourceIds: z.array(id).min(1),
    exerciseIds: z.array(id).min(1), body: z.string().min(1),
    status: z.enum(['draft', 'reviewed', 'published']),
    review: z.object({ reviewer: z.string().min(1), date }).optional(),
  })),
});

export function validateManifest(input: unknown) {
  const manifest = manifestSchema.parse(input);
  const index = <T extends {id: string}>(rows: T[]) => {
    const result = new Map(rows.map(row => [row.id, row]));
    if (result.size !== rows.length) throw new Error('Duplicate content ID');
    return result;
  };
  const requireRef = <T>(rows: Map<string, T>, key: string) => {
    const found = rows.get(key);
    if (!found) throw new Error('Unknown content reference: ' + key);
    return found;
  };
  const tracks = index(manifest.tracks), modules = index(manifest.modules);
  const skills = index(manifest.skills), resources = index(manifest.resources);
  const exercises = index(manifest.exercises);
  index(manifest.lessons);
  if (new Set(manifest.lessons.map(x => x.slug)).size !== manifest.lessons.length) throw new Error('Duplicate lesson slug');
  for (const module of modules.values()) requireRef(tracks, module.trackId);
  const visiting = new Set<string>(), visited = new Set<string>();
  function visit(key: string) {
    if (visiting.has(key)) throw new Error('Prerequisite cycle: ' + key);
    if (visited.has(key)) return;
    const skill = requireRef(skills, key);
    requireRef(modules, skill.moduleId);
    visiting.add(key);
    skill.prerequisites.forEach(visit);
    visiting.delete(key);
    visited.add(key);
  }
  for (const key of skills.keys()) visit(key);
  for (const resource of resources.values()) {
    if (resource.status !== 'unreviewed' && !resource.checkedOn) throw new Error('Missing resource verification date');
  }
  for (const exercise of exercises.values()) requireRef(skills, exercise.skillId);
  for (const lesson of manifest.lessons) {
    requireRef(skills, lesson.skillId);
    const references = lesson.resourceIds.map(key => requireRef(resources, key));
    if (lesson.status !== 'draft' && !lesson.review) throw new Error('Missing lesson review');
    if (lesson.status === 'published' && references.some(ref => ref.status !== 'section-reviewed')) {
      throw new Error('Published lesson requires reviewed resource sections');
    }
    for (const key of lesson.exerciseIds) {
      if (requireRef(exercises, key).skillId !== lesson.skillId) throw new Error('Exercise does not assess lesson skill');
    }
  }
  return manifest;
}
