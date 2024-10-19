/**
 * Content script for Shadcn/UI Theme Customizer extension.
 * Checks for Shadcn/UI UI compatibility and manages theme changes.
 */

import { shadcnVariables } from '../consts/shadcn-variables';
import { logger } from '../utils/logger';

/**
 * Interface representing the storage structure for light and dark themes.
 */
export interface ThemeStorage {
  [domain: string]: {
    original: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
    userModified: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
    current: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
    version: number;
  };
}

/**
 * Interface representing site information
 */
export interface SiteInfo {
  name: string;
  favicon: string;
  domain: string;
  protocol: string;
  status: number;
  description: string;
  keywords: string[];
}

/**
 * Manages theme-related operations for the Shadcn/UI Theme Customizer.
 */
class ThemeManager {
  private static instance: ThemeManager;
  private themeStorage: ThemeStorage = {};
  private currentDomain: string = '';
  private currentMode: 'light' | 'dark' = 'light';
  private siteInfo: SiteInfo | null = null;

  private constructor() {}

  /**
   * Gets the singleton instance of ThemeManager.
   * @returns {ThemeManager} The ThemeManager instance.
   */
  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  /**
   * Initializes the ThemeManager by loading stored themes or capturing original themes.
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    this.currentDomain = window.location.hostname;
    await this.loadThemeStorage();
    if (!this.themeStorage[this.currentDomain]) {
      await this.captureOriginalThemes();
    }
    this.updateCurrentMode();
    this.observeThemeChanges();
    await this.applyCurrentTheme();
    await this.captureSiteInfo();
  }

  /**
   * Loads theme storage from chrome.storage.local.
   * @returns {Promise<void>}
   * @private
   */
  private async loadThemeStorage(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get('themeStorage', (result) => {
        if (result.themeStorage) {
          this.themeStorage = result.themeStorage;
        }
        resolve();
      });
    });
  }

  /**
   * Saves the current theme storage to chrome.storage.local.
   * @returns {Promise<void>}
   * @private
   */
  private async saveThemeStorage(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ themeStorage: this.themeStorage }, resolve);
    });
  }

  /**
   * Captures the original light and dark themes from the document.
   * @returns {Promise<void>}
   * @private
   */
  private async captureOriginalThemes(): Promise<void> {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    this.themeStorage[this.currentDomain] = {
      original: { light: {}, dark: {} },
      userModified: { light: {}, dark: {} },
      current: { light: {}, dark: {} },
      version: 1
    };

    // Capture light theme
    root.classList.remove('dark');
    this.themeStorage[this.currentDomain].original.light = this.captureTheme(computedStyle);

    // Capture dark theme
    root.classList.add('dark');
    this.themeStorage[this.currentDomain].original.dark = this.captureTheme(computedStyle);

    // Initialize current themes with original themes
    this.themeStorage[this.currentDomain].current.light = { ...this.themeStorage[this.currentDomain].original.light };
    this.themeStorage[this.currentDomain].current.dark = { ...this.themeStorage[this.currentDomain].original.dark };

    // Reset to original state
    root.classList.remove('dark');

    await this.saveThemeStorage();
    logger.info('Original themes captured and stored for domain', { domain: this.currentDomain });
  }

  /**
   * Captures theme variables from the computed style.
   * @param {CSSStyleDeclaration} computedStyle - The computed style of the root element.
   * @returns {Record<string, string>} The captured theme variables.
   * @private
   */
  private captureTheme(computedStyle: CSSStyleDeclaration): Record<string, string> {
    const theme: Record<string, string> = {};
    shadcnVariables.forEach(variable => {
      const value = computedStyle.getPropertyValue(`--${variable}`).trim();
      if (value) {
        theme[variable] = value;
      }
    });
    return theme;
  }

  /**
   * Updates the current theme mode based on the document's state.
   * @private
   */
  private updateCurrentMode(): void {
    const root = document.documentElement;
    const newMode = root.classList.contains('dark') ? 'dark' : 'light';
    if (this.currentMode !== newMode) {
      this.currentMode = newMode;
      this.captureCurrentTheme();
      logger.info('Current theme mode updated', { mode: this.currentMode });
    }
  }

  /**
   * Captures the current theme based on the current mode.
   * @private
   */
  private captureCurrentTheme(): void {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    const capturedTheme = this.captureTheme(computedStyle);
    
    if (this.currentMode === 'light' || this.currentMode === 'dark') {
      this.themeStorage[this.currentDomain].current[this.currentMode] = {
        ...this.themeStorage[this.currentDomain].current[this.currentMode],
        ...capturedTheme
      };
    }

    this.saveThemeStorage();
    logger.info('Current theme captured', { mode: this.currentMode, theme: capturedTheme });
  }

  /**
   * Observes theme changes in the document and updates the current mode.
   * @private
   */
  private observeThemeChanges(): void {
    const observer = new MutationObserver(() => {
      this.updateCurrentMode();
      chrome.runtime.sendMessage({ type: 'THEME_CHANGED', mode: this.currentMode });
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'],
      subtree: false,
      childList: false
    });
  }

  /**
   * Gets the current theme mode (light or dark).
   * @returns {'light' | 'dark'} The current theme mode.
   */
  getCurrentMode(): 'light' | 'dark' {
    return this.currentMode;
  }

  /**
   * Applies the given theme variables to the document.
   * @param {Record<string, string>} themeVariables - The theme variables to apply.
   * @param {'light' | 'dark'} mode - The theme mode to apply.
   * @returns {Promise<void>}
   */
  async applyTheme(themeVariables: Record<string, string>, mode: 'light' | 'dark'): Promise<void> {
    const root = document.documentElement;
  
    // Update user modifications
    this.themeStorage[this.currentDomain].userModified[mode] = {
      ...this.themeStorage[this.currentDomain].userModified[mode],
      ...themeVariables
    };

    // Apply theme by combining original and user modifications
    const combinedTheme = {
      ...this.themeStorage[this.currentDomain].original[mode],
      ...this.themeStorage[this.currentDomain].userModified[mode]
    };

    this.themeStorage[this.currentDomain].current[mode] = combinedTheme;

    Object.entries(combinedTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    this.currentMode = mode;

    this.themeStorage[this.currentDomain].version++;
    await this.saveThemeStorage();
    logger.info('Theme applied', { domain: this.currentDomain, mode, theme: combinedTheme });
  }

  /**
   * Resets the theme to its original state for the given mode.
   * @param {'light' | 'dark'} mode - The theme mode to reset.
   * @returns {Promise<void>}
   */
  async resetTheme(mode: 'light' | 'dark'): Promise<void> {
    this.themeStorage[this.currentDomain].userModified[mode] = {};
    await this.applyTheme({}, mode);
    logger.info('Theme reset to original', { domain: this.currentDomain, mode });
  }

  /**
   * Gets the current theme and mode.
   * @returns {Promise<{ mode: 'light' | 'dark', theme: Record<string, string> }>} The current theme and mode.
   */
  async getCurrentTheme(): Promise<{ mode: 'light' | 'dark', theme: Record<string, string> }> {
    await this.loadThemeStorage();
    return { 
      mode: this.currentMode, 
      theme: this.themeStorage[this.currentDomain].current[this.currentMode]
    };
  }

  /**
   * Gets both light and dark themes for the current domain.
   * @returns {Promise<{ 
   *   light: Record<string, string>, 
   *   dark: Record<string, string>,
   *   original: { light: Record<string, string>, dark: Record<string, string> },
   *   userModified: { light: Record<string, string>, dark: Record<string, string> }
   * }>}
   */
  async getBothThemes(): Promise<{ 
    light: Record<string, string>, 
    dark: Record<string, string>,
    original: { light: Record<string, string>, dark: Record<string, string> },
    userModified: { light: Record<string, string>, dark: Record<string, string> }
  }> {
    await this.loadThemeStorage();
    return {
      light: this.themeStorage[this.currentDomain].current.light,
      dark: this.themeStorage[this.currentDomain].current.dark,
      original: this.themeStorage[this.currentDomain].original,
      userModified: this.themeStorage[this.currentDomain].userModified
    };
  }

  /**
   * Updates a specific theme mode without applying it.
   * @param {Record<string, string>} themeVariables - The theme variables to update.
   * @param {'light' | 'dark'} mode - The theme mode to update.
   * @returns {Promise<void>}
   */
  async updateTheme(themeVariables: Record<string, string>, mode: 'light' | 'dark'): Promise<void> {
    this.themeStorage[this.currentDomain].userModified[mode] = {
      ...this.themeStorage[this.currentDomain].userModified[mode],
      ...themeVariables
    };
    this.themeStorage[this.currentDomain].version++;
    await this.saveThemeStorage();
    logger.info('Theme updated', { domain: this.currentDomain, mode, userModifications: this.themeStorage[this.currentDomain].userModified[mode] });
  }

  private async applyCurrentTheme(): Promise<void> {
    await this.applyTheme({}, this.currentMode);
  }

  /**
   * Captures relevant information about the current site.
   * @returns {Promise<void>}
   * @private
   */
  private async captureSiteInfo(): Promise<void> {
    const metaTags = document.getElementsByTagName('meta');
    const keywords = document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',').map(k => k.trim()) || [];
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

    this.siteInfo = {
      name: document.title,
      favicon: this.getFaviconUrl(),
      domain: window.location.hostname,
      protocol: window.location.protocol.slice(0, -1),
      status: document.readyState === 'complete' ? 200 : 0,
      description,
      keywords
    };

    logger.info('Site information captured', this.siteInfo);
  }

  /**
   * Gets the URL of the site's favicon.
   * @returns {string} The favicon URL.
   * @private
   */
  private getFaviconUrl(): string {
    const favicon = document.querySelector('link[rel*="icon"]') as HTMLLinkElement;
    return favicon ? favicon.href : '/favicon.ico';
  }

  /**
   * Gets the captured site information.
   * @returns {SiteInfo | null} The site information.
   */
  getSiteInfo(): SiteInfo | null {
    return this.siteInfo;
  }
}

