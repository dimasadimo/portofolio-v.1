import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { Providers } from './components/Providers';
import { Navbar } from './components/Navbar';
import { Experience } from './components/Experience';
import { CursorBorder } from './components/CursorBorder';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { useIsMobile } from './hooks/useIsMobile';

const Bubble = ({ index }: { index: number }) => {
  const isMobile = useIsMobile();
  
  const orangeGradients = [
    'linear-gradient(135deg, #FF6B00 0%, #FF9E00 100%)',
    'linear-gradient(135deg, #FF4D00 0%, #FFB700 100%)',
    'linear-gradient(135deg, #FF9100 0%, #FFD600 100%)',
    'linear-gradient(135deg, #FB8500 0%, #FFB703 100%)',
  ];
  const color = useMemo(() => orangeGradients[index % orangeGradients.length], [index]);

  // Precise positions, sizes, and hover drifts mapped to the user's cyan drawings
  const config = useMemo(() => {
    if (index === 0) {
      // Bubble 1: Left-side edge bubble (vertically centered)
      return {
        width: 'clamp(250px, 25vw, 380px)',
        height: 'clamp(250px, 25vw, 380px)',
        left: isMobile ? '-270px' : 'clamp(-310px, -14vw, -140px)',
        top: '0%',
        animate: {
          x: [0, 15, -15, 0],
          y: [0, -25, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        },
        duration: 18,
      };
    } else {
      // Bubble 2: Bottom-center large bubble
      return {
        width: 'clamp(400px, 65vw, 500px)',
        height: 'clamp(400px, 65vw, 500px)',
        left: 'clamp(50px, 350vw, 96%)',
        top: '45%',
        animate: {
          x: [0, -25, 20, 0],
          y: [0, 20, -20, 0],
          scale: [1, 1.05, 0.96, 1],
        },
        duration: 22,
      };
    }
  }, [index]);

  return (
    <motion.div
      className="absolute rounded-full blur-[50px] md:blur-[70px] will-change-transform"
      style={{
        width: config.width,
        height: config.height,
        left: config.left,
        top: config.top,
        background: color,
        opacity: 0.85,
      }}
      animate={config.animate}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

const PortfolioContent: React.FC = () => {
  const [bubbles] = useState<number[]>([...new Array(2).keys()]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 0% 50%, rgba(255, 158, 0, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        }}
      />

      <div className="fixed inset-0 z-10 select-none pointer-events-none">
        {bubbles.map((id, index) => (
          <Bubble 
            key={id} 
            index={index} 
          />
        ))}
      </div>
      <CursorBorder />
      <main className="relative noise-bg min-h-screen">
        <div className="relative z-10">
          <Experience />
        </div>
        {/* <Hero />
        <div id="works">
          <Projects />
        </div>
        <AnimationShowcase />
        <GameRoom /> */}
        {/* <ResumeMedia />
        <Footer /> */}
      </main>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default function App() {
  return (
    <Providers>
      <PortfolioContent />
    </Providers>
  );
}