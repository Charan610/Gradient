'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Workspace3DBackground.module.scss';

interface FloatingObject {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  freq: THREE.Vector3;
  amp: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  phase: number;
}

export function Workspace3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;

    // Detect current theme from HTML element
    const getTheme = (): 'light' | 'dark' => {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    };

    let currentTheme = getTheme();

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 50);

    const updateCamera = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 0.8) {
        // Mobile portrait
        camera.fov = 52;
        camera.position.z = 17;
      } else if (aspect < 1.2) {
        // Tablet / square
        camera.fov = 46;
        camera.position.z = 15;
      } else {
        // Desktop landscape
        camera.fov = 38;
        camera.position.z = 13.5;
      }
      camera.updateProjectionMatrix();
    };

    updateCamera(window.innerWidth, window.innerHeight);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
    } catch {
      // Graceful fallback if WebGL is unavailable
      return;
    }

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfffbf5, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5eb, 1.5);
    keyLight.position.set(8, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc66c50, 1.2);
    rimLight.position.set(-9, -6, 5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xeee4d8, 0.7);
    fillLight.position.set(-6, 8, -4);
    scene.add(fillLight);

    // 3. Materials
    const ivoryMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdfbf7,
      roughness: 0.28,
      metalness: 0.04,
      clearcoat: 0.25,
      clearcoatRoughness: 0.15,
    });

    const terracottaMat = new THREE.MeshPhysicalMaterial({
      color: 0xc66c50,
      roughness: 0.42,
      metalness: 0.08,
      clearcoat: 0.15,
    });

    const sandMat = new THREE.MeshPhysicalMaterial({
      color: 0xeee7db,
      roughness: 0.35,
      metalness: 0.03,
      clearcoat: 0.2,
    });

    const applyThemeColors = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
        ambientLight.color.setHex(0x222226);
        ambientLight.intensity = 0.85;

        keyLight.color.setHex(0x484d5c);
        keyLight.intensity = 1.1;

        rimLight.color.setHex(0xe8ac96);
        rimLight.intensity = 2.4;

        fillLight.color.setHex(0x352d28);
        fillLight.intensity = 0.9;

        ivoryMat.color.setHex(0x222328);
        ivoryMat.roughness = 0.24;
        ivoryMat.metalness = 0.22;
        ivoryMat.clearcoat = 0.4;

        terracottaMat.color.setHex(0xd87c62);
        terracottaMat.roughness = 0.36;
        terracottaMat.metalness = 0.18;
        terracottaMat.clearcoat = 0.25;

        sandMat.color.setHex(0x2d2b28);
        sandMat.roughness = 0.38;
        sandMat.metalness = 0.15;
      } else {
        ambientLight.color.setHex(0xfffbf5);
        ambientLight.intensity = 1.2;

        keyLight.color.setHex(0xfff5eb);
        keyLight.intensity = 1.5;

        rimLight.color.setHex(0xc66c50);
        rimLight.intensity = 1.2;

        fillLight.color.setHex(0xeee4d8);
        fillLight.intensity = 0.7;

        ivoryMat.color.setHex(0xfdfbf7);
        ivoryMat.roughness = 0.28;
        ivoryMat.metalness = 0.04;
        ivoryMat.clearcoat = 0.25;

        terracottaMat.color.setHex(0xc66c50);
        terracottaMat.roughness = 0.42;
        terracottaMat.metalness = 0.08;
        terracottaMat.clearcoat = 0.15;

        sandMat.color.setHex(0xeee7db);
        sandMat.roughness = 0.35;
        sandMat.metalness = 0.03;
      }
    };

    applyThemeColors(currentTheme);

    // 4. Geometry and Meshes
    // Geometries are kept near the edges and corners to preserve central negative space.
    const objects: FloatingObject[] = [];

    // Ribbon 1: Top-Right sweeping sculptural curve
    const curve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.5, 5.0, -2.5),
      new THREE.Vector3(6.4, 3.8, 0.2),
      new THREE.Vector3(7.8, 1.8, -0.8),
      new THREE.Vector3(5.8, 0.4, 1.2),
      new THREE.Vector3(7.2, -1.6, -0.4),
    ]);
    const ribbon1Geo = new THREE.TubeGeometry(curve1, 72, 0.26, 20, false);
    const ribbon1Mesh = new THREE.Mesh(ribbon1Geo, terracottaMat);
    scene.add(ribbon1Mesh);
    objects.push({
      mesh: ribbon1Mesh,
      basePos: new THREE.Vector3(0, 0, 0),
      freq: new THREE.Vector3(0.25, 0.32, 0.2),
      amp: new THREE.Vector3(0.2, 0.25, 0.15),
      rotSpeed: new THREE.Vector3(0.012, 0.016, 0.008),
      phase: 0.2,
    });

    // Ribbon 2: Bottom-Left architectural curve
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8.2, -0.8, -1.8),
      new THREE.Vector3(-6.2, -2.6, 0.4),
      new THREE.Vector3(-4.8, -4.0, -0.8),
      new THREE.Vector3(-6.6, -5.2, 0.8),
      new THREE.Vector3(-8.0, -3.8, -0.4),
    ]);
    const ribbon2Geo = new THREE.TubeGeometry(curve2, 64, 0.22, 20, false);
    const ribbon2Mesh = new THREE.Mesh(ribbon2Geo, ivoryMat);
    scene.add(ribbon2Mesh);
    objects.push({
      mesh: ribbon2Mesh,
      basePos: new THREE.Vector3(0, 0, 0),
      freq: new THREE.Vector3(0.28, 0.22, 0.18),
      amp: new THREE.Vector3(0.18, 0.22, 0.12),
      rotSpeed: new THREE.Vector3(-0.01, 0.014, -0.006),
      phase: 1.8,
    });

    // Spheres - strategically positioned in periphery
    const sphereDefinitions = [
      // Top-Right main porcelain sphere
      { radius: 1.05, pos: new THREE.Vector3(6.6, 3.2, 0.6), mat: ivoryMat, freq: [0.35, 0.42, 0.28], amp: [0.25, 0.3, 0.2], phase: 0 },
      // Top-Right terracotta satellite
      { radius: 0.48, pos: new THREE.Vector3(5.1, 4.2, -1.0), mat: terracottaMat, freq: [0.45, 0.52, 0.32], amp: [0.18, 0.22, 0.15], phase: 1.2 },
      // Bottom-Left anchor sphere
      { radius: 0.95, pos: new THREE.Vector3(-6.0, -3.0, 0.5), mat: sandMat, freq: [0.32, 0.38, 0.24], amp: [0.22, 0.26, 0.18], phase: 2.4 },
      // Bottom-Left terracotta accent
      { radius: 0.42, pos: new THREE.Vector3(-7.5, -1.8, -1.4), mat: terracottaMat, freq: [0.48, 0.44, 0.35], amp: [0.16, 0.2, 0.12], phase: 3.1 },
      // Top-Left gentle ambient orb
      { radius: 0.62, pos: new THREE.Vector3(-7.4, 4.2, -2.5), mat: ivoryMat, freq: [0.26, 0.31, 0.22], amp: [0.2, 0.24, 0.14], phase: 4.0 },
      // Bottom-Right drift accent
      { radius: 0.52, pos: new THREE.Vector3(7.0, -4.0, -1.5), mat: sandMat, freq: [0.38, 0.34, 0.25], amp: [0.18, 0.22, 0.14], phase: 5.2 },
    ];

    const sphereGeos: THREE.SphereGeometry[] = [];
    sphereDefinitions.forEach((def) => {
      const geo = new THREE.SphereGeometry(def.radius, 40, 40);
      sphereGeos.push(geo);
      const mesh = new THREE.Mesh(geo, def.mat);
      mesh.position.copy(def.pos);
      scene.add(mesh);
      objects.push({
        mesh,
        basePos: def.pos.clone(),
        freq: new THREE.Vector3(def.freq[0], def.freq[1], def.freq[2]),
        amp: new THREE.Vector3(def.amp[0], def.amp[1], def.amp[2]),
        rotSpeed: new THREE.Vector3(0.02, 0.03, 0.015),
        phase: def.phase,
      });
    });

    // 5. Parallax & Motion Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      // Normalized between -1 and 1
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 6. Resize Handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      updateCamera(w, h);
      renderer?.setSize(w, h, false);
      renderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    };

    window.addEventListener('resize', onResize);

    // 7. Theme Observer
    const observer = new MutationObserver(() => {
      const nextTheme = getTheme();
      if (nextTheme !== currentTheme) {
        currentTheme = nextTheme;
        applyThemeColors(currentTheme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // 8. Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const delta = Math.min(clock.getDelta(), 0.08); // cap max step
      const elapsed = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      const lerpFactor = 1 - Math.exp(-delta * 2.2);
      mouseX += (targetMouseX - mouseX) * lerpFactor;
      mouseY += (targetMouseY - mouseY) * lerpFactor;

      // Subtle camera parallax
      camera.position.x = mouseX * 0.45;
      camera.position.y = -mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      // Animate floating objects smoothly with harmonic drift
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const t = elapsed + obj.phase;

        obj.mesh.position.x = obj.basePos.x + Math.sin(t * obj.freq.x) * obj.amp.x;
        obj.mesh.position.y = obj.basePos.y + Math.cos(t * obj.freq.y) * obj.amp.y;
        obj.mesh.position.z = obj.basePos.z + Math.sin(t * obj.freq.z) * obj.amp.z;

        obj.mesh.rotation.x += obj.rotSpeed.x * delta;
        obj.mesh.rotation.y += obj.rotSpeed.y * delta;
        obj.mesh.rotation.z += obj.rotSpeed.z * delta;
      }

      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    // If reduced motion is requested, render once statically
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animationFrameId = requestAnimationFrame(animate);
    }

    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
      if (prefersReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        renderer?.render(scene, camera);
      } else {
        clock.getDelta(); // flush delta
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    reducedMotionQuery.addEventListener('change', onMotionChange);

    // Pause animation when page is hidden
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!prefersReducedMotion && !isRunning) {
          isRunning = true;
          clock.getDelta(); // flush delta to avoid sudden jump
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    // 9. WebGL Context Recovery
    const onContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationFrameId);
      isRunning = false;
    };

    const onContextRestored = () => {
      applyThemeColors(getTheme());
      if (!prefersReducedMotion) {
        isRunning = true;
        clock.getDelta();
        animationFrameId = requestAnimationFrame(animate);
      } else {
        renderer?.render(scene, camera);
      }
    };

    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    // 10. Cleanup
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      reducedMotionQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();

      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      // Dispose Three.js resources
      ribbon1Geo.dispose();
      ribbon2Geo.dispose();
      sphereGeos.forEach((g) => g.dispose());
      ivoryMat.dispose();
      terracottaMat.dispose();
      sandMat.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.backgroundWrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

