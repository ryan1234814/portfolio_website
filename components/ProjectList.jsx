import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import { PROJECTS } from '../constants';

export default function ProjectList() {
  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between">
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Simplified header variant (A) — §2.7 callout, §5.5 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
              <FolderGit2 size={14} className="text-[#C8A754]" />
              // First Team &bull; Matchday Archive
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Matchday
              <br />
              Squad
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-sm font-mono text-neutral-500 block">(2025 — 2026)</span>
            <span className="text-sm font-mono text-neutral-500">{PROJECTS.length} Featured Projects</span>
          </div>
        </motion.div>

        {/* Ticket-stub cards — stacked with no gap so the notches read as a continuous strip */}
        <div className="relative flex flex-col mb-16">
          {PROJECTS.map((project, index) => (
            <motion.a
              key={project.id}
              href={project.link || undefined}
              target={project.link ? '_blank' : undefined}
              rel={project.link ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group ticket-stub relative border border-[#C8A754]/15 py-10 md:py-14 flex flex-col md:flex-row md:items-baseline justify-between cursor-pointer transition-all duration-300 hover:bg-[#C8A754]/[0.05] hover:border-[#C8A754]/35 px-8 md:px-10 rounded-2xl backdrop-blur-sm bg-[#0a1230]/30 text-left no-underline block w-full"
            >
              <div className="flex items-baseline gap-4 md:gap-12 z-10 pointer-events-none">
                <span className="scoreboard-label text-[11px] font-bold text-neutral-500 tracking-widest group-hover:text-[#C8A754] transition-colors duration-300">
                  MD 0{project.id}
                </span>
                <div>
                  <h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-neutral-200 group-hover:text-white group-hover:font-bold group-hover:translate-x-2 transition-all duration-300 ease-out flex items-center gap-3">
                    {project.title}
                    <ArrowUpRight
                      size={24}
                      className={`transition-all duration-300 text-[#C8A754] ${
                        project.link
                          ? 'opacity-80 md:opacity-0 -translate-x-1 md:-translate-x-2 translate-y-1 md:translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'
                          : 'opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0'
                      }`}
                    />
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-400 font-light mt-2 max-w-xl group-hover:text-neutral-300 transition-colors">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-4 md:gap-8 z-10 pointer-events-none">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C8A754]/90 px-3 py-1 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/5">
                  {project.category}
                </span>
                <span className="text-sm font-mono text-neutral-500 group-hover:text-white transition-colors duration-300">
                  {project.year}
                </span>
              </div>

              {/* Trailing glow line sweeps in on hover */}
              <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A754]/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
            </motion.a>
          ))}
        </div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>More Works Loading</span>
      </footer>
    </div>
  );
}
