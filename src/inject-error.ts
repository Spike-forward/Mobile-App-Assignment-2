/**
 * Error injection utilities for testing and development
 * Allows controlled error injection into the application
 */

import { env } from './env';
import { AppError } from './error';

export interface ErrorInjectionConfig {
  enabled: boolean;
  errorType?: 'app' | 'network' | 'timeout' | 'validation' | 'auth' | 'notFound';
  errorRate?: number; // 0-1, probability of error
  targetEndpoints?: string[]; // Specific endpoints to inject errors
}

/**
 * Default error injection configuration
 */
let errorInjectionConfig: ErrorInjectionConfig = {
  enabled: env.ALLOW_ERROR_INJECTION,
  errorRate: 0.1, // 10% chance
};

/**
 * Configure error injection
 */
export function configureErrorInjection(config: Partial<ErrorInjectionConfig>): void {
  if (!env.ALLOW_ERROR_INJECTION && config.enabled) {
    console.warn('⚠️  Error injection is disabled by environment configuration');
    return;
  }

  errorInjectionConfig = {
    ...errorInjectionConfig,
    ...config,
  };
}

/**
 * Check if error should be injected
 */
export function shouldInjectError(endpoint?: string): boolean {
  if (!errorInjectionConfig.enabled) {
    return false;
  }

  // Check if specific endpoints are targeted
  if (errorInjectionConfig.targetEndpoints && endpoint) {
    return errorInjectionConfig.targetEndpoints.includes(endpoint);
  }

  // Random chance based on error rate
  const random = Math.random();
  return random < (errorInjectionConfig.errorRate || 0);
}

/**
 * Inject an error based on configuration
 */
export function injectError(message?: string): AppError {
  if (!errorInjectionConfig.enabled) {
    return new AppError(message || 'Error injection disabled');
  }

  const errorType = errorInjectionConfig.errorType || 'app';
  const errorMessage = message || 'Injected test error';

  switch (errorType) {
    case 'auth':
      return new AppError(errorMessage, 401);
    case 'validation':
      return new AppError(errorMessage, 400);
    case 'notFound':
      return new AppError(errorMessage, 404);
    case 'network':
      return new AppError(errorMessage, 503);
    case 'timeout':
      return new AppError(errorMessage, 504);
    default:
      return new AppError(errorMessage, 500);
  }
}

/**
 * Middleware to inject errors in requests
 */
export function errorInjectionMiddleware(req: any, res: any, next: any) {
  if (!errorInjectionConfig.enabled) {
    return next();
  }

  const endpoint = req.path;
  
  if (shouldInjectError(endpoint)) {
    const error = injectError(`Injected error on ${endpoint}`);
    console.warn('💉 Injected error:', error.message);
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
        injected: true,
        timestamp: new Date().toISOString(),
      },
    });
  }

  next();
}

/**
 * Get current error injection configuration
 */
export function getErrorInjectionConfig(): ErrorInjectionConfig {
  return { ...errorInjectionConfig };
}

/**
 * Enable error injection
 */
export function enableErrorInjection() {
  if (env.ALLOW_ERROR_INJECTION) {
    errorInjectionConfig.enabled = true;
    console.log('✅ Error injection enabled');
  } else {
    console.warn('⚠️  Error injection is disabled by environment configuration');
  }
}

/**
 * Disable error injection
 */
export function disableErrorInjection() {
  errorInjectionConfig.enabled = false;
  console.log('✅ Error injection disabled');
}

export default {
  configureErrorInjection,
  shouldInjectError,
  injectError,
  errorInjectionMiddleware,
  getErrorInjectionConfig,
  enableErrorInjection,
  disableErrorInjection,
};

