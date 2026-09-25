/**
 * LEOFAMILY REPORT ACCESS HOOK
 * Phase 16: Dynamic Access Gate & Entitlement Hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CanonicalReportType,
  ReportAccessCheckResult,
  UserSession,
  REPORT_REGISTRY,
} from '../types/reportAccess';
import { ReportAccessService } from '../services/reportAccessService';

export interface UseReportAccessResult {
  accessStatus: ReportAccessCheckResult | null;
  isLoading: boolean;
  isUnlocked: boolean;
  isModalOpen: boolean;
  error: string | null;
  currentUser: UserSession | null;
  checkAccess: () => Promise<ReportAccessCheckResult>;
  openAccessModal: () => void;
  closeAccessModal: () => void;
  requireAccess: (onSuccess?: () => void) => boolean;
  handleAccessGranted: () => void;
  claimFree: () => Promise<boolean>;
}

export function useReportAccess(
  reportType: CanonicalReportType,
  profileKey: string,
  mobile?: string
): UseReportAccessResult {
  const [accessStatus, setAccessStatus] = useState<ReportAccessCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() =>
    ReportAccessService.getStoredUser()
  );
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const checkAccess = useCallback(async (): Promise<ReportAccessCheckResult> => {
    // 1. Mobile numerology is always unlocked
    if (reportType === 'MOBILE_NUMEROLOGY') {
      const freeResult: ReportAccessCheckResult = {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey: profileKey || 'default_profile',
        accessType: 'FREE',
      };
      setAccessStatus(freeResult);
      setIsUnlocked(true);
      setIsLoading(false);
      return freeResult;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await ReportAccessService.checkAccess(reportType, profileKey, mobile);
      setAccessStatus(res);
      setIsUnlocked(res.allowed);
      setCurrentUser(ReportAccessService.getStoredUser());
      return res;
    } catch (err: any) {
      console.warn("Report access check error:", err);
      setError(err.message || 'Could not verify report access');
      const fallback: ReportAccessCheckResult = {
        allowed: false,
        requiresPayment: true,
        isFirstFreeReport: false,
        isFreeReportType: false,
        canClaimFree: false,
        price: 33,
        reportType,
        profileKey: profileKey || 'default_profile',
      };
      setAccessStatus(fallback);
      setIsUnlocked(false);
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, [reportType, profileKey, mobile]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const openAccessModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeAccessModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingCallback(null);
  }, []);

  const handleAccessGranted = useCallback(() => {
    setIsUnlocked(true);
    setIsModalOpen(false);
    checkAccess();
    if (pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
    }
  }, [checkAccess, pendingCallback]);

  const requireAccess = useCallback(
    (onSuccess?: () => void): boolean => {
      // Mobile Numerology is ALWAYS allowed
      if (reportType === 'MOBILE_NUMEROLOGY' || isUnlocked) {
        onSuccess?.();
        return true;
      }

      // If not unlocked, save callback and open paywall / verification modal
      if (onSuccess) {
        setPendingCallback(() => onSuccess);
      }
      setIsModalOpen(true);
      return false;
    },
    [reportType, isUnlocked]
  );

  const claimFree = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await ReportAccessService.claimFreeReport(reportType, profileKey, mobile);
      handleAccessGranted();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to claim free report');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [reportType, profileKey, mobile, handleAccessGranted]);

  return {
    accessStatus,
    isLoading,
    isUnlocked,
    isModalOpen,
    error,
    currentUser,
    checkAccess,
    openAccessModal,
    closeAccessModal,
    requireAccess,
    handleAccessGranted,
    claimFree,
  };
}
