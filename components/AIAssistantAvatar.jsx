import React, { useEffect, useRef } from 'react';

// AIAssistantAvatar — "Ryo's face"
// Writes SVG transform attributes directly and only when the string changes
// (P7) — no React re-render per frame.

const PEBBLE_PATH =
  'M 57.5 15.5 C 65.5 15.5, 72.8 17.2, 78.5 20.2 C 84.2 23.2, 87.6 28.5, 89.2 36.0 ' +
  'C 90.2 40.8, 90.0 46.5, 89.2 51.5 C 88.0 59.0, 85.0 66.5, 80.5 72.5 ' +
  'C 75.5 79.2, 67.5 83.8, 59.5 85.2 C 54.5 86.0, 48.5 85.8, 42.0 84.8 ' +
  'C 34.0 83.2, 25.5 79.2, 19.5 73.0 C 13.5 66.8, 10.0 58.5, 9.5 49.5 ' +
  'C 9.0 41.5, 11.5 33.5, 16.0 27.2 C 20.5 21.0, 27.8 17.5, 36.5 16.0 ' +
  'C 43.5 15.0, 51.0 15.5, 57.5 15.5 Z';

export default function AIAssistantAvatar({
  size = 28,
  className = '',
  glow = true,
  trackCursor = true,
  blink = true,
}) {
  const containerRef = useRef(null);
  const blobGroupRef = useRef(null);
  const eyesGroupRef = useRef(null);
  const idPrefix = useRef(`avatar-${Math.random().toString(36).substring(2, 8)}`).current;

  useEffect(() => {
    let elementCenter = { x: 0, y: 0 };
    let target = { bodyX: 0, bodyY: 0, rotate: 0, eyeX: 0, eyeY: 0, blinkScale: 1 };
    let current = { bodyX: 0, bodyY: 0, rotate: 0, eyeX: 0, eyeY: 0 };
    let blinkProgress = 0;
    let isBlinking = false;
    let nextBlinkAt = Date.now() + 3000 + Math.random() * 3000;
    let rafId = 0;

    let lastBodyStr = '';
    let lastEyeStr = '';

    const updateCenter = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) elementCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    updateCenter();
    window.addEventListener('resize', updateCenter);

    const onMouseMove = (e) => {
      const dx = e.clientX - elementCenter.x;
      const dy = e.clientY - elementCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const factor = Math.min(1, distance / 200);
      const angle = Math.atan2(dy, dx);
      target.bodyX = Math.cos(angle) * (factor * 4.8);
      target.bodyY = Math.sin(angle) * (factor * 3.6);
      target.rotate = Math.cos(angle) * (factor * 5.5); // ±5.5° lean
      target.eyeX = Math.cos(angle) * (factor * 11.0);
      target.eyeY = Math.sin(angle) * (factor * 9.0);
    };

    if (trackCursor) {
      window.addEventListener('mousemove', onMouseMove);
    }

    const applyTransforms = () => {
      if (blobGroupRef.current) {
        const bodyStr = `translate(${current.bodyX.toFixed(1)}, ${current.bodyY.toFixed(1)}) rotate(${current.rotate.toFixed(1)}, 50, 50)`;
        if (bodyStr !== lastBodyStr) {
          blobGroupRef.current.setAttribute('transform', bodyStr);
          lastBodyStr = bodyStr;
        }
      }
      if (eyesGroupRef.current) {
        const eyeStr = `translate(${current.eyeX.toFixed(1)}, ${current.eyeY.toFixed(1)}) translate(0, 46.5) scale(1, ${target.blinkScale.toFixed(2)}) translate(0, -46.5)`;
        if (eyeStr !== lastEyeStr) {
          eyesGroupRef.current.setAttribute('transform', eyeStr);
          lastEyeStr = eyeStr;
        }
      }
    };

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      if (document.hidden) return; // cheap pause; the avatar redraw is tiny

      // Lerp toward targets (body 0.12, eyes 0.16)
      current.bodyX += (target.bodyX - current.bodyX) * 0.12;
      current.bodyY += (target.bodyY - current.bodyY) * 0.12;
      current.rotate += (target.rotate - current.rotate) * 0.12;
      current.eyeX += (target.eyeX - current.eyeX) * 0.16;
      current.eyeY += (target.eyeY - current.eyeY) * 0.16;

      // Blink scheduling
      if (blink) {
        const now = Date.now();
        if (!isBlinking && now >= nextBlinkAt) {
          isBlinking = true;
          blinkProgress = 0;
        }
        if (isBlinking) {
          blinkProgress += 0.18;
          target.blinkScale = 1 - Math.sin(blinkProgress * Math.PI) * 0.9;
          if (blinkProgress >= 1) {
            isBlinking = false;
            target.blinkScale = 1;
            nextBlinkAt = now + 3500 + Math.random() * 3500;
          }
        }
      }

      applyTransforms();
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updateCenter);
      if (trackCursor) window.removeEventListener('mousemove', onMouseMove);
    };
  }, [trackCursor, blink]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ width: size, height: size }}>
      {glow && (
        <div
          className="absolute inset-[-35%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200,167,84,0.45) 0%, rgba(200,167,84,0) 70%)' }}
        />
      )}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible transition-transform duration-200 hover:scale-108">
        <defs>
          <linearGradient id={`${idPrefix}-neonGradient`} x1="20%" y1="12%" x2="85%" y2="88%">
            <stop offset="0%" stopColor="#2df7ff" />
            <stop offset="45%" stopColor="#C8A754" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-specularSheen`} x1="50%" y1="15%" x2="50%" y2="60%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.55)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-eyeColor`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#04060d" />
            <stop offset="100%" stopColor="#070c17" />
          </linearGradient>
        </defs>

        {/* Body */}
        <g ref={blobGroupRef}>
          <path d={PEBBLE_PATH} stroke="#C8A754" strokeWidth="3.0" opacity="0.38" fill="none" />
          <path d={PEBBLE_PATH} fill={`url(#${idPrefix}-neonGradient)`} />
          <path d={PEBBLE_PATH} fill={`url(#${idPrefix}-specularSheen)`} />
          <path d={PEBBLE_PATH} fill="none" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" />
        </g>

        {/* Eyes — vertical capsules, right eye 1px higher */}
        <g ref={eyesGroupRef}>
          <rect x="36.8" y="37.5" width="9.4" height="19.0" rx="4.7" ry="4.7" fill={`url(#${idPrefix}-eyeColor)`} />
          <rect x="59.3" y="36.5" width="9.4" height="19.0" rx="4.7" ry="4.7" fill={`url(#${idPrefix}-eyeColor)`} />
        </g>
      </svg>
    </div>
  );
}
