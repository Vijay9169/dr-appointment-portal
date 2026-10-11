import React, { useState } from 'react';

export default function PatientDirectory({ appointments = [] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // MongoDB appointments se unique real patients extract karna
  const patientMap = new Map();
  appointments.forEach((item) => {
    if (!patientMap.has(item.phone)) {
      patientMap.set(item.phone, {
        name: item.patientName,
        phone: item.phone,
        email: item.email || '—',
        type: item.patientType || 'New Patient',
        since: item.date || 'Recent'
      });
    }
  });

  const realPatients = Array.from(patientMap.values());

  const filtered = realPatients.filter((p) => {
    const matchFilter = filter === 'All' || p.type.toLowerCase().includes(filter.toLowerCase());
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E8DFC8] p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-center">
        <input
          type="text"
          placeholder="Search real patient name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3.5 py-2 rounded-xl border border-[#DCD5C4] text-xs"
        />
        <div className="flex gap-1.5 text-xs">
          {['All', 'New', 'Returning'].map((fl) => (
            <button
              key={fl}
              onClick={() => setFilter(fl)}
              className={`px-3 py-1.5 rounded-lg font-semibold ${
                filter === fl ? 'bg-[#133E2F] text-white' : 'bg-[#FAF7F0] text-[#6E7E70]'
              }`}
            >
              {fl}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#8C9C8F] border border-dashed border-[#E8DFC8] rounded-xl">
            Abhi koi patient database me nahi hai. Appointment book hone par yahan auto-add hoga.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-[#2A392D]">
            <thead className="bg-[#FAF7F0] text-[#8C7D6B] font-semibold border-b border-[#E8DFC8]">
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Appointment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filtered.map((p, i) => (
                <tr key={i} className="hover:bg-[#FAF7F0]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#EBF2ED] text-[#133E2F] flex items-center justify-center font-bold text-[10px]">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-[10px] text-[#8C9C8F]">{p.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">{p.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.type.includes('New') ? 'bg-[#FBE9E7] text-[#C35A38]' : 'bg-[#EBF2ED] text-[#133E2F]'
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#8C7D6B]">{p.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}