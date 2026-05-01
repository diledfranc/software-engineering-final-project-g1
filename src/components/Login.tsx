import React from 'react';
import { LayoutDashboard, Lock, User, Eye, EyeOff } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter">HOTEL</h1>
              <p className="text-xs text-slate-400 font-bold tracking-[0.3em] uppercase">Management System</p>
            </div>
          </div>
          
          <div className="relative aspect-square w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-4 rotate-2">
            <div className="w-full h-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center p-8">
               <div className="space-y-4 w-full">
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse delay-75"></div>
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse delay-150"></div>
                  <div className="mt-8 flex gap-2">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg"></div>
                    <div className="h-10 w-10 bg-purple-100 rounded-lg"></div>
                    <div className="h-10 w-10 bg-emerald-100 rounded-lg"></div>
                  </div>
               </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2025 Hotel Management System</p>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full -ml-32 -mb-32 blur-3xl"></div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome Back!</h2>
            <p className="text-slate-500 font-medium text-lg">Please login to your account</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 focus:bg-white transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    <button className="text-xs font-bold text-slate-900 hover:underline">Forgot Password?</button>
                </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-900 focus:bg-white transition-all outline-none font-medium"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                    <Eye size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer">Remember me</label>
            </div>

            <button 
              onClick={onLogin}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] uppercase tracking-[0.2em]"
            >
              Login
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium">
                Don't have an account? <button className="text-slate-900 font-bold hover:underline">Contact Administrator</button>
            </p>
          </div>
        </div>
        
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
             <div className="p-2 bg-slate-900 rounded-lg text-white">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-sm font-black text-slate-900">HMS.</h1>
        </div>
      </div>
    </div>
  );
};
