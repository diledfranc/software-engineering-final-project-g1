import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Room } from '../types';
import { User, Phone, Mail, Calendar, Settings, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const BookingForm: React.FC = () => {
  const [guestId] = useState('G' + Math.floor(Math.random() * 999).toString().padStart(3, '0'));
  const [guestName, setGuestName] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [nights, setNights] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [mockRoom, setMockRoom] = useState<Room>({
    id: 'room-101',
    roomNumber: '101',
    type: 'Single',
    status: 'Ready',
    price: 1500
  });

  const handleBooking = async () => {
    setIsLoading(true);
    const validation = bookingService.validateBooking(mockRoom, nights);
    
    if (!validation.success) {
      setIsError(true);
      setMessage('USER_ERR: ' + validation.error);
      setIsLoading(false);
      return;
    }

    try {
      const maskedId = bookingService.maskGuestId(guestId);
      const total = bookingService.calculateTotal(mockRoom.price, nights);

      // Call Supabase service logic
      await bookingService.createBooking({
        guest_name: guestName || 'Walk-in Guest',
        room_id: mockRoom.id,
        num_guests: 1,
        status: 'confirmed'
      });

      setIsError(false);
      setMessage('SUCCESS: Booking saved to your Supabase "bookings" table!');
    } catch (err: any) {
      setIsError(true);
      setMessage('SYSTEM_ERR: ' + (err.message || 'Failed to sync with Supabase'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='px-8 py-6 border-b bg-slate-50/50 flex items-center gap-3'>
        <div className='p-2 bg-blue-100 rounded-lg text-blue-600'>
          <Calendar size={20} />
        </div>
        <h2 className='text-xl font-bold text-slate-900'>Create New Booking</h2>
      </div>

      <div className='p-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>Guest Name</label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input 
                  type='text' 
                  placeholder='Enter guest name' 
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none' 
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>Phone Number</label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input type='text' placeholder='Enter phone number' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none' />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <input type='email' placeholder='Enter email address' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none' />
              </div>
            </div>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>Number of Guests</label>
              <select className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer'>
                <option>1</option><option>2</option><option>3</option><option>4+</option>
              </select>
            </div>
          </div>

          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-semibold text-slate-700 mb-2'>Room Type</label>
              <div className='relative'>
                <Settings className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
                <select className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer'>
                    <option>Standard Room</option><option>Deluxe Room</option><option>Suite</option>
                </select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
               <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>Check-In</label>
                  <input 
                    type='date' 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none' 
                  />
               </div>
               <div>
                  <label className='block text-sm font-semibold text-slate-700 mb-2'>Check-Out</label>
                  <input type='date' className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none' />
               </div>
            </div>
            <div className='p-4 bg-blue-50 rounded-xl border border-blue-100 space-y-4 shadow-inner'>
                <p className='text-[10px] font-bold text-blue-600 uppercase tracking-widest'>Logic Control (BCE Pattern)</p>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-[10px] font-bold text-slate-500 uppercase'>Status</label>
                        <select value={mockRoom.status} onChange={(e) => setMockRoom({...mockRoom, status: e.target.value as any})} className='w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold font-mono cursor-pointer'>
                          <option value='Ready'>Ready</option>
                          <option value='Occupied'>Occupied</option>
                          <option value='Cleaning'>Cleaning</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-[10px] font-bold text-slate-500 uppercase'>Stay</label>
                        <div className='flex items-center gap-2'>
                          <input type='number' value={nights} onChange={(e) => setNights(Number(e.target.value))} className='w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold font-mono outline-none focus:ring-1 focus:ring-blue-500' />
                          <span className='text-[10px] font-bold text-slate-400'>NIGHTS</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mt-8 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300 ${isError ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-green-50 border border-green-100 text-green-700'}`}>
            {isError ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span className='text-sm font-semibold font-mono tracking-tight'>{message}</span>
          </div>
        )}

        <button 
          onClick={handleBooking}
          disabled={isLoading}
          className='mt-8 w-full bg-slate-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group'
        >
          {isLoading ? (
            <Loader2 className='animate-spin' size={20} />
          ) : (
            <>
              <MessageSquare size={18} className='group-hover:translate-x-1 transition-transform' />
              Confirm Booking & Sync to Supabase
            </>
          )}
        </button>
      </div>
    </div>
  );
};