import React from 'react';
import { Lock, Unlock, Sparkles, Gift, ShieldCheck, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { CanonicalReportType, REPORT_REGISTRY } from '../types/reportAccess';
import { useReportAccess } from '../hooks/useReportAccess';
import { ReportPaywallModal } from './ReportPaywallModal';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';

export interface ReportAccessGateProps {
  reportType: CanonicalReportType;
  profileKey: string;
  profileName?: string;
  mobile?: string;
  children: React.ReactNode;
  onUnlock?: () => void;
  title?: string;
  className?: string;
}

export const ReportAccessGate: React.FC<ReportAccessGateProps> = ({
  reportType,
  profileKey,
  profileName,
  mobile,
  children,
  onUnlock,
  title,
  className = '',
}) => {
  const { language } = useLanguage();
  const reportDef = REPORT_REGISTRY[reportType] || REPORT_REGISTRY.MASTER_REPORT;

  const {
    accessStatus,
    isLoading,
    isUnlocked,
    isModalOpen,
    openAccessModal,
    closeAccessModal,
    handleAccessGranted,
  } = useReportAccess(reportType, profileKey, mobile);

  // If permanently free or already unlocked, render children directly
  if (reportDef.isFree || isUnlocked || accessStatus?.allowed) {
    return <>{children}</>;
  }

  // Localized title & description
  const displayTitle =
    title ||
    (language === 'hi'
      ? reportDef.titleHi
      : language === 'mr'
      ? reportDef.titleMr
      : language === 'bn'
      ? reportDef.titleBn
      : language === 'gu'
      ? reportDef.titleGu
      : reportDef.titleEn);

  const displayDesc =
    language === 'hi' ? reportDef.descriptionHi : reportDef.descriptionEn;

  const isFreeEligible = accessStatus?.canClaimFree ?? true;

  return (
    <div className={`w-full max-w-4xl mx-auto my-8 p-6 md:p-10 bg-gradient-to-br from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border-2 border-amber-300/80 rounded-[36px] shadow-lg text-center space-y-6 animate-in fade-in duration-300 ${className}`}>
      {/* Brand Crest & Lock Badge */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <BrandLogo size="lg" />
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#92400E] border border-amber-300 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5 text-[#D97706]" />
          {isFreeEligible ? 'First Report Complimentary Access' : 'Specialist Report Access (₹33)'}
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <h3 className="font-playfair text-2xl md:text-3xl font-bold text-[#1F2937] leading-tight">
          {displayTitle}
        </h3>
        <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed">
          {displayDesc}
        </p>
      </div>

      {/* Entitlement Status Banner */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-amber-200 shadow-xs text-left text-xs space-y-1.5">
        <div className="flex items-center justify-between font-semibold text-slate-800">
          <span>{isFreeEligible ? '🎉 पहली रिपोर्ट मुफ़्त (First Report Free)' : '💰 प्रति रिपोर्ट शुल्क (Report Price)'}</span>
          <span className="font-bold font-playfair text-base text-[#D97706]">
            {isFreeEligible ? 'FREE (₹0)' : '₹33 only'}
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          {isFreeEligible
            ? 'लियोफैमिली नए उपयोगकर्ताओं को पहली विशेषज्ञ रिपोर्ट निःशुल्क प्रदान करता है।'
            : 'आपकी पहली निःशुल्क रिपोर्ट उपयोग हो चुकी है। अतिरिक्त रिपोर्ट्स मात्र ₹33 प्रति रिपोर्ट उपलब्ध हैं।'}
        </p>
        <div className="pt-1 text-[10px] text-slate-400 font-mono">
          ✓ सम्पूर्ण स्क्रीन रिपोर्ट &nbsp;•&nbsp; ✓ A4 PDF डाउनलोड &nbsp;•&nbsp; ✓ प्रिंटेबल डॉसियर
        </div>
      </div>

      {/* Main Unlock Button */}
      <div className="max-w-md mx-auto">
        <button
          type="button"
          onClick={openAccessModal}
          disabled={isLoading}
          className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-4 px-6 rounded-2xl text-xs md:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : isFreeEligible ? (
            <Gift className="w-5 h-5 text-amber-200" />
          ) : (
            <Unlock className="w-5 h-5 text-amber-200" />
          )}
          <span>
            {isFreeEligible
              ? language === 'hi'
                ? 'निःशुल्क रिपोर्ट अनलॉक करें (Unlock Free Report)'
                : 'Claim & Unlock Free Report'
              : language === 'hi'
              ? '₹33 का भुगतान कर रिपोर्ट खोलें (Pay ₹33)'
              : 'Pay ₹33 & Open Specialist Report'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-[10px] font-mono text-slate-400">
        🔒 100% सुरक्षित सर्वर सत्यापन • मोबाइल अंकशास्त्र स्थायी रूप से 100% मुफ़्त है
      </div>

      {/* Paywall / Verification Modal */}
      <ReportPaywallModal
        isOpen={isModalOpen}
        onClose={closeAccessModal}
        reportType={reportType}
        profileKey={profileKey}
        profileName={profileName}
        initialMobile={mobile}
        onAccessGranted={() => {
          handleAccessGranted();
          onUnlock?.();
        }}
      />
    </div>
  );
};

export default ReportAccessGate;
