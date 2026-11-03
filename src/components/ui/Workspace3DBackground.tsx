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
  relX: number; // relative horizontal position (-0.5 to 0.5 of viewport)
  relY: number; // relative vertical position (-0.5 to 0.5 of viewport)
  depthZ: number;
  mobileScale: number;
}

/**
 * Creates a mathematically smooth, non-twisting ribbon with elliptical cross-section,
 * continuous vertex normals, and natural sinusoidal tapering at both ends.
 */
function createSculptedRibbonGeometry(
  curve: THREE.CatmullRomCurve3,
  segments = 112,
  radialSegments = 32,
  baseWidth = 0.82,
  baseHeight = 0.16,
  twist = 0.95
): THREE.BufferGeometry {
  const points = curve.getPoints(segments);
  const tangents: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    tangents.push(curve.getTangent(u).normalize());
  }

  // Rotation Minimizing Frames (Double Reflection Method to prevent any gimbal flip or kinks)
  const normals: THREE.Vector3[] = [];
  const binormals: THREE.Vector3[] = [];
  let initialNormal = new THREE.Vector3(0, 1, 0);
  if (Math.abs(tangents[0].dot(initialNormal)) > 0.9) {
    initialNormal = new THREE.Vector3(1, 0, 0);
  }
  const norm = initialNormal.clone().cross(tangents[0]).normalize().cross(tangents[0]).normalize();
  normals.push(norm);
  binormals.push(tangents[0].clone().cross(norm).normalize());

  for (let i = 0; i < segments; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const t1 = tangents[i];
    const t2 = tangents[i + 1];

    const v1 = p2.clone().sub(p1);
    const c1 = v1.dot(v1);
    const r1 = normals[i].clone().sub(v1.clone().multiplyScalar((2 / (c1 || 1)) * v1.dot(normals[i])));
    const t1L = t1.clone().sub(v1.clone().multiplyScalar((2 / (c1 || 1)) * v1.dot(t1)));

    const v2 = t2.clone().sub(t1L);
    const c2 = v2.dot(v2);
    const r2 = r1.clone().sub(v2.clone().multiplyScalar((2 / (c2 || 1)) * v2.dot(r1)));
    const nextNorm = r2.normalize();
    normals.push(nextNorm);
    binormals.push(t2.clone().cross(nextNorm).normalize());
  }

  const vertices: number[] = [];
  const normList: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const p = points[i];
    const N = normals[i];
    const B = binormals[i];

    // Smooth sinusoidal taper: swells voluptuously in center, gracefully pinches to zero at endpoints
    const taper = Math.sin(Math.PI * Math.max(0.001, Math.min(0.999, u))) ** 0.65;
    const w = baseWidth * taper;
    const h = baseHeight * taper;
    const rot = twist * u;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);

    const rN = N.clone().multiplyScalar(cosR).add(B.clone().multiplyScalar(sinR));
    const rB = N.clone().multiplyScalar(-sinR).add(B.clone().multiplyScalar(cosR));

    for (let j = 0; j <= radialSegments; j++) {
      const v = j / radialSegments;
      const theta = v * Math.PI * 2;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      const vx = p.x + (rN.x * cosT * w) + (rB.x * sinT * h);
      const vy = p.y + (rN.y * cosT * w) + (rB.y * sinT * h);
      const vz = p.z + (rN.z * cosT * w) + (rB.z * sinT * h);
      vertices.push(vx, vy, vz);

      // Smooth analytical elliptical normal
      const nx = (rN.x * (cosT / (w || 0.001))) + (rB.x * (sinT / (h || 0.001)));
      const ny = (rN.y * (cosT / (w || 0.001))) + (rB.y * (sinT / (h || 0.001)));
      const nz = (rN.z * (cosT / (w || 0.001))) + (rB.z * (sinT / (h || 0.001)));
      const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      normList.push(nx / len, ny / len, nz / len);

      uvs.push(u, v);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radialSegments; j++) {
      const a = i * (radialSegments + 1) + j;
      const b = (i + 1) * (radialSegments + 1) + j;
      const c = (i + 1) * (radialSegments + 1) + (j + 1);
      const d = i * (radialSegments + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normList, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
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
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 50);

    const getViewportSpanAtOrigin = () => {
      const vFOV = THREE.MathUtils.degToRad(camera.fov);
      const hSpan = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const wSpan = hSpan * camera.aspect;
      return { wSpan, hSpan };
    };

    const updateCamera = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      if (aspect < 0.8) {
        // Mobile portrait: widen view slightly so framing elements stay in extreme margins
        camera.fov = 48;
        camera.position.z = 15.0;
      } else if (aspect < 1.2) {
        // Tablet / square
        camera.fov = 40;
        camera.position.z = 13.8;
      } else {
        // Desktop landscape: refined architectural framing
        camera.fov = 35;
        camera.position.z = 12.8;
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.06;
    } catch {
      // Graceful fallback if WebGL is unavailable
      return;
    }

    // 2. Procedural Studio PMREM Environment Map for soft, realistic PBR reflections
    let pmremTarget: THREE.WebGLRenderTarget | null = null;
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0xfcfaf7);

      const topLight = new THREE.DirectionalLight(0xfff8f0, 2.0);
      topLight.position.set(2, 10, 4);
      envScene.add(topLight);

      const warmBounce = new THREE.DirectionalLight(0xe89f88, 1.3);
      warmBounce.position.set(-8, -4, 5);
      envScene.add(warmBounce);

      const coolRim = new THREE.DirectionalLight(0xd9e2eb, 1.0);
      coolRim.position.set(6, -2, -6);
      envScene.add(coolRim);

      pmremTarget = pmremGenerator.fromScene(envScene, 0.04);
      scene.environment = pmremTarget.texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback without PMREM if environment compilation is unsupported
    }

    // 3. Multi-Tier Studio Lighting Setup
    const hemiLight = new THREE.HemisphereLight(0xfff8f0, 0xdcd0c0, 1.3);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4ea, 1.35);
    keyLight.position.set(8.5, 9.5, 7.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe58266, 1.4);
    rimLight.position.set(-8.5, -6.5, 5.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xe8dfd5, 0.65);
    fillLight.position.set(-6.0, 7.5, -4.5);
    scene.add(fillLight);

    // 4. Premium PBR Materials (Soft Matte Ceramic, Satin, and Porcelain with Glaze Sheen)
    const ivoryMat = new THREE.MeshPhysicalMaterial({
      color: 0xfcfaf6,
      roughness: 0.38,
      metalness: 0.01,
      clearcoat: 0.3,
      clearcoatRoughness: 0.34,
      sheen: 0.45,
      sheenColor: new THREE.Color(0xffffff),
      sheenRoughness: 0.45,
      transmission: 0.06,
      thickness: 0.5,
      ior: 1.46,
    });

    const terracottaMat = new THREE.MeshPhysicalMaterial({
      color: 0xcc6f54,
      roughness: 0.44,
      metalness: 0.03,
      clearcoat: 0.22,
      clearcoatRoughness: 0.4,
      sheen: 0.75,
      sheenColor: new THREE.Color(0xf6b5a2),
      sheenRoughness: 0.5,
      ior: 1.48,
    });

    const sandMat = new THREE.MeshPhysicalMaterial({
      color: 0xe9e0d3,
      roughness: 0.52,
      metalness: 0.01,
      clearcoat: 0.15,
      clearcoatRoughness: 0.48,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xfaf4eb),
      sheenRoughness: 0.55,
      ior: 1.46,
    });

    const applyThemeColors = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
        hemiLight.color.setHex(0x282b34);
        hemiLight.groundColor.setHex(0x141416);
        hemiLight.intensity = 0.8;

        keyLight.color.setHex(0x3e4554);
        keyLight.intensity = 0.9;

        rimLight.color.setHex(0xfa8e72);
        rimLight.intensity = 2.4;

        fillLight.color.setHex(0x2a2522);
        fillLight.intensity = 0.65;

        ivoryMat.color.setHex(0x222329);
        ivoryMat.roughness = 0.42;
        ivoryMat.metalness = 0.14;
        ivoryMat.clearcoat = 0.35;
        ivoryMat.clearcoatRoughness = 0.38;
        ivoryMat.sheen = 0.32;
        ivoryMat.sheenColor.setHex(0x4a4a56);
        ivoryMat.transmission = 0.02;

        terracottaMat.color.setHex(0xd9755b);
        terracottaMat.roughness = 0.42;
        terracottaMat.metalness = 0.12;
        terracottaMat.clearcoat = 0.35;
        terracottaMat.clearcoatRoughness = 0.32;
        terracottaMat.sheen = 0.65;
        terracottaMat.sheenColor.setHex(0xffa085);

        sandMat.color.setHex(0x2a2826);
        sandMat.roughness = 0.5;
        sandMat.metalness = 0.08;
        sandMat.clearcoat = 0.2;
        sandMat.sheen = 0.3;
        sandMat.sheenColor.setHex(0x4e4740);
      } else {
        hemiLight.color.setHex(0xfff8f0);
        hemiLight.groundColor.setHex(0xdcd0c0);
        hemiLight.intensity = 1.3;

        keyLight.color.setHex(0xfff4ea);
        keyLight.intensity = 1.35;

        rimLight.color.setHex(0xe58266);
        rimLight.intensity = 1.4;

        fillLight.color.setHex(0xe8dfd5);
        fillLight.intensity = 0.65;

        ivoryMat.color.setHex(0xfcfaf6);
        ivoryMat.roughness = 0.38;
        ivoryMat.metalness = 0.01;
        ivoryMat.clearcoat = 0.3;
        ivoryMat.clearcoatRoughness = 0.34;
        ivoryMat.sheen = 0.45;
        ivoryMat.sheenColor.setHex(0xffffff);
        ivoryMat.transmission = 0.06;

        terracottaMat.color.setHex(0xcc6f54);
        terracottaMat.roughness = 0.44;
        terracottaMat.metalness = 0.03;
        terracottaMat.clearcoat = 0.22;
        terracottaMat.clearcoatRoughness = 0.4;
        terracottaMat.sheen = 0.75;
        terracottaMat.sheenColor.setHex(0xf6b5a2);

        sandMat.color.setHex(0xe9e0d3);
        sandMat.roughness = 0.52;
        sandMat.metalness = 0.01;
        sandMat.clearcoat = 0.15;
        sandMat.sheen = 0.35;
        sandMat.sheenColor.setHex(0xfaf4eb);
      }
    };

    applyThemeColors(currentTheme);

    // 5. Geometries & Carefully Art-Directed Adaptive Composition
    const objects: FloatingObject[] = [];

    // Ribbon 1: Upper-Right sweeping sculptural curve (tapered, smooth elliptical ribbon)
    const curve1 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.0, 2.0, -1.0),
        new THREE.Vector3(0.2, 1.2, 0.4),
        new THREE.Vector3(1.4, 0.0, -0.2),
        new THREE.Vector3(0.8, -1.2, 0.5),
        new THREE.Vector3(1.8, -2.2, -0.8),
      ],
      false,
      'centripetal'
    );
    const ribbon1Geo = createSculptedRibbonGeometry(curve1, 112, 32, 0.8, 0.15, 0.95);
    const ribbon1Mesh = new THREE.Mesh(ribbon1Geo, terracottaMat);
    scene.add(ribbon1Mesh);
    objects.push({
      mesh: ribbon1Mesh,
      basePos: new THREE.Vector3(0, 0, 0),
      freq: new THREE.Vector3(0.18, 0.24, 0.15),
      amp: new THREE.Vector3(0.15, 0.18, 0.12),
      rotSpeed: new THREE.Vector3(0.008, 0.012, 0.005),
      phase: 0.2,
      relX: 0.40,
      relY: 0.30,
      depthZ: -0.8,
      mobileScale: 0.65,
    });

    // Ribbon 2: Lower-Left architectural curve (flowing ivory satin band)
    const curve2 = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-1.8, 2.0, -0.8),
        new THREE.Vector3(-0.6, 0.8, 0.4),
        new THREE.Vector3(-1.4, -0.4, -0.3),
        new THREE.Vector3(0.0, -1.4, 0.5),
        new THREE.Vector3(-1.0, -2.4, -0.8),
      ],
      false,
      'centripetal'
    );
    const ribbon2Geo = createSculptedRibbonGeometry(curve2, 112, 32, 0.74, 0.14, 0.9);
    const ribbon2Mesh = new THREE.Mesh(ribbon2Geo, ivoryMat);
    scene.add(ribbon2Mesh);
    objects.push({
      mesh: ribbon2Mesh,
      basePos: new THREE.Vector3(0, 0, 0),
      freq: new THREE.Vector3(0.22, 0.18, 0.14),
      amp: new THREE.Vector3(0.14, 0.16, 0.1),
      rotSpeed: new THREE.Vector3(-0.007, 0.01, -0.004),
      phase: 1.8,
      relX: -0.40,
      relY: -0.30,
      depthZ: -0.7,
      mobileScale: 0.65,
    });

    // Sculpted Spheres & Porcelain River Stones (Subdivided at 64x64 for perfectly smooth silhouettes)
    const sphereDefinitions = [
      // Top-Right main porcelain sphere
      { radius: 0.92, relX: 0.42, relY: 0.32, depthZ: 0.2, mat: ivoryMat, freq: [0.28, 0.34, 0.22], amp: [0.18, 0.22, 0.14], phase: 0, mobileScale: 0.65 },
      // Top-Right warm terracotta satellite
      { radius: 0.42, relX: 0.34, relY: 0.42, depthZ: -1.0, mat: terracottaMat, freq: [0.36, 0.42, 0.26], amp: [0.14, 0.18, 0.12], phase: 1.2, mobileScale: 0.65 },
      // Bottom-Left anchor stone
      { radius: 0.86, relX: -0.40, relY: -0.32, depthZ: 0.3, mat: sandMat, freq: [0.24, 0.3, 0.18], amp: [0.16, 0.2, 0.14], phase: 2.4, mobileScale: 0.65 },
      // Bottom-Left terracotta accent
      { radius: 0.36, relX: -0.45, relY: -0.20, depthZ: -1.2, mat: terracottaMat, freq: [0.38, 0.34, 0.28], amp: [0.12, 0.15, 0.1], phase: 3.1, mobileScale: 0.65 },
      // Top-Left gentle ambient orb (pushed to far top-left corner)
      { radius: 0.52, relX: -0.44, relY: 0.42, depthZ: -2.2, mat: ivoryMat, freq: [0.2, 0.25, 0.18], amp: [0.15, 0.18, 0.12], phase: 4.0, mobileScale: 0.6 },
      // Bottom-Right drift accent
      { radius: 0.46, relX: 0.43, relY: -0.36, depthZ: -1.4, mat: sandMat, freq: [0.3, 0.28, 0.2], amp: [0.14, 0.16, 0.11], phase: 5.2, mobileScale: 0.6 },
      // Subtle deep atmospheric orb (high near top margin)
      { radius: 0.55, relX: 0.05, relY: 0.48, depthZ: -5.0, mat: ivoryMat, freq: [0.15, 0.18, 0.12], amp: [0.1, 0.12, 0.08], phase: 6.0, mobileScale: 0.5 },
    ];

    const sphereGeos: THREE.SphereGeometry[] = [];
    sphereDefinitions.forEach((def) => {
      const geo = new THREE.SphereGeometry(def.radius, 64, 64);
      sphereGeos.push(geo);
      const mesh = new THREE.Mesh(geo, def.mat);
      scene.add(mesh);
      objects.push({
        mesh,
        basePos: new THREE.Vector3(0, 0, 0),
        freq: new THREE.Vector3(def.freq[0], def.freq[1], def.freq[2]),
        amp: new THREE.Vector3(def.amp[0], def.amp[1], def.amp[2]),
        rotSpeed: new THREE.Vector3(0.015, 0.02, 0.01),
        phase: def.phase,
        relX: def.relX,
        relY: def.relY,
        depthZ: def.depthZ,
        mobileScale: def.mobileScale,
      });
    });

    const updateObjectAnchors = () => {
      const { wSpan, hSpan } = getViewportSpanAtOrigin();
      const isMobile = window.innerWidth < 768;

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const scale = isMobile ? obj.mobileScale : 1.0;
        obj.mesh.scale.setScalar(scale);

        // On mobile portrait, push objects slightly further out vertically
        const posY = isMobile ? Math.sign(obj.relY) * Math.min(Math.abs(obj.relY * 1.15), 0.48) : obj.relY;
        const posX = isMobile ? Math.sign(obj.relX) * Math.min(Math.abs(obj.relX * 1.05), 0.46) : obj.relX;

        obj.basePos.set(
          posX * wSpan,
          posY * hSpan,
          obj.depthZ
        );
      }
    };

    updateObjectAnchors();

    // 6. Parallax & Motion Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 7. Resize Handler
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      updateCamera(w, h);
      updateObjectAnchors();
      renderer?.setSize(w, h, false);
      renderer?.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.0));
    };

    window.addEventListener('resize', onResize);

    // 8. Theme Observer
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

    // 9. High-Fidelity 60 FPS Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId = 0;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;

      const delta = Math.min(clock.getDelta(), 0.05); // capped physics step
      const elapsed = clock.getElapsedTime();

      // Smooth exponential mouse parallax damping
      const lerpFactor = 1 - Math.exp(-delta * 2.5);
      mouseX += (targetMouseX - mouseX) * lerpFactor;
      mouseY += (targetMouseY - mouseY) * lerpFactor;

      // Subtle, non-distracting camera parallax
      camera.position.x = mouseX * 0.35;
      camera.position.y = -mouseY * 0.25;
      camera.lookAt(0, 0, 0);

      // Continuous multi-harmonic levitation
      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        const t = elapsed * 0.85 + obj.phase;

        // Compound harmonic drift (avoids mechanical pendulum motion)
        const dx = Math.sin(t * obj.freq.x) * obj.amp.x + Math.sin(t * obj.freq.x * 0.53) * (obj.amp.x * 0.35);
        const dy = Math.cos(t * obj.freq.y) * obj.amp.y + Math.cos(t * obj.freq.y * 0.47) * (obj.amp.y * 0.3);
        const dz = Math.sin(t * obj.freq.z) * obj.amp.z;

        obj.mesh.position.x = obj.basePos.x + dx;
        obj.mesh.position.y = obj.basePos.y + dy;
        obj.mesh.position.z = obj.basePos.z + dz;

        obj.mesh.rotation.x += obj.rotSpeed.x * delta;
        obj.mesh.rotation.y += obj.rotSpeed.y * delta;
        obj.mesh.rotation.z += obj.rotSpeed.z * delta;
      }

      renderer?.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

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

    // Pause animation when page is hidden (saving power & GPU cycles)
    const onVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (!prefersReducedMotion && !isRunning) {
          isRunning = true;
          clock.getDelta(); // flush delta to avoid sudden leap
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    // 10. WebGL Context Recovery
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

    // 11. Cleanup
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

      // Dispose Three.js resources cleanly
      ribbon1Geo.dispose();
      ribbon2Geo.dispose();
      sphereGeos.forEach((g) => g.dispose());
      ivoryMat.dispose();
      terracottaMat.dispose();
      sandMat.dispose();
      pmremTarget?.dispose();
      renderer?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.backgroundWrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
