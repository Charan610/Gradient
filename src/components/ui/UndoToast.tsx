'use client';
import { useState } from 'react';
import { X, Undo2 } from 'lucide-react';
import styles from './UndoToast.module.scss';

export function UndoToast({ message, onUndo, onClose }: { message: string; onUndo: () => Promise<void>; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <div className={styles.toast}>
    <span role="status">{error || message}</span>
    <button disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await onUndo(); onClose(); } catch { setError('Undo failed. Try again.'); } finally { setBusy(false); } }}><Undo2 size={15} />{busy ? 'Undoing…' : 'Undo'}</button>
    <button disabled={busy} className={styles.dismiss} aria-label="Dismiss notification" onClick={onClose}><X size={16} /></button>
  </div>;
}
