import React, { useState } from 'react';
import { Search, MapPin, User, LogIn, CheckCircle2, AlertCircle, Loader2, Calendar, Coffee, CreditCard, ShieldCheck } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import { supabase } from '../utils/supabaseClient';

export const CheckIn = () => {
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSearch = async () => {
    if (!bookingId.trim()) return;
    setSearching(true);
    setStatus('idle');
    try {
      const input = bookingId.trim();
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
      
      let query = supabase.from('bookings').select('*');
      
      if (isUuid) {
        // If it's a UUID, search ONLY by the primary key ID
        query = query.eq('id', input);
      } else {
        // If it's NOT a UUID (like A-00001), search ONLY by custom_id
        query = query.eq('custom_id', input.toUpperCase());
      }

      const { data, error } = await query.maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('No reservation found matching that ID');
      
      setBooking(data);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Error finding reservation');
      setBooking(null);
    } finally {
      setSearching(false);
    }
  };

  const handleFinalCheckIn = async () => {
    if (!booking) return;
    setLoading(true);
    try {
      // 1. Update Booking Status -> in-house
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'in-house' })
        .eq('id', booking.id);

      if (bookingError) throw bookingError;

      // 2. Update Room Status -> occupied
      if (booking.room_id) {
        const { error: roomError } = await supabase
          .from('rooms')
          .update({ status: 'Occupied' })
          .eq('id', booking.room_id);
        if (roomError) throw roomError;
      }

      setStatus('success');
      setMessage(`Check-In Complete! Guest is now In-House.`);
      setBooking({ ...booking, status: 'in-house' });
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to complete check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Arrivals & Check-In</h2>
          </div>
          <p className="text-slate-500 font-medium ml-0">Verify identity and issue room keys for arriving guests.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Live: Supabase Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Search Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 -z-10"></div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Booking ID Search</label>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Enter ID (e.g. 127)"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-slate-900"
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={searching}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {searching ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
                Locate Reservation
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 border animate-in slide-in-from-top-2 duration-300 ${status === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
              {status === 'error' ? <AlertCircle size={18} className="mt-0.5" /> : <CheckCircle2 size={18} className="mt-0.5" />}
              <p className="text-xs font-bold leading-tight">{message}</p>
            </div>
          )}
        </div>

        {/* Guest Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {booking ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">
                      {booking.guest_name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-black">{booking.guest_name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">
                        <span className="px-2 py-0.5 bg-white/10 rounded-md">REF: {booking.custom_id || booking.id.toString().slice(0, 8)}</span>
                        <span className={`px-2 py-0.5 rounded-md ${booking.status === 'in-house' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {booking.status === 'confirmed' ? 'RESERVATION CONFIRMED' : booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ASSIGNED ROOM</p>
                    <p className="text-2xl font-black text-blue-400">{booking.room_id || 'UNASSIGNED'}</p>
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Calendar size={20}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STAY PERIOD</p>
                        <p className="text-sm font-bold text-slate-700">
                          {(booking.check_in || booking.check_in_date) ? new Date(booking.check_in || booking.check_in_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} — {(booking.check_out || booking.check_out_date) ? new Date(booking.check_out || booking.check_out_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={20}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VALIDATION</p>
                        <p className="text-sm font-bold text-slate-700 italic">Identity Verified (ID: {booking.guest_id || 'On File'})</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><CreditCard size={20}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYMENT STATUS</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-700">฿{booking.total_amount?.toLocaleString()}</p>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded tracking-widest uppercase">PAID</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><Coffee size={20}/></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STAY DETAILS</p>
                        <p className="text-sm font-bold text-slate-700">{booking.num_guests} Guests • Non-Smoking</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                  <button 
                    onClick={handleFinalCheckIn}
                    disabled={loading || booking.status === 'in-house'}
                    className={`flex items-center justify-center gap-3 w-full max-w-md py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 ${booking.status === 'in-house' ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                    {booking.status === 'in-house' ? 'GUEST IS NOW IN-HOUSE' : 'CONFIRM ARRIVAL & ISSUE KEY'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-6 bg-white rounded-full shadow-sm text-slate-300">
                <User size={64} strokeWidth={1} />
              </div>
              <div>
                <h4 className="text-slate-900 font-black uppercase tracking-widest text-sm">Guest Profile Awaiting</h4>
                <p className="text-slate-400 text-sm max-w-[300px] mx-auto mt-2">Enter a valid Booking ID in the search panel to retrieve reservation details and finalize check-in.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
