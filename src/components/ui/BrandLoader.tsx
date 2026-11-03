'use client';

import React, { useEffect, useRef } from 'react';
import styles from './BrandLoader.module.scss';
import clsx from 'clsx';

interface BrandLoaderProps {
  message?: string;
  fullscreen?: boolean;
  exiting?: boolean;
  onExited?: () => void;
  className?: string;
}

export function BrandLoader({
  message = 'Opening your workspace…',
  fullscreen = true,
  exiting = false,
  onExited,
  className
}: BrandLoaderProps) {
  const onExitedRef = useRef(onExited);
  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useEffect(() => {
    if (exiting) {
      const timer = window.setTimeout(() => {
        onExitedRef.current?.();
      }, 910);
      return () => window.clearTimeout(timer);
    }
  }, [exiting]);

  return (
    <div
      className={clsx(
        styles.loaderContainer,
        fullscreen && styles.fullscreen,
        exiting && styles.exiting,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className={styles.backdrop} aria-hidden="true" />

      <div className={styles.stage}>
        <div className={styles.bloom} aria-hidden="true" />
        <div className={styles.iconWrapper} aria-hidden="true">
          <span className={clsx(styles.bar, styles.bar1)} />
          <span className={clsx(styles.bar, styles.bar2)} />
          <span className={clsx(styles.bar, styles.bar3)} />
        </div>
      </div>

      {message && (
        <p className={clsx(styles.message, exiting && styles.messageExiting)}>
          <span>{message.replace(/…$/, '')}</span>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
            <span className={styles.dot}>.</span>
          </span>
        </p>
      )}
    </div>
  );
}
