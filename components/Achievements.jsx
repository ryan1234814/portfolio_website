import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Star, ExternalLink } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';

export default function Achievements() {
  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between">
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Simplified header variant (A) — §2.7 callout, §5.8 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-end justify-between mb-16 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
              <Trophy size={14} className="text-[#C8A754]" />
              // Milestones &bull; Honors
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Key
              <br />
              Achievements
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <span className="text-sm font-mono text-neutral-500 block">(2026)</span>
            <span className="text-sm font-mono text-neutral-500">{ACHIEVEMENTS.length} Highlighted Milestones</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {ACHIEVEMENTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#C8A754]/40 hover:bg-black/60 transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] px-3 py-1 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/10">
                    {item.category}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">{item.year}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white group-hover:text-[#C8A754] transition-colors mb-2">
                  {item.title}
                </h3>

                <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
                  <Award size={13} className="text-[#C8A754]" />
                  {item.issuer}
                </p>

                <p className="text-sm text-neutral-300 font-light leading-relaxed">{item.description}</p>

                {item.imageUrl && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    <img
                      src={item.imageUrl}
                      alt={`${item.title} proof`}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 self-start text-xs font-mono font-bold uppercase tracking-wider text-[#C8A754] border border-[#C8A754]/30 bg-[#C8A754]/10 px-4 py-2 rounded-lg hover:bg-[#C8A754]/20 hover:border-[#C8A754]/60 transition-all duration-300"
                  >
                    View Project
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              {/* Highlight footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Star size={12} className="text-[#C8A754]" />
                  Recognition
                </span>
                <span className="text-xs font-mono font-bold text-white bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                  {item.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>Milestones &amp; Honors</span>
      </footer>
    </div>
  );
}
