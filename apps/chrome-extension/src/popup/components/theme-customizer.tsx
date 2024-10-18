import { AlertCircle, DownloadIcon, RefreshCw } from 'lucide-react';
import React from 'react';
import { shadcnVariables } from '../../consts/shadcn-variables';
import { useThemeCustomizer } from '../hooks/use-theme-costomizer';
import { ColorInput } from './color-input';
import { ModeToggle } from './mode-toogle';
import { RadiusInput } from './radius-input';

export const ThemeCustomizer: React.FC = () => {
  const { themes, updateTheme, isCompatible, resetTheme, currentMode, switchMode, exportTheme, hasChanges } = useThemeCustomizer();

  if (!isCompatible) {
    return (
      <div className='pb-6'>
        <div className="flex flex-col space-y-4 p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-gray-700 dark:text-zinc-300">This page is not compatible with ShadCN UI theme customization.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    exportTheme();
    alert("Your custom theme has been exported successfully.");
  };

  const handleReset = () => {
    resetTheme(currentMode);
    alert(`Your ${currentMode} theme has been reset to the original values.`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 dark:text-zinc-100">Theme Mode</h2>
          <ModeToggle currentMode={currentMode} onModeChange={switchMode} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 dark:text-zinc-100">Colors</h2>
          <div className="grid">
            {shadcnVariables.filter(key => !key.includes('radius')).map(key => (
              <ColorInput
                key={key}
                label={key}
                value={themes[currentMode][key] || ''}
                originalValue={themes.original[currentMode][key] || ''}
                onChange={(newValue) => updateTheme({ [key]: newValue }, currentMode)}
              />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 dark:text-zinc-100">Border Radius</h2>
          <div className="grid">
            <RadiusInput 
              label="radius"
              value={themes[currentMode].radius || ''}
              originalValue={themes.original[currentMode].radius || ''}
              onChange={(newValue) => updateTheme({ radius: newValue }, currentMode)}
            />
          </div>
        </div>
      </div>
      <footer className="sticky bottom-0 left-0 right-0 -mx-8 px-8 bg-gray-50 dark:bg-zinc-900 border-t border-[#d2d2d7] dark:border-zinc-700 py-4">
        <div className="flex space-x-4 items-center">
          <button
            onClick={handleExport}
            className="p-0 w-auto h-auto bg-transparent border-none text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
          >
            <DownloadIcon size={18} className="mr-2" />
            Export Theme
          </button>
          {hasChanges && (
            <button
              onClick={handleReset}
              className="p-0 w-auto h-auto bg-transparent border-none text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
              aria-label="Reset theme"
            >
              <RefreshCw size={18} className="mr-2" />
              Reset
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
