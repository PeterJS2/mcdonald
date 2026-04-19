import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import sequelize from '../config/database';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const { items, total_price } = req.body;

    const order = await Order.create({ total_price }, { transaction: t });

    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }, { transaction: t });
    }

    await t.commit();
    
    const completedOrder = await Order.findByPk(order.id, {
      include: [OrderItem]
    });
    
    res.status(201).json(completedOrder);
  } catch (error: any) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [updated] = await Order.update({ status }, { where: { id } });
    if (updated) {
      const updatedOrder = await Order.findByPk(id as string);
      return res.json(updatedOrder);
    }
    throw new Error('Order not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
