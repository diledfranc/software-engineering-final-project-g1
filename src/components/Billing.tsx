import { useMemo, useState } from 'react';
import Decimal from 'decimal.js';
import { Printer, ReceiptText, Search, Loader2 } from 'lucide-react';
import { calculateTotal } from '../services/billingService';
import { getVatRate } from '../config/billingConfig';
import { supabase } from '../utils/supabaseClient';

export default function Billing() {
	const [bookingId, setBookingId] = useState('');
	const [booking, setBooking] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const roomRate = 600; // Standard Single default
	const vatRate = getVatRate();

	const handleSearch = async () => {
		if (!bookingId.trim()) return;
		setLoading(true);
		setMessage('');
		try {
			const input = bookingId.trim().toUpperCase();
			const { data, error } = await supabase
				.from('bookings')
				.select('*')
				.eq('custom_id', input)
				.maybeSingle();

			if (error) throw error;
			if (!data) throw new Error('Invoice not found for this ID');
			
			setBooking(data);
		} catch (err: any) {
			setMessage(err.message);
			setBooking(null);
		} finally {
			setLoading(false);
		}
	};

	const nights = useMemo(() => {
		if (!booking) return 1;
		const start = new Date(booking.check_in || booking.check_in_date);
		const end = new Date(booking.check_out || booking.check_out_date);
		const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
		return diff > 0 ? diff : 1;
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
					<div>
						<h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Billing Statement</h2>
						<p className="text-sm text-slate-500 font-medium">Generate guest invoices</p>
					</div>
				</div>
				
				<div className="flex gap-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
						<input 
							type="text" 
							placeholder="Booking ID (e.g. A-00001)" 
							value={bookingId}
							onChange={(e) => setBookingId(e.target.value)}
							className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none w-48"
						/>
					</div>
					<button 
						onClick={handleSearch}
						className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
					>
						{loading ? <Loader2 className="animate-spin" size={12} /> : 'Search'}
					</button>
				</div>
			</div>

			<div className="p-6 md:p-8 space-y-8">
				{booking ? (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
							<div className="rounded-xl border border-slate-200 bg-white p-4">
								<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Invoice ID</p>
								<p className="text-lg font-bold text-slate-900">INV-{booking.custom_id}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-white p-4">
								<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Statement Date</p>
								<p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
							</div>
							<div className="rounded-xl border border-slate-200 bg-white p-4">
								<p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Guest Name</p>
								<p className="text-lg font-bold text-slate-900">{booking.guest_name}</p>
							</div>
						</div>

						<div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
							<div className="px-6 py-4 border-b bg-slate-50/50 flex justify-between items-center">
								<h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Invoice Details</h3>
								<span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
									booking.status === 'checked-out' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-blue-50 text-blue-600 border-blue-200'
								}`}>
									{booking.status === 'checked-out' ? 'Finalized' : 'Current Stay'}
								</span>
							</div>
							<div className="px-6 py-6 space-y-6 text-sm">
								<div className="flex items-center justify-between">
									<div>
										<p className="font-bold text-slate-900">Room Accommodation (Ref: {booking.room_id})</p>
										<p className="text-slate-500 font-medium font-mono">{nights} nights × {formatCurrency(new Decimal(roomRate))}</p>
									</div>
									<span className="font-bold text-slate-900 font-mono">
										{formatCurrency(billingSummary.subtotal)}
									</span>
								</div>
								
								<div className="pt-4 border-t border-slate-100 space-y-3">
									<div className="flex items-center justify-between text-slate-500">
										<span className="font-medium">Subtotal</span>
										<span className="font-bold font-mono">{formatCurrency(billingSummary.subtotal)}</span>
									</div>
									<div className="flex items-center justify-between text-slate-500">
										<span className="font-medium">VAT ({(vatRate * 100).toFixed(0)}%)</span>
										<span className="font-bold font-mono">{formatCurrency(billingSummary.vat)}</span>
									</div>
									<div className="pt-4 border-t border-slate-900 flex items-center justify-between">
										<span className="text-base font-black text-slate-900 uppercase tracking-tight">Grand Total</span>
										<span className="text-3xl font-black text-slate-900 font-mono">
											{formatCurrency(billingSummary.total)}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-wrap gap-4">
							<button
								className="flex-1 min-w-35 bg-slate-900 text-white py-4 rounded-xl font-black hover:bg-black shadow-lg uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
								onClick={handlePrint}
							>
								<Printer size={16} />
								Print Invoice
							</button>
							<button 
								onClick={() => setBooking(null)}
								className="flex-1 min-w-35 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-black hover:bg-slate-50 uppercase tracking-widest text-[10px] transition-all"
							>
								Clear
							</button>
						</div>
					</>
				) : (
					<div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/30">
						<Search size={48} className="mx-auto text-slate-200 mb-4" />
						<p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Enter Booking ID to generate Invoice</p>
						{message && <p className="text-red-500 mt-4 text-xs font-bold italic">{message}</p>}
					</div>
				)}
			</div>
		</div>
	);
}