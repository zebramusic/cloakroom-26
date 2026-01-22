import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Customer Authentication Utilities
 * Separate from admin auth for security isolation
 */

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateTokenWithExpiry(hoursValid: number = 24): { token: string; expires: Date } {
  const token = generateToken();
  const expires = new Date();
  expires.setHours(expires.getHours() + hoursValid);
  return { token, expires };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  return { valid: true };
}

export function sanitizeMessageBody(body: string): string {
  // Strip all HTML tags, prevent XSS
  return body
    .replace(/<[^>]*>/g, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
    .substring(0, 5000); // Max 5000 chars
}
