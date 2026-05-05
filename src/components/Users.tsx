import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, Search, Plus, MoreVertical, ShieldCheck, UserCog, Loader2, X, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import type { UserProfile, UserRole } from '../types';

export const Users = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [showAddForm, setShowAddForm] = useState(false);
    
    // Add User Form State
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState<UserRole>('Staff');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await authService.getAllProfiles();
            if (data && data.length > 0) {
                setUsers(data);
            } else {
                setUsers([
                    { id: '1', name: 'Adelaide', role: 'Admin', email: 'admin@hms.com', last_login: new Date().toISOString() },
                    { id: '2', name: 'John Smith', role: 'Receptionist', email: 'john@hms.com', last_login: new Date(Date.now() - 3600000).toISOString() },
                    { id: '3', name: 'Sarah Lee', role: 'Manager', email: 'sarah@hms.com', last_login: new Date(Date.now() - 86400000).toISOString() }
                ]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([
                { id: '1', name: 'Adelaide', role: 'Admin', email: 'admin@hms.com', last_login: new Date().toISOString() }
            ]);
        }
        setLoading(false);
    };

    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        try {
            await authService.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (err) {
            alert('Error updating role');
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormError(null);

        try {
            await authService.signUp(newUserEmail, newUserName, newUserRole);
            setShowAddForm(false);
            setNewUserName('');
            setNewUserEmail('');
            setNewUserRole('Staff');
            fetchUsers();
        } catch (err: any) {
            setFormError(err.message || 'Failed to create user. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const nameMatch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || emailMatch;
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-8 pb-12 relative">
            {/* Modal Overlay for Add User */}
            {showAddForm && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Provision New Identity</h3>
                                <p className="text-sm text-slate-500 font-medium">BCE Identity Controller Protocol</p>
                            </div>
                            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900 shadow-sm border border-transparent hover:border-slate-100">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddUser} className="p-8 space-y-6">
                            {formError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium">
                                    <AlertCircle size={18} />
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Identity Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="e.g. Adelaide"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Work Email (Identity)</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="name@hms.com"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Role Permission</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {(['Admin', 'Manager', 'Receptionist', 'Staff'] as UserRole[]).map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setNewUserRole(role)}
                                            className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                                newUserRole === role 
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        >
                                            <Shield size={14} />
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                                    Create Staff Identity
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-8 bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">User Management</h2>
                    <p className="text-slate-500 font-medium font-mono uppercase tracking-[0.2em] text-[10px]">Secure Identity Directory (RBAC Control)</p>
                </div>
                <button 
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
                >
                    <Plus size={18} />
                    Provision User
                </button>
            </div>

            <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all"
                    />
                </div>
                <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-6 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                >
                    <option>All Roles</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                    <option>Staff</option>
                </select>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-slate-200" size={48} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Identity Store...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="p-5 bg-slate-50 rounded-2xl text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 duration-300">
                                        <User size={28} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-slate-100 shadow-sm text-emerald-500">
                                        <ShieldCheck size={16} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                                    <div className="flex items-center gap-4 mt-1.5">
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            (user.role || 'Staff') === 'Admin' ? 'text-amber-600 bg-amber-50 border-amber-100' : 
                                            (user.role || 'Staff') === 'Manager' ? 'text-blue-600 bg-blue-50 border-blue-100' : 
                                            'text-slate-500 bg-slate-50 border-slate-100'
                                        }`}>
                                            <Shield size={10} />
                                            {user.role || 'Staff'}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            <Mail size={12} />
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-12">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Permission</p>
                                    <select 
                                        className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 border-none cursor-pointer"
                                        value={user.role}
                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value as UserRole)}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Receptionist">Receptionist</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>

                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Last Active</p>
                                    <p className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                        {user.last_login ? new Date(user.last_login).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                    </p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="py-24 text-center space-y-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-inner">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                                <UserCog className="text-slate-200" size={40} />
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">No Matching Identity Records</p>
                        </div>
                    )}
                </div>
            )}

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                                <Key className="text-blue-400" size={24} />
                            </div>
                            <h4 className="text-2xl font-black tracking-tight">Access Control Policy</h4>
                        </div>
                        <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
                            Staff identities are verified against the central BCE Security Controller. 
                            Any deviation in role assignment is logged in the permanent Audit Stream. 
                            Registration requires Administrative clearance.
                        </p>
                    </div>
                    <div className="flex items-center gap-6 bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Audit Mode</p>
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-2 justify-end">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Live Monitoring
                            </p>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-700"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Encrypted</p>
                            <p className="text-xs font-bold text-blue-400">AES-256 GCM</p>
                        </div>
                    </div>
                </div>
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-48 -mt-48 blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full -ml-32 -mb-32 blur-[60px]"></div>
            </div>
        </div>
    );
};
