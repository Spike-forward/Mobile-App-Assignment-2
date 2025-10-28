/**
 * Environment configuration for Mobile App Assignment 2
 * Loads and validates environment variables
 */

export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL?: string;
  API_BASE_URL: string;
  SESSION_SECRET: string;
  SESSION_EXPIRY_HOURS: number;
  CORS_ORIGIN: string;
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  ALLOW_ERROR_INJECTION: boolean;
}

/**
 * Default environment values
 */
const defaults: Environment = {
  NODE_ENV: 'development',
  PORT: 3000,
  DATABASE_URL: '',
  API_BASE_URL: 'https://dae-mobile-assignment.hkit.cc/api',
  SESSION_SECRET: 'dev-secret-change-in-production',
  SESSION_EXPIRY_HOURS: 24 * 7, // 7 days
  CORS_ORIGIN: '*',
  LOG_LEVEL: 'info',
  ALLOW_ERROR_INJECTION: false,
};

/**
 * Load environment variables with defaults and validation
 */
export function loadEnvironment(): Environment {
  const env: Environment = {
    NODE_ENV: (process.env.NODE_ENV as Environment['NODE_ENV']) || defaults.NODE_ENV,
    PORT: parseInt(process.env.PORT || String(defaults.PORT), 10),
    DATABASE_URL: process.env.DATABASE_URL || defaults.DATABASE_URL,
    API_BASE_URL: process.env.API_BASE_URL || defaults.API_BASE_URL,
    SESSION_SECRET: process.env.SESSION_SECRET || defaults.SESSION_SECRET,
    SESSION_EXPIRY_HOURS: parseInt(process.env.SESSION_EXPIRY_HOURS || String(defaults.SESSION_EXPIRY_HOURS), 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || defaults.CORS_ORIGIN,
    LOG_LEVEL: (process.env.LOG_LEVEL as Environment['LOG_LEVEL']) || defaults.LOG_LEVEL,
    ALLOW_ERROR_INJECTION: process.env.ALLOW_ERROR_INJECTION === 'true' || defaults.ALLOW_ERROR_INJECTION,
  };

  // Validate required fields
  if (!env.SESSION_SECRET || env.SESSION_SECRET === 'dev-secret-change-in-production') {
    if (env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: Using default SESSION_SECRET in production is insecure!');
    }
  }

  return env;
}

/**
 * Get current environment configuration
 */
export const env = loadEnvironment();

/**
 * Check if running in development mode
 */
export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

/**
 * Check if running in production mode
 */
export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

/**
 * Check if running in test mode
 */
export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}

export default env;

