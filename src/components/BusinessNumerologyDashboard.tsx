import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Building2,
  Users,
  Compass,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Calendar,
  Phone,
  Globe,
  User,
  Hash,
  Download,
  Printer,
  ChevronRight,
  Check,
  RefreshCw,
  Award,
  Zap,
  HelpCircle,
  Sliders,
  DollarSign,
  TrendingUp,
  MapPin,
  FileCheck
} from 'lucide-react';
import {
  analyzeBusinessNumerologyPro,
  BusinessNumerologyReport,
  BusinessAnalysisInput,
  BusinessIndustryType,
  BusinessCompatibilityStatus
} from '../core/businessEngine';
import DateInput from './DateInput';
import { formatDateForDisplay, parseIndianDate } from '../utils/dateUtils';
import { useLanguage } from '../i18n';
import { getProfileIsolationKey } from '../core';

interface BusinessNumerologyDashboardProps {
  initialDob?: string;
  initialName?: string;
  initialMobile?: string;
  initialGender?: 'MALE' | 'FEMALE' | 'OTHER';
  onSyncToMasterReport?: (report: BusinessNumerologyReport) => void;
}

const INDUSTRIES: BusinessIndustryType[] = [
  'Retail',
  'Manufacturing',
  'Service',
  'Consulting',
  'Education',
  'Technology',
  'Finance / Accounting',
  'Real Estate',
  'Healthcare',
  'Beauty / Lifestyle',
  'Media / Entertainment',
  'Digital / Marketing',
  'Travel',
  'Construction',
  'Other'
];

