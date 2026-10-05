import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BadgeCheck, Calendar, Award, ExternalLink, Maximize2, ShieldCheck } from 'lucide-react';
import { CERTIFICATES, CONTACT } from '../constants';

// ---------- Shared small components ----------

function InterlacedX({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      className={className}
    >
      {/* continuous bottom-left → top-right diagonal */}
      <line x1="5" y1="19" x2="19" y2="5" />
      {/* top-left segment of the broken diagonal */}
      <line x1="5" y1="5" x2="8.5" y2="8.5" />
      {/* bottom-right segment */}
      <line x1="15.5" y1="15.5" x2="19" y2="19" />
    </svg>
  );
}

function WebsiteXCloseButton({ onClick, size = 'md', title = 'Close' }) {
  const dims = { sm: { box: 'w-9 h-9', icon: 18 }, md: { box: 'w-11 h-11', icon: 20 }, lg: { box: 'w-12 h-12', icon: 24 } };
  const d = dims[size] || dims.md;
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-label={title}
      title={title}
      className={`relative ${d.box} rounded-full bg-[#060e17] border border-[#C8A754]/40 shadow-[0_0_20px_rgba(200,167,84,0.25)] hover:border-[#C8A754]/80 hover:shadow-[0_0_25px_rgba(200,167,84,0.5)] flex items-center justify-center cursor-pointer shrink-0 outline-none focus:outline-none transition-all duration-300 group`}
    >
      <span className="text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.9)] group-hover:drop-shadow-[0_0_12px_rgba(200,167,84,1)]">
        <InterlacedX size={d.icon} />
      </span>
    </motion.button>
  );
}

// ---------- Certificate card (flip + tap + spotlight, §5.9) ----------

