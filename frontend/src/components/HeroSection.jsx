import React, { useState } from 'react';
import {
    Clock, ArrowRight, Phone, MapPin, Mail, MessageCircle,
    CheckCircle2
} from 'lucide-react';

export default function HeroSection({ clinicConfig = {}, onBookClick }) {
    const [enquiry, setEnquiry] = useState({ name: '', phone: '', question: '' });
    const [enquirySent, setEnquirySent] = useState(false);

    // Dynamic values with fallbacks
    const clinicName = clinicConfig?.clinicName || 'Mehta Child Care Clinic';
    const tagline = clinicConfig?.tagline || 'Compassionate Pediatric Care & Child Wellness';
    const aboutClinic = clinicConfig?.aboutClinic || 'A specialized child care clinic dedicated to holistic pediatric medicine, newborn growth tracking, routine vaccinations, and gentle adolescent care.';
    const doctorName = clinicConfig?.doctorName || 'Dr. Sanjeev Mehta';
    const doctorTitle = clinicConfig?.doctorTitle || 'MBBS, MD (Pediatrics) — Senior Child Specialist';
    const doctorBio = clinicConfig?.doctorBio || `${doctorName} is a senior pediatrician with over ${clinicConfig?.experienceYears || 15} years of clinical excellence in newborn care, childhood infections, and growth nutrition. Dedicated to gentle, evidence-based healing for every child.`;
    const experienceYears = clinicConfig?.experienceYears || '15';
    const consultationsCount = clinicConfig?.consultationsCount || '25,000';
    const address = clinicConfig?.address || '104, Blossom Healthcare Plaza, MG Road, Pune 411001';
    const phone = clinicConfig?.phone || '+91 98220 41234';
    const email = clinicConfig?.email || 'contact@mehtachildcare.com';
    const whatsappRaw = clinicConfig?.whatsapp || phone;
    const whatsappNumber = whatsappRaw.replace(/[^0-9]/g, '');
    const fee = clinicConfig?.fee || 800;

    // Next Available Slot calculate karna
    const getNextAvailableSlot = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Agar Sunday/closed ho toh agla din le le
        if (tomorrow.getDay() === 0) {
            tomorrow.setDate(tomorrow.getDate() + 1);
        }

        const dateStr = tomorrow.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const slotTime = clinicConfig?.morningStart ? `${clinicConfig.morningStart} AM` : '10:00 AM';
        return `${dateStr} · ${slotTime}`;
    };

    const handleEnquiry = async (e) => {
        e.preventDefault();
        try {
            await fetch('http://localhost:5000/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enquiry)
            });
        } catch (err) { }
        setEnquirySent(true);
        setEnquiry({ name: '', phone: '', question: '' });
    };

    return (
        <>
            {/* 1. HERO BANNER */}
            <section className="bg-[#133E2F] text-white px-6 py-16 md:py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#E6C285] text-xs font-medium border border-white/10">
                            🍃 Personalized Consultations
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
                            {clinicConfig?.heroHeading || 'Gentle & trusted care,'} <br />
                            <span className="italic font-normal text-[#E8DFC8]">with {doctorName}</span>
                        </h1>
                        <p className="text-[#C5D5C8] text-base md:text-lg max-w-xl font-light leading-relaxed">
                            {aboutClinic}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs font-medium text-[#E8DFC8]/90">
                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15">{doctorTitle}</span>
                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15">{experienceYears}+ years of practice</span>
                            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15">{consultationsCount}+ consultations</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-3">
                            <button
                                onClick={onBookClick}
                                className="bg-[#C35A38] text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[#AA4B2B] flex items-center gap-2 shadow-lg transition"
                            >
                                Book an appointment (₹{fee}) <ArrowRight className="w-4 h-4" />
                            </button>
                            <a
                                href={`tel:${phone}`}
                                className="text-[#E8DFC8] border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-white/5 transition flex items-center gap-2"
                            >
                                <Phone className="w-4 h-4 text-[#C35A38]" /> {phone}
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-[#1C4E3D] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-3">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A7C2AF]">
                                <Clock className="w-4 h-4 text-[#E6C285]" /> Next Available Consultation
                            </div>
                            <h3 className="text-xl md:text-2xl font-serif font-bold text-white">
                                {clinicConfig?.nextAvailableSlot || getNextAvailableSlot()}
                            </h3>
                            <button
                                onClick={onBookClick}
                                className="w-full bg-[#C35A38] hover:bg-[#B34E2E] text-white text-xs font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
                            >
                                Book this slot <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="rounded-3xl overflow-hidden shadow-2xl h-64 md:h-72">
                            <img
                                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80"
                                alt="Pediatrician examining baby"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. ABOUT DOCTOR */}
            <section id="about" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
                <div className="bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-14 grid grid-cols-1 md:grid-cols-12 gap-10 items-center shadow-sm">

                    {/* Left Column: Doctor Photo with Floating Green Badge */}
                    <div className="md:col-span-5 flex justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-[#9B2226]">
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                                    alt={doctorName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80";
                                    }}
                                />
                                {/* <img
                                    src="/doctor.jpg"
                                    alt={doctorName}
                                    className="w-full h-full object-cover"
                                /> */}
                            </div>

                            {/* Exact Green Pill Badge at Bottom-Left */}
                            <div className="absolute -bottom-4 -left-3 bg-[#133E2F] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 max-w-[85%]">
                                <p className="font-serif font-bold text-xs text-[#E6C285] leading-tight">
                                    {doctorName}
                                </p>
                                <p className="text-[10px] text-[#C5D5C8] font-medium leading-tight mt-0.5">
                                    {doctorTitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bio, Credentials & Specialization Tags */}
                    <div className="md:col-span-7 space-y-5 pt-4 md:pt-0">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#C35A38]">
                            About The Doctor
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133E2F] leading-tight">
                            {clinicConfig?.aboutHeading || 'One doctor. Your whole healing journey.'}
                        </h2>
                        <p className="text-[#556758] text-sm md:text-base leading-relaxed">
                            {doctorBio}
                        </p>

                        {/* Dynamic Credentials Checkmarks */}
                        <div className="space-y-2 text-xs md:text-sm text-[#273B2E]">
                            {(clinicConfig?.credentials
                                ? clinicConfig.credentials.split('\n')
                                : [
                                    'BAMS — Pune University',
                                    'MD (Ayu) Kaychikitsa — Gold Medalist',
                                    '12+ years of clinical practice',
                                    '15,000+ consultations'
                                ]
                            ).map((cred, idx) => (
                                <p key={idx} className="flex items-center gap-2 font-medium">
                                    <span className="text-[#133E2F] font-bold">✓</span> {cred}
                                </p>
                            ))}
                        </div>

                        {/* Dynamic Specialization Chips (Settings se One-Per-Line connect) */}
                        <div className="pt-2">
                            <div className="flex flex-wrap gap-2">
                                {(clinicConfig?.specializations
                                    ? clinicConfig.specializations.split('\n')
                                    : [
                                        'Panchakarma & Detox',
                                        'Gut Health & Metabolism',
                                        'Hormonal Balance & PCOD',
                                        'Stress, Sleep & Nadi Therapy',
                                        'Skin & Hair Care',
                                        'Joint & Muscle Wellness'
                                    ]
                                )
                                    .filter((s) => s.trim().length > 0)
                                    .map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 rounded-full bg-[#FBE9E7] text-[#C35A38] text-xs font-semibold hover:bg-[#F8D7DA] transition"
                                        >
                                            {tag.trim()}
                                        </span>
                                    ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. WHAT WE TREAT (CLEAN PEDIATRIC SERVICES) */}
            <section id="treatments" className="py-16 px-6 max-w-7xl mx-auto space-y-8 scroll-mt-20">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#C35A38]">
                        What We Treat
                    </p>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#133E2F] mt-1">
                        Specialized clinical care for every child
                    </h2>
                    <p className="text-[#556758] text-sm mt-1">
                        At Mehta Child Care Clinic, consultations are focused on comprehensive pediatric wellness, gentle diagnosis, and preventive growth tracking.
                    </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Large Card */}
                    <div className="md:col-span-2 bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-sm flex flex-col justify-between">
                        <div className="h-64 overflow-hidden bg-[#FAF7F0]">
                            <img
                                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
                                alt="Child Care Consultation"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-serif font-bold text-[#133E2F]">
                                General Pediatric Consultation & Wellness
                            </h3>
                            <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                                Complete clinical assessment of acute childhood illnesses, recurrent fevers, cold and cough, ear infections, and vital organ wellness with evidence-based medications.
                            </p>
                        </div>
                    </div>

                    {/* Right Stacked Cards */}
                    <div className="space-y-6 flex flex-col justify-between">
                        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm hover:border-[#133E2F] transition">
                            <h3 className="text-lg font-serif font-bold text-[#133E2F]">
                                Newborn & Infant Care
                            </h3>
                            <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                                Gentle neonatal care, lactation and feeding support, physiological jaundice monitoring, umbilical hygiene, and newborn sleep patterns.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm hover:border-[#133E2F] transition">
                            <h3 className="text-lg font-serif font-bold text-[#133E2F]">
                                Vaccination & Immunization
                            </h3>
                            <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                                Routine and painless vaccination as per IAP (Indian Academy of Pediatrics) protocols with digital tracking and post-vaccination care.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm hover:border-[#133E2F] transition">
                        <h3 className="text-lg font-serif font-bold text-[#133E2F]">
                            Growth & Nutrition Charts
                        </h3>
                        <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                            Assessment of height, weight percentile, picky eating habits, iron/calcium deficiencies, and custom meal planning for active children.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm hover:border-[#133E2F] transition">
                        <h3 className="text-lg font-serif font-bold text-[#133E2F]">
                            Pediatric Asthma & Allergies
                        </h3>
                        <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                            Management of seasonal wheezing, dust/pollen allergies, eczema rashes, and childhood respiratory sensitivities.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl border border-[#E8DFC8] p-6 shadow-sm hover:border-[#133E2F] transition">
                        <h3 className="text-lg font-serif font-bold text-[#133E2F]">
                            Developmental Milestones
                        </h3>
                        <p className="text-xs text-[#556758] mt-2 leading-relaxed">
                            Timely screening of motor skills, speech development, social interaction, and early intervention advice for toddler milestones.
                        </p>
                    </div>
                </div>
            </section>

            {/* 4. CLINIC INFORMATION & ENQUIRY */}
            <section id="visit" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-6 bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-10 space-y-6 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#C35A38]">Visit Us</p>
                        <h2 className="text-3xl font-serif font-bold text-[#133E2F]">{clinicName}</h2>

                        <div className="space-y-4 text-xs md:text-sm text-[#4D5E50]">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#C35A38] shrink-0 mt-0.5" />
                                <p>{address}</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#C35A38] shrink-0 mt-0.5" />
                                <div>
                                    <p>Morning: {clinicConfig?.morningStart || '10:00'} – {clinicConfig?.morningEnd || '13:00'}</p>
                                    <p>Evening: {clinicConfig?.eveningStart || '16:00'} – {clinicConfig?.eveningEnd || '19:00'}</p>
                                    <p className="text-[#8B9B8E] text-[11px] mt-0.5">30-minute consultation slots · Consultation Fee: ₹{fee}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-[#C35A38] shrink-0" />
                                <p>{phone}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-[#C35A38] shrink-0" />
                                <p>{email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 border border-[#D8CEB6] rounded-xl text-xs font-semibold text-[#133E2F] hover:bg-[#F3EFE6] transition flex items-center gap-1.5"
                            >
                                <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-6 bg-white rounded-3xl border border-[#E8DFC8] p-8 md:p-10 space-y-4 shadow-sm">
                        <h3 className="text-xl font-serif font-bold text-[#133E2F]">Have a question first?</h3>
                        <p className="text-xs text-[#6B7C6E]">Send an enquiry — no booking needed yet.</p>

                        {enquirySent ? (
                            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 text-center space-y-2">
                                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                                <p className="font-semibold text-sm">Enquiry received!</p>
                                <p className="text-xs">Team at {clinicName} will contact you shortly.</p>
                                <button onClick={() => setEnquirySent(false)} className="text-xs underline font-semibold mt-2">
                                    Send another question
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEnquiry} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Your name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full name"
                                        value={enquiry.name}
                                        onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Phone</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="+91 98XXX XXXXX"
                                        value={enquiry.phone}
                                        onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#7E6F5F] mb-1">Your question</label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder={`e.g. Asking doctor a question about consultation...`}
                                        value={enquiry.question}
                                        onChange={(e) => setEnquiry({ ...enquiry, question: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-[#DCD5C4] text-xs focus:ring-2 focus:ring-[#133E2F]/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-[#648473] hover:bg-[#527161] text-white rounded-xl text-xs font-semibold transition"
                                >
                                    Send enquiry
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="bg-[#133E2F] text-white py-14 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
                    <div className="md:col-span-5 space-y-2">
                        <h4 className="font-serif font-bold text-base text-[#E6C285]">{clinicName}</h4>
                        <p className="text-[#A2B8A6] max-w-sm leading-relaxed">{tagline}</p>
                    </div>
                    <div className="md:col-span-3 space-y-2">
                        <p className="font-semibold text-white uppercase tracking-wider">Explore</p>
                        <ul className="space-y-1.5 text-[#B6C9BA]">
                            <li><button onClick={onBookClick} className="hover:text-white">Book an appointment</button></li>
                            <li><a href="#about" className="hover:text-white">About {doctorName}</a></li>
                            <li><a href="#treatments" className="hover:text-white">Treatments</a></li>
                            <li><a href="#visit" className="hover:text-white">Visit us</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-4 space-y-2">
                        <p className="font-semibold text-white uppercase tracking-wider">Contact</p>
                        <div className="space-y-1 text-[#B6C9BA]">
                            <p>{address}</p>
                            <p>{phone}</p>
                            <p>{email}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}