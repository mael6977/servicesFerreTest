import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserProfile from '../../models/user-profile.model';
import { SECRET_KEY_TOKEN } from '../../utils/config';

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password }: { email: string; password: string } = req.body;
  try {
    const user = await UserProfile.findOne({ email }).populate('role', 'rol').exec();
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email or password is incorrect' });
    }
    const token = jwt.sign(
      { email: user.email, role: user.role },
      SECRET_KEY_TOKEN as string,
      { expiresIn: '1h' }
    );
    return res.json({ token, id: user.id, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error });
  }
};

export const validateToken = (req: Request, res: Response): Response => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY_TOKEN as string);
    return res.json({ message: 'Token is valid', decoded });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};