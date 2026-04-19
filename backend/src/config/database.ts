import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME!,
  dialect: 'postgres',
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT) || 5432,
  models: [User, Category, Product, Order, OrderItem],
  logging: false,
});

export default sequelize;
