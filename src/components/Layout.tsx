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
  Bell,
  User
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ icon, label, active, onClick }: any) => (
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

export const Layout = ({ children, setPage }: any) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#1E293B] text-white flex-shrink-0 flex-col">
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
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setPage("dashboard")} />
          <SidebarItem icon={<CalendarDays size={20} />} label="Booking" onClick={() => setPage("booking")} />
          <SidebarItem icon={<DoorOpen size={20} />} label="Check-In" onClick={() => setPage("checkin")} />
          <SidebarItem icon={<LogOut size={20} className="rotate-180" />} label="Check-Out" onClick={() => setPage("checkout")} />
          <SidebarItem icon={<DoorOpen size={20} />} label="Rooms" />
          <SidebarItem icon={<Wallet size={20} />} label="Billing / Invoice" />
          <SidebarItem icon={<ClipboardList size={20} />} label="Housekeeping" />
          <SidebarItem icon={<PieChart size={20} />} label="Reports" />
          <SidebarItem icon={<Users size={20} />} label="Users" />
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <SidebarItem icon={<LogOut size={20} />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="md:hidden flex gap-2">
              <button
                 onClick={() => setPage("dashboard")}
                 className="px-3 py-1 bg-slate-200 rounded text-sm">
                 Dashboard
              </button>
               <button
                 onClick={() => setPage("booking")}
                 className="px-3 py-1 bg-slate-200 rounded text-sm">
                 Booking
              </button>
              <button
                 onClick={() => setPage("checkout")}
                 className="px-3 py-1 bg-slate-200 rounded text-sm">
                 Checkout
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Receptionist</p>
                <p className="text-xs text-slate-500">Online</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
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
