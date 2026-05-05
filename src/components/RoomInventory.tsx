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

  const seedRooms = async () => {
    const defaultRooms = [];
    const types = ['Standard Single', 'Standard Single', 'Deluxe Double', 'Suite'];
    const prices = [1200, 1200, 2500, 5000];

    for (let floor = 1; floor <= 4; floor++) {
      for (let roomNum = 1; roomNum <= 4; roomNum++) {
        const typeIndex = roomNum - 1;
        defaultRooms.push({
          room_number: `${floor}0${roomNum}`,
          room_type: types[typeIndex],
          status: 'available',
          housekeeping_status: 'clean',
          price_per_night: prices[typeIndex]
        });
      }
    }
    
    const { error } = await supabase.from('rooms').insert(defaultRooms);
    if (!error) fetchRooms();
    else alert('Error seeding rooms: ' + error.message);
  };

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
           {rooms.length === 0 && !loading && (
             <button 
               onClick={seedRooms} 
               className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-all"
             >
               Initialize Room Data
             </button>
           )}
           <button onClick={fetchRooms} className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
             <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Room</span>
                <div className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {room.room_number}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                  room.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                  room.status === 'occupied' ? 'bg-blue-50 text-blue-600' : 
                  'bg-orange-50 text-orange-600'
                }`}>
                  {room.status}
                </span>
                <select 
                  value={room.status}
                  onChange={(e) => updateRoomStatus(room.id, e.target.value)}
                  className="text-[10px] border-none bg-slate-50 text-slate-500 font-bold rounded p-1 cursor-pointer focus:ring-0 hover:bg-slate-100 transition-colors"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-slate-600">{room.room_type}</h3>
              </div>
              
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Rate</span>
                  <p className="text-lg font-black text-slate-900">
                    ฿{room.price_per_night?.toLocaleString() || room.price?.toLocaleString()}
                    <span className="text-[10px] font-medium text-slate-400 ml-1">/night</span>
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${room.housekeeping_status === 'clean' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50'}`}>
                  <RefreshCw size={14} className={room.housekeeping_status === 'cleaning' ? 'animate-spin' : ''} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
