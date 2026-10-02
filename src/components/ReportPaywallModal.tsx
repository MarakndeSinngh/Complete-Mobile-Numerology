import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  CreditCard,
  X,
  ArrowRight,
  RefreshCw,
  Gift,
  Zap,
  RotateCcw,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Clock,
} from 'lucide-react';
import {
  CanonicalReportType,
  REPORT_REGISTRY,
  ReportAccessCheckResult,
  PAYMENT_I18N,
  PaymentI18nEntry,
} from '../types/reportAccess';
import { PAYMENT_CONFIG } from '../config/paymentConfig';
import { ReportAccessService } from '../services/reportAccessService';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
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
  const i18n: PaymentI18nEntry = PAYMENT_I18N[language] || PAYMENT_I18N.hi;

  const {
    user: supabaseUser,
    appUser,
    isAuthenticated,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    targetPhone,
    cooldownSeconds,
    canResend,
    error: authHookError,
    signInWithGoogle,
    signInWithWhatsApp,
    verifyWhatsAppOtp,
    resendWhatsAppOtp,
    clearError: clearAuthError,
    resetOtpFlow,
  } = useSupabaseAuth();

  const [phoneInput, setPhoneInput] = useState<string>(initialMobile || '');
  const [otpInput, setOtpInput] = useState<string>('');
  const [utrInput, setUtrInput] = useState<string>('');
  const [submittedUtr, setSubmittedUtr] = useState<string>('');
  const [upiCopied, setUpiCopied] = useState<boolean>(false);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [accessResult, setAccessResult] = useState<ReportAccessCheckResult | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI_QR' | 'GATEWAY'>('UPI_QR');

  // Step state: 'AUTH_REQUIRED' | 'ACCESS_OPTIONS' | 'PENDING_VERIFICATION' | 'PAYMENT_PROCESSING' | 'SUCCESS'
  const [step, setStep] = useState<'AUTH_REQUIRED' | 'ACCESS_OPTIONS' | 'PENDING_VERIFICATION' | 'PAYMENT_PROCESSING' | 'SUCCESS'>('AUTH_REQUIRED');

  const error = localError || authHookError;
  const isLoading = localLoading || isSendingOtp || isVerifyingOtp || isGoogleLoading;

  // Pre-load Razorpay SDK script in background
  useEffect(() => {
    ReportAccessService.loadRazorpayScript().catch(() => {});
  }, []);

  // Fetch access details from server
  const fetchAccessDetails = useCallback(async () => {
    setLocalLoading(true);
    try {
      const res = await ReportAccessService.checkAccess(reportType, profileKey, initialMobile);
      setAccessResult(res);
      if (res.allowed) {
        setStep('SUCCESS');
      } else {
        // Also check if there is an existing pending UPI submission
        const upiStatus = await ReportAccessService.getUpiPaymentStatus(
          reportType,
          profileKey,
          submittedUtr || undefined,
          appUser?.email || supabaseUser?.email || undefined
        );
        if (upiStatus.success && upiStatus.status === 'PENDING_VERIFICATION') {
          if (upiStatus.record?.utr) setSubmittedUtr(upiStatus.record.utr);
          setStep('PENDING_VERIFICATION');
        } else {
          setStep('ACCESS_OPTIONS');
        }
      }
    } catch (e: any) {
      setLocalError(e?.message || 'Failed to check report status');
    } finally {
      setLocalLoading(false);
    }
  }, [reportType, profileKey, initialMobile, submittedUtr, appUser, supabaseUser]);

  // Sync state when modal opens or authentication changes
  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      clearAuthError();
      setUpiCopied(false);

      if (isAuthenticated) {
        fetchAccessDetails();
      } else {
        setStep('AUTH_REQUIRED');
        resetOtpFlow();
        setOtpInput('');
      }
    }
  }, [isOpen, isAuthenticated, reportType, profileKey, fetchAccessDetails, clearAuthError, resetOtpFlow]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    try {
      navigator.clipboard.writeText(PAYMENT_CONFIG.LEOFAMILY_UPI_ID);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearAuthError();
    setIsGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setLocalError(res.error || 'Google login failed');
      }
    } catch (e: any) {
      setLocalError(e?.message || 'Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. Send WhatsApp OTP
  const handleSendWhatsAppOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const digits = phoneInput.replace(/\D/g, '');
    if (!digits || digits.length < 10) {
      setLocalError(
        language === 'hi'
          ? 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें'
          : 'Please enter a valid 10-digit mobile number'
      );
      return;
    }

    const res = await signInWithWhatsApp(phoneInput);
    if (!res.success) {
      setLocalError(res.error || 'Failed to send WhatsApp code');
    }
  };

  // 3. Verify WhatsApp OTP
  const handleVerifyWhatsAppOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    clearAuthError();

    const cleanOtp = otpInput.replace(/\D/g, '').trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setLocalError(
        language === 'hi'
          ? 'कृपया व्हाट्सएप पर प्राप्त सत्यापन कोड दर्ज करें'
          : 'Please enter the verification code received on WhatsApp'
      );
      return;
    }

    const res = await verifyWhatsAppOtp(targetPhone || phoneInput, cleanOtp);
    if (res.success) {
      await fetchAccessDetails();
    } else {
      setLocalError(res.error || 'Verification failed. Please check the code.');
    }
  };

  // 4. Claim First Free Report
  const handleClaimFree = async () => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      const res = await ReportAccessService.claimFreeReport(reportType, profileKey, phoneInput);
      if (res.success && res.allowed) {
        setStep('SUCCESS');
        onAccessGranted();
      } else {
        setLocalError('Unable to unlock free report. Please try again.');
      }
    } catch (e: any) {
      setLocalError(e?.message || 'Failed to claim free report');
    } finally {
      setLocalLoading(false);
    }
  };

  // 5. Submit UPI QR Payment UTR
  const handleUpiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const cleanUtr = utrInput.trim().toUpperCase();
    if (!cleanUtr || cleanUtr.length < 6) {
      setLocalError(
        language === 'hi'
          ? 'कृपया मान्य 12-अंकीय UTR / Transaction ID दर्ज करें'
          : 'Please enter a valid 12-digit UTR / Transaction ID'
      );
      return;
    }

    setLocalLoading(true);
    try {
      const res = await ReportAccessService.submitUpiPayment(
        reportType,
        profileKey,
        cleanUtr,
        phoneInput || appUser?.phone || appUser?.mobile,
        appUser?.email || supabaseUser?.email
      );

      if (res.success) {
        setSubmittedUtr(cleanUtr);
        setStep('PENDING_VERIFICATION');
      } else {
        setLocalError(res.message || 'Payment submission failed.');
      }
    } catch (err: any) {
      setLocalError(err?.message || 'Failed to submit payment UTR.');
    } finally {
      setLocalLoading(false);
    }
  };

  // 6. Optional Razorpay ₹33 Payment Checkout (preserves existing gateway code)
  const handleInitiatePayment = async () => {
    setLocalLoading(true);
    setLocalError(null);

    try {
      const isRzpReady = await ReportAccessService.loadRazorpayScript();
      if (!isRzpReady) {
        throw new Error("Razorpay payment gateway is not loaded. Please refresh and retry.");
      }

      const orderData = await ReportAccessService.createPaymentOrder(reportType, profileKey, phoneInput);

      if (!orderData?.orderId) {
        throw new Error("Could not initialize payment order.");
      }

      setStep('PAYMENT_PROCESSING');

      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: orderData.currency,
        name: "LeoFamily Astrological Services",
        description: `${reportDef.titleEn} (Full Dossier)`,
        order_id: orderData.orderId,
        prefill: {
          contact: phoneInput || appUser?.phone || appUser?.mobile || '',
          email: appUser?.email || supabaseUser?.email || '',
        },
        theme: {
          color: "#D97706",
        },
        modal: {
          ondismiss: () => {
            setStep('ACCESS_OPTIONS');
          },
        },
        handler: async (response: any) => {
          try {
            setLocalLoading(true);
            const verifyRes = await ReportAccessService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              reportType,
              profileKey,
              phoneInput
            );

            if (verifyRes.success && verifyRes.accessGranted) {
              setStep('SUCCESS');
              onAccessGranted();
            } else {
              setStep('ACCESS_OPTIONS');
              setLocalError("Payment verification failed on server.");
            }
          } catch (verErr: any) {
            setStep('ACCESS_OPTIONS');
            setLocalError(verErr?.message || "Payment verification failed.");
          } finally {
            setLocalLoading(false);
          }
        },
      };

      const rzpInstance = new (window as any).Razorpay(options);
      rzpInstance.on('payment.failed', (resp: any) => {
        setStep('ACCESS_OPTIONS');
        setLocalError(`Payment Failed: ${resp.error?.description || 'Transaction declined'}`);
      });

      rzpInstance.open();
    } catch (e: any) {
      setStep('ACCESS_OPTIONS');
      setLocalError(e?.message || 'Failed to start payment');
    } finally {
      setLocalLoading(false);
    }
  };

  const isFreeEligible = accessResult?.canClaimFree ?? true;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border-2 border-amber-300/80 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" />
            <div>
              <h2 className="font-playfair text-base font-bold tracking-wide text-amber-100">
                LeoFamily Report Access
              </h2>
              <p className="text-[10px] text-amber-200/80 font-mono">
                Authoritative Report Entitlement
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
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Top Report Info */}
          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                {language === 'hi' ? 'चयनित रिपोर्ट' : 'Selected Report'}
              </div>
              <h4 className="font-playfair font-bold text-slate-800 text-sm md:text-base">
                {language === 'hi' ? reportDef.titleHi : reportDef.titleEn}
              </h4>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-[#D97706] font-playfair text-base">
                {isFreeEligible ? 'FREE (₹0)' : '₹33 only'}
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

          {/* STEP 1: AUTH REQUIRED (Google or WhatsApp) */}
          {step === 'AUTH_REQUIRED' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#92400E] border border-amber-300 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest">
                  <Lock className="w-3 h-3 text-[#D97706]" />
                  {language === 'hi' ? 'लॉगिन आवश्यक' : 'Login Required'}
                </div>
                <h3 className="font-playfair text-lg md:text-xl font-bold text-slate-800">
                  {language === 'hi' ? 'अपनी रिपोर्ट अनलॉक करने के लिए लॉगिन करें' : 'Login to unlock your report'}
                </h3>
              </div>

              {!otpSent ? (
                <div className="space-y-4">
                  {/* Google Sign In */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 text-slate-800 font-semibold rounded-2xl text-xs md:text-sm shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                  >
                    {isGoogleLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>{language === 'hi' ? 'Google से जारी रखें (Continue with Google)' : 'Continue with Google'}</span>
                  </button>

                  {/* Divider */}
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-amber-200"></div>
                    <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-slate-400">
                      {language === 'hi' ? 'या WhatsApp से' : 'or with WhatsApp'}
                    </span>
                    <div className="flex-grow border-t border-amber-200"></div>
                  </div>

                  {/* WhatsApp Form */}
                  <form onSubmit={handleSendWhatsAppOtp} className="space-y-4">
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-semibold text-slate-700">
                        {language === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}
                      </label>
                      <div className="relative flex items-center">
                        <div className="absolute left-3.5 flex items-center gap-1 text-xs font-mono font-bold text-slate-600 pointer-events-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={12}
                          className="w-full pl-20 pr-4 py-3 bg-white border-2 border-amber-200 rounded-2xl text-xs md:text-sm text-slate-800 font-mono tracking-wider focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-[#15803D] to-[#16A34A] hover:from-[#166534] hover:to-[#15803D] text-white font-bold rounded-2xl text-xs md:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSendingOtp ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageSquare className="w-4 h-4" />
                      )}
                      <span>
                        {language === 'hi'
                          ? 'WhatsApp कोड भेजें (Send WhatsApp Code)'
                          : 'Send WhatsApp Code'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                /* OTP Verification */
                <form onSubmit={handleVerifyWhatsAppOtp} className="space-y-4 animate-in fade-in">
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center text-xs text-slate-700">
                    <div>{language === 'hi' ? 'WhatsApp पर भेजा गया कोड दर्ज करें:' : 'Enter code sent to WhatsApp:'}</div>
                    <div className="font-mono font-bold text-[#92400E] mt-0.5">{targetPhone || phoneInput}</div>
                  </div>

                  <div className="space-y-1 text-left">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="• • • • • •"
                      maxLength={6}
                      autoFocus
                      className="w-full py-3.5 px-4 bg-white border-2 border-amber-300 rounded-2xl text-center text-xl font-mono tracking-[0.4em] font-bold text-slate-800 focus:border-[#D97706] focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all shadow-xs"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpInput.length < 4}
                    className="w-full py-3.5 px-4 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-2xl text-xs md:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isVerifyingOtp ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    <span>{language === 'hi' ? 'सत्यापित करें (Verify Code)' : 'Verify Code'}</span>
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={resetOtpFlow}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'नंबर बदलें' : 'Change Number'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={resendWhatsAppOtp}
                      disabled={!canResend || isLoading}
                      className={`flex items-center gap-1 cursor-pointer ${
                        canResend ? 'text-[#D97706] font-bold' : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>{canResend ? (language === 'hi' ? 'पुनः भेजें' : 'Resend Code') : `Resend (${cooldownSeconds}s)`}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: ACCESS OPTIONS (CLAIM FREE OR PAY ₹33) */}
          {step === 'ACCESS_OPTIONS' && (
            <div className="space-y-6">
              {isFreeEligible ? (
                /* Free Claim Card */
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 text-center space-y-4 shadow-xs">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Gift className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg font-bold text-emerald-900">
                      {language === 'hi' ? '🎉 आपकी पहली रिपोर्ट 100% मुफ़्त है!' : '🎉 Your First Report is 100% FREE!'}
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      {language === 'hi'
                        ? 'लियोफैमिली नए पंजीकृत उपयोगकर्ताओं को पहली विशेषज्ञ रिपोर्ट निःशुल्क प्रदान करता है।'
                        : 'LeoFamily offers your first comprehensive specialist report completely free of cost.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleClaimFree}
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-2xl text-xs md:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {localLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Gift className="w-4 h-4" />
                    )}
                    <span>
                      {language === 'hi'
                        ? 'मुफ़्त रिपोर्ट अभी अनलॉक करें (Unlock Free Report Now)'
                        : 'Unlock Free Report Now'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* ₹33 UPI QR Payment Flow (Primary) & Optional Gateway Tab */
                <div className="space-y-4">
                  {/* Mode Selector */}
                  <div className="flex items-center justify-center p-1 bg-amber-100/70 rounded-xl border border-amber-200 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('UPI_QR')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        selectedPaymentMethod === 'UPI_QR'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/50'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI QR Scan (अनुशंसित)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('GATEWAY')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        selectedPaymentMethod === 'GATEWAY'
                          ? 'bg-amber-700 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-200/50'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Online Payment Gateway</span>
                    </button>
                  </div>

                  {selectedPaymentMethod === 'UPI_QR' ? (
                    /* UPI QR & UTR Entry Container */
                    <div className="space-y-4">
                      {/* Pricing banner */}
                      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-slate-900">
                            {language === 'hi' ? '32-अध्याय सम्पूर्ण मास्टर रिपोर्ट' : '32-Section Master Report'}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            अपने UPI App से QR स्कैन कर ₹33 का Payment करें
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-extrabold text-[#D97706] font-playfair">₹33 only</div>
                        </div>
                      </div>

                      {/* QR Display Card */}
                      <div className="bg-white p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col items-center justify-center space-y-3">
                        <div className="w-44 h-44 bg-white rounded-xl p-1.5 border border-amber-200 flex items-center justify-center shadow-inner">
                          <img
                            src={PAYMENT_CONFIG.LEOFAMILY_PAYMENT_QR}
                            alt="LeoFamily UPI QR"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Supported Apps */}
                        <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] font-medium text-slate-600">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100">GPay</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">PhonePe</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">Paytm</span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">BHIM</span>
                        </div>

                        {/* Copy UPI ID */}
                        <div className="w-full">
                          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                            <div className="text-left font-mono text-[11px] font-bold text-slate-800">
                              {PAYMENT_CONFIG.LEOFAMILY_UPI_ID}
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {upiCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{upiCopied ? 'Copied' : 'Copy ID'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Mobile Direct App Launch */}
                        <div className="w-full">
                          <a
                            href={PAYMENT_CONFIG.getUpiIntentUrl(33)}
                            className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open in UPI App (Mobile)</span>
                          </a>
                        </div>
                      </div>

                      {/* UTR Form */}
                      <form onSubmit={handleUpiSubmit} className="space-y-2.5 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
                        <label className="block text-xs font-bold text-slate-800">
                          Payment करने के बाद नीचे अपना UTR / Transaction ID दर्ज करें:
                        </label>

                        <input
                          type="text"
                          value={utrInput}
                          onChange={(e) => setUtrInput(e.target.value)}
                          placeholder="12-digit UTR / Ref Number (e.g. 427819384910)"
                          required
                          className="w-full px-3.5 py-2.5 rounded-xl border-2 border-amber-300 focus:border-amber-600 bg-white text-slate-900 font-mono text-xs tracking-wider uppercase font-semibold outline-hidden shadow-xs"
                        />

                        <button
                          type="submit"
                          disabled={localLoading || !utrInput.trim()}
                          className="w-full py-3 px-4 bg-gradient-to-r from-[#92400E] via-[#B45309] to-[#D97706] hover:from-[#78350F] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {localLoading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <ShieldCheck className="w-4 h-4" />
                          )}
                          <span>मैंने ₹33 का Payment कर दिया (Submit UTR)</span>
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Optional Razorpay Gateway Fallback */
                    <div className="space-y-4 pt-2">
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 space-y-2">
                        <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                          <span>{language === 'hi' ? 'विशेषज्ञ रिपोर्ट शुल्क' : 'Specialist Report Fee'}</span>
                          <span className="text-[#D97706] font-playfair text-lg">₹33 only</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          क्रेडिट कार्ड, डेबिट कार्ड, या नेट बैंकिंग द्वारा सुरक्षित भुगतान।
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleInitiatePayment}
                        disabled={isLoading}
                        className="w-full py-3.5 px-6 bg-[#D97706] hover:bg-[#B45309] text-white font-bold rounded-2xl text-xs md:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {localLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Unlock className="w-4 h-4" />
                        )}
                        <span>Pay ₹33 with Gateway</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2B: PENDING VERIFICATION */}
          {step === 'PENDING_VERIFICATION' && (
            <div className="py-6 text-center space-y-4 bg-white p-5 rounded-3xl border border-amber-200 shadow-sm animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-7 h-7 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono text-xs font-bold">
                  PENDING VERIFICATION
                </div>
                <h4 className="font-playfair text-lg font-bold text-slate-900">
                  Payment Verification Pending
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  आपका UTR <span className="font-mono font-bold text-slate-900">{submittedUtr || utrInput}</span> प्राप्त हो गया है। Verification complete होने के बाद Master Report आपके account में unlock होगा।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-900 space-y-1">
                <p>• Verification आमतौर पर 5 से 15 मिनट के भीतर पूर्ण हो जाता है।</p>
                <p>• Verification के बाद आपका Master Report unlock किया जाएगा।</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={fetchAccessDetails}
                  disabled={localLoading}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${localLoading ? 'animate-spin' : ''}`} />
                  <span>Check Status (जांचें)</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT PROCESSING */}
          {step === 'PAYMENT_PROCESSING' && (
            <div className="py-8 text-center space-y-4">
              <RefreshCw className="w-10 h-10 animate-spin text-[#D97706] mx-auto" />
              <h4 className="font-playfair text-lg font-bold text-slate-800">
                {language === 'hi' ? 'भुगतान प्रक्रियाधीन है...' : 'Processing Payment...'}
              </h4>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'कृपया गेटवे विंडो में भुगतान पूर्ण करें।'
                  : 'Please complete the transaction in the Razorpay window.'}
              </p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-playfair text-xl font-bold text-emerald-900">
                {language === 'hi' ? 'रिपोर्ट सफलतापूर्वक अनलॉक हो गई!' : 'Report Successfully Unlocked!'}
              </h4>
              <p className="text-xs text-slate-600">
                {language === 'hi'
                  ? 'आपकी सम्पूर्ण रिपोर्ट तैयार है।'
                  : 'Your complete specialist report is now ready for consultation.'}
              </p>

              <button
                type="button"
                onClick={() => {
                  onAccessGranted();
                  onClose();
                }}
                className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs md:text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                {language === 'hi' ? 'रिपोर्ट देखें (View Report)' : 'View Report Now'}
              </button>
            </div>
          )}

          {/* Security Assurance */}
          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            <span>LeoFamily 256-Bit Encrypted Entitlement Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPaywallModal;
