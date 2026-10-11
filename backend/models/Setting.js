import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  clinicName: { type: String, default: 'Dr Manasi Clinic' },
  tagline: { type: String, default: 'Classical Ayurveda, personalised for modern lives' },
  heroHeading: { type: String, default: 'Gentle & trusted care,' },
  aboutClinic: { type: String, default: 'A boutique specialized practice built around root-cause care and personalized therapies.' },
  doctorName: { type: String, default: 'Dr Manasi Kulkarni' },
  doctorTitle: { type: String, default: 'BAMS, MD (Ayu) — Kaychikitsa' },
  aboutHeading: { type: String, default: 'One doctor. Your whole healing journey.' },
  doctorBio: { type: String, default: 'A specialized practitioner blending classical clinical medicine into calm, structured healing.' },
  experienceYears: { type: String, default: '12' },
  consultationsCount: { type: String, default: '15000' },
  credentials: { type: String, default: 'Pune University\nGold Medalist\n12+ years of clinical practice' },
  specializations: { type: String, default: 'Panchakarma & Detox\nGut Health & Metabolism\nStress & Sleep' },
  morningStart: { type: String, default: '10:00' },
  morningEnd: { type: String, default: '13:00' },
  eveningStart: { type: String, default: '16:00' },
  eveningEnd: { type: String, default: '19:00' },
  slotLength: { type: String, default: '30 minutes' },
  fee: { type: Number, default: 600 },
  closedDays: { type: [String], default: ['Sunday'] },
  address: { type: String, default: '203, Sanjeevani House, Lane 7, Koregaon Park, Pune 411001' },
  phone: { type: String, default: '+91 98220 41234' },
  email: { type: String, default: 'care@drmanasiiclinic.in' },
  whatsapp: { type: String, default: '919822041234' },
  instagramUrl: { type: String, default: 'https://instagram.com' }
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);