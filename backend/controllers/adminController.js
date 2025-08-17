import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Staff from '../models/Staff.js';

// Assign complaint to staff
export const assignComplaint = async (req, res) => {
  try {
    
    const staff = await Staff.findById(req.body.staffId);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    if (!staff.isActive) {
      return res.status(400).json({ error: 'Cannot assign to inactive staff' });
    }


    const currentComplaint = await Complaint.findById(req.params.id);
    if (!currentComplaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }


    if (currentComplaint.assignedTo?.toString() !== req.body.staffId) {

      if (currentComplaint.assignedTo) {
        await Staff.findByIdAndUpdate(
          currentComplaint.assignedTo,
          { $inc: { activeComplaintCount: -1 } }
        );
      }

      await Staff.findByIdAndUpdate(
        req.body.staffId,
        { $inc: { activeComplaintCount: 1 } }
      );
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: req.body.staffId,
        status: 'Assigned'
      },
      { new: true }
    )
    .populate('createdBy', 'name phone') 
    .populate('assignedTo', 'name phone department');

    res.json({
      success: true,
      complaint,
      message: currentComplaint.assignedTo ? 'Staff reassigned successfully' : 'Staff assigned successfully'
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};



// Resolve complaint
export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Resolved',
        resolution: req.body.resolution,
        resolvedAt: new Date() 
      },
      { new: true }
    );
    
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAwaitingReview = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Awaiting Review' })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name phone department');
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAssignedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Assigned' })
      .populate('createdBy', 'name email phone rollNo')
      .populate('assignedTo', 'name phone department')
      .sort({ createdAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const approveResolution = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Completed',
        adminNotes: req.body.notes || 'Approved',
        completedAt: new Date()
      },
      { new: true }
    );
    
    if (complaint.assignedTo) {
      await Staff.findByIdAndUpdate(
        complaint.assignedTo,
        { $inc: { activeComplaintCount: -1 } }
      );
    }
    
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCompletedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Completed' })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name phone department')
      .sort({ completedAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rejectComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { 
        status: 'Rejected',
        rejectedAt: new Date(),
        assignedTo: null
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({ 
      success: true, 
      message: 'Complaint rejected successfully',
      complaint
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while rejecting complaint' });
  }
};
export const getRejectedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'Rejected' })
      .populate('createdBy', 'name email phone rollNo')
      .sort({ updatedAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPendingComplaints = async (req, res) => {
  try {
      const complaints = await Complaint.find({ status: 'Pending' })
        .populate('createdBy', 'name phone')
        .sort({ createdAt: -1 });
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};
