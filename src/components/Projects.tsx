import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIntl } from 'react-intl';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

type FilterType = 'all' | 'react' | 'fullstack' | 'uiux';

const projects = [
  {
    id: 1,
    title: "EcoSphere Dashboard",
    description: "A real-time environmental monitoring dashboard with complex data visualizations and predictive analytics.",
    tags: ["React", "D3.js", "Firebase"],
    category: "react",
    image: "https://picsum.photos/seed/eco/800/450",
    link: "#",
    github: "#",
    featured: true
  },
  {
    id: 2,
    title: "Nexus Marketplace",
    description: "Multi-vendor e-commerce platform with automated logistics and payment integrations.",
    tags: ["Next.js", "PostgreSQL", "Stripe"],
    category: "fullstack",
    image: "https://picsum.photos/seed/nexus/800/450",
    link: "#",
    github: "#"
  },
  {
    id: 3,
    title: "Voyager UI Kit",
    description: "A comprehensive design system and component library focused on high-density data applications.",
    tags: ["Figma", "React", "Storybook"],
    category: "uiux",
    image: "https://picsum.photos/seed/voyager/800/450",
    link: "#",
    github: "#"
  },
  {
    id: 4,
    title: "SynthAI",
    description: "Generative AI music engine that converts text prompts into high-quality atmospheric soundscapes.",
    tags: ["React", "Python", "TensorFlow"],
    category: "fullstack",
    image: "https://picsum.photos/seed/synth/800/450",
    link: "#",
    github: "#"
  }
];

export const Projects: React.FC = () => {
  const intl = useIntl();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredProjects = projects.filter(p => filter === 'all' || p.category === filter);

  return (
    <section id="projects" className="py-24 px-4 md:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-display font-bold tracking-tighter">
              {intl.formatMessage({ id: 'projects.title' })}
            </h2>
            <p className="text-[var(--text-muted)] text-lg max-w-md">
              A curated selection of my recent works across engineering and design.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 p-1 bg-[var(--border-color)] rounded-full border border-[var(--border-color)]">
            {(['all', 'react', 'fullstack', 'uiux'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative px-6 py-2 text-sm font-semibold uppercase tracking-wider rounded-full transition-all",
                  filter === f ? "text-white" : "text-[var(--text-muted)] hover:text-orange"
                )}
              >
                {filter === f && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-orange rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {intl.formatMessage({ id: `projects.filters.${f}` })}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl glass p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange/10",
                  project.featured ? "md:col-span-2" : ""
                )}
              >
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                  
                  <div className="absolute bottom-6 right-6 flex gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <a href={project.github} className="p-3 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-full hover:bg-orange hover:text-white transition-colors">
                      <Github size={20} />
                    </a>
                    <a href={project.link} className="p-3 bg-[var(--bg-primary)] text-[var(--text-primary)] rounded-full hover:bg-orange hover:text-white transition-colors">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                <div className="px-4 pb-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold uppercase tracking-widest text-orange/80 border border-orange/20 px-2.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold">{project.title}</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Gradient Border Accent */}
                <div className="absolute inset-0 border border-transparent group-hover:border-orange/30 rounded-3xl transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
