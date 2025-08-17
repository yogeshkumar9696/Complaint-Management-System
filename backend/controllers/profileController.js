import Student from '../models/Student.js';
import Staff from '../models/Staff.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

const getModel = (role) => {
  switch(role) {
    case 'student': return Student;
    case 'staff': return Staff;
    case 'admin': return Admin;
    default: throw new Error('Invalid role');
  }
};

export const getProfile = async (req, res) => {
  try {
    const Model = getModel(req.user.role);
    const user = await Model.findById(req.user.id).select('name email');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const Model = getModel(req.user.role);
    const updated = await Model.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('name email');
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const Model = getModel(req.user.role);
    const user = await Model.findById(req.user.id);

    const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Incorrect current password' });
    
    user.password = await bcrypt.hash(req.body.newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Password change failed' });
  }
};