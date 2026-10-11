import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    refId: {
      type: String,
      unique: true,
      default: () => `DMC-${Math.floor(1000 + Math.random() * 9000)}`
    },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    patientType: {
      type: String,
      enum: ['New patient', 'Returning patient'],
      default: 'New patient'
    },
    service: { type: String, default: 'Ayurvedic Consultation & Nadi Pariksha' },
    fee: { type: Number, default: 600 },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);