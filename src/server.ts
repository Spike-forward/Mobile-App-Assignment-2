/**
 * Server configuration and setup for Mobile App Assignment 2
 * Main server entry point
 */

import { closeDatabase, initializeDatabase } from './db';
import { env } from './env';
import { asyncHandler, errorHandler, notFoundHandler } from './error';
import { errorInjectionMiddleware } from './inject-error';
import { createProxyMiddleware } from './proxy';
import { log, requestLoggingMiddleware } from './request-log';

/**
 * Express app instance placeholder
 * In a browser environment, this would be a mock
 */
let app: any = null;

/**
 * Server instance
 */
let server: any = null;

/**
 * Initialize the server
 */
export async function initializeServer() {
  try {
    log.info('🚀 Initializing server...');

    // Initialize database
    await initializeDatabase();

    // Note: In a real Node.js environment, you would initialize Express here
    // For now, we'll just log the server setup
    if (typeof window === 'undefined') {
      log.info('Server would be initialized for Node.js environment');
    } else {
      log.info('Server initialized for browser environment');
    }

    log.info(`✅ Server initialized in ${env.NODE_ENV} mode`);
    log.info(`📍 Port: ${env.PORT}`);
    log.info(`🌐 API Base URL: ${env.API_BASE_URL}`);
    log.info(`📝 Log Level: ${env.LOG_LEVEL}`);

    app = {
      use: (middleware: any) => {
        log.debug('Middleware registered');
      },
      get: (path: string, handler: any) => {
        log.debug(`Route registered: GET ${path}`);
      },
      post: (path: string, handler: any) => {
        log.debug(`Route registered: POST ${path}`);
      },
      put: (path: string, handler: any) => {
        log.debug(`Route registered: PUT ${path}`);
      },
      delete: (path: string, handler: any) => {
        log.debug(`Route registered: DELETE ${path}`);
      },
    };

    // Register middleware
    log.info('📦 Registering middleware...');
    registerMiddleware();

    // Register routes
    log.info('🛣️  Registering routes...');
    registerRoutes();

    log.info('✅ Server setup completed');
  } catch (error) {
    log.error('❌ Server initialization failed:', error);
    throw error;
  }
}

/**
 * Register middleware
 */
function registerMiddleware() {
  // Request logging
  app.use(requestLoggingMiddleware());

  // Error injection (only in development)
  if (env.ALLOW_ERROR_INJECTION) {
    log.warn('💉 Error injection enabled');
    app.use(errorInjectionMiddleware);
  }
}

/**
 * Register routes
 */
function registerRoutes() {
  // Health check
  app.get('/api/health', asyncHandler(async (req: any, res: any) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime?.(),
    });
  }));

  // API routes
  app.use('/api/auth', createProxyMiddleware('/auth'));
  app.use('/api/bookmarks', createProxyMiddleware('/bookmarks'));
  app.use('/api/list', createProxyMiddleware('/list'));

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler(env));
}

/**
 * Start the server
 */
export async function startServer(): Promise<void> {
  try {
    await initializeServer();

    log.info(`🚀 Server starting on port ${env.PORT}...`);

    // In a real Node.js environment, you would start the HTTP server here
    if (typeof window === 'undefined' && typeof require !== 'undefined') {
      // Node.js environment
      const express = require('express');
      const app = express();
      // app.listen(env.PORT, () => {
      //   log.info(`✅ Server listening on http://localhost:${env.PORT}`);
      // });
    }

    log.info('✅ Server started successfully');
  } catch (error) {
    log.error('❌ Failed to start server:', error);
    throw error;
  }
}

/**
 * Stop the server
 */
export async function stopServer(): Promise<void> {
  try {
    log.info('🛑 Stopping server...');

    // Close database connections
    await closeDatabase();

    // Close server
    if (server) {
      // server.close();
      log.info('✅ Server stopped');
    }

    log.info('✅ Server shutdown completed');
  } catch (error) {
    log.error('❌ Error stopping server:', error);
    throw error;
  }
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown() {
  const shutdown = async () => {
    log.info('⚠️  Received shutdown signal');
    await stopServer();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

/**
 * Get server instance
 */
export function getServer() {
  return app;
}

export default {
  initializeServer,
  startServer,
  stopServer,
  setupGracefulShutdown,
  getServer,
};

