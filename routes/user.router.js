import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import {getUsers, addUser, changeRole, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.route("/")
  .get(authenticateToken, authorizeRole(['ADMIN']) , getUsers)
  .post(authenticateToken, authorizeRole(['ADMIN']) , addUser);

router.route('/:id')
  .patch(authenticateToken, authorizeRole(['ADMIN']) , changeRole)
  .delete(authenticateToken, authorizeRole(['ADMIN']), deleteUser);

  export default router ;
