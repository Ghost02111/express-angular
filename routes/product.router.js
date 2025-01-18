import express from 'express';
import { addProduct, getProducts, changeProduct, deleteProduct, getCurrentProduct } from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { upload } from '../config/upload.js';


const router = express.Router();

router.route('/')
  .post( authenticateToken, authorizeRole(['ADMIN']), upload.single('productImage'), addProduct)
  .get( getProducts);

  
router.route('/:id')  
  .patch( authenticateToken, authorizeRole(['ADMIN']),  upload.single('productImage'), changeProduct)
  .delete( authenticateToken, authorizeRole(['ADMIN']), deleteProduct)
  
  .get( authenticateToken , getCurrentProduct) ;

export default router ;