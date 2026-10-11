import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import Enquiry from './models/Enquiry.js';
import Setting from './models/Setting.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Main Route
app.use('/api/appointments', appointmentRoutes);

// --- ENQUIRIES APIS (Yeh zaroor add karein) ---
app.get('/api/enquiries', async (req, res) => {
    try {
        const list = await Enquiry.find().sort({ createdAt: -1 });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/enquiries', async (req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.status(201).json(newEnquiry);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/enquiries/:id', async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Enquiry deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get Settings
app.get('/api/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({});
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Settings
app.post('/api/settings', async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create(req.body);
        } else {
            settings = await Setting.findByIdAndUpdate(settings._id, req.body, { new: true });
        }
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));