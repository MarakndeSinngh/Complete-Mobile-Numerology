import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Check,
  Copy,
  AlertCircle,
  Filter,
  UserCheck,
  FileText
} from 'lucide-react';
import { ReportAccessService } from '../services/reportAccessService';

export interface UPIAdminVerificationPanelProps {
  onEntitlementUpdated?: () => void;
}

export const UPIAdminVerificationPanel: React.FC<UPIAdminVerificationPanelProps> = ({
  onEntitlementUpdated,
}) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ReportAccessService.getAdminUpiPayments();
      if (res.success && res.payments) {
        setPayments(res.payments);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch payment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleAction = async (paymentId: string, action: 'VERIFY' | 'REJECT') => {
    setActionLoadingId(paymentId);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await ReportAccessService.verifyAdminUpiPayment(
        paymentId,
        action,
        `Admin action by system on ${new Date().toLocaleTimeString()}`,
        'admin_master'
      );

      if (res.success) {
        setSuccessMsg(res.message);
        await loadPayments();
        if (onEntitlementUpdated) {
          onEntitlementUpdated();
        }
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setError('Action failed to execute.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to execute payment status change.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedUtr(text);
      setTimeout(() => setCopiedUtr(null), 2000);
    } catch {
      // Fallback
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING_VERIFICATION' && (p.status === 'PENDING_VERIFICATION' || p.status === 'CREATED')) ||
      p.status === filterStatus;

    const matchesSearch =
      !searchTerm ||
      p.utr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile?.includes(searchTerm) ||
      p.userId?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = payments.filter(
    (p) => p.status === 'PENDING_VERIFICATION' || p.status === 'CREATED'
  ).length;

  return (
    <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-600" />
            <h3 className="font-playfair text-xl font-bold text-slate-900">
              UPI Payment Verification Hub
            </h3>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-xs font-bold animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review submitted 12-digit UTRs and approve ₹33 Master Report entitlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPayments}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors border border-amber-200 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh List</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['ALL', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Transactions' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by UTR, Email, Phone..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 outline-hidden focus:border-amber-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">User Details</th>
              <th className="py-3 px-4">Report</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">UTR / Transaction ID</th>
              <th className="py-3 px-4">Submission Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Verification Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-600" />
                  Loading payment records...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No payment submissions found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredPayments.map((tx) => {
                const isPending = tx.status === 'PENDING_VERIFICATION' || tx.status === 'CREATED';
                const isVerified = tx.status === 'VERIFIED' || tx.status === 'PAID';
                const isRejected = tx.status === 'REJECTED';
                const isActionBusy = actionLoadingId === tx.id;

                return (
                  <tr key={tx.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{tx.email || 'Anonymous User'}</div>
                      {tx.mobile && <div className="text-[11px] text-slate-500">{tx.mobile}</div>}
                      <div className="text-[10px] font-mono text-slate-400">{tx.userId}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold">
                        {tx.reportType || 'MASTER_REPORT'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#B45309] font-mono">
                      ₹{tx.amount || 33}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 tracking-wider bg-slate-100 px-2 py-1 rounded-md text-xs">
                          {tx.utr || tx.razorpayOrderId || '—'}
                        </span>
                        {tx.utr && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(tx.utr)}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="Copy UTR"
                          >
                            {copiedUtr === tx.utr ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString('en-IN') : '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold font-mono">
                          <Clock className="w-3 h-3 animate-spin" />
                          PENDING
                        </span>
                      )}
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-mono">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          VERIFIED
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold font-mono">
                          <XCircle className="w-3 h-3 text-red-600" />
                          REJECTED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={isActionBusy}
                            onClick={() => handleAction(tx.id, 'VERIFY')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            {isActionBusy ? '...' : 'Verify & Unlock'}
                          </button>
                          <button
                            type="button"
                            disabled={isActionBusy}
                            onClick={() => handleAction(tx.id, 'REJECT')}
                            className="px-2.5 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 font-medium text-[11px] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {isVerified && (
                        <span className="text-[11px] text-emerald-700 font-medium">
                          Entitlement Active ✓
                        </span>
                      )}
                      {isRejected && (
                        <button
                          type="button"
                          disabled={isActionBusy}
                          onClick={() => handleAction(tx.id, 'VERIFY')}
                          className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-[10px] font-bold border border-slate-200 transition-colors"
                        >
                          Re-Verify
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
