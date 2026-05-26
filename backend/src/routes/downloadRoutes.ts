import { Router } from 'express';
import { getAllDownloads, createDownload } from '../controllers/downloadController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { logAdminAction } from '../middleware/auditMiddleware';
import { verifyToken } from '../auth/auth';

const router = Router();

const softAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
};

router.get('/', softAuth, getAllDownloads);
router.post('/', requireAuth, requireRole(['admin']), logAdminAction, createDownload);

export default router;
