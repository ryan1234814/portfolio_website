import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIAssistantAvatar from './AIAssistantAvatar';
import SiriThinkingAnimation from './SiriThinkingAnimation';
import { sendChatMessage } from '../services/ryoAssistant';

// AIChat — "Ryo" panel, docked bottom-left. Fully offline (no LLM).

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
      {/* AIChat copy — different coordinates from the Certificates version */}
      <line x1="4.5" y1="19.5" x2="19.5" y2="4.5" />
      <line x1="4.5" y1="4.5" x2="9.5" y2="9.5" />
      <line x1="14.5" y1="14.5" x2="19.5" y2="19.5" />
    </svg>
  );
}

function PaperAirplaneSendIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <g transform="translate(-2.5, -1.2)">
        <path d="M21.92 3.63a1.2 1.2 0 0 0-1.25-.26L2.61 10.66a1.2 1.2 0 0 0 .08 2.26l5.05 1.95 1.9 5.86a1.2 1.2 0 0 0 1.83.6l3.18-2.65 4.58 3.39a1.2 1.2 0 0 0 1.89-.72l3-16.5a1.2 1.2 0 0 0-.21-1.22zM9.54 14.12l8.8-7.92-7.05 9.16-.33 3.4-1.42-4.64z" />
      </g>
    </svg>
  );
}

