'use client';

import { useCallback, useEffect, useState } from 'react';

import { isTheme, type Theme, THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(attr) ? attr : 'dark';
}

/**
 * Reads the theme the init script already applied, so the first client render
 * matches the server HTML and hydration stays clean.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(readTheme());
  }, []);

  // Follow the OS only while the visitor has not made an explicit choice.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (isTheme(localStorage.getItem(THEME_STORAGE_KEY))) return;
      const next: Theme = media.matches ? 'dark' : 'light';
      document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
      setThemeState(next);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage: the attribute still applies for this visit.
    }
    setThemeState(next);
  }, []);

  return { theme, setTheme };
}
