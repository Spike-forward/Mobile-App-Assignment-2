/**
 * List Query API for Mobile App Assignment 2
 * TypeScript implementation of advanced list query functionality
 */

import type {
    ListItem,
    ListQueryRequest,
    ListQueryResponse
} from './types';

/**
 * List Query API class
 */
export class ListQueryAPI {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = 'https://dae-mobile-assignment.hkit.cc/api';
    this.token = null;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get current authentication token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Generic request method
   */
  private async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('List Query API request failed:', error);
      throw error;
    }
  }

  /**
   * Query items with advanced options
   */
  async query<T = ListItem>(request: ListQueryRequest): Promise<ListQueryResponse<T>> {
    try {
      const {
        query,
        filters = {},
        page = 1,
        limit = 10,
        sort = 'relevance',
        order = 'desc',
      } = request;

      const body = {
        query,
        filters,
        page,
        limit,
        sort,
        order,
      };

      const data = await this.request<ListQueryResponse<T>>('/query', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      return data;
    } catch (error) {
      console.error('Failed to query items:', error);
      throw error;
    }
  }

  /**
   * Simple text search
   */
  async search<T = ListItem>(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ListQueryResponse<T>> {
    try {
      return await this.query<T>({
        query: searchTerm,
        page,
        limit,
      });
    } catch (error) {
      console.error('Failed to search items:', error);
      throw error;
    }
  }

  /**
   * Query with filters
   */
  async queryWithFilters<T = ListItem>(
    query: string,
    filters: Record<string, any>,
    page: number = 1,
    limit: number = 10
  ): Promise<ListQueryResponse<T>> {
    try {
      return await this.query<T>({
        query,
        filters,
        page,
        limit,
      });
    } catch (error) {
      console.error('Failed to query items with filters:', error);
      throw error;
    }
  }

  /**
   * Query by tags
   */
  async queryByTags<T = ListItem>(
    tags: string[],
    page: number = 1,
    limit: number = 10
  ): Promise<ListQueryResponse<T>> {
    try {
      return await this.query<T>({
        query: '',
        filters: {
          tags: {
            $in: tags,
          },
        },
        page,
        limit,
      });
    } catch (error) {
      console.error('Failed to query by tags:', error);
      throw error;
    }
  }

  /**
   * Query by date range
   */
  async queryByDateRange<T = ListItem>(
    startDate: string,
    endDate: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ListQueryResponse<T>> {
    try {
      return await this.query<T>({
        query: '',
        filters: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
        page,
        limit,
      });
    } catch (error) {
      console.error('Failed to query by date range:', error);
      throw error;
    }
  }

  /**
   * Query with custom sort
   */
  async querySorted<T = ListItem>(
    query: string,
    sortField: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    page: number = 1,
    limit: number = 10
  ): Promise<ListQueryResponse<T>> {
    try {
      return await this.query<T>({
        query,
        page,
        limit,
        sort: sortField,
        order: sortOrder,
      });
    } catch (error) {
      console.error('Failed to query with custom sort:', error);
      throw error;
    }
  }

  /**
   * Aggregate query - get counts by field
   */
  async aggregate(field: string, query: string = ''): Promise<Record<string, number>> {
    try {
      const params = new URLSearchParams({
        field,
        q: query,
      });

      const data = await this.request<Record<string, number>>(`/query/aggregate?${params.toString()}`);
      return data;
    } catch (error) {
      console.error(`Failed to aggregate by field ${field}:`, error);
      throw error;
    }
  }

  /**
   * Get autocomplete suggestions
   */
  async getAutocompleteSuggestions(
    partialQuery: string,
    limit: number = 5
  ): Promise<string[]> {
    try {
      const params = new URLSearchParams({
        q: partialQuery,
        limit: limit.toString(),
      });

      const data = await this.request<string[]>(`/query/autocomplete?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Failed to get autocomplete suggestions:', error);
      throw error;
    }
  }

  /**
   * Get recent searches
   */
  async getRecentSearches(limit: number = 10): Promise<string[]> {
    try {
      const data = await this.request<string[]>(`/query/recent?limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Failed to get recent searches:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const listQueryAPI = typeof window !== 'undefined' ? new ListQueryAPI() : null;

// For browser environment, attach to window
if (typeof window !== 'undefined') {
  window.listQueryAPI = listQueryAPI;
}

export default listQueryAPI;

