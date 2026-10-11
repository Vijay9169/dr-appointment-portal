import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan aap apna secret Doctor PIN / Password set kar sakte hain:
    const ADMIN_SECRET = '15081947'; 

    if (pin.trim() === ADMIN_SECRET) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Worng PIN! Access Denied.');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#FAF7F0] border border-[#E8DFC8] rounded-3xl w-full max-w-sm shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setError('');
            setPin('');
            onClose();
          }}
          className="absolute top-4 right-4 text-[#8C7D6B] hover:text-[#133E2F] p-1 rounded-full hover:bg-black/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="text-center space-y-2 mt-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#133E2F] flex items-center justify-center text-[#E6C285] shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#133E2F]">
            Doctor & Admin Access
          </h3>
          <p className="text-xs text-[#6B7C6E]">
            Please enter your PIN to access clinic records & settings.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#8C7D6B] absolute left-3.5 top-3.5" />
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCD5C4] bg-white text-[#133E2F] text-sm tracking-widest text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-[#133E2F]/30"
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 font-medium flex items-center justify-center gap-1 mt-2">
                <ShieldAlert className="w-3.5 h-3.5" /> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#133E2F] hover:bg-[#0E2C22] text-[#E6C285] font-semibold text-xs py-3 rounded-xl shadow-md transition duration-150"
          >
            Unlock Admin Dashboard →
          </button>
        </form>

        <p className="text-[10px] text-center text-[#9A8B7A] mt-4">
          Protected medical records. Unauthorized access is restricted.
        </p>
      </div>
    </div>
  );
}