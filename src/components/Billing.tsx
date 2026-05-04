import { useMemo } from 'react';
import Decimal from 'decimal.js';
import { Printer, ReceiptText } from 'lucide-react';
import { calculateTotal } from '../services/billingService';
import { getVatRate } from '../config/billingConfig';

export default function Billing() {
	const roomType = 'Deluxe Room';
	const roomRate = 1500;
	const nights = 3;
	const vatRate = getVatRate();

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
			<div className="px-6 py-5 border-b bg-slate-50/50 flex items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-blue-100 rounded-lg text-blue-600">
						<ReceiptText size={20} />
					</div>
					<div>
						<h2 className="text-2xl font-semibold text-slate-900">Billing Statement</h2>
						<p className="text-sm text-slate-500">Final invoice for completed stay</p>
					</div>
				</div>
				<span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
					Paid
				</span>
			</div>

			<div className="p-6 md:p-8 space-y-8">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice ID</p>
						<p className="text-lg font-semibold text-slate-900">INV-001</p>
					</div>
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Invoice Date</p>
						<p className="text-lg font-semibold text-slate-900">May 21, 2025</p>
					</div>
					<div className="rounded-xl border border-slate-200 bg-white p-4">
						<p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Guest</p>
						<p className="text-lg font-semibold text-slate-900">John Smith</p>
					</div>
				</div>

				<div className="rounded-2xl border border-slate-200 overflow-hidden">
					<div className="px-6 py-4 border-b bg-slate-50/50">
						<h3 className="text-lg font-semibold text-slate-900">Invoice Details</h3>
					</div>
					<div className="px-6 py-6 space-y-4 text-sm">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-semibold text-slate-900">{roomType}</p>
								<p className="text-slate-500">{nights} nights × {formatCurrency(new Decimal(roomRate))}</p>
							</div>
							<span className="font-semibold text-slate-900 font-mono">
								{formatCurrency(billingSummary.subtotal)}
							</span>
						</div>
						<div className="flex items-center justify-between text-slate-600">
							<span>VAT ({(vatRate * 100).toFixed(2)}%)</span>
							<span className="font-semibold text-slate-900 font-mono">
								{formatCurrency(billingSummary.vat)}
							</span>
						</div>
						<div className="pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
							<span className="text-base font-semibold text-slate-900">Grand Total</span>
							<span className="text-2xl font-bold text-slate-900 font-mono">
								{formatCurrency(billingSummary.total)}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap gap-4">
					<button
						className="flex-1 min-w-35 bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-slate-800 shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2"
						onClick={handlePrint}
					>
						<Printer size={16} />
						Print Invoice
					</button>
					<button
						className="flex-1 min-w-35 bg-white border border-slate-200 text-slate-500 py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center"
						disabled
					>
						Payment Completed
					</button>
				</div>
			</div>
		</div>
	);
}
