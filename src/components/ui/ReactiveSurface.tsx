'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode, PointerEvent } from 'react';
import styles from './ReactiveSurface.module.scss';

/** Local pointer lighting, without React renders on every pointer movement. */
export function ReactiveSurface({ children, className = '', label }: { children: ReactNode; className?: string; label?: string }) {
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      surface.current?.style.setProperty('--light-x', `${x}px`);
      surface.current?.style.setProperty('--light-y', `${y}px`);
    });
  };
  return <div ref={surface} role={label ? 'region' : undefined} aria-label={label} className={`${styles.surface} ${className}`} onPointerMove={move}>{children}</div>;
}
