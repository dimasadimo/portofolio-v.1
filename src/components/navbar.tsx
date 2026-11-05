import { Globe, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import React from 'react';
import { flushSync } from 'react-dom';

import { useLanguage } from '@/hooks/use-language';

export const Navbar: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale } = useLanguage();

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    const startViewTransition = document.startViewTransition?.bind(document);

    if (!startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const transition = startViewTransition(() => {
      flushSync(() => {
        document.documentElement.setAttribute('data-theme', nextTheme);
        setTheme(nextTheme);
      });
    });

    // A transition aborted by a competing DOM update rejects `ready` (and `finished`).
    // The theme is already applied by then, so swallow that specific abort and let
    // anything else surface rather than becoming an unhandled rejection.
    const ignoreAbort = (cause: unknown) => {
      if (cause instanceof DOMException && cause.name === 'InvalidStateError') return;
      throw cause;
    };
    transition.ready.catch(ignoreAbort);
    transition.finished.catch(ignoreAbort);
  };

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 z-[100] flex w-full items-center justify-between px-4 py-4 md:px-10"
    >
      {/* Blur Down Gradient Background */}
      <div className="absolute inset-0 -z-10 h-36 w-full bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent [mask-image:linear-gradient(to_bottom,black_20%,black_40%,transparent_90%)] backdrop-blur-2xl" />
      {/* Language Toggle */}
      <div className="flex flex-1 items-center">
        <button
          onClick={() => setLocale(locale === 'en' ? 'id' : 'en')}
          className="hover:text-orange flex items-center gap-2 text-[12px] font-bold tracking-widest text-[var(--text-muted)] uppercase transition-colors"
        >
          <Globe size={12} />
          <span>{locale.toUpperCase()}</span>
        </button>
      </div>

      <div className="border-orange text-orange flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 font-black">
        D
      </div>

      {/* Theme Toggle */}
      <div className="flex flex-1 justify-end">
        <button
          onClick={toggleTheme}
          className="hover:bg-orange/10 hover:text-orange rounded-full p-2 text-[var(--text-muted)] transition-all"
        >
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </motion.nav>
  );
};
