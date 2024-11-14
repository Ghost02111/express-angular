import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import CartItem from '../models/cartItem.js';

const Cart = sequelize.define('Cart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalCost: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  });

  
  Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });
  CartItem.belongsTo(Cart, { foreignKey: 'cartId' });

export default Cart ;