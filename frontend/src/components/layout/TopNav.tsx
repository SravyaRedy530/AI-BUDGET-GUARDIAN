import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTenant } from '../../context/TenantContext';
import { Bell, LogOut, RotateCcw } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentTenant, clearCurrentTenantData } = useTenant();

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Telemetry Status Bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold text-emerald-400">AI Engine Online (v1.0)</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Reset / Clear Tenant Workspace Button */}
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to clear all data and reset the workspace for "${currentTenant.name}"? This action starts a 100% fresh clean application slate.`)) {
              clearCurrentTenantData();
            }
          }}
          title="Clear Application Data & Start Fresh"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-lg text-xs font-bold transition-all shadow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Workspace Data</span>
        </button>

        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
        </button>

        <div className="h-5 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-200">{user?.fullName}</p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg border border-transparent hover:border-rose-900 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
