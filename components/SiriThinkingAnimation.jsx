import React, { useEffect, useRef } from 'react';

// SiriThinkingAnimation — canvas-rendered liquid wave inside a glass capsule (PRD §7.4)

const SIZES = {
  xs: { box: 'w-[112px] h-[34px]', text: 'text-[12px]' },
  sm: { box: 'w-[126px] h-[38px]', text: 'text-[13.5px]' },
  md: { box: 'w-[151px] h-[46px]', text: 'text-[15px]' },
  lg: { box: 'w-[198px] h-[60px]', text: 'text-[18px]' },
};

export default function SiriThinkingAnimation({ size = 'md', label = 'Thinking...' }) {
  const canvasRef = useRef(null);
  const sizeCfg = SIZES[size] || SIZES.md;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let rafId = 0;

    const render = () => {
      rafId = requestAnimationFrame(render);
      if (document.hidden) return; // P3 — loop still schedules, draw skipped

      const dpr = Math.min(window.devicePixelRatio || 1, 2); // P4 — DPR capped at 2
      const clientWidth = canvas.clientWidth;
      const clientHeight = canvas.clientHeight;
      if (canvas.width !== Math.round(clientWidth * dpr) || canvas.height !== Math.round(clientHeight * dpr)) {
        canvas.width = Math.round(clientWidth * dpr);
        canvas.height = Math.round(clientHeight * dpr);
      }
      const width = canvas.width;
      const height = canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      time += 0.032;
      const baseHeight = height * 0.49;

      // 4 — base fill
      ctx.fillStyle = '#04070c';
      ctx.fillRect(0, 0, width, height);

      // 5 — blurred ambience (three ellipses)
      const blurPx = Math.max(4, Math.round(height * 0.16));
      ctx.save();
      try {
        ctx.filter = `blur(${blurPx}px)`;
      } catch {
        /* filter unsupported — draw sharp */
      }
      const ellipseFill = (cx, cy, rx, ry, stops) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        stops.forEach(([offset, color]) => g.addColorStop(offset, color));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.fill();
      };
      ellipseFill(0.16 * width, baseHeight - 0.10 * height, 0.22 * width, 0.25 * height, [
        [0, 'rgba(0,102,255,0.5)'],
        [0.5, 'rgba(0,85,255,0.22)'],
        [1, 'rgba(0,85,255,0)'],
      ]);
      ellipseFill(0.53 * width, baseHeight - 0.14 * height, 0.28 * width, 0.30 * height, [
        [0, 'rgba(200,167,84,0.65)'],
        [0.5, 'rgba(56,189,248,0.35)'],
        [1, 'rgba(56,189,248,0)'],
      ]);
      ellipseFill(0.86 * width, baseHeight - 0.11 * height, 0.24 * width, 0.28 * height, [
        [0, 'rgba(56,189,248,0.55)'],
        [0.5, 'rgba(0,140,255,0.28)'],
        [1, 'rgba(0,140,255,0)'],
      ]);
      ctx.restore();

      // 6 — wave path (60 steps, quadratic midpoint smoothing)
      const steps = 60;
      const wavePts = [];
      for (let i = 0; i <= steps; i++) {
        const nx = i / steps;
        const leftBias = Math.exp(-Math.pow((nx - 0.16) / 0.13, 2)) * (height * 0.11);
        const centreBias = Math.exp(-Math.pow((nx - 0.53) / 0.17, 2)) * (height * 0.085);
        const rightBias = Math.exp(-Math.pow((nx - 0.85) / 0.14, 2)) * (height * 0.12);
        const wave1 = Math.sin(nx * 8.5 + time * 1.5) * (height * 0.045);
        const wave2 = Math.cos(nx * 13.0 - time * 1.8) * (height * 0.026);
        const wave3 = Math.sin(nx * 4.2 + time * 0.8) * (height * 0.032);
        const y = baseHeight - leftBias - centreBias - rightBias + (wave1 + wave2 + wave3) * 0.8;
        wavePts.push({ x: nx * width, y });
      }

      const traceWave = () => {
        ctx.beginPath();
        ctx.moveTo(wavePts[0].x, wavePts[0].y);
        for (let i = 1; i < wavePts.length - 1; i++) {
          const midX = (wavePts[i].x + wavePts[i + 1].x) / 2;
          const midY = (wavePts[i].y + wavePts[i + 1].y) / 2;
          ctx.quadraticCurveTo(wavePts[i].x, wavePts[i].y, midX, midY);
        }
        ctx.lineTo(wavePts[wavePts.length - 1].x, wavePts[wavePts.length - 1].y);
      };

      // 7 — milky fluid fill
      traceWave();
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      const fluid = ctx.createLinearGradient(0, baseHeight - height * 0.15, 0, height);
      fluid.addColorStop(0, '#e8f4f8');
      fluid.addColorStop(0.2, '#d0e5ee');
      fluid.addColorStop(0.6, '#9cb8c9');
      fluid.addColorStop(1.0, '#506e82');
      ctx.fillStyle = fluid;
      ctx.fill();

      // 8 — cyan crest fill with fade mask
      ctx.save();
      traceWave();
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.globalCompositeOperation = 'source-atop';
      const crestX = ctx.createLinearGradient(0, 0, width, 0);
      crestX.addColorStop(0.0, 'rgba(0,102,255,0.95)');
      crestX.addColorStop(0.18, 'rgba(0,140,255,1)');
      crestX.addColorStop(0.36, 'rgba(2,175,240,1)');
      crestX.addColorStop(0.52, 'rgba(200,167,84,1)');
      crestX.addColorStop(0.68, 'rgba(186,246,255,1)');
      crestX.addColorStop(0.84, 'rgba(56,189,248,1)');
      crestX.addColorStop(1.0, 'rgba(0,119,255,0.95)');
      ctx.fillStyle = crestX;
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-in';
      const fade = ctx.createLinearGradient(0, baseHeight - height * 0.2, 0, height);
      fade.addColorStop(0, 'rgba(0,0,0,1)');
      fade.addColorStop(0.45, 'rgba(0,0,0,0.88)');
      fade.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 9 — crest stroke
      ctx.save();
      try {
        ctx.filter = 'blur(0.5px)';
      } catch {
        /* ignore */
      }
      traceWave();
      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      strokeGrad.addColorStop(0.05, 'rgba(0,119,255,0.85)');
      strokeGrad.addColorStop(0.3, 'rgba(200,167,84,1)');
      strokeGrad.addColorStop(0.55, 'rgba(235,253,255,1)');
      strokeGrad.addColorStop(0.75, 'rgba(200,167,84,1)');
      strokeGrad.addColorStop(0.95, 'rgba(56,189,248,0.85)');
      ctx.strokeStyle = strokeGrad;
      ctx.lineWidth = Math.max(1.1, height * 0.03);
      ctx.stroke();
      ctx.restore();

      // 10 — top specular band
      const spec = ctx.createLinearGradient(0, 0, 0, Math.max(4, height * 0.12));
      spec.addColorStop(0, 'rgba(255,255,255,0.4)');
      spec.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = spec;
      ctx.fillRect(0, 0, width, Math.max(4, height * 0.12));
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.85))' }}>
      {/* Breathing glow */}
      <div
        className="absolute -inset-1.5 rounded-full opacity-70 blur-md pointer-events-none animate-pulse"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,102,255,0.3) 0%, rgba(200,167,84,0.45) 50%, rgba(56,189,248,0.35) 100%)',
          animationDuration: '2.8s',
        }}
      />
      {/* Capsule */}
      <div
        className={`relative overflow-hidden rounded-full ${sizeCfg.box} flex items-center justify-center border border-[#C8A754]/25`}
        style={{
          background: '#04070c',
          boxShadow: `
            inset 0 1.5px 2px rgba(255, 255, 255, 0.45),
            inset 0 -1.5px 2px rgba(200, 167, 84, 0.2),
            inset 0 0 14px rgba(0, 0, 0, 0.7),
            0 6px 20px rgba(200, 167, 84, 0.15),
            0 10px 26px rgba(0, 0, 0, 0.8)
          `,
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        {/* Gloss sheen */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0.2) 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5)',
          }}
        />
        {/* Label */}
        <span
          className={`relative z-10 ${sizeCfg.text} text-white font-medium`}
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Rounded", "SF Pro Display", "SF Pro Text", "Manrope", sans-serif',
            textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(200,167,84,0.5)',
            letterSpacing: '-0.015em',
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
