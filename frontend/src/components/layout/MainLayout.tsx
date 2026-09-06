import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { LiveTelemetryTicker } from '../common/LiveTelemetryTicker';
import { LiveNotificationToast } from '../common/LiveNotificationToast';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 relative pb-12">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <LiveNotificationToast />
      <LiveTelemetryTicker />
    </div>
  );
};
