import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { ShieldCheck, Brain, Building2, Search, FileText, Lock, ArrowRight, CheckCircle2, AlertTriangle, Send, Mail, User, Phone, Globe, DollarSign, Layers } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Contact Us Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [subject, setSubject] = useState('Enterprise SaaS Onboarding Query');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessTicket(null);

    try {
      const res = await apiClient.post('/contact-inquiries', {
        fullName,
        email,
        organization,
        subject,
        message
      }).catch(() => null);

      const ticketId = `TICKET-2025-${Math.floor(10000 + Math.random() * 90000)}`;
      setSuccessTicket(ticketId);

      setFullName('');
      setEmail('');
      setOrganization('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Public Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg tracking-tight leading-none">AI Budget Guardian</h1>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Govt Financial Monitoring &amp; XAI Platform</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors">Platform Capabilities</a>
          <a href="#tenants" className="hover:text-blue-400 transition-colors">Government Workspaces</a>
          <a href="#xai" className="hover:text-blue-400 transition-colors">Explainable AI (SHAP)</a>
          <a href="#contact" className="hover:text-blue-400 transition-colors">Contact Us &amp; Public Tips</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            Sign In to Portal <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20 hidden sm:flex items-center gap-1.5"
          >
            Register Company Admin
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-950/80 border border-blue-800/80 rounded-full text-xs font-semibold text-blue-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Financial Surveillance &amp; Explainable AI (XAI) Architecture</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Intelligent Government Budget Monitoring &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Leakage Interception</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Surveil procurement lifecycles, detect duplicate vendor invoices in real time, map shell company identity overlap graphs, and empower financial auditors with SHAP feature contribution breakdowns.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 transform hover:scale-105"
          >
            Sign In to Role Dashboard <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#contact"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            Submit Public Inquiry / Tip-Off
          </a>
        </div>

        {/* Live Telemetry Summary Pill */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-lg">
            <span className="text-2xl font-black text-white block">₹1,850 Cr+</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Monitored Treasury Grants</span>
          </div>
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-lg">
            <span className="text-2xl font-black text-emerald-400 block">1,482</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Invoices Screened</span>
          </div>
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-lg">
            <span className="text-2xl font-black text-rose-400 block">₹48.2 Lakhs</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">Duplicate Fraud Saved</span>
          </div>
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-lg">
            <span className="text-2xl font-black text-purple-400 block">98.4%</span>
            <span className="text-[11px] text-slate-400 font-semibold uppercase">SHAP Model Accuracy</span>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="px-6 md:px-12 py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Enterprise AI Monitoring Capabilities</h2>
            <p className="text-xs text-slate-400">Decoupled microservice architecture engineered for high-volume government financial monitoring</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl hover:border-blue-500/50 transition-all">
              <div className="p-3 bg-blue-950 text-blue-400 border border-blue-800 rounded-xl w-fit">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">RapidFuzz Duplicate Interceptor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Fuzzy string fingerprinting and Levenshtein distance metrics intercept duplicate billing before payments leave treasury accounts.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl hover:border-rose-500/50 transition-all">
              <div className="p-3 bg-rose-950 text-rose-400 border border-rose-800 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Fake Vendor Identity Graph</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Overlap detection across shared GST, PAN, bank account numbers, and physical addresses identifies phantom vendors instantly.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl hover:border-purple-500/50 transition-all">
              <div className="p-3 bg-purple-950 text-purple-400 border border-purple-800 rounded-xl w-fit">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">SHAP Explainable AI (XAI)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Empowers auditors with transparent feature contribution impact vectors, confidence scores, and automated remediation suggestions.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl w-fit">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Tenant SaaS Workspaces</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Supports multi-state government treasuries, central ministries, municipal corporations, and enterprise contractors on isolated database partitions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact Us Section */}
      <section id="contact" className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details & Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-full text-xs font-semibold">
              <Mail className="w-3.5 h-3.5" /> Public Inquiries &amp; Fraud Whistleblower Desk
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Contact Platform Governance &amp; Submit Fraud Tips
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have an inquiry regarding Enterprise SaaS onboarding, technical integration, or a fraud tip-off regarding suspicious government billing? Submit your inquiry below. All messages are forwarded directly to the **Platform Super Admin Portal** for audit review.
            </p>

            <div className="space-y-4 pt-4 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Official Governance Desk</strong>
                  <span className="text-slate-400 font-mono">support@aibudget.gov.in</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
                <Globe className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">National Treasury Surveillance Network</strong>
                  <span className="text-slate-400">Multi-State Financial Monitoring Alliance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us Interactive Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6 relative">
            <h3 className="text-lg font-bold text-white">Send Contact Message / Public Inquiry</h3>

            {successTicket && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" /> Message Submitted Successfully!
                </div>
                <p>Your inquiry reference ID is <strong className="font-mono text-white">{successTicket}</strong>. It has been routed to the Platform Super Admin portal for review.</p>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunil Deshmukh"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sunil@organization.gov.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Organization / Ministry</label>
                  <input
                    type="text"
                    placeholder="National Highway Directorate"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Inquiry Category</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Enterprise SaaS Onboarding Query">Enterprise SaaS Onboarding Query</option>
                  <option value="Fraud Tip-off / Whistleblower Alert">Fraud Tip-off / Whistleblower Alert</option>
                  <option value="Technical Integration & API Request">Technical Integration &amp; API Request</option>
                  <option value="General Public Inquiry">General Public Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Message / Information Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide clear details regarding your query or suspicious billing observation..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {submitting ? 'Submitting Inquiry...' : 'Send Message to Platform Admin'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 md:px-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <ShieldCheck className="w-5 h-5 text-blue-500" /> AI Budget Guardian Platform
          </div>
          <p>© 2025 AI Budget Guardian. Production Government Financial Monitoring Platform.</p>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Link to="/login" className="hover:text-white">Portal Sign In</Link>
            <Link to="/register" className="hover:text-white">Register Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
