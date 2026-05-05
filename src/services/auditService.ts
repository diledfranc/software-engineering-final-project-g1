import { supabase } from '../utils/supabaseClient';
import type { AuditLog } from '../types';

class AuditService {
  async logAction(action: string, entityType: string, entityId: string, oldValue?: any, newValue?: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    const entry = {
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_value: oldValue,
      new_value: newValue,
      user_id: user?.id,
      timestamp: new Date().toISOString()
    };

    const { error } = await supabase
      .from('audit_logs')
      .insert([entry]);

    if (error) {
      console.error('Audit Log Error:', error);
    }
  }

  async getLogs() {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export const auditService = new AuditService();
