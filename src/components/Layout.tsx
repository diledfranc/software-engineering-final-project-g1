import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  LogOut, 
  Settings, 
  Users as UsersIcon, 
  ClipboardList, 
  DoorOpen, 
  Wallet, 
  PieChart,
  Bell,
  User,
  History,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { authService } from '../services/authService';
import type { UserRole, UserProfile } from '../types';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  requiredRoles?: UserRole[];
  currentRole?: UserRole;
  danger?: boolean;
}

const SidebarItem = ({ icon, label, active, onClick, requiredRoles, currentRole, danger }: SidebarItemProps) => {
  if (requiredRoles && currentRole && !requiredRoles.includes(currentRole)) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
        active ? 'bg-slate-800 text-white border-l-4 border-blue-600' : 
        danger ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' :
        'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
      {requiredRoles?.includes('Admin') && currentRole === 'Admin' && (
        <ShieldAlert size={12} className="ml-auto text-amber-500 opacity-50" />
      )}
    </div>
  );
};

export const Layout = ({ children, setPage, activePage }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      window.location.reload();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#1E293B] text-white flex-shrink-0 flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">SARABURI</h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-black">Secure Gateway</p>
          </div>
        </div>

        <nav className="flex-1 mt-4">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activePage === "dashboard"}
            onClick={() => setPage("dashboard")} 
          />
          <SidebarItem 
            icon={<CalendarDays size={20} />} 
            label="Booking" 
            active={activePage === "booking"}
            onClick={() => setPage("booking")} 
            requiredRoles={['Admin', 'Manager', 'Receptionist']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<DoorOpen size={20} />} 
            label="Check-In" 
            active={activePage === "checkin"}
            onClick={() => setPage("checkin")} 
            requiredRoles={['Admin', 'Manager', 'Receptionist']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<LogOut size={20} className="rotate-180" />} 
            label="Check-Out" 
            active={activePage === "checkout"}
            onClick={() => setPage("checkout")} 
            requiredRoles={['Admin', 'Manager', 'Receptionist']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<DoorOpen size={20} />} 
            label="Rooms" 
            active={activePage === "rooms"}
            onClick={() => setPage("rooms")} 
          />
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Billing / Invoice" 
            active={activePage === "billing"}
            onClick={() => setPage("billing")} 
            requiredRoles={['Admin', 'Manager', 'Receptionist']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label="Housekeeping" 
            active={activePage === "housekeeping"}
            onClick={() => setPage("housekeeping")} 
            requiredRoles={['Admin', 'Manager', 'Staff']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<PieChart size={20} />} 
            label="Reports" 
            active={activePage === "reports"}
            onClick={() => setPage("reports")} 
            requiredRoles={['Admin', 'Manager']}
            currentRole={profile?.role}
          />
          <SidebarItem 
            icon={<UsersIcon size={20} />} 
            label="Users" 
            active={activePage === "users"}
            onClick={() => setPage("users")} 
            requiredRoles={['Admin']}
            currentRole={profile?.role}
          />
          <SidebarItem             icon={<History size={20} />} 
            label="Audit Logs" 
            active={activePage === "audit"}
            onClick={() => setPage("audit")} 
            requiredRoles={['Admin']}
            currentRole={profile?.role}
          />
          <SidebarItem             icon={<Settings size={20} />} 
            label="Settings" 
            active={activePage === "settings"}
            onClick={() => setPage("settings")} 
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <SidebarItem 
            icon={<LogOut size={20} />} 
            label="Logout" 
            onClick={handleLogout}
            danger
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest">
              Saraburi HMS / <span className="text-slate-900">{activePage}</span>
            </h3>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l group hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{profile?.name || 'Loading...'}</p>
                <div className="flex items-center justify-end gap-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${profile?.role === 'Admin' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{profile?.role || 'Staff'}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
