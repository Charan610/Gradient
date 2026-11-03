'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  const manualTheme = useRef<Theme | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('foundation_theme');
      if (stored === 'dark' || stored === 'light') manualTheme.current = stored;
    } catch { /* Theme remains usable when storage is unavailable. */ }
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    const applyPreference = () => {
      const next = manualTheme.current ?? (preference.matches ? 'dark' : 'light');
      setThemeState(next);
      document.documentElement.setAttribute('data-theme', next);
    };
    applyPreference();
    preference.addEventListener('change', applyPreference);
    return () => preference.removeEventListener('change', applyPreference);
  }, []);

  const setTheme = (newTheme: Theme) => {
    manualTheme.current = newTheme;
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('foundation_theme', newTheme); }
    catch { /* Keep the manual choice for this session. */ }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
