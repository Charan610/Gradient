'use client';

import React from 'react';
import styles from './BrandLoader.module.scss';
import clsx from 'clsx';

interface BrandLoaderProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export function BrandLoader({
  message = 'Opening your workspace…',
  fullscreen = true,
  className
}: BrandLoaderProps) {
  return (
    <div
      className={clsx(styles.loaderContainer, fullscreen && styles.fullscreen, className)}
      role="status"
      aria-live="polite"
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <span className={clsx(styles.bar, styles.bar1)} />
        <span className={clsx(styles.bar, styles.bar2)} />
        <span className={clsx(styles.bar, styles.bar3)} />
      </div>

      {message && (
        <p className={styles.message}>
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
