import express from 'express';
import authController from '../controllers/auth.js';
import { validateBody } from "../validators/validateBody.js";
import { registerUserSchema, loginUserSchema } from '../schemas/authschemas.js';
const router = express.Router();
router.post('/register', validateBody(registerUserSchema), registerUser);
router.post('/login', validateBody(loginUserSchema), loginUser);
router.post('/refresh', refreshSession);
router.post('/logout', logoutUser);

export default router;
