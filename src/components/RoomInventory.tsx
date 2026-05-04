import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Search, Filter, CheckCircle2, XCircle, Clock, RefreshCw } from 'lucide-react';

export const RoomInventory = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number', { ascending: true });
    
    if (!error) setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const updateRoomStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('rooms')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) fetchRooms();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Room Inventory</h2>
          <p className="text-slate-500">Real-time status of all hotel accommodation units.</p>
        </div>
        <div className="flex gap-3">
           <button onClick={fetchRooms} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-900 text-white rounded-xl font-black text-xl">
                 {room.room_number}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                  room.status === 'occupied' ? 'bg-blue-100 text-blue-700' : 
                  'bg-orange-100 text-orange-700'
                }`}>
                  {room.status}
                </span>
                <select 
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                  className="text-[10px] border-none bg-slate-50 font-bold rounded p-1 cursor-pointer focus:ring-0"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <h3 className="font-bold text-slate-900 mb-1">{room.room_type}</h3>
            <div className="flex items-center justify-between mt-4">
               <p className="text-lg font-black text-slate-900">${room.price || room.price_per_night}</p>
               <div className="flex gap-1 text-slate-400 items-center">
                  <span className="text-[10px] uppercase font-bold">{room.housekeeping_status}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
