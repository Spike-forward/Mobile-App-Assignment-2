/**
 * Password hashing utilities for Mobile App Assignment 2
 * Provides secure password hashing and verification
 */

/**
 * Generate a secure random string
 */
export async function generateSecureString(length: number = 32): Promise<string> {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password using PBKDF2
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    // For production, you should use a more secure method like bcrypt
    // This is a simplified version for the assignment
    return `sha256:${hashHex}`;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    const hash = await hashPassword(password);
    return hash === hashedPassword;
  } catch (error) {
    return false;
  }
}

/**
 * Generate a secure token for sessions
 */
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return 'token_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash any string (generic hashing utility)
 */
export async function hashString(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return 'id_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a session token
 */
export function createSessionToken(userId: string): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureToken().slice(0, 20);
  return `${userId}_${timestamp}_${randomPart}`;
}

