import express from 'express';
import authController from '../controllers/auth.js';
import  sendResetEmail  from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema } from '../schemas/auth.js';
import  resetPassword  from '../controllers/auth.js';
import { resetPasswordSchema } from '../schemas/auth.js';

const router = express.Router();

router.post('/send-reset-email', authController.sendResetEmail);
router.post('/reset-password', authController.validateBody(resetPassword));
router.post('/register', authController.validateBody(registerUser));
router.post('/login', authController.validateBody(loginUser));
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);

export default router;
