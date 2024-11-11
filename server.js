const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.router');
const sequelize = require('./config/db');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded ({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

 sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

   sequelize.sync(); // connect to database


  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

// Synchronize Sequelize models and start the server
