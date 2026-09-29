/**
 * LEOFAMILY REPORT ACCESS HOOK
 * Centralized report access policy & entitlement verification.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  CanonicalReportType,
  ReportAccessCheckResult,
} from '../types/reportAccess';
import { ReportAccessService } from '../services/reportAccessService';

export interface UseReportAccessResult {
  accessStatus: ReportAccessCheckResult | null;
  isLoading: boolean;
  isUnlocked: boolean;
  isModalOpen: boolean;
  error: string | null;
  checkAccess: () => Promise<ReportAccessCheckResult>;
  openAccessModal: () => void;
  closeAccessModal: () => void;
  requireAccess: (onSuccess?: () => void) => boolean;
  handleAccessGranted: () => void;
  claimFree: () => Promise<boolean>;
}

export function useReportAccess(
  reportType: CanonicalReportType,
  profileKey: string = 'default_profile'
): UseReportAccessResult {
  const [accessStatus, setAccessStatus] = useState<ReportAccessCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const isPublic = ReportAccessService.isPublicReport(reportType);

  const checkAccess = useCallback(async (): Promise<ReportAccessCheckResult> => {
    // Public reports (Mobile Numerology & Lo Shu Grid) are always unlocked without login
    if (isPublic) {
      const freeResult: ReportAccessCheckResult = {
        allowed: true,
        requiresPayment: false,
        isFirstFreeReport: false,
        isFreeReportType: true,
        canClaimFree: false,
        price: 0,
        reportType,
        profileKey,
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
      const res = await ReportAccessService.checkAccess(reportType, profileKey);
      setAccessStatus(res);
      setIsUnlocked(res.allowed);
      return res;
    } catch (err: any) {
      console.warn('Report access check notice:', err);
      setError(err.message || 'Could not verify report access');
      const fallback: ReportAccessCheckResult = {
        allowed: false,
        requiresPayment: true,
        isFirstFreeReport: false,
        isFreeReportType: false,
        canClaimFree: false,
        price: 33,
        reportType,
        profileKey,
      };
      setAccessStatus(fallback);
      setIsUnlocked(false);
      return fallback;
    } finally {
      setIsLoading(false);
    }
  }, [reportType, profileKey, isPublic]);

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
      if (isPublic || isUnlocked) {
        onSuccess?.();
        return true;
      }
      if (onSuccess) {
        setPendingCallback(() => onSuccess);
      }
      setIsModalOpen(true);
      return false;
    },
    [isPublic, isUnlocked]
  );

  const claimFree = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      await ReportAccessService.claimFreeReport(reportType, profileKey);
      handleAccessGranted();
      return true;
    } catch (e: any) {
      setError(e.message || 'Failed to claim free report');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [reportType, profileKey, handleAccessGranted]);

  return {
    accessStatus,
    isLoading,
    isUnlocked,
    isModalOpen,
    error,
    checkAccess,
    openAccessModal,
    closeAccessModal,
    requireAccess,
    handleAccessGranted,
    claimFree,
  };
}
