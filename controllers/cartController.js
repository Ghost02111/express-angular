import { createConnection } from 'net';
import  Cart  from '../models/cart.js' ;
import  CartItem  from '../models/cartItem.js';
import { createBrotliDecompress } from 'zlib';
import Product from '../models/product.js';
import { measureMemory } from 'vm';
import User from '../models/user.js';

// Create or get the user's cart 

export const getOnlySelfCart = async (req, res) => {

    try {
        const userId = req.user.id; // Assume userId comes from JWT or session
        let cart = await Cart.findOne({ where: { userId }  });
        // let cart = await Cart.findOne({ where: { userId }, include: 'items' });
        const cartId = cart.id ;
        const cartItems = await CartItem.findAll({ where: { cartId }});
        res.status(200).json(
            {
                cart: cart ,
                cartItems: cartItems ,
            }
        );
    } catch (error) {
        res.status(500).json(
            {
                message: error.message
            }
        )
    }
}

export const addCart = async (req, res) => {
    try {
        const userId = req.user.id;
        let { productId, quantity } = req.body;
        quantity = Number(quantity);

        // Check if a cart exists for the user; if not, create one
        let cart = await Cart.findOne({ where: { userId } });
        if (!cart) {
            cart = await Cart.create({ userId, totalCost: 0 });
        }

        const cartId = cart.id;

        // Check if the item already exists in the cart
        let item = await CartItem.findOne({ where: { cartId, productId } });

        if (item) {
            // If item exists, update the quantity
            item.quantity += quantity;
            await item.save();
            
        } else {
            // If item does not exist, create it with the provided quantity
            const product = await Product.findOne({ where: { id: productId } });
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            item = await CartItem.create({
                cartId,
                productId,
                quantity,
                price: product.price ,
                name: product.name,
            });
        }


        // Update the total cost of the cart
        const productPrice = await Product.findOne({ where: { id: productId } });
        cart.totalCost += quantity * productPrice.price;
        await cart.save();

        // Retrieve all items in the cart to include in the response
        const items = await CartItem.findAll({ where: { cartId } });

        res.status(201).json({
            cart: cart,
            items: items,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

export const reduceCartItem = async (req, res) => {
    console.log('Here is the remove CartItem function')
    try {
        const { productId, quantity } = req.body ;
        console.log('response', req.body)
        const userId = req.user.id ;
        console.log('userId', userId)
        const cart = await Cart.findOne({ where: { userId } } );
        console.log('cartId', cart.id)
        const targetItem = await CartItem.findOne( { where: {
                productId , 
                cartId: cart.id ,
            }
        } );
        console.log('yayaya')

               
        if ( !productId || !quantity ) {
            return res.status(400).json(
                {
                    message: "You must enter the productId and quantity! "
                }
            );
        } 
        if ( !targetItem ) {
            return res.status(404).json( {
                message: "The Item is not found. check your item's id"
            });
        }

        const product = await Product.findByPk( productId ) ;

        if ( quantity >= targetItem.quantity ) {
            await CartItem.destroy({ where: { cartId: cart.id, productId } }) ;
        } 
        console.log('---------qqqqqq')
        targetItem.quantity -= quantity ;
        cart.totalCost -= product.price * quantity ;
        await cart.save();
        await targetItem.save();
        
        const cartState = await CartItem.findAll({ where: { cartId: cart.id }});
        res.status(200).json(
            {
                message: 'You removed the CartItem. Now your cart has following things',
                cartstate: cart,
                CartItemState: cartState ,
            }
        );
    } catch (error) {
        res.status(500).json( {
            error: error.message ,
        });
    }
}

export const refreshCart = async (req, res) => {
    try {
        const userId = req.user.id ;
        const cart = await Cart.findOne({ where: { userId } });
        cart.totalCost = 0;
        await cart.save();

        const amount = await CartItem.destroy({ where: { cartId: cart.id } });

        res.status(200).json(
            { 
                 message: 'Refresh completed successfully.' 
            }
    );
    } catch (error) {
        res.status(500).json( 
            {
                Error: error.message 
            }
        );
    }
}

export const getAllCart = async (req, res) => {
    try {
        const allCart = await Cart.findAll({ include: 'items' });
        if (!allCart ) {
            return res.status(404).json({ 
                message: 'There are any cart in this database! Create cart! '
             });
        }
        res.status(200).json(
            {
                message: ' Get all carts successfully ! ',
                result: allCart ,
            }
        );
    } catch (error) {
        res.status(500).json( 
            {
                error: error.message ,
            }
        );
    }
}

export const getAllProductByUser = async (req, res) => {
    try {
        const allProducts = await Product.findAll();
        if ( !allProducts ) {
            return res.status(404).json(
                {
                    message: 'There is no product here! '
                }
            );
        }
        res.status(200).json(
            {
                message: "You got all product successfully, Look at the result", 
                result: allProducts,
            }
        );

    } catch (error) {
        res.status(500).json(
            {
                error: error.message
            }
        );
    }
}

export const removeCartItem = async (req, res) => {
    console.log('Here is the remove CartItem function')
    try {
        const productId = req.params.id ;
        console.log('productId', productId)
        const userId = req.user.id ;
        console.log('userId1', userId)
        const cart = await Cart.findOne({ where: { userId } } );
        console.log('cartId1', cart.id)
        const deletedItem = await CartItem.findOne({ where:
            {
                productId , 
                cartId: cart.id ,
            }
         });

        await CartItem.destroy( { where: 
            {
                productId , 
                cartId: cart.id ,
            }
        } );
        cart.totalCost -= deletedItem.price * deletedItem.quantity ;
        await cart.save() ;
        console.log('deletedItem', deletedItem)
        res.status(200).json(
            {
                message: 'You removed the CartItem. Now your cart has following things',
                deletedItem: deletedItem ,
            }
        );
    } catch (error) {
        res.status(500).json( {
            error: error.message ,
        } );
    }
}