import { CheckCircle, DoorOpen } from 'lucide-react';

export default function CheckIn() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-5 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
          <DoorOpen size={20} />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900">Check-In</h2>
      </div>

      <div className="p-6 md:p-8">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600 space-y-3">
          <p className="text-slate-900 font-semibold">Check-in details will appear here.</p>
          <p>
            This placeholder keeps the navigation intact until the full check-in flow is implemented.
          </p>
        </div>

        <div className="mt-10 flex gap-4">
          <button className="flex-2 bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <CheckCircle size={16} />
            Confirm Check-In
          </button>
          <button className="flex-1 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-bold hover:bg-slate-50 uppercase tracking-widest text-xs">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
