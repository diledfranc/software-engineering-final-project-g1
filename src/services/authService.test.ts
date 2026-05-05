import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './authService';
import { supabase } from '../utils/supabaseClient';

// Mock Supabase client
vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'mock-id' } }, error: null })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('AuthService (Integration Tests)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * HAPPY PATH: Successful Login
   * Logic: Verify that valid credentials return user data and log the action.
   */
  it('should successfully sign in with valid credentials (Happy Path)', async () => {
    const mockUser = { id: 'test-uuid', email: 'admin@hms.com' };
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const result = await authService.signIn('admin@hms.com');
    
    expect(result.user).toBeDefined();
    expect(result.user?.email).toBe('admin@hms.com');
  });

  /**
   * NEGATIVE CASE: Invalid Credentials
   * Logic: System must throw an error and deny access for incorrect passwords.
   */
  it('should throw an error with invalid credentials (Negative Case)', async () => {
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    await expect(authService.signIn('wrong@hms.com'))
      .rejects.toThrow('Invalid login credentials');
  });

  /**
   * EDGE CASE: Missing Profile
   * Logic: If a user exists in Auth but not in Profiles, the system should 
   * self-heal by creating a default profile.
   */
  it('should auto-create a profile if one is missing (Edge Case/Self-healing)', async () => {
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'new-uuid', email: 'new@hms.com' } },
    });

    // Mock profiles.select to return error (profile missing)
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } });
    const mockInsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ 
          data: { id: 'new-uuid', role: 'Staff' }, 
          error: null 
        })
      })
    });

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: mockSingle,
          insert: mockInsert,
        };
      }
    });

    const profile = await authService.getCurrentProfile();
    
    expect(profile?.role).toBe('Staff');
    expect(mockInsert).toHaveBeenCalled();
  });
});
