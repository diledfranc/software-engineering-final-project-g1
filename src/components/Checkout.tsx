import { useMemo, useState, useEffect } from 'react';
import { CreditCard, Printer, X, ReceiptText, Search, Loader2 } from 'lucide-react';
import Decimal from 'decimal.js';
import { getVatRate } from '../config/billingConfig';
import { calculateTotal } from '../services/billingService';
import { supabase } from '../utils/supabaseClient';

export default function Checkout() {
	const [bookingId, setBookingId] = useState('');
	const [booking, setBooking] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [searching, setSearching] = useState(false);
	const [message, setMessage] = useState('');
	const [isPaid, setIsPaid] = useState(false);

	const roomRate = 600;
	const vatRate = getVatRate();

	const handleSearch = async () => {
		if (!bookingId.trim()) return;
		setSearching(true);
		setMessage('');
		try {
			const input = bookingId.trim();
			const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input);
			
			let query = supabase.from('bookings').select('*');
			if (isUuid) query = query.eq('id', input);
			else query = query.eq('custom_id', input.toUpperCase());

			const { data, error } = await query.maybeSingle();
			if (error) throw error;
			if (!data) throw new Error('Booking not found');
			
			setBooking(data);
			setIsPaid(data.status === 'checked-out');
		} catch (err: any) {
			setMessage(err.message);
			setBooking(null);
		} finally {
			setSearching(false);
		}
	};

	const nights = useMemo(() => {
		if (!booking) return 1;
		const startStr = booking.check_in || booking.check_in_date;
		const endStr = booking.check_out || booking.check_out_date;
		
		if (!startStr || !endStr) return 1;
		
		const start = new Date(startStr);
		const end = new Date(endStr);
		
		// Reset hours to ensure we only compare dates
		start.setHours(0, 0, 0, 0);
		end.setHours(0, 0, 0, 0);

		const diffTime = end.getTime() - start.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		return diffDays > 0 ? diffDays : 1;
	}, [booking]);

	const billingSummary = useMemo(
		() => calculateTotal(roomRate, nights, vatRate),
		[roomRate, nights, vatRate]
	);

	const formatCurrency = (amount: Decimal) =>
		new Intl.NumberFormat('th-TH', {
			style: 'currency',
			currency: 'THB',
			currencyDisplay: 'code',
			minimumFractionDigits: 2,
		}).format(Number(amount.toFixed(2)));

	const handlePayNow = async () => {
		if (!booking) return;
		setLoading(true);
		try {
			const { error: bookingError } = await supabase
				.from('bookings')
				.update({ 
					status: 'checked-out',
					total_paid: billingSummary.total.toNumber()
				})
				.eq('id', booking.id);

			if (bookingError) throw bookingError;

			// Log to payments table
			await supabase.from('payments').insert([{
				booking_id: booking.id,
				amount: billingSummary.total.toNumber(),
				payment_method: 'Cash' // For now default to Cash as per UI select
			}]);

			if (booking.room_id) {
				await supabase
					.from('rooms')
					.update({ status: 'available', housekeeping_status: 'dirty' })
					.eq('id', booking.room_id);
			}

			setIsPaid(true);
		} catch (err: any) {
			setMessage('Error: ' + err.message);
		} finally {
			setLoading(false);
		}
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="px-6 py-5 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-blue-100 rounded-lg text-blue-600">
						<ReceiptText size={20} />
					</div>
					<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Guest Checkout</h2>
				</div>
				
				<div className="flex gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
						<input 
							type="text" 
							placeholder="Enter ID (e.g. A-01001)" 
							value={bookingId}
							onChange={(e) => setBookingId(e.target.value)}
							className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none w-48"
						/>
					</div>
					<button 
						onClick={handleSearch}
						className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
					>
						{searching ? <Loader2 className="animate-spin" size={12} /> : 'Search'}
					</button>
				</div>
			</div>

			<div className="p-6 md:p-8">
				{booking ? (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						<div className="space-y-6 text-sm">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 text-blue-600">Guest Information</h3>
							<div className="grid grid-cols-2 gap-y-4">
								<span className="text-slate-500 font-medium">Guest Name:</span>
								<span className="text-slate-900 font-bold">{booking.guest_name}</span>

								<span className="text-slate-500 font-medium">Room Number:</span>
								<span className="text-slate-900 font-bold underline decoration-blue-500 decoration-2">{booking.room_id || 'N/A'}</span>

								<span className="text-slate-500 font-medium">Booking ID:</span>
								<span className="text-slate-900 font-bold font-mono">{booking.custom_id || booking.id.slice(0,8)}</span>

								<span className="text-slate-500 font-medium">Check-In Date:</span>
								<span className="text-slate-900 font-bold">
									{booking.check_in || booking.check_in_date || 'N/A'}
								</span>

								<span className="text-slate-500 font-medium">Check-Out Date:</span>
								<span className="text-slate-900 font-bold">
									{booking.check_out || booking.check_out_date || 'N/A'}
								</span>

								<span className="text-slate-500 font-medium">No. of Nights:</span>
								<span className="text-slate-900 font-bold">{nights}</span>
							</div>
						</div>

						<div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-6">
							<h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2 text-blue-600">Billing Summary</h3>
							<div className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="text-slate-600">Room Charges ({nights} Nights)</span>
									<span className="font-bold text-slate-900 font-mono">
										{formatCurrency(billingSummary.subtotal)}
									</span>
								</div>
								<div className="flex justify-between text-sm border-b border-slate-200 pb-2">
									<span className="text-slate-600">VAT ({(vatRate * 100).toFixed(0)}%)</span>
									<span className="font-bold text-slate-900 font-mono">
										{formatCurrency(billingSummary.vat)}
									</span>
								</div>
							</div>

							<div className="pt-2 flex justify-between items-center">
								<span className="text-base font-bold text-slate-900">Total Amount</span>
								<span className="text-2xl font-black text-slate-900 font-mono">
									{formatCurrency(billingSummary.total)}
								</span>
							</div>

							{isPaid && (
								<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 animate-in zoom-in-95 flex items-center gap-2">
									<div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
									Check-out successful. Guest is now cleared.
								</div>
							)}

							<div className="space-y-2">
								<label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Payment Method</label>
								<select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm outline-none cursor-pointer">
									<option>Cash</option>
									<option>Credit Card</option>
									<option>Bank Transfer</option>
								</select>
							</div>
						</div>
					</div>
				) : (
					<div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
						<Search size={48} className="mx-auto text-slate-300 mb-4" />
						<p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Enter a Booking ID to start checkout</p>
						{message && <p className="text-red-500 mt-2 text-xs font-bold italic">{message}</p>}
					</div>
				)}

				{booking && (
					<div className="mt-10 flex flex-wrap gap-4">
						<button
							className="flex-1 min-w-35 bg-blue-600 text-white py-4 rounded-xl font-black hover:bg-blue-700 shadow-lg uppercase tracking-widest text-[10px] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
							onClick={handlePayNow}
							disabled={isPaid || loading}
						>
							{loading ? <Loader2 className="animate-spin" size={14} /> : <CreditCard size={14} />}
							{isPaid ? 'GUEST CHECKED OUT' : 'BILL & CHECKOUT'}
						</button>
						<button
							className="flex-1 min-w-35 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-black hover:bg-slate-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
							onClick={handlePrint}
						>
							<Printer size={14} />
							Print Invoice
						</button>
						<button 
							onClick={() => setBooking(null)}
							className="flex-1 min-w-35 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-black hover:bg-slate-50 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
						>
							<X size={14} />
							Cancel
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
