import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface SessionData {
  adminId: string;
  username: string;
  displayName: string;
  createdAt: number;
}

// In-memory token session storage
const activeSessions = new Map<string, SessionData>();

// Rate-limiting map for brute-force protection
const loginAttempts = new Map<string, { count: number; blockedUntil: number }>();

export function createSession(adminId: string, username: string, displayName: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    adminId,
    username,
    displayName,
    createdAt: Date.now(),
  });
  return token;
}

export function removeSession(token: string): void {
  activeSessions.delete(token);
}

export function getSession(token: string): SessionData | undefined {
  const session = activeSessions.get(token);
  if (!session) return undefined;
  // Session timeout: 24 hours
  if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return undefined;
  }
  return session;
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return { allowed: true };

  if (entry.blockedUntil > now) {
    const waitSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  // Reset if block expired
  if (entry.blockedUntil > 0 && entry.blockedUntil <= now) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, blockedUntil: 0 };
  entry.count++;
  if (entry.count >= 5) {
    // Block for 5 minutes after 5 failed attempts
    entry.blockedUntil = now + 5 * 60 * 1000;
  }
  loginAttempts.set(ip, entry);
}

export function clearFailedLogin(ip: string): void {
  loginAttempts.delete(ip);
}

export interface AuthenticatedRequest extends Request {
  admin?: SessionData;
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: '🔐 BẠN KHÔNG CÓ QUYỀN TRUY CẬP. Vui lòng đăng nhập tài khoản Quản trị Cô An Na.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = getSession(token);

  if (!session) {
    res.status(401).json({
      error: 'SESSION_EXPIRED',
      message: '🔐 Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
    });
    return;
  }

  req.admin = session;
  next();
}
