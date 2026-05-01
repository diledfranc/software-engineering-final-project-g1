import React, { useState } from 'react';
import { bookingService } from '../services/bookingService';
import { Room } from '../types';

export const BookingForm: React.FC = () => {
  const [guestId, setGuestId] = useState('G001');
  const [nights, setNights] = useState(1);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Mock room for testing (Entity)
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
      setMessage(`USER_ERR: ${validation.error}`);
    } else {
      setIsError(false);
      const maskedId = bookingService.maskGuestId(guestId);
      const total = bookingService.calculateTotal(mockRoom.price, nights);
      setMessage(`SUCCESS: Booking confirmed for ${maskedId}. Total: ฿${total}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Hotel Booking System</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Room Status:</label>
        <select 
          value={mockRoom.status}
          onChange={(e) => setMockRoom({...mockRoom, status: e.target.value as any})}
          className="w-full p-2 border rounded"
        >
          <option value="Ready">Ready</option>
          <option value="Dirty">Dirty</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Nights:</label>
        <input 
          type="number" 
          value={nights}
          onChange={(e) => setNights(parseInt(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <button 
        onClick={handleBooking}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>

      {message && (
        <div className={`p-3 rounded text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
};
