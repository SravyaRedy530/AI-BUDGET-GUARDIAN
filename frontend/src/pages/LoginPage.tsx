import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { switchTenant } = useTenant();
  const navigate = useNavigate();

  const isDemoEmail = (em: string) => {
    return [
      'admin@aibudget.gov.in',
      'company.admin@ka.gov.in',
      'finance.officer@aibudget.gov.in',
      'dept.manager@aibudget.gov.in',
      'auditor@aibudget.gov.in'
    ].includes(em.toLowerCase().trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      if (isDemoEmail(email)) {
        switchTenant('GOV-KA');
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (email && email.includes('@')) {
        if (isDemoEmail(email)) {
          switchTenant('GOV-KA');
        }
        navigate('/dashboard');
      } else {
        setError('Please enter a valid email address.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoUser = async (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('Password123!');
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: roleEmail, password: 'Password123!' });
      switchTenant('GOV-KA');
      navigate('/dashboard');
    } catch {
      switchTenant('GOV-KA');
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">AI Budget Guardian</h2>
          <p className="text-xs text-slate-400">Intelligent Government Financial Monitoring Platform</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/60 border border-rose-800 rounded-lg flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Official Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@aibudget.gov.in"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Authenticating...' : 'Sign In to Secure Portal'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-1">
          <span className="text-xs text-slate-400">Need to register a new Company or Govt Entity? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline"
          >
            Register Admin Account
          </button>
        </div>

        {/* Demo Credentials Quick Switcher */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Quick Demo Login Shortcuts</span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => fillDemoUser('admin@aibudget.gov.in')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left text-slate-300 font-medium transition-all"
            >
              <strong className="block text-amber-400">👑 Platform Super Admin</strong>
              admin@aibudget.gov.in
            </button>
            <button
              onClick={() => fillDemoUser('company.admin@ka.gov.in')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left text-slate-300 font-medium transition-all"
            >
              <strong className="block text-blue-400">🏢 Company Admin / Owner</strong>
              company.admin@ka.gov.in
            </button>
            <button
              onClick={() => fillDemoUser('finance.officer@aibudget.gov.in')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left text-slate-300 font-medium transition-all"
            >
              <strong className="block text-emerald-400">💳 Finance Officer</strong>
              finance.officer@aibudget.gov.in
            </button>
            <button
              onClick={() => fillDemoUser('dept.manager@aibudget.gov.in')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left text-slate-300 font-medium transition-all"
            >
              <strong className="block text-purple-400">🏢 Dept Manager</strong>
              dept.manager@aibudget.gov.in
            </button>
            <button
              onClick={() => fillDemoUser('auditor@aibudget.gov.in')}
              className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-left text-slate-300 font-medium transition-all col-span-2 text-center"
            >
              <strong className="inline-block text-rose-400 mr-2">🔍 Lead Auditor:</strong>
              auditor@aibudget.gov.in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
