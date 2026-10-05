import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import LiquidBackground from './components/LiquidBackground';
import InteractiveParticles from './components/InteractiveParticles';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Education from './components/Education';
import ProjectList from './components/ProjectList';
import Certificates from './components/Certificates';
import Achievements from './components/Achievements';
import Experience from './components/Experience';
import Footer from './components/Footer';
import AIChat from './components/AIChat';
import ScrollHUD from './components/ScrollHUD';
import GoalNetTransition from './components/GoalNetTransition';
import AppleHelloLoader from './components/AppleHelloLoader';
import NotFound from './components/NotFound';

import { TAB_SEQUENCE, TAB_LABELS } from './constants';

const VALID_TABS = ['home', 'profile', 'education', 'projects', 'achievements', 'certificates', 'experience', 'contact'];
const KNOWN_REPO_BASES = ['my-portfolio', 'portfolio'];

const getBasePath = () => {
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length > 0 && KNOWN_REPO_BASES.includes(segments[0].toLowerCase())) {
    return `/${segments[0]}/`;
  }
  return '/';
};

const getPageUrl = (page) => {
  const base = getBasePath();
  if (page === 'home') return base;
  return `${base}${page}`; // no trailing slash, no hash
};

const resolveTabFromCandidate = (candidate) => {
  if (!candidate) return null;
  const lower = candidate.toLowerCase();
  if (VALID_TABS.includes(lower)) return lower;
  if (lower === 'work') return 'projects';
  return null; // anything else → 404
};

const resolveCurrentPage = () => {
  // Tier 1 — query param: ?page= then ?tab=
  const params = new URLSearchParams(window.location.search);
  const queryCandidate = params.get('page') || params.get('tab');
  if (queryCandidate) {
    const resolved = resolveTabFromCandidate(queryCandidate);
    return resolved || '404';
  }

  // Tier 2 — legacy hash
  if (window.location.hash) {
    const hashCandidate = window.location.hash.slice(1).replace(/^\/+/, '').toLowerCase();
    if (hashCandidate) {
      const resolved = resolveTabFromCandidate(hashCandidate);
      return resolved || '404';
    }
  }

  // Tier 3 — pathname
  const base = getBasePath();
  let pathSegment = window.location.pathname;
  if (base !== '/') {
    pathSegment = pathSegment.slice(base.length - 1); // keep leading slash
  }
  const segments = pathSegment.split('/').filter(Boolean).filter((s) => s.toLowerCase() !== 'index.html');
  if (segments.length === 0) return 'home';
  if (segments.length === 1) {
    const resolved = resolveTabFromCandidate(segments[0]);
    return resolved || '404';
  }
  return '404';
};

