import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, File, Github, Instagram, Linkedin } from 'lucide-react';
import { AnimatePresence, motion, useSpring } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import Typewriter from '@/components/type-writer';
import UnderlineToBackground from '@/components/underline-background';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const IMAGE_CONFIG = {
  width: 380,
  height: 200,
  offsetY: -230,
  tiltAngle: 14,
  springDamping: 25,
  springStiffness: 250,
  borderRadius: '15px',
};

const experiences = [
  {
    dateKey: 'exp.codeidFront.date',
    company: 'Code ID',
    roleKey: 'exp.codeidFront.role',
    descKey: 'exp.codeidFront.desc',
    tech: ['React', 'TypeScript', 'Framer Motion', 'TanStack', 'Tailwind'],
    link: 'https://www.code.id/',
  },
  {
    dateKey: 'exp.codeidSpecialist.date',
    company: 'Code ID',
    roleKey: 'exp.codeidSpecialist.role',
    descKey: 'exp.codeidSpecialist.desc',
    tech: ['Project Management', 'SQL Server', 'PostgreSQL', 'SSIS', 'Azure DevOps'],
    link: 'https://www.code.id/',
  },
  {
    dateKey: 'exp.bafFront.date',
    company: 'Bussan Auto Finance',
    roleKey: 'exp.bafFront.role',
    descKey: 'exp.bafFront.desc',
    tech: ['React.js', 'SASS', 'Redux', 'ReduxForm', 'Bootstrap'],
    link: 'https://www.baf.id/en',
  },
];

const projects = [
  {
    titleKey: 'proj.uob.title',
    descKey: 'proj.uob.desc',
    tags: ['React', 'Redux', 'Redux Form', 'CSS'],
    link: 'https://infinity.uob.co.id/',
    image: '/images/uob.png',
  },
  {
    titleKey: 'proj.sandiabaf.title',
    descKey: 'proj.sandiabaf.desc',
    tags: ['React', 'Redux', 'Bootstrap'],
    link: 'https://www.baf.id/login',
    image: '/images/sandiabaf.png',
  },
  {
    titleKey: 'proj.telkomedika.title',
    descKey: 'proj.telkomedika.desc',
    tags: ['React', 'Axios', 'Tailwind'],
    link: '#',
    image: '/images/web-not-available.png',
  },
];

const SECTIONS = [
  { id: 'introduction' },
  { id: 'experience' },
  { id: 'project' },
  { id: 'works', disabled: true },
  { id: 'article', disabled: true },
  { id: 'bored', disabled: true },
];

