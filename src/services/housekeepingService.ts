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

  async updateTaskStatus(taskId: string, status: string, notes?: string) {
    const { data: oldTask } = await supabase
      .from('housekeeping_tasks')
      .select('*')
      .eq('id', taskId)
      .single();

    const { data, error } = await supabase
      .from('housekeeping_tasks')
      .update({ status, notes, updated_at: new Date().toISOString() })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;

    // Log the change for Audit Robustness
    await auditService.logAction(
      'UPDATE_TASK_STATUS',
      'housekeeping_task',
      taskId,
      oldTask,
      data
    );

    // If completed, update room status to Ready
    if (status === 'Completed' && data.room_id) {
       await supabase
         .from('rooms')
         .update({ status: 'Ready' })
         .eq('id', data.room_id);
    }

    return data;
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
