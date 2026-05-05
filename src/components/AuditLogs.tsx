import React, { useState, useEffect } from 'react';
import { History, Shield, User, Tag, Clock, Search, RefreshCw, FileJson } from 'lucide-react';
import { auditService } from '../services/auditService';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getLogs();
      setLogs(data || []);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="p-2 bg-slate-900 text-white rounded-lg">
                <History size={20} />
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">System Audit logs</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium font-mono uppercase tracking-widest text-[10px]">Security & Traceability Manifest</p>
        </div>

        <div className="flex items-center gap-2">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search actions or entities..."
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-slate-900 outline-none w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchLogs}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 shadow-sm"
            >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Entity</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">User ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                        <RefreshCw className="animate-spin mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-xs font-bold text-slate-400 uppercase">Synchronizing Audit Records...</p>
                    </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-xs font-mono font-bold">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-tight border border-slate-200">
                                {log.action}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase">
                                    <Tag size={12} className="text-blue-500" />
                                    {log.entity_type}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-400">ID: {log.entity_id?.slice(0,8)}...</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                <User size={14} />
                                {log.user_id ? log.user_id.slice(0, 8) : 'SYSTEM'}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                <FileJson size={16} />
                            </button>
                        </td>
                    </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                        <Shield className="mx-auto text-slate-200 mb-2" size={40} />
                        <p className="text-xs font-bold text-slate-400 uppercase">No audit logs found</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
