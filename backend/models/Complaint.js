import mongoose from 'mongoose';
const complaintSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'] 
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'] 
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electrical', 'Plumbing', 'Carpentry', 'IT', 'Other']
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Assigned', 'Awaiting Review', 'Completed','Rejected']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  studentContact: {
    type:String,
  },
  attachments: {
    url: { type: String },
    publicId: { type: String }
  },
  resolutionProof: {
    type: String,
  },
  completedAt: Date
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);