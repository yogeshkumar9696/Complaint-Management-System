import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';
import Staff from '../models/Staff.js';

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authorized - no token provided' });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Find user in appropriate collection based on role
    let user;
    switch (decoded.role) {
      case 'student':
        user = await User.findById(decoded.id).select('-password');
        break;
      case 'staff':
        user = await Staff.findById(decoded.id).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(401).json({ error: 'Invalid user role' });
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 4. Attach user to request
    req.user = {
      _id: user._id,       
      id: user._id,        
      role: decoded.role,
      phone: user.phone,   
      email: user.email, 
      name: user.name
    };

    next();
  } catch (err) {
    console.error('Authentication error:', err);
    
    // More specific error messages
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(401).json({ error: 'Not authorized' });
  }
};

export const admin = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ 
    error: 'Admin access required',
    message: 'You need administrator privileges to access this resource' 
  });
};