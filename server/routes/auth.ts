import { Router, Request, Response } from 'express';
import { db } from '../db';
import {
  createSession,
  removeSession,
  checkLoginRateLimit,
  recordFailedLogin,
  clearFailedLogin,
  requireAdmin,
  AuthenticatedRequest,
} from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const rateLimit = checkLoginRateLimit(ip);

  if (!rateLimit.allowed) {
    res.status(429).json({
      error: 'TOO_MANY_REQUESTS',
      message: `Tài khoản tạm thời bị khóa do nhập sai mật khẩu quá 5 lần. Vui lòng thử lại sau ${rateLimit.waitSeconds} giây.`,
    });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' });
    return;
  }

  const admin = db.verifyAdminPassword(username, password);

  if (!admin) {
    recordFailedLogin(ip);
    db.logAudit('Khách', 'Đăng nhập thất bại', `Thử đăng nhập tài khoản "${username}" không thành công từ IP ${ip}`);
    res.status(401).json({
      error: 'INVALID_CREDENTIALS',
      message: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
    });
    return;
  }

  clearFailedLogin(ip);
  const token = createSession(admin.id, admin.username, admin.displayName);

  db.logAudit(admin.displayName, 'Đăng nhập thành công', `Cô An Na đăng nhập vào hệ thống`);

  res.json({
    token,
    user: {
      id: admin.id,
      username: admin.username,
      displayName: admin.displayName,
      role: admin.role,
    },
    welcomeMessage: '👋 XIN CHÀO, CÔ AN NA!\nChào mừng cô trở lại Hành trình Công dân nhí 🌷',
  });
});

// GET /api/auth/me
router.get('/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  if (!req.admin) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  const admin = db.getAdminById(req.admin.adminId);
  res.json({
    user: {
      id: req.admin.adminId,
      username: req.admin.username,
      displayName: admin?.displayName || req.admin.displayName,
      role: 'admin',
    },
  });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    removeSession(token);
  }
  res.json({ success: true, message: 'Đã đăng xuất an toàn.' });
});

// POST /api/auth/change-password
router.post('/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.' });
    return;
  }

  const result = db.changeAdminPassword(req.admin!.adminId, currentPassword, newPassword);
  if (!result.success) {
    res.status(400).json({ error: 'PASSWORD_CHANGE_FAILED', message: result.message });
    return;
  }

  res.json({ success: true, message: result.message });
});

export default router;
