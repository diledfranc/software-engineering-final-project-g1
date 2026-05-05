import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Phone, Calendar, Search, Plus, MoreVertical, ShieldCheck, UserCog } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

export const Users = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        // In a real app, we'd fetch from auth.users, but for this demo 
        // we'll use a public profiles table or mock data if table doesn't exist
        const { data, error } = await supabase
            .from('profiles')
            .select('*');
        
        if (error) {
            console.error('Error fetching users:', error);
            // Fallback to demo data if table missing
            setUsers([
                { id: 1, name: 'Adelaide', role: 'System Admin', email: 'admin@hms.com', last_login: new Date().toISOString() },
                { id: 2, name: 'John Smith', role: 'Receptionist', email: 'john@hms.com', last_login: new Date(Date.now() - 3600000).toISOString() },
                { id: 3, name: 'Sarah Lee', role: 'Manager', email: 'sarah@hms.com', last_login: new Date(Date.now() - 86400000).toISOString() }
            ]);
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900">User Management</h2>
                    <p className="text-slate-500">Manage staff access, permissions, and security profiles.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                    <Plus size={18} />
                    Add New User
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or role..." 
                        className="w-full pl-12 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                </div>
                <select className="px-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-600 focus:ring-2 focus:ring-blue-600">
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {users.map((user) => (
                    <div key={user.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="p-4 bg-slate-100 rounded-2xl text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <User size={28} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-slate-100 shadow-sm text-emerald-500">
                                    <ShieldCheck size={14} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{user.name || user.full_name}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                        (user.role || 'Receptionist').includes('Admin') ? 'text-purple-600 bg-purple-50' : 
                                        (user.role || 'Receptionist').includes('Manager') ? 'text-blue-600 bg-blue-50' : 
                                        'text-slate-600 bg-slate-50'
                                    }`}>
                                        <Shield size={10} />
                                        {user.role || 'Staff'}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <Mail size={12} />
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-12">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {new Date(user.last_login).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                    <UserCog size={18} />
                                </button>
                                <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Key size={20} />
                        </div>
                        <h4 className="text-xl font-black">Security Policy</h4>
                    </div>
                    <p className="text-slate-400 text-sm max-w-md leading-relaxed ml-11">
                        All staff activities are logged under the BCE Security Controller framework. 
                        Changes to user roles require administrative override.
                    </p>
                </div>
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            </div>
        </div>
    );
};
