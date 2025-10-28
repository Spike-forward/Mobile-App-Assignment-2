/**
 * List API for Mobile App Assignment 2
 * TypeScript implementation of list functionality
 */

import type {
    APIResponse,
    ListItem,
    ListRequest,
    ListResponse,
} from './types';

/**
 * List API class
 */
export class ListAPI {
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
      console.error('List API request failed:', error);
      throw error;
    }
  }

  /**
   * Get list of items
   */
  async getList<T = ListItem>(request: ListRequest = {}): Promise<ListResponse<T>> {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        filter = {},
        sort = 'id',
        order = 'asc',
      } = request;

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search,
        sort: sort,
        order: order,
        ...(Object.keys(filter).length > 0 ? { filter: JSON.stringify(filter) } : {}),
      });

      const data = await this.request<ListResponse<T>>(`/list?${params.toString()}`);

      return data;
    } catch (error) {
      console.error('Failed to get list:', error);
      throw error;
    }
  }

  /**
   * Get a single item by ID
   */
  async getItem<T = ListItem>(id: string): Promise<T> {
    try {
      const data = await this.request<T>(`/list/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to get item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new item
   */
  async createItem<T = ListItem>(item: Omit<T, 'id'>): Promise<T> {
    try {
      const data = await this.request<T>('/list', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      return data;
    } catch (error) {
      console.error('Failed to create item:', error);
      throw error;
    }
  }

  /**
   * Update an existing item
   */
  async updateItem<T = ListItem>(id: string, item: Partial<T>): Promise<T> {
    try {
      const data = await this.request<T>(`/list/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
      });
      return data;
    } catch (error) {
      console.error(`Failed to update item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an item
   */
  async deleteItem(id: string): Promise<APIResponse> {
    try {
      const data = await this.request<APIResponse>(`/list/${id}`, {
        method: 'DELETE',
      });
      return data;
    } catch (error) {
      console.error(`Failed to delete item ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search items
   */
  async searchItems<T = ListItem>(
    query: string,
    filters: Record<string, any> = {},
    page: number = 1,
    limit: number = 10
  ): Promise<ListResponse<T>> {
    try {
      const params = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        ...(Object.keys(filters).length > 0 ? { filters: JSON.stringify(filters) } : {}),
      });

      const data = await this.request<ListResponse<T>>(`/list/search?${params.toString()}`);
      return data;
    } catch (error) {
      console.error('Failed to search items:', error);
      throw error;
    }
  }

  /**
   * Get items by category
   */
  async getItemsByCategory<T = ListItem>(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ListResponse<T>> {
    try {
      const params = new URLSearchParams({
        category: category,
        page: page.toString(),
        limit: limit.toString(),
      });

      const data = await this.request<ListResponse<T>>(`/list/category/${category}?${params.toString()}`);
      return data;
    } catch (error) {
      console.error(`Failed to get items by category ${category}:`, error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const listAPI = typeof window !== 'undefined' ? new ListAPI() : null;

// For browser environment, attach to window
if (typeof window !== 'undefined') {
  window.listAPI = listAPI;
}

export default listAPI;

