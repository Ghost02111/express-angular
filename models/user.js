import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';



const User =  sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
        allowNull: false,
        unique: true,
    }, 
    password:  {
        type: DataTypes.STRING,
        // type: Sequelize.STRING, 
        allowNull: false,
    }, 
    role: {
        type: DataTypes.STRING,
        // type: Sequelize.STRING,  
        defaultValue: 'USER',
        allowNull: false,
    },
},
);

export default User ;
