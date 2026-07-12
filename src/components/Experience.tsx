import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useIntl, FormattedMessage } from 'react-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Linkedin, Instagram, Github, File } from 'lucide-react';
import { cn } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    dateKey: "exp.codeidFront.date",
    company: "Code ID",
    roleKey: "exp.codeidFront.role",
    descKey: "exp.codeidFront.desc",
    tech: ["React", "TypeScript", "Framer Motion", "TanStack", "Tailwind"],
    link: "https://www.code.id/"
  },
  {
    dateKey: "exp.codeidSpecialist.date",
    company: "Code ID",
    roleKey: "exp.codeidSpecialist.role",
    descKey: "exp.codeidSpecialist.desc",
    tech: ["Project Management", "SQL Server", "PostgreSQL", "SSIS", "Azure DevOps"],
    link: "https://www.code.id/"
  },
  {
    dateKey: "exp.bafFront.date",
    company: "Bussan Auto Finance",
    roleKey: "exp.bafFront.role",
    descKey: "exp.bafFront.desc",
    tech: ["React.js", "SASS", "Redux", "ReduxForm", "Bootstrap"],
    link: "https://www.baf.id/en"
  },
];

interface WorkItem {
  image: string;
  alt: string;
}

interface LibraryItem {
  title: string;
  status?: string;
  category: string;
  date: string;
}

const workItems: WorkItem[] = [
  { image: "/api/placeholder/400/300", alt: "Project 1" },
  { image: "/api/placeholder/400/300", alt: "Project 2" },
  { image: "/api/placeholder/400/300", alt: "Project 3" },
  { image: "/api/placeholder/400/300", alt: "Project 4" },
  { image: "/api/placeholder/400/300", alt: "Project 5" },
  { image: "/api/placeholder/400/300", alt: "Project 6" },
];

const libraryItems: LibraryItem[] = [
  { title: "Simply Effective", status: "DRAFT", category: "Craft", date: "00/00" },
  { title: "Why is the Web Afraid of Sound?", status: "DRAFT", category: "Craft", date: "00/00" },
  { title: "Understanding Springs", status: "DRAFT", category: "Animation", date: "00/00" },
  { title: "12 Principles of Animation", category: "Animation", date: "04/08" },
  { title: "Chasing Approval", category: "Thoughts", date: "28/07" },
  { title: "White Tees", category: "Fashion", date: "27/07" },
  { title: "Building vs. Banking", category: "Thoughts", date: "21/06" },
  { title: "The Concept of Taste", category: "Thoughts", date: "11/03" }
];

const projects = [
  {
    titleKey: "proj.ecosphere.title",
    descKey: "proj.ecosphere.desc",
    tags: ["React", "D3.js", "Firebase"],
    link: "#"
  },
  {
    titleKey: "proj.nexus.title",
    descKey: "proj.nexus.desc",
    tags: ["Next.js", "PostgreSQL", "Stripe"],
    link: "#"
  },
  {
    titleKey: "proj.voyager.title",
    descKey: "proj.voyager.desc",
    tags: ["Figma", "React", "Storybook"],
    link: "#"
  }
];

const SECTIONS = [
  { id: "introduction" },
  { id: "experience" },
  { id: "project" },
  { id: "works", disabled: true  },
  { id: "article", disabled: true },
  { id: "bored", disabled: true }
];

