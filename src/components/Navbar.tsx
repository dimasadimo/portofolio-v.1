import React from 'react';
import { flushSync } from 'react-dom';
import { motion } from 'motion/react';
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from './Providers';

export const Navbar: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale } = useLanguage();

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (!(document as any).startViewTransition) {
      setTheme(nextTheme);
      return;
    }
    (document as any).startViewTransition(() => {
      flushSync(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });
    });
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 w-full z-[100] px-6 py-6 md:px-12 flex justify-between items-center"
    >
      {/* Blur Down Gradient Background */}
      <div 
        className="absolute inset-0 -z-10 h-48 w-full bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent backdrop-blur-2xl [mask-image:linear-gradient(to_bottom,black_20%,black_40%,transparent_90%)]" 
      />
      {/* Language Toggle */}
      <div className="flex-1 flex items-center">
        <button 
          onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
          className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-[var(--text-muted)] hover:text-orange transition-colors"
        >
          <Globe size={16} />
          <span>{locale.toUpperCase()}</span>
        </button>
      </div>

      
      <div className="w-12 h-12 rounded-full border-4 border-orange flex items-center justify-center font-black text-orange shrink-0">
        D
      </div>

      {/* Theme Toggle */}
      <div className="flex-1 flex justify-end">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-orange/10 text-[var(--text-muted)] hover:text-orange transition-all"
        >
          {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </motion.nav>
  )
};
