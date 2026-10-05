import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Cpu, Code2, Sparkles } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { SKILLS_DATA } from '../constants';

// ---------- PhysicalNumberRoller (odometer-style digit roll, §5.3.1) ----------

function PhysicalDigitRoller({ digit, delay = 0, spins = 1, isInView }) {
  const numbers = Array.from({ length: spins * 10 + digit + 1 }, (_, i) => i % 10);
  const targetIndex = isInView ? numbers.length - 1 : 0;

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-middle select-none px-0 bg-transparent">
      <motion.span
        initial={{ y: 0 }}
        animate={{ y: `-${(targetIndex / numbers.length) * 100}%` }}
        transition={{ duration: 1.6 + delay * 0.6, delay, ease: [0.12, 0.95, 0.22, 1] }}
        className="inline-flex flex-col text-center bg-transparent"
      >
        {numbers.map((num, idx) => (
          <span
            key={idx}
            className="h-[1.15em] flex items-center justify-center font-oswald text-white leading-none bg-transparent"
          >
            {num}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function PhysicalNumberRoller({ target, suffix = '+', suffixMargin = 'ml-[3px]' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const digits = String(target).split('').map(Number);
  const effectiveGapClass = target === 10 ? 'gap-0' : 'gap-[1.5px]';

  return (
    <span ref={ref} className="inline-flex items-center font-oswald tabular-nums leading-none">
      <span className={`inline-flex items-center ${effectiveGapClass}`}>
        {digits.map((d, i) => (
          <span key={i} className={`inline-flex items-center ${target === 10 && i === 1 ? '-ml-[1px]' : ''}`}>
            <PhysicalDigitRoller digit={d} delay={i * 0.12} spins={1} isInView={isInView} />
          </span>
        ))}
      </span>
      <span className={`font-oswald text-white select-none self-center leading-none ${suffixMargin}`}>
        {suffix}
      </span>
    </span>
  );
}

// ---------- TiltSkillsTile (3D holographic pod, §5.3.2) ----------

function TiltSkillsTile() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 220, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 220, damping: 24 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const brackets = [
    'top-2.5 left-2.5 border-t-2 border-l-2',
    'top-2.5 right-2.5 border-t-2 border-r-2',
    'bottom-2.5 left-2.5 border-b-2 border-l-2',
    'bottom-2.5 right-2.5 border-b-2 border-r-2',
  ];

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.25 }}
        className="relative rounded-2xl bg-black/60 border border-white/10 p-6 md:p-8 shadow-2xl transition-colors duration-300 group hover:border-[#C8A754]/40 cursor-pointer will-change-transform"
      >
        {/* Corner aura */}
        <div
          className="absolute top-0 right-0 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, rgba(200,167,84,0.12) 0%, transparent 70%)', transform: 'translateZ(0px)' }}
        />

        {/* Holographic stage */}
        <motion.div
          className="absolute inset-4 md:inset-6 rounded-2xl bg-[#C8A754]/[0.03] border border-[#C8A754]/30 pointer-events-none"
          style={{ transform: 'translateZ(30px)', boxShadow: '0 16px 36px rgba(0,0,0,0.7), 0 0 24px rgba(200,167,84,0.14)' }}
          animate={{ translateZ: isHovered ? 42 : 30 }}
          transition={{ duration: 0.3 }}
        >
          {brackets.map((cls, i) => (
            <div key={i} className={`absolute w-3 h-3 border-[#C8A754]/70 ${cls}`} />
          ))}
        </motion.div>

        {/* Projected web graph */}
        <motion.div
          className="relative z-20 w-full"
          style={{ transform: 'translateZ(70px)', transformStyle: 'preserve-3d' }}
          animate={{ translateZ: isHovered ? 95 : 70 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <SkillChart />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ---------- TiltSubCard (§5.3.3) ----------

function TiltSubCard({ icon: Icon, title, children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 240, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 240, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div style={{ perspective: 800 }} className="w-full">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="p-6 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-[#C8A754]/30 hover:bg-black/60 transition-colors shadow-lg will-change-transform cursor-pointer"
      >
        <div style={{ transform: 'translateZ(16px)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Icon size={14} className="text-[#C8A754]" />
            <h5 className="font-mono font-bold uppercase text-xs tracking-wider text-white">{title}</h5>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

// ---------- SkillChart (Recharts radar, §5.4) ----------

function SkillChart() {
  return (
    <div className="w-full h-[380px] md:h-[420px] bg-transparent rounded-lg p-2 select-none relative">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full relative z-10"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={SKILLS_DATA}>
            <PolarGrid stroke="#C8A754" strokeOpacity={0.25} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 600 }} />
            <Radar
              name="Skills"
              dataKey="A"
              stroke="#C8A754"
              strokeWidth={2.4}
              fill="#C8A754"
              fillOpacity={0.3}
              dot={{ r: 3.5, fill: '#C8A754', stroke: '#ffffff', strokeWidth: 1.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

// ---------- About page (§5.3) ----------

const HIGHLIGHT_STATS = [
  { target: 5, label: 'Certificates', delay: 0.1 },
  { target: 5, label: 'Projects', delay: 0.2 },
  { target: 2, label: 'Internships', delay: 0.3 },
];

export default function About() {
  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-transparent relative z-10 min-h-screen flex flex-col justify-between">
      <div className="max-w-[90vw] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2"
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-6 flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#C8A754]" />
              // Profile &bull; Developer Background
            </span>

            <h3 className="text-4xl md:text-6xl font-medium uppercase leading-[1.1] mb-8 tracking-tight">
              Building edge-AI & <span className="text-[#C8A754]">GenAI</span> systems with{' '}
              <span className="text-neutral-500">data</span>.
            </h3>

            <div className="space-y-5 text-base md:text-lg font-light leading-relaxed text-neutral-300 max-w-xl">
              <p>
                I'm Ryan George Koickal, a Computer Science and Engineering student at Rajagiri
                School of Engineering & Technology (CGPA 9.21/10) based in Kakkanad, Ernakulam. I'm
                a results-driven Python developer and data scientist focused on edge-AI, RAG
                pipelines, and multi-agent LLM systems.
              </p>
              <p className="text-neutral-400 text-sm md:text-base">
                From an offline BirdNET bird recognizer on Raspberry Pi and Gemini-powered species
                profiling, to scalable restaurant-data pipelines with LLM agents, to Xplora travel
                agents, ACP RAG reasoning, and a Kerala AQI digital twin — I ship production-grade
                AI that solves business problems.
              </p>
            </div>

            {/* Highlights grid */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-800/80 pt-8">
              {HIGHLIGHT_STATS.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.65, delay: stat.delay, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-1">
                    <h4 className="text-4xl font-bold font-oswald text-white flex items-center">
                      <PhysicalNumberRoller target={stat.target} suffix="+" />
                    </h4>
                  </div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#C8A754] mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            id="skills"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <span className="block text-xs font-mono font-bold uppercase tracking-widest text-[#C8A754] mb-6 flex items-center gap-2">
              <Cpu size={14} className="text-[#C8A754]" />
              // Technical Capabilities
            </span>

            <TiltSkillsTile />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TiltSubCard icon={Code2} title="Core Engineering">
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>LangChain &bull; LangGraph &bull; CrewAI</li>
                  <li>RAG &bull; FAISS &bull; ChromaDB</li>
                  <li>TensorFlow &bull; PyTorch &bull; Scikit-learn</li>
                  <li>XGBoost &bull; Random Forest &bull; NLP</li>
                  <li>NumPy &bull; Pandas &bull; SciPy</li>
                  <li>FastAPI &bull; Flask &bull; MySQL</li>
                  <li>React &bull; JavaScript &bull; Streamlit</li>
                </ul>
              </TiltSubCard>

              <TiltSubCard icon={Sparkles} title="Data & Deployment">
                <ul className="space-y-1.5 text-sm text-neutral-400 font-light">
                  <li>CAMS &amp; ERA5 Weather Datasets</li>
                  <li>BirdNET &amp; Edge-AI on Raspberry Pi</li>
                  <li>Gemini &amp; Groq APIs</li>
                  <li>Vercel &bull; Netlify &bull; Render</li>
                  <li>GCP (Basic) &bull; Git &amp; GitHub</li>
                </ul>
              </TiltSubCard>
            </div>
          </motion.div>
        </div>
      </div>

      <footer className="max-w-[90vw] mx-auto w-full mt-20 pt-8 border-t border-neutral-900 flex justify-between items-center text-xs font-mono text-neutral-600">
        <span>&copy; 2026 Ryan George</span>
        <span>Kerala, India</span>
      </footer>
    </div>
  );
}
