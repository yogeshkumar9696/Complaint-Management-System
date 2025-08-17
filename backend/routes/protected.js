import express from 'express';
import { protect, admin } from '../middleware/auth.js';
const router = express.Router();

router.get('/student-dashboard', protect, (req, res) => {
  res.json({ message: `Welcome student ${req.user.name}` });
});

router.get('/admin-dashboard', protect, admin, (req, res) => {
  res.json({ message: `Welcome admin ${req.user.name}` });
});

export default router;