import { Router } from 'express';
import { getStats, getAuditLogs } from '../controllers/adminController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth, requireRole(['admin']));
router.get('/stats', getStats);
router.get('/audit', getAuditLogs);

export default router;
