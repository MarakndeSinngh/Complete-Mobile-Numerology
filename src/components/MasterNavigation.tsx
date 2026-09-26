import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Phone, User, Heart, Briefcase, FileText, Sparkles, 
  Home, Car, Activity, Shield, Calendar, Baby, PenTool, 
  ChevronDown, Search, Menu, X, Star, Layers, CheckCircle2, Award, Globe
} from 'lucide-react';
import { useLanguage, LanguageSelector } from '../i18n';
import { BrandLogo } from './BrandLogo';

export type NavPortalId = 
  | 'HOME'
  | 'CORE_LOSHU'
  | 'CORE_DASHBOARD'
  | 'MOBILE_NUMEROLOGY'
  | 'NAME_NUMEROLOGY'
  | 'MARRIAGE_COMPATIBILITY'
  | 'PREMIUM_VEHICLE'
  | 'PREMIUM_HOUSE'
  | 'PREMIUM_BUSINESS'
  | 'PREMIUM_SIGNATURE'
  | 'PREMIUM_CHILD'
  | 'PREMIUM_LUCKY_DATES'
  | 'PREMIUM_MEDICAL'
  | 'PREMIUM_VAASTU'
  | 'PREMIUM_DASHA'
  | 'AI_CONSULTATION'
  | 'MASTER_REPORT'
  | 'MY_REPORTS';

