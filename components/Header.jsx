import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants';

export default function Header({ activePage, onNavigate, isHidden = false, isTabLoaded = true }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Escape closes the fullscreen menu
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNav = (page) => {
    setMenuOpen(false);
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLabel = NAV_ITEMS.find((n) => n.tab === activePage)?.label || '';

  const hamburgerLines = [
    {
      closed: { x1: 3.5, y1: 6.5, x2: 20.5, y2: 6.5 },
      open: { x1: 4.5, y1: 4.5, x2: 9.5, y2: 9.5 },
    },
    {
      closed: { x1: 3.5, y1: 12, x2: 20.5, y2: 12 },
      open: { x1: 4.5, y1: 19.5, x2: 19.5, y2: 4.5 },
    },
    {
      closed: { x1: 3.5, y1: 17.5, x2: 20.5, y2: 17.5 },
      open: { x1: 14.5, y1: 14.5, x2: 19.5, y2: 19.5 },
    },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isHidden ? -100 : 0,
          opacity: isHidden ? 0 : 1,
          pointerEvents: isHidden ? 'none' : 'auto',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 md:py-6 text-[#C8A754] transition-colors duration-300 ${
          menuOpen
            ? 'bg-transparent border-transparent'
            : 'bg-black/40 backdrop-blur-md border-b border-white/5'
        }`}
      >
        {/* Brand logo intentionally removed */}
        <div aria-hidden="true" className="select-none" />

        {/* Active-tab pill */}
        <div className="flex absolute left-1/2 -translate-x-1/2 items-center pointer-events-none">
          <AnimatePresence>
            {!menuOpen && activePage !== '404' && activePage !== 'home' && isTabLoaded && (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center justify-center px-4 py-1 md:py-1.5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-widest text-[#C8A754] bg-[#C8A754]/10 shadow-[0_0_15px_rgba(200,167,84,0.25)] border border-[#C8A754]/30 backdrop-blur-md pointer-events-auto"
              >
                <span className="inline-block text-center">{activeLabel}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hamburger → interlaced X */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="relative z-50 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C8A754]/40 shadow-lg cursor-pointer transition-all duration-300 group outline-none focus:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`w-6 h-6 transition-all duration-300 ${
              menuOpen
                ? 'text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.7)]'
                : 'text-white group-hover:text-[#C8A754]'
            }`}
          >
            {hamburgerLines.map((line, i) => (
              <motion.line
                key={i}
                x1={menuOpen ? line.open.x1 : line.closed.x1}
                y1={menuOpen ? line.open.y1 : line.closed.y1}
                x2={menuOpen ? line.open.x2 : line.closed.x2}
                y2={menuOpen ? line.open.y2 : line.closed.y2}
                stroke={menuOpen ? '#C8A754' : 'currentColor'}
                strokeWidth="2.2"
                strokeLinecap="round"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </svg>
        </motion.button>
      </motion.header>

      {/* Fullscreen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 md:bg-black/90 backdrop-blur-md md:backdrop-blur-xl flex flex-col justify-between px-8 md:px-20 pt-28 pb-12 overflow-y-auto"
            style={{ backgroundColor: 'rgba(8,10,15,0.96)', willChange: 'opacity', transform: 'translateZ(0)' }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            {/* Ambient glows — radial gradients, no blur filters */}
            <div
              className="absolute top-0 right-0 w-96 h-96 opacity-40 md:opacity-60 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(200,167,84,0.12) 0%, rgba(200,167,84,0) 70%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-80 h-80 opacity-30 md:opacity-50 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(200,167,84,0.08) 0%, rgba(200,167,84,0) 70%)' }}
            />

            <nav className="relative z-10 my-auto py-6 max-w-4xl">
              <ul className="space-y-4 md:space-y-6">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activePage === item.tab;
                  return (
                    <motion.li
                      key={item.tab}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: idx * 0.02, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        onClick={() => handleNav(item.tab)}
                        className={`group flex items-baseline gap-4 md:gap-8 text-left cursor-pointer transition-all duration-300 w-full py-1 bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent outline-none focus:outline-none focus:ring-0 select-none ${
                          isActive ? 'text-[#C8A754]' : 'text-neutral-400 hover:text-white'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', backgroundColor: 'transparent' }}
                      >
                        <span className="font-mono text-xs md:text-sm text-neutral-600 group-hover:text-[#C8A754] transition-colors select-none bg-transparent">
                          {String(idx + 1).padStart(2, '0')} //
                        </span>
                        <span className="text-3xl sm:text-4xl md:text-6xl font-bold uppercase tracking-tight font-poppins group-hover:translate-x-3 md:group-hover:translate-x-4 transition-transform duration-300 flex items-center gap-4 select-none bg-transparent">
                          {item.label}
                          {isActive && (
                            <span className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full bg-[#C8A754] shadow-[0_0_15px_#C8A754]" />
                          )}
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.2 }}
              className="relative z-10 pt-8 border-t border-white/10 flex justify-between items-center text-xs font-mono text-neutral-400"
            >
              <span>
                <span className="text-white font-semibold">Ryan George</span> &bull; Kerala, India
              </span>
              <span>Portfolio &bull; 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
