import React, { useState, useEffect } from 'react';
import { analyzeDateOfBirth, analyzeNameSystems, analyzeMobileNumber, generateRemedies } from './services/numerologyEngine';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from './types';
import { generateCompleteNumerologyProfile, NumerologyProfile } from './core';
import { 
  Phone, User, Calendar, Compass, Star, FileText, Sparkles, Shield, 
  TrendingUp, Heart, BookOpen, Layers, HelpCircle, RefreshCw, 
  Award, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck, Mail, ArrowLeft
} from 'lucide-react';

// Component imports
import AstroDashboard from './components/AstroDashboard';
import MobileDiagnosticsPanel from './components/MobileDiagnosticsPanel';
import CompatibilityTab from './components/CompatibilityTab';
import RemediesTab from './components/RemediesTab';
import ReportTab from './components/ReportTab';
import AdminPanel from './components/AdminPanel';
import CompleteLoshuGridAnalysis from './components/CompleteLoshuGridAnalysis';
import MarriageCompatibility from './components/MarriageCompatibility';
import PremiumConsultations from './components/PremiumConsultations';
import AIConsultationPortal from './components/AIConsultationPortal';
import NameNumerologyDashboard from './components/NameNumerologyDashboard';
import { NumeroVastuDashboard } from './components/NumeroVastuDashboard';
import { VehicleNumerologyDashboard } from './components/VehicleNumerologyDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { MasterReportUnified } from './components/MasterReportUnified';
import { MasterNavigation, NavPortalId } from './components/MasterNavigation';
import { QuickProfileHeader } from './components/QuickProfileHeader';
import { QuickProfileModal } from './components/QuickProfileModal';
import { MasterDashboardHub } from './components/MasterDashboardHub';
import DateInput from './components/DateInput';
import { formatDateIndian } from './utils/dateUtils';
import { useLanguage, LanguageSelector } from './i18n';