const themeManager = ThemeManager.getInstance();

/**
 * Checks if the current document is compatible with Shadcn/UI UI.
 * @returns {boolean} True if compatible, false otherwise.
 */
export function checkShadcnCompatibility(): boolean {
  logger.debug('Checking Shadcn/UI compatibility');

  const root = document.documentElement;
  const computedStyle = getComputedStyle(root);

  const compatibleVariables = shadcnVariables.filter(variable => 
    computedStyle.getPropertyValue(`--${variable}`).trim() !== ''
  );

  const isCompatible = compatibleVariables.length >= shadcnVariables.length * 0.7;

  logger.info('Shadcn/UI compatibility check result', { isCompatible, compatibleVariables });

  return isCompatible;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_CURRENT_THEME':
      handleGetCurrentTheme(sendResponse);
      break;
    case 'APPLY_THEME':
      handleApplyTheme(message, sendResponse);
      break;
    case 'RESET_THEME':
      handleResetTheme(message, sendResponse);
      break;
    case 'GET_BOTH_THEMES':
      handleGetBothThemes(sendResponse);
      break;
    case 'UPDATE_THEME':
      handleUpdateTheme(message, sendResponse);
      break;
    case 'GET_SITE_INFO':
      handleGetSiteInfo(sendResponse);
      break;
  }
  return true;
});

