import express from 'express';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';
import { getOnlySelfCart , refreshCart , removeCartItem, addCart, getAllCart } from '../controllers/cartController.js';

const router = express.Router();
// For Everyone
router.route('/')
    .get( authenticateToken, getOnlySelfCart) 
    .post( authenticateToken, addCart)

// deleting current Item 
router.route('/:id')    
    .delete( authenticateToken, removeCartItem ) ;

// if user want to buy something later, we must the previous cart state
router.route('/cls')
    .post( authenticateToken, refreshCart) ;

//  For Administrators
router.route('/admin')
    .get( authenticateToken, authorizeRole(['ADMIN']), getAllCart )




export default router ;


