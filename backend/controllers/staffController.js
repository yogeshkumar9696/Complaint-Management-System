import Staff from '../models/Staff.js';
import Complaint from '../models/Complaint.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// Add new staff member
export const addStaff = async (req, res) => {
  try {
    const { name, email, phone, department, password } = req.body;

    // hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const staff = await Staff.create({
      name,
      email,
      phone,
      department,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        department: staff.department,
        isActive: staff.isActive
      }
    });

  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// View all staff
export const getStaff = async (req, res) => {
  try {
    const { department } = req.query;
    
    const filter = {};
    if (department) filter.department = department;
    
    const staff = await Staff.find(filter);
    
    res.json({
      success: true,
      count: staff.length,
      staff
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const getAssigned = async (req, res) => {
  try {
      const complaints = await Complaint.find({
        assignedTo: req.user._id,
        status: 'Assigned'
      }).populate('createdBy', 'name phone');
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// View all awaiting review complaints
export const getAwaiting = async (req, res) => {
  try {
      const complaints = await Complaint.find({
        assignedTo: req.user._id,
        status: 'Awaiting Review'
      }).populate('createdBy', 'name');
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// View all Completed complaints
export const getCompleted = async (req, res) => {
  try {
      const complaints = await Complaint.find({
        assignedTo: req.user._id,
        status: 'Completed'
      }).populate('createdBy', 'name phone');
      res.json(complaints);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Submit proof
export const submitProof = async (req, res) => {
  try {
        if (!req.file) {
          return res.status(400).json({ error: 'Proof image is required' });
        }
          const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'complaints/proofs'
        });
        const complaint = await Complaint.findByIdAndUpdate(
          req.params.id,
          { 
            status: 'Awaiting Review',
            resolutionProof: result.secure_url, // or Cloudinary URL if using
            resolvedAt: new Date()
          },
          { new: true }
        ).populate('createdBy', 'name phone');
  
        res.json(complaint);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};

//get unique department
export const getDepartment = async (req, res) => {
  try {
      const departments = await Staff.distinct('department');
      res.json(departments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

//get staff by department
export const getStaffByDepartment = async (req, res) => {
  try {
      const staff = await Staff.find({ department: req.params.dept })
        .select('name phone department isActive');
      res.json(staff);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

//Make staff active or inactive
export const toggleStaffStatus = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    );
    res.json(staff);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};