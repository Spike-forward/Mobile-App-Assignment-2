/**
 * Main export file for Mobile App Assignment 2 API
 * Consolidates all API modules
 */

// Export types
export * from './types';

// Export API classes and instances
export { APIClient, AuthAPI, authAPI } from './auth';
export type { Bookmark, BookmarkRequest, BookmarkResponse } from './types';

export { BookmarkAPI, bookmarkAPI } from './bookmark';
export { ListAPI, listAPI } from './list';
export { ListQueryAPI, listQueryAPI } from './list-query';

// Re-export types from individual modules
export type {
    APIResponse, AuthResponse,
    CheckAuthResponse, ListItem, ListQueryRequest,
    ListQueryResponse, ListRequest,
    ListResponse, LoginRequest, RequestOptions, SignupRequest, User,
    UserData
} from './types';

