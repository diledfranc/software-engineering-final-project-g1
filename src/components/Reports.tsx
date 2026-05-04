import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { PieChart, TrendingUp, DollarSign, Calendar, Users, Briefcase, ChevronRight } from 'lucide-react';

export const Reports = () => {
    const [stats, setStats] = useState<any>({
        totalRevenue: 0,
        averageOccupancy: 0,
        totalBookings: 0,
        revenueByDay: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            const { data: bookings, error } = await supabase
                .from('bookings')
                .select('*');

            if (!error && bookings) {
                const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);
                const totalBookings = bookings.length;
                
                // Group by day for a mini-chart look
                const grouped = bookings.reduce((acc: any, b: any) => {
                    const date = b.created_at?.split('T')[0] || 'Unknown';
                    acc[date] = (acc[date] || 0) + (b.total_amount || 0);
                    return acc;
                }, {});

                setStats({
                    totalRevenue,
                    totalBookings,
                    averageOccupancy: Math.round((totalBookings / 50) * 100), // Assuming 50 rooms
                    revenueByDay: Object.entries(grouped).map(([date, amount]) => ({ date, amount }))
                });
            }
            setLoading(false);
        };
        fetchReportData();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Generating analytics...</div>;

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Performance Reports</h2>
                <p className="text-slate-500">Analyze hotel revenue, occupancy, and growth trends.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                        <DollarSign size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                        <TrendingUp size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Occupancy Rate</p>
                    <p className="text-3xl font-black text-slate-900">{stats.averageOccupancy}%</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
                        <Calendar size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Total Bookings</p>
                    <p className="text-3xl font-black text-slate-900">{stats.totalBookings}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="font-bold text-slate-900">Revenue Breakdown by Day</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {stats.revenueByDay.slice(-5).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-sm font-medium text-slate-600">{item.date}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-900">${item.amount.toLocaleString()}</span>
                                    <ChevronRight size={16} className="text-slate-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
