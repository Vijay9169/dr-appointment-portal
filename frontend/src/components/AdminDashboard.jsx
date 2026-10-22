import { API_BASE_URL } from '../api/appointmentApi';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, CalendarDays, Users, BellRing, HelpCircle,
    BarChart3, Settings, ExternalLink, Plus, Check, X, CheckCircle2,
    Trash2, MessageCircle, Save, XCircle
} from 'lucide-react';
import { updateAppointmentStatus } from '../api/appointmentApi';
import PatientDirectory from './PatientDirectory';

export default function AdminDashboard({
    appointments = [],
    enquiries = [],
    clinicConfig,
    setClinicConfig,
    onRefresh,
    onBackToSite,
    onBookClick
}) {
    const [tab, setTab] = useState('dashboard');
    const [saveLoading, setSaveLoading] = useState(false);

    // Local copy of form inputs
    const [formData, setFormData] = useState(clinicConfig);

    // Toast Notification State
    const [toast, setToast] = useState(null);

    const handleStatus = async (id, status) => {
        await updateAppointmentStatus(id, status);
        if (onRefresh) onRefresh();
    };

    const handleDeleteEnquiry = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/enquiries/${id}`, { method: 'DELETE' });
            showToast('Enquiry deleted successfully.', 'success');
            if (onRefresh) onRefresh();
        } catch (e) {
            showToast('Delete failed. Please try again.', 'error');
        }
    };

    // Save Settings to MongoDB and State
    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                const data = await res.json();
                setClinicConfig(data);
                showToast('Clinic settings successfully saved! Public site updated.', 'success');
            } else {
                setClinicConfig(formData);
                showToast('Settings saved locally.', 'success');
            }
        } catch (err) {
            setClinicConfig(formData);
            showToast('Settings saved in offline mode.', 'success');
        }
        setSaveLoading(false);
    };

    const confirmedCount = appointments.filter((a) => a.status === 'Confirmed').length;
    const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
    const totalRevenue = confirmedCount * (Number(clinicConfig?.fee) || 600);
    const uniquePatientsCount = new Set(appointments.map((a) => a.phone)).size;

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3500);
    };

    // Status update with toast trigger
    const handleAppointmentStatusChange = async (appointmentId, newStatus, patientName) => {
        try {
            // Aapka existing update API call
            await updateAppointmentStatus(appointmentId, newStatus);

            if (newStatus === 'Confirmed') {
                showToast(`Appointment for ${patientName || 'patient'} confirmed successfully!`, 'success');
            } else if (newStatus === 'Cancelled') {
                showToast(`Appointment for ${patientName || 'patient'} cancelled.`, 'error');
            }

            if (onRefresh) onRefresh();
        } catch (err) {
            showToast('Failed to update status. Please try again.', 'error');
        }
    };

    // Helper function to check if appointment date & time has passed
    const isSlotPassed = (dateStr, timeStr) => {
        try {
            if (!dateStr) return false;
            // Combine date and time (handles formats like "2026-10-11 10:30 AM" or "Mon, 12 Oct 2026 12:00 PM")
            const combinedStr = `${dateStr} ${timeStr || ''}`.trim();
            const slotDate = new Date(combinedStr);

            // Agar valid date parse hui toh compare karein
            if (!isNaN(slotDate.getTime())) {
                return new Date() > slotDate;
            }
            return false;
        } catch (e) {
            return false;
        }
    };

    // SweetAlert2 Confirmation for Cancel Action
    const confirmCancelAppointment = (appointment) => {
        Swal.fire({
            title: 'Cancel Appointment?',
            text: `Are you sure you want to cancel the appointment for ${appointment.patientName || 'this patient'}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#C35A38',
            cancelButtonColor: '#133E2F',
            confirmButtonText: 'Yes, Cancel it',
            cancelButtonText: 'Keep it',
            background: '#FAF7F0',
            customClass: {
                popup: 'rounded-2xl border border-[#E8DFC8]'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleAppointmentStatusChange(appointment._id, 'Cancelled', appointment.patientName);
            }
        });
    };

    return (
        <div className="min-h-screen bg-[#FAF7F0] flex text-[#1E2B22]">

            {/* Top Right Toast Notification */}
            {toast && (
                <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white animate-in slide-in-from-top duration-200">
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}

                    <div className="text-xs font-semibold text-[#133E2F]">
                        {toast.message}
                    </div>

                    <button
                        onClick={() => setToast(null)}
                        className="text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
            {/* SIDEBAR */}
            <aside className="w-60 bg-[#0E2A20] text-white p-5 flex flex-col justify-between shrink-0 min-h-screen">
                <div className="space-y-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#E57A44] flex items-center justify-center text-white font-serif font-bold text-sm">
                            🏥
                        </div>
                        <div>
                            <h2 className="text-sm font-serif font-bold tracking-tight text-white truncate max-w-[150px]">
                                {clinicConfig?.clinicName || 'Clinic CRM'}
                            </h2>
                            <p className="text-[9px] uppercase tracking-widest text-[#8FA796] font-semibold">Clinic CRM</p>
                        </div>
                    </div>

                    <nav className="space-y-1 text-xs font-medium">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'appointments', label: 'Appointments', icon: CalendarDays },
                            { id: 'patients', label: 'Patients', icon: Users },
                            { id: 'followups', label: 'Follow-ups', icon: BellRing },
                            { id: 'enquiries', label: 'Enquiries', icon: HelpCircle },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${tab === item.id ? 'bg-[#184435] text-white font-semibold' : 'text-[#9CB3A3] hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <button onClick={onBackToSite} className="text-xs text-[#8FA796] hover:text-white flex items-center gap-2 pt-4 border-t border-white/10">
                    <ExternalLink className="w-3.5 h-3.5" /> View public site
                </button>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-8 overflow-y-auto max-h-screen">
                {tab !== 'settings' && (
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-serif font-bold capitalize text-[#133E2F]">{tab}</h1>
                            <p className="text-xs text-[#7B8B7E]">Live Operations & Database Engine</p>
                        </div>
                        <button onClick={onBookClick} className="bg-[#C35A38] text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:bg-[#AA4B2B]">
                            <Plus className="w-3.5 h-3.5" /> Book appointment
                        </button>
                    </div>
                )}

                {/* --- TAB 1: DASHBOARD --- */}
                {tab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { label: "Confirmed Consults", val: confirmedCount },
                                { label: 'Upcoming Bookings', val: appointments.length },
                                { label: 'Pending Action', val: pendingCount },
                                { label: 'New Enquiries', val: enquiries.length },
                                { label: 'Patients in CRM', val: uniquePatientsCount }
                            ].map((k, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl border border-[#E8DFC8] shadow-sm">
                                    <p className="text-[10px] font-bold text-[#8A796A] uppercase">{k.label}</p>
                                    <p className="text-2xl font-serif font-bold text-[#133E2F] mt-1">{k.val}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h3 className="font-serif font-bold text-base text-[#133E2F]">Active Appointment Pipeline</h3>
                                <span className="text-xs text-[#8A796A] font-semibold">Est. Total: ₹{totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-[#2A392D]">
                                    <thead className="bg-[#FAF7F0] text-[#8C7D6B] font-semibold border-b border-[#E8DFC8]">
                                        <tr>
                                            <th className="py-2.5 px-3">Ref</th>
                                            <th className="py-2.5 px-3">Patient</th>
                                            <th className="py-2.5 px-3">Slot</th>
                                            <th className="py-2.5 px-3">Status</th>
                                            <th className="py-2.5 px-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F0EAE1]">
                                        {appointments.map((appointment) => (
                                            <tr key={appointment._id} className="hover:bg-[#FAF7F0]">
                                                <td className="py-2.5 px-3 font-mono font-bold text-[#133E2F]">{appointment.refId}</td>
                                                <td className="py-2.5 px-3">
                                                    <p className="font-semibold">{appointment.patientName}</p>
                                                    <p className="text-[10px] text-[#8C9C8F]">{appointment.phone}</p>
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <p>{appointment.date}</p>
                                                    <p className="text-[10px] text-[#8C9C8F]">{appointment.time}</p>
                                                </td>
                                                <td className="py-2.5 px-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${appointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                        appointment.status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                                                            appointment.status === 'Cancelled' ? 'bg-gray-100 text-gray-600' :
                                                                'bg-amber-100 text-amber-800'
                                                        }`}>
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    {/* STATE 1: PENDING */}
                                                    {appointment.status === 'Pending' && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => handleAppointmentStatusChange(appointment._id, 'Confirmed', appointment.patientName)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                                                                title="Confirm Slot"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                                <span>Confirm</span>
                                                            </button>

                                                            <button
                                                                onClick={() => confirmCancelAppointment(appointment)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition"
                                                                title="Cancel Appointment"
                                                            >
                                                                <X className="w-3.5 h-3.5" />
                                                                <span>Cancel</span>
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* STATE 2: CONFIRMED */}
                                                    {appointment.status === 'Confirmed' && (
                                                        <div className="flex items-center justify-center gap-2">
                                                            {/* 1st Button: Completed */}
                                                            <button
                                                                onClick={() => handleAppointmentStatusChange(appointment._id, 'Completed', appointment.patientName)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition"
                                                                title="Mark consultation completed"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                                <span>Completed</span>
                                                            </button>

                                                            {/* 2nd Button: Cancel (Sirf time se pehle dikhega, slot nikal jane par auto-hide) */}
                                                            {!isSlotPassed(appointment.date, appointment.time) ? (
                                                                <button
                                                                    onClick={() => confirmCancelAppointment(appointment)}
                                                                    className="px-2.5 py-1 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                                                                    title="Cancel this appointment"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            ) : (
                                                                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                                    Slot Passed
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* STATE 3: COMPLETED */}
                                                    {appointment.status === 'Completed' && (
                                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Consulted
                                                        </span>
                                                    )}

                                                    {/* STATE 4: CANCELLED */}
                                                    {appointment.status === 'Cancelled' && (
                                                        <span className="text-xs text-stone-400 italic">Cancelled</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 2: APPOINTMENTS --- */}
                {tab === 'appointments' && (
                    <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-sm">
                        <h3 className="font-serif font-bold text-[#133E2F]">All Booked Appointments ({appointments.length})</h3>
                        <div className="divide-y divide-[#F0EAE1]">
                            {appointments.map((a) => (
                                <div key={a._id} className="py-3.5 flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-semibold text-sm text-[#133E2F]">{a.patientName} <span className="font-mono text-[11px] text-[#8C7D6B]">({a.refId})</span></p>
                                        <p className="text-[#68796A]">{a.phone} · {a.patientType} · Reason: {a.reason || 'General Consultation'}</p>
                                        <p className="text-[11px] text-[#C35A38] font-medium mt-0.5">{a.date} at {a.time} (Fee: ₹{a.fee || clinicConfig?.fee})</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 3: PATIENTS --- */}
                {tab === 'patients' && <PatientDirectory appointments={appointments} />}

                {/* --- TAB 4: FOLLOW-UPS --- */}
                {tab === 'followups' && (
                    <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 space-y-4 shadow-sm">
                        <h4 className="font-serif font-bold text-base text-[#133E2F]">Actionable Follow-ups ({pendingCount})</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {appointments.filter(a => a.status === 'Pending').map((item) => (
                                <div key={item._id} className="p-4 rounded-xl border border-[#E8DFC8] bg-[#FAF7F0] space-y-2 text-xs">
                                    <div className="flex justify-between font-bold text-[#133E2F]">
                                        <span>{item.patientName}</span>
                                        <span className="text-[10px] text-[#8C7D6B] font-normal">{item.date}</span>
                                    </div>
                                    <p className="text-[#556758]">Pending consultation request for {item.time}</p>
                                    <div className="flex gap-2 pt-1 text-xs">
                                        <button onClick={() => handleStatus(item._id, 'Confirmed')} className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-semibold">
                                            Confirm
                                        </button>
                                        <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 5: ENQUIRIES --- */}
                {tab === 'enquiries' && (
                    <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 space-y-4 shadow-sm">
                        <h3 className="font-serif font-bold text-base text-[#133E2F]">Website Enquiries ({enquiries.length})</h3>
                        <div className="space-y-3">
                            {enquiries.map((enq) => (
                                <div key={enq._id} className="p-4 rounded-xl border border-[#E8DFC8] bg-[#FAF7F0] space-y-2 text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-sm text-[#133E2F]">{enq.name}</span>
                                        <button onClick={() => handleDeleteEnquiry(enq._id)} className="text-rose-500 hover:text-rose-700">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <p className="text-[#334235] bg-white p-2.5 rounded-lg border border-[#E8DFC8]">{enq.question}</p>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-[#7B8B7E]">Phone: {enq.phone}</span>
                                        <a
                                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.name)},%20regarding%20your%20enquiry%20at%20${encodeURIComponent(clinicConfig?.clinicName)}...`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" /> Reply on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- TAB 6: ANALYTICS --- */}
                {tab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]">
                                <p className="text-[10px] font-bold text-[#8A796A] uppercase">Total Real Patients</p>
                                <p className="text-3xl font-serif font-bold text-[#133E2F] mt-1">{uniquePatientsCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]">
                                <p className="text-[10px] font-bold text-[#8A796A] uppercase">Total Bookings</p>
                                <p className="text-3xl font-serif font-bold text-[#133E2F] mt-1">{appointments.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]">
                                <p className="text-[10px] font-bold text-[#8A796A] uppercase">Confirmed Consults</p>
                                <p className="text-3xl font-serif font-bold text-emerald-700 mt-1">{confirmedCount}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-[#E8DFC8]">
                                <p className="text-[10px] font-bold text-[#8A796A] uppercase">Total Enquiries</p>
                                <p className="text-3xl font-serif font-bold text-[#C35A38] mt-1">{enquiries.length}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB 7: COMPLETE 4-BOX SETTINGS PANEL --- */}
                {tab === 'settings' && (
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-[#133E2F]">Clinic settings</h3>
                                <p className="text-xs text-[#7B8B7E]">These details power the public booking site and the slot engine.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={saveLoading}
                                className="bg-[#C35A38] text-white px-6 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 hover:bg-[#AA4B2B] shadow-md transition"
                            >
                                <Save className="w-4 h-4" /> {saveLoading ? 'Saving...' : 'Save settings'}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* CARD 1: CLINIC IDENTITY */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-sm">
                                <h4 className="font-serif font-bold text-sm text-[#133E2F]">Clinic identity</h4>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Clinic name</label>
                                    <input
                                        value={formData.clinicName}
                                        onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        placeholder="e.g. Dr Sanjeev Mehta Child Clinic"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Tagline</label>
                                    <input
                                        value={formData.tagline}
                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        placeholder="e.g. Pediatric & Neonatal Care"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Hero Main Headline</label>
                                    <input
                                        value={formData.heroHeading ?? ''}
                                        onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        placeholder="e.g. Gentle & trusted care, ya Heal the classical way,"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">About the clinic</label>
                                    <textarea
                                        rows="3"
                                        value={formData.aboutClinic}
                                        onChange={(e) => setFormData({ ...formData, aboutClinic: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                    />
                                </div>
                            </div>

                            {/* CARD 2: DOCTOR PROFILE */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-sm">
                                <h4 className="font-serif font-bold text-sm text-[#133E2F]">Doctor profile</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Doctor name</label>
                                        <input
                                            value={formData.doctorName}
                                            onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                            placeholder="e.g. Dr Sanjeev Mehta"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Qualification line</label>
                                        <input
                                            value={formData.doctorTitle}
                                            onChange={(e) => setFormData({ ...formData, doctorTitle: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                            placeholder="e.g. MBBS, MD (Pediatrics)"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">About Section Headline</label>
                                    <input
                                        value={formData.aboutHeading ?? ''}
                                        onChange={(e) => setFormData({ ...formData, aboutHeading: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        placeholder="e.g. One doctor. Your whole healing journey."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Doctor bio</label>
                                    <textarea
                                        rows="2"
                                        value={formData.doctorBio}
                                        onChange={(e) => setFormData({ ...formData, doctorBio: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Years of experience</label>
                                        <input
                                            value={formData.experienceYears}
                                            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Consultations (count)</label>
                                        <input
                                            value={formData.consultationsCount}
                                            onChange={(e) => setFormData({ ...formData, consultationsCount: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Credentials (one per line)</label>
                                    <textarea
                                        rows="4"
                                        value={formData.credentials ?? ''}
                                        onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        placeholder="BAMS — Pune University&#10;MD (Ayu) Kaychikitsa — Gold Medalist&#10;12+ years of clinical practice&#10;15,000+ consultations"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Specializations (one per line)</label>
                                    <textarea
                                        rows="3"
                                        value={formData.specializations}
                                        onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        placeholder="Neonatology&#10;Child Nutrition&#10;Vaccination"
                                    />
                                </div>
                            </div>

                            {/* CARD 3: HOURS & SLOTS */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-sm">
                                <h4 className="font-serif font-bold text-sm text-[#133E2F]">Hours & slots</h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Morning start</label>
                                        <input
                                            type="text"
                                            placeholder="10:00"
                                            value={formData.morningStart ?? '10:00'}
                                            onChange={(e) => setFormData({ ...formData, morningStart: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Morning end</label>
                                        <input
                                            type="text"
                                            placeholder="13:00"
                                            value={formData.morningEnd ?? '13:00'}
                                            onChange={(e) => setFormData({ ...formData, morningEnd: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Evening start</label>
                                        <input
                                            type="text"
                                            placeholder="16:00"
                                            value={formData.eveningStart ?? '16:00'}
                                            onChange={(e) => setFormData({ ...formData, eveningStart: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Evening end</label>
                                        <input
                                            type="text"
                                            placeholder="19:00"
                                            value={formData.eveningEnd ?? '19:00'}
                                            onChange={(e) => setFormData({ ...formData, eveningEnd: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Slot length</label>
                                        <select
                                            value={formData.slotLength ?? '30 minutes'}
                                            onChange={(e) => setFormData({ ...formData, slotLength: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        >
                                            <option>15 minutes</option>
                                            <option>30 minutes</option>
                                            <option>45 minutes</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Consultation fee (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="600"
                                            value={formData.fee ?? 600}
                                            onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CARD 4: CONTACT & SOCIALS */}
                            <div className="bg-white p-6 rounded-2xl border border-[#E8DFC8] space-y-4 shadow-sm">
                                <h4 className="font-serif font-bold text-sm text-[#133E2F]">Contact & socials</h4>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Address</label>
                                    <textarea
                                        rows="2"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Email</label>
                                        <input
                                            placeholder="care@drmanasiiclinic.in"
                                            value={formData.email ?? 'care@drmanasiiclinic.in'}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">WhatsApp number</label>
                                        <input
                                            placeholder="919822041234"
                                            value={formData.whatsapp ?? '919822041234'}
                                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Instagram URL</label>
                                    <input
                                        placeholder="https://instagram.com"
                                        value={formData.instagramUrl ?? 'https://instagram.com'}
                                        onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </main>
        </div>
    );
}