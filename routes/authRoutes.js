const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { adminRole , userRole, changePerson, changeSelf } = require('../controllers/authController');


// Define routes
router.get('/guest', authenticateToken, (req, res) => {
  res.send('Welcome Guest');
});

/// public user sign up/in
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
// user functions
router.get('/user', authenticateToken, authorizeRole(['ADMIN', 'USER']), userRole );
router.patch('/changeself',  authenticateToken, authorizeRole(['ADMIN', 'USER']), changeSelf );

// admin functions
router.get('/admin', authenticateToken, authorizeRole(['ADMIN']) , adminRole);
router.post('/admin/add', authenticateToken, authorizeRole(['ADMIN']) , authController.createAdmin );
router.patch('/admin/change', authenticateToken, authorizeRole(['ADMIN']) , changePerson );


module.exports = router;  // Ensure you export the router instance
