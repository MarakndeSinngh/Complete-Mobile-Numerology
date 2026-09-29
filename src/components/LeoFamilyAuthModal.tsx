import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  MessageSquare,
  Lock,
  ArrowRight,
  RefreshCw,
  Phone,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useLanguage } from '../i18n';
import { BrandLogo } from './BrandLogo';

export interface LeoFamilyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const LeoFamilyAuthModal: React.FC<LeoFamilyAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  subtitle,
}) => {
  const { language } = useLanguage();
  const {
    isAuthenticated,
    isSendingOtp,
    isVerifyingOtp,
    otpSent,
    targetPhone,
    cooldownSeconds,
    canResend,
    error: authError,
    signInWithGoogle,
    signInWithWhatsApp,
    verifyWhatsAppOtp,
    resendWhatsAppOtp,
    clearError,
    resetOtpFlow,
  } = useSupabaseAuth();

  const [phoneInput, setPhoneInput] = useState<string>('');
  const [otpInput, setOtpInput] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const error = localError || authError;
  const isLoading = isSendingOtp || isVerifyingOtp || isGoogleLoading;

  useEffect(() => {
    if (isOpen) {
      setLocalError(null);
      clearError();
      if (isAuthenticated) {
        onSuccess?.();
        onClose();
      }
    } else {
      resetOtpFlow();
      setOtpInput('');
    }
  }, [isOpen, isAuthenticated, clearError, resetOtpFlow, onSuccess, onClose]);

  if (!isOpen) return null;

  // 1. Google Sign-In
  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
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

  // 2. WhatsApp OTP Send
  const handleSendWhatsAppCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    clearError();

    const digits = phoneInput.replace(/\D/g, '');
    if (!digits || digits.length < 10) {
      setLocalError(
        language === 'hi'
          ? 'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें'
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
  const handleVerifyWhatsAppCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLocalError(null);
    clearError();

    const cleanOtp = otpInput.replace(/\D/g, '').trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setLocalError(
        language === 'hi'
          ? 'कृपया व्हाट्सएप पर प्राप्त 6-अंकीय कोड दर्ज करें'
          : 'Please enter the 6-digit code received on WhatsApp'
      );
      return;
    }

    const res = await verifyWhatsAppOtp(targetPhone || phoneInput, cleanOtp);
    if (res.success) {
      onSuccess?.();
      onClose();
    } else {
      setLocalError(res.error || 'Verification failed. Please check the code.');
    }
  };

  // 4. Resend WhatsApp OTP
  const handleResend = async () => {
    if (!canResend || isLoading) return;
    setLocalError(null);
    clearError();
    const res = await resendWhatsAppOtp();
    if (!res.success) {
      setLocalError(res.error || 'Failed to resend code');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5EFE1] border-2 border-amber-300/80 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#78350F] via-[#92400E] to-[#B45309] text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" />
            <div>
              <h2 className="font-playfair text-base font-bold tracking-wide text-amber-100">
                LeoFamily Account
              </h2>
              <p className="text-[10px] text-amber-200/80 font-mono">
                Secure Cloud Sync & Consultation
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
          {/* Title & Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-[#92400E] border border-amber-300 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest">
              <Lock className="w-3.5 h-3.5 text-[#D97706]" />
              {language === 'hi' ? 'लॉगिन / प्रमाणीकरण' : 'Secure Login'}
            </div>
            <h3 className="font-playfair text-xl md:text-2xl font-bold text-slate-800 leading-tight">
              {title || (language === 'hi' ? 'अपनी रिपोर्ट अनलॉक करने के लिए लॉगिन करें' : 'Login to unlock your Complete Report')}
            </h3>
            <p className="text-xs text-slate-600">
              {subtitle || (language === 'hi' ? 'सुरक्षित लॉगिन माध्यम चुनें। आपकी रिपोर्ट LeoFamily खाते में सुरक्षित रहेगी।' : 'Choose a secure login method. Your reports will be securely saved to your account.')}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {!otpSent ? (
            <div className="space-y-5">
              {/* Option 1: Google Sign In */}
              <div>
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
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{language === 'hi' ? 'Google से जारी रखें (Continue with Google)' : 'Continue with Google'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-amber-200"></div>
                <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-slate-400">
                  {language === 'hi' ? 'या WhatsApp से' : 'or with WhatsApp'}
                </span>
                <div className="flex-grow border-t border-amber-200"></div>
              </div>

              {/* Option 2: WhatsApp OTP Sign In */}
              <form onSubmit={handleSendWhatsAppCode} className="space-y-4">
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
                  <p className="text-[10px] text-slate-500">
                    {language === 'hi'
                      ? 'हम आपको WhatsApp पर 6 अंकों का सुरक्षित कोड भेजेंगे।'
                      : 'We will send a 6-digit verification code to your WhatsApp.'}
                  </p>
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
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyWhatsAppCode} className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-1">
                <div className="text-xs font-medium text-slate-700">
                  {language === 'hi' ? 'WhatsApp पर भेजा गया कोड दर्ज करें:' : 'Enter code sent to WhatsApp:'}
                </div>
                <div className="text-xs font-mono font-bold text-[#92400E]">
                  {targetPhone || phoneInput}
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-semibold text-slate-700 text-center">
                  {language === 'hi' ? '6-अंकीय WhatsApp कोड (Verification Code)' : '6-Digit Verification Code'}
                </label>
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
                <span>
                  {language === 'hi'
                    ? 'सत्यापित करें (Verify WhatsApp Code)'
                    : 'Verify WhatsApp Code'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Actions: Change Number & Resend */}
              <div className="pt-2 flex items-center justify-between text-xs font-medium">
                <button
                  type="button"
                  onClick={resetOtpFlow}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'नंबर बदलें (Change Number)' : 'Change Number'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isLoading}
                  className={`flex items-center gap-1 cursor-pointer transition-colors ${
                    canResend
                      ? 'text-[#D97706] hover:text-[#B45309] font-bold'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                  <span>
                    {canResend
                      ? language === 'hi'
                        ? 'पुनः भेजें (Resend Code)'
                        : 'Resend Code'
                      : `${language === 'hi' ? 'पुनः भेजें' : 'Resend in'} (${cooldownSeconds}s)`}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="pt-3 border-t border-amber-200/60 flex items-center justify-center gap-1.5 text-[10px] font-mono text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
            <span>LeoFamily 256-Bit Encrypted Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeoFamilyAuthModal;
