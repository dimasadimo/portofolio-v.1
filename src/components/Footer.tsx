import React from 'react';
import { useIntl } from 'react-intl';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
    const intl = useIntl();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 border-t border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div className="container mx-auto px-6 text-center space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-[0.3em]">
                        © {currentYear} Dimas Adimo — Built with passion
                    </p>

                    <div className="flex gap-8">
                        {[
                            { label: 'LinkedIn', url: 'https://id.linkedin.com/in/dimasadihartomo' },
                            { label: 'Instagram', url: 'https://www.instagram.com/dimsaadimo/' },
                            { label: 'Github', url: 'https://github.com/dimasadimo/' },
                            { label: 'Behance', url: '#' }
                        ].map(s => (
                            <a key={s.label} href={s.url} target={s.url !== '#' ? "_blank" : undefined} rel={s.url !== '#' ? "noopener noreferrer" : undefined} className="text-[var(--text-muted)] hover:text-orange text-[10px] font-bold uppercase tracking-widest transition-colors">
                                {s.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="pt-6 flex justify-center items-center gap-2 text-[10px] text-[var(--text-muted)] font-light uppercase tracking-widest">
                    <span>Designed & Developed in Jakarta</span>
                    <Heart size={10} className="text-orange animate-pulse" />
                </div>
            </div>
        </footer>
    );
};
