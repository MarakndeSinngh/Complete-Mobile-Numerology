import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  ArrowRight,
  FileText
} from 'lucide-react';
import { CanonicalReportType, REPORT_REGISTRY } from '../types/reportAccess';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import { ReportAccessService } from '../services/reportAccessService';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';

export interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType?: CanonicalReportType;
  profileKey?: string;
  profileName?: string;
  onAccessGranted: () => void;
}

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  reportType = 'MASTER_REPORT',
  profileKey = 'default_profile',
  profileName,
  onAccessGranted,
}) => {
  const { language } = useLanguage();
  const { user: supabaseUser, appUser } = useSupabaseAuth();
  const reportDef = REPORT_REGISTRY[reportType] || REPORT_REGISTRY.MASTER_REPORT;
  const amount = PAYMENT_CONFIG.MASTER_REPORT_PRICE;

  const [utrInput, setUtrInput] = useState<string>('');
  const [emailOrPhone, setEmailOrPhone] = useState<string>(
    appUser?.email || supabaseUser?.email || appUser?.phone || ''
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // States: 'PAYMENT_FORM' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'
  const [paymentStatus, setPaymentStatus] = useState<'PAYMENT_FORM' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED'>('PAYMENT_FORM');
  const [submittedUtr, setSubmittedUtr] = useState<string>('');

  // Check initial status on open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setCopied(false);
      checkExistingStatus();
    }
  }, [isOpen, reportType, profileKey]);

  const checkExistingStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const res = await ReportAccessService.getUpiPaymentStatus(
        reportType,
        profileKey,
        submittedUtr || undefined,
        emailOrPhone || undefined
      );

      if (res.success && res.status) {
        if (res.isUnlocked || res.status === 'VERIFIED' || res.status === 'PAID') {
          setPaymentStatus('VERIFIED');
        } else if (res.status === 'PENDING_VERIFICATION') {
          setPaymentStatus('PENDING_VERIFICATION');
          if (res.record?.utr) setSubmittedUtr(res.record.utr);
        } else if (res.status === 'REJECTED') {
          setPaymentStatus('REJECTED');
        }
      }
    } catch {
      // Non-blocking
    } finally {
      setIsCheckingStatus(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(PAYMENT_CONFIG.LEOFAMILY_UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUtr = utrInput.trim().toUpperCase();
    if (!cleanUtr || cleanUtr.length < 6) {
      setError(
        language === 'hi'
          ? 'कृपया मान्य 12-अंकीय UTR / Transaction ID दर्ज करें।'
          : 'Please enter a valid 12-digit UTR or Transaction ID.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await ReportAccessService.submitUpiPayment(
        reportType,
        profileKey,
        cleanUtr,
        emailOrPhone.includes('@') ? undefined : emailOrPhone,
        emailOrPhone.includes('@') ? emailOrPhone : undefined
      );

      if (res.success) {
        setSubmittedUtr(cleanUtr);
        setPaymentStatus('PENDING_VERIFICATION');
      } else {
        setError(res.message || 'Payment submission failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit payment. Please verify UTR.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenMasterReport = () => {
    onAccessGranted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border-2 border-amber-400/90 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <div>
              <h2 className="font-playfair text-base font-bold tracking-wide text-amber-100 flex items-center gap-1.5">
                LeoFamily UPI QR Payment
              </h2>
              <p className="text-[10px] text-amber-200/90 font-mono">
                Official ₹{amount} Report Checkout
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-amber-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-7 space-y-5 overflow-y-auto">
          
          {/* Top Product Card */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                  {language === 'hi' ? 'चयनित रिपोर्ट' : 'Selected Product'}
                </div>
                <h4 className="font-playfair font-bold text-slate-900 text-sm md:text-base">
                  {language === 'hi' ? reportDef.titleHi : reportDef.titleEn}
                </h4>
                {profileName && (
                  <div className="text-xs text-slate-500 font-medium">
                    Profile: {profileName}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-slate-400 line-through">₹499</div>
              <div className="text-lg font-extrabold text-[#D97706] font-playfair">
                ₹{amount}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {/* 1. STATE: PAYMENT FORM (QR + UTR) */}
          {paymentStatus === 'PAYMENT_FORM' && (
            <div className="space-y-5">
              
              {/* Instructions Headline */}
              <div className="text-center space-y-1">
                <h3 className="font-playfair font-bold text-slate-900 text-base md:text-lg">
                  अपने UPI App से QR Scan करके ₹{amount} का Payment करें
                </h3>
                <p className="text-xs text-slate-600">
                  Google Pay, PhonePe, Paytm, BHIM या किसी भी UPI App से स्कैन करें
                </p>
              </div>

              {/* QR Code Card */}
              <div className="bg-white p-4 rounded-3xl border-2 border-amber-300 shadow-md flex flex-col items-center justify-center space-y-3">
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-2 border border-amber-200 flex items-center justify-center shadow-inner">
                  <img
                    src={PAYMENT_CONFIG.LEOFAMILY_PAYMENT_QR}
                    alt="LeoFamily UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Scan using tags */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-medium text-slate-600">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">Google Pay</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">PhonePe</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Paytm</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">BHIM</span>
                </div>

                {/* UPI ID Copy Ribbon */}
                <div className="w-full pt-1">
                  <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2">
                    <div className="truncate text-left mr-2">
                      <div className="text-[10px] uppercase font-mono text-amber-700 font-bold">Official UPI ID</div>
                      <div className="font-mono text-xs font-bold text-slate-800 select-all">
                        {PAYMENT_CONFIG.LEOFAMILY_UPI_ID}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-xs"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy UPI ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Direct UPI Intent Button */}
                <div className="w-full">
                  <a
                    href={PAYMENT_CONFIG.getUpiIntentUrl(amount)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in UPI App (Mobile)</span>
                  </a>
                </div>
              </div>

              {/* UTR Submission Form */}
              <form onSubmit={handleUpiSubmit} className="space-y-3.5 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Payment करने के बाद नीचे अपना UTR / Transaction ID दर्ज करें:
                  </label>
                  <p className="text-[11px] text-slate-500">
                    (UPI App में Payment Details में 12-अंकों का UTR नंबर मिलता है)
                  </p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={utrInput}
                    onChange={(e) => setUtrInput(e.target.value)}
                    placeholder="Enter 12-digit UTR / Ref Number (e.g. 427819384910)"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 bg-white text-slate-900 font-mono text-sm tracking-wider uppercase font-semibold outline-hidden shadow-xs"
                  />

                  {/* Optional user contact identifier */}
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Mobile Number or Email (for verification notice)"
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-white text-slate-800 text-xs outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !utrInput.trim()}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#92400E] via-[#B45309] to-[#D97706] hover:from-[#78350F] hover:to-[#B45309] text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>सबमिट हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>मैंने ₹{amount} का Payment कर दिया (Submit UTR)</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* 2. STATE: PENDING VERIFICATION */}
          {paymentStatus === 'PENDING_VERIFICATION' && (
            <div className="text-center py-6 space-y-5 bg-white p-6 rounded-3xl border border-amber-200 shadow-sm animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-mono text-xs font-bold">
                  PENDING VERIFICATION
                </div>
                <h3 className="font-playfair font-bold text-slate-900 text-lg md:text-xl">
                  Payment Verification Pending
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  आपका UTR <span className="font-mono font-bold text-slate-900">{submittedUtr || utrInput}</span> प्राप्त हो गया है। Verification complete होने के बाद Master Report आपके account में unlock होगा।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Important Note:</span>
                </div>
                <p>
                  • Verification आमतौर पर 5 से 15 मिनट के भीतर पूर्ण हो जाता है।
                </p>
                <p>
                  • जैसे ही Admin द्वारा UTR सत्यापित होगा, आपकी 32-अध्याय Complete Master Report स्वतः सक्रिय हो जाएगी।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={checkExistingStatus}
                  disabled={isCheckingStatus}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCheckingStatus ? 'animate-spin' : ''}`} />
                  <span>{isCheckingStatus ? 'Checking...' : 'Check Status Now (स्थिति जांचें)'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}

          {/* 3. STATE: VERIFIED & UNLOCKED */}
          {paymentStatus === 'VERIFIED' && (
            <div className="text-center py-6 space-y-5 bg-white p-6 rounded-3xl border-2 border-emerald-400 shadow-md animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                  ✓ PAYMENT VERIFIED
                </div>
                <h3 className="font-playfair font-bold text-slate-900 text-lg md:text-xl">
                  Payment Verified Successfully!
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  आपका Complete Master Report अब उपलब्ध है। सभी 32 अध्याय एवं प्रिंटेबल PDF अनलॉक हो चुके हैं।
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenMasterReport}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Open My Master Report (रिपोर्ट देखें)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4. STATE: REJECTED */}
          {paymentStatus === 'REJECTED' && (
            <div className="text-center py-6 space-y-5 bg-white p-6 rounded-3xl border border-red-200 shadow-sm animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-playfair font-bold text-slate-900 text-lg">
                  Payment Verification Could Not Be Completed
                </h3>
                <p className="text-xs text-slate-600">
                  दर्ज किया गया UTR बैंक रिकॉर्ड से मेल नहीं खाया। कृपया सही UTR के साथ पुनः सबमिट करें।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPaymentStatus('PAYMENT_FORM')}
                className="w-full py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Submit Payment Again (पुनः UTR दर्ज करें)
              </button>
            </div>
          )}
        </div>

        {/* Footer Trust Bar */}
        <div className="px-6 py-3 bg-amber-100/60 border-t border-amber-200/80 flex items-center justify-between text-[11px] text-amber-900 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            100% Secure UPI Transaction
          </span>
          <span className="font-mono text-amber-800">Support: support@leofamily.com</span>
        </div>
      </div>
    </div>
  );
};
