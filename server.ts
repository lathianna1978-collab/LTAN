import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import authRouter from './server/routes/auth';
import adminRouter from './server/routes/admin';
import studentRouter from './server/routes/student';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON & URL-encoded bodies for bulk imports
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/student', studentRouter);

  // Security guard for direct /admin route or unauthorized API endpoints:
  // If someone directly calls unauthorized /api/delete or similar endpoints
  app.all('/api/delete*', (req, res) => {
    res.status(401).json({
      error: 'UNAUTHORIZED',
      message: '🔐 BẠN KHÔNG CÓ QUYỀN TRUY CẬP',
    });
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌟 Server Hành trình Công dân nhí running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
