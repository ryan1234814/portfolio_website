import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollHUD() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const minute = useTransform(scrollYProgress, (p) => `${Math.round(p * 90)}'`);

  return (
    <>
      {/* Match-depth progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pitch via-[#C8A754] to-[#C8A754] origin-left z-[60] shadow-[0_0_10px_#C8A754]"
        style={{ scaleX }}
      />

      {/* Match clock chip — scroll depth as football minutes */}
      <div className="fixed bottom-5 right-5 z-[60] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#03060f]/85 backdrop-blur-md border border-[#C8A754]/30 shadow-[0_0_16px_rgba(200,167,84,0.15)] pointer-events-none select-none">
        <span className="scoreboard-label text-[10px] text-white/50">MIN</span>
        <motion.span className="font-oswald text-sm font-bold text-[#C8A754] tabular-nums tracking-widest">
          {minute}
        </motion.span>
      </div>
    </>
  );
}
