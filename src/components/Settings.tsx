import React from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Database, Palette, Save } from 'lucide-react';

export const Settings = () => {
    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">System Settings</h2>
                <p className="text-slate-500">Configure regional preferences, security protocols, and integration keys.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Globe size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Localization</h3>
                            <p className="text-sm text-slate-500">Language, Currency (THB), Timezone (GMT+7)</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">EDIT</button>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Database Security</h3>
                            <p className="text-sm text-slate-500">Supabase RLS Policies & API Key Rotation</p>
                        </div>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded">SECURE</span>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <Palette size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Branding & UI</h3>
                            <p className="text-sm text-slate-500">Theme Colors, Logo, and Layout spacing</p>
                        </div>
                    </div>
                    <button className="px-4 py-2 border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">EDIT</button>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Supabase Connection</h3>
                            <p className="text-sm text-slate-500">Connected to: <span className="font-mono text-[10px]">qvoblakylimktrepfyka</span></p>
                        </div>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded">ACTIVE</span>
                </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
                <Save size={20} />
                SAVE GLOBAL CONFIGURATION
            </button>
        </div>
    );
};
