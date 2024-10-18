/**
 * Background script for ShadCN Theme Customizer extension.
 * Handles tab activation, checks for ShadCN UI compatibility, and manages theme changes.
 */

import { logger } from '../utils/logger';

/**
 * Interface for message handlers in the background script.
 */
interface MessageHandler {
  /**
   * Handles incoming messages.
   * @param message - The message received.
   * @param sender - Information about the sender of the message.
   * @param sendResponse - Function to send a response back to the sender.
   */
  handle(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): void;
}

/**
 * Handles compatibility result messages.
 */
class CompatibilityResultHandler implements MessageHandler {
  handle(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): void {
    if (message.type === 'COMPATIBILITY_RESULT' && sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'COMPATIBILITY_CHECK', isCompatible: message.isCompatible });
    }
  }
}

/**
 * Handles debug mode toggle messages.
 */
class DebugModeHandler implements MessageHandler {
  handle(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): void {
    if (message.type === 'TOGGLE_DEBUG_MODE') {
      logger.debug('Received debug mode toggle request', { enable: message.enable });
      if (message.enable) {
        logger.enableDebugMode();
      } else {
        logger.disableDebugMode();
      }
      sendResponse({ success: true });
      logger.debug('Debug mode toggled', { isDebugMode: message.enable });
    }
  }
}

/**
 * Handles theme change messages.
 */
class ThemeChangeHandler implements MessageHandler {
  handle(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): void {
    if (message.type === 'THEME_CHANGED') {
      logger.debug('Theme changed', { mode: message.mode });
      // You can add additional logic here if needed
    }
  }
}

/**
 * Factory class for creating message handlers.
 */
class BackgroundScriptFactory {
  static createMessageHandlers(): MessageHandler[] {
    return [
      new CompatibilityResultHandler(),
      new DebugModeHandler(),
      new ThemeChangeHandler()
    ];
  }
}

/**
 * Main class for the background script.
 */
class BackgroundScript {
  private messageHandlers: MessageHandler[];

  constructor() {
    this.messageHandlers = BackgroundScriptFactory.createMessageHandlers();
    this.init();
  }

  private init(): void {
    chrome.runtime.onInstalled.addListener(() => {
      logger.info('ShadCN Theme Customizer installed');
    });

    chrome.tabs.onActivated.addListener(this.handleTabActivated.bind(this));
    chrome.tabs.onUpdated.addListener(this.handleTabUpdated.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

    this.setupDebugMode();
  }

  private async handleTabActivated(activeInfo: chrome.tabs.TabActiveInfo): Promise<void> {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    logger.debug('Tab activated', { tabId: activeInfo.tabId });
    this.checkCompatibility(tab);
  }

  private handleTabUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
    if (changeInfo.status === 'complete') {
      logger.debug('Tab updated', { tabId, status: changeInfo.status });
      this.checkCompatibility(tab);
    }
  }

  /**
   * Checks if the current tab is compatible with ShadCN UI.
   * @param tab - The tab to check for compatibility.
   */
  private async checkCompatibility(tab: chrome.tabs.Tab): Promise<void> {
    if (tab.id && tab.url && !tab.url.startsWith('chrome://')) {
      logger.debug('Checking compatibility for tab', { tabId: tab.id, url: tab.url });
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            /**
             * @type {function(): boolean}
             */
            const checkShadcnCompatibility = (window as any).checkShadcnCompatibility;
            const isCompatible = checkShadcnCompatibility();
            chrome.runtime.sendMessage({ 
              type: 'COMPATIBILITY_RESULT', 
              isCompatible 
            });
          },
        });
      } catch (error) {
        logger.error('Error during compatibility check', { tabId: tab.id, error });
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'COMPATIBILITY_CHECK', isCompatible: false });
        }
      }
    } else {
      logger.info('Tab not eligible for compatibility check', { tabId: tab.id, url: tab.url });
    }
  }

  private handleMessage(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void): boolean {
    this.messageHandlers.forEach(handler => handler.handle(message, sender, sendResponse));
    return true;
  }

  private setupDebugMode(): void {
    (self as any).enableDebugMode = () => {
      logger.enableDebugMode();
      console.log('Debug mode enabled for ShadCN Theme Customizer');
    };

    (self as any).disableDebugMode = () => {
      logger.disableDebugMode();
      console.log('Debug mode disabled for ShadCN Theme Customizer');
    };
  }
}

new BackgroundScript();
export { };
