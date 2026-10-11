import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import BookingWizard from './components/BookingWizard';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import { getAppointments } from './api/appointmentApi';

export default function App() {
  const [view, setView] = useState('site');
  const [appointments, setAppointments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [clinicConfig, setClinicConfig] = useState(null); // Database se aayega
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const loadData = async () => {
    try {
      // 1. Fetch live settings from MongoDB
      const resS = await fetch('http://localhost:5000/api/settings');
      if (resS.ok) {
        const conf = await resS.json();
        if (conf) {
          setClinicConfig(conf);
          document.title = conf.clinicName || 'Clinic Portal';
        }
      }

      // 2. Fetch live appointments from MongoDB
      const resA = await getAppointments();
      setAppointments(resA || []);

      // 3. Fetch live enquiries from MongoDB
      const resE = await fetch('http://localhost:5000/api/enquiries');
      if (resE.ok) {
        setEnquiries(await resE.json());
      }
    } catch (e) {
      console.error('Database connection error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !clinicConfig) {
    return <div>Loading...</div>;
  }

  if (view === 'booking') {
    return (
      <BookingWizard
        clinicConfig={clinicConfig}
        onBack={() => setView('site')}
        onComplete={() => {
          setView('site');
          loadData();
        }}
      />
    );
  }

  if (view === 'crm') {
    return (
      <AdminDashboard
        appointments={appointments}
        enquiries={enquiries}
        clinicConfig={clinicConfig}
        setClinicConfig={setClinicConfig}
        onRefresh={loadData}
        onBackToSite={() => setView('site')}
        onBookClick={() => setView('booking')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0]">
      <Navbar
        clinicConfig={clinicConfig}
        onBookClick={() => setView('booking')}
        onCrmClick={() => setShowLoginModal(true)}
      />

      <HeroSection
        clinicConfig={clinicConfig}
        onBookClick={() => setView('booking')}
        onCrmClick={() => setShowLoginModal(true)}
      />

      {/* Admin Login PIN Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setView('crm'); // Sahi password hone par seedha Dashboard open hoga!
        }}
      />
    </div>
  );
}