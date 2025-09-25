import express from 'express';
import authController from '../controllers/auth.js';
import  sendResetEmail  from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema,loginUserSchema,registerUserSchema} from '../schemas/auth.js';
import  resetPassword  from '../controllers/auth.js';
import { resetPasswordSchema } from '../schemas/auth.js';

const router = express.Router();

router.post('/send-reset-email', authController.sendResetEmail);
router.post('/reset-password', validateBody(resetPasswordSchema), authController.resetPassword);
router.post('/register', validateBody(registerUserSchema), authController.registerUser);
router.post('/login', validateBody(loginUserSchema), authController.loginUser);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);

export default router;
