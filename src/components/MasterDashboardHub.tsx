import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Compass, Phone, User, Heart, Briefcase, FileText, 
  Home, Car, Activity, Shield, Calendar, Baby, PenTool, 
  ArrowRight, Award, Layers, CheckCircle2, RefreshCw, Star, 
  ChevronRight, TrendingUp, ShieldAlert, BookOpen
} from 'lucide-react';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from '../types';
import { CompleteNumerologyProfile } from '../core/types';
import { NavPortalId, NAV_CATEGORIES } from './MasterNavigation';
import { formatDateIndian } from '../utils/dateUtils';
import { useLanguage } from '../i18n';

interface MasterDashboardHubProps {
  personalDetails: PersonalDetails | null;
  dobData: DOBAnalysis | null;
  nameData: NameAnalysis | null;
  mobileData: MobileAnalysis | null;
  remedies: remediesAdvice | null;
  profile: CompleteNumerologyProfile | null;
  onNavigate: (portalId: NavPortalId) => void;
  onOpenProfileModal: () => void;
  onLoadDemo: () => void;
}

export const MasterDashboardHub: React.FC<MasterDashboardHubProps> = ({
  personalDetails,
  dobData,
  nameData,
  mobileData,
  remedies,
  profile,
  onNavigate,
  onOpenProfileModal,
  onLoadDemo,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-12 animate-in fade-in duration-500 font-sans">
      
      {/* HERO BANNER - MASTER PLATFORM INTRO */}
      <div className="rounded-[36px] p-8 md:p-12 lg:p-14 bg-gradient-to-br from-[#FFFDF9] via-[#FBF7EE] to-[#F3EADB] border border-[#D97706]/20 shadow-md relative overflow-hidden">
        {/* Background Subtle Mandala */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none select-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#D97706] rotate-12">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#D97706]/10 px-4 py-1.5 rounded-full border border-[#D97706]/20 text-[#D97706] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> {t('common.tagline')}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-playfair text-[#1F2937] leading-[1.2]">
            {t('hub.heroTitle')} <br className="hidden sm:inline" />
            <span className="text-[#D97706]">Complete Astro-Vibration Suite</span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-3xl">
            {t('hub.heroSubtitle')}
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap gap-4 pt-2">
            {personalDetails ? (
              <>
                <button
                  onClick={() => onNavigate('MASTER_REPORT')}
                  className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" /> {t('hub.viewMasterDossierBtn')}
                </button>
                <button
                  onClick={() => onNavigate('CORE_LOSHU')}
                  className="bg-white hover:bg-gray-50 text-[#1E3A8A] border border-gray-200 font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4" /> {t('nav.coreLoshu')}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenProfileModal}
                  className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" /> {t('profile.editProfileTitle')}
                </button>
                <button
                  onClick={onLoadDemo}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold px-5 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#D97706]" /> {t('common.loadDemo')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE PROFILE MATRIX SUMMARY (If Profile Loaded) */}
      {personalDetails && dobData && (
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> {t('hub.activeMatrixTitle')}
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-playfair text-[#1F2937]">
                {personalDetails.name} — {t('hub.driverConductorMatch')}
              </h3>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              DOB: <span className="font-bold text-gray-800">{formatDateIndian(personalDetails.dob)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('common.mulank')}</span>
              <span className="text-2xl font-extrabold text-[#D97706] block my-0.5">{dobData.birthNumber}</span>
              <span className="text-[10px] text-gray-500">{dobData.birthPlanet || 'Planet'}</span>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('common.bhagyank')}</span>
              <span className="text-2xl font-extrabold text-[#1E3A8A] block my-0.5">{dobData.lifePathNumber}</span>
              <span className="text-[10px] text-gray-500">{dobData.lifePathPlanet || 'Planet'}</span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('common.kuaNumber')}</span>
              <span className="text-2xl font-extrabold text-emerald-700 block my-0.5">{dobData.kuaNumber || '—'}</span>
              <span className="text-[10px] text-gray-500">Vastu Energy</span>
            </div>

            <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('name.singleNameRoot')}</span>
              <span className="text-2xl font-extrabold text-purple-700 block my-0.5">
                {nameData?.chaldeanTotal ? ((nameData.chaldeanTotal - 1) % 9 + 1) : '—'}
              </span>
              <span className="text-[10px] text-gray-500">Chaldean</span>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('common.luckyDays')}</span>
              <span className="text-xs font-bold text-indigo-900 block my-2">
                {remedies?.luckyDays?.[0] || 'Sunday, Thursday'}
              </span>
              <span className="text-[10px] text-gray-500">Days</span>
            </div>

            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-3.5 text-center">
              <span className="text-[11px] text-gray-500 font-medium block">{t('common.luckyGems')}</span>
              <span className="text-xs font-bold text-rose-900 block my-2 truncate">
                {remedies?.gemstone || 'Ruby / Yellow Sapphire'}
              </span>
              <span className="text-[10px] text-gray-500">Gem</span>
            </div>
          </div>
        </div>
      )}

      {/* MASTER DOSSIER HIGHLIGHT BANNER */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[11px] font-semibold text-amber-300">
            <Award className="w-3.5 h-3.5" /> 30+ Sections Master Life Dossier
          </div>
          <h3 className="text-2xl md:text-3xl font-bold font-playfair">
            {t('hub.masterDossierCardTitle')}
          </h3>
          <p className="text-blue-100 text-xs md:text-sm max-w-2xl">
            {t('hub.masterDossierCardDesc')}
          </p>
        </div>
        <button
          onClick={() => onNavigate('MASTER_REPORT')}
          className="whitespace-nowrap bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>{t('hub.viewMasterDossierBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CATEGORIZED BENTO TOOL GRID */}
      <div className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-widest font-mono">
            {t('common.allTools')}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-playfair text-[#1F2937]">
            {t('hub.toolsGridTitle')}
          </h2>
          <p className="text-xs text-gray-500">
            {t('hub.toolsGridSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NAV_CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                      {category.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 font-playfair">{t(category.i18nKey) || category.titleHi}</h4>
                      <span className="text-[10px] text-gray-400 block">{category.titleEn}</span>
                    </div>
                  </div>
                </div>

                {/* Sub-items list */}
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <button
                      key={item.portalId}
                      onClick={() => onNavigate(item.portalId)}
                      className="w-full text-left p-3 rounded-2xl bg-[#F8F4EF]/70 hover:bg-[#F2E8DC] border border-transparent hover:border-[#D97706]/20 transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-lg bg-white shadow-xs text-[#D97706]">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-800 group-hover:text-[#D97706] transition truncate">
                              {t(item.i18nKey) || item.titleHi}
                            </span>
                            {item.badge && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {(item.descI18nKey && t(item.descI18nKey)) || (language === 'en' ? item.descEn : item.descHi)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#D97706] group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Launch */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate(category.items[0].portalId)}
                  className="w-full text-center py-2 text-[11px] font-bold text-[#D97706] hover:text-[#B45309] transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{t('hub.launchTool')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {/* Quick AI Consultation Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-white/20">
                  <Sparkles className="w-5 h-5 text-amber-100" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-playfair">{t('nav.aiConsultation')}</h4>
                  <span className="text-[10px] text-amber-100 block">Vedic Expert Guidance</span>
                </div>
              </div>
              <p className="text-xs text-amber-50 leading-relaxed mb-4">
                {t('common.disclaimerText')}
              </p>
              <div className="space-y-1.5 text-[11px] text-amber-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t('report.executiveSummary')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                  <span>{t('report.mantraRemedies')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('AI_CONSULTATION')}
              className="w-full bg-white text-amber-900 hover:bg-amber-50 font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('common.explore')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TRUST & OCCULT METHODOLOGY SECTION */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 md:p-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#D97706] uppercase tracking-widest font-mono">
            {t('common.authorityNote')}
          </span>
          <h3 className="text-2xl font-bold font-playfair text-[#1F2937]">
            {t('hub.vedicMethodologyTitle')}
          </h3>
          <p className="text-xs text-gray-500">
            {t('hub.vedicMethodologyDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#F8F4EF] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-gray-800 font-playfair">प्राचीन चालडीयन व वैदिक सिद्धांत</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              ध्वनि तरंगों, ग्रहीय युति (81 संयोजनों) तथा लो शू ग्रिड के 8 योगों का वैज्ञानिक समन्वय।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8F4EF] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-gray-800 font-playfair">सटीक 360-डिग्री जीवन मैपिंग</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              नाम, फोन, घर, वाहन, व्यवसाय, हस्ताक्षर एवं विवाह का एक ही छत के नीचे समग्र परीक्षण।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8F4EF] border border-[#E5E7EB] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-gray-800 font-playfair">व्यावहारिक एवं सुरक्षित समाधान</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              अनावश्यक भय से मुक्त — सरल वैदिक, लाल किताब, दिशा संतुलन व स्पेलिंग संशोधन उपाय।
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
