import { Copy, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useThemeCustomizer } from '../hooks/use-theme-costomizer';
import { hexToHsl, hslToHex } from '../utils/color-conversions';

interface ColorInputProps {
  label: string;
  value: string;
  originalValue: string;
  onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({ label, value, originalValue, onChange }) => {
  const { currentMode } = useThemeCustomizer();
  const [hslValue, setHslValue] = useState(value);
  const [hexValue, setHexValue] = useState(() => hslToHex(`hsl(${value})`));

  useEffect(() => {
    setHslValue(value);
    setHexValue(hslToHex(`hsl(${value})`));
  }, [value, currentMode]);

  const handleChange = (newValue: string) => {
    if (newValue.startsWith('#')) {
      // If hex value is provided
      const newHsl = hexToHsl(newValue);
      setHslValue(newHsl.replace('hsl(', '').replace(')', ''));
      setHexValue(newValue);
      onChange(newHsl.replace('hsl(', '').replace(')', ''));
    } else {
      // If HSL value is provided
      setHslValue(newValue);
      setHexValue(hslToHex(`hsl(${newValue})`));
      onChange(newValue);
    }
  };

  const handleReset = () => {
    setHslValue(originalValue);
    setHexValue(hslToHex(`hsl(${originalValue})`));
    onChange(originalValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`hsl(${hslValue})`).then(() => {
      console.log('Color copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy color: ', err);
    });
  };

  return (
    <div className="flex items-center space-x-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-4 first:rounded-t-lg last:rounded-b-lg border-t-0 first:border-t">
      <label className="text-sm font-medium text-gray-700 dark:text-zinc-300 w-44 line-clamp-1">{label}</label>
      <div className="flex items-center flex-grow">
        <div className="relative flex items-center flex-grow">
          <input
            type="text"
            value={hslValue}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full pl-12 pr-3 h-10 text-sm bg-gray-100 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <label htmlFor={`color-picker-${label}`} className="block w-6 h-6 rounded-full cursor-pointer overflow-hidden border-2 border-gray-300 dark:border-zinc-600">
              <input
                id={`color-picker-${label}`}
                type="color"
                value={hexValue}
                onChange={(e) => handleChange(e.target.value)}
                className="opacity-0 w-6 h-6 cursor-pointer"
              />
              <div 
                className="absolute inset-0 rounded-full border p-0.5 border-gray-300 dark:border-zinc-600 overflow-hidden"
              >
                <div 
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: `hsl(${hslValue})` }}
                />
              </div>
            </label>
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleReset}
          className="h-9 w-9"
          aria-label="Reset color"
          disabled={hslValue === originalValue}
        >
          <RefreshCw size={16} />
        </button>
        <button
          onClick={handleCopy}
          className="h-9 w-9"
          aria-label="Copy color"
        >
          <Copy size={16} />
        </button>
      </div>
    </div>
  );
};
