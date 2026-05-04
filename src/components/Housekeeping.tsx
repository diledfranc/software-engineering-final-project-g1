import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const Housekeeping = () => {
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

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('rooms')
      .update({ housekeeping_status: newStatus })
      .eq('id', id);
    
    if (!error) fetchRooms();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Housekeeping Control</h2>
          <p className="text-slate-500">Manage room cleanliness and turnover status.</p>
        </div>
        <button 
          onClick={fetchRooms}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="p-6 border-b border-slate-50 flex justify-between items-start">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Room {room.room_number}</h3>
                  <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">{room.room_type}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                 room.housekeeping_status === 'clean' ? 'bg-emerald-100 text-emerald-700' :
                 room.housekeeping_status === 'dirty' ? 'bg-orange-100 text-orange-700' :
                 'bg-blue-100 text-blue-700'
               }`}>
                 {room.housekeeping_status}
               </span>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-2">
               <button 
                 onClick={() => updateStatus(room.id, 'clean')}
                 className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"
               >
                  <Sparkles size={18} className="mb-1" />
                  <span className="text-[10px] font-bold">CLEAN</span>
               </button>
               <button 
                 onClick={() => updateStatus(room.id, 'cleaning')}
                 className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
               >
                  <Clock size={18} className="mb-1" />
                  <span className="text-[10px] font-bold">PROGRESS</span>
               </button>
               <button 
                 onClick={() => updateStatus(room.id, 'dirty')}
                 className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all"
               >
                  <Trash2 size={18} className="mb-1" />
                  <span className="text-[10px] font-bold">DIRTY</span>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
