'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';

export default function LearnIndexPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let current = true;
    ProgressRepository.getProfile().then(profile => {
      if (!current) return;
      const lesson = LEARNING_DAYS.find(day => day.sequence_index === profile.active_day_index);
      router.replace(lesson ? `/app/learn/${lesson.phase_id}/${lesson.id}` : '/app/today');
    }).catch(() => { if (current) setFailed(true); });
    return () => { current = false; };
  }, [router]);

  return <AppShell>
    <h1>{failed ? 'Your lesson couldn’t be opened' : 'Opening your current lesson…'}</h1>
    {failed && <p role="alert">Your saved progress has not changed. Return to your workspace and try again.</p>}
    <Link href="/app/today" className="buttonSecondary">Back to Home</Link>
  </AppShell>;
}
