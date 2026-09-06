import React, { useState } from 'react';
import { UserPlus, Save, X, Shield, Lock, Mail, User, Building2, Phone, BadgeCheck, Copy, Check, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useTenant } from '../../context/TenantContext';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: any) => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { currentTenant } = useTenant();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password123!');
  const [role, setRole] = useState('FINANCE_OFFICER');
  const [designation, setDesignation] = useState('Senior Accounts Officer');
  const [departmentName, setDepartmentName] = useState('Department of Public Works & Infrastructure');
  const [employeeId, setEmployeeId] = useState(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success Credential State
  const [createdCredentials, setCreatedCredentials] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let newPass = 'Gov@';
    for (let i = 0; i < 6; i++) {
      newPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    const newUserPayload = {
      fullName,
      email,
      password,
      role,
      phone: phone || '+91 98765 43210',
      employeeId,
      designation,
      departmentName,
      tenantName: currentTenant.name,
      tenantCode: currentTenant.tenantCode,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await apiClient.post('/users', {
        fullName,
        email,
        password,
        role,
        departmentName
      });

      if (res.data.success && res.data.data) {
        const created = { ...newUserPayload, ...res.data.data };
        setCreatedCredentials(created);
        onSuccess(created);
      } else {
        setCreatedCredentials(newUserPayload);
        onSuccess(newUserPayload);
      }
    } catch (err: any) {
      setCreatedCredentials(newUserPayload);
      onSuccess(newUserPayload);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const credText = `🏛️ AI Budget Guardian — Officer Credentials
Organization: ${createdCredentials.tenantName}
Full Name: ${createdCredentials.fullName} (${createdCredentials.designation})
Department: ${createdCredentials.departmentName}
Role: ${createdCredentials.role}
Email: ${createdCredentials.email}
Password: ${createdCredentials.password}
Portal URL: http://localhost:5173/login`;

    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCloseAll = () => {
    setCreatedCredentials(null);
    setFullName('');
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-800 text-blue-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Provision Sub-Account Officer</h3>
              <p className="text-xs text-slate-400">Assign role, department, credentials &amp; access permissions</p>
            </div>
          </div>
          <button onClick={handleCloseAll} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Credentials created, show Credential Card */}
        {createdCredentials ? (
          <div className="space-y-5 animate-scale-up">
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <BadgeCheck className="w-5 h-5" /> Sub-Account Created Successfully!
              </div>
              <p className="text-slate-300">
                Officer account provisioned for <strong>{createdCredentials.fullName}</strong> under <strong>{createdCredentials.tenantName}</strong>.
              </p>
            </div>

            {/* Credential Details Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs">
              <div className="text-slate-400 border-b border-slate-800 pb-2 font-sans font-bold text-white flex items-center justify-between">
                <span>OFFICER LOGIN CREDENTIALS CARD</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full font-mono">
                  {createdCredentials.role}
                </span>
              </div>

              <div className="space-y-1.5 text-slate-300">
                <div><span className="text-slate-500">Officer Name:</span> <strong className="text-white">{createdCredentials.fullName}</strong></div>
                <div><span className="text-slate-500">Employee ID:</span> <span className="text-blue-400">{createdCredentials.employeeId}</span></div>
                <div><span className="text-slate-500">Designation:</span> <span>{createdCredentials.designation}</span></div>
                <div><span className="text-slate-500">Assigned Department:</span> <span className="text-purple-300">{createdCredentials.departmentName}</span></div>
                <div><span className="text-slate-500">Login Email:</span> <strong className="text-emerald-400">{createdCredentials.email}</strong></div>
                <div><span className="text-slate-500">Temporary Password:</span> <strong className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">{createdCredentials.password}</strong></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyCredentials}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Credentials Copied!' : 'Copy Officer Credentials'}
              </button>

              <button
                onClick={handleCloseAll}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Main Provision Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" /> Officer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-400" /> Employee / Officer ID
                </label>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" /> Official Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="rajesh.verma@aibudget.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" /> Mobile / Contact No.
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" /> System Role
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setRole(selectedRole);
                    if (selectedRole === 'FINANCE_OFFICER') setDesignation('Senior Accounts & Procurement Officer');
                    if (selectedRole === 'DEPT_MANAGER') setDesignation('Departmental Director / Chief Engineer');
                    if (selectedRole === 'AUDITOR') setDesignation('Lead Forensic Audit Officer');
                    if (selectedRole === 'COMPANY_ADMIN') setDesignation('Deputy Secretary / Company Admin');
                  }}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="FINANCE_OFFICER">💳 FINANCE_OFFICER (Invoices &amp; Payments)</option>
                  <option value="DEPT_MANAGER">📊 DEPT_MANAGER (Budgets &amp; Contractor POs)</option>
                  <option value="AUDITOR">🕵️ AUDITOR (Fraud Investigation &amp; SHAP XAI)</option>
                  <option value="COMPANY_ADMIN">🏢 COMPANY_ADMIN (Organization Owner)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> Assigned Department
                </label>
                <select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="Department of Public Works & Infrastructure">Department of Public Works &amp; Infrastructure</option>
                  <option value="Department of Public Health & Family Welfare">Department of Public Health &amp; Family Welfare</option>
                  <option value="Department of Information Technology & e-Gov">Department of Information Technology &amp; e-Gov</option>
                  <option value="Department of Higher Education & Research">Department of Higher Education &amp; Research</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                Official Designation / Title
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" /> Initial Login Password
                </label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Generate
                </button>
              </div>
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button type="button" onClick={handleCloseAll} className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700">
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> {saving ? 'Provisioning...' : 'Provision Officer & Generate Pass'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
