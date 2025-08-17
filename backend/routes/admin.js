import { protect, admin } from '../middleware/auth.js';
import express from 'express';
import { 
  getPendingComplaints,
  assignComplaint,
  resolveComplaint,
  getAwaitingReview,
  approveResolution,
  getAssignedComplaints,
  getCompletedComplaints,
  rejectComplaint,
  getRejectedComplaints
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/pending-complaints', protect, admin, getPendingComplaints);

router.patch('/assign/:id', protect, admin, assignComplaint);

router.patch('/resolve/:id', protect, admin, resolveComplaint);
router.get('/awaiting-review', protect, admin, getAwaitingReview);
router.patch('/complete/:id', protect, admin, approveResolution);
router.get('/assigned-complaints', protect, admin, getAssignedComplaints);
router.get('/completed-complaints', protect, admin, getCompletedComplaints);

router.patch('/reject/:id', protect, admin, rejectComplaint);
router.get('/rejected-complaints', protect, admin, getRejectedComplaints);

export default router;