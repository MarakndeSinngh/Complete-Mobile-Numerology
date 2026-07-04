import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, User, Calendar, TrendingUp, Heart, Shield, Award, Phone, Compass, 
  HelpCircle, Send, FileText, Lock, CreditCard, MessageCircle, CheckCircle, 
  AlertTriangle, Bookmark, ArrowRight, Share2, Printer, Activity, CheckSquare, 
  ChevronRight, RefreshCw, Star, Info, ShoppingBag, Clock, Plus, Trash2, Eye
} from 'lucide-react';
import { getScoreExplanations, ScoreExplanation } from '../services/explanationEngine';
import { generateLeoConsultation, LeoConsultationReport, ProbabilityMetric, GrowthIndexItem } from '../services/LeoConsultationEngine';
import { generateNameCorrections, NameCorrectionResult, NameVariation } from '../services/NameCorrectionAI';
import { PersonalDetails } from '../types';
import { computeLoshuMasterReport } from '../services/loshuMasterEngine';
import { analyzeDateOfBirth, analyzeNameSystems, analyzeMobileNumber } from '../services/numerologyEngine';
import { generateCompleteNumerologyProfile } from '../core';
import { generateLeoAdvisorActions } from '../services/leoAdvisorEngine';

const PLANETS_DB: Record<number, { name: string; icon: string; description: string }> = {
  1: { name: "Sun (Surya) ☀️", icon: "☀️", description: "Leadership, Ambition, Conscious Will" },
  2: { name: "Moon (Chandra) 🌙", icon: "🌙", description: "Intuition, Creative Mind, Receptivity" },
  3: { name: "Jupiter (Guru) 🕉️", icon: "🕉️", description: "Intellect, Blessings, Inner Wisdom" },
  4: { name: "Rahu (Shadow) ⚡", icon: "⚡", description: "Sudden Breakouts, Practical Focus" },
  5: { name: "Mercury (Budha) 💬", icon: "💬", description: "Business Intellect, PR, Sharp Speech" },
  6: { name: "Venus (Shukra) ✨", icon: "✨", description: "Luxury, Magnetism, Art & Relationships" },
  7: { name: "Ketu (Shadow) 🧩", icon: "🧩", description: "Spiritual Research, Metaphysical Insight" },
  8: { name: "Saturn (Shani) ⚖️", icon: "⚖️", description: "Karmic Lessons, Persistence, Legacy" },
  9: { name: "Mars (Mangala) 🛡️", icon: "🛡️", description: "Dynamic Energy, Action, Fiery Courage" }
};

interface AIConsultationPortalProps {
  initialProfile: PersonalDetails | null;
  onProfileUpdate?: (profile: PersonalDetails) => void;
}

