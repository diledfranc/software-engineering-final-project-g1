import { Room, Booking } from '../types';

class BookingService {
  /**
   * Ported Logic from Python BookingManager (BCE - Control Layer)
   * Implements Guard Clauses and PDPA Masking logic.
   */

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
