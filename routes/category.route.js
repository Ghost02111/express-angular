import express from 'express';
import { createCategory, getCategory, changeCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
   .post(authenticateToken, authorizeRole(['ADMIN']), createCategory)
   .get(authenticateToken, getCategory);

router.route('/:id') 
   .patch(authenticateToken, authorizeRole(['ADMIN']), changeCategory)
   .delete(authenticateToken, authorizeRole(['ADMIN']), deleteCategory) ;

export default router ;


