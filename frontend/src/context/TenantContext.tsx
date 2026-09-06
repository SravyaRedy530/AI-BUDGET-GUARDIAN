import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export interface Tenant {
  id: string;
  tenantCode: string;
  name: string;
  tenantType: 'STATE_GOVERNMENT' | 'CENTRAL_MINISTRY' | 'MUNICIPAL_CORP' | 'ENTERPRISE_COMPANY';
  stateOrRegion: string;
  annualBudget: number;
  activeDepartmentsCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'SUSPENDED';
}

const SEED_TENANTS: Tenant[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    tenantCode: 'GOV-KA',
    name: 'Karnataka State Treasury & Financial Department',
    tenantType: 'STATE_GOVERNMENT',
    stateOrRegion: 'Karnataka, IN',
    annualBudget: 1850000000.00,
    activeDepartmentsCount: 8,
    riskLevel: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    tenantCode: 'GOV-MH',
    name: 'Maharashtra Public Works & Finance Ministry',
    tenantType: 'STATE_GOVERNMENT',
    stateOrRegion: 'Maharashtra, IN',
    annualBudget: 2400000000.00,
    activeDepartmentsCount: 12,
    riskLevel: 'MEDIUM',
    status: 'ACTIVE'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    tenantCode: 'CENTRAL-MOF',
    name: 'Ministry of Finance & Department of Expenditure',
    tenantType: 'CENTRAL_MINISTRY',
    stateOrRegion: 'New Delhi, Central',
    annualBudget: 5000000000.00,
    activeDepartmentsCount: 24,
    riskLevel: 'LOW',
    status: 'ACTIVE'
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    tenantCode: 'ENTERPRISE-TATA',
    name: 'Tata Infrastructure Enterprise SaaS Portal',
    tenantType: 'ENTERPRISE_COMPANY',
    stateOrRegion: 'Global Corporate',
    annualBudget: 950000000.00,
    activeDepartmentsCount: 6,
    riskLevel: 'LOW',
    status: 'ACTIVE'
  }
];

interface TenantContextType {
  tenants: Tenant[];
  currentTenant: Tenant;
  switchTenant: (tenantCode: string) => void;
  addTenant: (newTenant: Tenant) => void;
  clearCurrentTenantData: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem('company_tenants_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge seed tenants with saved custom company tenants
        const codes = new Set(parsed.map((t: Tenant) => t.tenantCode));
        const missing = SEED_TENANTS.filter(st => !codes.has(st.tenantCode));
        return [...parsed, ...missing];
      }
    } catch (e) {
      console.error(e);
    }
    return SEED_TENANTS;
  });

  const [currentTenant, setCurrentTenant] = useState<Tenant>(() => {
    try {
      const savedCode = localStorage.getItem('active_tenant_code');
      const savedList = localStorage.getItem('company_tenants_list');
      const all: Tenant[] = savedList ? JSON.parse(savedList) : SEED_TENANTS;
      const found = all.find((t: Tenant) => t.tenantCode === savedCode);
      if (found) return found;
    } catch (e) {
      console.error(e);
    }
    return SEED_TENANTS[0];
  });

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const res = await apiClient.get('/tenants');
        if (res.data.success && res.data.data.length > 0) {
          const apiTenants: Tenant[] = res.data.data;
          setTenants((prev) => {
            const apiCodes = new Set(apiTenants.map(t => t.tenantCode));
            const customOnly = prev.filter(p => !apiCodes.has(p.tenantCode));
            const merged = [...customOnly, ...apiTenants];
            localStorage.setItem('company_tenants_list', JSON.stringify(merged));
            return merged;
          });
          const savedCode = localStorage.getItem('active_tenant_code');
          const found = apiTenants.find((t: Tenant) => t.tenantCode === savedCode);
          if (found) setCurrentTenant(found);
        }
      } catch (e) {
        console.error("Using local multi-tenant list", e);
      }
    };
    fetchTenants();
  }, []);

  const switchTenant = (tenantCode: string) => {
    const target = tenants.find((t) => t.tenantCode === tenantCode);
    if (target) {
      setCurrentTenant(target);
      localStorage.setItem('active_tenant_code', tenantCode);
    }
  };

  const addTenant = (newTenant: Tenant) => {
    setTenants((prev) => {
      const updated = [newTenant, ...prev.filter(t => t.tenantCode !== newTenant.tenantCode)];
      localStorage.setItem('company_tenants_list', JSON.stringify(updated));
      return updated;
    });
    setCurrentTenant(newTenant);
    localStorage.setItem('active_tenant_code', newTenant.tenantCode);
  };

  const clearCurrentTenantData = () => {
    if (currentTenant) {
      const code = currentTenant.tenantCode;
      localStorage.removeItem(`depts_${code}`);
      localStorage.removeItem(`budgets_${code}`);
      localStorage.removeItem(`invoices_${code}`);
      localStorage.removeItem(`pos_${code}`);
      localStorage.removeItem(`payments_${code}`);
      localStorage.removeItem(`vendors_${code}`);
      localStorage.removeItem(`contractors_${code}`);
      localStorage.removeItem(`users_${code}`);
      localStorage.removeItem(`duplicates_${code}`);
      localStorage.removeItem(`vendor_risks_${code}`);
      window.location.reload();
    }
  };

  return (
    <TenantContext.Provider value={{ tenants, currentTenant, switchTenant, addTenant, clearCurrentTenantData }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
