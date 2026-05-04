import type { Room } from '../types';
import { supabase } from '../utils/supabaseClient';

class BookingService {
  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];

    const { count: totalGuests } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    const { count: roomsAvailable } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    const { count: pendingCheckouts } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .lte('check_out', today);

    const { count: dirtyRooms } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('housekeeping_status', 'dirty');

    return {
      totalGuests: totalGuests || 0,
      roomsAvailable: roomsAvailable || 0,
      pendingCheckouts: pendingCheckouts || 0,
      housekeepingTasks: dirtyRooms || 0
    };
  }

  async createBooking(bookingData: any) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();
    if (error) throw error;
    
    if (bookingData.room_id) {
        await supabase
          .from('rooms')
          .update({ status: 'occupied' })
          .eq('id', bookingData.room_id);
    }
    
    return data;
  }

  validateBooking(room: Room, nights: number): { success: boolean; error?: string } {
    if (room.status !== 'Ready') {
      return { success: false, error: `Room ${room.id} is currently ${room.status}` };
    }
    if (nights < 1) {
      return { success: false, error: "Minimum stay is 1 night" };
    }
    return { success: true };
  }

  validateBookingDates(checkInDate: string, checkOutDate: string): void {
    if (!checkInDate || !checkOutDate) {
      throw new Error("Please select both check-in and check-out dates.");
    }
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      throw new Error("Check-out date must be after check-in date.");
    }
  }

  maskGuestId(guestId: string): string {
    const cleanedId = guestId.trim();
    const isThaiNationalId = /^\d{13}$/.test(cleanedId);
    const isPassport = /^[A-Z0-9]{6,9}$/i.test(cleanedId);

    if (isThaiNationalId) {
      return `*********${cleanedId.slice(-4)}`;
    }
    if (isPassport) {
      return `${cleanedId.slice(0, 2).toUpperCase()}****${cleanedId.slice(-2).toUpperCase()}`;
    }
    return "****";
  }

  calculateTotal(price: number, nights: number): number {
    return price * nights;
  }
}

export const bookingService = new BookingService();