function CertificateCard({ cert, index, isTapped, onTapToggle, setActiveModalCert }) {
  const [failedImages, setFailedImages] = useState({});
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const openModal = () => setActiveModalCert(cert);
  const failed = !!failedImages[cert.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="group relative h-[360px] md:h-[370px] w-full [perspective:1200px] cursor-pointer"
      onClick={() => onTapToggle(cert.id)}
      onMouseMove={handleMouseMove}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ease-out group-hover:[transform:rotateY(180deg)] ${isTapped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* FRONT face */}
        <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] bg-black/45 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between group-hover:border-[#C8A754]/40 group-hover:bg-black/60 transition-all duration-300 shadow-xl overflow-hidden">
          {/* Spotlight glow + border */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(200,167,84,0.18), transparent 75%)`,
            }}
          />
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              border: '1px solid rgba(200,167,84,0.7)',
              maskImage: `radial-gradient(220px circle at ${spotlight.x}px ${spotlight.y}px, black 20%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(220px circle at ${spotlight.x}px ${spotlight.y}px, black 20%, transparent 100%)`,
            }}
          />
          {/* Ambient orb */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C8A754]/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#C8A754]/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754] px-2.5 py-0.5 rounded-full border border-[#C8A754]/20 bg-[#C8A754]/10 truncate max-w-[70%]">
                {cert.field}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 shrink-0">
                <Calendar size={12} className="text-[#C8A754]" />
                <span className="font-semibold text-white">{cert.year}</span>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-medium tracking-tight text-white group-hover:text-[#C8A754] transition-colors mb-2 line-clamp-2">
              {cert.title}
            </h3>

            <p className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-1.5">
              <Award size={13} className="text-[#C8A754] shrink-0" />
              <span className="text-neutral-300 font-medium">{cert.issuer}</span>
            </p>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {cert.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-mono text-neutral-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BACK face */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [webkit-backface-visibility:hidden] [transform:rotateY(180deg)] bg-neutral-950/95 backdrop-blur-2xl border border-[#C8A754]/50 p-4 rounded-2xl flex flex-col shadow-[0_0_35px_rgba(200,167,84,0.18)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl"
            style={{
              background: `radial-gradient(400px circle at ${spotlight.x}px ${spotlight.y}px, rgba(200,167,84,0.14), transparent 75%)`,
            }}
          />

          {/* Back top bar */}
          <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754] bg-[#C8A754]/10 border border-[#C8A754]/30 px-2.5 py-0.5 rounded-full truncate max-w-[70%]">
              {cert.issuer}
            </span>
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-[#C8A754]/20 text-neutral-300 hover:text-[#C8A754] border border-white/10 hover:border-[#C8A754]/40 transition-colors"
                  title="Verify on Issuer Portal"
                >
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                onClick={() => setActiveModalCert(cert)}
                className="p-1.5 rounded-lg bg-[#C8A754]/10 hover:bg-[#C8A754]/25 text-[#C8A754] border border-[#C8A754]/30 transition-colors"
                title="Enlarge Certificate"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Image frame */}
          <div
            className="relative z-10 flex-1 w-full mt-2.5 rounded-xl overflow-hidden bg-neutral-900/90 border border-white/10 flex items-center justify-center p-2 group/img hover:border-[#C8A754]/40 transition-all shadow-inner cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveModalCert(cert);
            }}
          >
            {!failed ? (
              <img
                src={cert.imageUrl}
                alt={`${cert.title} Certificate`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg drop-shadow-lg transition-transform duration-300 group-hover/img:scale-[1.02]"
                onError={() => setFailedImages((prev) => ({ ...prev, [cert.id]: true }))}
              />
            ) : (
              /* Fallback — §11.2: the five referenced images intentionally do not exist */
              <div className="flex flex-col items-center justify-center text-center p-3 h-full w-full">
                <div className="w-10 h-10 rounded-full bg-[#C8A754]/10 border border-[#C8A754]/30 flex items-center justify-center mb-2">
                  <Award size={20} className="text-[#C8A754]" />
                </div>
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider mb-1 line-clamp-1">
                  {cert.title}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  {cert.issuer} &bull; {cert.year}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------- Lightbox modal (§5.9) ----------

function CertificateModal({ cert, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!cert) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative z-10 max-w-3xl w-full bg-neutral-950/95 backdrop-blur-2xl border border-[#C8A754]/40 rounded-3xl p-3.5 sm:p-5 shadow-[0_0_60px_rgba(200,167,84,0.3)] flex flex-col max-h-[78vh] overflow-y-auto my-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8A754] bg-[#C8A754]/10 border border-[#C8A754]/30 px-2.5 py-0.5 rounded-full shrink-0">
            {cert.issuer}
          </span>
          <span className="text-xs font-mono text-neutral-400 shrink-0">{cert.year}</span>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight leading-snug truncate">
            {cert.title}
          </h3>
        </div>
        <WebsiteXCloseButton onClick={onClose} size="md" title="Close Certificate Modal" />
      </div>

      {/* Image area */}
      <div className="w-full flex-1 min-h-[180px] bg-black/50 rounded-2xl border border-white/10 p-2 sm:p-3 flex items-center justify-center overflow-hidden">
        {!imageFailed ? (
          <img
            src={cert.imageUrl}
            alt={cert.title}
            referrerPolicy="no-referrer"
            className="max-h-[40vh] md:max-h-[46vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
            onError={() => setImageFailed(true)}
          />
        ) : (
          /* Fallback detail panel — deliberately displays the missing filename */
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#C8A754]/10 border border-[#C8A754]/30 flex items-center justify-center mb-4">
              <Award size={32} className="text-[#C8A754]" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{cert.title}</h4>
            <p className="text-xs font-mono text-neutral-400 mb-4">
              {cert.issuer} &bull; {cert.year}
            </p>
            <div className="text-xs font-mono text-neutral-300 bg-white/5 border border-white/10 rounded-xl p-4 text-left w-full space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Target File:</span>
                <span className="text-[#C8A754] font-semibold truncate max-w-[200px]">
                  {cert.imageUrl.replace('certificates/', '')}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Domain:</span>
                <span className="text-white">{cert.field}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Status:</span>
                <span className="text-emerald-400 font-semibold">Verified Credential</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-neutral-800">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <ShieldCheck size={15} className="text-[#C8A754]" />
          <span>
            Issued to <strong className="text-white">Ryan George</strong>
          </span>
        </div>
        {cert.verifyUrl && (
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#C8A754] text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#a8863d] transition-colors"
          >
            Verify Credential
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ---------- Certificates page (§5.9) ----------

export default function Certificates({ onModalChange }) {
  const [activeModalCert, setActiveModalCert] = useState(null);
  const [tappedCertId, setTappedCertId] = useState(null);

  // Only one card can be tap-flipped at a time (touch behaviour)
  const toggleTapCard = (id) => setTappedCertId((prev) => (prev === id ? null : id));

  // Lift "is modal open" so App hides the Header and disables the pull gesture
  useEffect(() => {
    onModalChange?.(!!activeModalCert);
    return () => {
      onModalChange?.(false);
    };
  }, [activeModalCert, onModalChange]);

  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between">
      <div className="max-w-[90vw] mx-auto w-full">
        {/* Stacked header, mb-12 (§2.7 margin variant) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-8"
        >
          <div>
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-4 flex items-center gap-2">
              <BadgeCheck size={14} className="text-[#C8A754]" />
              // Accreditations &bull; Credentials
            </span>
            <h2 className="liquid-glass-text text-5xl md:text-8xl font-bold uppercase tracking-tighter">
              Course
              <br />
              Certificates
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <span className="text-sm font-mono text-neutral-500">(2023 — 2026)</span>
            <a
              href={CONTACT.linkedinCerts}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-button inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all transform hover:-translate-y-0.5"
            >
              <span>View On LinkedIn</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, index) => (
            <CertificateCard
              key={cert.id}
              cert={cert}
              index={index}
              isTapped={tappedCertId === cert.id}
              onTapToggle={toggleTapCard}
              setActiveModalCert={setActiveModalCert}
            />
          ))}
        </div>

        {/* "More Certificates" CTA — liquid gold swipe on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 md:mt-20 flex justify-center w-full"
        >
          <a
            href={CONTACT.linkedinCerts}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-4 px-8 py-4 md:px-10 md:py-5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 hover:border-[#C8A754]/40 shadow-2xl transition-all"
          >
            <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
            <span className="relative z-10 text-lg md:text-2xl font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
              More Certificates
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 w-6 h-6 md:w-7 md:h-7 text-neutral-400 group-hover:text-black transition-colors duration-300 shrink-0"
            >
              <path d="M6 18 L15.2 8.8" />
              <path d="M18 6 L9 6" />
              <path d="M18 10 L18 16" />
            </svg>
          </a>
        </motion.div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>Accreditations &amp; Verifications</span>
      </footer>

      {/* Lightbox modal */}
      <AnimatePresence>
        {activeModalCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6">
            <div
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setActiveModalCert(null)}
            />
            <CertificateModal cert={activeModalCert} onClose={() => setActiveModalCert(null)} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
