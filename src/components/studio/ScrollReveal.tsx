'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './ScrollReveal.module.scss';

/** Content stays readable if JavaScript, observers, or animation are unavailable. */
export function ScrollReveal({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        node.dataset.entered = 'true';
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={element} className={styles.reveal}>{children}</div>;
}
