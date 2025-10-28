# Mobile App Assignment 2 - API Module

This directory contains TypeScript API modules for the Mobile App Assignment 2 project.

## 📁 File Structure

```
src/
├── types.ts        # Shared type definitions
├── auth.ts         # Authentication API
├── bookmark.ts     # Bookmark/bookmark API
├── list.ts         # List API
├── list-query.ts   # List Query API
├── index.ts        # Main export file
└── README.md       # This file
```

## 📦 Modules

### 1. Types (`types.ts`)

Contains all shared type definitions and interfaces used across the API modules.

**Key Types:**
- `User`, `UserData`, `LoginRequest`, `SignupRequest`
- `AuthResponse`, `CheckAuthResponse`
- `Bookmark`, `BookmarkRequest`, `BookmarkResponse`
- `ListItem`, `ListRequest`, `ListResponse`
- `ListQueryRequest`, `ListQueryResponse`
- `APIResponse`, `APIError`

### 2. Auth API (`auth.ts`)

Handles authentication functionality including signup, login, logout, and session management.

**Features:**
- User registration and authentication
- Token-based session management
- Integration with local database and remote API
- Session expiration and cleanup

**Usage:**
```typescript
import { authAPI } from './src/auth';

// Login
const result = await authAPI.login('username', 'password');

// Signup
const result = await authAPI.signup(userData);

// Check authentication
const authStatus = await authAPI.checkAuth(token);

// Logout
await authAPI.logout(token);
```

### 3. Bookmark API (`bookmark.ts`)

Manages user bookmarks with local storage and remote API synchronization.

**Features:**
- Add/remove bookmarks
- Bookmark status checking
- Toggle bookmark functionality
- Local storage persistence
- Multiple bookmark management

**Usage:**
```typescript
import { bookmarkAPI } from './src/bookmark';

// Add bookmark
await bookmarkAPI.addBookmark(userId, itemId);

// Remove bookmark
await bookmarkAPI.removeBookmark(userId, itemId);

// Check if bookmarked
const isBookmarked = bookmarkAPI.isBookmarked(userId, itemId);

// Toggle bookmark
await bookmarkAPI.toggleBookmark(userId, itemId);
```

### 4. List API (`list.ts`)

Provides list operations including CRUD functionality and search.

**Features:**
- Get paginated lists
- Create, read, update, delete items
- Search functionality
- Category-based filtering
- Custom sorting

**Usage:**
```typescript
import { listAPI } from './src/list';

// Get list with pagination
const list = await listAPI.getList({
  page: 1,
  limit: 10,
  search: 'query',
  sort: 'title',
  order: 'asc'
});

// Create item
const newItem = await listAPI.createItem(itemData);

// Search items
const results = await listAPI.searchItems('query', {}, 1, 10);
```

### 5. List Query API (`list-query.ts`)

Advanced query functionality with filters and aggregations.

**Features:**
- Advanced search queries
- Filter application
- Tag-based queries
- Date range queries
- Custom sorting
- Aggregations
- Autocomplete suggestions

**Usage:**
```typescript
import { listQueryAPI } from './src/list-query';

// Advanced query
const results = await listQueryAPI.query({
  query: 'search term',
  filters: { category: 'web' },
  page: 1,
  limit: 10,
  sort: 'relevance',
  order: 'desc'
});

// Query by tags
const taggedItems = await listQueryAPI.queryByTags(['react', 'typescript']);

// Get autocomplete
const suggestions = await listQueryAPI.getAutocompleteSuggestions('rea');
```

## 🔗 Integration

All APIs are designed to work together and integrate seamlessly with the existing application:

1. **Authentication is required** for bookmark and list operations
2. **Local storage fallback** when remote API is unavailable
3. **Type safety** throughout with TypeScript
4. **Browser compatibility** with proper window object handling

## 🚀 Building

The src folder is included in the build process. Compile with:

```bash
npm run build
```

Or watch for changes during development:

```bash
npm run watch
```

## 📝 Usage Example

```typescript
import { authAPI, bookmarkAPI, listAPI } from './src';

// 1. Authenticate user
const authResult = await authAPI.login('username', 'password');

// 2. Set token for other APIs
if (authResult.token) {
  bookmarkAPI.apiClient?.setToken(authResult.token);
  listAPI.setToken(authResult.token);
}

// 3. Get user's bookmarks
const bookmarks = await bookmarkAPI.getBookmarks(authResult.user_id);

// 4. Add a bookmark
await bookmarkAPI.addBookmark(authResult.user_id, 'item123');

// 5. Search and list items
const items = await listAPI.searchItems('react', { category: 'web' });
```

## 🔒 Security

- All password operations use secure hashing
- Token-based authentication
- Session expiration handling
- Secure local storage with encryption

## 🧪 Testing

```typescript
// Example test usage
import { authAPI } from './src/auth';

try {
  const result = await authAPI.login('test', 'password');
  console.log('Login successful:', result);
} catch (error) {
  console.error('Login failed:', error);
}
```

## 📚 API Classes

All APIs can be instantiated directly or used as singletons:

```typescript
// Using singleton (recommended)
import { authAPI } from './src';

// Or create new instances
import { AuthAPI } from './src';
const auth = new AuthAPI();
```

## 🌐 Browser Integration

All APIs are automatically attached to the window object when used in browser environments:

```typescript
// Access via window object
window.authAPI?.login('user', 'pass');
window.bookmarkAPI?.addBookmark(userId, itemId);
window.listAPI?.getList();
window.listQueryAPI?.query({ query: 'search' });
```

## 📖 Type Safety

All APIs are fully typed with TypeScript:

```typescript
import type { User, Bookmark, ListItem } from './src';

function processUser(user: User) {
  // Type-safe user operations
}

function processBookmark(bookmark: Bookmark) {
  // Type-safe bookmark operations
}
```

## 🤝 Contributing

When adding new API functionality:

1. Add types to `types.ts`
2. Create API class with proper error handling
3. Export from `index.ts`
4. Update this README
5. Test with both local and remote APIs

## 📄 License

Part of the Mobile App Assignment 2 project.
