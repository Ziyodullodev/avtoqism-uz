import crypto from 'crypto';
import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'avtoqism_super_secret_session_key_2026';

export const COOKIE_NAME = 'avtoqism_admin_token';

// Generate a tamper-proof session token based on HMAC
export function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET_KEY)
    .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${timestamp}`)
    .digest('hex');

  // Format: timestamp.signature
  return `${timestamp}.${signature}`;
}

// Verify if the token is valid and not expired (valid for 7 days)
export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestamp, signature] = parts;
  const tokenTime = parseInt(timestamp, 10);

  if (isNaN(tokenTime)) return false;

  // Max age: 7 days
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - tokenTime > sevenDaysMs) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET_KEY)
    .update(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${timestamp}`)
    .digest('hex');

  return signature === expectedSignature;
}

export function checkCredentials(user: string, pass: string): boolean {
  return user === ADMIN_USERNAME && pass === ADMIN_PASSWORD;
}

export function isAdminAuthenticated(): boolean {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
