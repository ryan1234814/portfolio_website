export default function LiquidBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#03060f]"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* 1 — Mow-stripes */}
      <div className="pitch-stripes absolute inset-0" />

      {/* 2 — Floodlight pooling */}
      <div className="floodlight-glow absolute inset-0" />

      {/* 3 — Halfway line */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to bottom, transparent calc(50% - 0.5px), rgba(219,228,255,0.9) 50%, transparent calc(50% + 0.5px))',
        }}
      />

      {/* 4 — Centre circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[42vmin] h-[42vmin] rounded-full border border-plLime/20 opacity-[0.06]" />

      {/* 5 — Static gold grid */}
      <div
        className="absolute inset-0 opacity-[0.025] z-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #C8A754 1px, transparent 1px), linear-gradient(to bottom, #C8A754 1px, transparent 1px)',
          backgroundSize: '8vw 8vw',
        }}
      />

      {/* 6 — Top-left blue glow */}
      <div
        className="absolute top-[-18%] left-[-15%] w-[75vw] h-[75vw] md:w-[60vw] md:h-[60vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(10,58,158,0.34) 0%, rgba(3,36,119,0.14) 42%, rgba(3,36,119,0) 70%)',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* 7 — Bottom-right green glow */}
      <div
        className="absolute bottom-[-22%] right-[-15%] w-[85vw] h-[85vw] md:w-[68vw] md:h-[68vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(27,122,61,0.22) 0%, rgba(27,122,61,0.07) 45%, transparent 70%)',
          transform: 'translate3d(0,0,0)',
        }}
      />

      {/* 8 — Centre purple glow */}
      <div
        className="absolute top-[28%] left-[25%] w-[60vw] h-[60vw] md:w-[48vw] md:h-[48vw] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(56,0,60,0.28) 0%, rgba(56,0,60,0.08) 45%, transparent 68%)',
          transform: 'translate3d(0,0,0)',
        }}
      />
    </div>
  );
}
