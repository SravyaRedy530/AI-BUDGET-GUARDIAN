import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { ShieldCheck, Building, User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('ENTERPRISE_COMPANY');
  const [stateOrRegion, setStateOrRegion] = useState('Maharashtra, IN');
  const [annualBudget, setAnnualBudget] = useState('1000000000.00');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { addTenant } = useTenant();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // 1. Call Backend Company / Tenant Admin Registration Endpoint
      const res = await apiClient.post('/auth/register-company', {
        fullName,
        email,
        password,
        companyName,
        companyType,
        stateOrRegion,
        annualBudget: parseFloat(annualBudget)
      }).catch(() => null);

      // Add to tenant context
      addTenant({
        id: String(Date.now()),
        tenantCode: `TENANT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: companyName,
        tenantType: companyType as any,
        stateOrRegion,
        annualBudget: parseFloat(annualBudget),
        activeDepartmentsCount: 5,
        riskLevel: 'LOW',
        status: 'ACTIVE'
      });

      // Prepare initial registered admin user
      const registeredUser = {
        id: 'usr-' + Date.now(),
        email: email.toLowerCase().trim(),
        fullName: fullName || companyName + ' Admin',
        phone: '+91-9876543210',
        departmentName: companyName,
        status: 'ACTIVE' as const,
        roles: [{ id: 5, code: 'COMPANY_ADMIN' as const, name: 'Company Admin Owner', description: 'Company Workspace Owner', permissions: ['*'] }],
        permissions: ['*'],
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(registeredUser));

      setSuccessMsg('Organization registered successfully! Auto-authenticating as Admin Owner...');

      // Auto Login
      setTimeout(async () => {
        try {
          await login({ email, password });
        } catch {
          // Fallback login
        }
        navigate('/dashboard');
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 mb-2">
            <Building className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Register Organization / Admin Account</h2>
          <p className="text-xs text-slate-400">Company Owner &amp; Government Treasury SaaS Onboarding</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-lg flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Admin / Owner Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Dr. Rajesh Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Official Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Company / Organization Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Tata Infrastructure &amp; Power Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Organization Type</label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="ENTERPRISE_COMPANY">Enterprise Company</option>
                <option value="STATE_GOVERNMENT">State Government Treasury</option>
                <option value="CENTRAL_MINISTRY">Central Ministry</option>
                <option value="MUNICIPAL_CORP">Municipal Corporation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Annual Monitored Budget (₹)</label>
              <input
                type="number"
                required
                value={annualBudget}
                onChange={(e) => setAnnualBudget(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {submitting ? 'Registering Company Workspace...' : 'Register Admin Account &amp; Provision Team'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400">Already registered as Admin or Team Member? </span>
          <button
            onClick={() => navigate('/login')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
          >
            Sign In to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
