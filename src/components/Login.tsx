import React, { useState } from 'react';
import { LayoutDashboard, Lock, User, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      // Force reload to ensure session sync
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 border-r border-slate-200 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-center space-y-8 max-w-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
              <LayoutDashboard size={48} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">SARABURI</h1>
              <p className="text-xs text-slate-400 font-bold tracking-[0.3em] uppercase">Hotel Management System</p>
            </div>
          </div>
          
          <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 rotate-2">
            <div className="w-full h-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center p-8 text-left">
               <div className="space-y-4 w-full">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Security Status</p>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-1">Active Staff</p>
                    <div className="flex -space-x-2">
                        {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-900 rounded-xl">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 font-mono">System.log</p>
                    <div className="h-4 w-3/4 bg-slate-700/50 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-slate-700/50 rounded"></div>
                  </div>
               </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 Saraburi HMS - BCE Robust Edition</p>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Security Gateway</h2>
            <p className="text-slate-500 font-medium text-lg">Identity Verification Required</p>
          </div>

          <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in zoom-in-95">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Work Email</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hms.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 focus:bg-white transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credential</label>
                    <button type="button" className="text-xs font-bold text-slate-900 hover:underline">Support?</button>
                </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 focus:bg-white transition-all outline-none font-medium"
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Authenticating...
                </>
              ) : (
                'Verify & Enter'
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">
                System Access Restricted • Internal Use Only
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
