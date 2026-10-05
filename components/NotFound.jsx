import React, { useEffect, useRef, useState } from 'react';

export default function NotFound({ onGoHome }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectGifSrc, setConnectGifSrc] = useState('/dribbble_connected.gif');
  const timerRef = useRef(null);

  // Preload the connecting GIF
  useEffect(() => {
    const img = new Image();
    img.src = '/dribbble_connected.gif';
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (isConnecting) return;
    setConnectGifSrc(`/dribbble_connected.gif?t=${Date.now()}`); // cache-bust so it replays
    setIsConnecting(true);
    timerRef.current = setTimeout(() => {
      onGoHome();
    }, 1500);
  };

  return (
    <section
      className="page_404 min-h-screen w-full bg-white text-[#333333] flex items-center justify-center py-10 px-4 select-none"
      style={{ fontFamily: "'Arvo', serif" }}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 text-center">
            <div
              className="four_zero_four_bg w-full h-[400px] bg-center bg-no-repeat"
              style={{
                backgroundImage: isConnecting
                  ? `url('${connectGifSrc}'), url('/dribbble_connected.gif'), url('./dribbble_connected.gif')`
                  : "url('/dribbble_1.gif'), url('./dribbble_1.gif')",
              }}
            >
              <h1 className="text-center text-[80px] leading-none font-normal text-[#333333]">404</h1>
            </div>

            <div className="contant_box_404 -mt-[50px]">
              <h3 className="text-[28px] sm:text-[30px] leading-tight font-normal text-[#333333] mb-2">
                Look like you're lost
              </h3>
              <p className="text-[#333333] text-base mb-5">the page you are looking for not avaible!</p>
              <a
                href="/"
                onClick={handleHomeClick}
                className="group relative inline-flex items-center justify-center gap-4 md:gap-5 px-8 py-3.5 md:px-10 md:py-4 my-3 rounded-full overflow-hidden bg-[#080a0f] backdrop-blur-sm border border-white/15 hover:border-[#C8A754]/40 shadow-2xl transition-all no-underline"
              >
                <div className="absolute inset-0 bg-[#C8A754] origin-right scale-x-0 transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
                <span className="relative z-10 text-lg md:text-2xl font-bold uppercase tracking-tight font-poppins text-neutral-200 group-hover:text-black transition-colors duration-300">
                  Go to Home
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10 w-5 h-5 md:w-7 md:h-7 text-neutral-400 group-hover:text-black transition-colors duration-300 shrink-0"
                >
                  <path d="M6 18 L15.2 8.8" />
                  <path d="M18 6 L9 6" />
                  <path d="M18 10 L18 16" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
