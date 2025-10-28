/**
 * Knex.js database client configuration for Mobile App Assignment 2
 * Provides database query builder interface
 */

import { getDatabaseConfig } from './db';

export interface KnexConfig {
  client: string;
  connection: any;
  pool: {
    min: number;
    max: number;
  };
  migrations?: {
    tableName: string;
    directory: string;
  };
  seeds?: {
    directory: string;
  };
}

/**
 * Knex query builder instance
 * In browser environment, this uses a compatible interface
 */
export class KnexQueryBuilder {
  private tableName: string;
  private selectColumns: string[] = [];
  private whereConditions: any[] = [];
  private orderByClause: any[] = [];
  private limitCount?: number;
  private offsetCount?: number;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Select columns
   */
  select(...columns: string[]) {
    this.selectColumns = columns.length > 0 ? columns : ['*'];
    return this;
  }

  /**
   * Where clause
   */
  where(column: string, operator: string, value: any) {
    this.whereConditions.push({ column, operator, value });
    return this;
  }

  /**
   * Order by
   */
  orderBy(column: string, direction: 'asc' | 'desc' = 'asc') {
    this.orderByClause.push({ column, direction });
    return this;
  }

  /**
   * Limit
   */
  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  /**
   * Offset
   */
  offset(count: number) {
    this.offsetCount = count;
    return this;
  }

  /**
   * Execute query
   */
  async resolve(): Promise<any[]> {
    console.log(`Query on table: ${this.tableName}`);
    return [];
  }

  /**
   * Insert data
   */
  async insert(data: any): Promise<any> {
    console.log(`Insert into ${this.tableName}:`, data);
    return { id: Date.now().toString() };
  }

  /**
   * Update data
   */
  async update(data: any): Promise<any> {
    console.log(`Update ${this.tableName}:`, data);
    return { affected: 0 };
  }

  /**
   * Delete
   */
  async delete(): Promise<any> {
    console.log(`Delete from ${this.tableName}`);
    return { affected: 0 };
  }
}

/**
 * Mock Knex instance for browser environment
 */
export function knex(configOrTableName?: any): KnexQueryBuilder | ((tableName: string) => KnexQueryBuilder) {
  if (typeof configOrTableName === 'string') {
    return new KnexQueryBuilder(configOrTableName);
  }

  return (tableName: string) => new KnexQueryBuilder(tableName);
}

/**
 * Get knex configuration
 */
export function getKnexConfig(): KnexConfig {
  const dbConfig = getDatabaseConfig();

  return {
    client: dbConfig.client,
    connection: dbConfig.connection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  };
}

/**
 * Initialize knex instance
 */
export function createKnex() {
  return knex;
}

export default knex;

