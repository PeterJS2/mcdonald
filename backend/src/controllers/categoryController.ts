import { Request, Response } from 'express';
import { Category } from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id } });
    if (updated) {
      const updatedCategory = await Category.findByPk(id as string);
      return res.json(updatedCategory);
    }
    throw new Error('Category not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('Category not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
