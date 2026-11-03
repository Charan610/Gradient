'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './BrandLoader.module.scss';
import clsx from 'clsx';

interface BrandLoaderProps {
  message?: string;
  fullscreen?: boolean;
  exiting?: boolean;
  onExited?: () => void;
  className?: string;
}

/**
 * Creates a rounded, beveled 3D pill bar anchored at bottom y = 0.
 * Rendered with smooth continuous vertex normals and bevels for cinematic specular highlights.
 */
function createPillGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number
): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const r = Math.min(radius, width / 2, height / 2);
  const w = width;
  const h = height;

  // Rounded rectangle path anchored at baseline y = 0
  shape.moveTo(-w / 2 + r, 0);
  shape.lineTo(w / 2 - r, 0);
  shape.quadraticCurveTo(w / 2, 0, w / 2, r);
  shape.lineTo(w / 2, h - r);
  shape.quadraticCurveTo(w / 2, h, w / 2 - r, h);
  shape.lineTo(-w / 2 + r, h);
  shape.quadraticCurveTo(-w / 2, h, -w / 2, h - r);
  shape.lineTo(-w / 2, r);
  shape.quadraticCurveTo(-w / 2, 0, -w / 2 + r, 0);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: depth,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.035,
    bevelSegments: 4,
    curveSegments: 16
  });

  geom.computeVertexNormals();
  return geom;
}