export interface NavCategory {
  id: string;
  i18nKey: string;
  titleHi: string;
  titleEn: string;
  icon: React.ReactNode;
  items: {
    portalId: NavPortalId;
    i18nKey: string;
    descI18nKey?: string;
    titleHi: string;
    titleEn: string;
    descHi: string;
    descEn: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    id: 'core',
    i18nKey: 'nav.coreCategory',
    titleHi: 'कोर अंकशास्त्र',
    titleEn: 'Core Numerology',
    icon: <Compass className="w-4 h-4 text-amber-600" />,
    items: [
      {
        portalId: 'CORE_LOSHU',
        i18nKey: 'nav.coreLoshu',
        descI18nKey: 'nav.coreLoshuDesc',
        titleHi: 'लो शू ग्रिड व 8 योग',
        titleEn: 'Lo Shu Grid & Planes',
        descHi: '3x3 वैदिक जन्म चक्र एवं 8 सफलता योग',
        descEn: '3x3 Vedic Kundali & 8 planes of strength',
        icon: <Compass className="w-4 h-4 text-amber-500" />,
        badge: 'Core'
      },
      {
        portalId: 'CORE_DASHBOARD',
        i18nKey: 'nav.coreDashboard',
        descI18nKey: 'nav.coreDashboardDesc',
        titleHi: 'मूलांक, भाग्यांक व 81 युति',
        titleEn: 'Mulank, Bhagyank & 81 Combos',
        descHi: 'ड्राइवर व कंडक्टर संख्या तथा ग्रहीय तालमेल',
        descEn: 'Driver & Conductor dynamic matrix',
        icon: <Layers className="w-4 h-4 text-indigo-500" />
      },
      {
        portalId: 'PREMIUM_DASHA',
        i18nKey: 'nav.dashaNumerology',
        descI18nKey: 'nav.dashaNumerologyDesc',
        titleHi: 'महादशा, अंतर्दशा व वर्ष फल',
        titleEn: 'Mahadasha & Personal Year',
        descHi: 'सक्रिय ग्रह कालखंड एवं 9 वर्षीय चक्र',
        descEn: 'Planetary periods & 9-year cyclic forecast',
        icon: <Calendar className="w-4 h-4 text-blue-500" />
      }
    ]
  },
  {
    id: 'personal',
    i18nKey: 'nav.personalCategory',
    titleHi: 'व्यक्तिगत विश्लेषण',
    titleEn: 'Personal Analysis',
    icon: <User className="w-4 h-4 text-emerald-600" />,
    items: [
      {
        portalId: 'MOBILE_NUMEROLOGY',
        i18nKey: 'nav.mobileScanner',
        descI18nKey: 'nav.mobileScannerDesc',
        titleHi: 'मोबाइल अंकशास्त्र स्कैनर',
        titleEn: 'Mobile Scanner Pro',
        descHi: '10-अंकीय फोन नंबर की चालडीयन व ग्रहीय तरंगे',
        descEn: 'Chaldean mobile frequencies & yogas',
        icon: <Phone className="w-4 h-4 text-emerald-500" />,
        badge: 'Popular'
      },
      {
        portalId: 'NAME_NUMEROLOGY',
        i18nKey: 'nav.nameNumerology',
        descI18nKey: 'nav.nameNumerologyDesc',
        titleHi: 'नाम अंकशास्त्र व स्पेलिंग शुद्धि',
        titleEn: 'Name Numerology Suite',
        descHi: 'चालडीयन व पाइथागोरियन नाम संशोधन',
        descEn: 'Chaldean & Pythagorean name balance',
        icon: <User className="w-4 h-4 text-teal-500" />
      },
      {
        portalId: 'PREMIUM_SIGNATURE',
        i18nKey: 'nav.signatureAudit',
        descI18nKey: 'nav.signatureAuditDesc',
        titleHi: 'हस्ताक्षर विश्लेषण प्रो',
        titleEn: 'Signature Audit Pro',
        descHi: 'धन रक्षक ढाल व प्रोग्रेसिव स्ट्रोक्स',
        descEn: 'Graphology vastu & financial shielding',
        icon: <PenTool className="w-4 h-4 text-purple-500" />
      },
      {
        portalId: 'PREMIUM_MEDICAL',
        i18nKey: 'nav.medicalNumerology',
        descI18nKey: 'nav.medicalNumerologyDesc',
        titleHi: 'मेडिकल न्यूमरोलॉजी (स्वास्थ्य योग)',
        titleEn: 'Medical Health Vulnerabilities',
        descHi: 'जन्म कुंडली आधारित शारीरिक व मानसिक संवेदनशीलता',
        descEn: 'Planetary dosha & health vulnerabilities',
        icon: <Activity className="w-4 h-4 text-rose-500" />
      }
    ]
  },
  {
    id: 'life_home',
    i18nKey: 'nav.lifeHomeCategory',
    titleHi: 'जीवन एवं वास्तु',
    titleEn: 'Life & Home',
    icon: <Home className="w-4 h-4 text-cyan-600" />,
    items: [
      {
        portalId: 'PREMIUM_VAASTU',
        i18nKey: 'nav.numeroVastu',
        descI18nKey: 'nav.numeroVastuDesc',
        titleHi: 'न्यूमरो वास्तु एवं 16 दिशाएं',
        titleEn: 'Numero Vastu & Directions',
        descHi: 'दिशा तत्व, कुआ अंक एवं मुख्य द्वार संतुलन',
        descEn: '16 directional balance & Kua grid',
        icon: <Home className="w-4 h-4 text-cyan-500" />
      },
      {
        portalId: 'PREMIUM_VEHICLE',
        i18nKey: 'nav.vehicleNumerology',
        descI18nKey: 'nav.vehicleNumerologyDesc',
        titleHi: 'वाहन अंकशास्त्र प्रो',
        titleEn: 'Vehicle Numerology Pro',
        descHi: 'नंबर प्लेट कंपन, सुरक्षा व दुर्घटना जोखिम',
        descEn: 'License plate vibration & safety risks',
        icon: <Car className="w-4 h-4 text-blue-600" />
      },
      {
        portalId: 'PREMIUM_HOUSE',
        i18nKey: 'nav.houseNumerology',
        descI18nKey: 'nav.houseNumerologyDesc',
        titleHi: 'मकान व फ्लैट अंकशास्त्र',
        titleEn: 'House & Flat Numerology',
        descHi: 'आवासीय भवन ऊर्जा व पारिवारिक सुख-शांति',
        descEn: 'Living space harmony & energy vibration',
        icon: <Shield className="w-4 h-4 text-amber-600" />
      }
    ]
  },
  {
    id: 'business',
    i18nKey: 'nav.businessCategory',
    titleHi: 'व्यापार एवं निर्णय',
    titleEn: 'Business & Decisions',
    icon: <Briefcase className="w-4 h-4 text-violet-600" />,
    items: [
      {
        portalId: 'PREMIUM_BUSINESS',
        i18nKey: 'nav.businessNumerology',
        descI18nKey: 'nav.businessNumerologyDesc',
        titleHi: 'व्यापारिक व ब्रांड अंकशास्त्र',
        titleEn: 'Business & Corporate Pro',
        descHi: 'कंपनी नाम, पार्टनरशिप सामंजस्य व लोगो रंग',
        descEn: 'Brand spelling, partnership & logo vibration',
        icon: <Briefcase className="w-4 h-4 text-violet-500" />
      },
      {
        portalId: 'PREMIUM_LUCKY_DATES',
        i18nKey: 'nav.luckyDatesFinder',
        descI18nKey: 'nav.luckyDatesFinderDesc',
        titleHi: 'शुभ तिथियां व मुहूर्त खोजक',
        titleEn: 'Lucky Dates Finder Pro',
        descHi: 'व्यापार, यात्रा, विवाह व निवेश हेतु शुभ तिथियां',
        descEn: 'Auspicious dates for life milestones',
        icon: <Calendar className="w-4 h-4 text-emerald-500" />,
        badge: 'Pro'
      },
      {
        portalId: 'PREMIUM_CHILD',
        i18nKey: 'nav.childLuckyNames',
        descI18nKey: 'nav.childLuckyNamesDesc',
        titleHi: 'नवजात शिशु शुभ नामाक्षर',
        titleEn: 'Child Lucky Names Pro',
        descHi: 'ग्रह अनुकूल शुभ प्रथम अक्षर व नाम सुझाव',
        descEn: 'Planetary starting letters & wisdom names',
        icon: <Baby className="w-4 h-4 text-pink-500" />
      }
    ]
  },
  {
    id: 'marriage',
    i18nKey: 'nav.compatibilityCategory',
    titleHi: 'विवाह एवं अनुकूलता',
    titleEn: 'Marriage Synastry',
    icon: <Heart className="w-4 h-4 text-rose-600" />,
    items: [
      {
        portalId: 'MARRIAGE_COMPATIBILITY',
        i18nKey: 'nav.marriageCompatibility',
        descI18nKey: 'nav.marriageCompatibilityDesc',
        titleHi: 'विवाह गुण मिलान व 7-लेयर सिनैस्ट्री',
        titleEn: 'Marriage Compatibility Pro',
        descHi: 'मूलांक, भाग्यांक व लो शू ग्रिड आधारित दांपत्य मिलान',
        descEn: '7-layer Vedic synastry & emotional harmony',
        icon: <Heart className="w-4 h-4 text-rose-500" />,
        badge: 'Vedic'
      }
    ]
  }
];

