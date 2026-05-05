import React, { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Database, Palette, Save, Moon, Sun, Lock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';

export const Settings = () => {
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);
    const [saveStatus, setSaveStatus] = useState<null | 'saving' | 'saved'>(null);

    const handleSave = () => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 1500);
        setTimeout(() => setSaveStatus(null), 4000);
    };

    return (
        <div className="space-y-8 max-w-5xl pb-12">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">System Settings</h2>
                    <p className="text-slate-500 font-medium">Configure core hotel logic, financial rules, and regional preferences.</p>
                </div>
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    <button 
                        onClick={() => setTheme('light')}
                        className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                    >
                        <Sun size={18} />
                    </button>
                    <button 
                        onClick={() => setTheme('dark')}
                        className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
                    >
                        <Moon size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Config Column */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Preferences</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            <div className="p-6 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Globe size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Localization</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Thai Baht (฿), GMT+7 (Bangkok)</p>
                                    </div>
                                </div>
                                <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-600 py-1.5 focus:ring-0">
                                    <option>THB (฿)</option>
                                    <option>USD ($)</option>
                                </select>
                            </div>

                            <div className="p-6 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <Bell size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Real-time Notifications</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">Browser and Email alerts for bookings</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setNotifications(!notifications)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${notifications ? 'bg-blue-600' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="p-6 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                        <CreditCard size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Tax & Service Charge</h4>
                                        <p className="text-xs text-slate-500 font-medium mt-0.5">7% VAT + 10% Service Charge automation</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-400">ENABLED</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Database & Infrastructure</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-900 text-white rounded-2xl">
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Supabase Instance</h4>
                                        <p className="text-[10px] font-mono text-slate-400 mt-1">ID: qvoblakylimktrepfyka</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black">CONNECTED</span>
                                </div>
                            </div>

                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-4">
                                <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                <div>
                                    <p className="text-sm font-bold text-orange-900">API Key Rotation Pending</p>
                                    <p className="text-xs text-orange-700 mt-0.5">Security policy requires API key rotation every 90 days. Next rotation due in 4 days.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Info Column */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                        <h4 className="text-xl font-black mb-6">Support Console</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                                <Shield className="text-blue-400" size={20} />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Security Agent</p>
                                    <p className="text-sm font-medium leading-relaxed">BCE Controller is managing RLS policies.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                                <Palette className="text-purple-400" size={20} />
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Visual Core</p>
                                    <p className="text-sm font-medium leading-relaxed">Tailwind v4 Modern Build Active.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSave}
                        className={`w-full flex items-center justify-center gap-3 p-5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                            saveStatus === 'saving' ? 'bg-slate-700 text-white animate-pulse' :
                            saveStatus === 'saved' ? 'bg-emerald-600 text-white' :
                            'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-1'
                        }`}
                    >
                        {saveStatus === 'saving' ? 'SYNCING...' : 
                         saveStatus === 'saved' ? (
                             <>
                                <CheckCircle2 size={20} />
                                SETTINGS SAVED
                             </>
                         ) : 
                         (
                             <>
                                <Save size={20} />
                                SAVE ALL CHANGES
                             </>
                         )}
                    </button>
                    
                    <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-[0.2em]">
                        System Version 1.4.2-LTS
                    </p>
                </div>
            </div>
        </div>
    );
};
