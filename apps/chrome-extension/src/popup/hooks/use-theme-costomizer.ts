import { useCallback, useEffect, useState } from 'react';
import { shadcnVariables } from '../../consts/shadcn-variables';
import { SiteInfo } from '../../content/content';
import { logger } from '../../utils/logger';
import { exportTheme } from '../utils/export';

export interface ThemeVariables {
  [key: typeof shadcnVariables[number]]: string;
}

interface Themes {
  light: ThemeVariables;
  dark: ThemeVariables;
  original: {
    light: ThemeVariables;
    dark: ThemeVariables;
  };
  userModified: {
    light: ThemeVariables;
    dark: ThemeVariables;
  };
}

export interface ThemeCustomizerHook {
  isCompatible: boolean;
  currentMode: 'light' | 'dark';
  themes: Themes;
  updateTheme: (newVariables: Partial<ThemeVariables>, mode: 'light' | 'dark') => void;
  switchMode: (newMode: 'light' | 'dark') => void;
  resetTheme: (mode: 'light' | 'dark') => void;
  exportTheme: () => void;
  hasChanges: boolean;
  siteInfo: SiteInfo | null;
}

export function useThemeCustomizer(): ThemeCustomizerHook {
  const [isCompatible, setIsCompatible] = useState(false);
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  const [themes, setThemes] = useState<Themes>({ light: {}, dark: {}, original: { light: {}, dark: {} }, userModified: { light: {}, dark: {} } });
  const [hasChanges, setHasChanges] = useState(false);
  const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);

  const fetchThemes = useCallback(async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) {
        logger.warn('No active tab found');
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_BOTH_THEMES' });
      
      if (response.error) {
        logger.error('Error fetching themes', response.error);
        return;
      }

      setIsCompatible(response.isCompatible);
      setThemes(response.themes);
      setCurrentMode(response.currentMode);
      setSiteInfo(response.siteInfo);
      setHasChanges(Object.keys(response.themes.userModified.light).length > 0 || Object.keys(response.themes.userModified.dark).length > 0);
      logger.info('Fetched themes and site info', { isCompatible: response.isCompatible, themes: response.themes, mode: response.currentMode, siteInfo: response.siteInfo });
    } catch (error) {
      logger.error('Error fetching themes and site info', error);
    }
  }, []);

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  const updateTheme = useCallback((newVariables: Partial<ThemeVariables>, mode: 'light' | 'dark') => {
    setThemes(prevThemes => ({
      ...prevThemes,
      userModified: {
        ...prevThemes.userModified,
        [mode]: {
          ...prevThemes.userModified[mode],
          ...newVariables
        }
      },
      [mode]: {
        ...prevThemes[mode],
        ...newVariables
      }
    }));

    setHasChanges(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { 
        type: 'UPDATE_THEME',
        themeVariables: newVariables,
        mode
      }, (response) => {
        if (response.error) {
          logger.error('Error updating theme', response.error);
        } else {
          // After successful update, fetch the updated themes
          fetchThemes();
        }
      });
    });

    if (mode === currentMode) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { 
          type: 'APPLY_THEME',
          themeVariables: newVariables,
          mode
        }, (response) => {
          if (response.error) {
            logger.error('Error applying theme', response.error);
          }
        });
      });
    }
  }, [currentMode, fetchThemes]);

  const switchMode = useCallback((newMode: 'light' | 'dark') => {
    setCurrentMode(newMode);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { 
        type: 'APPLY_THEME',
        themeVariables: themes[newMode],
        mode: newMode
      }, (response) => {
        if (response.error) {
          logger.error('Error switching mode', response.error);
        } else {
          // After successful mode switch, fetch the updated themes
          fetchThemes();
        }
      });
    });
  }, [themes, fetchThemes]);

  const resetTheme = useCallback((mode: 'light' | 'dark') => {
    setThemes(prevThemes => ({
      ...prevThemes,
      userModified: {
        ...prevThemes.userModified,
        [mode]: {}
      },
      [mode]: { ...prevThemes.original[mode] }
    }));
    setHasChanges(false);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { 
        type: 'RESET_THEME',
        mode
      }, (response) => {
        if (response.error) {
          logger.error('Error resetting theme', response.error);
        }
      });
    });
  }, []);

  const exportThemeFile = useCallback(() => {
    if (isCompatible) {
      exportTheme(themes[currentMode], themes.original[currentMode], currentMode);
    } else {
      logger.warn('Theme export failed: Not compatible with ShadCN UI');
    }
  }, [isCompatible, themes, currentMode]);

  return {
    isCompatible,
    currentMode,
    themes,
    updateTheme,
    switchMode,
    resetTheme,
    exportTheme: exportThemeFile,
    hasChanges,
    siteInfo
  };
}
