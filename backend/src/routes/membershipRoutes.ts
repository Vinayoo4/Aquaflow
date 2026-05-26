import { Router } from 'express';
import { getAllTiers, createTier, updateTier } from '../controllers/membershipController';
import { requireAuth, requireRole } from '../middleware/authMiddleware';
import { logAdminAction } from '../middleware/auditMiddleware';

const router = Router();

router.get('/', getAllTiers);
router.post('/', requireAuth, requireRole(['admin']), logAdminAction, createTier);
router.put('/:id', requireAuth, requireRole(['admin']), logAdminAction, updateTier);

export default router;
