import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Building2 } from 'lucide-react';
import { EDUCATION_DATA } from '../constants';

// Cursor spotlight layers — identical to the Experience cards (§5.7)
function Spotlight({ isHovered, mousePos }) {
  return (
    <>
      {/* Layer 1 — radial glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200,167,84,0.15), transparent 70%)`,
        }}
      />
      {/* Layer 2 — border shine */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          border: '1px solid rgba(200,167,84,0.7)',
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
        }}
      />
    </>
  );
}

function EducationCard({ edu, idx }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: idx * 0.12 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden transition-all ${
        edu.featured
          ? 'border-[#C8A754]/30 hover:border-[#C8A754]/60 bg-gradient-to-br from-black/60 via-black/40 to-[#C8A754]/5'
          : 'border-white/10 hover:border-white/20 hover:bg-black/60'
      }`}
    >
      <Spotlight isHovered={isHovered} mousePos={mousePos} />

      {edu.featured && (
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A754]/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                edu.featured
                  ? 'text-black bg-[#C8A754] shadow-[0_0_15px_rgba(200,167,84,0.3)]'
                  : 'text-[#C8A754] bg-[#C8A754]/10 border border-[#C8A754]/20'
              }`}
            >
              {edu.level}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <Calendar size={13} className="text-[#C8A754]" />
              {edu.year}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <MapPin size={13} className="text-[#C8A754]" />
              {edu.location}
            </span>
          </div>

          <div>
            <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight leading-tight">
              {edu.degree}
            </h3>
            {edu.field && <p className="text-lg md:text-xl text-[#C8A754] font-light mt-1">{edu.field}</p>}
          </div>

          <div className="flex items-center gap-2 text-sm md:text-base font-mono text-neutral-300 pt-1">
            <Building2 size={16} className="text-[#C8A754] shrink-0" />
            <span className="font-semibold text-white">{edu.institute}</span>
          </div>
        </div>

        {/* Right — metric cards */}
        <div className="flex flex-wrap lg:flex-col items-stretch gap-3 shrink-0 lg:min-w-[240px]">
          {edu.metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-center flex-1 lg:flex-none"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                {metric.label}
              </span>
              <span className={`text-xl md:text-2xl font-bold font-mono ${metric.highlight ? 'text-[#C8A754]' : 'text-white'}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Education() {
  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between">
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Stacked section header (§2.7) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
              <GraduationCap size={14} className="text-[#C8A754]" />
              // Academic Background &bull; Higher Studies
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Academic
              <br />
              Journey
            </h2>
          </div>
          <div className="text-left md:text-right">
            <span className="text-sm font-mono text-neutral-500">(2023 — 2027)</span>
          </div>
        </motion.div>

        <div className="space-y-8 mb-16">
          {EDUCATION_DATA.map((edu, idx) => (
            <EducationCard key={edu.id} edu={edu} idx={idx} />
          ))}
        </div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>Rajagiri School of Engineering &amp; Technology &bull; CSE</span>
      </footer>
    </div>
  );
}
