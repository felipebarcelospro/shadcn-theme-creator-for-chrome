import { Copy, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface RadiusInputProps {
  label: string;
  value: string;
  originalValue: string;
  onChange: (value: string) => void;
}

export const RadiusInput: React.FC<RadiusInputProps> = ({ label, value, originalValue, onChange }) => {
  const [radiusValue, setRadiusValue] = useState(() => parseFloat(value) || 0);

  useEffect(() => {
    setRadiusValue(parseFloat(value) || 0);
  }, [value]);

  const radiusOptions = [0, 0.5, 1.0];

  const handleChange = (newValue: number) => {
    setRadiusValue(newValue);
    onChange(`${newValue}rem`);
  };

  const handleReset = () => {
    const resetValue = parseFloat(originalValue) || 0;
    setRadiusValue(resetValue);
    onChange(resetValue.toString());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(radiusValue.toString());
  };

  return (
    <div className="flex items-center space-x-4 py-3 bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700 px-4 first:rounded-t-lg last:rounded-b-lg">
      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 w-36 line-clamp-1">{label}</label>
      <div className="flex items-center w-44 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md p-1 shadow-sm space-x-1">
        {radiusOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleChange(option)}
            className={`h-8 px-3 w-1/3 text-sm rounded-md flex items-center justify-center transition-all duration-200 ${
              radiusValue === option
                ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-zinc-100 shadow-sm'
                : 'bg-gray-100 dark:bg-zinc-800 border-none text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-600'
            }`}
          >
            {option.toFixed(1)}
          </button>
        ))}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleReset}
          className="h-9 w-9 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200"
          aria-label="Reset radius"
          disabled={radiusValue === parseFloat(originalValue)}
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={handleCopy}
          className="h-9 w-9 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200"
          aria-label="Copy color"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};
