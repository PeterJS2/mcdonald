import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import sequelize from './config/database';
import { User } from './models/User';
import { Category } from './models/Category';
import { Product } from './models/Product';

// Import Routes
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('McDonalds Kiosk API is running...');
});

// Sync Database
sequelize.sync({ force: false }).then(async () => {
  console.log('Database connected and synced.');
  
  // Seed initial admin if not exists
  const adminCount = await User.count();
  if (adminCount === 0) {
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Default admin user created: admin / admin123');
    
    await User.create({
      username: 'kasir',
      password: 'kasir123',
      role: 'kasir'
    });
    console.log('Default kasir user created: kasir / kasir123');
  }

  // Seed initial categories & products if not exists
  const categoryCount = await Category.count();
  if (categoryCount === 0) {
    console.log('Seeding dummy McDonald\'s menu data...');
    
    // Create Categories
    const burgerCat = await Category.create({ name: 'Burgers' });
    const chickenCat = await Category.create({ name: 'Chicken & Fish' });
    const drinkCat = await Category.create({ name: 'Drinks' });
    const snackCat = await Category.create({ name: 'Desserts & Snacks' });

    // Create Products
    await Product.bulkCreate([
      { 
        name: 'Big Mac', 
        price: 45000, 
        category_id: burgerCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-1.png' 
      },
      { 
        name: 'Cheeseburger', 
        price: 35000, 
        category_id: burgerCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-2.png' 
      },
      { 
        name: 'PaNas Special', 
        price: 42000, 
        category_id: chickenCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-5.png' 
      },
      { 
        name: 'French Fries', 
        price: 20000, 
        category_id: snackCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-11.png' 
      },
      { 
        name: 'Coca Cola', 
        price: 15000, 
        category_id: drinkCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-16.png' 
      },
      { 
        name: 'McFlurry Oreo', 
        price: 18000, 
        category_id: snackCat.id, 
        image_url: 'https://mcdonalds.co.id/assets/img/menu/menu-14.png' 
      }
    ]);
    console.log('Dummy MCD Menu seeded successfully.');
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
