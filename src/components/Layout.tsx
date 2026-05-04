import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  LogOut, 
  Settings, 
  Users, 
  ClipboardList, 
  DoorOpen, 
  Wallet, 
  PieChart,
  Bell
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
      active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export const Layout = ({ children, activeTab, onTabChange, onLogout }: any) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#1E293B] text-white flex-shrink-0 flex-col fixed h-full">
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="p-2 bg-blue-600 rounded-lg">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight">HOTEL</h1>
            <p className="text-[10px] text-slate-400 tracking-widest">MANAGEMENT SYSTEM</p>
          </div>
        </div>

        <nav className="flex-1 mt-4">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => onTabChange('dashboard')} 
          />
          <SidebarItem 
            icon={<CalendarDays size={20} />} 
            label="Booking" 
            active={activeTab === 'bookings'} 
            onClick={() => onTabChange('bookings')} 
          />
          <SidebarItem 
            icon={<DoorOpen size={20} />} 
            label="Check-In" 
            active={activeTab === 'checkin'} 
            onClick={() => onTabChange('checkin')} 
          />
          <SidebarItem 
            icon={<LogOut size={20} className="rotate-180" />} 
            label="Check-Out" 
            active={activeTab === 'checkout'} 
            onClick={() => onTabChange('checkout')} 
          />
          <SidebarItem 
            icon={<DoorOpen size={20} />} 
            label="Rooms" 
            active={activeTab === 'rooms'} 
            onClick={() => onTabChange('rooms')} 
          />
          <SidebarItem 
            icon={<Wallet size={20} />} 
            label="Billing / Invoice" 
            active={activeTab === 'billing'} 
            onClick={() => onTabChange('billing')} 
          />
          <SidebarItem 
            icon={<ClipboardList size={20} />} 
            label="Housekeeping" 
            active={activeTab === 'housekeeping'} 
            onClick={() => onTabChange('housekeeping')} 
          />
          <SidebarItem 
            icon={<PieChart size={20} />} 
            label="Reports" 
            active={activeTab === 'reports'} 
            onClick={() => onTabChange('reports')} 
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="Users" 
            active={activeTab === 'users'} 
            onClick={() => onTabChange('users')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => onTabChange('settings')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <SidebarItem 
            icon={<LogOut size={20} />} 
            label="Logout" 
            onClick={onLogout}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-slate-500 font-medium text-sm capitalize">
              Software Engineering Final Project / {activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Receptionist</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-tighter">Online</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm ring-1 ring-slate-200">
                R
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