interface MasterNavigationProps {
  currentPortalId: NavPortalId;
  onSelectPortal: (portalId: NavPortalId) => void;
}

export const MasterNavigation: React.FC<MasterNavigationProps> = ({
  currentPortalId,
  onSelectPortal,
}) => {
  const { t } = useLanguage();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter tools for search
  const allTools = NAV_CATEGORIES.flatMap(cat => cat.items);
  const filteredTools = searchQuery.trim() === '' ? [] : allTools.filter(item => {
    const titleLoc = t(item.i18nKey);
    const descLoc = item.descI18nKey ? t(item.descI18nKey) : item.descHi;
    return (
      titleLoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descLoc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descEn.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handlePortalSelect = (id: NavPortalId) => {
    onSelectPortal(id);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={navRef} className="relative z-40 mb-6 font-sans print:hidden">
      {/* Desktop Main Category Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-3xl p-1.5 shadow-sm flex items-center justify-between gap-1 flex-wrap lg:flex-nowrap">
        
        {/* Home Button */}
        <button
          onClick={() => handlePortalSelect('HOME')}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer ${
            currentPortalId === 'HOME'
              ? 'bg-[#1E3A8A] text-white shadow-xs'
              : 'text-gray-700 hover:text-[#1E3A8A] hover:bg-gray-50'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>{t('nav.home')}</span>
        </button>

        {/* Category Dropdown Triggers */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {NAV_CATEGORIES.map((category) => {
            const isCategoryActive = category.items.some(item => item.portalId === currentPortalId);
            const isOpen = openDropdown === category.id;
            const catTitle = t(category.i18nKey);

            return (
              <div key={category.id} className="relative">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : category.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${
                    isCategoryActive
                      ? 'bg-amber-50 text-[#D97706] border border-amber-200'
                      : isOpen
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  <span>{catTitle}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D97706]' : 'text-gray-400'}`} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">
                      {catTitle}
                    </div>
                    {category.items.map((item) => {
                      const itemTitle = t(item.i18nKey);
                      const itemDesc = item.descI18nKey ? t(item.descI18nKey) : item.descHi;
                      return (
                        <button
                          key={item.portalId}
                          onClick={() => handlePortalSelect(item.portalId)}
                          className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 cursor-pointer ${
                            currentPortalId === item.portalId
                              ? 'bg-[#D97706]/10 text-[#D97706] font-bold'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-gray-100 mt-0.5">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-semibold truncate">{itemTitle}</span>
                              {item.badge && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-500 block truncate">{itemDesc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Master Report Button, Consultation Hub Button & Search */}
        <div className="flex items-center gap-1">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition cursor-pointer"
            title={t('common.searchTools')}
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => handlePortalSelect('MY_REPORTS')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
              currentPortalId === 'MY_REPORTS'
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-amber-100/60 text-amber-900 hover:bg-amber-100 border border-amber-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">{t('nav.myReports') || 'मेरे रिपोर्ट्स'}</span>
            <span className="sm:hidden">Reports</span>
          </button>

          <button
            onClick={() => handlePortalSelect('MASTER_REPORT')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
              currentPortalId === 'MASTER_REPORT'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('nav.masterReport')}</span>
          </button>

          <button
            onClick={() => handlePortalSelect('AI_CONSULTATION')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
              currentPortalId === 'AI_CONSULTATION'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'bg-[#D97706]/10 text-[#D97706] hover:bg-[#D97706]/20 border border-[#D97706]/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('nav.aiConsultation')}</span>
            <span className="sm:hidden">{t('common.explore')}</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Quick Search Modal / Floating Input */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E5E7EB] p-3 z-50 animate-in fade-in duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder={t('common.searchTools')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:border-[#D97706] outline-none"
            />
          </div>

          {searchQuery.trim() !== '' && (
            <div className="mt-2 max-h-60 overflow-y-auto space-y-1 divide-y divide-gray-50">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const titleLoc = t(tool.i18nKey);
                  const descLoc = tool.descI18nKey ? t(tool.descI18nKey) : tool.descHi;
                  return (
                    <button
                      key={tool.portalId}
                      onClick={() => handlePortalSelect(tool.portalId)}
                      className="w-full text-left p-2 hover:bg-amber-50/60 rounded-lg flex items-center justify-between text-xs transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {tool.icon}
                        <div>
                          <span className="font-bold text-gray-800 block">{titleLoc}</span>
                          <span className="text-[10px] text-gray-500">{descLoc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-[#D97706] font-bold">{t('common.explore')} →</span>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  {t('common.error')}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] p-4 max-h-[80vh] overflow-y-auto space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b pb-2.5">
            <BrandLogo size="sm" showText={true} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Language Selector inside menu */}
          <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
              🌐 {t('common.language')}
            </span>
            <LanguageSelector variant="pills" />
          </div>

          {NAV_CATEGORIES.map((category) => (
            <div key={category.id} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
                {category.icon}
                <span>{t(category.i18nKey)}</span>
              </div>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {category.items.map((item) => (
                  <button
                    key={item.portalId}
                    onClick={() => handlePortalSelect(item.portalId)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer ${
                      currentPortalId === item.portalId
                        ? 'bg-[#D97706]/10 text-[#D97706] font-bold'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{t(item.i18nKey)}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t space-y-2">
            <button
              onClick={() => handlePortalSelect('MY_REPORTS')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-200" />
              <span>{t('nav.myReports') || 'मेरे रिपोर्ट्स (My Reports)'}</span>
            </button>

            <button
              onClick={() => handlePortalSelect('MASTER_REPORT')}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>{t('nav.masterReport')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
