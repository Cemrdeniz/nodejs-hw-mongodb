import express from 'express';
import authController from '../controllers/auth.js';
import { validateBody } from "../validators/validateBody.js";
import { registerUserSchema, loginUserSchema } from '../schemas/authschemas.js';

const router = express.Router();

router.post('/register', validateBody(registerUserSchema), authController.registerUser);
router.post('/login', validateBody(loginUserSchema), loginUser);
router.post('/refresh', authController.refreshSession);
router.post('/logout', authController.logoutUser);

export default router;
