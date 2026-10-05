import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';

function HuggingFaceIcon({ size = 21 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[21px] h-[21px]"
    >
      <path d="M12 2.5c-1.5 0-2.7.8-3.4 2L7 7H4.5A1.5 1.5 0 0 0 3 8.5v9A1.5 1.5 0 0 0 4.5 19h15a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 19.5 7H17l-1.6-2.5c-.7-1.2-1.9-2-3.4-2zM9.2 11.2a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zm5.6 0a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4z" />
    </svg>
  );
}

function DockItem({ item, mouseX }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-110, 0, 110], [46, 62, 46]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 220, damping: 15 });
  const iconScaleSync = useTransform(distance, [-110, 0, 110], [1, 1.25, 1]);
  const iconScale = useSpring(iconScaleSync, { mass: 0.1, stiffness: 220, damping: 15 });

  return (
    <motion.a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.title}
      style={{ width, height: width }}
      className={`group relative rounded-2xl flex items-center justify-center origin-bottom text-[#C8A754]/80 bg-[#C8A754]/[0.08] border border-[#C8A754]/30 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.45),0_0_12px_rgba(200,167,84,0.12),inset_0_1px_1.5px_rgba(200,167,84,0.4)] transition-colors duration-200 cursor-pointer ${item.brandColor}`}
    >
      {/* Specular sheen */}
      <div className="absolute inset-x-0 top-0 h-[40%] rounded-t-2xl pointer-events-none bg-gradient-to-b from-[#C8A754]/30 via-[#C8A754]/10 to-transparent" />
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `0 0 22px ${item.glowColor}` }}
      />
      <motion.div
        style={{ scale: iconScale }}
        className="relative z-10 flex items-center justify-center transition-colors"
      >
        {item.icon}
      </motion.div>
    </motion.a>
  );
}

export default function FloatingDock() {
  const mouseX = useMotionValue(Infinity);

  const items = [
    {
      title: 'LinkedIn',
      href: 'https://linkedin.com/in/ryan-george-1a6161283/',
      icon: <Linkedin size={21} strokeWidth={1.75} />,
      brandColor: 'hover:!text-[#0A66C2] hover:!border-[#0A66C2]/80 hover:bg-[#0A66C2]/20',
      glowColor: 'rgba(10, 102, 194, 0.75)',
    },
    {
      title: 'GitHub',
      href: 'https://github.com/ryan1234814/',
      icon: <Github size={21} strokeWidth={1.75} />,
      brandColor: 'hover:!text-white hover:!border-[#C8A754]/80 hover:bg-[#C8A754]/25',
      glowColor: 'rgba(200, 167, 84, 0.5)',
    },
    {
      title: 'HuggingFace',
      href: 'https://huggingface.co/coder1969',
      icon: <HuggingFaceIcon size={21} />,
      brandColor: 'hover:!text-[#FFD21E] hover:!border-[#FFD21E]/80 hover:bg-[#FFD21E]/15',
      glowColor: 'rgba(255, 210, 30, 0.5)',
    },
  ];

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="relative inline-flex flex-col items-center"
    >
      {/* Ambient outer glow */}
      <div className="absolute -inset-1.5 rounded-[34px] bg-gradient-to-r from-[#C8A754]/30 via-[#00cce0]/15 to-[#C8A754]/30 blur-xl pointer-events-none -z-10" />

      {/* Dock body */}
      <div className="relative flex items-end h-[68px] pb-2.5 sm:pb-3 gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 rounded-[28px] bg-gradient-to-b from-[#C8A754]/15 via-black/80 to-black/95 backdrop-blur-2xl border border-[#C8A754]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(200,167,84,0.22),inset_0_1px_2px_rgba(200,167,84,0.5)]">
        {/* Top rim highlight */}
        <div className="absolute inset-x-4 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8A754]/70 to-transparent pointer-events-none" />

        {items.map((item) => (
          <DockItem key={item.title} item={item} mouseX={mouseX} />
        ))}
      </div>

      {/* Ground shadow */}
      <div className="w-[82%] h-3.5 -mt-1 rounded-full bg-[#C8A754]/20 blur-md pointer-events-none -z-20" />
    </div>
  );
}
