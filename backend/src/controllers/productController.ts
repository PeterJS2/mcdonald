import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({ include: [Category] });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(id as string);
      return res.json(updatedProduct);
    }
    throw new Error('Product not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('Product not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