/**
 * Handles the GET_CURRENT_THEME message.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 * @returns {Promise<void>}
 */
async function handleGetCurrentTheme(sendResponse: (response: any) => void): Promise<void> {
  logger.debug('Received GET_CURRENT_THEME message');
  try {
    const isCompatible = checkShadcnCompatibility();
    const { mode, theme } = await themeManager.getCurrentTheme();
    const siteInfo = themeManager.getSiteInfo();
    sendResponse({ isCompatible, currentTheme: theme, currentMode: mode, siteInfo });
    logger.debug('Sent current theme, mode, and site info', { isCompatible, currentTheme: theme, currentMode: mode, siteInfo });
  } catch (error) {
    logger.error('Error processing GET_CURRENT_THEME message', error);
    sendResponse({ error: 'Error fetching theme information' });
  }
}

/**
 * Handles the APPLY_THEME message.
 * @param {any} message - The message containing theme variables and mode.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 */
function handleApplyTheme(message: any, sendResponse: (response: any) => void): void {
  logger.debug('Received APPLY_THEME message', { themeVariables: message.themeVariables, mode: message.mode });
  themeManager.applyTheme(message.themeVariables, message.mode)
    .then(() => sendResponse({ success: true }))
    .catch((error) => {
      logger.error('Error applying theme', error);
      sendResponse({ success: false, error: 'Error applying theme' });
    });
}

/**
 * Handles the RESET_THEME message.
 * @param {any} message - The message containing the mode to reset.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 */
function handleResetTheme(message: any, sendResponse: (response: any) => void): void {
  logger.debug('Received RESET_THEME message', { mode: message.mode });
  themeManager.resetTheme(message.mode)
    .then(() => sendResponse({ success: true }))
    .catch((error) => {
      logger.error('Error resetting theme', error);
      sendResponse({ success: false, error: 'Error resetting theme' });
    });
}

/**
 * Handles the GET_BOTH_THEMES message.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 * @returns {Promise<void>}
 */
async function handleGetBothThemes(sendResponse: (response: any) => void): Promise<void> {
  logger.debug('Received GET_BOTH_THEMES message');
  try {
    const isCompatible = checkShadcnCompatibility();
    const themes = await themeManager.getBothThemes();
    const currentMode = themeManager.getCurrentMode();
    const siteInfo = themeManager.getSiteInfo();
    sendResponse({ isCompatible, themes, currentMode, siteInfo });
    logger.debug('Sent both themes, current mode, and site info', { isCompatible, themes, currentMode, siteInfo });
  } catch (error) {
    logger.error('Error processing GET_BOTH_THEMES message', error);
    sendResponse({ error: 'Error fetching theme information' });
  }
}

/**
 * Handles the UPDATE_THEME message.
 * @param {any} message - The message containing theme variables and mode.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 */
function handleUpdateTheme(message: any, sendResponse: (response: any) => void): void {
  logger.debug('Received UPDATE_THEME message', { themeVariables: message.themeVariables, mode: message.mode });
  themeManager.updateTheme(message.themeVariables, message.mode)
    .then(() => sendResponse({ success: true }))
    .catch((error) => {
      logger.error('Error updating theme', error);
      sendResponse({ success: false, error: 'Error updating theme' });
    });
}

/**
 * Handles the GET_SITE_INFO message.
 * @param {(response: any) => void} sendResponse - Function to send the response.
 */
function handleGetSiteInfo(sendResponse: (response: any) => void): void {
  logger.debug('Received GET_SITE_INFO message');
  const siteInfo = themeManager.getSiteInfo();
  sendResponse({ siteInfo });
  logger.debug('Sent site info', { siteInfo });
}

/**
 * Initializes the ThemeManager and captures site information.
 */
const initializeThemeManager = async () => {
  await themeManager.initialize();
  const isCompatible = checkShadcnCompatibility();
  logger.info('ThemeManager initialized', { isCompatible });
};

initializeThemeManager();
