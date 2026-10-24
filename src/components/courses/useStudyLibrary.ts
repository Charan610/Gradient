'use client';
import { useEffect, useState } from 'react';
import { LEARNING_DAYS } from '@/lib/db/curriculum-data';
import { ProgressRepository } from '@/lib/db/progress-repository';

export function useStudyLibrary() {
  const [state, setState] = useState({ loading: true, error: false, activeSequence: 1, completedIds: [] as string[] });
  useEffect(() => {
    let active = true;
    Promise.all([
      ProgressRepository.getProfile(),
      Promise.all(LEARNING_DAYS.map(day => ProgressRepository.getDayProgress('local_user', day.id))),
    ]).then(([profile, records]) => {
      if (active) setState({ loading: false, error: false, activeSequence: profile.active_day_index,
        completedIds: records.filter(record => record?.state === 'completed').map(record => record!.learning_day_id) });
    }).catch(() => { if (active) setState(previous => ({ ...previous, loading: false, error: true })); });
    return () => { active = false; };
  }, []);
  return state;
}
