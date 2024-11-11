const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { changeMyInfo } = require('../controllers/authController');


// public user sign up/in
router.post('/register', authController.register);
router.post('/login', authController.login);

// user functions
router.get('/myInfo', authenticateToken, authController.getMe );
router.patch('/changeMe', authenticateToken, changeMyInfo );


module.exports = router;  // Ensure you export the router instance
