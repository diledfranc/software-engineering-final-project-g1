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

export const Dashboard = () => {
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
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-slate-400" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm text-slate-600 font-medium shadow-sm">
          <Calendar size={16} />
          {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" size={24} />} 
          label="Total Bookings (SQL)" 
          value={stats?.totalGuests || 0} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<DoorOpen className="text-purple-600" size={24} />} 
          label="Rooms Available" 
          value={stats?.roomsAvailable || 0} 
          color="bg-purple-50"
        />
        <StatCard 
          icon={<LogOut className="text-orange-600 rotate-180" size={24} />} 
          label="Pending Check-outs" 
          value={stats?.pendingCheckouts || 7} 
          color="bg-orange-50"
        />
        <StatCard 
          icon={<ClipboardList className="text-emerald-600" size={24} />} 
          label="Housekeeping Tasks" 
          value={stats?.housekeepingTasks || 5} 
          color="bg-emerald-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Live Bookings</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded">LIVE FROM SUPABASE</span>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b">
                <th className="px-6 py-3 font-semibold">Guest Name</th>
                <th className="px-6 py-3 font-semibold">Room</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 italic">No bookings found in database</td>
                </tr>
              ) : (
                bookings.map((booking: any) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{booking.guest_name}</td>
                    <td className="px-6 py-4 text-slate-600">Room {booking.room_id || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(booking.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Room Status Chart (Mock) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Room Status</h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="relative w-48 h-48 rounded-full border-[20px] border-slate-100 flex items-center justify-center">
                {/* Visual mock of a donut chart using CSS gradients could be complex, using simple legend for now */}
                <div className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-slate-800 border-r-slate-800 rotate-45"></div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-slate-900">100%</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-3 w-full capitalize text-xs">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-800"></div> Occupied (60%)</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div> Available (30%)</div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-300"></div> Maintenance (10%)</div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar size={18} className="text-slate-400" />
            New Booking
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <DoorOpen size={18} className="text-slate-400" />
            Check-In
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <LogOut size={18} className="text-slate-400 rotate-180" />
            Check-Out
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <ClipboardList size={18} className="text-slate-400" />
            Housekeeping
          </button>
        </div>
      </div>
    </div>
  );
};
