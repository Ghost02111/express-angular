const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.route("/admin/users")
  .get(authenticateToken, authorizeRole(['ADMIN']) , userController.getUsers)
  .post(authenticateToken, authorizeRole(['ADMIN']) , userController.addUser)

router.route('/admin/users/:id')
  .patch(authenticateToken, authorizeRole(['ADMIN']) , userController.changeRole)
  .delete(authenticateToken, authorizeRole(['ADMIN']), userController.deleteUser)


module.exports = router ;