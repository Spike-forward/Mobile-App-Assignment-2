/**
 * Request logging utilities for Mobile App Assignment 2
 * Provides structured logging for HTTP requests
 */

import { env } from './env';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  data?: any;
}

/**
 * Log entry storage
 */
const logs: LogEntry[] = [];
const MAX_LOGS = 1000;

/**
 * Create a log entry
 */
function createLogEntry(
  level: LogEntry['level'],
  message: string,
  data?: any
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };
}

/**
 * Add log entry
 */
function addLog(entry: LogEntry): void {
  logs.push(entry);

  // Keep only the last MAX_LOGS entries
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }

  // Output to console based on log level
  const shouldLog = env.LOG_LEVEL === 'debug' || 
    (env.LOG_LEVEL === 'info' && ['info', 'warn', 'error'].includes(entry.level)) ||
    (env.LOG_LEVEL === 'warn' && ['warn', 'error'].includes(entry.level)) ||
    (env.LOG_LEVEL === 'error' && entry.level === 'error');

  if (shouldLog) {
    const prefix = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[entry.level];

    console.log(`${prefix} [${entry.timestamp}] ${entry.message}`, data || '');
  }
}

/**
 * Log levels
 */
export const log = {
  debug: (message: string, data?: any) => {
    addLog(createLogEntry('debug', message, data));
  },

  info: (message: string, data?: any) => {
    addLog(createLogEntry('info', message, data));
  },

  warn: (message: string, data?: any) => {
    addLog(createLogEntry('warn', message, data));
  },

  error: (message: string, data?: any) => {
    addLog(createLogEntry('error', message, data));
  },

  /**
   * Log HTTP request
   */
  request: (req: any, res?: any, duration?: number) => {
    const entry = createLogEntry('info', 'HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res?.statusCode,
      duration,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers?.['user-agent'],
    });

    addLog(entry);
  },

  /**
   * Get all logs
   */
  getAll: (): LogEntry[] => {
    return [...logs];
  },

  /**
   * Get logs by level
   */
  getByLevel: (level: LogEntry['level']): LogEntry[] => {
    return logs.filter(log => log.level === level);
  },

  /**
   * Clear logs
   */
  clear: (): void => {
    logs.length = 0;
    console.log('🗑️  Logs cleared');
  },

  /**
   * Get recent logs (last N entries)
   */
  getRecent: (count: number = 100): LogEntry[] => {
    return logs.slice(-count);
  },
};

/**
 * Request logging middleware
 */
export function requestLoggingMiddleware() {
  return (req: any, res: any, next: any) => {
    const startTime = Date.now();

    // Log request
    log.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      log.info(`${req.method} ${req.path} ${res.statusCode}`, { duration });
    });

    next();
  };
}

export default log;

