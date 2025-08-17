import express from 'express';
import { login, register, adminLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';


const router = express.Router();

router.post('/register', register);

router.post('/login', login); 

router.post('/admin-login', adminLogin);

router.get('/profile', protect, async (req, res) => {
  try {
    let Model;
    switch(req.user.role) {
      case 'student': Model = User; break;
      case 'staff': Model = Staff; break;
      case 'admin': Model = Admin; break;
      default: return res.status(403).json({ error: 'Invalid role' });
    }

    const profile = await Model.findById(req.user._id).select('name email rollNo');
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    console.log('Update profile request:', req.user.id, req.body);
    
    if (!req.user.id) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    let Model;
    switch(req.user.role) {
      case 'student': Model = User; break;
      case 'staff': Model = Staff; break;
      case 'admin': Model = Admin; break;
      default: return res.status(403).json({ error: 'Invalid role' });
    }

    const updated = await Model.findByIdAndUpdate(
      req.user.id, 
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('name email rollNo');
    
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(400).json({ error: 'Update failed', details: err.message });
  }
});

router.put('/password', protect, async (req, res) => {
  try {
    console.log('Password change request for:', req.user.id); 
    
    let Model;
    switch(req.user.role) {
      case 'student': Model = User; break;
      case 'staff': Model = Staff; break;
      case 'admin': Model = Admin; break;
      default: return res.status(403).json({ error: 'Invalid role' });
    }

    const user = await Model.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', req.user.id);
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    
    console.log('Password updated for user:', req.user.id); 
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Password change error:', err); 
    res.status(400).json({ error: 'Password change failed', details: err.message });
  }
});




export default router;