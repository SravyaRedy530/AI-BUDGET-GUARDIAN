import React, { useState } from 'react';
import { History, Search, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs] = useState([
    { id: '1', email: 'admin@aibudget.gov.in', action: 'USER_LOGIN', type: 'USER', entityId: 'a1111111-1111', ip: '127.0.0.1', date: '2026-09-04 12:10:02', details: 'Successful login' },
    { id: '2', email: 'finance.officer@aibudget.gov.in', action: 'CREATE_PO', type: 'PURCHASE_ORDER', entityId: 'd3333333-4444', ip: '192.168.1.10', date: '2026-09-04 11:45:12', details: 'Created PO-INFRA-2025-009' },
    { id: '3', email: 'auditor@aibudget.gov.in', action: 'INVESTIGATE_CASE', type: 'FRAUD_CASE', entityId: 'fc111111-1111', ip: '192.168.1.15', date: '2026-09-04 10:20:00', details: 'Opened case CASE-2025-8801' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="w-7 h-7 text-blue-500" /> Immutable System Audit Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1">Complete audit trail capturing system activity, security actions, and state changes</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User Email</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Entity ID</th>
                <th className="p-4">IP Address</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-slate-400">{log.date}</td>
                  <td className="p-4 font-bold text-white">{log.email}</td>
                  <td className="p-4 font-mono text-blue-400">{log.action}</td>
                  <td className="p-4 text-slate-300">{log.type}</td>
                  <td className="p-4 font-mono text-slate-400">{log.entityId}</td>
                  <td className="p-4 font-mono text-slate-400">{log.ip}</td>
                  <td className="p-4 text-slate-300">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