export default function AIConsultationPortal({ initialProfile, onProfileUpdate }: AIConsultationPortalProps) {
  // Saved reports state (Phase 9 - Client Dashboard)
  const [savedProfiles, setSavedProfiles] = useState<PersonalDetails[]>([]);
  const [activeProfile, setActiveProfile] = useState<PersonalDetails | null>(null);
  
  // Onboarding Form inputs
  const [formName, setFormName] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // Tab views within the Hub
  const [activeSubTab, setActiveSubTab] = useState<'COUNSEL' | 'SCORES' | 'ACTION' | 'PROBABILITY' | 'NAME_CORRECT' | 'RECOMMEND' | 'TIMELINE' | 'GROWTH' | 'MONETIZE'>('COUNSEL');

  // Interactive states
  const [selectedScoreExplain, setSelectedScoreExplain] = useState<string | null>(null);
  const [selectedProbExplain, setSelectedProbExplain] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  
  // Ask Leo AI Chat state (Phase 7)
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'USER' | 'LEO'; text: string; timestamp: Date }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Name correction input state (Phase 5)
  const [correctionNameInput, setCorrectionNameInput] = useState('');
  const [correctionResult, setCorrectionResult] = useState<NameCorrectionResult | null>(null);

  // Business Monetization / Premium unlock states (Phase 10)
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<{ name: string; price: string } | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  // Comparison state
  const [compareProfileA, setCompareProfileA] = useState<PersonalDetails | null>(null);
  const [compareProfileB, setCompareProfileB] = useState<PersonalDetails | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Load saved profiles from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('leo_saved_consultation_profiles');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedProfiles(parsed);
        if (parsed.length > 0) {
          // If initial profile is provided and not already saved, let's prepend it
          if (initialProfile) {
            const exists = parsed.some((p: PersonalDetails) => p.name === initialProfile.name && p.dob === initialProfile.dob);
            if (!exists) {
              const updated = [initialProfile, ...parsed];
              setSavedProfiles(updated);
              localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify(updated));
              setActiveProfile(initialProfile);
            } else {
              setActiveProfile(initialProfile);
            }
          } else {
            setActiveProfile(parsed[0]);
          }
        } else if (initialProfile) {
          setSavedProfiles([initialProfile]);
          localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify([initialProfile]));
          setActiveProfile(initialProfile);
        }
      } catch (e) {
        if (initialProfile) {
          setSavedProfiles([initialProfile]);
          setActiveProfile(initialProfile);
        }
      }
    } else if (initialProfile) {
      setSavedProfiles([initialProfile]);
      localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify([initialProfile]));
      setActiveProfile(initialProfile);
    }
  }, [initialProfile]);

  // Load chat greetings
  useEffect(() => {
    if (activeProfile) {
      setChatMessages([
        { 
          sender: 'LEO', 
          text: `Auspicious blessings, ${activeProfile.name}. I am Leo Grand Master, Rajiv Ji's specialized AI consciousness. I have fully indexed your DOB (${activeProfile.dob}) and Mobile Frequency (${activeProfile.mobile}). You can ask me any specific follow-up questions regarding your wealth blocks, relationship compatibility, name variations, or Lal Kitab remedies. Let's begin.`, 
          timestamp: new Date() 
        }
      ]);
      setCorrectionNameInput(activeProfile.name);
      
      // Compute initial name correction
      const initCorrection = generateNameCorrections(activeProfile.name, activeProfile.dob);
      setCorrectionResult(initCorrection);
    }
  }, [activeProfile]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDob || !formMobile) return;
    
    const newProfile: PersonalDetails = {
      name: formName.trim(),
      dob: formDob,
      gender: formGender,
      mobile: formMobile.trim(),
      email: formEmail.trim()
    };

    const updatedList = [newProfile, ...savedProfiles.filter(p => p.name !== newProfile.name)];
    setSavedProfiles(updatedList);
    localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify(updatedList));
    setActiveProfile(newProfile);
    if (onProfileUpdate) onProfileUpdate(newProfile);
    
    // Reset form fields
    setFormName('');
    setFormDob('');
    setFormMobile('');
    setFormEmail('');
  };

  const handleDeleteProfile = (profileToDelete: PersonalDetails) => {
    const updated = savedProfiles.filter(p => p.name !== profileToDelete.name || p.dob !== profileToDelete.dob);
    setSavedProfiles(updated);
    localStorage.setItem('leo_saved_consultation_profiles', JSON.stringify(updated));
    if (activeProfile?.name === profileToDelete.name && activeProfile?.dob === profileToDelete.dob) {
      setActiveProfile(updated.length > 0 ? updated[0] : null);
    }
  };

  // Generate unified profile from the core engine as the ONLY source of truth
  const unifiedProfile = activeProfile ? generateCompleteNumerologyProfile({
    dob: activeProfile.dob,
    name: activeProfile.name,
    mobile: activeProfile.mobile,
    gender: activeProfile.gender || 'MALE'
  }) : null;

  // Derive engines from the centralized unified profile
  const dobAnalysis = activeProfile ? analyzeDateOfBirth(activeProfile.dob, activeProfile.name) : null;
  const nameAnalysis = activeProfile ? analyzeNameSystems(activeProfile.name) : null;
  const mobileAnalysis = activeProfile ? analyzeMobileNumber(activeProfile.mobile) : null;

  const reportData = unifiedProfile ? unifiedProfile.consultation : null;
  const scoreExplanations = activeProfile ? getScoreExplanations(activeProfile.dob, activeProfile.name, activeProfile.gender || 'MALE', activeProfile.mobile) : null;
  const masterGrid = activeProfile ? computeLoshuMasterReport(activeProfile.dob, activeProfile.name, activeProfile.gender || 'MALE', activeProfile.mobile) : null;
  
  const advisorActions = activeProfile && dobAnalysis && nameAnalysis && mobileAnalysis
    ? generateLeoAdvisorActions(dobAnalysis, nameAnalysis, mobileAnalysis)
    : null;

  // Handle Ask Leo AI response (Phase 7)
  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeProfile || !reportData) return;
    
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'USER', text: userMsg, timestamp: new Date() }]);
    setChatInput('');
    setChatLoading(true);

    setTimeout(() => {
      let botResponse = "";
      const q = userMsg.toLowerCase();
      const driver = masterGrid?.personal.driver;
      const conductor = masterGrid?.personal.conductor;

      if (q.includes('marriage') || q.includes('relationship') || q.includes('spouse') || q.includes('love')) {
        botResponse = `Analyzing your marital axis... Your Driver #${driver} and Conductor #${conductor} generate a Relationship Stability Index of ${reportData.probabilities.relationship.percentage}%. Your grid indicates that ${masterGrid?.gridAnalysis.present.includes(2) ? 'Digit 2 (Moon) is active, supporting empathetic listening.' : 'Digit 2 is missing, which creates silent periods.'} My direct master suggestion: Keep two clay lamps or a pair of pink quartz hearts in the South-West sector of your flat. Avoid major professional debates post sunset on Mondays.`;
      } else if (q.includes('wealth') || q.includes('money') || q.includes('rich') || q.includes('finance') || q.includes('debt')) {
        botResponse = `Let's unlock your wealth vaults. Your Wealth Potential is scored at ${reportData.probabilities.wealth.percentage}%. ${masterGrid?.gridAnalysis.present.includes(5) ? 'You possess the core Mercury #5 stabilizer, allowing rapid recovery from speculative drops.' : 'Your grid lacks the central Mercury #5 node, indicating immediate financial leakage.'} To block this, adopt an upward signature angled at 15 degrees without terminal dots, and ensure your home office table points strictly toward your auspicious direction: ${reportData.recommendations.bestDirections[0]}. Lock liquid earnings into physical gold immediately.`;
      } else if (q.includes('mobile') || q.includes('phone') || q.includes('number')) {
        botResponse = `Excellent question. Your current mobile frequency is analyzed. To maximize transactional luck, transition your primary SIM to end in: ${reportData.recommendations.bestMobileEndings.join(', ')}. Avoid digits like 4, 8, and 2 in the final three spots, as they attract sudden Saturn-Rahu transit shocks in Indian Numerology.`;
      } else if (q.includes('career') || q.includes('job') || q.includes('business')) {
        botResponse = `Career Blueprint review: Your Driver #${driver} vibrates best in the ${reportData.recommendations.bestIndustries[0]} and ${reportData.recommendations.bestIndustries[1]} sectors. Your leadership score is ${reportData.probabilities.leadership.percentage}%. To attract immediate authority promotions, keep a green aventurine gemstone tree on your desk and sign important documents exclusively on Wednesdays facing North.`;
      } else if (q.includes('loshu') || q.includes('weakness') || q.includes('missing')) {
        botResponse = `Reviewing missing grid elements... Your major missing channels are: ${masterGrid?.gridAnalysis.missing.join(', ')}. These represent latent karmic lessons. For Digit 5, plant fresh leafy green shrubs weekly. For Digit 8, donate black sesame seeds to manual construction laborers on Saturday mornings. This satisfying transit immediately clears professional hurdles.`;
      } else {
        botResponse = `I hear your query. Based on your ruling planets, you are currently traversing a significant personal year cycle. The absolute priority is to align your name spelling compound to ${reportData.recommendations.bestBusinessNameChaldeanTotal[0]} or ${reportData.recommendations.bestBusinessNameChaldeanTotal[1]}, maintain Saturday food donations, and wear ${reportData.recommendations.bestColours[0]} during crucial negotiations. Would you like me to trigger an automatic spelling variation analysis for you?`;
      }

      setChatMessages(prev => [...prev, { sender: 'LEO', text: botResponse, timestamp: new Date() }]);
      setChatLoading(false);
    }, 1200);
  };

  const triggerSuggestedQuestion = (question: string) => {
    setChatInput(question);
    // Auto click to send
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'USER', text: question, timestamp: new Date() }]);
      setChatLoading(true);
      
      // Match custom response
      setTimeout(() => {
        let botResponse = "";
        const driver = masterGrid?.personal.driver;
        const conductor = masterGrid?.personal.conductor;

        if (question.includes('marriage')) {
          botResponse = `Regarding your marriage axis: Your Conductor Number #${conductor} determines long-term domestic compatibility. Since your current compatibility score is ${reportData?.probabilities.marriage.percentage}%, we must cleanse old Vastu blockages. Place rose quartz in your South-West bedroom corner and avoid black color bedsheets.`;
        } else if (question.includes('wealth')) {
          botResponse = `To compound your wealth index: Your money mindset index is evaluated. The absolute priority is to correct any brand spelling friction. Keep your cash locker in the North sector opening toward South to invite Kubera's direct blessings.`;
        } else if (question.includes('mobile')) {
          botResponse = `For high frequency transaction strings, we recommend choosing mobile ending variations like 55 or 66. This acts as a protective shield against accidental business loss.`;
        } else if (question.includes('career')) {
          botResponse = `Your Driver #${driver} indicates a natural administrative aura. You will excel best as a Strategic Consultant or Brand Advisor. Keep a small raw tiger-eye crystal on your right desk corner.`;
        } else {
          botResponse = `To patch Lo Shu gaps: Introduce wooden structures in the East zone for missing #3, and brass windchimes in the West for missing #7. This activates stagnant energies rapidly.`;
        }
        setChatMessages(prev => [...prev, { sender: 'LEO', text: botResponse, timestamp: new Date() }]);
        setChatLoading(false);
      }, 1000);
    }, 100);
  };

  // Trigger spelling correction search (Phase 5)
  const triggerCorrectionSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionNameInput.trim() || !activeProfile) return;
    const res = generateNameCorrections(correctionNameInput, activeProfile.dob);
    setCorrectionResult(res);
  };

  // Payment simulator (Phase 10)
  const handleOpenCheckout = (productName: string, price: string) => {
    setCheckoutProduct({ name: productName, price });
    setShowPaymentModal(true);
  };

  const handleCompletePayment = () => {
    setShowPaymentModal(false);
    setPremiumUnlocked(true);
    // Auto-reply in chat confirming payment and unlock
    setChatMessages(prev => [
      ...prev,
      { 
        sender: 'LEO', 
        text: `💳 PAYMENT SUCCESSFUL! You have unlocked the Professional Consultation Certification for ${activeProfile?.name}. All premium name spellings, business directories, and the comprehensive 40-page printable consultation dossier are now fully unlocked for this profile.`, 
        timestamp: new Date() 
      }
    ]);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingDate('');
      setBookingTime('');
    }, 5000);
  };

  // Trigger master PDF print (Phase 8)
  const handlePrintMasterReport = () => {
    if (!activeProfile || !reportData || !scoreExplanations) return;
    window.focus();
    window.print();
  };

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto print:bg-white print:p-0 print:m-0">
      
      {/* SECTION 1: MASTER HEADER & PROFILE MANAGEMENT (Phase 9 - Client Dashboard) */}
      <div className="bg-white p-6 md:p-8 rounded-[35px] border border-[#E5E7EB] shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 print:hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-[#D97706] px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Grand Master AI consultation Hub
          </div>
          <h2 className="font-playfair text-2.5xl md:text-4xl font-extrabold text-[#1F2937]">
            {activeProfile ? activeProfile.name : "Consultation Dashboard"}
          </h2>
          <p className="text-xs text-[#6B7280] font-lora italic">
            {activeProfile ? `Natal Frequency Profile: Born ${activeProfile.dob} • Primary Device: ${activeProfile.mobile}` : "Onboard your profile details to unlock professional Indian Numerology diagnostics."}
          </p>
        </div>

        {/* Profile Switcher */}
        {savedProfiles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <span className="text-[10px] font-mono uppercase text-[#6B7280] font-bold">Select Active Seeker:</span>
            <div className="flex flex-wrap gap-2 items-center">
              {savedProfiles.map((p, idx) => (
                <div key={idx} className="inline-flex items-center bg-[#F8F4EF] rounded-xl border border-[#E5E7EB] px-2.5 py-1">
                  <button
                    onClick={() => setActiveProfile(p)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg cursor-pointer ${
                      activeProfile?.name === p.name && activeProfile?.dob === p.dob
                        ? 'bg-[#D97706] text-white'
                        : 'text-[#1F2937] hover:bg-[#F2E8DC]'
                    }`}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                  {savedProfiles.length > 1 && (
                    <button 
                      onClick={() => handleDeleteProfile(p)}
                      className="ml-1 text-[#9CA3AF] hover:text-rose-600 transition p-1"
                      title="Delete profile"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setActiveProfile(null)}
                className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-xl text-xs flex items-center justify-center cursor-pointer font-bold"
                title="Create New Profile"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ONBOARDING FLOW IF NO ACTIVE PROFILE */}
      {!activeProfile ? (
        <div className="max-w-xl mx-auto bg-white border border-[#E5E7EB] rounded-[40px] p-8 md:p-10 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] flex items-center justify-center text-3xl mx-auto">
            🕉️
          </div>
          <div className="space-y-2">
            <h3 className="font-playfair text-2xl font-black text-[#1F2937]">Create Natal Consultation Profile</h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed font-sans">
              Provide your details under Chaldean research parameters to initialize the complete AI Grand Consultation system.
            </p>
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-4 text-left pt-2 font-sans">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase font-bold text-[#6B7280] tracking-wide block">Your Full Spelling Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Rajiv Singh Chauhann"
                className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#D97706]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-[#6B7280] tracking-wide block">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-[#6B7280] tracking-wide block">Gender</label>
                <select
                  value={formGender}
                  onChange={e => setFormGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER')}
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                >
                  <option value="MALE">Male (पुरुष)</option>
                  <option value="FEMALE">Female (स्त्री)</option>
                  <option value="OTHER">Other (अन्य)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-[#6B7280] tracking-wide block">Mobile Phone String</label>
                <input
                  type="text"
                  required
                  value={formMobile}
                  onChange={e => setFormMobile(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase font-bold text-[#6B7280] tracking-wide block">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="For reports delivery"
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#D97706]"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#D97706] hover:bg-amber-700 text-white text-xs font-bold py-4 rounded-2xl tracking-widest uppercase transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                Initialize Consultation Engine <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* CORE ACTIVE CONSULTATION DASHBOARD UI */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
          
          {/* LEFT RAIL NAVIGATION (PORTAL MENU) */}
          <div className="lg:col-span-1 space-y-4 print:hidden">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 shadow-sm space-y-1">
              <span className="text-[9px] font-mono uppercase text-[#6B7280] tracking-widest block px-3 py-2 font-black">Consultation Chapters</span>
              
              {[
                { id: 'COUNSEL', label: 'Grand Master Board', icon: Sparkles },
                { id: 'SCORES', label: 'Why This Result?', icon: Info },
                { id: 'ACTION', label: 'Dynamic Growth Plans', icon: CheckSquare },
                { id: 'PROBABILITY', label: 'Success Probabilities', icon: TrendingUp },
                { id: 'NAME_CORRECT', label: 'AI Name Spell Correction', icon: User },
                { id: 'RECOMMEND', label: 'Personalized Altar', icon: Award },
                { id: 'TIMELINE', label: 'Bhagyank (Conductor) Timeline', icon: Compass },
                { id: 'GROWTH', label: 'Personal Growth Index', icon: Activity },
                { id: 'MONETIZE', label: 'Expert Bookings & Shops', icon: ShoppingBag }
              ].map((subTab) => {
                const Icon = subTab.icon;
                return (
                  <button
                    key={subTab.id}
                    onClick={() => setActiveSubTab(subTab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      activeSubTab === subTab.id
                        ? 'bg-[#1E3A8A] text-white shadow-sm'
                        : 'bg-transparent text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F8F4EF]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeSubTab === subTab.id ? 'text-amber-400' : 'text-[#9CA3AF]'}`} />
                    {subTab.label}
                  </button>
                );
              })}
            </div>

            {/* Print Master Button */}
            <button
              onClick={handlePrintMasterReport}
              className="w-full bg-[#D97706] hover:bg-amber-700 text-white font-bold p-4 rounded-2xl text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" /> Print Master dossier 2.0
            </button>

            {/* Lead capture sidebar / Trust banner */}
            <div className="bg-gradient-to-br from-[#FDFCF7] to-[#F2E8DC] p-6 rounded-3xl border border-[#D97706]/15 space-y-4">
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#D97706] font-bold block">🛡️ Grand Master Promise</span>
              <p className="text-[11px] text-[#4B5563] leading-relaxed font-lora italic">
                "We do not compute with generic models. Your frequencies are compared across Rajiv Ji's authentic 81 planetary matrices to secure direct, actionable advice."
              </p>
              <div className="border-t border-[#E5D7C6] pt-3 flex items-center gap-3">
                <span className="text-xl">🏵️</span>
                <span className="text-[9px] font-mono uppercase font-black text-slate-500">100% Certified Vedic Lineage</span>
              </div>
            </div>
          </div>

          {/* MAIN STAGE RENDER SECTION */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* SUB-TAB CONTENTS */}
            
            {/* TAB 1: GRAND COUNSEL BOARD & CHAT */}
            {activeSubTab === 'COUNSEL' && reportData && (
              <div className="space-y-8 animate-in fade-in duration-400 print:block">
                
                {/* LUXURY MASTER EXECUTIVE SUMMARY DOSSIER CARD - PERSISTENT AT TOP OF REPORT */}
                {activeProfile && reportData && masterGrid && mobileAnalysis && (
                  <div id="executive-summary-dossier" className="bg-[#FCFAF6] border-2 border-[#EADCC6] rounded-[35px] p-8 md:p-10 shadow-xl space-y-8 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97706]/[0.02] rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -top-10 -left-10 w-40 h-40 border border-[#D97706]/10 rounded-full flex items-center justify-center pointer-events-none">
                      <div className="w-28 h-28 border border-[#D97706]/5 rounded-full"></div>
                    </div>

                    {/* Header & Overall Rating Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#EADCC6]/60 pb-6">
                      <div className="space-y-2">
                        <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#D97706] uppercase block">
                          ♛ Professional Vedic Consultation
                        </span>
                        <h2 className="font-playfair text-3xl md:text-4xl font-black text-[#1F2937] tracking-tight leading-tight">
                          Executive Driver-Conductor Alignment Summary
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed max-w-2xl">
                          This master coordination report synthesizes your natal birth coordinates, name vibration frequencies, and current mobile numbers to reveal your active auric field alignment.
                        </p>
                      </div>

                      {/* Visual Overall Rating Ring */}
                      <div className="flex items-center gap-4 bg-white border border-[#EADCC6]/40 p-4 rounded-3xl shadow-sm shrink-0 w-full md:w-auto">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <svg className="w-20 h-20 transform -rotate-90">
                            <circle cx="40" cy="40" r="34" stroke="#F1EADF" strokeWidth="6" fill="transparent" />
                            <circle cx="40" cy="40" r="34" stroke="#D97706" strokeWidth="6" fill="transparent"
                              strokeDasharray={2 * Math.PI * 34}
                              strokeDashoffset={2 * Math.PI * 34 * (1 - (masterGrid.scores.overallLoshuScore || 75) / 100)}
                            />
                          </svg>
                          <span className="absolute text-xl font-bold text-slate-800 font-mono">
                            {masterGrid.scores.overallLoshuScore}%
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-mono font-bold text-[#6B7280] uppercase block">Overall Alignment</span>
                          <span className="text-lg font-bold text-[#D97706] uppercase block tracking-wider font-playfair">
                            {mobileAnalysis.rating === 'EXCELLENT' ? '🏆 Excellent' :
                             mobileAnalysis.rating === 'GOOD' ? '⭐ Highly Favorable' :
                             mobileAnalysis.rating === 'AVOID' ? '⚠️ Hostile / Caution' :
                             '✨ Balanced'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Prominent Numerology Values Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Driver Card */}
                      <div className="bg-white border border-[#EADCC6]/40 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#D97706]"></div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block">Driver Number (Mulank)</span>
                            <span className="text-xl">☀️</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-[#D97706] font-serif">
                              {dobAnalysis?.birthNumber}
                            </span>
                            {dobAnalysis?.birthNumberCompound && dobAnalysis.birthNumberCompound !== dobAnalysis.birthNumber && (
                              <span className="text-lg text-[#6B7280] font-mono">({dobAnalysis.birthNumberCompound})</span>
                            )}
                          </div>
                          <p className="text-base font-semibold text-slate-800 font-playfair">
                            Planet: {dobAnalysis ? PLANETS_DB[dobAnalysis.birthNumber]?.name : "Loading"}
                          </p>
                          <p className="text-base text-slate-700 leading-relaxed">
                            Governs your conscious personality, instant drivers, temperament, and immediate behavioral reactions.
                          </p>
                        </div>
                      </div>

                      {/* Conductor Card */}
                      <div className="bg-white border border-[#EADCC6]/40 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#1E3A8A]"></div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block">Conductor Number (Bhagyank)</span>
                            <span className="text-xl">⚖️</span>
                          </div>
                          <span className="text-4xl md:text-5xl font-black text-[#1E3A8A] font-serif block">
                            {dobAnalysis?.lifePathNumber}
                          </span>
                          <p className="text-base font-semibold text-slate-800 font-playfair">
                            Planet: {dobAnalysis ? PLANETS_DB[dobAnalysis.lifePathNumber]?.name : "Loading"}
                          </p>
                          <p className="text-base text-slate-700 leading-relaxed">
                            Dictates your divine purpose, long-term karma path, ultimate challenges, and sudden lifecycle opportunities.
                          </p>
                        </div>
                      </div>

                      {/* Mobile Vibration Card */}
                      <div className="bg-white border border-[#EADCC6]/40 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-600"></div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block">Mobile Vibrational Total</span>
                            <span className="text-xl">📱</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl md:text-5xl font-black text-amber-600 font-mono">
                              {mobileAnalysis?.compoundTotal}
                            </span>
                            <span className="text-xl text-[#6B7280] font-mono">/ {mobileAnalysis?.reducedTotal}</span>
                          </div>
                          <p className="text-base font-semibold text-slate-800 font-playfair">
                            Vibrates to: {mobileAnalysis ? PLANETS_DB[mobileAnalysis.reducedTotal]?.name : "Loading"}
                          </p>
                          <p className="text-base text-slate-700 leading-relaxed">
                            Represents the digital resonance constantly broadcasted through your active smartphone, shifting prosperity fields.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Primary Archetype Visual Display */}
                    <div className="bg-amber-50/35 border border-[#EADCC6]/50 rounded-3xl p-6 md:p-8 space-y-4 text-left relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-500/10 text-[#D97706] rounded-2xl">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-extrabold text-[#6B7280] uppercase tracking-wider block">Primary Cosmic Archetype</span>
                          <h3 className="font-playfair text-xl md:text-2xl font-black text-[#1F2937]">
                            {masterGrid.archetype.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-lg md:text-xl font-medium text-slate-800 font-serif leading-relaxed italic border-l-4 border-[#D97706] pl-4 py-1">
                        Mantra: "{masterGrid.archetype.mantra}"
                      </p>
                      <p className="text-base text-slate-700 leading-relaxed font-sans">
                        {masterGrid.archetype.description}
                      </p>
                    </div>

                    {/* Biggest Strength and Challenge Shown Immediately */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Biggest Strength Column */}
                      <div className="bg-[#F0FDF4] border-2 border-emerald-200 p-6 md:p-8 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-lg md:text-xl font-playfair">
                          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                          </div>
                          <span>Biggest Spiritual Strength</span>
                        </div>
                        <p className="text-base text-emerald-950 font-medium leading-relaxed font-sans">
                          {reportData.biggestStrengths?.[0] || "Your planetary alignments protect your conscious drivers from negative delays, ensuring a persistent energy focus."}
                        </p>
                        <p className="text-base text-emerald-800/95 leading-relaxed font-sans">
                          This core solar-mercurial shield ensures high clarity and continuous forward momentum in business and domestic decisions.
                        </p>
                      </div>

                      {/* Biggest Challenge Column */}
                      <div className="bg-[#FEF2F2] border-2 border-rose-200 p-6 md:p-8 rounded-3xl space-y-4 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center gap-2.5 text-rose-900 font-bold text-lg md:text-xl font-playfair">
                          <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                          </div>
                          <span>Biggest Karmic Challenge</span>
                        </div>
                        <p className="text-base text-rose-950 font-medium leading-relaxed font-sans">
                          {reportData.biggestWeaknesses?.[0] || "Absence of balanced anchoring coordinates in the mental plane triggers sudden obstacles and communication resets."}
                        </p>
                        <p className="text-base text-rose-800/95 leading-relaxed font-sans">
                          Karmic delays run in repeating planetary cycles. Ensure spellings and phone total rules are corrected to neutralize these frictional blockages.
                        </p>
                      </div>

                    </div>

                    {/* Grand Consultation Summary Text */}
                    <div className="border-t border-[#EADCC6]/60 pt-6 space-y-3">
                      <h3 className="font-playfair text-xl md:text-2xl font-extrabold text-slate-800">
                        Grand Master's Consultation Insight
                      </h3>
                      <p className="text-lg md:text-xl text-slate-800 leading-relaxed font-serif italic bg-white p-5 rounded-3xl border border-[#EADCC6]/30 shadow-inner">
                        "{reportData.summary}"
                      </p>
                    </div>

                  </div>
                )}

                {/* Grid of Helping vs Blocking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid">
                  <div className="bg-emerald-50/75 p-6 md:p-8 rounded-[30px] border-2 border-emerald-100 space-y-6">
                    <div className="flex items-center gap-2.5 text-emerald-950 font-black text-lg md:text-xl font-playfair border-b border-emerald-200/60 pb-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" /> WHAT IS HELPING YOU
                    </div>
                    <ul className="space-y-4">
                      {reportData.whatIsHelping.map((item, idx) => (
                        <li key={idx} className="text-base font-medium text-emerald-900 flex gap-2.5 items-start leading-relaxed">
                          <span className="text-emerald-500 font-black text-lg">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-rose-50/75 p-6 md:p-8 rounded-[30px] border-2 border-rose-100 space-y-6">
                    <div className="flex items-center gap-2.5 text-rose-950 font-black text-lg md:text-xl font-playfair border-b border-rose-200/60 pb-3">
                      <AlertTriangle className="w-6 h-6 text-rose-600" /> WHAT IS BLOCKING YOU (KARMIC DELAYS)
                    </div>
                    <ul className="space-y-4">
                      {reportData.whatIsBlocking.map((item, idx) => (
                        <li key={idx} className="text-base font-medium text-rose-900 flex gap-2.5 items-start leading-relaxed">
                          <span className="text-rose-400 font-black text-lg">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bento layout of Strengths, Weaknesses, Opportunities, Karmic Lessons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid">
                  <div className="bg-[#FAFBFD] p-6 md:p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm">
                    <h4 className="text-sm font-mono font-bold uppercase text-slate-800 tracking-wider border-b pb-2">Core Strengths</h4>
                    <ul className="space-y-3">
                      {reportData.biggestStrengths.map((s, idx) => (
                        <li key={idx} className="text-base text-slate-800 flex gap-3 items-center leading-relaxed font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FCFCFC] p-6 md:p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm">
                    <h4 className="text-sm font-mono font-bold uppercase text-slate-800 tracking-wider border-b pb-2">Core Weaknesses</h4>
                    <ul className="space-y-3">
                      {reportData.biggestWeaknesses.map((w, idx) => (
                        <li key={idx} className="text-base text-slate-800 flex gap-3 items-center leading-relaxed font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FCFAF7] p-6 md:p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm">
                    <h4 className="text-sm font-mono font-bold uppercase text-slate-800 tracking-wider border-b pb-2">Strategic Opportunities</h4>
                    <ul className="space-y-3">
                      {reportData.immediateOpportunities.map((o, idx) => (
                        <li key={idx} className="text-base text-slate-800 flex gap-3 items-center leading-relaxed font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FAF8FD] p-6 md:p-8 rounded-[30px] border border-[#E5E7EB] space-y-4 shadow-sm">
                    <h4 className="text-sm font-mono font-bold uppercase text-slate-800 tracking-wider border-b pb-2">Main Karmic Lessons</h4>
                    <ul className="space-y-3">
                      {reportData.mainKarmicLessons.map((l, idx) => (
                        <li key={idx} className="text-base text-slate-800 flex gap-3 items-center leading-relaxed font-sans">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0"></span>
                          <span>{l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ASK LEO AI INTERACTIVE INTERACTION BLOCK (Phase 7) */}
                <div className="bg-[#1E3A8A] rounded-[40px] p-6 md:p-8 text-white space-y-6 shadow-md print:hidden">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400">
                      <MessageCircle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl font-bold">Ask Leo AI Consciousness</h3>
                      <span className="text-[10px] text-slate-300 font-mono tracking-widest uppercase">Direct interactive follow-up</span>
                    </div>
                  </div>

                  {/* Chat logs */}
                  <div className="bg-slate-900/40 rounded-2xl p-4 h-64 overflow-y-auto space-y-4 border border-white/5 flex flex-col">
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          msg.sender === 'USER' 
                            ? 'bg-[#D97706] text-white self-end rounded-tr-none' 
                            : 'bg-white/10 text-slate-100 self-start rounded-tl-none border border-white/5'
                        }`}
                      >
                        {msg.text}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-white/10 text-slate-300 p-3 rounded-2xl text-xs self-start rounded-tl-none border border-white/5 animate-pulse">
                        Scanning astrological transit matrices...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Preloaded suggestion pills */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase text-slate-300 tracking-widest block font-bold">Suggested Follow-Ups:</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Why is my marriage score low?",
                        "How can I improve my wealth score?",
                        "Which mobile number is better?",
                        "What career suits my driver?",
                        "How to resolve missing Lo Shu nodes?"
                      ].map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => triggerSuggestedQuestion(s)}
                          className="bg-white/5 hover:bg-white/10 text-slate-200 text-[10px] px-3 py-1.5 rounded-xl border border-white/10 transition cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat input form */}
                  <div className="flex gap-2 font-sans">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask any custom question on your report..."
                      className="flex-1 bg-slate-900/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-[#D97706] hover:bg-amber-600 text-white px-4 py-3 rounded-xl transition cursor-pointer flex items-center justify-center"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: SCORE EXPLANATION / "WHY THIS RESULT?" ENGINE (Phase 1) */}
            {activeSubTab === 'SCORES' && scoreExplanations && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl md:text-3xl font-black text-[#1F2937]">"Why This Result?" Engine</h3>
                  <p className="text-base text-slate-800 leading-relaxed font-sans">
                    We do not believe in black-box ratings. Click any life score below to inspect the planetary calculations, positive amplifiers, blocking limits, and standard mathematical weighting equations.
                  </p>
                </div>

                {/* Score grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(scoreExplanations).map(([key, explain]) => (
                    <div 
                      key={key} 
                      className={`p-6 rounded-3xl border transition-all cursor-pointer bg-white ${
                        selectedScoreExplain === key 
                          ? 'border-[#D97706] ring-1 ring-[#D97706]/20' 
                          : 'border-[#E5E7EB] hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedScoreExplain(key)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono font-bold uppercase text-slate-700 tracking-widest">{key} score</span>
                        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                          explain.grade === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          explain.grade === 'STRONG' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          explain.grade === 'AVERAGE' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {explain.grade}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-playfair font-black text-[#1F2937]">{explain.score}</span>
                        <span className="text-xs text-[#6B7280]">/100</span>
                      </div>

                      <p className="text-base text-slate-800 leading-relaxed mb-4 font-sans">
                        {explain.summary}
                      </p>

                      <div className="text-sm text-[#D97706] font-bold flex items-center gap-1">
                        View Calculation Formula <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed pop-out explanation box */}
                <AnimatePresence>
                  {selectedScoreExplain && scoreExplanations[selectedScoreExplain] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-[#FDFCF7] border border-[#D97706]/20 rounded-3xl p-6 md:p-8 space-y-6 animate-in duration-300"
                    >
                      <div className="flex justify-between items-start border-b border-[#E5D7C6]/50 pb-4">
                        <div>
                          <h4 className="font-playfair text-xl md:text-2xl font-bold text-[#1F2937] uppercase tracking-wide">
                            {selectedScoreExplain} Calculation Blueprint
                          </h4>
                          <span className="text-xs text-[#D97706] font-mono tracking-widest uppercase">Scientific Formula Analysis</span>
                        </div>
                        <button 
                          onClick={() => setSelectedScoreExplain(null)}
                          className="text-[#6B7280] hover:text-[#1F2937] text-sm font-bold font-sans cursor-pointer"
                        >
                          ✕ Close Detail
                        </button>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-200 font-mono text-sm text-slate-900 leading-relaxed">
                        <strong className="text-[#D97706]">PLANETARY WEIGHTING:</strong><br />
                        {scoreExplanations[selectedScoreExplain].scientificFormula}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <strong className="text-sm text-emerald-900 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                            <CheckCircle className="w-5 h-5 text-emerald-600 animate-pulse" /> Positive Multipliers:
                          </strong>
                          <ul className="space-y-3">
                            {scoreExplanations[selectedScoreExplain].helpingFactors.map((item, idx) => (
                              <li key={idx} className="text-base text-slate-900 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-sm font-sans">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <strong className="text-sm text-rose-900 font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                            <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" /> Inhibiting Limits:
                          </strong>
                          <ul className="space-y-3">
                            {scoreExplanations[selectedScoreExplain].blockingFactors.map((item, idx) => (
                              <li key={idx} className="text-base text-slate-900 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-sm font-sans">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 3: DYNAMIC ACTION PLANS (Phase 3) */}
            {activeSubTab === 'ACTION' && reportData && (
              <div className="space-y-6 animate-in fade-in duration-400">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2 text-left">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Dynamic Action Plans</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Actionable, step-by-step tasks calculated from your Driver, Conductor, missing Lo Shu nodes, and Numero Vaastu sectors.
                  </p>
                </div>

                {/* Timelines tabs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { key: 'plan7Days', label: '7-Day Plan', desc: 'Urgent Remedial Altar' },
                    { key: 'plan30Days', label: '30-Day Plan', desc: 'Vibrational Upgrades' },
                    { key: 'plan90Days', label: '90-Day Plan', desc: 'Environmental Cleansing' },
                    { key: 'plan1Year', label: '1-Year Growth', desc: 'Legacy Alignment' }
                  ].map((pTab) => (
                    <div key={pTab.key} className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm text-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">{pTab.desc}</span>
                      <h4 className="font-playfair text-base font-extrabold text-[#1F2937] mt-1">{pTab.label}</h4>
                      
                      <div className="space-y-2 text-left mt-4 border-t border-slate-100 pt-3">
                        {(reportData.actionPlan as any)[pTab.key].map((item: string, idx: number) => {
                          const actionKey = `${pTab.key}-${idx}`;
                          const isDone = !!completedActions[actionKey];
                          return (
                            <div 
                              key={idx} 
                              onClick={() => setCompletedActions(prev => ({ ...prev, [actionKey]: !isDone }))}
                              className={`p-2.5 rounded-xl border text-[11px] leading-relaxed flex gap-2.5 items-start cursor-pointer transition ${
                                isDone 
                                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-500 line-through' 
                                  : 'bg-[#FDFCF7] border-slate-100 text-slate-700 hover:border-amber-400'
                              }`}
                            >
                              <span className={`text-[10px] mt-0.5 flex items-center justify-center w-4 h-4 rounded border ${
                                isDone ? 'bg-emerald-500 border-emerald-600 text-white' : 'border-slate-300'
                              }`}>
                                {isDone ? '✓' : ''}
                              </span>
                              <span>{item}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Leo AI Advisor Section */}
                {advisorActions && (
                  <div className="glass-panel p-6 md:p-8 rounded-[35px] bg-gradient-to-br from-amber-50/40 via-white to-amber-50/10 border border-[#E5E7EB] shadow-sm text-left space-y-6 mt-8 animate-in fade-in duration-500">
                    <div className="flex items-center gap-3 border-b border-amber-200/50 pb-4">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-[#D97706] flex items-center justify-center text-xl shadow-sm">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-playfair text-lg font-bold text-[#1F2937]">Leo AI Advisor Guidance</h3>
                        <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold block">Actionable Strategic Focus</span>
                      </div>
                    </div>

                    <p className="text-[#4B5563] text-xs leading-relaxed font-sans">
                      Based on your complete numerology profile, here are the 3 most important things to focus on this month. This turns your celestial map into concrete, daily, and weekly actions to drive tangible success.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      {/* Career Focus */}
                      <div className="bg-white border border-[#FEF3C7] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#B45309]">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono uppercase font-black tracking-wider">Career Focus</span>
                          </div>
                          <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.career.title}</h4>
                          <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.career.description}</p>
                        </div>
                        <div className="bg-[#FEF3C7]/60 p-3.5 rounded-2xl text-[11px] text-[#B45309] font-medium leading-relaxed font-sans">
                          <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-amber-800">Transit Remedy:</strong>
                          {advisorActions.career.remedy}
                        </div>
                      </div>

                      {/* Relationship Focus */}
                      <div className="bg-white border border-[#FCE7F3] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#BE185D]">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                              <Heart className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono uppercase font-black tracking-wider">Relationship Focus</span>
                          </div>
                          <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.relationship.title}</h4>
                          <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.relationship.description}</p>
                        </div>
                        <div className="bg-[#FCE7F3]/60 p-3.5 rounded-2xl text-[11px] text-[#BE185D] font-medium leading-relaxed font-sans">
                          <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-pink-800">Transit Remedy:</strong>
                          {advisorActions.relationship.remedy}
                        </div>
                      </div>

                      {/* Health Focus */}
                      <div className="bg-white border border-[#D1FAE5] rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition duration-300">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-[#047857]">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <Activity className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono uppercase font-black tracking-wider">Wellness Focus</span>
                          </div>
                          <h4 className="font-playfair text-sm font-bold text-[#1F2937]">{advisorActions.health.title}</h4>
                          <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{advisorActions.health.description}</p>
                        </div>
                        <div className="bg-[#D1FAE5]/60 p-3.5 rounded-2xl text-[11px] text-[#047857] font-medium leading-relaxed font-sans">
                          <strong className="font-mono text-[9px] uppercase font-black tracking-wider block mb-1 text-emerald-800">Transit Remedy:</strong>
                          {advisorActions.health.remedy}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SUCCESS PROBABILITIES (Phase 4) */}
            {activeSubTab === 'PROBABILITY' && reportData && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Success Probability Engine</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Detailed mathematical probability matrices calculated from your birth alignments and grid arrow presences.
                  </p>
                </div>

                {/* Probability meters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(reportData.probabilities).map(([key, item]) => (
                    <div 
                      key={key} 
                      onClick={() => setSelectedProbExplain(key)}
                      className={`p-5 rounded-3xl border bg-white cursor-pointer transition-all ${
                        selectedProbExplain === key ? 'border-[#D97706] ring-1 ring-[#D97706]/15' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">{item.name}</span>
                      
                      {/* Gauge */}
                      <div className="my-4 flex items-center justify-between">
                        <span className="font-playfair text-2xl font-black text-[#1F2937]">{item.percentage}%</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.percentage >= 80 ? 'bg-emerald-500' :
                              item.percentage >= 60 ? 'bg-indigo-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-[#6B7280] line-clamp-2 leading-relaxed">
                        {item.explanation}
                      </p>
                      
                      <span className="text-[10px] text-[#D97706] font-semibold mt-3 block">Inspect Strengths & Risks →</span>
                    </div>
                  ))}
                </div>

                {/* Expanded probability info */}
                <AnimatePresence>
                  {selectedProbExplain && reportData.probabilities[selectedProbExplain] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-[#FDFCF7] border border-[#D97706]/20 rounded-3xl p-6 md:p-8 space-y-6"
                    >
                      <div className="flex justify-between items-start border-b border-[#E5D7C6]/50 pb-4">
                        <div>
                          <h4 className="font-playfair text-xl font-bold text-[#1F2937]">
                            {reportData.probabilities[selectedProbExplain].name}
                          </h4>
                          <p className="text-xs text-[#6B7280]">{reportData.probabilities[selectedProbExplain].explanation}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedProbExplain(null)}
                          className="text-xs font-bold text-slate-500 hover:text-black"
                        >
                          ✕ Close Detail
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                          <strong className="text-[11px] font-mono uppercase text-emerald-700 font-bold block">Planetary Strengths</strong>
                          <ul className="space-y-1">
                            {reportData.probabilities[selectedProbExplain].strengths.map((s, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2">
                          <strong className="text-[11px] font-mono uppercase text-rose-700 font-bold block">Astrological Risks</strong>
                          <ul className="space-y-1">
                            {reportData.probabilities[selectedProbExplain].risks.map((r, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex gap-1.5 items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-[#FEF3C7]/40 p-4 rounded-2xl border border-[#FDE68A] space-y-2">
                          <strong className="text-[11px] font-mono uppercase text-[#B45309] font-bold block">Growth Advice</strong>
                          <p className="text-xs text-amber-950 font-lora italic leading-relaxed">
                            "{reportData.probabilities[selectedProbExplain].growthAdvice}"
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 5: AI NAME CORRECTION ENGINE (Phase 5) */}
            {activeSubTab === 'NAME_CORRECT' && activeProfile && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">AI Name Spelling Correction</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Analyze spelling compounds under traditional Chaldean standards. If your name compound reduces to a Saturn or Rahu friction node, examine variations to unlock absolute success.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left input panel */}
                  <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <form onSubmit={triggerCorrectionSearch} className="space-y-4 font-sans">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-bold text-slate-500">Test Spelling Name</label>
                        <input
                          type="text"
                          required
                          value={correctionNameInput}
                          onChange={e => setCorrectionNameInput(e.target.value)}
                          className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-[#1E3A8A] hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl tracking-wider uppercase transition cursor-pointer"
                      >
                        Recalculate spelling sum
                      </button>
                    </form>

                    {correctionResult && (
                      <div className="border-t border-slate-100 pt-4 space-y-3 font-sans">
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase tracking-wider block">Current Scorecard</span>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 bg-slate-50 rounded-xl">
                            <span className="text-[8px] text-slate-400 block uppercase">Chaldean Sum</span>
                            <strong className="text-xs text-[#1F2937]">{correctionResult.currentSum}</strong>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl">
                            <span className="text-[8px] text-slate-400 block uppercase">Root Num</span>
                            <strong className="text-xs text-[#1F2937]">{correctionResult.currentRoot}</strong>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-xl col-span-1">
                            <span className="text-[8px] text-slate-400 block">Suitability</span>
                            <strong className="text-xs text-rose-600 font-bold">58%</strong>
                          </div>
                        </div>

                        <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-1.5">
                          <span className="text-[10px] font-bold text-rose-800 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Spelling Hurdles:
                          </span>
                          {correctionResult.currentChallenges.map((c, idx) => (
                            <p key={idx} className="text-[10px] text-rose-700 leading-normal">{c}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right alternatives panel */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#F2E8DC]/40 border border-[#D97706]/15 rounded-3xl p-5">
                      <div className="flex items-center gap-2 text-[#D97706]">
                        <Award className="w-5 h-5" />
                        <h4 className="font-playfair text-base font-extrabold">Suggested Name spelling variations</h4>
                      </div>
                      <span className="text-[9px] font-mono text-amber-800 tracking-wider uppercase mt-1 block">Calculated Lucky vibrations for {activeProfile.name}</span>
                    </div>

                    {correctionResult?.suggestedVariations.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <strong className="text-sm font-semibold text-slate-900">{item.name}</strong>
                            <span className="text-[10px] text-[#6B7280] ml-2 font-mono">Total sum: {item.totalSum} (Root #{item.rootNum})</span>
                          </div>
                          
                          {/* Buy premium hook */}
                          {!premiumUnlocked && idx > 0 ? (
                            <button
                              onClick={() => handleOpenCheckout("Premium Spelling Upgrade Certification", "₹799")}
                              className="bg-amber-600/10 hover:bg-amber-600/20 text-[#D97706] text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                            >
                              <Lock className="w-3 h-3" /> Unlock Spelling suitabilities
                            </button>
                          ) : (
                            <div className="flex gap-2">
                              <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                                Biz: {item.businessSuitability}%
                              </span>
                              <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded">
                                Career: {item.careerSuitability}%
                              </span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-[#6B7280] leading-relaxed font-lora italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                          "{item.reasoning}"
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 6: SMART PERSONALIZED RECOMMENDATIONS / AUSPICIOUS ALTAR (Phase 6) */}
            {activeSubTab === 'RECOMMEND' && reportData && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Your Personalized Altar</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Auspicious daily days, dates, directions, industries, and cities vibrationally calculated for your Conductor path (Bhagyank).
                  </p>
                </div>

                {/* Grid of recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Lucky calendar dates</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reportData.recommendations.bestDates.map((d, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Fortunate weekdays</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reportData.recommendations.bestDays.map((day, idx) => (
                        <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Auspicious Colors</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reportData.recommendations.bestColours.map((col, idx) => (
                        <span key={idx} className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Vastu success Directions</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reportData.recommendations.bestDirections.map((dir, idx) => (
                        <span key={idx} className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {dir}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Profitable Industries</span>
                    <div className="space-y-1 pt-1">
                      {reportData.recommendations.bestIndustries.slice(0, 3).map((ind, idx) => (
                        <p key={idx} className="text-xs text-slate-600">• {ind}</p>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <span className="text-[9px] font-mono uppercase text-[#D97706] block font-black">Vibration-Positive Cities</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {reportData.recommendations.bestCities.map((city, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 7: LIFE TIMELINE PATH (Phase 11) */}
            {activeSubTab === 'TIMELINE' && reportData && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Numerology Lifecycle Timeline</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Every soul goes through four distinct vibrational phases. Explore the opportunities, lessons, and challenges calculated for your years.
                  </p>
                </div>

                {/* Vertical timeline steps */}
                <div className="space-y-6 relative border-l border-amber-600/20 ml-4 pl-6">
                  {Object.entries(reportData.timeline).map(([key, phase], idx) => (
                    <div key={key} className="relative space-y-2">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#D97706] border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                        {idx + 1}
                      </span>

                      <h4 className="font-playfair text-base font-bold text-slate-900">{phase.years}</h4>
                      
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-mono uppercase text-emerald-700 block font-bold">Opportunities & Direction</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{phase.opportunities}</p>
                          <p className="text-xs text-indigo-700 font-lora italic leading-relaxed pt-1">Future Course: "{phase.futureDirection}"</p>
                        </div>

                        <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                          <span className="text-[9px] font-mono uppercase text-rose-700 block font-bold">Lessons & Challenges</span>
                          <p className="text-xs text-slate-600 leading-relaxed">{phase.challenges}</p>
                          <p className="text-xs text-slate-500 pt-1">Karmic Lesson: {phase.lessons}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: PERSONAL GROWTH INDEX (Phase 12) */}
            {activeSubTab === 'GROWTH' && reportData && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Personal Growth Index</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    A comparative index tracking nine core areas of human consciousness over the current planetary year cycle.
                  </p>
                </div>

                {/* Overall big card */}
                <div className="bg-gradient-to-br from-[#1E3A8A] to-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 block font-black">Composite Growth Index</span>
                    <h3 className="font-playfair text-3xl font-bold">Your Overall Growth Rating</h3>
                    <p className="text-xs text-slate-300">Comparing current vibrational status with the previous six months.</p>
                  </div>

                  <div className="flex gap-6 items-center">
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Index</span>
                      <strong className="text-3xl font-playfair font-black text-amber-400">{reportData.growthIndex.overallScore}</strong>
                    </div>
                    <span className="text-slate-500 font-serif text-2xl">→</span>
                    <div className="text-center">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Baseline Index</span>
                      <span className="text-3xl font-playfair font-black text-slate-300">{reportData.growthIndex.overallPreviousScore}</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold">
                      +{reportData.growthIndex.overallScore - reportData.growthIndex.overallPreviousScore}% Rise
                    </span>
                  </div>
                </div>

                {/* 9 Category cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {reportData.growthIndex.items.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 font-sans">
                      <div className="flex justify-between items-center">
                        <strong className="text-xs text-[#1F2937] font-semibold">{item.category}</strong>
                        <span className="text-[10px] font-mono font-bold text-[#D97706]">{item.score}/100</span>
                      </div>

                      {/* Bar indicator */}
                      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${item.score}%` }} />
                      </div>

                      <p className="text-[11px] text-[#6B7280] font-lora italic leading-snug">
                        "{item.advice}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: EXPERT BOOKING & BUSINESS MONETIZATION (Phase 10) */}
            {activeSubTab === 'MONETIZE' && activeProfile && (
              <div className="space-y-6 animate-in fade-in duration-400 text-left">
                <div className="bg-white p-8 rounded-[40px] border border-[#E5E7EB] shadow-sm space-y-2">
                  <h3 className="font-playfair text-2.5xl font-black text-[#1F2937]">Professional Consultation Suite</h3>
                  <p className="text-xs text-[#6B7280] font-sans">
                    Book a live 1-on-1 audio/WhatsApp consultation with Grand Master Rajeev Ji, or order physical Vastu certificates.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Services section */}
                  <div className="lg:col-span-2 space-y-4">
                    {[
                      { name: "Premium Name Spelling Correction Certificate", price: "₹799", desc: "Detailed custom analysis suggesting 5 alternate letter repetitions for commercial launch." },
                      { name: "Corporate Brand & Logo Numerology Audit", price: "₹1,499", desc: "Checks company name, email strings, and logo geometry compatibility with your birth numbers." },
                      { name: "Marriage Synastry & Compatibility Certifications", price: "₹999", desc: "A 7-layer birth grid overlay report verifying domestic longevity, partner blocks, and wedding dates." },
                      { name: "Vehicle Number Plate Safety Audit", price: "₹499", desc: "Examines primary vehicle registration sum, accident indices, and recommends color remediation." }
                    ].map((srv, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <strong className="text-xs font-mono font-black uppercase text-slate-400 tracking-wider">Service Chapter #{idx + 1}</strong>
                          <h4 className="font-playfair text-base font-bold text-slate-900">{srv.name}</h4>
                          <p className="text-xs text-[#6B7280]">{srv.desc}</p>
                        </div>

                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <strong className="text-lg font-playfair font-black text-[#D97706]">{srv.price}</strong>
                          <button
                            onClick={() => handleOpenCheckout(srv.name, srv.price)}
                            className="bg-[#D97706] hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-[10px] tracking-wider uppercase transition cursor-pointer"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Booking form section */}
                  <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 font-sans">
                    <span className="text-[10px] font-mono uppercase text-[#D97706] block font-black">Live 1-on-1 Consultation</span>
                    <h4 className="font-playfair text-lg font-extrabold text-slate-900 mt-0">Schedule Phone Call</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Connect directly via phone call or WhatsApp audio session with Rajiv Ji. Receive personalized remediation steps.
                    </p>

                    {bookingSuccess ? (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl">
                        ✓ Booking slot requested! Rajiv Ji's office secretary will reach out on your mobile number ({activeProfile.mobile}) within two hours to confirm the WhatsApp coordinate.
                      </div>
                    ) : (
                      <form onSubmit={handleBookingSubmit} className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Date of consultation</label>
                          <input
                            type="date"
                            required
                            value={bookingDate}
                            onChange={e => setBookingDate(e.target.value)}
                            className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-bold text-slate-400 block">Time Slot</label>
                          <select
                            required
                            value={bookingTime}
                            onChange={e => setBookingTime(e.target.value)}
                            className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                          >
                            <option value="">Select slot...</option>
                            <option value="11:00 AM">11:00 AM - 11:30 AM</option>
                            <option value="2:00 PM">02:00 PM - 02:30 PM</option>
                            <option value="5:00 PM">05:00 PM - 05:30 PM</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#1E3A8A] hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl tracking-wider uppercase transition cursor-pointer"
                        >
                          Book WhatsApp Call
                        </button>
                      </form>
                    )}

                    <div className="border-t border-slate-100 pt-4 text-center">
                      <a
                        href={`https://wa.me/919930117696?text=Hi%20Rajeev%20Ji,%20I%20completed%20my%20AI%20Numerology%20Consultation%20and%20want%20to%20book%20a%20Premium%20Name%20Correction%20audit%20for%20${activeProfile.name}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white text-[10px] font-bold py-2.5 px-4 rounded-xl inline-flex items-center gap-1.5 transition uppercase tracking-wider"
                      >
                        <Phone className="w-3.5 h-3.5" /> Fast WhatsApp Connect
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* PAYMENT SIMULATOR MODAL (Phase 10) */}
      {showPaymentModal && checkoutProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans text-left">
          <div className="bg-white rounded-[40px] border border-slate-100 max-w-md w-full p-8 shadow-xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h4 className="font-playfair text-xl font-bold text-slate-900">Astrological Checkout</h4>
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Secured checkout tunnel</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-black">Purchasing Chapter</span>
              <p className="text-xs font-semibold text-slate-800">{checkoutProduct.name}</p>
              <strong className="text-xl font-playfair font-black text-[#D97706] block pt-2">{checkoutProduct.price}</strong>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Provide Payment Coordinates</span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                />
                <input
                  type="text"
                  placeholder="16-Digit Card Number"
                  className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full bg-[#FDFCF7] border border-[#E5E7EB] rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#D97706]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCompletePayment}
              className="w-full bg-[#D97706] hover:bg-amber-700 text-white font-bold py-4 rounded-2xl text-xs tracking-widest uppercase transition shadow-md cursor-pointer"
            >
              Verify & Authorize Transaction
            </button>

            <span className="text-[9px] text-slate-400 text-center block font-mono">
              🔒 256-Bit SSL Encryption • Instant Planetary Activation
            </span>
          </div>
        </div>
      )}

    </div>
  );
}

// Sub-renderers for clean structure
function renderPlanetaryStrengthsHTML(analysis: any) {
  const planets = [
    { num: 1, name: "Sun (सूर्य)" },
    { num: 2, name: "Moon (चन्द्र)" },
    { num: 3, name: "Jupiter (गुरु)" },
    { num: 4, name: "Rahu (राहू)" },
    { num: 5, name: "Mercury (बुध)" },
    { num: 6, name: "Venus (शुक्र)" },
    { num: 7, name: "Ketu (केतु)" },
    { num: 8, name: "Saturn (शनि)" },
    { num: 9, name: "Mars (मंगल)" }
  ];

  let html = '<div style="display: flex; flex-direction: column; gap: 4px;">';
  planets.forEach(p => {
    const box = analysis.loshuGrid[p.num];
    const count = box ? box.count : 0;
    let strength = 20; // baseline
    if (count > 0) strength += Math.min(count, 3) * 20;
    if (analysis.mulank === p.num) strength += 10;
    if (analysis.bhagyank === p.num) strength += 10;
    strength = Math.min(strength, 100);

    const barCol = p.num === 1 ? '#F59E0B' : p.num === 2 ? '#3B82F6' : p.num === 3 ? '#10B981' : p.num === 8 ? '#6B7280' : '#EF4444';

    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 9px; line-height: 1;">
        <span style="font-weight: bold; width: 100px; color: #374151;">Digit #${p.num} - ${p.name}</span>
        <div style="flex: 1; height: 5px; background-color: #F3F4F6; rounded-full: 4px; overflow: hidden; margin: 0 10px;">
          <div style="height: 100%; width: ${strength}%; background-color: ${barCol};"></div>
        </div>
        <span style="font-weight: bold; width: 30px; text-align: right; color: #111827;">${strength}%</span>
      </div>
    `;
  });
  html += '</div>';
  return html;
}
