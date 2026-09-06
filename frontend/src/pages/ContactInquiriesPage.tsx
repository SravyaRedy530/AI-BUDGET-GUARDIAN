import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import { StatusBadge } from '../components/common/StatusBadge';
import { Mail, CheckCircle2, Search, Filter, MessageSquare, Clock, User, Building, Send } from 'lucide-react';

interface ContactInquiry {
  id: string;
  fullName: string;
  email: string;
  organization?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
}

export const ContactInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const res = await apiClient.get('/contact-inquiries');
        if (res.data.success) {
          setInquiries(res.data.data || []);
          if (res.data.data.length > 0) {
            setSelectedInquiry(res.data.data[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load contact inquiries", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/contact-inquiries/${id}/status`, { status: newStatus }).catch(() => null);
      const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus as any } : inq));
      setInquiries(updated);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus as any });
      }
    } catch (e) {
      console.error("Failed to update status", e);
    }
  };

  const filteredInquiries = inquiries.filter(
    (inq) =>
      inq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inq.organization && inq.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Mail className="w-7 h-7 text-blue-500" /> Public Contact Inquiries &amp; Whistleblower Tips
          </h1>
          <p className="text-xs text-slate-400 mt-1">Super Admin portal viewer for public Contact Us submissions, whistleblower alerts, and enterprise onboarding queries</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search submitter name, email, organization, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Inquiries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inquiries Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" /> Received Submissions ({inquiries.length})
          </h3>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs">Loading contact submissions...</div>
            ) : (
              filteredInquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedInquiry?.id === inq.id
                      ? 'bg-blue-950/50 border-blue-600 shadow-md shadow-blue-600/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">{inq.fullName}</span>
                    <StatusBadge status={inq.status} />
                  </div>
                  <h4 className="text-xs font-bold text-blue-400 mt-2 truncate">{inq.subject}</h4>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                    <span className="truncate max-w-[160px]">{inq.organization || inq.email}</span>
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Inquiry Detail View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedInquiry ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">CATEGORY: {selectedInquiry.subject}</span>
                  <h2 className="text-lg font-extrabold text-white mt-1">{selectedInquiry.fullName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Email: <strong className="text-slate-200 font-mono">{selectedInquiry.email}</strong> • Organization: <strong className="text-slate-200">{selectedInquiry.organization || 'N/A'}</strong>
                  </p>
                </div>
                <StatusBadge status={selectedInquiry.status} />
              </div>

              {/* Message Details Card */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Submitted Public Message Body</label>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-500 font-mono">
                  Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'IN_REVIEW')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                  >
                    Mark In Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESOLVED')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Inquiry Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              Select a contact submission from the queue to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
