import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { addStaff, getAssigned, getAwaiting, getCompleted, getDepartment, getStaff, getStaffByDepartment, submitProof, toggleStaffStatus } from '../controllers/staffController.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Complaint from '../models/Complaint.js';
import Staff from '../models/Staff.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/assigned', protect, getAssigned);

router.post('/', protect, admin, addStaff);
router.get('/', protect, admin, getStaff);

router.get('/awaiting-review', protect, getAwaiting);

router.get('/completed', protect, getCompleted);

router.patch('/:id/resolve', protect, upload.single('proof'), submitProof);

router.get('/departments', protect, admin, getDepartment);

router.get('/department/:dept', protect, admin, getStaffByDepartment);

router.patch('/:id/status', protect, admin, toggleStaffStatus);



export default router;