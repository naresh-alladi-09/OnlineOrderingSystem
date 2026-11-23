import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockStore } from '../data/mockStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'feastify_secret_key');

      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const mockUser = await mockStore.findUserById(decoded.id);
        if (mockUser) {
          const { password, ...safeUser } = mockUser;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or authorization revoked' });
      }

      next();
    } catch (error) {
      console.error('Auth token verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'restaurant_owner')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};

