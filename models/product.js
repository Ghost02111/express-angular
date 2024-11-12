import { DataTypes, Sequelize } from 'sequelize' ;
import sequelize from '../config/db.js';
import Category from './category.js';

const Product = sequelize.define( 'Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    producer: {
        type: DataTypes.STRING,
        defaultValue: 'Unknown producer'
    },
    country: {
        type: DataTypes.STRING,
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // references: {
        //     model: Category,
        //     key: 'id',
        // }
    }
});

// Product.belongsTo(Category, {
//        foreignKey: 'categoryId',
// });

export default Product;