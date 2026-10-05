import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Building2, CheckCircle2, ExternalLink } from 'lucide-react';
import { EXPERIENCES } from '../constants';

function ExperienceCard({ exp, idx }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.a
      href={exp.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.7, delay: idx * 0.12 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`group block relative bg-black/40 backdrop-blur-xl border rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden transition-all cursor-pointer ${
        exp.featured
          ? 'border-[#C8A754]/30 hover:border-[#C8A754]/80 hover:shadow-[0_0_40px_rgba(200,167,84,0.25)] bg-gradient-to-br from-black/60 via-black/40 to-[#C8A754]/5'
          : 'border-white/10 hover:border-white/20 hover:bg-black/60'
      }`}
    >
      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(200,167,84,0.15), transparent 70%)`,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          border: '1px solid rgba(200,167,84,0.7)',
          maskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, black 20%, transparent 100%)`,
        }}
      />

      {/* Ambient glow — animates on hover (Experience variant) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A754]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C8A754]/20 transition-all duration-500" />

      <div className="relative z-10 space-y-6">
        {/* Badges row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#C8A754] shadow-[0_0_15px_rgba(200,167,84,0.3)]">
              {exp.type}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <Calendar size={13} className="text-[#C8A754]" />
              {exp.duration}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <MapPin size={13} className="text-[#C8A754]" />
              {exp.location}
            </span>
          </div>
          {/* LinkedIn chip — decorative inside the <a> */}
          <div
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#C8A754] group-hover:bg-[#C8A754] group-hover:text-black group-hover:border-[#C8A754] transition-all duration-300"
          >
            <span>View LinkedIn Profile</span>
            <ExternalLink size={12} />
          </div>
        </div>

        {/* Role & org */}
        <div className="space-y-2">
          <h3 className="text-2xl md:text-4xl font-bold font-poppins text-white tracking-tight leading-tight group-hover:text-[#C8A754] transition-colors">
            {exp.role}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-base md:text-lg font-medium text-neutral-200">
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-[#C8A754] shrink-0" />
              <span className="text-white font-semibold">{exp.organization}</span>
            </div>
            <span className="hidden sm:inline text-neutral-600">&bull;</span>
            <span className="text-[#C8A754] font-light">{exp.collaboration}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-neutral-300 text-sm md:text-base leading-relaxed max-w-4xl">{exp.summary}</p>

        {/* Key Takeaways */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754]">
            Key Takeaways &amp; Contributions:
          </h4>
          <ul className="space-y-2.5">
            {exp.highlights.map((highlight, hIdx) => (
              <li key={hIdx} className="flex items-start gap-3 text-xs md:text-sm text-neutral-300">
                <CheckCircle2 size={16} className="text-[#C8A754] shrink-0 mt-0.5" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills pills */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {exp.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-neutral-300 group-hover:border-[#C8A754]/40 group-hover:text-white transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function Experience() {
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
              <Briefcase size={14} className="text-[#C8A754]" />
              // Work &bull; Industry Exposure
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Experience
            </h2>
          </div>
          <div className="text-left md:text-right">
            <span className="text-sm font-mono text-neutral-500 block">(Industry Internships)</span>
            <span className="text-sm font-mono text-neutral-500">IIIT Kottayam &bull; Olcademy</span>
          </div>
        </motion.div>

        <div className="space-y-8 mb-16">
          {EXPERIENCES.map((exp, idx) => (
            <ExperienceCard key={exp.id} exp={exp} idx={idx} />
          ))}
        </div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>Python Developer &amp; Data Scientist</span>
      </footer>
    </div>
  );
}
