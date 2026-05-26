import { Router } from 'express';
import { getMyPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);
router.get('/', getMyPlans);
router.post('/', createPlan);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
