import { Moon, Sun } from 'lucide-react';

export function ModeToggle({ currentMode, onModeChange }: { currentMode: string; onModeChange: (mode: 'light' | 'dark') => void }) {
  const handleToggle = (mode: 'light' | 'dark') => {
    onModeChange(mode);
  };

  return (
    <div className="flex items-center w-40 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md p-1 shadow-sm space-x-1">
      {['light', 'dark'].map((mode) => (
        <button
          key={mode}
          onClick={() => handleToggle(mode as 'light' | 'dark')}
          className={`h-8 px-3 w-1/2 text-sm rounded-md flex items-center justify-center transition-all duration-200 ${
            currentMode === mode
              ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
              : 'bg-gray-100 dark:bg-zinc-800 border-none text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-600'
          }`}
        >
          {mode === 'light' ? (
            <>
              <Sun size={14} className="mr-2" />
              Light
            </>
          ) : (
            <>
              <Moon size={14} className="mr-2" />
              Dark
            </>
          )}
        </button>
      ))}
    </div>
  );
}