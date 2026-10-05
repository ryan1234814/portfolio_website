import React from 'react';
import { motion } from 'framer-motion';

const BALL_SIZE = 56;

function GoalNet() {
  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
    >
      <defs>
        <pattern id="netMesh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.14)" strokeWidth="0.35" />
          <line x1="0" y1="0" x2="7" y2="0" stroke="rgba(255,255,255,0.14)" strokeWidth="0.35" />
        </pattern>
        <linearGradient id="netFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id="rippleMask">
          <rect x="-100" y="0" width="100" height="100" fill="url(#netFade)">
            <animate
              attributeName="x"
              values="-100;100"
              dur="1s"
              fill="freeze"
              begin="0s"
              calcMode="spline"
              keySplines="0.22 1 0.36 1"
              keyTimes="0;1"
            />
          </rect>
        </mask>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#netMesh)" mask="url(#rippleMask)" />
    </svg>
  );
}

// Halo + comet trail — never rotated, so it always points backwards along the
// direction of travel.
function FootballGlow({ direction }) {
  const movingRight = direction === 'left';
  const trailSide = movingRight ? 'right' : 'left';
  const trailGradient = movingRight
    ? 'linear-gradient(to left, rgba(200,167,84,0.7), rgba(200,167,84,0.12) 45%, rgba(200,167,84,0) 100%)'
    : 'linear-gradient(to right, rgba(200,167,84,0.7), rgba(200,167,84,0.12) 45%, rgba(200,167,84,0) 100%)';

  return (
    <>
      {/* Pulsing halo — sits behind the ball */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: BALL_SIZE * 2.9,
          height: BALL_SIZE * 2.9,
          background:
            'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(200,167,84,0.45) 22%, rgba(63,111,216,0.28) 46%, rgba(200,167,84,0) 70%)',
        }}
        animate={{ scale: [0.82, 1.12, 0.82], opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 0.62, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Comet trail — anchored on the ball's trailing edge */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ [trailSide]: '100%', width: BALL_SIZE * 2.6, height: 4 }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: trailGradient,
            transformOrigin: movingRight ? 'right center' : 'left center',
          }}
          initial={{ scaleX: 0.15, opacity: 0 }}
          animate={{ scaleX: [0.15, 1, 1, 0.2], opacity: [0, 0.9, 0.9, 0] }}
          transition={{ duration: 1.25, times: [0, 0.55, 0.85, 1], ease: 'easeOut' }}
        />
      </div>

      {/* Secondary wider streak for depth */}
      <div
        className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ [trailSide]: '100%', width: BALL_SIZE * 3.4, height: 10 }}
      >
        <motion.div
          className="w-full h-full rounded-full blur-md"
          style={{
            background: movingRight
              ? 'linear-gradient(to left, rgba(10,58,158,0.45), rgba(10,58,158,0) 100%)'
              : 'linear-gradient(to right, rgba(10,58,158,0.45), rgba(10,58,158,0) 100%)',
            transformOrigin: movingRight ? 'right center' : 'left center',
          }}
          initial={{ scaleX: 0.1, opacity: 0 }}
          animate={{ scaleX: [0.1, 0.9, 0.9, 0.15], opacity: [0, 0.55, 0.55, 0] }}
          transition={{ duration: 1.25, times: [0, 0.55, 0.85, 1], ease: 'easeOut' }}
        />
      </div>

      </>
  );
}

// The ball itself — this is the only layer that rotates.
function FootballSvg() {
  return (
    <svg
        width={BALL_SIZE}
        height={BALL_SIZE}
        viewBox="0 0 100 100"
        className="relative"
        style={{
          overflow: 'visible',
          filter:
            'drop-shadow(0 0 8px rgba(200,167,84,0.85)) drop-shadow(0 0 22px rgba(200,167,84,0.55)) drop-shadow(0 0 40px rgba(10,58,158,0.6))',
        }}
      >
        {/* body */}
        <circle cx="50" cy="50" r="47" fill="#ffffff" stroke="#0a3a9e" strokeWidth="3" />
        {/* inner emissive fill */}
        <circle cx="50" cy="50" r="44" fill="url(#ballGlow)" />
        {/* centre pentagon */}
        <polygon points="50,30 63,40 58,55 42,55 37,40" fill="#032477" stroke="#C8A754" strokeWidth="1.5" />
        {/* five spokes from pentagon vertices to the rim */}
        <g stroke="#0a3a9e" strokeWidth="2.5" strokeLinecap="round">
          <line x1="50" y1="30" x2="50" y2="4" />
          <line x1="63" y1="40" x2="87" y2="26" />
          <line x1="58" y1="55" x2="78" y2="84" />
          <line x1="42" y1="55" x2="22" y2="84" />
          <line x1="37" y1="40" x2="13" y2="26" />
        </g>
        {/* gold rim light */}
        <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(200,167,84,0.55)" strokeWidth="1.5" />
        <defs>
          <radialGradient id="ballGlow" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="55%" stopColor="rgba(243,232,206,0.35)" />
            <stop offset="100%" stopColor="rgba(200,167,84,0.55)" />
          </radialGradient>
        </defs>
    </svg>
  );
}

function FootballMotion({ direction, spin }) {
  return (
    <>
      <FootballGlow direction={direction} />
      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, spin, spin + 40, spin + 40] }}
        transition={{ duration: 1.25, times: [0, 0.55, 0.85, 1], ease: ['easeIn', 'easeOut', 'linear'] }}
      >
        <FootballSvg />
      </motion.div>
    </>
  );
}

export default function GoalNetTransition({ transitionId, active, direction, label }) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const centerX = vw / 2;
  const stopX =
    direction === 'left' ? centerX - 90 - BALL_SIZE / 2 : centerX + 90 - BALL_SIZE / 2;
  const startX = direction === 'left' ? -BALL_SIZE - 20 : vw + 20;
  const travel = Math.abs(stopX - startX);
  const spins = (travel / (Math.PI * BALL_SIZE)) * 360;
  const spin = direction === 'left' ? spins : -spins;

  return (
    <motion.div
      key={transitionId}
      className="fixed inset-0 z-[80] pointer-events-none overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
    >
      {/* Layer 1 — goal-net ripple */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 1.25, times: [0, 0.4, 1], ease: 'easeInOut' }}
      >
        <GoalNet />
      </motion.div>

      {/* Layer 2 — section label */}
      <motion.div
        className="absolute bottom-[7vh] left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: 'easeOut' }}
      >
        <span className="scoreboard-label text-sm md:text-lg font-oswald text-[#C8A754] tracking-[0.3em]">
          {label}
        </span>
      </motion.div>

      {/* Layer 3 — glowing rolling football.
          Outer div owns travel (x + opacity) and holds the halo/trail, which must
          stay axis-aligned; only the ball SVG spins, so the roll reads as a roll. */}
      <motion.div
        className="absolute"
        style={{ bottom: '6.5vh', left: 0, width: BALL_SIZE, height: BALL_SIZE, willChange: 'transform' }}
        initial={{ x: startX, opacity: 0 }}
        animate={{
          x: [startX, stopX, stopX, stopX],
          opacity: [0, 1, 1, 0],
        }}
        transition={{ duration: 1.25, times: [0, 0.55, 0.85, 1], ease: ['easeIn', 'easeOut', 'linear'] }}
      >
        <FootballMotion direction={direction} spin={spin} />
      </motion.div>
    </motion.div>
  );
}