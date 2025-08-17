import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const createComplaint = async (req, res) => {
  try {
    console.log('Raw body:', req.body);
    console.log('Files:', req.files);

    let imageUrl = null;
    
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: "campuscare/complaints"
      });
      imageUrl = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      };
      fs.unlinkSync(req.file.path);
    } else if (req.files && req.files.attachments) {
      const uploadResponse = await cloudinary.uploader.upload(req.files.attachments.path, {
        folder: "campuscare/complaints"
      });
      imageUrl = {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id
      };
      fs.unlinkSync(req.files.attachments.path);
    }

    const complaint = await Complaint.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.user._id,
      studentContact: req.body.phone,
      attachments: imageUrl
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error('Error creating complaint:', err);
    res.status(400).json({
      success: false,
      error: err.message,
      validationErrors: err.errors
    });
  }
};


// Admin assigns staff
export const assignStaff = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: req.body.staffId,
        status: 'Assigned'
      },
      { new: true }
    ).populate('assignedTo', 'name phone');
    
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Staff submits resolution proof
export const submitResolution = async (req, res) => {
  try {
    console.log('Resolution proof file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No resolution proof was uploaded'
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'campuscare/resolution-proofs',
      resource_type: 'auto'
    });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Awaiting Review",
        resolutionProof: result.secure_url,
        resolvedAt: new Date()
      },
      { new: true }
    ).populate('assignedTo', 'name phone');

    fs.unlinkSync(req.file.path);
    res.json({ success: true, complaint });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Admin approves resolution
export const approveResolution = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Completed',
        resolvedAt: new Date(),
        adminNotes: req.body.notes
      },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPending = async (req, res) => {
  try {
      const complaints = await Complaint.find({
        createdBy: req.user._id,
        status: { $in: ['Pending', 'Awaiting Review', 'Assigned'] }
      })
      .populate('assignedTo', 'name phone')
      .sort({ createdAt: -1 });
      
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

export const deletePending = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
      status: 'Pending'
    });

    if (!complaint) {
      return res.status(403).json({ 
        error: 'Complaint not found or cannot be deleted (must be Pending status)' 
      });
    }

    if (complaint.attachments?.publicId) {
      await cloudinary.uploader.destroy(complaint.attachments.publicId);
    }

    await complaint.deleteOne();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getResolved = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      createdBy: req.user._id,
      status: { $in: ['Completed', 'Rejected'] }
    })
    .populate('assignedTo', 'name phone')
    .sort({ updatedAt: -1 });
    
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};