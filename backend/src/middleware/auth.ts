import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireSeller = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await authenticateToken(req, res, () => {
      if (req.user?.role !== 'SELLER') {
        return res.status(403).json({ error: 'Seller access required' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ error: 'Authentication required' });
  }
}; 