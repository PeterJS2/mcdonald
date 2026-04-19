import { Request, Response } from 'express';
import { User } from '../models/User';
import * as bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    const { password, ...userWithoutPassword } = user.get({ plain: true });
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body;
    
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await User.update(updateData, { where: { id } });
    if (updated) {
      const updatedUser = await User.findByPk(id as string, { attributes: { exclude: ['password'] } });
      return res.json(updatedUser);
    }
    throw new Error('User not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('User not found');
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
