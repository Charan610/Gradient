import { LEARNING_DAYS } from '@/lib/db/curriculum-data';

const lessonIdsByMilestone: Record<string, string[]> = {
  A0: ['BE-D01', 'BE-D05'],
  A1: ['DB-D01', 'DB-D02'],
  A2: ['BE-D06', 'BE-D07'],
  A3: ['BE-D10'],
  A4: ['BE-D12'],
  B0: ['DB-D03', 'DB-D06'],
  B1: ['DB-D10', 'DB-D11'],
  B2: ['DB-D08', 'DB-D09', 'BE-D08'],
  B3: ['BE-D11', 'BE-D12'],
  C0: ['AI-D03', 'AI-D04'],
  C1: ['AI-D05', 'AI-D06'],
  C2: ['AI-D02', 'AI-D07', 'AI-D08', 'AI-D09'],
  C3: ['AI-D08', 'AI-D09'],
};

const lessonsById = new Map(LEARNING_DAYS.map(lesson => [lesson.id, lesson]));

export function milestoneLessons(code: string) {
  return (lessonIdsByMilestone[code] ?? []).flatMap(id => {
    const lesson = lessonsById.get(id);
    return lesson ? [{ id, title: lesson.title, href: `/app/learn/${lesson.phase_id}/${id}` }] : [];
  });
}
