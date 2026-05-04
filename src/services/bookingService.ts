import type { Room } from '../types';
import { supabase } from '../utils/supabaseClient';

class BookingService {
  /**
   * Ported Logic from Python BookingManager (BCE - Control Layer)
   * Implements Guard Clauses and PDPA Masking logic.
   */

  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getDashboardStats() {
    const { count: totalGuests, error: err1 } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    const { count: roomsAvailable, error: err2 } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available');

    if (err1 || err2) throw err1 || err2;

    return {
      totalGuests: totalGuests || 0,
      roomsAvailable: roomsAvailable || 0,
      pendingCheckouts: 7, // Mocked for now
      housekeepingTasks: 5  // Mocked for now
    };
  }

  async createBooking(bookingData: any) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select();
    if (error) throw error;
    return data;
  }

  validateBooking(room: Room, nights: number): { success: boolean; error?: string } {
    // Guard Clause: Check room status
    if (room.status !== 'Ready') {
      return { success: false, error: `Room ${room.roomNumber} is currently ${room.status}` };
    }

    // Guard Clause: Minimum stay (Boundary Case from previous tests)
    if (nights < 1) {
      return { success: false, error: "Minimum stay is 1 night" };
    }

    return { success: true };
  }

  maskGuestId(guestId: string): string {
    // PDPA Masking logic: G001 -> G0***
    if (guestId.length <= 2) return guestId;
    return guestId.substring(0, 2) + '*'.repeat(3);
  }

  calculateTotal(price: number, nights: number): number {
    return price * nights;
  }
}

export const bookingService = new BookingService();
