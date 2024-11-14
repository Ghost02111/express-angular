import { createConnection } from 'net';
import  Cart  from '../models/cart.js' ;
import  CartItem  from '../models/cartItem.js';
import { createBrotliDecompress } from 'zlib';
import Product from '../models/product.js';
import { measureMemory } from 'vm';

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

export const removeCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body ;
        const id = req.params.id ;
        const targetItem = await CartItem.findByPk( id );
        console.log(targetItem)
        const cart = await Cart.findByPk( targetItem.cartId );

               
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

        if ( quantity > targetItem.quantity ) {
            return res.status(400).json(
                {
                    message: 'The quantity that you want to remove is too much',
                }
            );
        } 
        targetItem.quantity -= quantity ;
        cart.totalCost -= product.price * quantity ;
        await cart.save();
        console.log(cart.totalCost)
        await targetItem.save();
        
        const cartState = await CartItem.findAll({ where: { cartId: cart.id }});
        console.log('here')
        res.status(200).json(
            {
                message: 'You removed the CartItem. Now your cart has following things',
                cart_state: cart,
                Cart_Item_State: cartState ,
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

        res.status(200).json({ message: 'Refresh completed successfully.' });
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
                message: 'There are any carts in this database! Add cart! '
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
                error: error.message 
            }
        );
    }
}