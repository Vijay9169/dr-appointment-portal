import React, { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import { createAppointment } from '../api/appointmentApi';

export default function BookingWizard({ clinicConfig = {}, onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week (+7 days), etc.

  const clinicName = clinicConfig?.clinicName || 'Mehta Child Care Clinic';
  const doctorName = clinicConfig?.doctorName || 'Dr. Sanjeev Mehta';
  const fee = clinicConfig?.fee || 800;
  const slotLength = clinicConfig?.slotLength || '30-minute';
  const closedDays = clinicConfig?.closedDays || ['Sunday'];

  // Current date se dynamic 7 din calculate karna based on weekOffset
  const dynamicDays = useMemo(() => {
    const days = [];
    const baseDate = new Date(); // Today
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const fullDayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const dateNum = d.getDate().toString();
      const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
      const fullDateStr = d.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      const isClosed = closedDays.includes(fullDayName);

      days.push({
        day: dayName,
        d: dateNum,
        m: monthShort,
        full: fullDateStr,
        closed: isClosed
      });
    }
    return days;
  }, [weekOffset, closedDays]);

  const [form, setForm] = useState(() => ({
    date: '',
    time: '',
    patientName: '',
    phone: '',
    email: '',
    patientType: 'New patient',
    reason: '',
    fee: fee
  }));

  const [submitted, setSubmitted] = useState(false);

  const handleFinish = async () => {
    try {
      await createAppointment({ ...form, fee: fee });
      setSubmitted(true);
      if (onComplete) onComplete();
    } catch (e) {
      alert('Error booking appointment');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1E2B22] px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#133E2F] flex items-center justify-center text-amber-200">
              <Stethoscope className="w-4 h-4 text-[#E6C285]" />
            </div>
            <span className="font-serif font-bold text-base text-[#133E2F]">{clinicName}</span>
          </div>
          <button onClick={onBack} className="text-xs font-semibold text-[#5A6C5D] hover:text-[#133E2F]">
            ← Clinic home
          </button>
        </div>

        {/* Wizard Title */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-serif font-bold text-[#133E2F]">Book your consultation</h2>
          <p className="text-xs text-[#6B7C6E]">
            Personalised healthcare with {doctorName} · ₹{fee} per consultation, pay at the clinic.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-6 py-2 text-xs">
          {['Date', 'Time', 'Details', 'Confirm'].map((lbl, idx) => (
            <div key={lbl} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${step > idx + 1
                    ? 'bg-[#133E2F] text-white'
                    : step === idx + 1
                      ? 'border border-[#C35A38] text-[#C35A38]'
                      : 'border border-[#D1C7B2] text-[#8C7D6B]'
                  }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={step >= idx + 1 ? 'text-[#133E2F] font-semibold' : 'text-[#8C7D6B]'}>
                {lbl}
              </span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 md:p-8 shadow-sm">

          {/* STEP 1: DATE SELECTION WITH NEXT/PREV NAVIGATION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-serif font-bold text-[#133E2F] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C35A38]" /> Select a date
                  </h3>
                  <p className="text-xs text-[#7B8B7E] mt-0.5">
                    Clinic hours: {clinicConfig?.morningStart || '10:00'}–{clinicConfig?.morningEnd || '13:00'} & {clinicConfig?.eveningStart || '16:00'}–{clinicConfig?.eveningEnd || '19:00'}, {slotLength} slots.
                  </p>
                </div>

                {/* Week Switching Arrows */}
                <div className="flex items-center gap-1.5 bg-[#FAF7F0] border border-[#E8DFC8] p-1 rounded-xl">
                  <button
                    type="button"
                    disabled={weekOffset === 0}
                    onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg hover:bg-white text-[#133E2F] disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Previous week"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-semibold px-2 text-[#556758]">
                    {weekOffset === 0 ? 'This Week' : `+${weekOffset} Week`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setWeekOffset(prev => prev + 1)}
                    className="p-1.5 rounded-lg hover:bg-white text-[#133E2F] transition"
                    title="Next week"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic 7-Day Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {dynamicDays.map((item, i) => {
                  const isSelected = form.date === item.full;
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={item.closed}
                      onClick={() => setForm({ ...form, date: item.full })}
                      className={`p-3.5 rounded-2xl border text-center transition-all duration-150 flex flex-col items-center justify-center ${item.closed
                          ? 'opacity-40 bg-[#F4EFEB] border-[#E8DFC8] cursor-not-allowed text-[#8C7D6B]'
                          : isSelected
                            ? 'bg-[#133E2F] text-white border-[#133E2F] shadow-md scale-[1.03] ring-2 ring-[#133E2F]/30'
                            : 'bg-[#FAF7F0] border-[#E8DFC8] text-[#1E2B22] hover:border-[#133E2F] hover:bg-white'
                        }`}
                    >
                      <span className={`text-[11px] font-bold tracking-wider ${isSelected ? 'text-[#E6C285]' : 'text-[#8A796A]'}`}>
                        {item.day}
                      </span>
                      <span className="text-xl font-serif font-bold my-0.5">
                        {item.d}
                      </span>
                      <span className={`text-[10px] font-medium ${isSelected ? 'text-[#C5D5C8]' : 'text-[#8A796A]'}`}>
                        {item.closed ? 'Closed' : item.m}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Date Confirmation Banner */}
              <div className="bg-[#FAF7F0] border border-[#E8DFC8] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs">
                <span className="text-[#6B7C6E]">Selected consultation date:</span>
                <span className="font-bold text-[#133E2F] bg-white px-3 py-1 rounded-lg border border-[#E8DFC8] shadow-xs">
                  📅 {form.date || 'Please select a date from above'}
                </span>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#F0EAE1]">
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-semibold text-[#667768] hover:text-[#133E2F]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!form.date}
                  onClick={() => setStep(2)}
                  className="bg-[#C35A38] text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-[#AB4B2C] shadow-sm disabled:opacity-50 transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TIME */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-serif font-bold text-[#133E2F] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C35A38]" /> Select a time
                </h3>
                <p className="text-xs text-[#7B8B7E] mt-0.5 font-medium">{form.date}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase text-[#8A796A] mb-2">Morning</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                    {['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, time: t })}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition ${form.time === t ? 'bg-[#133E2F] text-white border-[#133E2F]' : 'border-[#E4DBC7]'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase text-[#8A796A] mb-2">Evening</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
                    {['4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, time: t })}
                        className={`py-2 px-3 rounded-xl border text-center font-medium transition ${form.time === t ? 'bg-[#133E2F] text-white border-[#133E2F]' : 'border-[#E4DBC7]'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#F0EAE1]">
                <button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-[#667768]">← Back</button>
                <button type="button" onClick={() => setStep(3)} className="bg-[#C35A38] text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-[#AB4B2C]">
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-serif font-bold text-[#133E2F]">Your details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Full name *</label>
                  <input
                    required
                    type="text"
                    value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                    placeholder="e.g. Ananya Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Phone number *</label>
                  <input
                    required
                    type="tel"
                    maxLength={14}
                    placeholder="+91 98XXX XXXXX"
                    value={form.phone}
                    onChange={(e) => {
                      // Sirf numbers aur leading '+' allow karein, text/letters filter out karein
                      const cleaned = e.target.value.replace(/[^0-9+]/g, '');
                      setForm({ ...form, phone: cleaned });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Patient type *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['New patient', 'Returning patient'].map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setForm({ ...form, patientType: pt })}
                      className={`p-3 rounded-xl border text-left text-xs ${form.patientType === pt
                          ? 'bg-[#EBF2ED] border-[#133E2F] font-semibold text-[#133E2F]'
                          : 'border-[#DCD5C4] text-[#6E7E70]'
                        }`}
                    >
                      <p>{pt}</p>
                      <p className="text-[10px] text-[#8C9C8F]">
                        {pt === 'New patient' ? `First visit with ${doctorName}` : "I've consulted before"}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Reason for visit</label>
                <textarea
                  rows="2"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD5C4] text-xs"
                  placeholder="e.g. Growth checkup, vaccination, consultation..."
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-[#F0EAE1]">
                <button type="button" onClick={() => setStep(2)} className="text-xs font-semibold text-[#667768]">← Back</button>
                <button
                  type="button"
                  disabled={!form.patientName || !form.phone}
                  onClick={() => setStep(4)}
                  className="bg-[#C35A38] disabled:opacity-50 text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-[#AB4B2C]"
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-base font-serif font-bold text-[#133E2F]">Review & confirm</h3>
              {submitted ? (
                <div className="bg-[#EBF2ED] text-[#133E2F] p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                  <h4 className="text-xl font-serif font-bold">Appointment Confirmed!</h4>
                  <p className="text-xs">
                    Your appointment with {doctorName} at {clinicName} is confirmed for {form.date} at {form.time}.
                  </p>
                  <button onClick={onBack} className="mt-3 px-6 py-2 bg-[#133E2F] text-white text-xs font-semibold rounded-xl">
                    Back to Clinic
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-[#FAF7F0] rounded-2xl p-5 border border-[#E8DFC8] space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#E8DFC8]/50">
                      <span>Doctor / Clinic</span><strong>{doctorName} ({clinicName})</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DFC8]/50">
                      <span>Date</span><strong>{form.date}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DFC8]/50">
                      <span>Time</span><strong>{form.time}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DFC8]/50">
                      <span>Patient</span><strong>{form.patientName}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#E8DFC8]/50">
                      <span>Phone</span><strong>{form.phone}</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Fee</span><strong>₹{fee} · pay at clinic</strong>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button type="button" onClick={() => setStep(3)} className="text-xs font-semibold text-[#667768]">← Back</button>
                    <button type="button" onClick={handleFinish} className="bg-[#133E2F] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#0B251C]">
                      Confirm appointment
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}