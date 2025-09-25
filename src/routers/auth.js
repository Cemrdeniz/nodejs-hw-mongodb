import express from 'express';
import authController from '../controllers/auth.js';
import { validateBody } from "../validators/validateBody.js";
const router = express.Router();

router.post('/register', authController.validateBody(registerUser));
router.post('/login', authController.validateBody(loginUser));
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);

export default router;
