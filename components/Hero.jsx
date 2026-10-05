import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero({ onNavigate }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax transforms over scrollYProgress 0→1
  const davidX = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const davidY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const davidOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const vargheseX = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const vargheseY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const vargheseOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const badgeY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const badgeOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  const handleAboutClick = (e) => {
    e.preventDefault();
    onNavigate('profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex flex-col justify-between px-6 md:px-12 pt-6 pb-12 bg-transparent relative overflow-hidden"
    >
      {/* Badge row */}
      <motion.div
        style={{ y: badgeY, opacity: badgeOpacity }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mt-[90px] md:mt-28 flex items-center gap-3 mb-2"
      >
        <span className="w-2 h-2 rounded-full bg-[#C8A754] animate-pulse" />
        <p className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-400">
          Python Developer &amp; Data Scientist &bull; 2026
        </p>
        <span className="scoreboard-label text-[10px] md:text-xs text-[#C8A754]/80 border border-[#C8A754]/30 rounded-full px-2.5 py-0.5 hidden sm:inline-block">
          Pride of London
        </span>
      </motion.div>

      {/* Name block */}
      <div className="w-full relative z-10 my-auto py-6">
        <motion.h1
          style={{ x: davidX, y: davidY, opacity: davidOpacity }}
          className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap cursor-default pb-4 will-change-transform"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        >
          Ryan
        </motion.h1>
        <motion.h1
          style={{ x: vargheseX, y: vargheseY, opacity: vargheseOpacity }}
          className="liquid-glass-text liquid-hover font-oswald text-[18vw] md:text-[15vw] leading-[0.8] font-bold uppercase tracking-tighter whitespace-nowrap cursor-default pb-4 will-change-transform ml-0 md:ml-24"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, delay: 0.04, ease: [0.16, 1, 0.3, 1] }}
        >
          George
        </motion.h1>

        {/* Matchday profile card */}
        <motion.div
          style={{ y: badgeY, opacity: badgeOpacity }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-6 md:mt-8 ml-0 md:ml-24 max-w-2xl backdrop-blur-md bg-black/40 p-6 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="text-xs font-mono text-[#C8A754] uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A754]" />
            // The Matchday Profile
          </div>
          <p className="text-neutral-300 text-sm md:text-base font-normal leading-relaxed">
            I’m Ryan George Koickal, a B.Tech CSE student (CGPA 9.21) and Python developer / data
            scientist building edge-AI systems, production-grade Generative AI pipelines (RAG), and
            multi-agent LLM systems. I translate complex ML models into intuitive, actionable
            applications — from offline bird recognition on Raspberry Pi to real-time AQI digital
            twins and travel agents.
          </p>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <motion.div
        style={{ y: scrollIndicatorY, opacity: scrollIndicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.18 }}
        className="flex justify-between items-end border-t border-neutral-800/80 pt-6 mt-6"
      >
        <button
          onClick={handleAboutClick}
          className="group flex items-center gap-3 text-xs font-mono font-bold uppercase tracking-widest text-neutral-400 hover:text-[#C8A754] transition-colors cursor-pointer"
        >
          <span className="w-6 h-[1px] bg-neutral-600 group-hover:w-10 group-hover:bg-[#C8A754] transition-all duration-300" />
          About Me &rarr;
        </button>
        <div className="text-xs font-mono text-neutral-500 hidden sm:block">&copy; 2026 Ryan George</div>
      </motion.div>
    </section>
  );
}