export function BrandLoader({
  message = 'Opening your workspace…',
  fullscreen = true,
  exiting = false,
  onExited,
  className
}: BrandLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);
  const onExitedRef = useRef(onExited);
  const exitingRef = useRef(exiting);

  useEffect(() => {
    onExitedRef.current = onExited;
  }, [onExited]);

  useEffect(() => {
    exitingRef.current = exiting;
  }, [exiting]);

  useEffect(() => {
    if (exiting) {
      const timer = window.setTimeout(() => {
        onExitedRef.current?.();
      }, 910);
      return () => window.clearTimeout(timer);
    }
  }, [exiting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
    renderer.setPixelRatio(dpr);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // Theme detection
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0xfff0e6 : 0xfffaf5,
      isDark ? 1.4 : 1.6
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 2.2 : 2.5);
    keyLight.position.set(3.5, 4.5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(isDark ? 0xe8a080 : 0xf4d4c2, isDark ? 1.2 : 1.4);
    fillLight.position.set(-3.5, -1.5, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0xffaa88 : 0xff7744, isDark ? 2.0 : 1.8);
    rimLight.position.set(0, 3, -4);
    scene.add(rimLight);

    // Materials - Premium satin terracotta porcelain
    const barColor = isDark ? new THREE.Color('#E8AC96') : new THREE.Color('#A54C35');
    const emissiveColor = isDark ? new THREE.Color('#9c4324') : new THREE.Color('#6b2918');

    const material = new THREE.MeshPhysicalMaterial({
      color: barColor,
      roughness: 0.24,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
      emissive: emissiveColor,
      emissiveIntensity: isDark ? 0.4 : 0.15,
      transparent: true,
      opacity: 1
    });

    // 3 Bars - Proportions matching Gradient BrandMark (9, 16, 24)
    const barWidth = 0.34;
    const barGap = 0.17;
    const barDepth = 0.12;
    const cornerRadius = 0.08;

    const h1 = 0.54;
    const h2 = 1.02;
    const h3 = 1.50;

    const geom1 = createPillGeometry(barWidth, h1, barDepth, cornerRadius);
    const geom2 = createPillGeometry(barWidth, h2, barDepth, cornerRadius);
    const geom3 = createPillGeometry(barWidth, h3, barDepth, cornerRadius);

    const bar1 = new THREE.Mesh(geom1, material);
    const bar2 = new THREE.Mesh(geom2, material);
    const bar3 = new THREE.Mesh(geom3, material);

    const baseY = -0.52;
    const posX1 = -(barWidth + barGap);
    const posX2 = 0;
    const posX3 = +(barWidth + barGap);

    bar1.position.set(posX1, baseY, 0);
    bar2.position.set(posX2, baseY, 0);
    bar3.position.set(posX3, baseY, 0);

    const barsGroup = new THREE.Group();
    // Start at refined, elegant icon size (~70px tall)
    barsGroup.scale.set(0.5, 0.5, 0.5);
    barsGroup.position.set(0, 0.12, 0);
    barsGroup.add(bar1);
    barsGroup.add(bar2);
    barsGroup.add(bar3);
    scene.add(barsGroup);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();
    let exitStartTime: number | null = null;
    const EXIT_DURATION = 820; // ms

    const animate = (now: number) => {
      const isExitingNow = exitingRef.current;
      const elapsed = (now - startTime) / 1000;

      if (!isExitingNow) {
        // Hypnotic 3-bar rising wave
        const t = elapsed * 3.6;
        bar1.scale.y = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t));
        bar2.scale.y = 0.82 + 0.24 * (0.5 + 0.5 * Math.sin(t - 0.75));
        bar3.scale.y = 0.92 + 0.18 * (0.5 + 0.5 * Math.sin(t - 1.5));

        // Living breath in depth
        barsGroup.position.z = 0.04 * Math.sin(t * 0.8);
        barsGroup.rotation.y = 0.02 * Math.sin(t * 0.5);
      } else {
        if (exitStartTime === null) {
          exitStartTime = now;
        }
        const p = Math.min(1, (now - exitStartTime) / EXIT_DURATION);

        // Netflix Cinematic Zoom Curve
        if (p < 0.14) {
          // Subtle focus / anticipation
          const windup = p / 0.14;
          barsGroup.position.z = -0.15 * windup;
          barsGroup.scale.set(
            0.5 - 0.03 * windup,
            0.5 - 0.03 * windup,
            0.5 - 0.03 * windup
          );
        } else {
          // Power forward rush toward camera
          const tNorm = (p - 0.14) / 0.86;
          // Cubic ease-in acceleration for the Netflix whoosh
          const surge = Math.pow(tNorm, 2.5);

          // The bars surge from 0.5 scale up to 7.5x scale
          const currentScale = 0.47 + surge * 7.0;
          barsGroup.scale.set(currentScale, currentScale, currentScale);

          // Bars move forward directly toward the camera
          barsGroup.position.z = surge * 3.2;

          // Natural perspective expansion: bars glide outward slightly
          bar1.position.x = posX1 - surge * 0.45;
          bar3.position.x = posX3 + surge * 0.45;

          // Bars stretch vertically as they fly past
          bar1.scale.y = 1.0 + surge * 0.25;
          bar2.scale.y = 1.0 + surge * 0.3;
          bar3.scale.y = 1.0 + surge * 0.35;

          // Brightness surge on impact
          material.emissiveIntensity = (isDark ? 0.4 : 0.15) + surge * 1.2;

          // Dissolve at tail end
          if (p > 0.62) {
            const fade = (p - 0.62) / 0.38;
            material.opacity = 1 - fade;
            if (canvas) {
              canvas.style.opacity = String(1 - fade);
            }
          }
        }

        if (p >= 1) {
          onExitedRef.current?.();
          return;
        }
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      geom1.dispose();
      geom2.dispose();
      geom3.dispose();
      material.dispose();
      renderer?.dispose();
    };
  }, []); // Mounts ONCE - no teardown during exit transition!

  return (
    <div
      ref={containerRef}
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

      <canvas ref={canvasRef} className={styles.webglCanvas} aria-hidden="true" />

      {/* Fallback for non-WebGL environments */}
      {!webglSupported && (
        <div className={styles.svgFallback} aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="17" width="6" height="9" rx="2" fill="var(--accent)" opacity=".55" />
            <rect x="11" y="10" width="6" height="16" rx="2" fill="var(--accent)" opacity=".78" />
            <rect x="20" y="2" width="6" height="24" rx="2" fill="var(--accent)" />
          </svg>
        </div>
      )}

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