export const BusinessNumerologyDashboard: React.FC<BusinessNumerologyDashboardProps> = ({
  initialDob = '',
  initialName = '',
  initialMobile = '',
  initialGender = 'MALE',
  onSyncToMasterReport
}) => {
  const { t, language } = useLanguage();

  // Input Form States
  const [businessName, setBusinessName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState<BusinessIndustryType>('Consulting');
  const [ownerName, setOwnerName] = useState(initialName);
  const [ownerDob, setOwnerDob] = useState(initialDob);
  const [ownerGender, setOwnerGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>(initialGender);
  
  // Optional Partner States
  const [hasPartner, setHasPartner] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerDob, setPartnerDob] = useState('');

  // Optional Secondary Inputs
  const [businessMobile, setBusinessMobile] = useState(initialMobile);
  const [officeAddress, setOfficeAddress] = useState('');
  const [domainName, setDomainName] = useState('');
  const [suggestedName, setSuggestedName] = useState('');

  // Report & Navigation States
  const [report, setReport] = useState<BusinessNumerologyReport | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHALDEAN' | 'SYNERGY' | 'BRAND_DOMAIN' | 'VASTU' | 'WEALTH_LOSHU' | 'REMEDIES' | 'HARMONIZER'>('OVERVIEW');
  const [showDetailedWhy, setShowDetailedWhy] = useState(false);
  const [syncedNotification, setSyncedNotification] = useState(false);

  // Sync props when changed
  useEffect(() => {
    if (initialDob) setOwnerDob(initialDob);
    if (initialName) setOwnerName(initialName);
    if (initialMobile) setBusinessMobile(initialMobile);
    if (initialGender) setOwnerGender(initialGender);
  }, [initialDob, initialName, initialMobile, initialGender]);

  // Initialize calculation on mount only if businessName is provided
  useEffect(() => {
    if (businessName.trim()) {
      runAnalysis();
    }
  }, []);

  const runAnalysis = () => {
    if (!businessName.trim()) return;

    const input: BusinessAnalysisInput = {
      businessName: businessName.trim(),
      brandName: brandName.trim() || undefined,
      industry,
      ownerName: ownerName || initialName,
      ownerDob: ownerDob || initialDob,
      ownerGender,
      partnerName: hasPartner && partnerName.trim() ? partnerName.trim() : undefined,
      partnerDob: hasPartner && partnerDob.trim() ? partnerDob.trim() : undefined,
      businessMobile: businessMobile.trim() || undefined,
      officeAddress: officeAddress.trim() || undefined,
      domainName: domainName.trim() || undefined,
      suggestedName: suggestedName.trim() || undefined
    };

    const res = analyzeBusinessNumerologyPro(input);
    setReport(res);

    // Save to localStorage with profile isolation key for Master Report synchronization
    try {
      const profileKey = getProfileIsolationKey({
        name: ownerName || initialName,
        dob: ownerDob || initialDob,
        gender: ownerGender
      });
      const payload = JSON.stringify({
        report: res,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`leofamily_saved_business_audit_${profileKey}`, payload);
      localStorage.setItem('leofamily_saved_business_audit', payload);
    } catch (e) {
      console.error('Failed to save business audit to localStorage:', e);
    }

    if (onSyncToMasterReport) {
      onSyncToMasterReport(res);
    }
  };

  const handleManualSync = () => {
    if (!report) return;
    try {
      const profileKey = getProfileIsolationKey({
        name: ownerName || initialName,
        dob: ownerDob || initialDob,
        gender: ownerGender
      });
      const payload = JSON.stringify({
        report,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`leofamily_saved_business_audit_${profileKey}`, payload);
      localStorage.setItem('leofamily_saved_business_audit', payload);
      if (onSyncToMasterReport) {
        onSyncToMasterReport(report);
      }
      setSyncedNotification(true);
      setTimeout(() => setSyncedNotification(false), 3000);
    } catch (e) {
      console.error('Manual sync failed:', e);
    }
  };

  const getStatusBadge = (status: BusinessCompatibilityStatus) => {
    switch (status) {
      case 'SUPPORTIVE':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> SUPPORTIVE (अनुकूल)</span>;
      case 'NEUTRAL':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200"><Info className="w-3.5 h-3.5 text-amber-600" /> BALANCED (तटस्थ)</span>;
      case 'NEEDS_ATTENTION':
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> NEEDS ATTENTION (सावधानी)</span>;
    }
  };

  return (
    <div id="business-numerology-pro-suite" className="space-y-6 text-left font-sans">
      
      {/* Top Banner */}
      <div className="border-b border-[#F2E8DC] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-[#1E3A8A]/10 text-[#1E3A8A] rounded-xl">
              <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
            </span>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#1E3A8A]">
              LeoFamily Business & Corporate Numerology Pro
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-1">
            व्यापारिक नाम, ब्रांड वाइब्रेशन, संस्थापक सामंजस्य, पार्टनर कम्पैटिबिलिटी, कॉर्पोरेट वास्तु एवं डोमेन विश्लेषण (Phase 9 Suite)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSync}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            {syncedNotification ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {syncedNotification ? 'Synced to Master!' : 'Sync to Master Report'}
          </button>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        <h4 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-2 border-b pb-3">
          <Building2 className="w-4 h-4 text-[#1E3A8A]" />
          1. Business Entity & Founder Coordinates (व्यापार एवं संस्थापक विवरण)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Business / Firm Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Leo Occult Enterprises"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Brand / Trade Name (Optional)
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. LeoFamily"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Industry / Business Purpose <span className="text-rose-500">*</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as BusinessIndustryType)}
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Founder & Partner Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Primary Founder / Owner Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            />
          </div>

          <div className="space-y-1">
            <DateInput
              id="business-owner-dob"
              label="Owner DOB (DD/MM/YYYY)"
              value={ownerDob}
              outputFormat="indian"
              onChange={(val) => setOwnerDob(val)}
              className="py-2 px-3 text-xs bg-[#FDFCF7] rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
              Owner Gender
            </label>
            <select
              value={ownerGender}
              onChange={(e) => setOwnerGender(e.target.value as any)}
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
            >
              <option value="MALE">Male (पुरुष)</option>
              <option value="FEMALE">Female (महिला)</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {/* Optional Partner Checkbox */}
        <div className="p-4 bg-slate-50 border rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="partner-toggle"
                checked={hasPartner}
                onChange={(e) => setHasPartner(e.target.checked)}
                className="w-4 h-4 text-[#1E3A8A] rounded border-slate-300 focus:ring-[#1E3A8A] cursor-pointer"
              />
              <label htmlFor="partner-toggle" className="text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#1E3A8A]" />
                Include Business Partner / Co-founder Compatibility (साझेदार विश्लेषण)
              </label>
            </div>
            {hasPartner && <span className="text-[10px] font-mono text-[#D97706] font-bold">Active Partner Synastry</span>}
          </div>

          {hasPartner && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 animate-in fade-in duration-300">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                  Partner / Co-founder Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Rahul Verma"
                  className="w-full bg-white border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                />
              </div>

              <div className="space-y-1">
                <DateInput
                  id="business-partner-dob"
                  label="Partner DOB (DD/MM/YYYY)"
                  value={partnerDob}
                  outputFormat="indian"
                  onChange={(val) => setPartnerDob(val)}
                  className="py-2 px-3 text-xs bg-white rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Optional Secondary Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" /> Business Mobile (व्यापारिक फ़ोन)
            </label>
            <input
              type="text"
              value={businessMobile}
              onChange={(e) => setBusinessMobile(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" /> Office / Shop Address (दुकान/कार्यालय)
            </label>
            <input
              type="text"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
              placeholder="e.g. Office 304, Tower B"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold flex items-center gap-1">
              <Globe className="w-3 h-3 text-slate-400" /> Website / Domain Name (वेबसाइट)
            </label>
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="e.g. leofamily.in"
              className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={runAnalysis}
          className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-3.5 rounded-2xl font-mono text-xs uppercase tracking-widest font-bold cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
          Run Authoritative Business Audit (व्यापारिक विश्लेषण करें)
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      {report && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'OVERVIEW', label: '1. Executive Overview', icon: Award },
            { id: 'CHALDEAN', label: '2. Chaldean & Brand Identity', icon: Hash },
            { id: 'SYNERGY', label: '3. Founder & Partner Synergy', icon: Users },
            { id: 'BRAND_DOMAIN', label: '4. Domain & Business Phone', icon: Globe },
            { id: 'VASTU', label: '5. Office Vastu & Energy', icon: Compass },
            { id: 'WEALTH_LOSHU', label: '6. Wealth Flow & Lo Shu', icon: TrendingUp },
            { id: 'REMEDIES', label: '7. Business Remedies', icon: CheckCircle },
            { id: 'HARMONIZER', label: '8. Name Correction Harmonizer', icon: Sliders }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1E3A8A] text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* REPORT CONTENT VIEW */}
      {report && (
        <div className="space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              {/* Header Box */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-blue-50 text-[#1E3A8A] font-extrabold px-3 py-1 rounded-full uppercase border border-blue-200">
                      Chaldean Compound: {report.chaldean.totalCompound}
                    </span>
                    <span className="text-[10px] font-mono bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded-full uppercase border border-amber-200">
                      Industry: {report.entity.industry}
                    </span>
                  </div>
                  <h4 className="font-playfair text-2xl font-bold text-slate-800 mt-2">
                    {report.entity.businessName}
                  </h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    Root Vibration: #{report.chaldean.totalRoot} ({report.chaldean.planetaryRulerHi} / {report.chaldean.planetaryRuler}) • Theme: {report.chaldean.traditionalThemeHi}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-[11px] font-mono text-slate-450 uppercase mb-1">Founder Synastry</div>
                  {getStatusBadge(report.ownerCompatibility.overallStatus)}
                  <div className="text-xs font-mono font-bold text-slate-600 mt-1">
                    Score: {report.ownerCompatibility.overallScore}/100
                  </div>
                </div>
              </div>

              {/* 4 Key Pillar Scorecards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Chaldean Compound</p>
                  <p className="text-2xl font-bold font-mono text-[#1E3A8A] mt-1">{report.chaldean.totalCompound}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Root #{report.chaldean.totalRoot}</p>
                </div>

                <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Founder Mulank / Bhagyank</p>
                  <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
                    {report.ownerProfile.mulank} / {report.ownerProfile.bhagyank}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{report.ownerProfile.mulankLord} / {report.ownerProfile.bhagyankLord}</p>
                </div>

                <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Industry Alignment</p>
                  <p className={`text-xl font-bold font-mono mt-1 ${
                    report.industryAnalysis.alignmentLevel === 'HIGH' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {report.industryAnalysis.alignmentLevel}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{report.industryAnalysis.favorablePlanetsHi}</p>
                </div>

                <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl text-center">
                  <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Personal Year Cycle</p>
                  <p className="text-2xl font-bold font-mono text-indigo-600 mt-1">Year #{report.personalYear.currentPersonalYear}</p>
                  <p className="text-[10px] text-slate-500 mt-1">व्यापारिक प्रभाव चक्र</p>
                </div>
              </div>

              {/* Compound Details & Prediction */}
              <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                  <h5 className="font-playfair text-sm font-bold text-[#1E3A8A]">
                    {report.chaldean.compoundTitle} (Compound #{report.chaldean.totalCompound})
                  </h5>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {report.chaldean.compoundMeaning}
                </p>
                {report.chaldean.compoundPrediction && (
                  <p className="text-xs text-[#1E3A8A] font-semibold italic border-t border-indigo-100/80 pt-2">
                    {report.chaldean.compoundPrediction}
                  </p>
                )}
              </div>

              {/* Executive Summary Grid in Simple Hindi */}
              <div className="space-y-3">
                <h5 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  मुख्य व्यापारिक अंकशास्त्रीय निष्कर्ष (Executive Summary)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> मुख्य शक्ति (Primary Strength)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {report.summary.primaryStrengthHi}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-rose-700 uppercase font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> मुख्य सावधानी (Primary Caution)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {report.summary.primaryCautionHi}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-[#1E3A8A] uppercase font-bold flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#1E3A8A]" /> संस्थापक सामंजस्य (Founder Harmony)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {report.ownerCompatibility.synergySummaryHi}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-800 uppercase font-bold flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-amber-600" /> मुख्य वास्तु सूत्र (Key Vastu Point)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">
                      {report.summary.keyVastuGuidelineHi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable Why This Result */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowDetailedWhy(!showDetailedWhy)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                  {showDetailedWhy ? 'Hide' : 'Show'} "Why This Result?" Methodological Breakdown
                </button>

                {showDetailedWhy && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-2xl border text-xs text-slate-600 space-y-2">
                    <p><strong>1. Chaldean Letter Sum:</strong> प्रत्येक अक्षर को प्राचीन चालडीन मान (A=1, B=2, C=3, etc.) देकर कुल योग {report.chaldean.totalCompound} प्राप्त हुआ, जो रूट #{report.chaldean.totalRoot} ({report.chaldean.planetaryRuler}) पर कम होता है।</p>
                    <p><strong>2. Synastry Matrix:</strong> संस्थापक के मूलांक #{report.ownerProfile.mulank} व भाग्यांक #{report.ownerProfile.bhagyank} की चालडीन रूट #{report.chaldean.totalRoot} के साथ पारंपरिक ग्रह मित्रता सारणी द्वारा गणना की गई है।</p>
                    <p><strong>3. Non-Deterministic Framework:</strong> अंकशास्त्र केवल ऊर्जा संरेखण (Energy Alignment) और संगठनात्मक अनुशासन का मार्ग प्रशस्त करता है; बाजार में सफलता गुणवत्ता व कठोर परिश्रम पर निर्भर करती है।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CHALDEAN BREAKDOWN & BRAND IDENTITY */}
          {activeTab === 'CHALDEAN' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  2. Chaldean Breakdown & Brand Personality
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  व्यवसाय नाम के प्रत्येक अक्षर का चालडीन मूल्य, प्रथम अक्षर का प्रभाव एवं कॉर्पोरेट अभिव्यक्ति
                </p>
              </div>

              {/* Letter Breakdown Table */}
              <div className="space-y-2">
                <h5 className="font-playfair text-sm font-bold text-slate-800">
                  Chaldean Letter-by-Letter Matrix ({report.entity.businessName})
                </h5>
                <div className="flex flex-wrap gap-2 pt-2">
                  {report.chaldean.letterBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[50px]"
                    >
                      <div className="text-base font-bold font-mono text-slate-800">{item.letter}</div>
                      <div className="text-xs font-mono font-bold text-[#1E3A8A] mt-0.5">{item.value}</div>
                    </div>
                  ))}
                  <div className="p-3 bg-[#1E3A8A] text-white rounded-xl text-center min-w-[70px] flex flex-col justify-center">
                    <span className="text-[9px] font-mono uppercase text-amber-300 font-bold">Total</span>
                    <span className="text-base font-bold font-mono">{report.chaldean.totalCompound} &rarr; {report.chaldean.totalRoot}</span>
                  </div>
                </div>
              </div>

              {/* First Letter & Brand Personality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                  <h6 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    प्रथम अक्षर प्रभाव (First Letter '{report.chaldean.firstLetter}')
                  </h6>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.branding.firstLetterVibrationHi}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                  <h6 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#1E3A8A]" />
                    ब्रांड व्यक्तित्व (Brand Personality)
                  </h6>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.branding.brandPersonalityHi}
                  </p>
                </div>
              </div>

              {/* Detailed Brand Expressions */}
              <div className="space-y-3 pt-2">
                <h5 className="font-playfair text-sm font-bold text-slate-800">
                  कॉर्पोरेट अभिव्यक्ति व कार्यशैली (Corporate Expression Facets)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-[#1E3A8A] uppercase font-bold">
                      संवाद शैली (Communication Style)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.communicationStyleHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-indigo-700 uppercase font-bold">
                      सार्वजनिक छवि (Public Image)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.publicImageHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">
                      ग्राहक संबंध (Client Relationship)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.clientRelationshipStyleHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-700 uppercase font-bold">
                      नेतृत्व स्वर (Leadership Tone)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.leadershipToneHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-purple-700 uppercase font-bold">
                      कार्यालय परिवेश (Work Environment)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.businessEnvironmentHi}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-700 uppercase font-bold">
                      विकास शैली (Growth Style)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.branding.growthStyleHi}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOUNDER & PARTNER SYNERGY */}
          {activeTab === 'SYNERGY' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  3. Founder & Partner Synergy Matrix
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  संस्थापक एवं साझेदारों का व्यापारिक नाम के साथ अंकशास्त्रीय सामंजस्य
                </p>
              </div>

              {/* Founder Details */}
              <div className="p-5 bg-slate-50 border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-playfair text-base font-bold text-slate-800">
                      Primary Founder: {report.ownerProfile.name}
                    </h5>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      DOB: {report.ownerProfile.dob} • Mulank: #{report.ownerProfile.mulank} ({report.ownerProfile.mulankLord}) • Bhagyank: #{report.ownerProfile.bhagyank} ({report.ownerProfile.bhagyankLord})
                    </p>
                  </div>
                  {getStatusBadge(report.ownerCompatibility.overallStatus)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 bg-white border rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">
                      मूलांक #{report.ownerProfile.mulank} vs व्यवसाय रूट #{report.chaldean.totalRoot}
                    </span>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(report.ownerCompatibility.mulankCompatibility)}
                      <span className="text-xs font-mono font-bold text-slate-600">{report.ownerCompatibility.mulankScore}/100</span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {report.ownerCompatibility.mulankExplanationHi}
                    </p>
                  </div>

                  <div className="p-3.5 bg-white border rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">
                      भाग्यांक #{report.ownerProfile.bhagyank} vs व्यवसाय रूट #{report.chaldean.totalRoot}
                    </span>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(report.ownerCompatibility.bhagyankCompatibility)}
                      <span className="text-xs font-mono font-bold text-slate-600">{report.ownerCompatibility.bhagyankScore}/100</span>
                    </div>
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {report.ownerCompatibility.bhagyankExplanationHi}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white border rounded-xl">
                  <span className="text-[10px] font-mono text-slate-450 uppercase font-bold block mb-1">
                    व्यक्तिगत नाम चालडीन योग (#{report.ownerProfile.personalNameCompound} &rarr; #{report.ownerProfile.personalNameRoot})
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {report.ownerCompatibility.personalNameExplanationHi}
                  </p>
                </div>
              </div>

              {/* Partner Section (If provided) */}
              {report.partnerAnalysis ? (
                <div className="p-5 bg-amber-50/20 border border-amber-200/60 rounded-2xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-amber-200/40 pb-3">
                    <div>
                      <h5 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-amber-700" />
                        Co-founder / Partner: {report.partnerAnalysis.name}
                      </h5>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        DOB: {report.partnerAnalysis.dob} • Mulank: #{report.partnerAnalysis.mulank} • Bhagyank: #{report.partnerAnalysis.bhagyank} • Name Root: #{report.partnerAnalysis.chaldeanNameRoot}
                      </p>
                    </div>
                    {getStatusBadge(report.partnerAnalysis.overallSynergyStatus)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-white border rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">
                        Founder vs Partner Chemistry
                      </span>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(report.partnerAnalysis.ownerVsPartnerStatus)}
                        <span className="text-xs font-mono font-bold text-slate-600">{report.partnerAnalysis.ownerVsPartnerScore}/100</span>
                      </div>
                      <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                        {report.partnerAnalysis.ownerVsPartnerNotesHi}
                      </p>
                    </div>

                    <div className="p-3.5 bg-white border rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">
                        Partner vs Business Name Root
                      </span>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(report.partnerAnalysis.partnerVsBusinessStatus)}
                        <span className="text-xs font-mono font-bold text-slate-600">{report.partnerAnalysis.partnerVsBusinessScore}/100</span>
                      </div>
                      <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                        {report.partnerAnalysis.partnerVsBusinessNotesHi}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-[#1E3A8A] uppercase font-bold">
                        संवाद व विचार-विमर्श
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {report.partnerAnalysis.communicationStyleHi}
                      </p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-amber-700 uppercase font-bold">
                        निर्णय व जिम्मेदारी विभाजन
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {report.partnerAnalysis.responsibilityDistributionHi}
                      </p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl space-y-1">
                      <span className="text-[10px] font-mono text-rose-700 uppercase font-bold">
                        मतभेद व घर्षण से बचाव
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {report.partnerAnalysis.potentialFrictionAreasHi}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-2xl text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    कोई साझेदार (Co-founder / Partner) निर्दिष्ट नहीं किया गया है।
                  </p>
                  <button
                    onClick={() => setHasPartner(true)}
                    className="text-xs font-bold text-[#1E3A8A] hover:underline cursor-pointer"
                  >
                    + Add Partner Coordinates to Audit Synergy
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BRAND DOMAIN & MOBILE */}
          {activeTab === 'BRAND_DOMAIN' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  4. Domain Name & Business Mobile Integration
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  वेबसाइट डोमेन नाम का चालडीन विश्लेषण एवं व्यापारिक फ़ोन नंबर की ऊर्जा
                </p>
              </div>

              {/* Domain Analysis */}
              {report.domainAnalysis ? (
                <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h5 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-[#1E3A8A]" />
                      Domain Analysis: {report.domainAnalysis.rawDomain}
                    </h5>
                    <span className="text-[10px] font-mono bg-blue-50 text-[#1E3A8A] px-2.5 py-0.5 rounded-full font-bold">
                      Cleaned: '{report.domainAnalysis.cleanedNamePortion}'
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Chaldean Compound</p>
                      <p className="text-xl font-bold font-mono text-[#1E3A8A] mt-1">{report.domainAnalysis.compound}</p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Root Vibration</p>
                      <p className="text-xl font-bold font-mono text-amber-600 mt-1">#{report.domainAnalysis.root}</p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Ruling Planet</p>
                      <p className="text-base font-bold font-mono text-slate-700 mt-1">{report.domainAnalysis.planetaryRulerHi}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {report.domainAnalysis.brandResonanceHi}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    * {report.domainAnalysis.disclaimer}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-2xl text-center text-xs text-slate-500">
                  कोई डोमेन नाम दर्ज नहीं किया गया है।
                </div>
              )}

              {/* Mobile Analysis */}
              {report.mobileAnalysis ? (
                <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h5 className="font-playfair text-base font-bold text-slate-800 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      Business Mobile: {report.mobileAnalysis.originalNumber}
                    </h5>
                    <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                      Root #{report.mobileAnalysis.root} ({report.mobileAnalysis.planetaryRulerHi})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Total Digit Sum</p>
                      <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{report.mobileAnalysis.compound}</p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Repeated Digits</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-2">
                        {report.mobileAnalysis.repeatedDigits.length > 0
                          ? report.mobileAnalysis.repeatedDigits.map(r => `${r.digit}(x${r.count})`).join(', ')
                          : 'None'}
                      </p>
                    </div>

                    <div className="p-3 bg-white border rounded-xl text-center">
                      <p className="text-[10px] font-mono text-slate-450 uppercase font-bold">Sample Pairs</p>
                      <p className="text-xs font-mono font-bold text-slate-700 mt-2">
                        {report.mobileAnalysis.keyPairs.join(', ')}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-1">
                    {report.mobileAnalysis.businessSuitabilityHi}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border rounded-2xl text-center text-xs text-slate-500">
                  कोई व्यवसायिक मोबाइल नंबर दर्ज नहीं किया गया है।
                </div>
              )}
            </div>
          )}

          {/* TAB 5: VASTU & OFFICE SPACE */}
          {activeTab === 'VASTU' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  5. Office / Shop Vastu & Commercial Directions
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  दुकान अथवा कार्यालय पते का अंकशास्त्र एवं शुभ कार्यक्षेत्र दिशा-निर्देश
                </p>
              </div>

              {/* Office Address Section */}
              {report.addressAnalysis ? (
                <div className="p-5 bg-slate-50 border rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h5 className="font-playfair text-base font-bold text-slate-800">
                        Office Space: {report.addressAnalysis.rawAddress}
                      </h5>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        Compound: {report.addressAnalysis.compound} • Root #{report.addressAnalysis.root} ({report.addressAnalysis.planetaryRulerHi})
                      </p>
                    </div>
                    {getStatusBadge(report.addressAnalysis.ownerCompatibility)}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {report.addressAnalysis.vastuSignificanceHi}
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    {report.addressAnalysis.businessSpaceGuidanceHi}
                  </p>
                </div>
              ) : null}

              {/* Direction Guidelines Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-amber-50/30 border border-amber-200/60 rounded-2xl space-y-2">
                  <h6 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Compass className="w-4 h-4 text-amber-700" />
                    संस्थापक केबिन एवं बैठक व्यवस्था (South-West Zone)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    कंपनी के स्वामी / निर्णयकर्ता का केबिन परिसर के <strong>दक्षिण-पश्चिम (South-West)</strong> कोने में होना स्थिरता प्रदान करता है। बैठते समय आपका मुख <strong>उत्तर (North)</strong> या <strong>पूर्व (East)</strong> दिशा की ओर होना चाहिए।
                  </p>
                </div>

                <div className="p-5 bg-blue-50/30 border border-blue-200/60 rounded-2xl space-y-2">
                  <h6 className="font-bold text-[#1E3A8A] text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Building2 className="w-4 h-4 text-[#1E3A8A]" />
                    कुबेर स्थान एवं वित्तीय प्रवाह (North Zone)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    कार्यालय की <strong>उत्तर (North)</strong> दिशा को पूर्णतः स्वच्छ, खुला और हल्का रखें। यहां किसी भी प्रकार का भारी कबाड़ या अंधेरा न होने दें। इस दिशा में एक छोटा जल तत्व या हरा मनी प्लांट धन आकर्षण में सहायक माना जाता है।
                  </p>
                </div>

                <div className="p-5 bg-emerald-50/30 border border-emerald-200/60 rounded-2xl space-y-2">
                  <h6 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Users className="w-4 h-4 text-emerald-700" />
                    ग्राहक स्वागत एवं बिक्री डेस्क (North-West / East)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    रिसेप्शन अथवा सेल्स टीम को <strong>उत्तर-पश्चिम (North-West)</strong> या <strong>पूर्व (East)</strong> में स्थान दें। यह स्थान निरंतर आवागमन और ग्राहकों के सकारात्मक स्वागत के लिए सर्वोत्तम है।
                  </p>
                </div>

                <div className="p-5 bg-purple-50/30 border border-purple-200/60 rounded-2xl space-y-2">
                  <h6 className="font-bold text-purple-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                    अग्नि तत्व एवं सर्वर/पेंट्री (South-East Zone)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    इलेक्ट्रिकल पैनल, सर्वर रूम, इनवर्टर तथा चाय-कॉफी की पेंट्री को <strong>दक्षिण-पूर्व (South-East / आग्नेय कोण)</strong> में स्थापित करें। इससे व्यवसाय में ऊर्जा और गतिशीलता बनी रहती है।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WEALTH FLOW & LO SHU */}
          {activeTab === 'WEALTH_LOSHU' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  6. Wealth Flow, Lo Shu Grid Overlay & Personal Year Cycle
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  संस्थापक के लो शू ग्रिड में व्यवसायिक अंक एवं वर्तमान व्यक्तिगत वर्ष का प्रभाव चक्र
                </p>
              </div>

              {/* Lo Shu Business Supportive Numbers */}
              <div className="space-y-3">
                <h5 className="font-playfair text-sm font-bold text-slate-800">
                  लो शू ग्रिड में व्यवसाय-सहायक अंकों की स्थिति (Business Supportive Numbers)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {report.loshuOverlay.businessSupportiveNumbers.map((item) => (
                    <div
                      key={item.digit}
                      className={`p-4 border rounded-2xl space-y-1.5 ${
                        item.present ? 'bg-emerald-50/30 border-emerald-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800">
                          अंक #{item.digit}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          item.present ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.present ? 'Present (विद्यमान)' : 'Missing (अनुपस्थित)'}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-[#1E3A8A]">{item.name}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{item.significanceHi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personal Year Business Cycle */}
              <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#1E3A8A] uppercase font-bold">Current Cycle</span>
                    <h5 className="font-playfair text-base font-bold text-slate-800">
                      Personal Year #{report.personalYear.currentPersonalYear} (व्यक्तिगत वर्ष प्रभाव)
                    </h5>
                  </div>
                  <span className="text-xl font-bold font-mono text-[#1E3A8A]">Year {report.personalYear.currentPersonalYear}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                  {report.personalYear.cycleThemeHi}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white border rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> मुख्य अवसर (Opportunity Theme)
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {report.personalYear.businessOpportunityHi}
                    </p>
                  </div>

                  <div className="p-3 bg-white border rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-rose-700 uppercase font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> मुख्य सावधानी (Caution Theme)
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {report.personalYear.businessCautionHi}
                    </p>
                  </div>
                </div>
              </div>

              {/* Wealth & Financial Profile */}
              <div className="space-y-3 pt-2">
                <h5 className="font-playfair text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  वित्तीय मानसिकता एवं संपत्ति सृजन शैली (Wealth & Money Mindset)
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">धन दृष्टिकोण (Money Mindset)</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{report.wealthProfile.moneyMindsetHi}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">जोखिम शैली (Risk Style)</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{report.wealthProfile.riskStyleHi}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">बचत व नकद अनुशासन</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{report.wealthProfile.savingDisciplineHi}</p>
                  </div>

                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">स्थायी संपदा निर्माण सूत्र</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{report.wealthProfile.wealthCreationStyleHi}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REMEDIES */}
          {activeTab === 'REMEDIES' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  7. Traditional Business Remedies & Harmonizers
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  पारंपरिक व्यापारिक उपाय, शुभ अनुबंध दिन, ब्रांड रंग एवं कार्यस्थल संतुलन
                </p>
              </div>

              {/* Remedies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-amber-50/25 border border-amber-200/50 rounded-2xl space-y-2">
                  <h6 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <CheckCircle className="w-4 h-4 text-amber-700" />
                    1. नाम वर्तनी मार्गदर्शन (Name Spelling Guidance)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {report.remedies.nameSpellingGuidanceHi}
                  </p>
                </div>

                <div className="p-5 bg-blue-50/25 border border-blue-200/50 rounded-2xl space-y-2">
                  <h6 className="font-bold text-[#1E3A8A] text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Sparkles className="w-4 h-4 text-[#1E3A8A]" />
                    2. शुभ ब्रांड एवं लोगो रंग (Auspicious Colors)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    आपके व्यवसाय के लिए शुभ रंग: <strong>{report.remedies.auspiciousBrandColorsHi.join(', ')}</strong>
                  </p>
                </div>

                <div className="p-5 bg-emerald-50/25 border border-emerald-200/50 rounded-2xl space-y-2">
                  <h6 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    3. अनुबंध हस्ताक्षर एवं डील फाइनल दिन (Auspicious Days)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    महत्वपूर्ण सौदों के लिए शुभ वार: <strong>{report.remedies.contractSigningDaysHi.join(', ')}</strong>
                  </p>
                </div>

                <div className="p-5 bg-purple-50/25 border border-purple-200/50 rounded-2xl space-y-2">
                  <h6 className="font-bold text-purple-900 text-xs flex items-center gap-1.5 font-mono uppercase">
                    <Award className="w-4 h-4 text-purple-700" />
                    4. पारंपरिक सेवा एवं दान उपाय (Charity Remedy)
                  </h6>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {report.remedies.traditionalCharityRemedyHi}
                  </p>
                </div>
              </div>

              {/* Stationery & Symbolism */}
              <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                <h6 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#1E3A8A]" />
                  स्टेशनरी, विजिटिंग कार्ड व लोगो संतुलन (Stationery & Logo Balancing)
                </h6>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.remedies.numberBalancingRemedyHi}
                </p>
              </div>
            </div>
          )}

          {/* TAB 8: NAME CORRECTION HARMONIZER */}
          {activeTab === 'HARMONIZER' && (
            <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 space-y-6 animate-in fade-in duration-300">
              <div className="border-b pb-4">
                <h4 className="font-playfair text-xl font-bold text-[#1E3A8A]">
                  8. Business Name Correction & Spelling Harmonizer
                </h4>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  वैकल्पिक वर्तनी (Alternative Spelling) का परीक्षण करें और शुभ कम्पाउंड पर सामंजस्य बनाएं
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold">
                    Test Suggested / Alternative Name (वैकल्पिक वर्तनी)
                  </label>
                  <input
                    type="text"
                    value={suggestedName}
                    onChange={(e) => setSuggestedName(e.target.value)}
                    placeholder="e.g. LeoFamily Global"
                    className="w-full bg-[#FDFCF7] border border-[#E5E7EB] py-2.5 px-3.5 rounded-xl text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>

                <button
                  type="button"
                  onClick={runAnalysis}
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white py-2.5 px-6 rounded-xl font-mono text-xs uppercase font-bold cursor-pointer h-[42px] transition-all"
                >
                  Harmonize & Compare (तुलना करें)
                </button>
              </div>

              {report.nameCorrection && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                      <span className="text-[10px] font-mono text-slate-450 uppercase font-bold">Current Name (वर्तमान नाम)</span>
                      <h5 className="font-playfair text-lg font-bold text-slate-800">{report.nameCorrection.currentName}</h5>
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                        <span>Compound: {report.nameCorrection.currentCompound} (Root #{report.nameCorrection.currentRoot})</span>
                        {getStatusBadge(report.nameCorrection.currentStatus)}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/30 border border-emerald-200 rounded-2xl space-y-2">
                      <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Suggested Name (सुझाया गया नाम)</span>
                      <h5 className="font-playfair text-lg font-bold text-slate-800">{report.nameCorrection.suggestedName}</h5>
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                        <span>Compound: {report.nameCorrection.suggestedCompound} (Root #{report.nameCorrection.suggestedRoot})</span>
                        {getStatusBadge(report.nameCorrection.suggestedStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FDFCF7] border border-[#F2E8DC] rounded-2xl">
                    <span className="text-[10px] font-mono text-[#D97706] uppercase font-bold block mb-1">
                      तुलनात्मक समीक्षा (Comparison Notes)
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {report.nameCorrection.comparisonNotesHi}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <strong>वैधानिक एवं नैतिक सूचना:</strong> {report.disclaimer}
            </p>
          </div>

        </div>
      )}

      {!report && (
        <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E7EB] space-y-3 max-w-xl mx-auto shadow-xs">
          <Briefcase className="w-12 h-12 text-[#D97706] mx-auto opacity-80" />
          <h3 className="text-lg font-bold font-playfair text-slate-800">व्यापार अंकशास्त्र विश्लेषण प्रारंभ करें</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            कंपनी / फर्म का नाम (उदा. Leo Enterprises) एवं उद्योग प्रकार दर्ज कर 'व्यापार विश्लेषण प्रारंभ करें' पर क्लिक करें।
          </p>
        </div>
      )}

    </div>
  );
};
