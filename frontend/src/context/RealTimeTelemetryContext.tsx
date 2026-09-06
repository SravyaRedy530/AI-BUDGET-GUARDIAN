import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  service: 'AI_ENGINE' | 'SPRING_GATEWAY' | 'SHAP_EXPLAINER' | 'FRAUD_INTERCEPTOR';
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface LiveNotification {
  id: string;
  title: string;
  description: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  amount: number;
  vendorName: string;
  timestamp: string;
}

interface RealTimeTelemetryContextType {
  isLiveStreaming: boolean;
  setIsLiveStreaming: (val: boolean) => void;
  telemetryLogs: TelemetryLog[];
  notifications: LiveNotification[];
  latestNotification: LiveNotification | null;
  dismissNotification: () => void;
  simulateLiveFraudEvent: () => void;
  liveStats: {
    totalMonitoredAmount: number;
    scannedInvoicesCount: number;
    interceptedFraudCount: number;
    latencyMs: number;
  };
}

const RealTimeTelemetryContext = createContext<RealTimeTelemetryContextType | undefined>(undefined);

export const RealTimeTelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      service: 'AI_ENGINE',
      message: 'FastAPI Isolation Forest model active on port 8000 (Latency: 12ms)',
      severity: 'INFO'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 2000).toLocaleTimeString(),
      service: 'SPRING_GATEWAY',
      message: 'JWT Token auto-validated for Lead Auditor session',
      severity: 'INFO'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
      service: 'SHAP_EXPLAINER',
      message: 'SHAP TreeExplainer pre-computed background baseline for FY2024-25',
      severity: 'INFO'
    }
  ]);

  const [notifications, setNotifications] = useState<LiveNotification[]>([]);
  const [latestNotification, setLatestNotification] = useState<LiveNotification | null>(null);

  const [liveStats, setLiveStats] = useState({
    totalMonitoredAmount: 1850450000.00,
    scannedInvoicesCount: 1482,
    interceptedFraudCount: 14,
    latencyMs: 14
  });

  // Background stream simulation loop
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // 1. Ticker log generation
      const services: TelemetryLog['service'][] = ['AI_ENGINE', 'SPRING_GATEWAY', 'SHAP_EXPLAINER', 'FRAUD_INTERCEPTOR'];
      const randomService = services[Math.floor(Math.random() * services.length)];
      
      const sampleMessages = [
        `Executed RapidFuzz string similarity check on vendor ledger [Match: ${(Math.random() * 20).toFixed(1)}%]`,
        `Spring Security 6 evaluated JWT authorization grant for endpoint /api/v1/invoices`,
        `Isolation Forest calculated anomaly score: ${(Math.random() * 0.3).toFixed(3)} (Threshold: 0.750)`,
        `SHAP explainer generated feature contribution vector for recent transaction`,
        `MinIO object store verified hash checksum for uploaded PDF metadata`
      ];

      const newLog: TelemetryLog = {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        service: randomService,
        message: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
        severity: 'INFO'
      };

      setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 19)]);

      // 2. Increment live stats continuously
      setLiveStats((prev) => ({
        ...prev,
        totalMonitoredAmount: prev.totalMonitoredAmount + Math.floor(Math.random() * 45000 + 5000),
        scannedInvoicesCount: prev.scannedInvoicesCount + (Math.random() > 0.6 ? 1 : 0),
        latencyMs: Math.floor(10 + Math.random() * 8)
      }));

    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Simulate Live Fraud Event Function
  const simulateLiveFraudEvent = () => {
    const randomVendor = ['Apex Highway Infra Corp', 'Shadow Infra Solutions', 'MedLife Pharma Supplies'][Math.floor(Math.random() * 3)];
    const amount = Math.floor(250000 + Math.random() * 4500000);
    const invoiceNum = `INV-2025-LIVE-${Math.floor(1000 + Math.random() * 9000)}`;

    const newNotif: LiveNotification = {
      id: String(Date.now()),
      title: `🚨 HIGH RISK FRAUD DETECTED: ${invoiceNum}`,
      description: `RapidFuzz duplicate match (97.8%) detected for ${randomVendor}. Amount: ₹${amount.toLocaleString('en-IN')}`,
      severity: 'CRITICAL',
      amount,
      vendorName: randomVendor,
      timestamp: new Date().toLocaleTimeString()
    };

    setLatestNotification(newNotif);
    setNotifications((prev) => [newNotif, ...prev]);

    // Update live telemetry stats
    setLiveStats((prev) => ({
      ...prev,
      interceptedFraudCount: prev.interceptedFraudCount + 1,
      scannedInvoicesCount: prev.scannedInvoicesCount + 1
    }));

    // Add critical telemetry log
    setTelemetryLogs((prev) => [
      {
        id: String(Date.now()),
        timestamp: new Date().toLocaleTimeString(),
        service: 'FRAUD_INTERCEPTOR',
        message: `CRITICAL ALERT: Intercepted duplicate billing attempt (${invoiceNum}) for ₹${amount.toLocaleString('en-IN')}`,
        severity: 'CRITICAL'
      },
      ...prev.slice(0, 19)
    ]);
  };

  const dismissNotification = () => {
    setLatestNotification(null);
  };

  return (
    <RealTimeTelemetryContext.Provider
      value={{
        isLiveStreaming,
        setIsLiveStreaming,
        telemetryLogs,
        notifications,
        latestNotification,
        dismissNotification,
        simulateLiveFraudEvent,
        liveStats
      }}
    >
      {children}
    </RealTimeTelemetryContext.Provider>
  );
};

export const useRealTimeTelemetry = () => {
  const context = useContext(RealTimeTelemetryContext);
  if (!context) {
    throw new Error('useRealTimeTelemetry must be used within a RealTimeTelemetryProvider');
  }
  return context;
};
