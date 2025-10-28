/**
 * Bookmark API for Mobile App Assignment 2
 * TypeScript implementation of bookmark functionality
 */

import type { APIClient } from './auth';
import type {
    APIResponse,
    BookmarkList,
    BookmarkResponse
} from './types';

/**
 * Bookmark API class
 */
export class BookmarkAPI {
  private apiClient: APIClient | null;
  private localBookmarks: Map<string, string[]>;

  constructor(apiClient?: APIClient | null) {
    this.apiClient = apiClient || null;
    this.localBookmarks = new Map();
    this.loadFromLocalStorage();
  }

  /**
   * Load bookmarks from local storage
   */
  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('user_bookmarks');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([userId, itemIds]) => {
          this.localBookmarks.set(userId, itemIds as string[]);
        });
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage:', error);
    }
  }

  /**
   * Save bookmarks to local storage
   */
  private saveToLocalStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const obj: Record<string, string[]> = {};
      this.localBookmarks.forEach((itemIds, userId) => {
        obj[userId] = itemIds;
      });
      localStorage.setItem('user_bookmarks', JSON.stringify(obj));
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage:', error);
    }
  }

  /**
   * Get bookmarks for a user
   */
  async getBookmarks(userId: string): Promise<BookmarkList> {
    try {
      // Try to get from API first if available
      if (this.apiClient) {
        try {
          const apiResult = await this.apiClient.getBookmarks();
          if (apiResult?.item_ids) {
            return apiResult;
          }
        } catch (apiError) {
          console.log('API bookmarks fetch failed, using local storage');
        }
      }

      // Fallback to local storage
      const itemIds = this.localBookmarks.get(userId) || [];
      return { item_ids: itemIds };
    } catch (error) {
      console.error('Failed to get bookmarks:', error);
      const itemIds = this.localBookmarks.get(userId) || [];
      return { item_ids: itemIds };
    }
  }

  /**
   * Add a bookmark
   */
  async addBookmark(userId: string, itemId: string): Promise<BookmarkResponse> {
    try {
      // Try to add via API first if available
      if (this.apiClient) {
        try {
          const apiResult = await this.apiClient.addBookmark(itemId);
          if (apiResult?.item_id || apiResult?.success) {
            // Also add to local storage
            const itemIds = this.localBookmarks.get(userId) || [];
            if (!itemIds.includes(itemId)) {
              itemIds.push(itemId);
              this.localBookmarks.set(userId, itemIds);
              this.saveToLocalStorage();
            }
            return {
              success: true,
              message: '已添加書籤',
              item_id: itemId,
            };
          }
        } catch (apiError) {
          console.log('API bookmark add failed, using local storage');
        }
      }

      // Fallback to local storage
      const itemIds = this.localBookmarks.get(userId) || [];

      if (itemIds.includes(itemId)) {
        return {
          success: false,
          message: '書籤已存在',
        };
      }

      itemIds.push(itemId);
      this.localBookmarks.set(userId, itemIds);
      this.saveToLocalStorage();

      return {
        success: true,
        message: '已添加書籤',
        item_id: itemId,
      };
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add bookmark',
      };
    }
  }

  /**
   * Remove a bookmark
   */
  async removeBookmark(userId: string, itemId: string): Promise<BookmarkResponse> {
    try {
      // Try to remove via API first if available
      if (this.apiClient) {
        try {
          const apiResult = await this.apiClient.removeBookmark(itemId);
          if (apiResult?.success !== false) {
            // Also remove from local storage
            const itemIds = this.localBookmarks.get(userId) || [];
            const index = itemIds.indexOf(itemId);
            if (index > -1) {
              itemIds.splice(index, 1);
              this.localBookmarks.set(userId, itemIds);
              this.saveToLocalStorage();
            }
            return {
              success: true,
              message: '已移除書籤',
              item_id: itemId,
            };
          }
        } catch (apiError) {
          console.log('API bookmark remove failed, using local storage');
        }
      }

      // Fallback to local storage
      const itemIds = this.localBookmarks.get(userId) || [];
      const index = itemIds.indexOf(itemId);

      if (index === -1) {
        return {
          success: false,
          message: '書籤不存在',
        };
      }

      itemIds.splice(index, 1);
      this.localBookmarks.set(userId, itemIds);
      this.saveToLocalStorage();

      return {
        success: true,
        message: '已移除書籤',
        item_id: itemId,
      };
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to remove bookmark',
      };
    }
  }

  /**
   * Check if item is bookmarked
   */
  isBookmarked(userId: string, itemId: string): boolean {
    const itemIds = this.localBookmarks.get(userId) || [];
    return itemIds.includes(itemId);
  }

  /**
   * Toggle bookmark status
   */
  async toggleBookmark(userId: string, itemId: string): Promise<BookmarkResponse> {
    if (this.isBookmarked(userId, itemId)) {
      return await this.removeBookmark(userId, itemId);
    } else {
      return await this.addBookmark(userId, itemId);
    }
  }

  /**
   * Clear all bookmarks for a user
   */
  clearBookmarks(userId: string): Promise<APIResponse> {
    try {
      this.localBookmarks.set(userId, []);
      this.saveToLocalStorage();
      return Promise.resolve({
        success: true,
        message: '已清空所有書籤',
      });
    } catch (error) {
      console.error('Failed to clear bookmarks:', error);
      return Promise.resolve({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to clear bookmarks',
      });
    }
  }

  /**
   * Get bookmark statistics
   */
  getBookmarkStats(userId: string): { total: number; itemIds: string[] } {
    const itemIds = this.localBookmarks.get(userId) || [];
    return {
      total: itemIds.length,
      itemIds: [...itemIds],
    };
  }

  /**
   * Add multiple bookmarks at once
   */
  async addMultipleBookmarks(userId: string, itemIds: string[]): Promise<APIResponse> {
    try {
      const existingIds = this.localBookmarks.get(userId) || [];
      const newIds = itemIds.filter((id) => !existingIds.includes(id));

      if (newIds.length === 0) {
        return {
          success: true,
          message: '所有書籤已存在',
        };
      }

      this.localBookmarks.set(userId, [...existingIds, ...newIds]);
      this.saveToLocalStorage();

      return {
        success: true,
        message: `已添加 ${newIds.length} 個書籤`,
      };
    } catch (error) {
      console.error('Failed to add multiple bookmarks:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add bookmarks',
      };
    }
  }
}

// Create and export singleton instance
export const bookmarkAPI = typeof window !== 'undefined' ? new BookmarkAPI() : null;

// For browser environment, attach to window
if (typeof window !== 'undefined') {
  window.bookmarkAPI = bookmarkAPI;
}

export default bookmarkAPI;