type ViewTab = 'DASHBOARD' | 'MOBILE' | 'NAME' | 'COMPATIBILITY' | 'REMEDIES' | 'REPORT' | 'ADMIN';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('MOBILE');
  const [currentPortal, setCurrentPortal] = useState<NavPortalId>('HOME');
  const [analysisMode, setAnalysisMode] = useState<'QUICK' | 'ADVANCED'>('QUICK');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Input states for Mobile Landing stage
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Auto-calculated variables
  const [dobData, setDobData] = useState<DOBAnalysis | null>(null);
  const [nameData, setNameData] = useState<NameAnalysis | null>(null);
  const [mobileData, setMobileData] = useState<MobileAnalysis | null>(null);
  const [remedies, setRemedies] = useState<remediesAdvice | null>(null);
  const [numerologyProfile, setNumerologyProfile] = useState<NumerologyProfile | null>(null);

  // Load stored profile from localStorage on initial render
  useEffect(() => {
    try {
      const storedActive = localStorage.getItem('leo_active_quick_profile');
      const storedProfiles = localStorage.getItem('leo_saved_consultation_profiles');
      
      let profileToLoad: PersonalDetails | null = null;
      if (storedActive) {
        profileToLoad = JSON.parse(storedActive);
      } else if (storedProfiles) {
        const parsed = JSON.parse(storedProfiles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          profileToLoad = parsed[0];
        }
      }

      if (profileToLoad && profileToLoad.dob) {
        applyProfile(profileToLoad);
      }
    } catch (e) {
      console.error("Error loading saved profile in App:", e);
    }
  }, []);

  // Function to calculate and apply profile throughout the app
  const applyProfile = (details: PersonalDetails) => {
    const finalName = details.name?.trim() || "Vibrations Seeker";
    const finalDob = details.dob || "1984-11-23";
    const finalGender = details.gender || "MALE";
    const finalMobile = details.mobile || "9930117696";
    const finalEmail = details.email || "";

    const cleanDetails: PersonalDetails = {
      name: finalName,
      dob: finalDob,
      gender: finalGender,
      mobile: finalMobile,
      email: finalEmail
    };

    setPersonalDetails(cleanDetails);
    setName(cleanDetails.name);
    setDob(cleanDetails.dob);
    setGender(cleanDetails.gender);
    setMobile(cleanDetails.mobile);
    setEmail(cleanDetails.email || '');

    // Generate unified core profile
    const profile = generateCompleteNumerologyProfile({
      dob: finalDob,
      name: finalName,
      mobile: finalMobile,
      gender: finalGender
    });
    setNumerologyProfile(profile);

    // Populate backward-compatible analyses
    const dobAnalysis = analyzeDateOfBirth(finalDob, finalName);
    const nameAnalysis = analyzeNameSystems(finalName);
    const mobileAnalysis = analyzeMobileNumber(finalMobile);
    const remediesResults = generateRemedies(finalDob, finalName);

    setDobData(dobAnalysis);
    setNameData(nameAnalysis);
    setMobileData(mobileAnalysis);
    setRemedies(remediesResults);

    // Save to localStorage for persistence
    try {
      localStorage.setItem('leo_active_quick_profile', JSON.stringify(cleanDetails));
      const stored = localStorage.getItem('leo_saved_consultation_profiles');
      let profilesList: PersonalDetails[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(profilesList)) profilesList = [];
      const existsIndex = profilesList.findIndex(p => p.name === cleanDetails.name && p.dob === cleanDetails.dob);
      if (existsIndex >= 0) {
        profilesList[existsIndex] = cleanDetails;
      } else {
        profilesList.unshift(cleanDetails);
      }
      localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify(profilesList));
    } catch (err) {
      console.error("Failed to save profile to localStorage:", err);
    }
  };

  // Virtual URL & Hash Router for Professional SEO Pages & Dynamic Metadata/JSON-LD Injector
  const [currentSEOPath, setCurrentSEOPath] = useState<string>('home');

  useEffect(() => {
    const handleRouteSync = () => {
      const hash = window.location.hash.substring(1) || '';
      const path = window.location.pathname.substring(1) || hash || 'home';
      setCurrentSEOPath(path);

      let title = "Leo Family Numerology - Premium Indian Numerology Portal";
      let description = "Vedic Numerology & Chaldean Frequencies. Explore hidden planetary yogas, material blockages, and cosmic alignments curated by Rajiv Singh Chauhann.";
      let schemaMarkup: any = null;

      if (path.includes('mobile-numerology')) {
        setCurrentPortal('MOBILE_NUMEROLOGY');
        title = "Mobile Numerology Scanner - Chaldean Planetary Frequencies";
        description = "Scan cumulative Chaldean vibrations, planetary yogas, material blockages, and cosmic remedies of your mobile number.";
      } else if (path.includes('name-numerology')) {
        setCurrentPortal('NAME_NUMEROLOGY');
        title = "Chaldean Name Numerology - Pronunciation Vibration Corrector";
        description = "Align your full brand name spelling with your birth driver or conductor numbers for ultimate success.";
      } else if (path.includes('loshu-grid')) {
        setCurrentPortal('CORE_LOSHU');
        title = "Master Lo Shu Grid Kundali - traditional 3x3 Vedic Birth Grid";
        description = "Generate your 3x3 Lo Shu birth grid, missing numbers remedies, and personalized arrows.";
      } else if (path.includes('marriage-compatibility')) {
        setCurrentPortal('MARRIAGE_COMPATIBILITY');
        title = "Vedic Marriage Compatibility - Driver Conductor Synastry v3.0";
        description = "Calculate 7-layer marriage compatibility, emotional resonance, and dynamic yogas.";
      } else if (path.includes('vehicle-numerology')) {
        setCurrentPortal('PREMIUM_VEHICLE');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'VEHICLE' }));
        title = "Pro Vehicle Numerology - License Plate Vastu & Accidental Risks";
        description = "Analyze license plate frequencies, breakdown probabilities, and optimal service days.";
      } else if (path.includes('house-numerology')) {
        setCurrentPortal('PREMIUM_HOUSE');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'HOUSE' }));
        title = "Pro House & Flat Vastu Auditor - Flat Numbers Energy Vibration";
        description = "Scan domestic energy vibrations, wealth flows, and placement remedies.";
      } else if (path.includes('business-numerology')) {
        setCurrentPortal('PREMIUM_BUSINESS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'BUSINESS' }));
        title = "Pro Business Firm Name Suite - Marketing Energy & Corporate Suitability";
        description = "Align brand name spelling with owner driver numbers to guarantee rapid expansion.";
      } else if (path.includes('signature-numerology')) {
        setCurrentPortal('PREMIUM_SIGNATURE');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'SIGNATURE' }));
        title = "Signature Style Diagnostics - Handwriting Vastu & Financial Shielding";
        description = "Audit trailing signature underlines, dots, and upward slopes.";
      } else if (path.includes('child-numerology')) {
        setCurrentPortal('PREMIUM_CHILD');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'CHILD' }));
        title = "Child Auspicious Initial Letters Finder - Psychic Education Setup";
        description = "Optimize child brand spelling and starting letters matching planetary intelligence.";
      } else if (path.includes('lucky-date-finder')) {
        setCurrentPortal('PREMIUM_LUCKY_DATES');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'LUCKY_DATES' }));
        title = "Auspicious Dates Finder - Personalized Business, Marriage & Travel Dates";
        description = "Plan key lifestyle activities during friendly transits that reject Saturn delays.";
      } else if (path.includes('medical-numerology')) {
        setCurrentPortal('PREMIUM_MEDICAL');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'MEDICAL' }));
        title = "Medical Numerology & Health Vulnerabilities";
        description = "Ayurvedic planetary dosha and health vulnerability analysis.";
      } else if (path.includes('vaastu-numerology')) {
        setCurrentPortal('PREMIUM_VAASTU');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'VAASTU' }));
        title = "Numero Vastu & 16 Directional Balance";
        description = "Harmonize living and workspace energies using Kua and Vastu grid alignments.";
      } else if (path.includes('dasha-numerology')) {
        setCurrentPortal('PREMIUM_DASHA');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'DASHA' }));
        title = "Mahadasha & Antardasha Transit Analysis";
        description = "Planetary periods and 9-year cyclic forecasts.";
      } else if (path.includes('master-report')) {
        setCurrentPortal('MASTER_REPORT');
        title = "Comprehensive Master Numerology Dossier - 30+ Sections";
        description = "Full 360-degree Vedic and Chaldean life report blueprint.";
      } else if (path.includes('consultation-hub')) {
        setCurrentPortal('AI_CONSULTATION');
        title = "LeoFamily Consultation Hub - Vedic Guidance & Counsel";
        description = "Ask questions, get remedial advice, and explore planetary insights.";
      }

      // Update head dynamically
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    };

    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const handlePortalNavigation = (portalId: NavPortalId) => {
    setCurrentPortal(portalId);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Handle premium sub-modules switching
    if (portalId === 'PREMIUM_VEHICLE') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'VEHICLE' }));
    } else if (portalId === 'PREMIUM_HOUSE') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'HOUSE' }));
    } else if (portalId === 'PREMIUM_BUSINESS') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'BUSINESS' }));
    } else if (portalId === 'PREMIUM_SIGNATURE') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'SIGNATURE' }));
    } else if (portalId === 'PREMIUM_CHILD') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'CHILD' }));
    } else if (portalId === 'PREMIUM_LUCKY_DATES') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'LUCKY_DATES' }));
    } else if (portalId === 'PREMIUM_MEDICAL') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'MEDICAL' }));
    } else if (portalId === 'PREMIUM_VAASTU') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'VAASTU' }));
    } else if (portalId === 'PREMIUM_DASHA') {
      window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'DASHA' }));
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;

    const details: PersonalDetails = {
      name: name.trim() || "Vibrations Seeker",
      dob: dob || "1984-11-23",
      gender: gender || "MALE",
      mobile,
      email: email || ""
    };
    applyProfile(details);
    setActiveTab('MOBILE');
  };

  const handleLoadDemoNumber = () => {
    const demoProfile: PersonalDetails = {
      name: 'Raajeev Singh Chauhann',
      dob: '1984-11-23',
      gender: 'MALE',
      mobile: '9930117696',
      email: 'contact@numerologysage.com'
    };
    applyProfile(demoProfile);
  };

  const handleQuickReset = () => {
    setPersonalDetails(null);
    setName('');
    setDob('');
    setMobile('');
    setEmail('');
    setDobData(null);
    setNameData(null);
    setMobileData(null);
    setRemedies(null);
    setNumerologyProfile(null);
    localStorage.removeItem('leo_active_quick_profile');
  };

  // Safe fallback complete profile for Master Dossier
  const effectiveProfile: NumerologyProfile = numerologyProfile || generateCompleteNumerologyProfile({
    dob: personalDetails?.dob || "1984-11-23",
    name: personalDetails?.name || "Raajeev Singh Chauhann",
    mobile: personalDetails?.mobile || "9930117696",
    gender: personalDetails?.gender || "MALE"
  });

  const isPremiumSubModule = [
    'PREMIUM_VEHICLE', 'PREMIUM_HOUSE', 'PREMIUM_BUSINESS', 
    'PREMIUM_SIGNATURE', 'PREMIUM_CHILD', 'PREMIUM_LUCKY_DATES', 
    'PREMIUM_MEDICAL', 'PREMIUM_VAASTU', 'PREMIUM_DASHA'
  ].includes(currentPortal);

  return (
    <div id="application-container" className="min-h-screen bg-[#F8F4EF] text-[#1F2937] flex flex-col relative selection:bg-[#F59E0B]/20 selection:text-[#D97706] overflow-x-hidden font-sans">
      
      {/* Background elegant faint mandala overlay */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] opacity-5 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#D97706] rotate-45">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <polygon points="50,15 85,50 50,85 15,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main Luxury Shell Header */}
      <header id="main-header" className="border-b border-[#E5E7EB] bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex justify-between items-center">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handlePortalNavigation('HOME')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-[#D97706]/10 group-hover:bg-[#D97706]/20 p-2.5 rounded-2xl border border-[#D97706]/20 transition">
              <span className="text-2xl text-[#D97706]">⚜️</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="font-playfair text-lg md:text-xl font-bold tracking-wide text-[#1F2937] group-hover:text-[#D97706] transition">
                  {t('common.brandName')}
                </h1>
                <span className="hidden sm:inline-block bg-[#D97706]/10 text-[#D97706] font-mono text-[9px] px-2 py-0.5 rounded-full border border-[#D97706]/20 uppercase tracking-widest font-semibold">
                  {t('common.brandSubtitle')}
                </span>
              </div>
              <span className="block text-[9px] font-mono text-[#6B7280] tracking-[0.2em] uppercase">
                {t('common.tagline')}
              </span>
            </div>
          </div>

          {/* Top Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Language Selector */}
            <LanguageSelector variant="header" />

            {personalDetails ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <span className="text-xs font-bold text-[#1F2937] block leading-tight">{personalDetails.name}</span>
                  <span className="text-[10px] font-mono text-[#D97706] block font-bold">
                    {t('common.mulank')}: {dobData?.birthNumber || '—'} | {t('common.bhagyank')}: {dobData?.lifePathNumber || '—'}
                  </span>
                </div>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                  title={t('profile.editProfileTitle')}
                >
                  <User className="w-3.5 h-3.5 text-[#D97706]" />
                  <span className="hidden sm:inline">{t('profile.activeProfile')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoadDemoNumber}
                className="bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] font-semibold px-3.5 py-2 rounded-xl text-xs transition border border-[#D97706]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('common.loadDemo')}</span>
                <span className="sm:hidden">Demo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full relative z-30 animate-in fade-in duration-300">
        
        {/* Universal Top Master Navigation */}
        <MasterNavigation
          currentPortalId={currentPortal}
          onSelectPortal={handlePortalNavigation}
        />

        {/* Persistent Quick Profile Header Bar */}
        <QuickProfileHeader
          personalDetails={personalDetails}
          dobData={dobData}
          onEditProfile={() => setIsProfileModalOpen(true)}
          onLoadDemo={handleLoadDemoNumber}
          onResetProfile={handleQuickReset}
        />

        {/* Active Back Button for Sub-portals */}
        {currentPortal !== 'HOME' && (
          <div className="mb-4 flex items-center justify-between print:hidden">
            <button
              onClick={() => handlePortalNavigation('HOME')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#D97706] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> {t('common.backToHub')}
            </button>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest hidden sm:block">
              {currentPortal.replace('PREMIUM_', '').replace('_', ' ')}
            </div>
          </div>
        )}

        {/* PORTAL ROUTER */}
        <ErrorBoundary fallbackTitle="अनुभाग लोड करने में समस्या">
        {currentPortal === 'HOME' ? (
          <MasterDashboardHub
            personalDetails={personalDetails}
            dobData={dobData}
            nameData={nameData}
            mobileData={mobileData}
            remedies={remedies}
            profile={effectiveProfile}
            onNavigate={handlePortalNavigation}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onLoadDemo={handleLoadDemoNumber}
          />
        ) : currentPortal === 'MASTER_REPORT' ? (
          <div className="space-y-6">
            <MasterReportUnified
              profile={effectiveProfile}
              personalDetails={personalDetails || {
                name: "Raajeev Singh Chauhann",
                dob: "1984-11-23",
                gender: "MALE",
                mobile: "9930117696",
                email: "contact@numerologysage.com"
              }}
              dobData={dobData || undefined}
              nameData={nameData || undefined}
              mobileData={mobileData || undefined}
              remedies={remedies || undefined}
            />
          </div>
        ) : currentPortal === 'CORE_LOSHU' ? (
          <CompleteLoshuGridAnalysis initialProfile={personalDetails ? { name: personalDetails.name, dob: personalDetails.dob, gender: personalDetails.gender || 'MALE' } : null} />
        ) : currentPortal === 'CORE_DASHBOARD' ? (
          dobData && nameData && mobileData && remedies && personalDetails ? (
            <AstroDashboard
              dobData={dobData}
              nameData={nameData}
              mobileData={mobileData}
              remedies={remedies}
              name={personalDetails.name}
              profile={effectiveProfile}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E7EB] space-y-4">
              <Compass className="w-12 h-12 text-[#D97706] mx-auto" />
              <h3 className="text-xl font-bold font-playfair">कृपया पहले अपनी जन्म तिथि दर्ज करें</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                मूलांक, भाग्यांक व 81 ग्रहीय युतियों का विश्लेषण देखने के लिए प्रोफाइल सेट करें या डेमो लोड करें।
              </p>
              <button
                onClick={handleLoadDemoNumber}
                className="bg-[#D97706] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                डेमो लोड करें (Load Demo)
              </button>
            </div>
          )
        ) : currentPortal === 'NAME_NUMEROLOGY' ? (
          effectiveProfile?.nameNumerology && dobData ? (
            <NameNumerologyDashboard
              nameAnalysis={effectiveProfile.nameNumerology}
              mulank={dobData.birthNumber}
              bhagyank={dobData.lifePathNumber}
              mobile={personalDetails?.mobile || '9930117696'}
              dob={personalDetails?.dob || '1984-11-23'}
            />
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-[#E5E7EB] space-y-4">
              <User className="w-12 h-12 text-[#D97706] mx-auto" />
              <h3 className="text-xl font-bold font-playfair">नाम अंकशास्त्र विश्लेषण हेतु प्रोफाइल आवश्यक है</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                चालडीयन व पाइथागोरियन नाम शुद्धि हेतु अपना नाम दर्ज करें या डेमो डेटा लोड करें।
              </p>
              <button
                onClick={handleLoadDemoNumber}
                className="bg-[#D97706] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                डेमो प्रोफाइल लोड करें
              </button>
            </div>
          )
        ) : currentPortal === 'MARRIAGE_COMPATIBILITY' ? (
          <MarriageCompatibility />
        ) : currentPortal === 'PREMIUM_VAASTU' ? (
          <NumeroVastuDashboard
            profile={effectiveProfile}
            dob={personalDetails?.dob || '1984-11-23'}
            name={personalDetails?.name || 'Raajeev Singh Chauhann'}
            gender={(personalDetails?.gender as any) || 'MALE'}
          />
        ) : currentPortal === 'PREMIUM_VEHICLE' ? (
          <VehicleNumerologyDashboard
            initialDob={personalDetails?.dob ? formatDateIndian(personalDetails.dob) : '23/11/1984'}
            initialName={personalDetails?.name || 'Raajeev Singh Chauhann'}
            initialMobile={personalDetails?.mobile || '9930117696'}
            initialGender={(personalDetails?.gender as any) || 'MALE'}
          />
        ) : currentPortal === 'PREMIUM_HOUSE' ? (
          <PremiumConsultations initialModule="HOUSE" />
        ) : isPremiumSubModule ? (
          <PremiumConsultations initialModule={currentPortal.replace('PREMIUM_', '') as any} />
        ) : currentPortal === 'AI_CONSULTATION' ? (
          <AIConsultationPortal
            initialProfile={personalDetails}
            onProfileUpdate={(p) => applyProfile(p)}
          />
        ) : currentPortal === 'MOBILE_NUMEROLOGY' ? (
          !personalDetails ? (
            <div id="landing-stage" className="space-y-16 animate-in fade-in duration-500">
              
              {/* Mobile Scanner Hero */}
              <div className="rounded-[36px] px-6 py-12 md:py-16 lg:px-12 text-center text-[#1F2937] relative overflow-hidden bg-gradient-to-br from-[#FDFCF7] via-[#F9F6EE] to-[#F2EADA] border border-[#D97706]/15 shadow-lg">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-[#D97706]/10 px-4 py-1.5 rounded-full border border-[#D97706]/20 text-xs font-bold uppercase tracking-wider text-[#D97706]">
                    <Phone className="w-4 h-4" /> चालडीयन एवं वैदिक मोबाइल अंकशास्त्र
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-playfair text-3xl md:text-5xl font-extrabold text-[#1F2937] leading-tight">
                      अपने मोबाइल नंबर की ग्रहीय तरंगों को डिकोड करें
                    </h2>
                    <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
                      10-अंकीय फोन नंबर के 81 ग्रह युति, छिपे हुए दोष, धन योग एवं मित्र/शत्रु अंकों का वैज्ञानिक परीक्षण।
                    </p>
                  </div>

                  {/* Form Card */}
                  <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-[30px] shadow-xl border border-[#E5E7EB] text-left">
                    <div className="flex justify-between items-center mb-5 border-b pb-3">
                      <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider">
                        📱 मोबाइल स्कैनर पोर्टल
                      </span>
                      <button
                        type="button"
                        onClick={handleLoadDemoNumber}
                        className="text-[10px] font-bold bg-[#F2E8DC] text-[#D97706] px-3 py-1.5 rounded-xl uppercase hover:bg-[#E5D7C6] transition border border-[#D97706]/20"
                      >
                        🔮 डेमो डेटा
                      </button>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                          10-अंकीय मोबाइल नंबर (Mobile Number) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            maxLength={10}
                            placeholder="उदा. 9930117696"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full pl-10 pr-4 py-3 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl text-base font-mono font-bold text-gray-900 focus:border-[#D97706] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                          जन्म तिथि (Date of Birth) — तालमेल जांच हेतु
                        </label>
                        <DateInput
                          id="mobile-input-dob"
                          value={dob}
                          onChange={setDob}
                          className="py-3 bg-[#F8F4EF]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">
                          पूरा नाम (Full Name)
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#D97706] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="उदा. राजीव सिंह चौहान"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-[#F8F4EF] border border-[#E5E7EB] rounded-xl text-sm text-gray-900 focus:border-[#D97706] outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                      >
                        <span>विश्लेषण करें (Calculate Diagnostics)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Informative Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D97706] flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base font-playfair">81 युति एवं ग्रह योग</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    मोबाइल नंबर में आने वाले सभी 2-अंकीय जोड़ों की सूक्ष्म वैदिक युति एवं उनके शुभ-अशुभ परिणाम।
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-base font-playfair">धन एवं करियर प्रभाव</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    अंतिम 4 अंकों का धन प्रवाह, व्यापारिक सफलता व सार्वजनिक प्रतिष्ठा पर गहरा प्रभाव।
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#E5E7EB] space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-base font-playfair">संबंध एवं स्वास्थ्य सामंजस्य</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    राहु, शनि व मंगल के उग्र संयोजनों से उत्पन्न तनाव को रोकने हेतु वैदिक उपचार।
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div id="active-mobile-dashboard" className="space-y-6">
              {dobData && nameData && mobileData && remedies && (
                <MobileDiagnosticsPanel
                  personalDetails={personalDetails}
                  dobData={dobData}
                  nameData={nameData}
                  mobileData={mobileData}
                  remedies={remedies}
                  isQuickMode={false}
                />
              )}
            </div>
          )
        ) : null}
        </ErrorBoundary>

      </main>

      {/* Quick Profile Modal */}
      <QuickProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentProfile={personalDetails}
        onSave={(updatedProfile) => {
          applyProfile(updatedProfile);
        }}
        onLoadDemo={handleLoadDemoNumber}
      />

      {/* SEO & OCCULT AUTHORITY LIBRARY / FOOTER LINKING */}
      <section id="seo-authority-centre" className="border-t border-[#E5E7EB] bg-[#FDFCF7] py-14 px-6 relative z-30 print:hidden">
        <div className="max-w-5xl mx-auto space-y-10 text-left font-sans text-xs">
          
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-gray-400 tracking-wider">
            <span>Home</span>
            <span>&gt;</span>
            <span>Vedic Occult Systems</span>
            <span>&gt;</span>
            <span className="text-[#D97706] font-bold">
              {currentSEOPath}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b pb-10 border-[#F2E8DC]">
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-playfair text-xl font-bold text-gray-800">{t('common.brandName')}</h4>
              <p className="text-gray-500 leading-relaxed text-[11px]">
                {t('hub.vedicMethodologyDesc')}
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider block mb-1">
                  🌐 {t('common.selectLanguage')}:
                </span>
                <LanguageSelector variant="pills" />
              </div>
            </div>

            <div className="md:col-span-8">
              <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block mb-3">
                {t('common.quickDirectory')}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'CORE_LOSHU', key: 'nav.coreLoshu', fallback: '1. लो शू ग्रिड (Lo Shu)' },
                  { id: 'MOBILE_NUMEROLOGY', key: 'nav.mobileScanner', fallback: '2. मोबाइल स्कैनर' },
                  { id: 'NAME_NUMEROLOGY', key: 'nav.nameNumerology', fallback: '3. नाम अंकशास्त्र' },
                  { id: 'MARRIAGE_COMPATIBILITY', key: 'nav.marriageCompatibility', fallback: '4. विवाह गुण मिलान' },
                  { id: 'PREMIUM_VEHICLE', key: 'nav.vehicleNumerology', fallback: '5. वाहन अंकशास्त्र' },
                  { id: 'PREMIUM_VAASTU', key: 'nav.numeroVastu', fallback: '6. न्यूमरो वास्तु' },
                  { id: 'PREMIUM_BUSINESS', key: 'nav.businessNumerology', fallback: '7. व्यापारिक अंकशास्त्र' },
                  { id: 'PREMIUM_SIGNATURE', key: 'nav.signatureAudit', fallback: '8. हस्ताक्षर ऑडिट' },
                  { id: 'PREMIUM_CHILD', key: 'nav.childLuckyNames', fallback: '9. शिशु शुभ नामाक्षर' },
                  { id: 'PREMIUM_LUCKY_DATES', key: 'nav.luckyDatesFinder', fallback: '10. शुभ तिथियां खोजक' },
                  { id: 'PREMIUM_MEDICAL', key: 'nav.medicalNumerology', fallback: '11. मेडिकल न्यूमरोलॉजी' },
                  { id: 'MASTER_REPORT', key: 'nav.masterReport', fallback: '12. संपूर्ण मास्टर रिपोर्ट' },
                ].map((lnk) => (
                  <button
                    key={lnk.id}
                    onClick={() => handlePortalNavigation(lnk.id as NavPortalId)}
                    className="block p-2.5 rounded-2xl border bg-white border-gray-200 hover:border-[#D97706]/40 hover:bg-amber-50/40 text-left transition cursor-pointer"
                  >
                    <span className="font-bold block text-[11px] text-gray-800">{t(lnk.key) || lnk.fallback}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{t('common.explore')} →</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl space-y-1.5">
              <span className="font-bold text-gray-800 text-xs font-playfair block">
                {t('common.faqMulankBhagyankQ')}
              </span>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                {t('common.faqMulankBhagyankA')}
              </p>
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl space-y-1.5">
              <span className="font-bold text-amber-900 text-xs font-playfair block">
                {t('common.disclaimerTitle')}
              </span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                {t('common.disclaimerText')}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer System Line */}
      <footer id="main-footer" className="border-t border-[#E5E7EB] bg-[#F2E8DC]/40 py-8 relative z-20 mt-auto text-center space-y-1.5 print:hidden">
        <span className="font-playfair text-sm text-[#1F2937] font-bold block">
          {t('common.brandName')} — {t('common.tagline')}
        </span>
        <span className="font-mono text-[9px] text-[#6B7280] uppercase tracking-[0.3em] block mx-4">
          {t('common.copyright')} • {t('common.authorityNote')} • © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default App;
