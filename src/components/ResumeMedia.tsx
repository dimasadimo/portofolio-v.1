import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useIntl } from 'react-intl';
import { Download, ExternalLink, BookOpen, Clock } from 'lucide-react';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  categories: string[];
}

export const ResumeMedia: React.FC = () => {
  const intl = useIntl();
  const [articles] = useState<Article[]>([
    { 
      title: "Building Scalable Design Systems in React 19", 
      link: "#", 
      pubDate: "2024-03-22", 
      categories: ["Tech"] 
    },
    { 
      title: "The Motion-First Aesthetic: Why We Need GSAP in Modern UI", 
      link: "#", 
      pubDate: "2024-02-15", 
      categories: ["Design"] 
    },
    { 
      title: "Transitioning from Senior React Dev to Design Engineer", 
      link: "#", 
      pubDate: "2024-01-10", 
      categories: ["Career"] 
    },
    { 
      title: "Mastering Three.js Particles for Immersive Web Experiences", 
      link: "#", 
      pubDate: "2023-12-05", 
      categories: ["3D"] 
    },
    { 
      title: "Why Minimal Typography is the Ultimate Sophistication", 
      link: "#", 
      pubDate: "2023-11-12", 
      categories: ["Typography"] 
    }
  ]);
  const [loading] = useState(false);

  // No fetch needed for frontend-only version

  return (
    <section id="medium" className="py-24 px-4 md:px-12 bg-[var(--bg-primary)]">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
        
        {/* Left Column: Bio & Resume */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold">About & Careers</h2>
            <p className="text-[var(--text-muted)] text-lg leading-relaxed max-w-md">
              With over 5 years of experience in the industry, I specialize in creating 
              fluid, high-performance web applications that blur the line between design and code.
            </p>
            <p className="text-[var(--text-muted)] leading-relaxed max-w-md">
              Currently looking for new opportunities as a <span className="text-orange font-semibold">Senior Design Engineer</span> or <span className="text-orange font-semibold">Lead Frontend Developer</span>.
            </p>
          </div>

          <motion.a
            href="/resume.pdf"
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-orange text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-orange/90 transition-colors shadow-lg shadow-orange/20"
          >
            Download Resume <Download size={16} />
          </motion.a>
        </div>

        {/* Right Column: Medium Articles */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <BookOpen size={20} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Latest Articles</span>
          </div>

          <div className="space-y-0">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="py-6 border-b border-[var(--border-color)] animate-pulse">
                  <div className="h-6 w-3/4 bg-[var(--border-color)]/20 rounded mb-4" />
                  <div className="h-4 w-1/4 bg-[var(--border-color)]/10 rounded" />
                </div>
              ))
            ) : (
              articles.map((article, idx) => (
                <motion.a
                  key={idx}
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group block py-8 border-b border-[var(--border-color)] last:border-0"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-xl md:text-2xl font-display font-medium group-hover:text-orange transition-colors group-hover:underline underline-offset-4 decoration-1">
                        {article.title}
                      </h3>
                      <ExternalLink size={18} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                    </div>
                    
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} /> {new Date(article.pubDate).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 rounded border border-[var(--border-color)]">
                        {article.categories?.[0] || 'Article'}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))
            )}
          </div>

          <a href="#" className="inline-block text-xs font-bold uppercase tracking-widest text-orange border-b border-orange pb-1 hover:text-orange/80 transition-colors">
            See all on Medium
          </a>
        </div>
      </div>
    </section>
  );
};
