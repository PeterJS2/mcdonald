import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json({ user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    // Simple mock since there's no email system requirement specified in detail
    const { username } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // In real app, send email with token. Here just return success.
    res.json({ message: 'If user exists, a reset link would be sent.' });
};

export const resetPassword = async (req: Request, res: Response) => {
    const { username, newPassword } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
