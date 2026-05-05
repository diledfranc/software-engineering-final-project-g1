import React from 'react';
import { Calendar, TrendingUp, Users, DoorOpen, DollarSign, Hotel } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  </div>
);

export default function Report() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">System Reports</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm text-slate-600 font-medium shadow-sm">
          <Calendar size={16} />
          Year-to-Date 2025
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Hotel className="text-blue-600" size={24} />} 
          label="Total Bookings YTD" 
          value="1,248" 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<DoorOpen className="text-purple-600" size={24} />} 
          label="Avg Occupancy Rate" 
          value="82%" 
          color="bg-purple-50"
        />
        <StatCard 
          icon={<Users className="text-emerald-600" size={24} />} 
          label="Total Guests" 
          value="3,412" 
          color="bg-emerald-50"
        />
        <StatCard 
          icon={<TrendingUp className="text-indigo-600" size={24} />} 
          label="Revenue Growth" 
          value="+14.5%" 
          color="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6">
          <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Revenue Breakdown</h3>
            <DollarSign className="text-slate-400" size={18} />
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b">
                <th className="px-6 py-3 font-semibold">Source</th>
                <th className="px-6 py-3 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              <tr>
                <td className="px-6 py-4 text-slate-600">Room Charges</td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono text-right">฿ 3,450,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">F&B Services</td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono text-right">฿ 420,500</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">Spa & Wellness</td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono text-right">฿ 185,000</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-slate-600">Additional Services</td>
                <td className="px-6 py-4 font-bold text-slate-900 font-mono text-right">฿ 84,200</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Room Typology Performance</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Standard Rooms</span>
                <span className="font-bold text-slate-900">85% Occupancy</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Deluxe Rooms</span>
                <span className="font-bold text-slate-900">72% Occupancy</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[72%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-slate-700">Premium Suites</span>
                <span className="font-bold text-slate-900">94% Occupancy</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[94%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
