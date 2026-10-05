import { useEffect, useRef } from 'react';

// InteractiveParticles — canvas parallax field that collapses into a rotating
// 3D football on navigation (PRD §6.1). All live values flow through refs; the
// effect has [] deps (P14).

const PALETTE_COLORS = ['#ffffff', '#C8A754', '#3f6fd8', '#0a3a9e', '#3ba86a'];
// white (away kit), gold, light blue, royal blue, pitch green

export default function InteractiveParticles({ activePage = 'home', sphereTransitionId = 0, pullSphereProgressRef }) {
  const canvasRef = useRef(null);

  // Refs mirroring props so the [] effect never re-subscribes
  const activePageRef = useRef(activePage);
  activePageRef.current = activePage;
  const lastSphereIdRef = useRef(sphereTransitionId);

  const parallax = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const particlesRef = useRef([]);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const isLoopRunningRef = useRef(false);
  const lastTimeRef = useRef(0);
  // useRef is called unconditionally — a short-circuited `||` would change the
  // hook order whenever the parent stops/starts passing the prop.
  const fallbackPullRef = useRef(0);
  const pullSphereProgressRefLocal = pullSphereProgressRef || fallbackPullRef;
  const smoothedPullRef = useRef(0);

  // Sphere transition timeline state
  const transitionStateRef = useRef({
    startTime: 0,
    active: false,
    startedFromPull: false,
  });

  // Start the sphere timeline when the transition id changes. This lives in an
  // effect (not the render body) because it reads refs declared above and
  // mutates state the RAF loop consumes; touching them during render threw a
  // TDZ ReferenceError on navigation.
  useEffect(() => {
    if (lastSphereIdRef.current === sphereTransitionId) return;
    lastSphereIdRef.current = sphereTransitionId;
    if (sphereTransitionId > 0) {
      transitionStateRef.current = {
        startTime: performance.now(),
        active: true,
        startedFromPull: (pullSphereProgressRefLocal.current || 0) >= 0.8,
      };
      pullSphereProgressRefLocal.current = 0;
    }
  }, [sphereTransitionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Particle initialisation (Fibonacci sphere shells) ----
    const initParticles = (count) => {
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const particles = [];
      for (let i = 0; i < count; i++) {
        const y3d = 1 - (i / Math.max(1, count - 1)) * 2; // 1 → -1
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y3d * y3d));
        const theta = goldenAngle * i;
        const shellR = 0.86 + (i % 5) * 0.035;
        const sx3d = Math.cos(theta) * radiusAtY * shellR;
        const sy3d = y3d * shellR;
        const sz3d = Math.sin(theta) * radiusAtY * shellR;

        const depth = 0.2 + Math.pow(Math.random(), 1.4) * 0.8; // 0.2 … 1.0
        const size = 0.9 + depth * 1.0; // 0.9 … 1.9 px
        const speed = (0.04 + Math.random() * 0.08) * depth;
        const angle = Math.random() * Math.PI * 2;

        particles.push({
          sx3d, sy3d, sz3d,
          x: Math.random() * widthRef.current,
          y: Math.random() * heightRef.current,
          depth,
          size,
          speed,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          colorIndex: Math.floor(Math.random() * PALETTE_COLORS.length),
          baseAlpha: 0.25 + depth * 0.55,
          shimmerSpeed: 0.01 + Math.random() * 0.02,
          shimmerPhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    // ---- Canvas sizing: dpr = 1 deliberately (P1) — cuts GPU fill-rate up to
    // 4x on Retina; particles are 1-2 px so the loss is invisible.
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      widthRef.current = width;
      heightRef.current = height;
    };

    resizeCanvas();
    const isMobile = window.innerWidth < 768;
    initParticles(isMobile ? 65 : 120);

    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      const isMobileScrollResize =
        newWidth === lastWidth && Math.abs(newHeight - lastHeight) < 160;
      if (isMobileScrollResize) {
        // address-bar collapse: re-size the canvas only — do NOT rescale/re-init
        resizeCanvas();
      } else {
        // genuine resize/orientation: scale every particle, then re-init
        const scaleX = newWidth / (lastWidth || newWidth);
        const scaleY = newHeight / (lastHeight || newHeight);
        particlesRef.current.forEach((p) => {
          p.x *= scaleX;
          p.y *= scaleY;
        });
        resizeCanvas();
        const nowMobile = newWidth < 768;
        initParticles(nowMobile ? 65 : 120);
      }
      lastWidth = newWidth;
      lastHeight = newHeight;
    };
    window.addEventListener('resize', handleResize);

    // ---- Parallax input (priority: mouse < orientation < motion < touch) ----
    let hasOrientationData = false;
    let lastOrientationTime = 0;
    let orientationBaseline = { gamma: null, beta: null };
    let sensorListenersAttached = false;

    const handleMouseMove = (e) => {
      if (hasOrientationData) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      parallax.current.targetX = -((e.clientX - centerX) / centerX) * 65;
      parallax.current.targetY = -((e.clientY - centerY) / centerY) * 65;
    };
    const handleMouseLeave = () => {
      parallax.current.targetX = 0;
      parallax.current.targetY = 0;
    };

    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
    const tiltSensitivity = 22;

    const handleOrientation = (e) => {
      hasOrientationData = true;
      lastOrientationTime = performance.now();
      const gamma = e.gamma ?? 0;
      const beta = e.beta ?? 0;
      if (orientationBaseline.gamma === null) {
        orientationBaseline = { gamma, beta };
        return;
      }
      const dGamma = clamp((gamma - orientationBaseline.gamma) / tiltSensitivity, -1, 1);
      const dBeta = clamp((beta - orientationBaseline.beta) / tiltSensitivity, -1, 1);
      parallax.current.targetX = -dGamma * 70;
      parallax.current.targetY = -dBeta * 70;
    };

    const handleMotion = (e) => {
      if (performance.now() - lastOrientationTime < 1500) return; // orientation wins
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const isIOS = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
      const sign = isIOS ? -1 : 1;
      const normX = clamp((acc.x * sign) / 5.5, -1, 1);
      const normY = clamp((acc.y - 7.5) / 5.5, -1, 1);
      parallax.current.targetX = normX * 65;
      parallax.current.targetY = -normY * 65;
    };

    let touchParallaxActive = false;
    const handleTouchMove = (e) => {
      if (hasOrientationData || sensorListenersAttached) return;
      const t = e.touches && e.touches[0];
      if (!t) return;
      touchParallaxActive = true;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      parallax.current.targetX = -((t.clientX - centerX) / centerX) * 40;
      parallax.current.targetY = -((t.clientY - centerY) / centerY) * 40;
    };
    const handleTouchEnd = () => {
      if (touchParallaxActive) {
        parallax.current.targetX = 0;
        parallax.current.targetY = 0;
        touchParallaxActive = false;
      }
    };

    // iOS 13+ permission gating — requested from a user gesture, failures swallowed
    const requestIOSPermission = () => {
      const attach = () => {
        if (sensorListenersAttached) return;
        sensorListenersAttached = true;
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        window.addEventListener('deviceorientationabsolute', handleOrientation, { passive: true });
        window.addEventListener('devicemotion', handleMotion, { passive: true });
      };
      try {
        if (typeof window.DeviceOrientationEvent !== 'undefined' &&
            typeof window.DeviceOrientationEvent.requestPermission === 'function') {
          window.DeviceOrientationEvent.requestPermission()
            .then((res) => { if (res === 'granted') attach(); })
            .catch(() => {});
        } else if (typeof window.DeviceMotionEvent !== 'undefined' &&
                   typeof window.DeviceMotionEvent.requestPermission === 'function') {
          window.DeviceMotionEvent.requestPermission()
            .then((res) => { if (res === 'granted') attach(); })
            .catch(() => {});
        } else {
          attach();
        }
      } catch {
        /* swallow */
      }
    };

    const handleGestureStart = () => requestIOSPermission();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchstart', handleGestureStart, { passive: true });
    window.addEventListener('click', handleGestureStart, { passive: true });

    // ---- Sphere timeline helpers ----
    const cubicEaseInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    // ---- Render loop ----
    let rafId = 0;
    const margin = 50;

    const render = (currentTime) => {
      rafId = requestAnimationFrame(render);
      if (document.hidden) {
        isLoopRunningRef.current = false;
        cancelAnimationFrame(rafId);
        return;
      }

      const width = widthRef.current;
      const height = heightRef.current;
      const dt = Math.min((currentTime - lastTimeRef.current) / 16.67, 2.0);
      lastTimeRef.current = currentTime;
      if (dt <= 0) return;

      const lerpSpeed = prefersReducedMotion ? 0.03 : 0.08;
      parallax.current.currentX += (parallax.current.targetX - parallax.current.currentX) * lerpSpeed * dt;
      parallax.current.currentY += (parallax.current.targetY - parallax.current.currentY) * lerpSpeed * dt;

      // Pull-to-sphere smoothing
      const rawPull = clamp(pullSphereProgressRefLocal.current || 0, 0, 1);
      smoothedPullRef.current += (rawPull - smoothedPullRef.current) * Math.min(1, 0.22 * dt);
      if (Math.abs(rawPull - smoothedPullRef.current) < 0.001) smoothedPullRef.current = rawPull;

      // Tab-sphere timeline
      const ts = transitionStateRef.current;
      let transitionBlend = 0;
      if (ts.active) {
        const elapsed = currentTime - ts.startTime;
        const gatherDur = ts.startedFromPull ? 120 : 680;
        const holdDur = 260;
        const spreadDur = 760;
        if (elapsed < gatherDur) {
          transitionBlend = ts.startedFromPull ? 1 : cubicEaseInOut(elapsed / gatherDur);
        } else if (elapsed < gatherDur + holdDur) {
          transitionBlend = 1;
        } else if (elapsed < gatherDur + holdDur + spreadDur) {
          const t = (elapsed - gatherDur - holdDur) / spreadDur;
          transitionBlend = 1 - Math.pow(1 - t, 3);
        } else {
          transitionBlend = 0;
          ts.active = false;
        }
      }

      const sphereBlend = Math.max(transitionBlend, smoothedPullRef.current);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const sphereRadius = Math.max(
        76,
        Math.min(130, Math.min(width, height) * (width < 768 ? 0.19 : 0.15))
      );
      const rotY = currentTime * 0.0018 + parallax.current.currentX * 0.006;
      const rotX = Math.sin(currentTime * 0.001) * 0.35 - parallax.current.currentY * 0.006;
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const glowX = centerX + parallax.current.currentX * 0.22;
      const glowY = centerY + parallax.current.currentY * 0.22;

      // Core glow (before particles)
      if (sphereBlend > 0.02) {
        const sphereGlowAlpha = sphereBlend * 0.25;
        const grad = ctx.createRadialGradient(glowX, glowY, 2, glowX, glowY, sphereRadius * 1.6);
        grad.addColorStop(0, `rgba(200, 167, 84, ${sphereGlowAlpha})`);
        grad.addColorStop(0.5, `rgba(63, 111, 216, ${sphereGlowAlpha * 0.45})`);
        grad.addColorStop(1, 'rgba(200, 167, 84, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(glowX, glowY, sphereRadius * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      const particles = particlesRef.current;
      const positions = new Array(particles.length);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient drift + wrap
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < -margin) p.x = width + margin;
        if (p.x > width + margin) p.x = -margin;
        if (p.y < -margin) p.y = height + margin;
        if (p.y > height + margin) p.y = -margin;
        if (!prefersReducedMotion) p.shimmerPhase += p.shimmerSpeed * dt;

        // Sphere projection
        const x1 = p.sx3d * cosY - p.sz3d * sinY;
        const z1 = p.sx3d * sinY + p.sz3d * cosY;
        const y2 = p.sy3d * cosX - z1 * sinX;
        const z2 = p.sy3d * sinX + z1 * cosX;
        const persp = 1 / (1 - z2 * 0.28);
        const sphereX = centerX + x1 * sphereRadius * persp + parallax.current.currentX * 0.22;
        const sphereY = centerY + y2 * sphereRadius * persp + parallax.current.currentY * 0.22;

        const renderX = p.x + (sphereX - p.x) * sphereBlend;
        const renderY = p.y + (sphereY - p.y) * sphereBlend;
        const renderSize = p.size + (p.size * (0.95 + 0.4 * persp) - p.size) * sphereBlend;

        positions[i] = { x: renderX, y: renderY, size: renderSize };
      }

      // Batched draw: one path + one fill per palette colour (P8)
      ctx.save();
      for (let c = 0; c < PALETTE_COLORS.length; c++) {
        ctx.beginPath();
        let drew = false;
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].colorIndex !== c) continue;
          const pos = positions[i];
          ctx.moveTo(pos.x + pos.size, pos.y);
          ctx.arc(pos.x, pos.y, pos.size, 0, Math.PI * 2);
          drew = true;
        }
        if (drew) {
          ctx.fillStyle = PALETTE_COLORS[c];
          ctx.globalAlpha = 0.7;
          ctx.fill();
        }
      }
      ctx.restore();
    };

    isLoopRunningRef.current = true;
    lastTimeRef.current = performance.now();
    rafId = requestAnimationFrame(render);

    const handleVisibility = () => {
      if (document.hidden) {
        isLoopRunningRef.current = false;
        cancelAnimationFrame(rafId);
      } else {
        if (!isLoopRunningRef.current) {
          isLoopRunningRef.current = true;
          lastTimeRef.current = performance.now();
          rafId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchstart', handleGestureStart);
      window.removeEventListener('click', handleGestureStart);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (sensorListenersAttached) {
        window.removeEventListener('deviceorientation', handleOrientation);
        window.removeEventListener('deviceorientationabsolute', handleOrientation);
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="parallax-particles-canvas"
      className="fixed inset-0 z-[1] pointer-events-none w-full h-full"
      aria-hidden="true"
    />
  );
}