// Minimal markdown: **bold** and `code`
const renderFormattedText = (text) => {
  const parts = String(text).split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (/^\*\*.*?\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^`.*?`$/.test(part)) {
      return (
        <code key={i} className="bg-white/10 px-1 py-0.5 rounded text-[#C8A754] text-xs font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

function AnimatedChatToggleIcon({ isOpen, size = 38 }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.span
          key="close"
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#C8A754] drop-shadow-[0_0_8px_rgba(200,167,84,0.8)] inline-flex"
        >
          <InterlacedX size={Math.round(size * 0.7)} />
        </motion.span>
      ) : (
        <motion.span
          key="avatar"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex"
        >
          <AIAssistantAvatar size={size} glow />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

const INITIAL_MESSAGE = {
  role: 'model',
  text: "Hi! I'm Ryo, Ryan George's AI assistant. Ask me anything about Ryan's projects, technical skills, AI background, certifications, or how to get in touch!",
};

const SUGGESTIONS = [
  'Tell me about Xplora Travel Agent',
  "What is Ryan's tech stack?",
  'Show me his certifications',
  'How can I contact Ryan?',
];

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sendLockRef = useRef(false);

  // Scroll to bottom on new messages / loading state
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // Autofocus 150 ms after opening
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handleSend = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text || isLoading || sendLockRef.current) return;
    sendLockRef.current = true;

    const userMsg = { role: 'user', text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Minimum 1100 ms perceived thinking time
      const minThinkingTime = new Promise((r) => setTimeout(r, 1100));
      const [responseText] = await Promise.all([sendChatMessage(userMsg.text, newHistory), minThinkingTime]);
      setMessages((prev) => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "I'm here to answer questions about Ryan's projects, skills, or background. Feel free to ask or reach out to Rg05.koickal@gmail.com!",
        },
      ]);
    } finally {
      setIsLoading(false);
      sendLockRef.current = false;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length <= 2 && !isLoading;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-[90vw] sm:w-96 bg-black/85 backdrop-blur-2xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(200,167,84,0.15)] border border-white/10 overflow-hidden flex flex-col relative"
            style={{ maxHeight: '560px', minHeight: '460px' }}
          >
            {/* Header */}
            <div className="bg-black/60 text-white p-3.5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <AIAssistantAvatar size={24} glow trackCursor={false} blink={true} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-white tracking-wide">Ryo</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C8A754]/80 block">
                    Ryan's Interactive AI
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close assistant"
                className="text-neutral-400 hover:text-[#C8A754] hover:bg-white/5 p-1.5 rounded-lg transition-colors flex items-center justify-center group"
              >
                <InterlacedX size={17} className="group-hover:drop-shadow-[0_0_6px_rgba(200,167,84,0.6)]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent scroll-smooth">
              {messages.map((msg, idx) => {
                if (msg.role === 'user') {
                  return (
                    <div key={idx} className="flex justify-end">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="relative max-w-[84%] rounded-[22px] overflow-hidden backdrop-blur-2xl bg-gradient-to-b from-[#C8A754]/45 via-[#b8963f]/36 96% to-black/85 border border-[#C8A754]/45 shadow-[0_10px_28px_rgba(0,0,0,0.55),0_0_24px_rgba(200,167,84,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.6)] group"
                      >
                        <div className="absolute inset-x-0 top-0 h-[75%] pointer-events-none rounded-t-[21px] bg-gradient-to-b from-[#C8A754]/50 via-[#C8A754]/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-[7%] pointer-events-none rounded-b-[21px] bg-gradient-to-t from-black/90 to-transparent border-b-[1.5px] border-[#C8A754]/50 shadow-[inset_0_-3px_6px_rgba(0,0,0,0.7)]" />
                        <div className="relative z-10 px-4 py-3 text-xs sm:text-sm text-white leading-relaxed whitespace-pre-wrap font-medium tracking-[-0.01em] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {renderFormattedText(msg.text)}
                        </div>
                      </motion.div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 mt-0.5"
                    >
                      <AIAssistantAvatar size={22} glow trackCursor={false} blink={true} />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.15, x: -24, y: 2 }}
                      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 24, mass: 0.7 }}
                      style={{ transformOrigin: 'top left' }}
                      className="relative max-w-[84%] rounded-[22px] origin-top-left overflow-hidden backdrop-blur-2xl bg-white/[0.07] border border-[#C8A754]/20 shadow-[0_10px_28px_rgba(0,0,0,0.5),0_0_16px_rgba(200,167,84,0.08),inset_0_1px_1.5px_rgba(200,167,84,0.3)] group"
                    >
                      <div className="absolute inset-x-0 top-0 h-[36%] pointer-events-none rounded-t-[21px] bg-gradient-to-b from-[#C8A754]/24 via-[#C8A754]/06 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-[38%] pointer-events-none rounded-b-[21px] bg-gradient-to-t from-[#C8A754]/22 via-[#C8A754]/05 to-transparent border-b-[1.5px] border-[#C8A754]/40 shadow-[inset_0_-6px_14px_rgba(200,167,84,0.14)]" />
                      <div className="relative z-10 px-4 py-3.5 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap font-normal tracking-[-0.01em]">
                        {renderFormattedText(msg.text)}
                      </div>
                    </motion.div>
                  </div>
                );
              })}

              {/* Loading row */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2.5 py-1.5"
                  >
                    <div className="shrink-0" title="Thinking...">
                      <AIAssistantAvatar size={22} glow trackCursor={false} blink={true} />
                    </div>
                    <SiriThinkingAnimation size="sm" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick suggestions — fresh conversation only */}
              {showSuggestions && (
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mb-2">
                    <Sparkles size={11} className="text-[#C8A754]" />
                    Suggested queries:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="text-[11px] font-mono text-neutral-300 bg-white/5 hover:bg-[#C8A754]/10 hover:border-[#C8A754]/40 hover:text-[#C8A754] border border-white/10 px-2.5 py-1 rounded-full transition-all text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills, certifications..."
                className="flex-1 bg-white/5 text-white placeholder-neutral-500 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A754] border border-white/10"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
                className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#C8A754] text-black rounded-full hover:bg-[#a8863d] hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-[0_0_14px_rgba(200,167,84,0.4)] hover:shadow-[0_0_20px_rgba(200,167,84,0.7)]"
              >
                <PaperAirplaneSendIcon size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button */}
      <motion.button
        variants={{ idle: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 0.96 } }}
        initial="idle"
        animate="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close AI Assistant' : 'Ask AI Assistant'}
        className="liquid-glass-button h-[60px] min-w-[60px] max-h-[60px] rounded-full flex items-center justify-center overflow-hidden shadow-2xl origin-bottom-left group"
      >
        <div className="relative z-10 w-[60px] h-[60px] flex items-center justify-center shrink-0">
          <AnimatedChatToggleIcon isOpen={isOpen} size={38} />
        </div>
        {!isOpen && (
          <motion.div
            variants={{
              idle: { width: 0, opacity: 0, transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] } },
              hover: { width: 64, opacity: 1, transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="h-[60px] flex items-center overflow-hidden whitespace-nowrap"
          >
            <span className="block whitespace-nowrap text-sm font-semibold tracking-wide pr-3.5 text-white">
              Ask AI
            </span>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
