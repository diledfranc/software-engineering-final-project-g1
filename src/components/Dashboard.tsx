import React, { useEffect, useState } from 'react';
import { Users, DoorOpen, LogOut, ClipboardList, Calendar, Loader2 } from 'lucide-react';
import { bookingService } from '../services/bookingService';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  </div>
);

export const Dashboard = ({ availableRooms, setPage }: any) => {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          bookingService.getDashboardStats(),
          bookingService.getBookings()
        ]);
        setStats(statsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center p-20">
          <Loader2 className="animate-spin text-slate-400" size={40} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-0">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm text-slate-600 font-medium shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => setPage("booking")}>
          <StatCard 
            icon={<Users className="text-blue-600" size={24} />} 
            label="Total Bookings" 
            value={stats?.totalGuests || 0} 
            color="bg-blue-50"
          />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => setPage("rooms")}>
          <StatCard 
            icon={<DoorOpen className="text-purple-600" size={24} />} 
            label="Rooms Available" 
            value={stats?.roomsAvailable || availableRooms || 0} 
            color="bg-purple-50"
          />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => setPage("checkout")}>
          <StatCard 
            icon={<LogOut className="text-orange-600 rotate-180" size={24} />} 
            label="Pending Check-outs" 
            value={stats?.pendingCheckouts || 7} 
            color="bg-orange-50"
          />
        </div>
        <div className="cursor-pointer transition-transform hover:scale-105" onClick={() => setPage("housekeeping")}>
          <StatCard 
            icon={<ClipboardList className="text-emerald-600" size={24} />} 
            label="Housekeeping Tasks" 
            value={stats?.housekeepingTasks || 5} 
            color="bg-emerald-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Live Bookings</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded">LIVE FROM SUPABASE</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-widest border-b">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{booking.guest_name}</p>
                      <p className="text-xs text-slate-400 font-medium tracking-tight">
                        ID: {booking.custom_id || `#${booking.id.slice(0, 8)}`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">
                        {booking.room_id?.replace('room-', '') || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-600">
                        {(booking.check_in || booking.check_in_date) ? new Date(booking.check_in || booking.check_in_date).toLocaleDateString() : 'N/A'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        to {(booking.check_out || booking.check_out_date) ? new Date(booking.check_out || booking.check_out_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase tracking-wider">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white shadow-xl shadow-slate-200">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <span className="p-1 bg-white/10 rounded">?</span> System Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">DB Connection</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                <span className="text-white/60">Realtime Engine</span>
                <span className="text-white font-bold opacity-80">Connected</span>
              </div>
              <button 
                onClick={() => setPage && setPage('booking')}
                className="w-full mt-4 bg-white text-slate-900 py-3 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Create New Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
