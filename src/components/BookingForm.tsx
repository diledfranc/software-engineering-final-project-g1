import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import type { Room } from '../types';
import { User, Phone, Mail, Calendar, Home, MessageSquare, CheckCircle, AlertCircle, Loader2, MapPin, Globe, CreditCard, Tag, FileText, Send, X, Save } from 'lucide-react';

export const BookingForm: React.FC<{ onBook?: () => void }> = ({ onBook }) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [nationality, setNationality] = useState('');
  
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  
  const [roomType, setRoomType] = useState('Standard Room');
  const [roomNumber, setRoomNumber] = useState('101');
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [deposit, setDeposit] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discountCode, setDiscountCode] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock available rooms based on type
  const availableRooms = {
    'Standard Room': ['101', '102', '103', '104', '201', '202'],
    'Deluxe Room': ['301', '302', '303', '304'],
    'Suite': ['401', '402']
  };

  const validateForm = () => {
    if (!guestName.trim()) return 'Guest Name is required';
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid Email format';
    if (!phone.match(/^\+?[0-9]{10,15}$/)) return 'Invalid Phone (10-15 digits required)';
    if (!checkIn) return 'Check-In date is required';
    if (!checkOut) return 'Check-Out date is required';
    if (new Date(checkOut) <= new Date(checkIn)) return 'Check-Out must be after Check-In';
    return null;
  };

  const handleBooking = async () => {
    const error = validateForm();
    if (error) {
      setIsError(true);
      setMessage(`VALIDATION_ERR: ${error}`);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch full room price/details if needed, here we just use defaults
      const response = await bookingService.createBooking({
        guest_name: guestName,
        guest_id: phone, // Using phone as fallback ID
        phone: phone,    // Explicitly sending phone
        email: email,    // Explicitly sending email
        room_id: roomNumber,
        status: 'confirmed',
        check_in: checkIn,
        check_out: checkOut,
        check_in_date: checkIn, // Map to both possible column names
        check_out_date: checkOut,
        num_guests: adults + children,
        total_amount: deposit > 0 ? deposit : 2500 // Fallback price
      });

      // Extract data safely
      const createdBooking = Array.isArray(response) ? response[0] : response;
      const bookingId = createdBooking?.id || 'NEW';
      const customId = createdBooking?.custom_id || bookingId;

      setIsError(false);
      setMessage(`SUCCESS: Booking #${customId} created for Room ${roomNumber}! WRITE DOWN THIS ID FOR CHECK-IN.`);
      
      // Store result for rendering
      (window as any)._lastBooking = createdBooking;
      
      if (onBook) onBook();
    } catch (err: any) {
      setIsError(true);
      setMessage('SYSTEM_ERR: ' + (err.message || 'Failed to sync with Supabase'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm'>
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200'>
            <Calendar size={24} />
          </div>
          <div>
            <h2 className='text-2xl font-black text-slate-900'>New Reservation</h2>
            <p className='text-sm text-slate-500 font-medium'>Complete the details to secure the booking.</p>
          </div>
        </div>
        <div className='flex gap-2'>
          <button className='p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all'>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content Area */}
        <div className='lg:col-span-2 space-y-6'>
          
          {/* Guest Profile Section */}
          <section className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2'>
              <User size={18} className='text-slate-400' />
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Guest Profile <span className='text-red-500'>*</span></h3>
            </div>
            <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Full Name</label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={16} />
                  <input type='text' required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder='Guest Full Name' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Email Address</label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={16} />
                  <input type='email' required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email@example.com' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Phone Number</label>
                <div className='relative'>
                  <Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={16} />
                  <input type='tel' required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='+66 123 4567' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Nationality</label>
                <div className='relative'>
                  <Globe className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={16} />
                  <input type='text' value={nationality} onChange={(e) => setNationality(e.target.value)} placeholder='e.g. Thai, Japanese' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
              </div>
              <div className='md:col-span-2 space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Residential Address</label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3 text-slate-300' size={16} />
                  <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Full residential address' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none' />
                </div>
              </div>
            </div>
          </section>

          {/* Stay Details Section */}
          <section className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2'>
              <Calendar size={18} className='text-slate-400' />
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Stay Details</h3>
            </div>
            <div className='p-6 space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Check-In Date</label>
                  <input type='date' min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Check-Out Date</label>
                  <input type='date' min={checkIn || today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none' />
                </div>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Adults</label>
                  <input type='number' min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none' />
                </div>
                <div className='space-y-1'>
                  <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Children</label>
                  <input type='number' min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none' />
                </div>
              </div>
            </div>
          </section>

          {/* Special Requests */}
          <section className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2'>
              <MessageSquare size={18} className='text-slate-400' />
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Special Requests</h3>
            </div>
            <div className='p-6'>
              <textarea 
                rows={3} 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder='Dietary requirements, early check-in, room preferences...' 
                className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none resize-none' 
              />
            </div>
          </section>
        </div>

        {/* Sidebar - Availability & Financials */}
        <div className='space-y-6'>
          {/* Room Assignment Card */}
          <section className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2'>
              <Home size={18} className='text-slate-400' />
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Room Assignment</h3>
            </div>
            
            <div className='p-6 space-y-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Room Type</label>
                <select 
                  value={roomType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setRoomType(newType);
                    setRoomNumber(availableRooms[newType as keyof typeof availableRooms][0]);
                  }}
                  className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all outline-none cursor-pointer'
                >
                  <option>Standard Room</option>
                  <option>Deluxe Room</option>
                  <option>Suite</option>
                </select>
              </div>

              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1'>Room Number</label>
                <select 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className='w-full px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-black focus:ring-2 focus:ring-blue-600 outline-none cursor-pointer shadow-sm'
                >
                  {availableRooms[roomType as keyof typeof availableRooms].map(num => (
                    <option key={num} value={num}>Room {num}</option>
                  ))}
                </select>
              </div>

              <div className='p-4 bg-slate-50 rounded-2xl border border-slate-100'>
                <div className='flex justify-between items-center mb-2'>
                  <span className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Availability</span>
                  <span className='text-[10px] font-black text-emerald-600 uppercase tracking-widest'>{availableRooms[roomType as keyof typeof availableRooms].length} Left</span>
                </div>
                <div className='h-1.5 w-full bg-slate-200 rounded-full overflow-hidden'>
                  <div 
                    className='h-full bg-blue-600 rounded-full transition-all duration-500' 
                    style={{ width: `${(availableRooms[roomType as keyof typeof availableRooms].length / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* Payment & Financials */}
          <section className='bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden'>
            <div className='px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2'>
              <CreditCard size={18} className='text-slate-400' />
              <h3 className='text-sm font-black text-slate-900 uppercase tracking-widest'>Financials</h3>
            </div>
            <div className='p-6 space-y-4'>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Deposit Amount</label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs'>฿</span>
                  <input type='number' value={deposit} onChange={(e) => setDeposit(Number(e.target.value))} className='w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none' />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className='w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none cursor-pointer'>
                  <option>Cash</option>
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className='space-y-1'>
                <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Discount Code</label>
                <div className='relative'>
                  <Tag className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={16} />
                  <input type='text' value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder='PROMO...' className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none' />
                </div>
              </div>
            </div>
          </section>

          {/* Action Area */}
          <div className='space-y-3 pt-4'>
            {message && (
              <div className={`p-4 rounded-xl flex items-start gap-3 border shadow-lg animate-in slide-in-from-top-2 duration-300 ${isError ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-600 border-emerald-500 text-white'}`}>
                {isError ? <AlertCircle size={24} className="shrink-0" /> : <CheckCircle size={24} className="shrink-0" />}
                <div>
                  <p className={`text-sm font-black leading-tight ${isError ? '' : 'text-white'}`}>{message}</p>
                  {!isError && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] font-bold opacity-90 text-emerald-100 uppercase tracking-widest leading-none">Copy & Paste this ID for Check-In:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-white/20 px-2 py-1 rounded text-lg font-mono tracking-tighter select-all border border-white/30 backdrop-blur-sm">
                          {(window as any)._lastBooking?.custom_id || (window as any)._lastBooking?.id || 'PENDING'}
                        </code>
                      </div>
                    </div>
                  )}
                  {!isError && <p className="text-[10px] mt-2 font-bold opacity-90 text-emerald-100 uppercase tracking-widest">Database entry synced successfully</p>}
                </div>
              </div>
            )}
            
            <button 
              onClick={handleBooking}
              disabled={isLoading}
              className='w-full flex items-center justify-center gap-3 p-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50'
            >
              {isLoading ? <Loader2 className='animate-spin' size={20} /> : <CheckCircle size={20} />}
              CREATE BOOKING FOR ROOM {roomNumber}
            </button>
            
            <div className='grid grid-cols-2 gap-3'>
              <button className='flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all'>
                <Save size={14} />
                Save Draft
              </button>
              <button className='flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all'>
                <Send size={14} />
                Send Email
              </button>
            </div>
            
            <button className='w-full p-3 text-slate-400 hover:text-red-500 font-bold text-xs transition-all italic'>
              Cancel Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
