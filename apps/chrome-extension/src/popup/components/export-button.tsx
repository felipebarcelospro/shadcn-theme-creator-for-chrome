import React from 'react';
import { ThemeVariables } from '../hooks/use-theme-costomizer';
import { exportTheme } from '../utils/export';

interface ExportButtonProps {
  themeVariables: ThemeVariables;
  originalTheme: ThemeVariables;
  currentMode: 'light' | 'dark';
}

/**
 * A button component for exporting the current theme.
 */
export const ExportButton: React.FC<ExportButtonProps> = ({ themeVariables, originalTheme, currentMode }) => {
  const handleExport = () => {
    exportTheme(themeVariables, originalTheme, currentMode);
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-zinc-700 rounded-md hover:bg-blue-700 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-zinc-400 transition-colors duration-200"
    >
      Export Theme
    </button>
  );
};
