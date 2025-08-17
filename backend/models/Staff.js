import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true,
    enum: ['Electrical', 'Plumbing', 'Carpentry', 'IT', 'Administration'] 
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  isActive: { type: Boolean, default: true },
  activeComplaintCount: { type: Number, default: 0 }
}, { timestamps: true });

// Password encryption before saving
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
staffSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model('Staff', staffSchema);