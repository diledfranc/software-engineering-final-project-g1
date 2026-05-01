import React from 'react';
import { User, CreditCard, Printer, X, ReceiptText } from 'lucide-react';

export const Checkout = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-8 py-6 border-b bg-slate-50/50 flex items-center gap-3">
        <div className="p-2 bg-slate-200 rounded-lg text-slate-600">
          <ReceiptText size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Guest Checkout</h2>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Guest Information */}
          <div className="space-y-6 text-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Guest Information</h3>
            <div className="grid grid-cols-2 gap-y-4">
              <span className="text-slate-500 font-medium">Guest Name:</span>
              <span className="text-slate-900 font-bold">John Smith</span>
              
              <span className="text-slate-500 font-medium">Room Number:</span>
              <span className="text-slate-900 font-bold underline decoration-blue-500 decoration-2">305</span>
              
              <span className="text-slate-500 font-medium">Room Type:</span>
              <span className="text-slate-900 font-bold">Deluxe Room</span>
              
              <span className="text-slate-500 font-medium">Check-In Date:</span>
              <span className="text-slate-900 font-bold">18 May 2025</span>
              
              <span className="text-slate-500 font-medium">Check-Out Date:</span>
              <span className="text-slate-900 font-bold">21 May 2025</span>
              
              <span className="text-slate-500 font-medium">No. of Nights:</span>
              <span className="text-slate-900 font-bold">3</span>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">Billing Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Room Charges (3 Nights)</span>
                <span className="font-bold text-slate-900 font-mono">฿ 4,500.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Extra Charges</span>
                <span className="font-bold text-slate-900 font-mono">฿ 300.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Other Services</span>
                <span className="font-bold text-slate-900 font-mono">฿ 0.00</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-300 flex justify-between items-center">
              <span className="text-base font-bold text-slate-900">Total Amount</span>
              <span className="text-2xl font-black text-slate-900 font-mono">฿ 4,800.00</span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Payment Method</label>
              <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm outline-none cursor-pointer">
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <button className="flex-1 min-w-[140px] bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <CreditCard size={16} />
            Pay Now
          </button>
          <button className="flex-1 min-w-[140px] bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <Printer size={16} />
            Print Invoice
          </button>
          <button className="flex-1 min-w-[140px] bg-white border border-slate-200 text-rose-500 py-4 rounded-xl font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
