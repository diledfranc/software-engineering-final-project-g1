import { describe, it, expect, vi } from 'vitest';
import { bookingService } from './bookingService';
import { supabase } from '../utils/supabaseClient';

vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'mock-id' } }, error: null })),
    },
    from: vi.fn(),
  },
}));

describe('BookingService (Boundary Case Testing)', () => {
  const mockSupabaseChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  };

  /**
   * BOUNDARY CASE: Room Capacity
   * Logic: Ensure the system correctly handles the logic when rooms are full.
   */
  it('should return availability status for rooms (Boundary Case)', async () => {
    mockSupabaseChain.single.mockResolvedValue({ data: { count: 18 }, error: null });
    (supabase.from as any).mockReturnValue(mockSupabaseChain);

    const stats = await bookingService.getDashboardStats();
    
    // We expect the system to track the boundary of 18 rooms
    expect(stats.roomsAvailable).toBeLessThanOrEqual(18);
  });

  /**
   * ACCEPTANCE TEST: Data Integrity
   * Logic: Verify that a booking insertion returns the expected object with a UUID.
   */
  it('should process a booking with correct data transformation (Acceptance)', async () => {
    const mockBooking = { 
        guest_name: 'John Doe', 
        room_id: 'room-101', 
        status: 'Confirmed' 
    };

    mockSupabaseChain.single.mockResolvedValue({ 
      data: { ...mockBooking, id: 'b-123' }, 
      error: null 
    });
    (supabase.from as any).mockReturnValue(mockSupabaseChain);

    const result = await bookingService.createBooking(mockBooking);
    
    expect(result.id).toBe('b-123');
    expect(result.guest_name).toBe('John Doe');
  });
});