export const Experience: React.FC = () => {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState('introduction');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Smooth Physics Physics Springs for Mouse Movement & Dynamic Rotation
  const mouseX = useSpring(0, {
    damping: IMAGE_CONFIG.springDamping,
    stiffness: IMAGE_CONFIG.springStiffness,
  });
  const mouseY = useSpring(0, {
    damping: IMAGE_CONFIG.springDamping,
    stiffness: IMAGE_CONFIG.springStiffness,
  });
  const rotateX = useSpring(0, { damping: 20, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 20, stiffness: 200 });

  const prevPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;

    // Calculate mouse velocity for interactive dynamic rotation/tilt
    const deltaX = clientX - prevPos.current.x;
    const deltaY = clientY - prevPos.current.y;

    prevPos.current = { x: clientX, y: clientY };

    mouseX.set(clientX - IMAGE_CONFIG.width / 2 + 200);
    mouseY.set(clientY + IMAGE_CONFIG.offsetY);

    // Calculate dynamic tilt based on cursor directional speed
    const maxVelocity = 30;
    const clampedDx = Math.max(-maxVelocity, Math.min(maxVelocity, deltaX));
    const clampedDy = Math.max(-maxVelocity, Math.min(maxVelocity, deltaY));

    rotateX.set((-clampedDy / maxVelocity) * IMAGE_CONFIG.tiltAngle);
    rotateY.set((clampedDx / maxVelocity) * IMAGE_CONFIG.tiltAngle);
  };

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.exp-card');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-25% 0px -55% 0px' },
    );

    SECTIONS.forEach((sec) => {
      if (sec.disabled) return;
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    const handleScrollDetect = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      if (isAtBottom) {
        setActiveSection('article');
      }
    };
    window.addEventListener('scroll', handleScrollDetect, { passive: true });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollDetect);
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      setActiveSection(id);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <section
      id="experience-container"
      className="bg-[var(--bg-primary)] px-6 pt-28 md:px-12 lg:px-20 xl:px-50"
      ref={containerRef}
    >
      <div className="relative container mx-auto grid grid-cols-1 gap-12 lg:grid-cols-[50%_50%] lg:gap-16">
        {/* Floating Dynamic Portal Preview */}
        {isMounted &&
          createPortal(
            <AnimatePresence>
              {hoveredImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 20 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    position: 'fixed',
                    left: mouseX,
                    top: mouseY,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    width: `${IMAGE_CONFIG.width}px`,
                    height: `${IMAGE_CONFIG.height}px`,
                    borderRadius: IMAGE_CONFIG.borderRadius,
                    perspective: 1000,
                    zIndex: 999999,
                  }}
                  className="pointer-events-none hidden overflow-hidden border border-white/20 bg-zinc-900 shadow-2xl md:block"
                >
                  <img
                    src={hoveredImage}
                    alt="Project Preview"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>,
            document.body,
          )}

        {/* Left Side: Sticky */}
        <div className="flex flex-col justify-between gap-8 lg:sticky lg:top-28 lg:h-[calc(100vh-200px)] lg:gap-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold">
                {intl.formatMessage({ id: 'intro.headline' })}
              </h2>

              <p className="max-w-xs leading-relaxed text-[var(--text-muted)]">
                {intl.formatMessage({ id: 'experience.shortBio' })}
              </p>
            </div>

            <nav className="hidden flex-col gap-4 py-12 lg:flex">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                const label = intl.formatMessage({ id: `sections.${sec.id}` });

                if (sec.disabled) {
                  return (
                    <div
                      key={sec.id}
                      className="group flex cursor-not-allowed items-center gap-4 text-xs font-semibold tracking-widest uppercase opacity-40 select-none"
                    >
                      <span className="h-px w-8 !bg-[var(--text-muted)]" />
                      <div className="flex items-center gap-2">
                        <span className="!text-[var(--text-muted)] line-through">{label}</span>
                        <span className="border-orange/30 !text-orange bg-orange/5 rounded border px-1 py-0.5 text-[8px] leading-none font-bold tracking-widest uppercase">
                          Soon
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => handleScroll(e, sec.id)}
                    className="group flex items-center gap-4 text-xs font-semibold tracking-widest uppercase transition-all"
                  >
                    <span
                      className={cn(
                        'h-px transition-all duration-300',
                        isActive
                          ? '!bg-orange w-16'
                          : 'group-hover:!bg-orange w-8 !bg-[var(--text-muted)] group-hover:w-16',
                      )}
                    />
                    <span
                      className={cn(
                        'transition-colors duration-300',
                        isActive
                          ? '!text-orange'
                          : 'group-hover:!text-orange !text-[var(--text-muted)]',
                      )}
                    >
                      {label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex gap-6 text-[var(--text-muted)]">
            <a
              href="https://id.linkedin.com/in/dimasadihartomo"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com/dimsaadimo/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://github.com/dimasadimo/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange transition-colors"
            >
              <Github size={20} />
            </a>
          </div>
        </div>

        {/* Right Side: Scrollable */}
        <div className="mt-2 mb-4 space-y-16 lg:mt-4 lg:mb-14 lg:space-y-24">
          {/* Section 1: Introduction */}
          <section id="introduction" className="scroll-mt-20 space-y-6">
            <h1 className="text-[15px] font-medium text-[var(--text-primary)]">Dimas Adimo</h1>
            <div className="max-w-xl space-y-4 text-[15px] leading-relaxed">
              <p className="text-[var(--text-muted)]">
                <FormattedMessage
                  id="intro.p1"
                  values={{
                    role: (
                      <span className="inline-block min-w-[120px]">
                        <Typewriter
                          text={['Design Engineer', 'Fullstack Developer']}
                          speed={70}
                          waitTime={1500}
                          deleteSpeed={40}
                          cursorChar={'_'}
                          className="text-[var(--text-muted)]"
                          cursorClassName="text-[var(--color-orange)]"
                        />
                      </span>
                    ),
                    location: (
                      <UnderlineToBackground
                        targetTextColor="var(--bg-primary)"
                        className="cursor-pointer text-[var(--text-primary)]"
                        underlineHeightRatio={0.07}
                      >
                        {intl.formatMessage({ id: 'intro.p1Location' })}
                      </UnderlineToBackground>
                    ),
                  }}
                />
              </p>
              <p className="text-[var(--text-muted)]">{intl.formatMessage({ id: 'intro.p2' })}</p>
              <p className="text-[var(--text-muted)]">
                <FormattedMessage
                  id="intro.p3"
                  values={{
                    baf: (
                      <UnderlineToBackground
                        targetTextColor="var(--bg-primary)"
                        className="cursor-pointer text-[var(--text-primary)]"
                        underlineHeightRatio={0.07}
                      >
                        {intl.formatMessage({ id: 'intro.baf' })}
                      </UnderlineToBackground>
                    ),
                    deloitte: (
                      <UnderlineToBackground
                        targetTextColor="var(--bg-primary)"
                        className="cursor-pointer text-[var(--text-primary)]"
                        underlineHeightRatio={0.07}
                      >
                        {intl.formatMessage({ id: 'intro.deloitte' })}
                      </UnderlineToBackground>
                    ),
                    codeid: (
                      <UnderlineToBackground
                        targetTextColor="var(--bg-primary)"
                        className="cursor-pointer text-[var(--text-primary)]"
                        underlineHeightRatio={0.07}
                      >
                        {intl.formatMessage({ id: 'intro.codeid' })}
                      </UnderlineToBackground>
                    ),
                  }}
                />
              </p>
            </div>
          </section>

          {/* Section 2: Experience */}
          <section id="experience" className="scroll-mt-28 space-y-6">
            <h2 className="border-b border-gray-400 pb-2 text-[13px] font-medium tracking-widest text-zinc-400 uppercase">
              <a
                href="#experience"
                className="-mx-2 inline-block cursor-pointer rounded px-2 py-1 transition-colors duration-200 hover:bg-zinc-400/50"
              >
                {intl.formatMessage({ id: 'exp.years' })}
              </a>
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="exp-card group hover:bg-orange/5 hover:border-orange/10 relative cursor-default rounded-xl border border-transparent p-4 transition-colors sm:p-6"
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[25%_75%]">
                    <span className="py-1 text-xs font-bold text-[var(--text-muted)]">
                      {intl.formatMessage({ id: exp.dateKey })}
                    </span>
                    <div className="space-y-3">
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link inline-block"
                      >
                        <h3 className="group-hover:text-orange flex items-center gap-2 text-xl font-bold transition-colors">
                          {intl.formatMessage({ id: exp.roleKey })} · {exp.company}
                          <ArrowUpRight
                            size={16}
                            className="translate-x-[-10px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                          />
                        </h3>
                      </a>
                      <p className="leading-relaxed text-[var(--text-muted)]">
                        {intl.formatMessage({ id: exp.descKey })}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.tech.map((t, i) => (
                          <span
                            key={i}
                            className="border-orange/20 text-orange bg-orange/5 dark:bg-orange/10 rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider uppercase"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <a
                href="/my-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-block"
              >
                <h3 className="group-hover/link:text-orange flex items-center gap-2 text-sm transition-colors">
                  <File size={16} />
                  {intl.formatMessage({ id: 'exp.resume' })}
                  <ArrowUpRight
                    size={16}
                    className="translate-x-[-4px] opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
                  />
                </h3>
              </a>
            </div>
          </section>

          {/* Section 3: Project */}
          <section id="project" className="scroll-mt-28 space-y-6">
            <h2 className="border-b border-gray-400 pb-2 text-[13px] font-medium tracking-widest text-zinc-400 uppercase">
              <a
                href="#project"
                className="-mx-2 inline-block cursor-pointer rounded px-2 py-1 transition-colors duration-200 hover:bg-zinc-400/50"
              >
                {intl.formatMessage({ id: 'proj.title' })}
              </a>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj, idx) => (
                <a
                  key={idx}
                  href={proj.link}
                  onMouseEnter={() => setHoveredImage(proj.image)}
                  onMouseLeave={() => setHoveredImage(null)}
                  onMouseMove={handleMouseMove}
                  className="group hover:border-orange/20 hover:bg-orange/5 block rounded-xl p-4 transition-all duration-300 sm:p-6"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="group-hover:text-orange flex items-center gap-1.5 text-[16px] font-semibold text-[var(--text-primary)] transition-colors">
                      {intl.formatMessage({ id: proj.titleKey })}
                      <ArrowUpRight
                        size={14}
                        className="translate-x-0.5 -translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                      />
                    </h3>
                  </div>
                  <p className="mb-4 text-[14px] leading-relaxed text-[var(--text-muted)]">
                    {intl.formatMessage({ id: proj.descKey })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((t, i) => (
                      <span
                        key={i}
                        className="border-orange/15 text-orange bg-orange/5 dark:bg-orange/10 rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
