import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Phone,
  QrCode,
  CreditCard,
  X,
  ArrowRight,
  RefreshCw,
  Gift,
  Zap,
} from 'lucide-react';
import { CanonicalReportType, REPORT_REGISTRY, ReportAccessCheckResult } from '../types/reportAccess';
import { ReportAccessService } from '../services/reportAccessService';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';

export interface ReportPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: CanonicalReportType;
  profileKey: string;
  profileName?: string;
  initialMobile?: string;
  onAccessGranted: () => void;
}

export const ReportPaywallModal: React.FC<ReportPaywallModalProps> = ({
  isOpen,
  onClose,
  reportType,
  profileKey,
  profileName,
  initialMobile = '',
  onAccessGranted,
}) => {
  const { language } = useLanguage();
  const reportDef = REPORT_REGISTRY[reportType] || REPORT_REGISTRY.MASTER_REPORT;

  // Stored auth user state
  const [userMobile, setUserMobile] = useState<string>(() => {
    const stored = ReportAccessService.getStoredUser();
    return stored?.mobile || initialMobile.replace(/\D/g, '').slice(-10);
  });
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    const stored = ReportAccessService.getStoredUser();
    return !!stored?.mobileVerified;
  });

  // Step state: 'OTP_REQUEST' | 'OTP_VERIFY' | 'ACCESS_OPTIONS' | 'PAYMENT_PROCESSING' | 'SUCCESS'
  const [step, setStep] = useState<'OTP_REQUEST' | 'OTP_VERIFY' | 'ACCESS_OPTIONS' | 'PAYMENT_PROCESSING' | 'SUCCESS'>(
    isVerified ? 'ACCESS_OPTIONS' : 'OTP_REQUEST'
  );

  const [otpInput, setOtpInput] = useState<string>('');
  const [sandboxOtpHint, setSandboxOtpHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessResult, setAccessResult] = useState<ReportAccessCheckResult | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'QR' | 'CARD'>('UPI');

  // Sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      const stored = ReportAccessService.getStoredUser();
      if (stored && stored.mobileVerified) {
        setUserMobile(stored.mobile);
        setIsVerified(true);
        setStep('ACCESS_OPTIONS');
        fetchAccessDetails(stored.mobile);
      } else {
        setStep('OTP_REQUEST');
      }
    }
  }, [isOpen, reportType, profileKey]);

  // Fetch access details from server
  const fetchAccessDetails = async (mobile: string) => {
    setIsLoading(true);
    try {
      const res = await ReportAccessService.checkAccess(reportType, profileKey, mobile);
      setAccessResult(res);
      if (res.allowed) {
        setStep('SUCCESS');
      }
    } catch (e: any) {
      setError(e.message || 'Failed to check report status');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Request OTP Handler
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = userMobile.replace(/\D/g, '');
    if (clean.length < 10) {
      setError(language === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await ReportAccessService.requestOtp(clean);
      setSandboxOtpHint(res.testOtp || '333333');
      setStep('OTP_VERIFY');
    } catch (e: any) {
      setError(e.message || 'OTP अनुरोध विफल रहा');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP Handler
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpInput.trim()) {
      setError(language === 'hi' ? 'कृपया प्राप्त OTP दर्ज करें' : 'Please enter the OTP');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const session = await ReportAccessService.verifyOtp(userMobile, otpInput.trim());
      setIsVerified(true);
      setStep('ACCESS_OPTIONS');
      await fetchAccessDetails(session.mobile);
    } catch (e: any) {
      setError(e.message || 'OTP सत्यापन विफल रहा');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Claim Free Report Handler
  const handleClaimFree = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await ReportAccessService.claimFreeReport(reportType, profileKey, userMobile);
      setStep('SUCCESS');
      setTimeout(() => {
        onAccessGranted();
      }, 1200);
    } catch (e: any) {
      setError(e.message || 'मुफ़्त रिपोर्ट क्लेम करने में त्रुटि हुई');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Pay ₹33 Handler
  const handleInitiatePayment = async () => {
    setIsLoading(true);
    setError(null);
    setStep('PAYMENT_PROCESSING');
    try {
      // Step 1: Create Order on Server
      const order = await ReportAccessService.createPaymentOrder(reportType, profileKey, userMobile);

      // Step 2: Simulate / Execute Payment & Verification
      const mockPaymentId = `pay_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const mockSignature = `sig_${Date.now()}`;

      // Short aesthetic processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Step 3: Server Payment Verification & Entitlement Creation
      await ReportAccessService.verifyPayment(
        order.orderId,
        mockPaymentId,
        mockSignature,
        reportType,
        profileKey,
        userMobile
      );

      setStep('SUCCESS');
      setTimeout(() => {
        onAccessGranted();
      }, 1200);
    } catch (e: any) {
      setError(e.message || 'भुगतान सत्यापन विफल रहा');
      setStep('ACCESS_OPTIONS');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Localized Report Title
  const reportTitle =
    language === 'hi'
      ? reportDef.titleHi
      : language === 'mr'
      ? reportDef.titleMr
      : language === 'bn'
      ? reportDef.titleBn
      : language === 'gu'
      ? reportDef.titleGu
      : reportDef.titleEn;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border-2 border-amber-300 rounded-[32px] shadow-2xl overflow-hidden text-[#1F2937]">
        {/* Top Gradient Header */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white p-5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" bordered={false} />
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-200 uppercase font-bold block">
                LeoFamily Access Guard
              </span>
              <h3 className="font-playfair font-bold text-base md:text-lg leading-tight">
                {reportTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: PHONE NUMBER INPUT */}
          {step === 'OTP_REQUEST' && (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#D97706] flex items-center justify-center mx-auto mb-2">
                  <Phone className="w-6 h-6" />
                </div>
                <h4 className="font-playfair font-bold text-lg text-slate-800">
                  {language === 'hi' ? 'मोबाइल नंबर सत्यापन' : 'Mobile Number Verification'}
                </h4>
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'आपकी प्रथम निःशुल्क रिपोर्ट का लाभ प्राप्त करने हेतु कृपया मोबाइल नंबर सत्यापित करें।'
                    : 'Verify your mobile number to claim your first FREE report entitlement.'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-500">
                  {language === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-Digit Mobile Number'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-mono font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={userMobile}
                    onChange={(e) => setUserMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    required
                    className="w-full bg-white border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || userMobile.length < 10}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{language === 'hi' ? 'OTP प्राप्त करें (Get OTP)' : 'Send Verification OTP'}</span>
              </button>

              <div className="text-[10px] text-center text-slate-400">
                🔒 {language === 'hi' ? 'मोबाइल अंकशास्त्र हमेशा 100% मुफ़्त है।' : 'Mobile Numerology is permanently 100% Free.'}
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP_VERIFY' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-playfair font-bold text-lg text-slate-800">
                  {language === 'hi' ? 'OTP दर्ज करें' : 'Enter 6-Digit OTP'}
                </h4>
                <p className="text-xs text-slate-500">
                  +91 {userMobile} पर भेजा गया कोड दर्ज करें
                </p>
              </div>

              {sandboxOtpHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-center text-[11px] text-[#92400E]">
                  🔑 <strong>Sandbox Test OTP:</strong> <span className="font-mono font-bold text-sm bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">{sandboxOtpHint}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="333333"
                  autoFocus
                  required
                  className="w-full text-center tracking-[0.4em] bg-white border border-slate-300 rounded-2xl py-3 text-lg font-mono font-black text-slate-800 focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('OTP_REQUEST')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-semibold"
                >
                  {language === 'hi' ? 'नंबर बदलें' : 'Change'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || otpInput.length < 4}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{language === 'hi' ? 'सत्यापित करें (Verify OTP)' : 'Verify OTP & Continue'}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ACCESS OPTIONS (FIRST FREE vs. ₹33 PER-REPORT) */}
          {step === 'ACCESS_OPTIONS' && (
            <div className="space-y-5 text-left">
              {/* Profile Details Badge */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Client Profile</span>
                  <span className="font-bold text-slate-800">{profileName || 'Primary Profile'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Verified Mobile</span>
                  <span className="font-mono font-bold text-slate-700">+91 {userMobile}</span>
                </div>
              </div>

              {/* CASE A: USER IS ELIGIBLE FOR FIRST FREE REPORT */}
              {accessResult?.canClaimFree ? (
                <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-emerald-50 rounded-3xl border-2 border-emerald-300 shadow-xs space-y-4 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Gift className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <span className="bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Welcome Complimentary Gift
                    </span>
                    <h4 className="font-playfair font-black text-xl text-emerald-950 mt-1">
                      {language === 'hi' ? 'आपकी पहली रिपोर्ट 100% मुफ़्त है!' : 'Your First Report is 100% FREE!'}
                    </h4>
                    <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                      {language === 'hi'
                        ? 'लियोफैमिली की ओर से यह विशेष परामर्श रिपोर्ट आपके लिए निःशुल्क अनलॉक की जा रही है।'
                        : 'LeoFamily is delighted to offer your first comprehensive specialist report as a free gift.'}
                    </p>
                  </div>

                  <button
                    onClick={handleClaimFree}
                    disabled={isLoading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                    <span>{language === 'hi' ? 'निःशुल्क रिपोर्ट अनलॉक करें (Claim Free Report)' : 'Unlock Free Report Now'}</span>
                  </button>
                  <p className="text-[10px] text-emerald-700/80">
                    * इसके पश्चात आगामी विशेषज्ञ रिपोर्ट्स ₹33 प्रति रिपोर्ट उपलब्ध होंगी।
                  </p>
                </div>
              ) : (
                /* CASE B: ₹33 PAID REPORT ACCESS GATEWAY */
                <div className="p-5 bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50 rounded-3xl border-2 border-amber-300 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#92400E] block">
                        Specialist Consultation Access
                      </span>
                      <h4 className="font-playfair font-bold text-lg text-slate-800">
                        {reportTitle}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-playfair text-[#B45309]">₹33</span>
                      <span className="block text-[9px] font-mono text-slate-500 uppercase">One-time / Report</span>
                    </div>
                  </div>

                  <div className="text-xs text-[#78350F] bg-white p-3 rounded-xl border border-amber-200 space-y-1">
                    <p className="font-semibold">
                      {language === 'hi'
                        ? 'आपकी पहली निःशुल्क रिपोर्ट पहले ही उपयोग हो चुकी है। अतिरिक्त रिपोर्ट्स ₹33 प्रति रिपोर्ट उपलब्ध हैं।'
                        : 'Your complimentary free report was already consumed. Additional reports are ₹33 each.'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      ✓ सम्पूर्ण स्क्रीन विश्लेषण &nbsp;•&nbsp; ✓ A4 प्रिंटेबल PDF &nbsp;•&nbsp; ✓ 100% वैदिक सुरक्षा
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                      भुगतान माध्यम चुनें (Select Payment Mode)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('UPI')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentMethod === 'UPI'
                            ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        <Zap className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[10px] font-bold block">UPI / GPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('QR')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentMethod === 'QR'
                            ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        <QrCode className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[10px] font-bold block">Scan QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('CARD')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedPaymentMethod === 'CARD'
                            ? 'bg-[#D97706] text-white border-[#D97706] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mx-auto mb-1" />
                        <span className="text-[10px] font-bold block">Card / NetBanking</span>
                      </button>
                    </div>
                  </div>

                  {/* Pay ₹33 CTA */}
                  <button
                    onClick={handleInitiatePayment}
                    disabled={isLoading}
                    className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    <span>{language === 'hi' ? '₹33 का भुगतान करें एवं रिपोर्ट खोलें' : 'Pay ₹33 & Unlock Report'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PROCESSING */}
          {step === 'PAYMENT_PROCESSING' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center mx-auto animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-playfair font-bold text-lg text-slate-800">
                  {language === 'hi' ? 'सुरक्षित भुगतान सत्यापन जारी है...' : 'Verifying Secure ₹33 Payment...'}
                </h4>
                <p className="text-xs text-slate-500">
                  कृपया प्रतीक्षा करें। आपकी रिपोर्ट का अधिकार सर्वर पर दर्ज किया जा रहा है।
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="font-playfair font-black text-xl text-emerald-950">
                  {language === 'hi' ? 'रिपोर्ट सफलतापूर्वक अनलॉक हो गई!' : 'Report Access Granted!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {language === 'hi'
                    ? 'आपकी रिपोर्ट स्क्रीन, PDF एक्सपोर्ट एवं प्रिंट हेतु पूर्णतः उपलब्ध है।'
                    : 'Your report is now fully available for screen viewing, PDF export, and printing.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onAccessGranted();
                  onClose();
                }}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                {language === 'hi' ? 'रिपोर्ट देखें (View Report)' : 'Open Report Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPaywallModal;
