import React, { useState } from 'react';
import { useTenant, Tenant } from '../context/TenantContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { CreateTenantModal } from '../components/common/CreateTenantModal';
import { AIConfigModal } from '../components/common/AIConfigModal';
import { Building, Plus, ShieldCheck, Globe, DollarSign, Users, Layers, ExternalLink, Settings, ShieldAlert, CheckCircle } from 'lucide-react';

export const OrganizationManagementPage: React.FC = () => {
  const { tenants, currentTenant, switchTenant, addTenant } = useTenant();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAIConfigOpen, setIsAIConfigOpen] = useState(false);
  const [tenantList, setTenantList] = useState<Tenant[]>(tenants);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalPlatformBudget = tenantList.reduce((sum, t) => sum + t.annualBudget, 0);

  const toggleTenantStatus = (t: Tenant) => {
    const isCurrentlyActive = t.status === 'ACTIVE';
    const updatedList = tenantList.map(item => {
      if (item.tenantCode === t.tenantCode) {
        return {
          ...item,
          status: isCurrentlyActive ? ('SUSPENDED' as any) : ('ACTIVE' as any)
        };
      }
      return item;
    });
    setTenantList(updatedList);
    showToast(
      isCurrentlyActive
        ? `Tenant workspace "${t.name}" suspended by Super Admin.`
        : `Tenant workspace "${t.name}" reactivated successfully!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 border border-blue-500 text-white rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <CreateTenantModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(newT) => {
          addTenant(newT);
          setTenantList([newT, ...tenantList]);
          showToast(`Tenant "${newT.name}" onboarded into system.`);
        }}
      />

      <AIConfigModal
        isOpen={isAIConfigOpen}
        onClose={() => setIsAIConfigOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building className="w-7 h-7 text-blue-500" /> Multi-Tenant Organization &amp; SaaS Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">Global platform governance, multi-state government workspace management, and enterprise tenant provisioning</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIConfigOpen(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-purple-400" /> Configure AI Engine
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Onboard Tenant Workspace
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Onboarded Tenants</span>
          <div className="text-2xl font-black text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-400" /> {tenantList.length} Workspaces
          </div>
          <span className="text-[10px] text-slate-500">State Governments, Central Ministries &amp; Corporates</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total SaaS Monitored Budget</span>
          <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" /> ₹{(totalPlatformBudget / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-500">Combined Cross-Tenant Treasury Allocation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Currently Active Workspace</span>
          <div className="text-sm font-extrabold text-blue-400 truncate flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> {currentTenant.name}
          </div>
          <span className="text-[10px] font-mono text-slate-400">Code: {currentTenant.tenantCode} ({currentTenant.tenantType})</span>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tenantList.map((t) => {
          const isSelected = currentTenant.tenantCode === t.tenantCode;
          const isSuspended = (t.status as string) === 'SUSPENDED';

          return (
            <div
              key={t.id}
              className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-5 transition-all relative overflow-hidden ${
                isSelected ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-md">
                  ACTIVE WORKSPACE
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">{t.tenantCode} • {t.stateOrRegion}</span>
                  <h3 className="text-base font-extrabold text-white mt-1">{t.name}</h3>
                </div>
                {!isSelected && <StatusBadge status={t.status} />}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tenant Category</span>
                  <span className="font-bold text-slate-200">{t.tenantType.replace('_', ' ')}</span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Annual Treasury Grant</span>
                  <span className="font-bold text-emerald-400">₹{(t.annualBudget / 10000000).toFixed(2)} Cr</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span>{t.activeDepartmentsCount} Departments Active</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Super Admin Suspend Toggle */}
                  <button
                    onClick={() => toggleTenantStatus(t)}
                    title={isSuspended ? 'Reactivate Tenant' : 'Suspend Tenant'}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                      isSuspended
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {isSuspended ? 'Reactivate' : 'Suspend'}
                  </button>

                  {/* Switch Workspace */}
                  <button
                    onClick={() => switchTenant(t.tenantCode)}
                    disabled={isSelected}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-950 text-blue-400 border border-blue-800 opacity-80 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Switch Workspace'} <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
