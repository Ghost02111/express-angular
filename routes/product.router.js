import express from 'express';
import { addProduct, getProducts, changeProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
  .post( authenticateToken, authorizeRole(['ADMIN']), addProduct)
  .get( authenticateToken, authorizeRole(['ADMIN']), getProducts);

  
router.route('/:id')  
  .patch( authenticateToken, authorizeRole(['ADMIN']),  changeProduct)
  .delete( authenticateToken, authorizeRole(['ADMIN']), deleteProduct);

export default router;