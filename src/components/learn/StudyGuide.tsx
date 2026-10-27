import { RESOURCES } from '@/lib/db/curriculum-data';
import { LearningDay } from '@/lib/db/types';
import { STUDY_GUIDANCE } from '@/lib/db/study-guidance';
import styles from './StudyGuide.module.scss';

export function StudyGuide({ day, minutes = 90 }: { day: LearningDay; minutes?: number }) {
  const guide = STUDY_GUIDANCE[day.sequence_index];
  if (!guide) return null;
  const requiredMinutes = day.tasks.filter(t => t.required).reduce((sum, t) => sum + t.estimate_minutes, 0);
  return (
    <section className={styles.card} aria-labelledby={`guide-${day.id}`}>
      <div className={styles.eyebrow}>YOUR PLAN FOR THIS LESSON</div>
      <h2 id={`guide-${day.id}`}>Understand it. Build it. Explain it.</h2>
      <p className={styles.pacing}>Your budget: {minutes} min per session · About {requiredMinutes} min of required work.
        {minutes < requiredMinutes ? ` Plan for ${Math.ceil(requiredMinutes / minutes)} sessions. Save your work and resume this same learning day.` : ' Stop when the checks pass; extra practice is optional.'}</p>
      <div className={styles.goal}><span>YOUR TARGET</span><p>{day.goal}</p></div>
      <ol className={styles.steps}>
        <li><strong>Read with one question in mind</strong><p>{guide.prompt} Use the assigned resource, then close it and explain in your own words.</p></li>
        <li><strong>Build independently</strong><p>{guide.exercise}</p></li>
        <li><strong>Check before marking complete</strong><p>{guide.checks}</p></li>
      </ol>
      <details className={styles.help}>
        <summary>Read exactly what you need</summary>
        <p>Use the sections below for this lesson. You do not need to finish the whole resource.</p>
        {day.tasks.flatMap(task => (task.assigned_resources || []).map((assignment, index) => {
          const resource = RESOURCES.find(item => item.id === assignment.resource_id);
          return resource ? <div className={styles.source} key={`${task.id}-${index}`}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗<span className="sr-only"> (opens in a new tab)</span></a><p><strong>Read:</strong> {assignment.exact_assigned_sections}</p><p><strong>Use it to:</strong> {assignment.purpose}</p>{assignment.note_what_to_skip && <p><strong>Save for later:</strong> {assignment.note_what_to_skip}</p>}</div> : null;
        }))}
      </details>
      <details className={styles.help}>
        <summary>Stuck? Follow this recovery plan</summary>
        <p>Write the input and expected output for the smallest example. Trace your variables on paper. Read the first compiler error, fix one thing, and rerun. After 15–20 minutes without progress, revisit the relevant explanation or ask for a hint using your code and failing example.</p>
        <p>If you use a worked solution, close it and rebuild from scratch. Save the failing case, your fix, and what you learned in the task evidence. Leave the task incomplete until you can explain it.</p>
      </details>
      <details className={styles.help}>
        <summary>Finish with a useful record</summary>
        <p>Save your code link, one normal input, one boundary case, and the result you expected. Add a sentence about an error you fixed. Mark the task complete only when you can explain the solution without copying.</p>
        <p>Next session, try the recall question before opening your notes. If you cannot answer yet, review the explanation and try a fresh example.</p>
      </details>
      <p className={styles.note}>Checks are self-assessed. This workspace does not execute or grade your code.</p>
    </section>
  );
}
