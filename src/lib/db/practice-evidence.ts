import { z } from 'zod';

const epoch = z.number().int().min(0).max(8_640_000_000_000_000);
const count = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
const cadence = [3, 10, 30] as const;
const day = 86_400_000;
export const PILOT_ASSESSMENT = { id: 'EX-CPP-REFERENCE', version: '0.1.0' } as const;
export const practiceEvidenceSchema = z.object({
  schemaVersion: z.literal(1),
  assessmentId: z.literal(PILOT_ASSESSMENT.id),
  assessmentVersion: z.literal(PILOT_ASSESSMENT.version),
  seen: z.boolean(),
  guided: z.boolean(),
  independentAttempts: count,
  firstPassAt: epoch.nullable(),
  retrieved: count,
  dueAt: epoch.nullable(),
  needsReview: z.boolean(),
  attemptIds: z.array(z.string().uuid()).max(10000).refine(ids => new Set(ids).size === ids.length),
}).strict();
export type PracticeEvidence = z.infer<typeof practiceEvidenceSchema>;
export const emptyEvidence: PracticeEvidence = {
  schemaVersion: 1, assessmentId: PILOT_ASSESSMENT.id, assessmentVersion: PILOT_ASSESSMENT.version,
  seen: false, guided: false, independentAttempts: 0, firstPassAt: null,
  retrieved: 0, dueAt: null, needsReview: false, attemptIds: [],
};
export const practiceActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('seen') }),
  z.object({ type: z.literal('hint') }),
  z.object({ type: z.literal('snooze') }),
  z.object({ type: z.literal('submit'), id: z.string().uuid(), answer: z.enum(['3, 3', '3, 4', '4, 4']), assisted: z.boolean() }),
]);
export type PracticeAction = z.infer<typeof practiceActionSchema>;

export function applyPracticeAction(current: PracticeEvidence, input: PracticeAction, now: number): PracticeEvidence {
  const action = practiceActionSchema.parse(input);
  if (action.type === 'seen') return current.seen ? current : { ...current, seen: true };
  if (action.type === 'hint') return current.guided ? current : { ...current, seen: true, guided: true };
  if (action.type === 'snooze') {
    return current.dueAt !== null && current.dueAt <= now ? { ...current, dueAt: now + day } : current;
  }
  if (current.attemptIds.includes(action.id)) return current;
  const next = { ...current, seen: true, attemptIds: [...current.attemptIds, action.id] };
  if (action.assisted) return { ...next, guided: true };
  next.independentAttempts += 1;
  if (action.answer !== '3, 4') return { ...next, needsReview: true };
  if (current.firstPassAt === null) return { ...next, firstPassAt: now, needsReview: false, dueAt: now + cadence[0] * day };
  if (current.dueAt !== null && current.dueAt <= now) {
    next.retrieved += 1;
    next.dueAt = now + cadence[Math.min(next.retrieved, cadence.length - 1)] * day;
  }
  next.needsReview = false;
  return next;
}
