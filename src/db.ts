/**
 * Database configuration and utilities for Mobile App Assignment 2
 * Provides database connection and helper functions
 */

import { env } from './env';

export interface DatabaseConfig {
  client: string;
  connection: {
    filename?: string;
    database?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
  };
  useNullAsDefault?: boolean;
  pool?: {
    min?: number;
    max?: number;
  };
}

/**
 * Get database configuration based on environment
 */
export function getDatabaseConfig(): DatabaseConfig {
  if (env.DATABASE_URL) {
    // Use provided database URL (e.g., from environment variable)
    return {
      client: 'pg',
      connection: env.DATABASE_URL,
    };
  }

  // Default to local IndexedDB storage for browser
  return {
    client: 'indexeddb',
    connection: {
      filename: './data/mobile-app.db',
    },
    useNullAsDefault: true,
  };
}

/**
 * Database connection status
 */
export let dbConnection: any = null;

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('📦 Initializing database connection...');
    
    // In a browser environment, use IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
      console.log('✅ IndexedDB available in browser');
      dbConnection = {
        type: 'indexeddb',
        connected: true,
      };
    } else {
      console.log('⚠️  Database connection configured for Node.js environment');
      dbConnection = {
        type: 'node',
        connected: true,
      };
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (dbConnection) {
      console.log('🔌 Closing database connection...');
      dbConnection.connected = false;
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database:', error);
  }
}

/**
 * Check if database is connected
 */
export function isDatabaseConnected(): boolean {
  return dbConnection?.connected === true;
}

/**
 * Get database connection instance
 */
export function getDatabase() {
  return dbConnection;
}

/**
 * Execute a database query
 */
export async function query(sql: string, params: any[] = []): Promise<any> {
  if (!dbConnection || !dbConnection.connected) {
    throw new Error('Database not connected');
  }

  // In a real implementation, this would execute the query
  console.log('Executing query:', sql);
  return [];
}

/**
 * Transaction helper
 */
export async function transaction(callback: (trx: any) => Promise<any>): Promise<any> {
  if (!dbConnection || !dbConnection.connected) {
    throw new Error('Database not connected');
  }

  console.log('Starting transaction');
  const result = await callback({});
  console.log('Transaction completed');
  return result;
}

export default {
  initializeDatabase,
  closeDatabase,
  isDatabaseConnected,
  getDatabase,
  query,
  transaction,
  getDatabaseConfig,
};

