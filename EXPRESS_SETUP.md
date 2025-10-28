# Express Server Setup

This document describes the Express server setup for the Mobile App Assignment 2.

## Features

- ✅ Express.js server with middleware setup
- ✅ Security middleware (Helmet)
- ✅ CORS configuration
- ✅ Request logging (Morgan)
- ✅ Static file serving
- ✅ Error handling middleware
- ✅ Graceful shutdown
- ✅ Health check endpoint

## Installation

Install the required dependencies:

```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `helmet` - Security middleware
- `morgan` - HTTP request logger
- `dotenv` - Environment variable loader

## Environment Configuration

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Running the Server

### Development Mode

```bash
npm run dev:express
```

or

```bash
npm run server:express
```

### Production Mode

```bash
NODE_ENV=production npm run server:express
```

## Server Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 1234.567
}
```

## Middleware Stack

### 1. Helmet
Security middleware that sets various HTTP headers to help protect your app.

### 2. CORS
Enables Cross-Origin Resource Sharing. Configure allowed origins in `.env`.

### 3. Morgan
HTTP request logger middleware for node.js.

### 4. Body Parsers
- `express.json()` - Parse JSON bodies
- `express.urlencoded()` - Parse URL-encoded bodies

### 5. Static Files
Serves static files from the `dist` directory.

### 6. Error Handling
- 404 handler for not found routes
- Global error handler for server errors

## Project Structure

```
server/
├── server.js              # Express server entry point
├── .env                   # Environment variables (not in git)
├── package.json           # Dependencies and scripts
└── dist/                  # Static files to serve
```

## API Routes (To Be Implemented)

- `/api/auth/*` - Authentication routes
- `/api/bookmarks/*` - Bookmark management routes

## Scripts

- `npm run dev:express` - Start Express server in development
- `npm run server:express` - Start Express server
- `npm run build` - Build the frontend
- `npm run watch` - Watch mode for development

## Security Notes

1. **Helmet CSP**: Content Security Policy is disabled for development. Enable it in production.
2. **CORS**: Configure specific origins in production instead of using `*`.
3. **Environment Variables**: Never commit `.env` files to version control.

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found

```bash
npm install
```

### Environment Variables Not Loading

Make sure `.env` file exists in the server directory.

## Next Steps

1. Implement authentication routes in `/api/auth`
2. Implement bookmark routes in `/api/bookmarks`
3. Add database integration
4. Add request validation middleware
5. Add rate limiting middleware
6. Set up production deployment
