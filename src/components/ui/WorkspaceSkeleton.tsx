import styles from './WorkspaceSkeleton.module.scss';

export function WorkspaceSkeleton() {
  return <div className={styles.skeleton} role="status" aria-label="Loading your workspace" aria-busy="true">
    <span className="sr-only">Loading your saved study progress…</span>
    <div className={styles.metrics} aria-hidden="true">{[0,1,2].map(n=><div key={n}><i /><b /></div>)}</div>
    <div className={styles.columns} aria-hidden="true"><div className={styles.hero}><i /><b /><i /><i /></div><div className={styles.card}><i /><b /><div className={styles.tiles}>{Array.from({length:15},(_,i)=><span key={i} />)}</div></div></div>
  </div>;
}
