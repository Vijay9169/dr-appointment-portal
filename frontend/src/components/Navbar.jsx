import React from 'react';
import { Stethoscope, Baby, HeartPulse } from 'lucide-react';

export default function Navbar({ clinicConfig = {}, onBookClick, onCrmClick }) {
  // Dynamic clinic name and tagline
  const clinicName = clinicConfig?.clinicName || '';
  const tagline = clinicConfig?.tagline || '';

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E8DFC8]/60 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-10 h-10 rounded-full bg-[#133E2F] flex items-center justify-center text-amber-200">
            <Stethoscope className="w-5 h-5 text-[#E6C285]" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-[#133E2F] leading-tight">
              {clinicName}
            </h1>
            <p className="text-[10px] tracking-widest uppercase font-semibold text-[#8B6B4E]">
              {tagline}
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4D5E50]">
          <a href="#about" className="hover:text-[#133E2F] transition">About Doctor</a>
          <a href="#treatments" className="hover:text-[#133E2F] transition">Treatments</a>
          <a href="#visit" className="hover:text-[#133E2F] transition">Visit us</a>
        </nav>

        <div className="flex items-center gap-3">
          {/* <button
            type="button"
            onClick={onCrmClick}
            className="text-xs font-semibold text-[#133E2F] px-3.5 py-2 hover:opacity-80 transition"
          >
            Admin CRM
          </button> */}
          <button
            onClick={onBookClick}
            className="bg-[#C35A38] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:bg-[#AB4B2C] shadow-sm transition"
          >
            Book appointment
          </button>
        </div>
      </div>
    </header>
  );
}