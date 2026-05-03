import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Room } from '../types';
import { User, Phone, Mail, Calendar, Settings, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';

export const BookingForm: React.FC<{ onBook: () => void }> = ({ onBook }) => {
  const [guestId] = useState('G001');
  const [nights, setNights] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [mockRoom, setMockRoom] = useState<Room>({
    id: 'room-101',
    roomNumber: '101',
    type: 'Single',
    status: 'Ready',
    price: 1500
  });

  const handleBooking = () => {
    const validation = bookingService.validateBooking(mockRoom, nights);
    
    if (!validation.success) {
      setIsError(true);
      setMessage('USER_ERR: ' + validation.error);
    } else {
      setIsError(false);
      const maskedId = bookingService.maskGuestId(guestId);
      const total = bookingService.calculateTotal(mockRoom.price, nights);
      setMessage('SUCCESS: Booking confirmed for ' + maskedId + '. Total: ฿' + total);
      onBook();
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
                <input type='text' placeholder='Enter guest name' className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none' />
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
                  <input type='date' className='w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none' />
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
                            <option value='Ready'>Ready</option><option value='Dirty'>Dirty</option><option value='Occupied'>Occupied</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-[10px] font-bold text-slate-500 uppercase'>Nights</label>
                        <input type='number' min='1' value={nights} onChange={(e) => setNights(parseInt(e.target.value))} className='w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold font-mono' />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={'mt-8 p-4 rounded-xl flex items-center gap-3 border ' + (!isError ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800')}>
            {!isError ? <CheckCircle size={20} className='text-emerald-500' /> : <AlertCircle size={20} className='text-rose-500' />}
            <span className='font-bold text-sm tracking-tight'>{message}</span>
          </div>
        )}

        <div className='mt-10 flex gap-4'>
          <button onClick={handleBooking} className='flex-[2] bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg uppercase tracking-widest text-xs'>Confirm Booking</button>
          <button className='flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-50 uppercase tracking-widest text-xs'>Cancel</button>
        </div>
      </div>
    </div>
  );
};