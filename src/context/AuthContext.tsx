import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSupabaseAuth, UseSupabaseAuthReturn } from '../hooks/useSupabaseAuth';
import { LeoFamilyAuthModal } from '../components/LeoFamilyAuthModal';

export interface AuthContextType extends UseSupabaseAuthReturn {
  isAuthModalOpen: boolean;
  openAuthModal: (onSuccessCallback?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useSupabaseAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

  const openAuthModal = (onSuccessCallback?: () => void) => {
    if (onSuccessCallback) {
      setAuthSuccessCallback(() => onSuccessCallback);
    } else {
      setAuthSuccessCallback(null);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    auth.resetOtpFlow();
  };

  const handleModalSuccess = () => {
    setIsAuthModalOpen(false);
    if (authSuccessCallback) {
      authSuccessCallback();
      setAuthSuccessCallback(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      <LeoFamilyAuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccess={handleModalSuccess}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
