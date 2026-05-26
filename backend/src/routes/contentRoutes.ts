import { Router } from 'express';
import { getAllContent, getContentById, createContent, updateContent, deleteContent } from '../controllers/contentController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { logAdminAction } from '../middleware/auditMiddleware';

const router = Router();

// Public / Member reads (logic inside controller handles auth checking for gates if we use a different middleware)
// We will use a soft auth middleware that doesn't block if token is missing but populates req.user if it exists.
import { verifyToken } from '../auth/auth';
const softAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) req.user = payload;
  }
  next();
};

router.get('/', softAuth, getAllContent);
router.get('/:id', softAuth, getContentById);

// Admin writes
router.post('/', requireAuth, requireRole(['admin']), logAdminAction, createContent);
router.put('/:id', requireAuth, requireRole(['admin']), logAdminAction, updateContent);
router.delete('/:id', requireAuth, requireRole(['admin']), logAdminAction, deleteContent);

export default router;
