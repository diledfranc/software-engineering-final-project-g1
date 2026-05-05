import { supabase } from '../utils/supabaseClient';
import type { UserProfile, UserRole } from '../types';
import { auditService } from './auditService';

class AuthService {
  async signIn(email: string) {
    // Note: Standard Supabase Email Auth (OTP or Password)
    // For this scenario, we use the standard signInWithPassword approach
    // Password should be collected from the UI
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'managed_password_here' // In real app, this comes from user input
    });
    
    if (error) throw error;
    
    // Log the successful login
    await auditService.logAction('LOGIN', 'User', data.user?.id || 'unknown', { email });
    return data;
  }

  async signOut() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await auditService.logAction('LOGOUT', 'User', user.id);
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async signUp(email: string, name: string, role: UserRole) {
    // Standard Supabase SignUp
    // In a real management system, this might use the Admin API (auth.admin.createUser)
    // For this prototype, we'll use the standard signUp which triggers a verification email or auto-confirms based on project settings
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'InitialPassword123!', // Standard initial password
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
        // We no longer manually insert to 'profiles'. 
        // The Database Trigger 'on_auth_user_created' handles this automatically 
        // to ensure UUID consistency and avoid foreign key violations.
        
        await auditService.logAction('CREATE_USER', 'User', data.user.id, { email, role });

        // If a specific role was requested (other than default 'Staff'), update it now
        if (role !== 'Staff') {
            await this.updateUserRole(data.user.id, role);
        }
    }

    return data;
  }

  async getCurrentProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
        // Auto-create profile if auth exists but profile doesn't (Self-healing Boundary)
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{ 
                id: user.id, 
                email: user.email, 
                name: user.email?.split('@')[0], 
                role: 'Staff' 
            }])
            .select()
            .single();
        
        if (createError) return null;
        return newProfile;
    }
    return data;
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async updateUserRole(userId: string, role: UserRole) {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
  }

  hasPermission(currentRole: UserRole, requiredRoles: UserRole[]): boolean {
    return requiredRoles.includes(currentRole);
  }
}

export const authService = new AuthService();