export const Experience: React.FC = () => {
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const cards = gsap.utils.toArray('.exp-card');
    cards.forEach((card: any) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
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
      { rootMargin: "-25% 0px -55% 0px" }
    );

    SECTIONS.forEach((sec) => {
      if (sec.disabled) return;
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    const handleScrollDetect = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      if (isAtBottom) {
        setActiveSection("article");
      }
    };
    window.addEventListener("scroll", handleScrollDetect, { passive: true });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollDetect);
    };
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      setActiveSection(id);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <section id="experience-container" className="pt-28 px-6 md:px-12 lg:px-20 xl:px-50 bg-[var(--bg-primary)]" ref={containerRef}>
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[50%_50%] gap-12 lg:gap-16 relative">
        
        {/* Left Side: Sticky */}
        <div className="lg:h-[calc(100vh-200px)] lg:sticky lg:top-28 flex flex-col justify-between py-4 gap-8 lg:gap-0">
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold">
                {intl.formatMessage({ id: 'intro.headline' })}
              </h2>
              <p className="text-[var(--text-muted)] max-w-xs leading-relaxed">
                {intl.formatMessage({ id: 'experience.shortBio' })}
              </p>
            </div>

            <nav className="hidden lg:flex flex-col gap-4 py-12">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                const label = intl.formatMessage({ id: `sections.${sec.id}` });
                
                if (sec.disabled) {
                  return (
                    <div 
                      key={sec.id}
                      className="group flex items-center gap-4 text-xs font-semibold tracking-widest uppercase cursor-not-allowed opacity-40 select-none"
                    >
                      <span className="w-8 h-px !bg-[var(--text-muted)]" />
                      <div className="flex items-center gap-2">
                        <span className="line-through !text-[var(--text-muted)]">
                          {label}
                        </span>
                        <span className="text-[8px] tracking-widest px-1 py-0.5 rounded border border-orange/30 !text-orange font-bold uppercase bg-orange/5 leading-none">
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
                    <span className={cn(
                      "h-px transition-all duration-300",
                      isActive ? "w-16 !bg-orange" : "w-8 !bg-[var(--text-muted)] group-hover:w-16 group-hover:!bg-orange"
                    )} />
                    <span className={cn(
                      "transition-colors duration-300",
                      isActive ? "!text-orange" : "!text-[var(--text-muted)] group-hover:!text-orange"
                    )}>
                      {label}
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex gap-6 text-[var(--text-muted)] ">
            <a href="https://id.linkedin.com/in/dimasadihartomo" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors"><Linkedin size={20} /></a>
            <a href="https://www.instagram.com/dimsaadimo/" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors"><Instagram size={20} /></a>
            <a href="https://github.com/dimasadimo/" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors"><Github size={20} /></a>
          </div>
        </div>

        {/* Right Side: Scrollable */}
        <div className="space-y-16 lg:space-y-24 mt-4 lg:mt-10 mb-10 lg:mb-18">
          {/* Section 1: Introduction */}
          <section id="introduction" className="space-y-6 scroll-mt-28">
            <h1 className="text-[15px] font-medium text-[var(--text-primary)]">Dimas Adimo</h1>
            <div className="space-y-4 text-[15px] leading-relaxed max-w-xl">
              <p className="text-[var(--text-muted)]">
                <FormattedMessage
                  id="intro.p1"
                  values={{
                    location: (
                      <span className="text-[var(--text-primary)] underline underline-offset-4 cursor-pointer">
                        {intl.formatMessage({ id: 'intro.p1Location' })}
                      </span>
                    )
                  }}
                />
              </p>
              <p className="text-[var(--text-muted)]">
                {intl.formatMessage({ id: 'intro.p2' })}
              </p>
              <p className="text-[var(--text-muted)]">
                <FormattedMessage
                  id="intro.p3"
                  values={{
                    baf: (
                      <span className="text-[var(--text-primary)] underline underline-offset-4 cursor-pointer">
                        {intl.formatMessage({ id: 'intro.baf' })}
                      </span>
                    ),
                    deloitte: (
                      <span className="text-[var(--text-primary)] underline underline-offset-4 cursor-pointer">
                        {intl.formatMessage({ id: 'intro.deloitte' })}
                      </span>
                    ),
                    codeid: (
                      <span className="text-[var(--text-primary)] underline underline-offset-4 cursor-pointer">
                        {intl.formatMessage({ id: 'intro.codeid' })}
                      </span>
                    )
                  }}
                />
              </p>
            </div>
          </section>

          {/* Section 2: Experience */}
          <section id="experience" className="space-y-6 scroll-mt-28">
            <h2 className="border-b border-gray-400 pb-2 text-[13px] font-medium text-zinc-400 uppercase tracking-widest">
              <a 
                href="#experience"
                className="inline-block -mx-2 rounded px-2 py-1 transition-colors duration-200 hover:bg-zinc-400/50 cursor-pointer"
              >
                {intl.formatMessage({ id: 'exp.years' })}
              </a>
            </h2>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="exp-card group relative p-4 sm:p-6 rounded-xl hover:bg-orange/5 transition-colors border border-transparent hover:border-orange/10 cursor-default"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[25%_75%] gap-4">
                    <span className="text-xs font-bold text-[var(--text-muted)] py-1">
                      {intl.formatMessage({ id: exp.dateKey })}
                    </span>
                    <div className="space-y-3">
                      <a 
                        href={exp.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group/link inline-block"
                      >
                        <h3 className="text-xl font-bold flex items-center gap-2 group-hover:text-orange transition-colors">
                          {intl.formatMessage({ id: exp.roleKey })} · {exp.company}
                          <ArrowUpRight 
                            size={16} 
                            className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" 
                          />
                        </h3>
                      </a>
                      <p className="text-[var(--text-muted)] leading-relaxed">
                        {intl.formatMessage({ id: exp.descKey })}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {exp.tech.map((t, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 rounded-full border border-orange/20 text-[10px] font-bold text-orange uppercase tracking-wider bg-orange/5 dark:bg-orange/10"
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
                <h3 className="text-sm flex items-center gap-2 group-hover/link:text-orange transition-colors">
                  <File size={16} />
                  {intl.formatMessage({ id: 'exp.resume' })}
                  <ArrowUpRight 
                    size={16} 
                    className="opacity-0 group-hover/link:opacity-100 transition-all translate-x-[-4px] group-hover/link:translate-x-0" 
                  />
                </h3>
              </a>
            </div>
          </section>

          {/* Section 3: Project */}
          <section id="project" className="space-y-6 scroll-mt-28">
            <h2 className="border-b border-gray-400 pb-2 text-[13px] font-medium text-zinc-400 uppercase tracking-widest">
              <a 
                href="#project"
                className="inline-block -mx-2 rounded px-2 py-1 transition-colors duration-200 hover:bg-zinc-400/50 cursor-pointer"
              >
                {intl.formatMessage({ id: 'proj.title' })}
              </a>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {projects.map((proj, idx) => (
                <a 
                  key={idx} 
                  href={proj.link}
                  className="group block p-4 sm:p-6 rounded-xl border border-[var(--border-color)] hover:border-orange/20 hover:bg-orange/5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[16px] font-semibold text-[var(--text-primary)] group-hover:text-orange transition-colors flex items-center gap-1.5">
                      {intl.formatMessage({ id: proj.titleKey })}
                      <ArrowUpRight size={14} className="opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                  </div>
                  <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mb-4">
                    {intl.formatMessage({ id: proj.descKey })}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((t, i) => (
                      <span 
                        key={i} 
                        className="px-2.5 py-0.5 rounded-full border border-orange/15 text-[9px] font-bold text-orange uppercase tracking-wider bg-orange/5 dark:bg-orange/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Section 4: Works */}
          {/* <section id="works" className="space-y-6 scroll-mt-28">
            <h2 className="text-[13px] font-medium text-zinc-400 uppercase tracking-widest">Work 19+</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {workItems.map((item, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-lg bg-zinc-50 border border-zinc-100 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={item.image} alt={item.alt} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
            </div>
          </section> */}

          {/* Section 5: Article */}
          {/* <section id="article" className="space-y-6 scroll-mt-28 pb-[35vh]">
            <h2 className="text-[13px] font-medium text-zinc-400 uppercase tracking-widest">Article</h2>
            <div className="space-y-1">
              {libraryItems.map((item, idx) => (
                <div 
                  key={`${item.title}-${idx}`}
                  className="group flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] text-zinc-800 group-hover:text-zinc-500 transition-colors">
                      {item.title}
                    </span>
                    {item.status && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-400 font-bold uppercase tracking-widest">
                        {item.status}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-10">
                    <span className="hidden md:block text-[13px] text-zinc-400 w-20 text-right">
                      {item.category}
                    </span>
                    <span className="text-[13px] text-zinc-400 tabular-nums w-10 text-right">
                      {item.date}
                    </span>
                    <div className="w-4 flex justify-end">
                      <ArrowUpRight 
                        size={14} 
                        className="text-zinc-400 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300 ease-out" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* Section 6: Bored? (soon) - Commented out as requested */}
          {/*
          <section id="bored" className="space-y-6 scroll-mt-28 pb-[35vh]">
            <h2 className="text-[13px] font-medium text-zinc-400 uppercase tracking-widest line-through">Bored?</h2>
            <div className="p-8 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/20 text-center space-y-4 opacity-50 select-none cursor-not-allowed">
              <span className="text-[9px] px-2 py-0.5 rounded border border-zinc-200 text-zinc-400 font-bold uppercase tracking-widest bg-zinc-50 inline-block line-through">
                Disabled
              </span>
              <h3 className="text-xl font-bold text-zinc-400 line-through">Play Retro Arcade Games</h3>
              <p className="text-[14px] text-zinc-400/80 max-w-sm mx-auto leading-relaxed line-through">
                Take a quick break with vintage retro arcade games like Snake, Tetris, or Breakout. We are building this workspace now!
              </p>
            </div>
          </section>
          */}
        </div>
      </div>
    </section>
  );
};
