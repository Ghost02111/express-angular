import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { changeMyInfo, register, login, getMe } from '../controllers/authController.js';

const router = express.Router();

// public user sign up/in
router.post('/register', register);
router.post('/login', login);

// user functions
router.get('/myInfo', authenticateToken, getMe );
router.patch('/changeMe', authenticateToken, changeMyInfo );


export default router;  // Ensure you export the router instance
