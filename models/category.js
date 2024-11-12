import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define( 'Category', {

    name: {
        type: DataTypes.STRING ,
        unique: true,
        allowNull: false,
    }
    
});

export default Category ;