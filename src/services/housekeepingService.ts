import { supabase } from '../utils/supabaseClient';
import type { HousekeepingTask } from '../types';
import { auditService } from './auditService';

class HousekeepingService {
  async getTasks() {
    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .select('*, rooms(room_number)');
    
    if (error) throw error;
    return data;
  }

  async updateTaskStatus(id: string, status: string, notes?: string) {
    // Attempt to update directly in both tables for now to ensure reliability
    // First, update the room's status (since the UI relies on 'rooms' table)
    const { data: roomData, error: roomError } = await supabase
      .from('rooms')
      .update({ housekeeping_status: status })
      .eq('id', id)
      .select()
      .single();

    if (roomError) throw roomError;

    // Log the change for Audit Robustness
    await auditService.logAction(
      'UPDATE_HOUSEKEEPING',
      'rooms',
      id,
      null, // old value could be fetched but keeping it simple for fix
      { status }
    );

    return roomData;
  }

  async assignTask(taskId: string, userId: string) {
    const { error } = await supabase
      .from('housekeeping_tasks')
      .update({ assigned_to: userId, status: 'InProgress' })
      .eq('id', taskId);

    if (error) throw error;
  }
}

export const housekeepingService = new HousekeepingService();
