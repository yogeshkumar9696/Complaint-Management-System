import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Staff from '../models/Staff.js';



export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let Model;
    switch(role?.toLowerCase()) {
      case 'admin':
        Model = Admin;
        break;
      case 'staff':
        Model = Staff;
        break;
      case 'user':
      default:
        Model = User;
    }

    const account = await Model.findOne({ email });
    if (!account) {
      return res.status(401).json({ 
        success: false,
        error: `No ${role} account found with this email`
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { 
        id: account._id, 
        role: role.toLowerCase() 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const accountData = account.toObject();
    delete accountData.password;

    res.json({
      success: true,
      token,
      user: accountData,
      role: role.toLowerCase()
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const adminData = admin.toObject();
    delete adminData.password;

    res.json({ 
      success: true,
      token,
      user: adminData,
      role: 'admin'
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });
    
    if (!staff) {
      return res.status(401).json({ error: "Invalid staff credentials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid staff credentials" });
    }

    const token = jwt.sign(
      { id: staff._id, role: 'staff' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const staffData = staff.toObject();
    delete staffData.password;

    res.json({ 
      success: true,
      token,
      user: staffData,
      role: 'staff'
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.message });
  }
};
