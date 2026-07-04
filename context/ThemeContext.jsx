'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [accent, setAccent] = useState('sky');
  const [density, setDensity] = useState('comfortable');
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('hirrd-theme') || 'light';
    const savedAccent = localStorage.getItem('hirrd-accent') || 'sky';
    const savedDensity = localStorage.getItem('hirrd-density') || 'comfortable';
    
    setTheme(savedTheme);
    setAccent(savedAccent);
    setDensity(savedDensity);
    setMounted(true);
  }, []);

  // Apply Theme
  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hirrd-theme', theme);
  }, [theme, mounted]);

  // Apply Accent
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('hirrd-accent', accent);
    
    const root = document.documentElement;
    // Remap sky to the selected color
    const accents = {
      sky: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843',
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      }
    };
    
    const selected = accents[accent] || accents.sky;
    Object.keys(selected).forEach(weight => {
      // We override the sky color variables specifically since they are hardcoded as primary throughout the app
      root.style.setProperty(`--color-sky-${weight}`, selected[weight]);
    });

  }, [accent, mounted]);

  // Apply Density
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('hirrd-density', density);
    const root = document.documentElement;
    if (density === 'cozy') {
      root.style.fontSize = '14px';
    } else if (density === 'spacious') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px'; // default
    }
  }, [density, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent, density, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
