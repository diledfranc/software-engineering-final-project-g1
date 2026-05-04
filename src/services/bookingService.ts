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

    const { count: totalGuests, error: err1 } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    const { count: roomsAvailable, error: err2 } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    const { count: pendingCheckouts, error: err3 } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .lte('check_out', today);

    const { count: dirtyRooms, error: err4 } = await supabase
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
    if (room.status !== 'Ready' && room.status !== 'available') {
      return { success: false, error: `Room ${room.id} is currently ${room.status}` };
    }
    if (nights < 1) {
      return { success: false, error: "Minimum stay is 1 night" };
    }
    return { success: true };
  }

  calculateTotal(price: number, nights: number): number {
    return price * nights;
  }
}

export const bookingService = new BookingService();
