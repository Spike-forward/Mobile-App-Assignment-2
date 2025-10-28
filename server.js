import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware - helps secure Express apps with HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development, enable in production
  crossOriginEmbedderPolicy: false
}));

// CORS middleware - enable cross-origin resource sharing
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configure specific origins in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware - HTTP request logger
app.use(morgan('dev')); // Use 'combined' for production

// Body parsing middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes placeholder
app.use('/api/auth', (req, res, next) => {
  // Authentication routes will be added here
  next();
});

app.use('/api/bookmarks', (req, res, next) => {
  // Bookmark routes will be added here
  next();
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// ============================================
// SERVER STARTUP
// ============================================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║   🚀 Express Server Running                          ║
╠══════════════════════════════════════════════════════╣
║   Port:        ${PORT.toString().padEnd(40)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(40)}║
║   URL:         http://localhost:${PORT.toString().padEnd(27)}║
╚══════════════════════════════════════════════════════╝
  `);
  
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
