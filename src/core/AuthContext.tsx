/**
 * LEOFAMILY AUTH CONTEXT & PROVIDER
 * Provides centralized Supabase Auth state, Google OAuth, WhatsApp Phone OTP, and auth modal controls.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useSupabaseAuth, UseSupabaseAuthReturn } from '../hooks/useSupabaseAuth';

interface AuthContextValue extends UseSupabaseAuthReturn {
  isAuthModalOpen: boolean;
  openAuthModal: (options?: { onLoginSuccess?: () => void; returnTitle?: string }) => void;
  closeAuthModal: () => void;
  onLoginSuccessCallback: (() => void) | null;
  returnTitle: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [returnTitle, setReturnTitle] = useState('');
  const [onLoginSuccessCallback, setOnLoginSuccessCallback] = useState<(() => void) | null>(null);

  const openAuthModal = useCallback(
    (options?: { onLoginSuccess?: () => void; returnTitle?: string }) => {
      if (options?.returnTitle) setReturnTitle(options.returnTitle);
      if (options?.onLoginSuccess) {
        setOnLoginSuccessCallback(() => options.onLoginSuccess);
      } else {
        setOnLoginSuccessCallback(null);
      }
      setIsAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    auth.resetOtpFlow();
  }, [auth]);

  const value = useMemo(
    () => ({
      ...auth,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      onLoginSuccessCallback,
      returnTitle,
    }),
    [auth, isAuthModalOpen, openAuthModal, closeAuthModal, onLoginSuccessCallback, returnTitle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
