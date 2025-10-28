/**
 * Error handling utilities for Mobile App Assignment 2
 * Provides custom error classes and error handling middleware
 */

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error - 400 Bad Request
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Authentication Error - 401 Unauthorized
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

/**
 * Authorization Error - 403 Forbidden
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

/**
 * Not Found Error - 404 Not Found
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

/**
 * Conflict Error - 409 Conflict
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409);
  }
}

/**
 * Internal Server Error - 500 Internal Server Error
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, false);
  }
}

/**
 * Error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    statusCode: number;
    details?: any;
    timestamp: string;
  };
}

/**
 * Create error response
 */
export function createErrorResponse(error: Error | AppError): ErrorResponse {
  const appError = error instanceof AppError ? error : new InternalServerError(error.message);

  return {
    success: false,
    error: {
      message: appError.message,
      statusCode: appError.statusCode,
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Error handler middleware factory
 */
export function errorHandler(env: { NODE_ENV: string }) {
  return (error: Error, req: any, res: any, next: any) => {
    const appError = error instanceof AppError ? error : new InternalServerError(error.message);

    // Log error
    console.error('Error:', {
      message: appError.message,
      statusCode: appError.statusCode,
      stack: env.NODE_ENV === 'development' ? appError.stack : undefined,
    });

    const errorResponse = createErrorResponse(appError);

    // Add stack trace in development
    if (env.NODE_ENV === 'development') {
      errorResponse.error.details = { stack: appError.stack };
    }

    res.status(appError.statusCode).json(errorResponse);
  };
}

/**
 * Async error wrapper - catches async errors in route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler
 */
export function notFoundHandler(req: any, res: any) {
  const error = new NotFoundError(`Route ${req.path} not found`);
  const errorResponse = createErrorResponse(error);
  res.status(404).json(errorResponse);
}

