/**
 * Authentication API for Mobile App Assignment 2
 * TypeScript implementation of authentication functionality
 */

import type {
    APIError,
    APIResponse,
    AuthResponse,
    CheckAuthResponse,
    RequestOptions,
    User,
    UserData
} from './types';

/**
 * API Client class for handling authenticated requests
 */
export class APIClient {
  public baseUrl: string;
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
   * Generic API request method
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions: RequestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Add authorization header if token exists
    if (this.token) {
      if (!defaultOptions.headers) {
        defaultOptions.headers = {};
      }
      defaultOptions.headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Merge options
    const finalOptions: RequestInit = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    // Add body if it exists
    if (options.body !== undefined) {
      finalOptions.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, finalOptions);

      if (!response.ok) {
        throw new APIError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response.statusText
        );
      }

      const json = await response.json();
      return json;
    } catch (error) {
      console.error('API request failed:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('API request failed', 500);
    }
  }

  /**
   * Get bookmarks list
   */
  async getBookmarks(): Promise<any> {
    try {
      const json = await this.request('/bookmarks', {
        method: 'GET',
      });
      return json;
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      throw error;
    }
  }

  /**
   * Add bookmark
   */
  async addBookmark(itemId: string): Promise<any> {
    try {
      const json = await this.request(`/bookmarks/${itemId}`, {
        method: 'POST',
      });
      return json;
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(itemId: string): Promise<any> {
    try {
      const json = await this.request(`/bookmarks/${itemId}`, {
        method: 'DELETE',
      });
      return json;
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }
}

/**
 * Authentication API class
 */
export class AuthAPI {
  private baseURL: string;
  private userRepo: any;
  private sessionRepo: any;
  private apiClient: APIClient;

  constructor() {
    this.baseURL = '/api/auth';
    this.userRepo = typeof window !== 'undefined' ? window.userRepository : null;
    this.sessionRepo = typeof window !== 'undefined' ? window.sessionRepository : null;
    this.apiClient = new APIClient();
  }

  /**
   * Generate secure token
   */
  generateToken(): string {
    if (!this.sessionRepo) {
      throw new Error('Session repository not available');
    }
    return this.sessionRepo.generateSecureToken();
  }

  /**
   * Sign up user
   */
  async signup(userData: UserData): Promise<AuthResponse> {
    try {
      if (!this.userRepo || !this.sessionRepo) {
        throw new Error('Repositories not available');
      }

      // Try local storage first
      const localResult = await this.userRepo.createUser(userData);

      if (!localResult.success) {
        throw new Error(localResult.error || '註冊失敗');
      }

      // Generate token and session
      const token = this.generateToken();
      const expiresAt = this.sessionRepo.calculateExpirationTime(24 * 7); // 7 days

      const sessionResult = await this.sessionRepo.createSession(
        localResult.data.id,
        token,
        expiresAt
      );

      if (!sessionResult.success) {
        throw new Error('創建會話失敗');
      }

      // Set API client token
      this.setAPIToken(token);

      // Try to sync with remote API (optional)
      try {
        const response = await fetch(`${this.apiClient.baseUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userData.username,
            password: userData.password,
          }),
        });

        if (response.ok) {
          const apiResult = await response.json();
          if (apiResult.token) {
            this.setAPIToken(apiResult.token);
          }
        }
      } catch (apiError) {
        console.log('遠端 API 同步失敗，使用本地註冊');
      }

      return {
        user_id: localResult.data.id,
        token: token,
        user: localResult.data,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * User login
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      if (!this.userRepo || !this.sessionRepo) {
        throw new Error('Repositories not available');
      }

      // Try local authentication first
      const localResult = await this.userRepo.validateLogin(username, password);

      if (!localResult.success) {
        throw new Error(localResult.error || '登入失敗');
      }

      // Generate new token and session
      const token = this.generateToken();
      const expiresAt = this.sessionRepo.calculateExpirationTime(24 * 7); // 7 days

      const sessionResult = await this.sessionRepo.createSession(
        localResult.data.id,
        token,
        expiresAt
      );

      if (!sessionResult.success) {
        throw new Error('創建會話失敗');
      }

      // Set API client token
      this.setAPIToken(token);

      // Try to sync with remote API (optional)
      try {
        const response = await fetch(`${this.apiClient.baseUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });

        if (response.ok) {
          const apiResult = await response.json();
          if (apiResult.token) {
            this.setAPIToken(apiResult.token);
          }
        }
      } catch (apiError) {
        console.log('遠端 API 同步失敗，使用本地登入');
      }

      return {
        user_id: localResult.data.id,
        token: token,
        user: localResult.data,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Check authentication status
   */
  async checkAuth(token: string): Promise<CheckAuthResponse> {
    try {
      if (!token) {
        return { user_id: null };
      }

      if (!this.sessionRepo) {
        throw new Error('Session repository not available');
      }

      // Remove "Bearer " prefix if exists
      const cleanToken = token.replace('Bearer ', '');

      // Try local database session validation first
      const localResult = await this.sessionRepo.validateSessionAndGetUser(cleanToken);

      if (!localResult.success) {
        // Local validation failed, try API
        try {
          const response = await fetch(`${this.apiClient.baseUrl}/auth/check`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${cleanToken}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            return { user_id: result.user_id };
          }
        } catch (apiError) {
          console.log('遠端 API 驗證失敗，使用本地驗證');
        }
        return { user_id: null };
      }

      return { user_id: localResult.data.user.id };
    } catch (error) {
      console.error('檢查認證狀態錯誤:', error);
      return { user_id: null };
    }
  }

  /**
   * Logout
   */
  async logout(token: string): Promise<APIResponse> {
    try {
      if (!this.sessionRepo) {
        throw new Error('Session repository not available');
      }

      const cleanToken = token.replace('Bearer ', '');

      const result = await this.sessionRepo.deactivateByToken(cleanToken);

      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw new Error('登出失敗');
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      if (!this.userRepo) {
        throw new Error('User repository not available');
      }

      const result = await this.userRepo.findById(userId);
      return result.success ? result.data : null;
    } catch (error) {
      console.error('獲取使用者資料錯誤:', error);
      return null;
    }
  }

  /**
   * Save user with password
   */
  async saveUserWithPassword(userData: UserData): Promise<APIResponse> {
    try {
      if (!this.userRepo) {
        throw new Error('User repository not available');
      }

      const result = await this.userRepo.createUser(userData);

      if (!result.success) {
        throw new Error(result.error || '儲存使用者資料失敗');
      }

      return result;
    } catch (error) {
      console.error('儲存使用者資料錯誤:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to save user');
    }
  }

  /**
   * Clean expired sessions
   */
  async cleanExpiredSessions(): Promise<APIResponse> {
    try {
      if (!this.sessionRepo) {
        throw new Error('Session repository not available');
      }

      const result = await this.sessionRepo.cleanupExpiredSessions();
      return result;
    } catch (error) {
      console.error('清理過期會話錯誤:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Set API client token
   */
  setAPIToken(token: string): void {
    this.apiClient.setToken(token);
  }

  /**
   * Get bookmarks (requires authentication)
   */
  async getBookmarks(): Promise<any> {
    try {
      return await this.apiClient.getBookmarks();
    } catch (error) {
      console.error('獲取書籤失敗:', error);
      throw error;
    }
  }

  /**
   * Add bookmark (requires authentication)
   */
  async addBookmark(itemId: string): Promise<any> {
    try {
      return await this.apiClient.addBookmark(itemId);
    } catch (error) {
      console.error('添加書籤失敗:', error);
      throw error;
    }
  }

  /**
   * Remove bookmark (requires authentication)
   */
  async removeBookmark(itemId: string): Promise<any> {
    try {
      return await this.apiClient.removeBookmark(itemId);
    } catch (error) {
      console.error('刪除書籤失敗:', error);
      throw error;
    }
  }

  /**
   * Generic authenticated API request
   */
  async authenticatedRequest(endpoint: string, options: RequestOptions = {}): Promise<any> {
    try {
      return await this.apiClient.request(endpoint, options);
    } catch (error) {
      console.error('認證 API 請求失敗:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
export const authAPI = typeof window !== 'undefined' ? new AuthAPI() : null;

// For browser environment, attach to window
if (typeof window !== 'undefined') {
  window.authAPI = authAPI;
}

export default authAPI;

