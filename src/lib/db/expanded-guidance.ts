const loaders = {
  P1: () => import('./advanced-cpp'),
  P3: () => import('./advanced-dsa'),
  DB: () => import('./database-lessons'),
  CS: () => import('./systems-lessons'),
  BE: () => import('./backend-lessons'),
  AI: () => import('./ai-lessons'),
};

export async function loadExpandedGuidance(id: string) {
  const match = /^(P1|P3|DB|CS|BE|AI)-D(\d+)$/.exec(id);
  if (!match) throw new Error(`Unknown guided lesson ${id}`);
  const { default: lessons } = await loaders[match[1] as keyof typeof loaders]();
  const lesson = lessons[Number(match[2]) - 1];
  if (!lesson) throw new Error(`Missing guided lesson ${id}`);
  return lesson;
}
