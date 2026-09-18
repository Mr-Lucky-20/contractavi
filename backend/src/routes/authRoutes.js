import { Router } from 'express';
import { register, login, getMe, registerOwnerSchema, loginOwnerSchema } from '../controllers/authController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Rate limited auth endpoints with Zod payload validation
router.post('/register', authLimiter, validate(registerOwnerSchema), register);
router.post('/login', authLimiter, validate(loginOwnerSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
