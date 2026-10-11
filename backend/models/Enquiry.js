import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ['New', 'Contacted', 'Converted', 'Closed'], default: 'New' }
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);