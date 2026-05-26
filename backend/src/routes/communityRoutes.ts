import { Router } from 'express';
import { getPosts, createPost } from '../controllers/communityController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, getPosts);
router.post('/', requireAuth, createPost);

export default router;
