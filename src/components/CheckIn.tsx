import React, { useState } from 'react';
import { Search, MapPin, User, LogIn, CheckCircle2 } from 'lucide-react';

export const CheckIn = () => {
  const [bookingId, setBookingId] = useState('');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Guest Check-In</h2>
        <p className="text-slate-500">Scan QR code or enter booking ID to finalize room assignment.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="relative">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Booking Reference</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="Enter Booking ID (e.g., BK-7729)"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 outline-none"
              />
            </div>
            <button className="px-8 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Search</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40">
           <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <User size={40} className="text-slate-300" />
              <p className="text-slate-400 font-medium">Guest Identity Info<br/>(PDPA Protected)</p>
           </div>
           <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <MapPin size={40} className="text-slate-300" />
              <p className="text-slate-400 font-medium">Room Assignment<br/>Details</p>
           </div>
        </div>
      </div>
    </div>
  );
};
