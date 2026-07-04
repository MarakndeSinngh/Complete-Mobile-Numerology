import React, { useState } from 'react';
import { analyzeDateOfBirth, analyzeNameSystems, analyzeMobileNumber, generateRemedies } from './services/numerologyEngine';
import { PersonalDetails, DOBAnalysis, NameAnalysis, MobileAnalysis, remediesAdvice } from './types';
import { generateCompleteNumerologyProfile, NumerologyProfile } from './core';
import { 
  Phone, User, Calendar, Compass, Star, FileText, Sparkles, Shield, 
  TrendingUp, Heart, BookOpen, Layers, HelpCircle, RefreshCw, 
  Award, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck, Mail
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

type ViewTab = 'DASHBOARD' | 'MOBILE' | 'COMPATIBILITY' | 'REMEDIES' | 'REPORT' | 'ADMIN';

const App: React.FC = () => {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [activeTab, setActiveTab] = useState<ViewTab>('MOBILE');
  const [currentPortal, setCurrentPortal] = useState<'MOBILE_NUMEROLOGY' | 'LOSHU_GRID' | 'MARRIAGE_COMPATIBILITY' | 'PREMIUM_CONSULTATIONS' | 'AI_CONSULTATION'>('AI_CONSULTATION');
  const [analysisMode, setAnalysisMode] = useState<'QUICK' | 'ADVANCED'>('QUICK');

  // Input states
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


  // Virtual URL & Hash Router for Professional SEO Pages & Dynamic Metadata/JSON-LD Injector
  const [currentSEOPath, setCurrentSEOPath] = React.useState<string>('mobile-numerology');

  React.useEffect(() => {
    const handleRouteSync = () => {
      const path = window.location.pathname.substring(1) || window.location.hash.substring(1) || 'mobile-numerology';
      setCurrentSEOPath(path);

      let title = "Leo Family Numerology - Premium Indian Numerology Portal";
      let description = "Vedic Numerology & Chaldean Frequencies. Explore hidden planetary yogas, material blockages, and cosmic alignments curated by Rajiv Singh Chauhann.";
      let schemaMarkup: any = null;

      if (path.includes('mobile-numerology')) {
        setCurrentPortal('MOBILE_NUMEROLOGY');
        title = "Mobile Numerology Scanner - Chaldean Planetary Frequencies";
        description = "Scan cumulative Chaldean vibrations, planetary yogas, material blockages, and cosmic remedies of your mobile number.";
        schemaMarkup = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Professional Mobile Numerology & Chaldean Vibrations Guide",
          "description": "How mobile phone digits create resonance with Saturn, Rahu, and Venus under Chaldean rules.",
          "author": { "@type": "Person", "name": "Raajeev Singh Chauhann" }
        };
      } else if (path.includes('name-numerology')) {
        setCurrentPortal('MOBILE_NUMEROLOGY');
        setAnalysisMode('ADVANCED');
        title = "Chaldean Name Numerology - Pronunciation Vibration Corrector";
        description = "Align your full brand name spelling with your birth driver or conductor numbers for ultimate success.";
        schemaMarkup = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Traditional Chaldean Name Spelling Correction Guidelines",
          "description": "Adjusting letter frequencies using Vedic standard charts.",
          "author": { "@type": "Person", "name": "Raajeev Singh Chauhann" }
        };
      } else if (path.includes('loshu-grid')) {
        setCurrentPortal('LOSHU_GRID');
        title = "Master Lo Shu Grid Kundali - traditional 3x3 Vedic Birth Grid";
        description = "Generate your 3x3 Lo Shu birth grid, missing numbers remedies, and personalized arrows.";
        schemaMarkup = {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Vedi Lo Shu Grid & Missing Coordinates Remedies",
          "description": "Traditional analysis of present, missing, and repeated numbers.",
          "author": { "@type": "Person", "name": "Raajeev Singh Chauhann" }
        };
      } else if (path.includes('marriage-compatibility')) {
        setCurrentPortal('MARRIAGE_COMPATIBILITY');
        title = "Vedic Marriage Compatibility - Driver Conductor Synastry v3.0";
        description = "Calculate 7-layer marriage compatibility, emotional resonance, and dynamic yogas.";
      } else if (path.includes('vehicle-numerology')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'VEHICLE' }));
        title = "Pro Vehicle Numerology - License Plate Vastu & Accidental Risks";
        description = "Analyze license plate frequencies, breakdown probabilities, and optimal service days.";
      } else if (path.includes('house-numerology')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'HOUSE' }));
        title = "Pro House & Flat Vastu Auditor - Flat Numbers Energy Vibration";
        description = "Scan domestic energy vibrations, wealth flows, and placement remedies.";
      } else if (path.includes('business-numerology')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'BUSINESS' }));
        title = "Pro Business Firm Name Suite - Marketing Energy & Corporate Suitability";
        description = "Align brand name spelling with owner driver numbers to guarantee rapid expansion.";
      } else if (path.includes('signature-numerology')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'SIGNATURE' }));
        title = "Signature Style Diagnostics - Handwriting Vastu & Financial Shielding";
        description = "Audit trailing signature underlines, dots, and upward slopes.";
      } else if (path.includes('child-numerology')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'CHILD' }));
        title = "Child Auspicious Initial Letters Finder - Psychic Education Setup";
        description = "Optimize child brand spelling and starting letters matching planetary intelligence.";
      } else if (path.includes('lucky-date-finder')) {
        setCurrentPortal('PREMIUM_CONSULTATIONS');
        window.dispatchEvent(new CustomEvent('switch-premium-module', { detail: 'LUCKY_DATES' }));
        title = "Auspicious Dates Finder - Personalized Business, Marriage & Travel Dates";
        description = "Plan key lifestyle activities during friendly transits that reject Saturn delays.";
      }

      // Update head dynamically
      document.title = title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }

      // Inject JSON-LD Schema
      const existingSchema = document.getElementById('dynamic-seo-schema');
      if (existingSchema) existingSchema.remove();

      if (schemaMarkup) {
        const script = document.createElement('script');
        script.id = 'dynamic-seo-schema';
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(schemaMarkup);
        document.head.appendChild(script);
      }
    };

    handleRouteSync();
    window.addEventListener('hashchange', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile) return;

    const finalName = name.trim() || "Vibrations Seeker";
    const finalDob = dob || "1994-05-15";
    const finalGender = gender || "MALE";
    const finalEmail = email || "";

    const details: PersonalDetails = { name: finalName, dob: finalDob, gender: finalGender, mobile, email: finalEmail };
    setPersonalDetails(details);

    // Run the centralized core engine as the ONLY source of truth
    const profile = generateCompleteNumerologyProfile({
      dob: finalDob,
      name: finalName,
      mobile: mobile,
      gender: finalGender
    });
    setNumerologyProfile(profile);

    // Populate backward compatible states
    const dobAnalysis = analyzeDateOfBirth(finalDob, finalName);
    const nameAnalysis = analyzeNameSystems(finalName);
    const mobileAnalysis = analyzeMobileNumber(mobile);
    const remediesResults = generateRemedies(finalDob, finalName);

    setDobData(dobAnalysis);
    setNameData(nameAnalysis);
    setMobileData(mobileAnalysis);
    setRemedies(remediesResults);
    setActiveTab('MOBILE');
  };

  const handleLoadDemoNumber = () => {
    setMobile('9930117696');
    setName('Raajeev Singh Chauhann');
    setDob('1984-11-23');
    setGender('MALE');
    setEmail('contact@numerologysage.com');
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
  };

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
      <header id="main-header" className="border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#D97706]/10 p-2.5 rounded-xl border border-[#D97706]/20">
              <span className="text-2xl text-[#D97706]">⚜️</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h1 className="font-playfair text-lg md:text-xl font-bold tracking-wide text-[#1F2937]">
                  Leo Family Numerology
                </h1>
                <span className="hidden md:inline-block bg-[#D97706]/10 text-[#D97706] font-mono text-[9px] px-2 py-0.5 rounded-full border border-[#D97706]/20 uppercase tracking-widest font-semibold">
                  Occult Science
                </span>
              </div>
              <span className="block text-[9px] font-mono text-[#6B7280] tracking-[0.25em] uppercase">
                Premium Indian Numerology Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {personalDetails ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <span className="text-xs font-semibold text-[#1F2937] block">{personalDetails.name}</span>
                  <span className="text-[9px] font-mono text-[#D97706] block uppercase font-bold">
                    Mulank: {dobData?.birthNumber} | Bhagyank: {dobData?.lifePathNumber}
                  </span>
                </div>
                <button
                  onClick={handleQuickReset}
                  className="bg-[#D97706]/10 hover:bg-[#D97706]/20 text-[#D97706] font-semibold px-4 py-2 rounded-xl text-xs transition duration-300 pointer-events-auto cursor-pointer border border-[#D97706]/20 flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Profile
                </button>
              </div>
            ) : (
              <button
                onClick={handleLoadDemoNumber}
                className="hidden md:flex bg-[#F2E8DC] hover:bg-[#E5D7C6] text-[#D97706] font-semibold px-4 py-2 rounded-xl text-xs transition duration-300 border border-[#D97706]/20 items-center gap-1.5"
              >
                🔮 Load Expert Pattern
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content wrapper */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full relative z-30 animate-in fade-in duration-500">
        
        {/* Top-Level Portal Navigation - Separate page and menu items */}
        <div className="flex flex-col md:flex-row border border-[#E5E7EB] mb-8 bg-white p-2 rounded-3xl gap-2 shadow-sm border-t-slate-100 print:hidden">
          <button
            onClick={() => setCurrentPortal('AI_CONSULTATION')}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              currentPortal === 'AI_CONSULTATION'
                ? 'bg-[#D97706] text-white shadow-md'
                : 'bg-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F4EF]/50 border border-dashed border-[#D97706]/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" /> AI Grand Consultation Hub 🔮
          </button>

          <button
            onClick={() => setCurrentPortal('MOBILE_NUMEROLOGY')}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              currentPortal === 'MOBILE_NUMEROLOGY'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F4EF]/50'
            }`}
          >
            <Phone className="w-4 h-4" /> Mobile Numerology Scanner
          </button>
          
          <button
            onClick={() => setCurrentPortal('LOSHU_GRID')}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              currentPortal === 'LOSHU_GRID'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F4EF]/50'
            }`}
          >
            <Compass className="w-4 h-4 animate-spin-slow text-[#D97706]" /> Complete Loshu Grid Analysis 🌟
          </button>

          <button
            onClick={() => setCurrentPortal('MARRIAGE_COMPATIBILITY')}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              currentPortal === 'MARRIAGE_COMPATIBILITY'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F4EF]/50'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" /> Marriage Compatibility 💕
          </button>

          <button
            onClick={() => setCurrentPortal('PREMIUM_CONSULTATIONS')}
            className={`flex-1 py-3.5 px-6 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              currentPortal === 'PREMIUM_CONSULTATIONS'
                ? 'bg-[#1E3A8A] text-white shadow-md'
                : 'bg-transparent text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F4EF]/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> Premium Tools 👑
          </button>
        </div>

        {currentPortal === 'AI_CONSULTATION' ? (
          <AIConsultationPortal initialProfile={personalDetails} onProfileUpdate={(p) => setPersonalDetails(p)} />
        ) : currentPortal === 'MOBILE_NUMEROLOGY' ? (
          !personalDetails ? (
          <div id="landing-stage" className="space-y-20 animate-in fade-in duration-800">
            
            {/* SECTION 1: HERO BANNER - LIGHT LUXURY EDITION */}
            <div 
              className="rounded-[40px] px-6 py-16 md:py-24 lg:px-16 text-center text-[#1F2937] relative overflow-hidden bg-gradient-to-br from-[#FDFCF7] via-[#F9F6EE] to-[#F2EADA] border border-[#D97706]/10 shadow-xl"
            >
              {/* Star Constellation Background Canvas - Subtle light gold star map */}
              <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#D97706_0.75px,transparent_0.75px)] [background-size:32px_32px]"></div>
              
              {/* Sacred Geometry Circles in soft gold */}
              <div className="absolute -top-16 -left-16 w-64 h-64 border border-[#D97706]/10 rounded-full flex items-center justify-center animate-spin-slow pointer-events-none">
                <div className="w-48 h-48 border border-[#D97706]/5 rounded-full rotate-45"></div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 border border-[#D97706]/10 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border border-[#D97706]/5 rounded-full"></div>
                <div className="absolute w-40 h-40 border border-[#D97706]/10 rounded-full animate-pulse"></div>
              </div>

              {/* Floating Celestial/Zodiac Symbols */}
              <div className="absolute top-12 right-1/4 text-2xl text-[#D97706]/20 pointer-events-none cosmic-drift select-none font-serif">♌</div>
              <div className="absolute bottom-16 left-1/4 text-2xl text-[#D97706]/25 pointer-events-none cosmic-drift select-none font-serif" style={{ animationDelay: '2s' }}>☉</div>
              <div className="absolute top-1/3 left-12 text-3xl text-[#D97706]/20 pointer-events-none cosmic-drift select-none font-serif" style={{ animationDelay: '4s' }}>⚙️</div>

              {/* Hero Contents */}
              <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#D97706]/5 backdrop-blur-md px-5 py-2 rounded-full border border-[#D97706]/15 text-xs tracking-widest uppercase text-[#D97706] justify-center font-cinzel font-semibold">
                  <Sparkles className="w-4 h-4 text-[#D97706]" /> Vedic Numerology & Chaldean Frequencies
                </div>

                <div className="space-y-6">
                  <h2 className="font-cinzel text-4xl md:text-6xl font-extrabold tracking-wide text-[#1F2937] leading-[1.12]">
                    Decode the Planetary Vibrations <br className="hidden md:block" /> of Your Mobile Number
                  </h2>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D97706] to-transparent mx-auto"></div>
                  <p className="text-[#6B7280] text-sm md:text-[17px] max-w-2xl mx-auto leading-relaxed font-lora italic">
                    Chaldean Vibrations & Modern Occult Science curated by Rajiv Singh Chauhann. Explore hidden planetary yogas, material blockages, and cosmic alignments.
                  </p>
                </div>

                {/* Input Panel with Two Modes */}
                <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-lg p-8 md:p-10 rounded-[35px] shadow-2xl border border-[#D97706]/10 relative text-left sacred-glow">
                  
                  {/* Form Header */}
                  <div className="flex justify-between items-center mb-6 border-b border-[#E5E7EB] pb-4">
                    <span className="font-cinzel text-xs font-bold text-[#D97706] uppercase tracking-wider block">
                      🔮 Astrological Alignment Portal
                    </span>
                    <button
                      type="button"
                      onClick={handleLoadDemoNumber}
                      className="text-[10px] font-sans bg-[#F2E8DC] text-[#D97706] px-4 py-2 rounded-xl uppercase tracking-wider hover:bg-[#E5D7C6] transition-all font-bold border border-[#D97706]/10"
                    >
                      🔮 Load Demo Data
                    </button>
                  </div>

                  {/* Mode Toggles */}
                  <div className="flex bg-[#F8F4EF] p-1 rounded-2xl border border-[#E5E7EB] mb-6 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setAnalysisMode('QUICK')}
                      className={`flex-1 py-3 text-xs font-bold rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        analysisMode === 'QUICK'
                          ? 'bg-[#D97706] text-white shadow-md'
                          : 'text-[#6B7280] hover:text-[#1F2937]'
                      }`}
                    >
                      <Phone className="w-4 h-4" /> Quick Mobile
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalysisMode('ADVANCED')}
                      className={`flex-1 py-3 text-xs font-bold rounded-xl tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        analysisMode === 'ADVANCED'
                          ? 'bg-[#D97706] text-white shadow-md'
                          : 'text-[#6B7280] hover:text-[#1F2937]'
                      }`}
                    >
                      <User className="w-4 h-4" /> Advanced
                    </button>
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Always display Mobile Number */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-sans text-[#6B7280] uppercase tracking-widest block font-bold">
                          Enter 10-Digit Mobile Number
                        </label>
                        <span className="text-[10px] font-sans text-[#D97706]">Do not include country code</span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D97706]">
                          <Phone className="h-5 w-5" />
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9930117696"
                          maxLength={10}
                          className="w-full bg-[#F8F4EF] border border-[#E5E7EB] hover:border-[#D97706]/35 focus:border-[#D97706] rounded-2xl pl-12 pr-6 py-4.5 outline-none text-lg text-[#1F2937] font-mono tracking-[0.15em] font-bold shadow-inner transition-colors"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                      </div>
                    </div>

                    {/* Optional DOB input for Quick Mode */}
                    {analysisMode === 'QUICK' && (
                      <div className="space-y-2 pt-2 border-t border-[#E5E7EB]/50 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-sans text-[#6B7280] uppercase block font-bold">
                            Date of Birth (Optional - Checks Compatibility)
                          </label>
                          <span className="text-[9px] font-sans text-[#D97706]">Check alignment with your mobile number</span>
                        </div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D97706]">
                            <Calendar className="h-4 w-4" />
                          </span>
                          <input
                            type="date"
                            className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3.5 focus:border-[#D97706] outline-none text-sm text-[#1F2937] transition-all font-mono"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Show only for Advanced Analysis Mode */}
                    {analysisMode === 'ADVANCED' && (
                      <div className="space-y-4 pt-2 border-t border-[#E5E7EB]/80 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans text-[#6B7280] uppercase block font-bold">Full Name (Chaldean Link)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D97706]">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Raajeev Singh Chauhann"
                              className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3.5 focus:border-[#D97706] outline-none text-sm text-[#1F2937] transition-all"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans text-[#6B7280] uppercase block font-bold">Date of Birth</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D97706]">
                                <Calendar className="h-4 w-4" />
                              </span>
                              <input
                                type="date"
                                required
                                className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3.5 focus:border-[#D97706] outline-none text-sm text-[#1F2937] transition-all font-mono"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-sans text-[#6B7280] uppercase block font-bold">Gender Alignment</label>
                            <select
                              className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl px-5 py-3.5 focus:border-[#D97706] outline-none text-sm text-[#1F2937] font-semibold cursor-pointer"
                              value={gender}
                              onChange={(e: any) => setGender(e.target.value)}
                            >
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-sans text-[#6B7280] uppercase block font-bold">Email Address (Optional)</label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D97706]">
                              <Mail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              placeholder="e.g. contact@domain.com"
                              className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3.5 focus:border-[#D97706] outline-none text-sm text-[#1F2937] transition-all"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#D97706] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D97706] text-white font-bold py-3 rounded-xl transition-all duration-300 text-xs tracking-wider uppercase hover:shadow-lg hover:shadow-[#D97706]/20 flex items-center justify-center gap-2 cursor-pointer outline-none font-sans"
                      >
                        Calculate <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* SECTION 2: WHY MOBILE NUMEROLOGY MATTERS */}
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs text-[#D97706] uppercase tracking-[0.3em] font-semibold block">Cosmic Resonance Key</span>
                <h3 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#1F2937]">Why Mobile Numerology Matters</h3>
                <p className="text-[#6B7280] text-sm md:text-base">
                  Your phone is more than a utility; it is a high-frequency antenna that broadcasts numerical combinations into the universe 24 hours a day, reshaping your life's path.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1: Personality */}
                <div className="bg-white p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#D97706] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-[#D97706] mb-2">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-[#1F2937]">Divine Personality</h4>
                  <p className="text-[#6B7280] text-xs leading-relaxed">
                    Uncover how consecutive number pairings dictate your inner mindset, decision-making patterns, physical health, and standard daily attitude projection.
                  </p>
                </div>

                {/* Card 2: Money Flow */}
                <div className="bg-white p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#D97706] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-[#D97706] mb-2">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-[#1F2937]">Money Flow Activation</h4>
                  <p className="text-[#6B7280] text-xs leading-relaxed">
                    Identify specific merchant and wealth codes embedded within terminal positions to boost financial gains, luck, family savings, and career progression.
                  </p>
                </div>

                {/* Card 3: Relationships */}
                <div className="bg-white p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#D97706] to-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-[#D97706] mb-2">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h4 className="font-playfair text-xl font-bold text-[#1F2937]">Relationship Harmony</h4>
                  <p className="text-[#6B7280] text-xs leading-relaxed">
                    Vibrations shape marriages, family matchmaking, and professional synergies. Prevent hostile node conflicts from generating domestic obstacles.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: HOW ANALYSIS WORKS */}
            <div className="bg-[#F2E8DC] rounded-[40px] p-8 md:p-12 lg:p-16 space-y-12 border border-[#E5D7C6]">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs text-[#D97706] uppercase tracking-[0.3em] font-semibold block">Methodical Process</span>
                <h3 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#1F2937]">How Analysis Works</h3>
                <p className="text-[#6B7280] text-sm">
                  Our algorithm processes numbers using certified guidelines established by Bollywood Numerologist and Mentor, Raajeev Singh Chauhann.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connector lines (Desktop) */}
                <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-[#D97706]/15 z-0"></div>

                {/* Step 1 */}
                <div className="space-y-4 text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border-2 border-[#D97706] text-[#D97706] font-playfair font-black text-xl flex items-center justify-center mx-auto shadow-md">
                    01
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#1F2937]">Verify Base Digits</h4>
                  <p className="text-[#6B7280] text-xs px-4">
                    Isolate country modifiers. Map the raw array to verify direct totals, finding your focal baseline.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="space-y-4 text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border-2 border-[#D97706] text-[#D97706] font-playfair font-black text-xl flex items-center justify-center mx-auto shadow-md">
                    02
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#1F2937]">Chaldean Pair Extraction</h4>
                  <p className="text-[#6B7280] text-xs px-4">
                    Perform zero replacements using previous digit rules. Extract consecutive number blocks to detect planetary nodes.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="space-y-4 text-center relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#D97706] text-white font-playfair font-black text-xl flex items-center justify-center mx-auto shadow-md">
                    03
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#1F2937]">Vedic Synthesis Report</h4>
                  <p className="text-[#6B7280] text-xs px-4">
                    Merge names, birth psychic markers, and planetary traits to create an actionable, professional remedies report.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: NUMEROLOGY FEATURES ACCORDION / SHOWCASE */}
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs text-[#D97706] uppercase tracking-[0.3em] font-semibold block">Vast Technical Scope</span>
                <h3 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#1F2937]">Full Mathematical Analysis</h3>
                <p className="text-[#6B7280] text-sm md:text-base">
                  Explore major features included in our digital analysis dashboards. No detail is overlooked.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><Layers className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Pair Analysis</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Maps complete standard pairings of digits with specific Vedic keywords.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><AlertTriangle className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Negative Pair Warning</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Flags highly hazardous pairs (e.g. 74/47, 83/38, or 28/82 frictional portals).</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><RefreshCw className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Modified Number Engine</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Calculates previous digit replacements for occurrences of zeroes elegantly.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><Compass className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Planet Strengths</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Computes celestial frequency percentages of each planet in the matrix.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><BookOpen className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Vedic Sepharial Grid</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Draws a 3x3 Magic Square reflecting active material and emotional grids.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><ShieldCheck className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Friend/Enemy Matches</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Matches your phone's sum value to your conductor and driver values.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><Award className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">Vedic Remedies</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Prescribes crystal, gemstone, lucky days, signature and Lal Kitab cures.</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm flex gap-3 text-left">
                  <div className="text-[#D97706]"><FileText className="w-5 h-5 mt-1" /></div>
                  <div>
                    <h5 className="font-playfair font-bold text-[#1F2937] text-md">PDF Report Output</h5>
                    <p className="text-[#6B7280] text-[11px] mt-1 leading-relaxed">Generates high-fidelity formatted document ready for student printing.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 5: TESTIMONIALS */}
            <div className="space-y-12">
              <div className="text-center max-w-2xl mx-auto space-y-4">
                <span className="font-mono text-xs text-[#D97706] uppercase tracking-[0.3em] font-semibold block">Venerable Reviews</span>
                <h3 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#1F2937]">What Our Seekers Say</h3>
                <p className="text-[#6B7280] text-sm">
                  Thousands of individuals have modified critical digits in their phone strings under our team's direct care. Read their experiences.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="bg-[#FFFFFF] p-8 rounded-[30px] border border-[#E5E7EB] text-left hover:shadow-md transition-shadow relative">
                  <div className="flex text-[#F59E0B] gap-1 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <blockquote className="text-[#6B7280] text-xs font-lora italic leading-relaxed mb-6">
                    "I was skeptical but checking Rajiv Ji's formula regarding mobile zeroes changed everything. My business blocked channels cleared up within two weeks of transitioning my primary phone string."
                  </blockquote>
                  <div className="mt-auto">
                    <cite className="font-playfair text-sm font-bold text-[#1F2937] not-italic block">Amit Sharma</cite>
                    <span className="text-[10px] text-[#6B7280] block font-mono">Retail Merchant • Mumbai</span>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-8 rounded-[30px] border border-[#E5E7EB] text-left hover:shadow-md transition-shadow relative">
                  <div className="flex text-[#F59E0B] gap-1 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <blockquote className="text-[#6B7280] text-xs font-lora italic leading-relaxed mb-6">
                    "The Hindu Vedic grid mapped inside this scanner perfectly flagged my marital friction. Replacing a critical middle pair gave me immediate, noticeable clarity in communication."
                  </blockquote>
                  <div className="mt-auto">
                    <cite className="font-playfair text-sm font-bold text-[#1F2937] not-italic block">Pooja Deshmukh</cite>
                    <span className="text-[10px] text-[#6B7280] block font-mono">Academic Consultant • New Delhi</span>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-8 rounded-[30px] border border-[#E5E7EB] text-left hover:shadow-md transition-shadow relative">
                  <div className="flex text-[#F59E0B] gap-1 mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <blockquote className="text-[#6B7280] text-xs font-lora italic leading-relaxed mb-6">
                    "This software looks like a high-end luxury portal. Running audits of my corporate line's Chaldean vibration matching has helped us select auspicious campaign timings."
                  </blockquote>
                  <div className="mt-auto">
                    <cite className="font-playfair text-sm font-bold text-[#1F2937] not-italic block">Vikramaditya Roy</cite>
                    <span className="text-[10px] text-[#6B7280] block font-mono">CEO, Roy Capital • Bengaluru</span>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 6: CALL TO ACTION */}
            <div className="bg-[#F2E8DC] rounded-[40px] px-8 py-16 text-center space-y-6 relative border border-[#E5D7C6]">
              <div className="absolute top-1/2 left-12 text-5xl opacity-10 pointer-events-none select-none">🏵️</div>
              <div className="absolute top-1/4 right-16 text-5xl opacity-10 pointer-events-none select-none">☸️</div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="font-playfair text-3xl md:text-5xl font-black text-[#1F2937] leading-tight">Unlock Your Life's Hidden Frequencies</h3>
                <p className="text-[#6B7280] text-xs md:text-sm">
                  Do not leave your mobile digit placement to chance. Connect name systems and birthday alignments to receive a comprehensive spiritual map.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-8 py-4 rounded-2xl text-xs tracking-wider uppercase transition shadow-md inline-flex items-center gap-2 cursor-pointer"
                  >
                    Scroll To Top Form <ArrowRight className="w-4 h-4 animate-pulse" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div id="active-dashboard" className="space-y-8 animate-in fade-in duration-650">
            
            {/* Active profile subhead and view tabs */}
            <div className="bg-white p-6 md:p-8 rounded-[35px] border border-[#E5E7EB] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 shadow-sm">
              <div className="text-left space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-[#D97706]/10 text-[#D97706] px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border border-[#D97706]/20">
                  <Sparkles className="w-3 h-3" /> Active Destiny Matrix
                </div>
                <h2 className="font-playfair text-2.5xl md:text-4xl font-extrabold text-[#1F2937]">
                  {personalDetails.name}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B7280] font-lora italic pt-1">
                  <span>Born: {personalDetails.dob}</span>
                  <span>•</span>
                  <span>Main Device: {personalDetails.mobile}</span>
                </div>
              </div>

              {/* Navigation buttons */}
              <nav className="flex flex-wrap gap-2 w-full lg:w-auto">
                {[
                  { id: 'MOBILE', label: 'Mobile Diagnostics' },
                  ...(analysisMode === 'ADVANCED' ? [
                    { id: 'DASHBOARD', label: 'Overview Planes' },
                    { id: 'COMPATIBILITY', label: 'Hostile/Lover Match' },
                    { id: 'REMEDIES', label: 'Remedies Altar' },
                    { id: 'REPORT', label: 'AI printable Report' },
                    { id: 'ADMIN', label: 'Systems Hub' }
                  ] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ViewTab)}
                    className={`px-4 py-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-300 flex-1 sm:flex-initial cursor-pointer border ${
                      activeTab === tab.id
                        ? 'bg-[#D97706] text-white border-[#D97706] shadow-sm'
                        : 'bg-[#F8F4EF] hover:bg-[#F2E8DC] text-[#1F2937] border-[#E5E7EB]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Views render stage */}
            <div id="active-tab-stage">
              {activeTab === 'DASHBOARD' && dobData && nameData && mobileData && remedies && (
                <AstroDashboard
                  dobData={dobData}
                  nameData={nameData}
                  mobileData={mobileData}
                  remedies={remedies}
                  name={personalDetails.name}
                />
              )}

              {activeTab === 'MOBILE' && dobData && nameData && mobileData && remedies && (
                <MobileDiagnosticsPanel
                  personalDetails={personalDetails}
                  dobData={dobData}
                  nameData={nameData}
                  mobileData={mobileData}
                  remedies={remedies}
                  isQuickMode={analysisMode === 'QUICK' && !dob}
                />
              )}

              {activeTab === 'COMPATIBILITY' && (
                <CompatibilityTab />
              )}

              {activeTab === 'REMEDIES' && remedies && (
                <RemediesTab remedies={remedies} />
              )}

              {activeTab === 'REPORT' && dobData && nameData && mobileData && remedies && (
                <ReportTab
                  personalDetails={personalDetails}
                  dobData={dobData}
                  nameData={nameData}
                  mobileData={mobileData}
                  remedies={remedies}
                />
              )}

              {activeTab === 'ADMIN' && (
                <AdminPanel personalDetails={personalDetails} />
              )}
            </div>

          </div>
        )
        ) : currentPortal === 'LOSHU_GRID' ? (
          <CompleteLoshuGridAnalysis initialProfile={personalDetails} />
        ) : currentPortal === 'MARRIAGE_COMPATIBILITY' ? (
          <MarriageCompatibility />
        ) : (
          <PremiumConsultations />
        )}

      </main>


      {/* SEO & OCCULT AUTHORITY LIBRARY / INTERNAL LINKING SYSTEM */}
      <section id="seo-authority-centre" className="border-t border-[#E5E7EB] bg-[#FDFCF7] py-16 px-6 relative z-30">
        <div className="max-w-5xl mx-auto space-y-12 text-left font-sans text-xs">
          
          {/* Breadcrumbs Component */}
          <div className="flex items-center gap-2 text-[10px] uppercase font-mono text-slate-400 tracking-wider">
            <span>Home</span>
            <span>&gt;</span>
            <span>Vedic Occult Systems</span>
            <span>&gt;</span>
            <span className="text-[#D97706] font-bold">
              {currentSEOPath === 'mobile-numerology' ? 'Mobile Phone Frequencies' :
               currentSEOPath === 'name-numerology' ? 'Chaldean Name Correction Suite' :
               currentSEOPath === 'loshu-grid' ? 'Vedic Lo Shu birth Grid' :
               currentSEOPath === 'marriage-compatibility' ? '7-Layer Synastry Index' :
               currentSEOPath === 'vehicle-numerology' ? 'Vehicle Plates & Accident Risk' :
               currentSEOPath === 'house-numerology' ? 'Domestic House Vastu' :
               currentSEOPath === 'business-numerology' ? 'Brand Name Alignment' :
               currentSEOPath === 'signature-numerology' ? 'Handwriting Wealth Shield' :
               currentSEOPath === 'child-numerology' ? 'Auspicious Spellings for Children' :
               'Transit Lucky Date Finder'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b pb-12 border-[#F2E8DC]">
            {/* Header Column */}
            <div className="md:col-span-4 space-y-2">
              <h4 className="font-playfair text-xl font-bold text-slate-800">Grandmaster Occult Encyclopedia</h4>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Authorized Indian Numerology & Astrological reference library. Access classical Chaldean treatises, dynamic house grids, and signature corrections directly.
              </p>
            </div>

            {/* Direct Navigation - Fully Active Links */}
            <div className="md:col-span-8">
              <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block mb-4">Direct Portal Reference Registry</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { hash: '#mobile-numerology', label: '1. Mobile Scanner', desc: 'Cumulative Chaldean analysis' },
                  { hash: '#name-numerology', label: '2. Name Corrector', desc: 'Planetary spelling formulas' },
                  { hash: '#loshu-grid', label: '3. Master Lo Shu Grid', desc: 'Vedic 3x3 birth grid' },
                  { hash: '#marriage-compatibility', label: '4. Marriage Synastry', desc: '7-Layer relational scores' },
                  { hash: '#vehicle-numerology', label: '5. Vehicle Plates', desc: 'Vastu limits & risk scales' },
                  { hash: '#house-numerology', label: '6. House Address', desc: 'Domestic plot vibrations' },
                  { hash: '#business-numerology', label: '7. Corporate Branding', desc: 'Marketing suitability keys' },
                  { hash: '#signature-numerology', label: '8. Signature Audit', desc: 'Financial shielding curves' },
                  { hash: '#child-numerology', label: '9. Child Lucky Names', desc: 'Wisdom starting letters' },
                  { hash: '#lucky-date-finder', label: '10. Lucky Dates Finder', desc: 'Transit matching grids' },
                ].map((lnk) => (
                  <a
                    key={lnk.hash}
                    href={lnk.hash}
                    className={`block p-3 rounded-2xl border transition-all ${
                      currentSEOPath === lnk.hash.substring(1)
                        ? 'bg-[#1E3A8A]/5 border-[#1E3A8A] text-[#1E3A8A]'
                        : 'bg-white border-[#E5E7EB] hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="font-bold block text-[11px] font-sans">{lnk.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{lnk.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Structured FAQ & Articles Accordions */}
          <div className="space-y-6">
            <h4 className="font-playfair text-lg font-bold text-slate-800">Frequently Asked Questions & Treatises</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="p-5 bg-[#FDFCF7] border border-[#F2E8DC] rounded-3xl">
                  <span className="font-bold block text-slate-800 text-[13px] font-playfair">Q: What is the primary difference between Driver and Conductor numbers?</span>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    The <strong>Driver Number</strong> corresponds directly to your birth day date (e.g. 23 reduced to 5), representing your conscious character, talents, and physical disposition. The <strong>Conductor Number</strong> (or Bhagyank) is the sum calculation of your entire birth blueprint (Day + Month + Year), dictating your divine purpose, karmic trajectory, and sudden opportunities.
                  </p>
                </div>

                <div className="p-5 bg-[#FDFCF7] border border-[#F2E8DC] rounded-3xl">
                  <span className="font-bold block text-slate-800 text-[13px] font-playfair">Q: Why are house plates and vehicle sums evaluated using Chaldean instead of Pythagorean?</span>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    Traditional Chaldean Numerology was formulated around planetary phonetics and spiritual sound vibrations (from 1 to 8, with 9 left out as sacred). Since vehicles and homes possess high constant tactile interactions, phonetic vibrations correspond directly to their physical luck and shielding, whereas Pythagorean reflects standard alphabetical order.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-[#FDFCF7] border border-[#F2E8DC] rounded-3xl">
                  <span className="font-bold block text-slate-800 text-[13px] font-playfair">Q: Can a simple mobile number spelling change or digit replacement bypass a negative transit?</span>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    Yes. Under Rajiv Singh Chauhann principles, while the natal Lo Shu Grid is completely static, your mobile phone is a highly active modern device transiting thousands of cosmic frequencies daily. Choosing highly supportive supportive combinations (e.g., avoiding multiple 8s and 4s unless aligned) directly acts as a protective shield (Yantra).
                  </p>
                </div>

                <div className="p-4 bg-[#D97706]/5 border border-[#D97706]/15 rounded-3xl space-y-2">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#D97706] font-bold block">Scientific Disclaimer</span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    These occult consultations represent ancient Indian Chaldean findings from Vedic sages. Use these planetary readings to complement modern planning, hard work, and rational decision-making for maximum prosperity.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Footer System Line */}
      <footer id="main-footer" className="border-t border-[#E5E7EB] bg-[#F2E8DC]/40 py-10 relative z-20 mt-auto text-center space-y-2">
        <span className="font-playfair text-sm text-[#1F2937] font-bold block">Leo Family Occult Sciences</span>
        <span className="font-mono text-[9px] text-[#6B7280] uppercase tracking-[0.4em] block mx-4 leading-normal">
          Vedic Rules & Alignment Matrix • Raajeev Singh Chauhann Method • © {new Date().getFullYear()} All Rights Reserved
        </span>
      </footer>
    </div>
  );
};

export default App;

