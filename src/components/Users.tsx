import React from 'react';
import { User, Shield, Key, Mail, Phone, Calendar } from 'lucide-react';

export const Users = () => {
    // Mock user data for the current session/staff members
    const staff = [
        { id: 1, name: 'Adelaide', role: 'System Admin', email: 'admin@hms.com', lastLogin: '2 mins ago' },
        { id: 2, name: 'John Smith', role: 'Receptionist', email: 'john@hms.com', lastLogin: '1 hour ago' },
        { id: 3, name: 'Sarah Lee', role: 'Manager', email: 'sarah@hms.com', lastLogin: 'Yesterday' }
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900">User Management</h2>
                <p className="text-slate-500">Manage staff access, permissions, and session logs.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {staff.map((user) => (
                    <div key={user.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-slate-100 rounded-2xl text-slate-600">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{user.name}</h3>
                                <div className="flex items-center gap-4 mt-1">
                                    <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                        <Shield size={12} />
                                        {user.role}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-400">
                                        <Mail size={12} />
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last Activity</p>
                            <p className="text-sm font-medium text-slate-700">{user.lastLogin}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <div className="flex items-center gap-4 text-slate-500">
                    <Key size={20} />
                    <p className="text-sm font-medium italic">Role-based Access Control (RBAC) is enforced by the BCE Security Controller.</p>
                </div>
            </div>
        </div>
    );
};
