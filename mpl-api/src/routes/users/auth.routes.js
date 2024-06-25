import { Router } from 'express';
import { createUser, verifyEmail, login, me } from '../../controllers/users/auth.controller.js';
import { authRequired } from '../../configs/middleware.js';

const router = Router();

router.post('/register', createUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.get('/me', authRequired, me)

export default router;