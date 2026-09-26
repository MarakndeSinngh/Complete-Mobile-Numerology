import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CreditCard,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Printer,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Gift,
  RefreshCw,
  Phone,
  ArrowRight,
  Shield,
  Layers,
  Award,
  ChevronRight,
} from 'lucide-react';
import {
  CanonicalReportType,
  REPORT_REGISTRY,
  UserReportItem,
  PaymentHistoryItem,
  UserAccessSummary,
  MY_REPORTS_I18N,
  MyReportsI18nEntry,
} from '../types/reportAccess';
import { ReportAccessService } from '../services/reportAccessService';
import { useLanguage } from '../i18n';
import { formatLocalizedDate } from '../utils/localeUtils';
import { BrandLogo } from './BrandLogo';
import { NavPortalId } from './MasterNavigation';
import { ReportPaywallModal } from './ReportPaywallModal';

export interface MyReportsHubProps {
  onNavigatePortal: (portalId: NavPortalId) => void;
  onOpenProfileModal?: () => void;
}

export const MyReportsHub: React.FC<MyReportsHubProps> = ({
  onNavigatePortal,
  onOpenProfileModal,
}) => {
  const { language } = useLanguage();
  const i18n: MyReportsI18nEntry = MY_REPORTS_I18N[language] || MY_REPORTS_I18N.hi;

  const [activeTab, setActiveTab] = useState<'REPORTS' | 'PAYMENTS' | 'ENTITLEMENTS'>('REPORTS');
  const [reports, setReports] = useState<UserReportItem[]>([]);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [summary, setSummary] = useState<UserAccessSummary | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

  // Auth / Login Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const storedUser = ReportAccessService.getStoredUser();
  const userMobile = storedUser?.mobile || '';
  const isVerified = !!storedUser?.mobileVerified;

  // Load user data from server (Authoritative server-side persistence)
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reportsRes, paymentsRes, summaryRes] = await Promise.all([
        ReportAccessService.getMyReports(userMobile),
        ReportAccessService.getPaymentHistory(userMobile),
        ReportAccessService.getAccessSummary(userMobile),
      ]);

      if (reportsRes && Array.isArray(reportsRes.reports)) {
        setReports(reportsRes.reports);
      }
      if (paymentsRes && Array.isArray(paymentsRes.payments)) {
        setPayments(paymentsRes.payments);
      }
      if (summaryRes && summaryRes.summary) {
        setSummary(summaryRes.summary);
      }
    } catch (err: any) {
      console.warn("Notice: Error fetching customer reports from server:", err);
      setError(i18n.errorLoading);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userMobile, isVerified]);

  // Map canonical report type to NavPortalId
  const getPortalIdForReport = (reportType: CanonicalReportType): NavPortalId => {
    switch (reportType) {
      case 'MOBILE_NUMEROLOGY':
        return 'MOBILE_NUMEROLOGY';
      case 'LOSHU':
        return 'CORE_LOSHU';
      case 'MASTER_REPORT':
        return 'MASTER_REPORT';
      case 'NAME_NUMEROLOGY':
        return 'NAME_NUMEROLOGY';
      case 'MARRIAGE':
        return 'MARRIAGE_COMPATIBILITY';
      case 'VEHICLE':
        return 'PREMIUM_VEHICLE';
      case 'HOUSE_FLAT':
        return 'PREMIUM_HOUSE';
      case 'BUSINESS':
        return 'PREMIUM_BUSINESS';
      case 'SIGNATURE_AUDIT':
        return 'PREMIUM_SIGNATURE';
      case 'CHILD_NAMES':
        return 'PREMIUM_CHILD';
      case 'LUCKY_DATES':
        return 'PREMIUM_LUCKY_DATES';
      case 'MEDICAL_NUMEROLOGY':
        return 'PREMIUM_MEDICAL';
      case 'VASTU':
        return 'PREMIUM_VAASTU';
      case 'DASHA':
      case 'YEAR_FORECAST':
        return 'PREMIUM_DASHA';
      default:
        return 'HOME';
    }
  };

  // Open Report Handler with Server Re-verification
  const handleOpenReport = async (item: UserReportItem) => {
    try {
      // Re-verify server entitlement
      await ReportAccessService.checkAccess(item.reportType, item.profileKey, userMobile);
      const portalId = getPortalIdForReport(item.reportType);
      onNavigatePortal(portalId);
    } catch (e) {
      // If access fails, open portal where gate modal will prompt
      const portalId = getPortalIdForReport(item.reportType);
      onNavigatePortal(portalId);
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Search filter
      const title =
        language === 'hi'
          ? item.titleHi
          : language === 'mr'
          ? item.titleMr
          : language === 'bn'
          ? item.titleBn
          : language === 'gu'
          ? item.titleGu
          : item.titleEn;

      const matchesSearch =
        searchQuery.trim() === '' ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.profileKey.toLowerCase().includes(searchQuery.toLowerCase());

      // Access type filter
      let matchesType = true;
      if (filterType === 'FREE') {
        matchesType = item.accessType === 'FREE' || item.accessType === 'ALWAYS_FREE';
      } else if (filterType === 'PAID') {
        matchesType = item.accessType === 'PAID';
      }

      return matchesSearch && matchesType;
    });
  }, [reports, searchQuery, filterType, language]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 text-left font-sans">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border-2 border-amber-300/80 rounded-[32px] p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 text-[#92400E] border border-amber-300 px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5 text-[#D97706]" />
            LeoFamily Client Hub
          </div>
          <h2 className="font-playfair text-2xl md:text-3xl font-black text-[#1F2937] leading-tight">
            {i18n.myReportsTitle}
          </h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl leading-relaxed">
            {i18n.myReportsSubtitle}
          </p>
        </div>

        {/* User Identity / Verification Status Card */}
        <div className="bg-white/90 backdrop-blur-xs border border-amber-200 p-4 rounded-2xl shadow-xs space-y-2 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Account Identity</span>
            {isVerified ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <AlertCircle className="w-3 h-3" /> Guest
              </span>
            )}
          </div>
          <div className="font-mono text-sm font-bold text-slate-800">
            {userMobile ? `+91 ${userMobile}` : 'No Mobile Linked'}
          </div>
          {!isVerified ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-[#D97706] hover:bg-[#B45309] text-white text-[11px] font-bold py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3 h-3" />
              <span>{i18n.verifyNowBtn}</span>
            </button>
          ) : (
            <button
              onClick={fetchUserData}
              className="text-[10px] font-mono text-[#92400E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{i18n.refreshBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs (Reports, Payments, Entitlements) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'REPORTS'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{i18n.tabReports}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono font-bold">
            {reports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'PAYMENTS'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{i18n.tabPayments}</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono font-bold">
            {payments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ENTITLEMENTS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ENTITLEMENTS'
              ? 'bg-[#D97706] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{i18n.tabEntitlements}</span>
        </button>
      </div>

      {/* Error Message if fetch failed */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-700">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchUserData}
            className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer"
          >
            {i18n.retryBtn}
          </button>
        </div>
      )}

      {/* TAB 1: MY REPORTS LIST */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={i18n.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#D97706]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'ALL'
                    ? 'bg-amber-100 text-[#92400E] font-bold border border-amber-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i18n.filterAll}
              </button>
              <button
                onClick={() => setFilterType('FREE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'FREE'
                    ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i18n.filterFree}
              </button>
              <button
                onClick={() => setFilterType('PAID')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  filterType === 'PAID'
                    ? 'bg-amber-100 text-[#92400E] font-bold border border-amber-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {i18n.filterPaid}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
              <RefreshCw className="w-8 h-8 text-[#D97706] animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-mono">{i18n.loadingHistory}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-6 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-playfair font-bold text-lg text-slate-800">
                  {i18n.noReportsYet}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {i18n.noReportsDesc}
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => onNavigatePortal('MOBILE_NUMEROLOGY')}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  📱 {language === 'hi' ? 'मोबाइल स्कैनर (100% मुफ़्त)' : 'Mobile Scanner (Free)'}
                </button>
                <button
                  onClick={() => onNavigatePortal('MASTER_REPORT')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  🎁 {i18n.generateFirstFreeBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Reports Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReports.map((item) => {
                const title =
                  language === 'hi'
                    ? item.titleHi
                    : language === 'mr'
                    ? item.titleMr
                    : language === 'bn'
                    ? item.titleBn
                    : language === 'gu'
                    ? item.titleGu
                    : item.titleEn;

                const def = REPORT_REGISTRY[item.reportType];
                const isPaid = item.accessType === 'PAID';
                const isAlwaysFree = item.accessType === 'ALWAYS_FREE';

                return (
                  <div
                    key={item.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-amber-300 shadow-xs hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Badge Header */}
                      <div className="flex items-center justify-between gap-2">
                        {isAlwaysFree ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            {i18n.alwaysFreeBadge}
                          </span>
                        ) : isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                            <CreditCard className="w-3 h-3 text-[#D97706]" />
                            {i18n.paidBadge}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                            <Gift className="w-3 h-3 text-emerald-600" />
                            {i18n.complimentaryBadge}
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-400">
                          {formatLocalizedDate(new Date(item.createdAt), language)}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-playfair font-bold text-base text-slate-800 leading-snug">
                          {title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {language === 'hi' ? def?.descriptionHi : def?.descriptionEn}
                        </p>
                      </div>

                      {/* Profile Key & ID Metadata */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500 space-y-0.5">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Profile Key:</span>
                          <span className="font-bold text-slate-700 truncate max-w-[160px]">{item.profileKey}</span>
                        </div>
                        {item.paymentId && (
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payment ID:</span>
                            <span className="text-amber-800 font-bold">{item.paymentId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReport(item)}
                        className="flex-1 bg-[#D97706] hover:bg-[#B45309] text-white py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{i18n.viewReportBtn}</span>
                      </button>

                      <button
                        onClick={() => handleOpenReport(item)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer"
                        title={i18n.downloadPdfBtn}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenReport(item)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs transition cursor-pointer"
                        title={i18n.printBtn}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENT HISTORY */}
      {activeTab === 'PAYMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-playfair text-xl font-bold text-slate-800">
              {i18n.paymentHistoryTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {i18n.paymentHistorySubtitle}
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <RefreshCw className="w-6 h-6 text-[#D97706] animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-mono">{i18n.loadingHistory}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No payment transactions found for this account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">{i18n.dateCol}</th>
                    <th className="py-3 px-3">{i18n.reportCol}</th>
                    <th className="py-3 px-3">{i18n.amountCol}</th>
                    <th className="py-3 px-3">{i18n.statusCol}</th>
                    <th className="py-3 px-3">{i18n.referenceCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => {
                    const def = REPORT_REGISTRY[p.reportType];
                    const title =
                      language === 'hi'
                        ? def?.titleHi
                        : language === 'mr'
                        ? def?.titleMr
                        : language === 'bn'
                        ? def?.titleBn
                        : language === 'gu'
                        ? def?.titleGu
                        : def?.titleEn || p.reportType;

                    return (
                      <tr key={p.id} className="hover:bg-amber-50/40 transition">
                        <td className="py-3.5 px-3 font-mono text-slate-600">
                          {formatLocalizedDate(new Date(p.createdAt), language)}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-800">
                          {title}
                        </td>
                        <td className="py-3.5 px-3 font-bold font-mono text-slate-900">
                          ₹{p.amount}
                        </td>
                        <td className="py-3.5 px-3">
                          {p.status === 'PAID' || p.status === 'CAPTURED' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Paid
                            </span>
                          ) : p.status === 'FREE' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <Gift className="w-3 h-3" /> Free
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                              <AlertCircle className="w-3 h-3" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                          {p.paymentReference}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ENTITLEMENT CENTER & PRICING RULES */}
      {activeTab === 'ENTITLEMENTS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-slate-800">
                {i18n.entitlementCenterTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {i18n.entitlementCenterSubtitle}
              </p>
            </div>

            {/* 3 Core Rules Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Mobile Numerology Always Free */}
              <div className="p-5 bg-gradient-to-br from-blue-50 via-sky-50/50 to-blue-50 rounded-2xl border border-blue-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-blue-950 font-playfair">
                  {i18n.mobileNumerologyStatus}
                </h4>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  100% permanently free for all seekers. Never consumes your complimentary gift or requires billing.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono font-black text-blue-700">₹0 (Always Free)</span>
                </div>
              </div>

              {/* Card 2: First Non-Mobile Free */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Gift className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-emerald-950 font-playfair">
                  {i18n.firstReportStatus}
                </h4>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your very first specialist consultation dossier (Lo Shu, Marriage, Vehicle, Vastu, etc.) is complimentary.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono font-black text-emerald-700">
                    Status: {summary?.firstNonMobileReport?.status === 'USED' ? i18n.firstReportUsed : i18n.firstReportAvailable}
                  </span>
                </div>
              </div>

              {/* Card 3: Additional Reports ₹33 */}
              <div className="p-5 bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#78350F] font-playfair">
                  {i18n.additionalReportsRate}
                </h4>
                <p className="text-[11px] text-[#92400E] leading-relaxed">
                  Nominal dakshina of ₹33 (3300 paise) per additional report. Unlocks screen report, A4 printable PDF & updates.
                </p>
                <div className="pt-2">
                  <span className="text-xs font-mono font-black text-[#B45309]">₹33 INR / Report</span>
                </div>
              </div>
            </div>

            {/* Client Account Metrics */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  {i18n.unlockedReportsCount}
                </span>
                <span className="font-playfair font-black text-2xl text-slate-800">
                  {summary?.totalReportsUnlocked ?? reports.length}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  {i18n.totalSpent}
                </span>
                <span className="font-playfair font-black text-2xl text-[#D97706]">
                  ₹{summary?.totalPaidAmountInr ?? 0}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  Payment Gateway
                </span>
                <span className="font-mono font-bold text-xs text-slate-700 block mt-1">
                  Razorpay (Test Mode)
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
                  Data Privacy
                </span>
                <span className="font-mono font-bold text-xs text-emerald-700 block mt-1">
                  100% Vedic Protected
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paywall / Verification Modal when guest wants to link mobile */}
      <ReportPaywallModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        reportType="MASTER_REPORT"
        profileKey="auth_sync_profile"
        profileName={storedUser?.mobile || 'Account'}
        initialMobile={userMobile}
        onAccessGranted={() => {
          setIsAuthModalOpen(false);
          fetchUserData();
        }}
      />
    </div>
  );
};

export default MyReportsHub;
