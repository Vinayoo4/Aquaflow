import { Router } from 'express';
import { getPosts, getPostById, createPost, createReply } from '../controllers/communityController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', requireAuth, createPost);
router.post('/:id/reply', requireAuth, createReply);

export default router;