export default function App() {
  const [activePage, setActivePage] = useState(() => resolveCurrentPage());
  const [isLoading, setIsLoading] = useState(() => resolveCurrentPage() !== '404');
  const [isContentReady, setIsContentReady] = useState(() => resolveCurrentPage() === '404');
  const [sphereTransitionId, setSphereTransitionId] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('left');
  const [transitionLabel, setTransitionLabel] = useState('');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  const tabTransitionTimerRef = useRef(null);
  const mainContentRef = useRef(null);
  const pullIndicatorRef = useRef(null);
  const pullLabelRef = useRef(null);
  const pullSphereProgressRef = useRef(0);
  const cursorScaleSetRef = useRef(null);

  const resetPullVisuals = useCallback(() => {
    pullSphereProgressRef.current = 0;
    if (mainContentRef.current) {
      mainContentRef.current.style.opacity = '';
      mainContentRef.current.style.transform = '';
    }
    if (pullIndicatorRef.current) {
      pullIndicatorRef.current.style.opacity = '0';
      pullIndicatorRef.current.style.transform = 'translate(-50%, 16px)';
    }
  }, []);

  const triggerTabTransition = useCallback(
    (page, updateHistory = true, fromMobilePull = false) => {
      // 0. Reset cursor scale; close nothing else here
      if (cursorScaleSetRef.current) cursorScaleSetRef.current(1);

      // 1. History
      if (updateHistory) {
        const targetUrl = getPageUrl(page);
        if (window.location.pathname !== targetUrl || window.location.hash) {
          window.history.pushState({ page }, '', targetUrl);
        }
      }

      // 2. Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 3. Early exit — same page re-click
      if (page === activePage && !isTabTransitioning && !fromMobilePull) {
        resetPullVisuals();
        return;
      }

      // 4. 404 — no sphere animation
      if (page === '404') {
        if (tabTransitionTimerRef.current) {
          clearTimeout(tabTransitionTimerRef.current);
          tabTransitionTimerRef.current = null;
        }
        resetPullVisuals();
        setIsTabTransitioning(false);
        setActivePage('404');
        return;
      }

      // 5. Direction from tab order — forward navigation → 'left'
      const fromIdx = TAB_SEQUENCE.indexOf(activePage);
      const toIdx = TAB_SEQUENCE.indexOf(page);
      setTransitionDirection(toIdx >= fromIdx || fromIdx === -1 ? 'left' : 'right');

      // 6. Activate immediately so the header pill updates during the animation
      setTransitionLabel(TAB_LABELS[page] || '');
      setActivePage(page);
      setIsTabTransitioning(true);
      setSphereTransitionId((id) => id + 1);
      resetPullVisuals();

      // 7. Schedule reveal
      const revealDelayMs = fromMobilePull ? 880 : 1460;
      if (tabTransitionTimerRef.current) clearTimeout(tabTransitionTimerRef.current);
      tabTransitionTimerRef.current = window.setTimeout(() => {
        setIsTabTransitioning(false);
        tabTransitionTimerRef.current = null;
      }, revealDelayMs);
    },
    [activePage, isTabTransitioning, resetPullVisuals]
  );

  // ---- Initial-mount URL normalisation (legacy /#projects, /?page=projects → /projects) ----
  useEffect(() => {
    const initialPage = resolveCurrentPage();
    if (initialPage === '404') return;
    const targetUrl = getPageUrl(initialPage);
    const hadHash = !!window.location.hash;
    const hadQuery = !!window.location.search;
    const pathDiffers =
      window.location.pathname !== targetUrl && window.location.pathname !== `${targetUrl}/`;
    if (hadHash || hadQuery || pathDiffers) {
      window.history.replaceState({ page: initialPage }, '', targetUrl);
    }
  }, []);

  // ---- popstate ----
  useEffect(() => {
    const onPopState = () => {
      const page = resolveCurrentPage();
      triggerTabTransition(page, false, false);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [triggerTabTransition]);

  // ---- Loader completion ----
  const handleLoaderComplete = useCallback(() => {
    setIsLoading(false);
    setIsContentReady(true);
  }, []);

  // ---- Mobile pull-to-sphere gesture (§3.3) ----
  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const DEADZONE_PX = 20;
    const FULL_SPHERE_PULL_PX = 155;

    let bottomAnchorY = null;
    let isDragging = false;

    const isAtBottom = () => {
      const scrollEl = document.scrollingElement || document.documentElement;
      const maxScroll = Math.max(0, scrollEl.scrollHeight - window.innerHeight);
      return window.scrollY >= maxScroll - 10;
    };

    const gestureAllowed = (e) => {
      if (isLoading || isTabTransitioning || isCertificateModalOpen) return false;
      if (activePage === '404') return false;
      if (!e.touches || e.touches.length !== 1) return false;
      if (e.target && typeof e.target.closest === 'function' && e.target.closest('.overflow-y-auto')) return false;
      return true;
    };

    const handleTouchStart = (e) => {
      if (!gestureAllowed(e)) return;
      if (isAtBottom()) {
        bottomAnchorY = e.touches[0].clientY;
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;

      if (!isDragging) {
        // anchor mid-drag if the user reaches the bottom during the drag
        if (gestureAllowed(e) && isAtBottom()) {
          bottomAnchorY = currentY;
          isDragging = true;
        } else {
          return;
        }
      }

      const pullPixels = Math.max(0, bottomAnchorY - currentY);
      const progress = Math.min(1, (pullPixels - DEADZONE_PX) / FULL_SPHERE_PULL_PX);
      const clamped = Math.max(0, progress);

      if (!isAtBottom() && clamped <= 0) {
        bottomAnchorY = null;
        isDragging = false;
        resetPullVisuals();
        return;
      }

      pullSphereProgressRef.current = clamped;

      // Direct DOM writes via refs — no React state (P6)
      if (mainContentRef.current) {
        if (clamped <= 0.01) {
          mainContentRef.current.style.opacity = '';
          mainContentRef.current.style.transform = '';
        } else {
          const contentOpacity = Math.max(0.08, 1 - clamped * 0.88);
          const contentScale = 1 - clamped * 0.04;
          mainContentRef.current.style.opacity = contentOpacity.toFixed(3);
          mainContentRef.current.style.transform = `scale(${contentScale.toFixed(3)})`;
        }
      }

      if (pullIndicatorRef.current && pullLabelRef.current) {
        if (clamped > 0.04) {
          const fromIdx = TAB_SEQUENCE.indexOf(activePage);
          const nextTab = TAB_SEQUENCE[(fromIdx + 1) % TAB_SEQUENCE.length];
          const nextLabel = TAB_LABELS[nextTab] || '';

          const opacity = Math.min(1, clamped * 1.6);
          pullIndicatorRef.current.style.opacity = String(opacity);
          pullIndicatorRef.current.style.transform = `translate(-50%, ${Math.round((1 - clamped) * 14)}px)`;

          const isReady = clamped >= 0.92;
          pullIndicatorRef.current.style.borderColor = isReady
            ? 'rgba(200,167,84,0.85)'
            : 'rgba(200,167,84,0.3)';
          pullIndicatorRef.current.style.boxShadow = isReady
            ? '0 0 20px rgba(200,167,84,0.45)'
            : '0 4px 16px rgba(0,0,0,0.5)';
          pullLabelRef.current.textContent = isReady
            ? `Release to kick off ${nextLabel} ⚽`
            : `Scroll down for ${nextLabel} • ${Math.round(clamped * 100)}%`;
        } else {
          pullIndicatorRef.current.style.opacity = '0';
          pullIndicatorRef.current.style.transform = 'translate(-50%, 16px)';
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      const progress = pullSphereProgressRef.current;
      isDragging = false;
      bottomAnchorY = null;
      if (progress >= 0.92) {
        const fromIdx = TAB_SEQUENCE.indexOf(activePage);
        const nextTab = TAB_SEQUENCE[(fromIdx + 1) % TAB_SEQUENCE.length];
        triggerTabTransition(nextTab, true, true);
      } else {
        resetPullVisuals();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [activePage, isLoading, isTabTransitioning, isCertificateModalOpen, triggerTabTransition, resetPullVisuals]);

  // ---- Cleanup transition timer on unmount ----
  useEffect(() => {
    return () => {
      if (tabTransitionTimerRef.current) clearTimeout(tabTransitionTimerRef.current);
    };
  }, []);

  const is404 = activePage === '404';

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Hero onNavigate={triggerTabTransition} />;
      case 'profile':
        return <About />;
      case 'education':
        return <Education />;
      case 'projects':
        return <ProjectList />;
      case 'certificates':
        return <Certificates onModalChange={setIsCertificateModalOpen} />;
      case 'achievements':
        return <Achievements />;
      case 'experience':
        return <Experience />;
      case 'contact':
        return <Footer />;
      case '404':
      default:
        return <NotFound onGoHome={() => triggerTabTransition('home', true, false)} />;
    }
  };

  // ---- 404 layout: no header, no chat, no HUD, no loader ----
  if (is404) {
    return (
      <>
        <LiquidBackground />
        <InteractiveParticles activePage={activePage} sphereTransitionId={0} pullSphereProgressRef={pullSphereProgressRef} />
        <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
          <NotFound onGoHome={() => triggerTabTransition('home', true, false)} />
        </div>
        <BlueCursor />
      </>
    );
  }

  return (
    <>
      <LiquidBackground />
      <InteractiveParticles
        activePage={activePage}
        sphereTransitionId={sphereTransitionId}
        pullSphereProgressRef={pullSphereProgressRef}
      />

      <AnimatePresence>
        {isTabTransitioning && sphereTransitionId > 0 && (
          <GoalNetTransition
            key={sphereTransitionId}
            transitionId={sphereTransitionId}
            active
            direction={transitionDirection}
            label={transitionLabel}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 md:cursor-none min-h-screen flex flex-col justify-between">
        <Header
          activePage={activePage}
          onNavigate={triggerTabTransition}
          isHidden={isCertificateModalOpen}
          isTabLoaded={isContentReady && !isTabTransitioning}
        />

        <main ref={mainContentRef} className="flex-grow transition-transform duration-75 origin-center">
          <AnimatePresence mode="wait">
            {isContentReady && !isTabTransitioning && (
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.16 } }}
              >
                {renderPage()}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AIChat />
      </div>

      <ScrollHUD />

      <GoldCursor onScaleReady={cursorScaleSetRef} />

      <AnimatePresence>{isLoading && <AppleHelloLoader onComplete={handleLoaderComplete} />}</AnimatePresence>

      {/* Mobile pull pill */}
      <div
        ref={pullIndicatorRef}
        className="fixed bottom-6 left-1/2 z-50 px-4 py-2 rounded-full bg-black/85 backdrop-blur-md border border-[#C8A754]/30 text-[#C8A754] text-xs font-mono uppercase tracking-widest pointer-events-none select-none transition-opacity duration-150"
        style={{ opacity: 0, transform: 'translate(-50%, 16px)' }}
      >
        <span ref={pullLabelRef}></span>
      </div>
    </>
  );
}

// ---- Custom cursor (desktop only) — gold droplet ----
// Zero-lag implementation: the dot's position is written directly to the DOM on
// every mousemove (translate3d, compositor-only) instead of being routed
// through MotionValue → React → spring, which introduced a visible trailing
// delay. Hover grow/shrink animates on a separate inner element via a short CSS
// transition so position stays exact while scale eases.
function GoldCursor({ onScaleReady }) {
  const dotRef = useRef(null);
  const innerRef = useRef(null);
  const scaleRef = useRef(1);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const applyTransform = () => {
      if (dotRef.current) {
        const { x, y } = posRef.current;
        dotRef.current.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;
      }
    };

    const applyScale = () => {
      if (innerRef.current) {
        innerRef.current.style.transform = `scale(${scaleRef.current})`;
      }
    };

    const setScale = (v) => {
      scaleRef.current = v;
      applyScale();
    };
    if (onScaleReady) onScaleReady.current = setScale;

    const isHoverable = (target) => {
      if (!target || typeof target.closest !== 'function') return false;
      return !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
    };

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      applyTransform();
    };
    const handleMouseOver = (e) => {
      if (isHoverable(e.target)) setScale(1.8);
    };
    const handleMouseOut = (e) => {
      if (!e.relatedTarget || !isHoverable(e.relatedTarget)) setScale(1);
    };
    const handlePointerDown = () => setScale(1);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('pointerdown', handlePointerDown);
      if (onScaleReady) onScaleReady.current = null;
    };
  }, [onScaleReady]);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{ willChange: 'transform', transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        ref={innerRef}
        className="glass-cursor w-5 h-5"
        style={{ transition: 'transform 0.16s ease-out' }}
      />
    </div>
  );
}

// ---- 404 cursor — blue droplet variant (same zero-lag mechanism) ----
function BlueCursor() {
  const dotRef = useRef(null);
  const innerRef = useRef(null);
  const scaleRef = useRef(1);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const applyTransform = () => {
      if (dotRef.current) {
        const { x, y } = posRef.current;
        dotRef.current.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`;
      }
    };

    const applyScale = () => {
      if (innerRef.current) {
        innerRef.current.style.transform = `scale(${scaleRef.current})`;
      }
    };

    const setScale = (v) => {
      scaleRef.current = v;
      applyScale();
    };

    const isHoverable = (target) => {
      if (!target || typeof target.closest !== 'function') return false;
      return !!target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
    };

    const handleMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      applyTransform();
    };
    const handleMouseOver = (e) => {
      if (isHoverable(e.target)) setScale(1.8);
    };
    const handleMouseOut = (e) => {
      if (!e.relatedTarget || !isHoverable(e.relatedTarget)) setScale(1);
    };
    const handlePointerDown = () => setScale(1);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
      style={{ willChange: 'transform', transform: 'translate3d(-100px, -100px, 0)' }}
    >
      <div
        ref={innerRef}
        className="glass-cursor-dark w-5 h-5"
        style={{ transition: 'transform 0.16s ease-out' }}
      />
    </div>
  );
}
