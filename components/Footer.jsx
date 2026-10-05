import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import FloatingDock from './FloatingDock';
import { CONTACT } from '../constants';

export default function Footer() {
  // Live clock — evaluated at render only (does not tick; updates on re-render/navigation)
  const localTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      id="contact"
      className="bg-transparent text-white pt-36 pb-12 px-6 md:px-12 relative z-10 min-h-screen flex flex-col justify-between"
    >
      <div className="max-w-[90vw] mx-auto w-full flex flex-col justify-between flex-grow">
        {/* Top grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left column */}
          <div className="max-w-xl">
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
              <Mail size={14} className="text-[#C8A754]" />
              // Contact &bull; Get In Touch
            </span>
            <h3 className="text-3xl md:text-5xl font-medium uppercase tracking-tight text-white mb-4">
              Let's connect &amp; build together.
            </h3>
            <p className="text-neutral-400 font-light text-base md:text-lg">
              Have a project, research collaboration, or internship opportunity in AI / data
              science? Reach out directly via email or on social platforms.
            </p>
          </div>

          {/* Right column — macOS-style dock */}
          <div className="flex items-center justify-center w-full py-4 lg:py-0">
            <FloatingDock />
          </div>
        </motion.div>

        {/* Kinetic CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-auto pt-16 md:pt-24 flex justify-center w-full"
        >
          <a
            href={`mailto:${CONTACT.email}`}
            className="group relative inline-flex items-center justify-center gap-5 md:gap-6 px-8 py-4 md:px-12 md:py-6 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 hover:border-[#C8A754]/40 shadow-2xl transition-all"
          >
            <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            <span className="relative z-10 text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
              Get in Touch
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 w-6 h-6 md:w-9 md:h-9 text-neutral-400 group-hover:text-black transition-colors duration-300 shrink-0"
            >
              <path d="M6 18 L15.2 8.8" />
              <path d="M18 6 L9 6" />
              <path d="M18 10 L18 16" />
            </svg>
          </a>
        </motion.div>

        {/* Bottom block */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-12 pt-8 border-t border-neutral-900 text-neutral-600 text-xs uppercase tracking-widest font-medium">
          <p>&copy; 2026 Ryan George</p>
          <p>Python Developer &amp; Data Scientist</p>
          <p className="mt-4 md:mt-0">Local Time: {localTime}</p>
        </div>
      </div>
    </div>
  );
}
