import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Cart from '../models/cart.js';

const CartItem = sequelize.define('CartItem', {
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

  });

  

export default CartItem ;