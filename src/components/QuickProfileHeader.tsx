import React from 'react';
import { PersonalDetails, DOBAnalysis } from '../types';
import { User, Calendar, Sparkles, RefreshCw, Edit3, Compass, Star } from 'lucide-react';
import { formatDateIndian } from '../utils/dateUtils';
import { useLanguage } from '../i18n';

interface QuickProfileHeaderProps {
  personalDetails: PersonalDetails | null;
  dobData: DOBAnalysis | null;
  onEditProfile: () => void;
  onLoadDemo: () => void;
  onResetProfile: () => void;
}

export const QuickProfileHeader: React.FC<QuickProfileHeaderProps> = ({
  personalDetails,
  dobData,
  onEditProfile,
  onLoadDemo,
  onResetProfile,
}) => {
  const { t } = useLanguage();

  // Compute personal year if DOB is present
  const computePersonalYear = (dobStr?: string) => {
    if (!dobStr) return null;
    const parts = dobStr.split('-');
    if (parts.length < 3) return null;
    const day = parseInt(parts[2], 10);
    const month = parseInt(parts[1], 10);
    const currentYear = new Date().getFullYear();
    const sumDigits = (num: number): number => {
      let sum = 0;
      while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
      }
      return sum;
    };
    const reduceToSingle = (num: number): number => {
      while (num > 9) {
        num = sumDigits(num);
      }
      return num;
    };
    return reduceToSingle(reduceToSingle(day) + reduceToSingle(month) + reduceToSingle(currentYear));
  };

  const personalYear = personalDetails?.dob ? computePersonalYear(personalDetails.dob) : null;

  return (
    <div className="bg-gradient-to-r from-[#FFFDF9] via-[#FDFBF7] to-[#FAF6EE] border border-[#E5E7EB] rounded-2xl p-3 md:p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs print:hidden">
      {personalDetails && dobData ? (
        <>
          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto">
            {/* User badge */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#D97706]/20 shadow-xs">
              <div className="w-6 h-6 rounded-full bg-[#D97706]/10 flex items-center justify-center text-[#D97706]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-[#1F2937] block leading-tight">{personalDetails.name}</span>
                <span className="text-[10px] text-gray-500 font-mono leading-none">
                  {formatDateIndian(personalDetails.dob)}
                </span>
              </div>
            </div>

            {/* Mulank / Bhagyank pills */}
            <div className="flex items-center gap-1.5 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60">
              <span className="text-gray-500 font-medium">{t('common.mulank')}:</span>
              <span className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center font-bold text-[11px]">
                {dobData.birthNumber}
              </span>
              <span className="text-gray-300 mx-1">|</span>
              <span className="text-gray-500 font-medium">{t('common.bhagyank')}:</span>
              <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-[11px]">
                {dobData.lifePathNumber}
              </span>
            </div>

            {/* Personal Year pill */}
            {personalYear && (
              <div className="hidden sm:flex items-center gap-1.5 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100 text-indigo-900">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-medium">{t('common.personalYear')} {new Date().getFullYear()}:</span>
                <span className="font-bold bg-white px-1.5 py-0.5 rounded text-indigo-700 shadow-xs">
                  {personalYear}
                </span>
              </div>
            )}

            {/* Lucky digits */}
            {dobData.luckyNumbers && dobData.luckyNumbers.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50/80 px-3 py-1.5 rounded-xl border border-emerald-100 text-emerald-900">
                <Star className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">{t('common.luckyNumbers')}:</span>
                <span className="font-bold font-mono">
                  {dobData.luckyNumbers.slice(0, 4).join(', ')}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={onEditProfile}
              className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition text-[11px] shadow-xs cursor-pointer"
              title={t('common.edit')}
            >
              <Edit3 className="w-3 h-3 text-[#D97706]" /> {t('common.edit')}
            </button>
            <button
              onClick={onResetProfile}
              className="bg-[#D97706]/10 hover:bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/20 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition text-[11px] cursor-pointer"
              title={t('common.reset')}
            >
              <RefreshCw className="w-3 h-3" /> {t('common.reset')}
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#1F2937] block">
                {t('profile.setupProfilePrompt')}
              </span>
              <span className="text-[11px] text-gray-500">
                {t('profile.editProfileDesc')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEditProfile}
              className="bg-[#D97706] hover:bg-[#B45309] text-white px-4 py-2 rounded-xl font-bold transition shadow-xs flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5" /> {t('profile.editProfileTitle')}
            </button>
            <button
              onClick={onLoadDemo}
              className="bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] px-3.5 py-2 rounded-xl font-bold transition border border-[#D97706]/20 flex items-center gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> {t('common.loadDemo')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
