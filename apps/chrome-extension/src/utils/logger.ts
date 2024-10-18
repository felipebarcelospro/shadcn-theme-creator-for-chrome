type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isDebugMode: boolean = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  enableDebugMode() {
    this.isDebugMode = true;
    this.debug('Debug mode enabled');
  }

  disableDebugMode() {
    this.debug('Debug mode disabled');
    this.isDebugMode = false;
  }

  private log(level: LogLevel, message: string, payload?: any) {
    if (level === 'debug' && !this.isDebugMode) return;

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'info':
        console.log('%c' + formattedMessage, 'color: #0066cc', payload || '');
        break;
      case 'warn':
        console.warn('%c' + formattedMessage, 'color: #ff9900', payload || '');
        break;
      case 'error':
        console.error('%c' + formattedMessage, 'color: #cc0000', payload || '');
        break;
      case 'debug':
        console.debug('%c' + formattedMessage, 'color: #6600cc', payload || '');
        break;
    }
  }

  info(message: string, payload?: any) {
    this.log('info', message, payload);
  }

  warn(message: string, payload?: any) {
    this.log('warn', message, payload);
  }

  error(message: string, payload?: any) {
    this.log('error', message, payload);
  }

  debug(message: string, payload?: any) {
    this.log('debug', message, payload);
  }
}

export const logger = Logger.getInstance();
