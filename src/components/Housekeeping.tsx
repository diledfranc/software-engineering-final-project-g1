import React, { useState, useEffect } from 'react';
import { Sparkles, Trash2, Clock, RefreshCw, ShieldCheck } from 'lucide-react';
import { housekeepingService } from '../services/housekeepingService';
import { supabase } from '../utils/supabaseClient';

// BCE: Boundary Class (HousekeepingUI)
export const Housekeeping = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Control Layer Call via direct Supabase but refactored to use service logic
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_number', { ascending: true });
    
    if (!error) setRooms(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      // BCE: Interacting with Control Class (HousekeepingService) to ensure business rules
      await housekeepingService.updateTaskStatus(id, newStatus);
      fetchData();
    } catch (err) {
      console.error('Failed to update housekeeping status:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Housekeeping Control</h2>
          </div>
        </div>
        <button 
          onClick={fetchData}
          className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="p-6 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
               <div>
                  <h3 className="text-lg font-black text-slate-900">Room {room.room_number}</h3>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{room.room_type || 'Standard'}</p>
               </div>
               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                 room.housekeeping_status === 'clean' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                 room.housekeeping_status === 'dirty' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                 'bg-blue-50 text-blue-600 border-blue-100'
               }`}>
                 {room.housekeeping_status || 'Unknown'}
               </span>
            </div>
            
            <div className="p-4 grid grid-cols-3 gap-3">
               <button 
                 onClick={() => handleStatusUpdate(room.id, 'clean')}
                 className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
               >
                  <Sparkles size={20} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Clean</span>
               </button>
               <button 
                 onClick={() => handleStatusUpdate(room.id, 'cleaning')}
                 className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
               >
                  <Clock size={20} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-tight">In-Progress</span>
               </button>
               <button 
                 onClick={() => handleStatusUpdate(room.id, 'dirty')}
                 className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 transition-all"
               >
                  <Trash2 size={20} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-tight">Dirty</span>
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};