/**
 * Type definitions for the Mobile App Assignment 2 API
 */

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  studentId: string;
  phone?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  department?: string | null;
  grade?: string | null;
  programmingLevel?: string | null;
  learningGoals?: string | null;
  interestedCourses?: string[] | null;
  newsletter?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface UserData {
  username: string;
  password: string;
  studentId: string;
  email: string;
  fullName: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  department?: string;
  grade?: string;
  programmingLevel?: string;
  learningGoals?: string;
  interestedCourses?: string[];
  newsletter?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest extends UserData {}

export interface AuthResponse {
  user_id: string;
  token: string;
  user: User;
}

export interface CheckAuthResponse {
  user_id: string | null;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Bookmark Types
export interface Bookmark {
  item_id: string;
  user_id?: string;
  created_at?: string;
}

export interface BookmarkList {
  item_ids: string[];
}

export interface BookmarkRequest {
  itemId: string;
}

export interface BookmarkResponse {
  success: boolean;
  message?: string;
  item_id?: string;
}

// List Types
export interface ListItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface ListRequest {
  page?: number;
  limit?: number;
  search?: string;
  filter?: Record<string, any>;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ListResponse<T = any> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListQueryRequest {
  query: string;
  filters?: Record<string, any>;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ListQueryResponse<T = any> {
  results: T[];
  query: string;
  count: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Request Options
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
}

// HTTP Error Types
export class APIError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number = 500, statusText: string = 'Internal Server Error') {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
  }
}

// Repository Types
export interface DatabaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Course Types (referencing the existing Course interface)
export interface Course {
  id?: string;
  title: string;
  language: string;
  level: string;
  details: string;
  category: string;
  tags: string[];
  imageUrl: string;
  videoUrl: string;
}

export type CourseLevel = '入門' | '中級' | '進階';
export type CourseCategory = '程式入門' | '網頁開發' | '資料科學' | '行動開發' | '系統設計' | '演算法';

export interface SearchFilters {
  searchTerm: string;
  category: string;
}

// Global Window Extensions
declare global {
  interface Window {
    secureDB?: any;
    userRepository?: any;
    sessionRepository?: any;
    authAPI?: any;
    favoritesAPI?: any;
    bookmarkAPI?: any;
    listAPI?: any;
    listQueryAPI?: any;
  }
}

export { };

