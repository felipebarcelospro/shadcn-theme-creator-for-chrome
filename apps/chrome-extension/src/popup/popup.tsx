import React from 'react';
import { Header } from './components/header';
import { ThemeCustomizer } from './components/theme-customizer';
import { ThemeModeProvider } from './hooks/use-theme-mode';

/**
 * The main popup component for the extension.
 */
export const Popup: React.FC = () => {
  return (
    <ThemeModeProvider>
      <div className="p-4 pb-0 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
        <Header />
        <ThemeCustomizer />
      </div>
    </ThemeModeProvider>
  );
};