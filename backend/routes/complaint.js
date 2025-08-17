import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import multer from 'multer';
import { 
  createComplaint, 
  assignStaff, 
  submitResolution, 
  approveResolution, 
  getPending,
  deletePending,
  getResolved
} from '../controllers/complaintController.js';
import Complaint from '../models/Complaint.js';


const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('attachments'), createComplaint);

router.patch('/:id/resolve', protect, upload.single('proof'),submitResolution);

router.get('/pending', protect, getPending);

router.delete('/:id', protect, deletePending);

router.patch('/:id/assign', protect, admin, assignStaff);
router.patch('/:id/approve', protect, admin, approveResolution);

router.get('/resolved', protect, getResolved);

export default router;
