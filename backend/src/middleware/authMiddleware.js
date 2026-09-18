import jwt from 'jsonwebtoken';
import { Owner } from '../models/Owner.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_cg_2026';
    const decoded = jwt.verify(token, secret);

    const owner = await Owner.findById(decoded.id).select('-password');
    if (!owner) {
      return res.status(401).json({ success: false, message: 'Account not found' });
    }

    req.owner = owner;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired' });
  }
};
