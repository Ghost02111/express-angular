import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.router.js';
import productRoutes from './routes/product.router.js';
import categoryRoute from './routes/category.route.js';
import cartRoute from './routes/cart.route.js';
import sequelize from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded ({ extended: true }));

app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes );
app.use('/api/products', productRoutes );
app.use('/api/category', categoryRoute ) ;
app.use('/api/cart', cartRoute );

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');

    sequelize.sync({ alter: true }); // connect to database
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

  

