const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { adminRole , userRole, changePerson, changeSelf } = require('../controllers/authController');
// Define routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin/add', authenticateToken, authorizeRole(['ADMIN']) , authController.createAdmin );
router.patch('/admin/change', authenticateToken, authorizeRole(['ADMIN']) , changePerson );


// Protected routes
router.get('/admin', authenticateToken, authorizeRole(['ADMIN']) , adminRole);

router.get('/user', authenticateToken, authorizeRole(['ADMIN', 'USER']), userRole );
router.patch('/changeself',  authenticateToken, authorizeRole(['ADMIN', 'USER']), changeSelf );

router.get('/guest', authenticateToken, (req, res) => {
  res.send('Welcome Guest');
});

module.exports = router;  // Ensure you export the router instance
