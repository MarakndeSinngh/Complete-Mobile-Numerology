import React, { useState } from 'react';
import { AddendumConsultationDossier, ConsultationSection } from '../core/addendumConsultationModel';
import {
  Sparkles,
  User,
  Compass,
  Layers,
  Award,
  Phone,
  FileText,
  Activity,
  Shield,
  Home,
  Heart,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle
} from 'lucide-react';

interface AddendumConsultationSectionsProps {
  dossier: AddendumConsultationDossier;
  isAdmin?: boolean;
}

export const AddendumConsultationSections: React.FC<AddendumConsultationSectionsProps> = ({
  dossier,
  isAdmin = false
}) => {
  const isHi = dossier.language === 'hi';

  // Sections 7-16 expandable state for on-screen view
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    nameMobile: true,
    remediesVastu: true,
    spiritualForecast: true
  });

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Icon mapping for sections
  const getSectionIcon = (num: number) => {
    switch (num) {
      case 1: return <User className="w-5 h-5 text-amber-600" />;
      case 2: return <Award className="w-5 h-5 text-amber-600" />;
      case 3: return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 4: return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 5: return <Info className="w-5 h-5 text-blue-600" />;
      case 6: return <Compass className="w-5 h-5 text-indigo-600" />;
      case 7: return <FileText className="w-5 h-5 text-purple-600" />;
      case 8: return <Phone className="w-5 h-5 text-emerald-600" />;
      case 9: return <Layers className="w-5 h-5 text-amber-600" />;
      case 10: return <Activity className="w-5 h-5 text-rose-600" />;
      case 11: return <Shield className="w-5 h-5 text-teal-600" />;
      case 12: return <FileText className="w-5 h-5 text-blue-600" />;
      case 13: return <Home className="w-5 h-5 text-amber-700" />;
      case 14: return <Heart className="w-5 h-5 text-pink-600" />;
      case 15: return <Calendar className="w-5 h-5 text-blue-700" />;
      case 16: return <Sparkles className="w-5 h-5 text-amber-600" />;
      default: return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  // Helper to render markdown bold (**text**) safely into JSX
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+?\*\*)/g);
    return (
      <span>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-bold text-slate-900 dark:text-amber-300">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  const renderSectionCard = (sec: ConsultationSection) => {
    return (
      <div
        key={sec.id}
        id={sec.id}
        className="consultation-section-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-5 shadow-sm break-inside-avoid print:shadow-none print:border-slate-300"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <div className="p-2 bg-amber-50 dark:bg-slate-800 rounded-lg">
            {getSectionIcon(sec.sectionNumber)}
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {isHi ? `अनुभाग ${sec.sectionNumber.toString().padStart(2, '0')}` : `Section ${sec.sectionNumber.toString().padStart(2, '0')}`}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {sec.title}
            </h3>
          </div>
        </div>

        {/* Input Needed Notice if invalid */}
        {!sec.hasValidInput ? (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{sec.missingNotice || (isHi ? 'इस अनुभाग के लिए इनपुट आवश्यक है।' : 'Input needed for this section.')}</span>
          </div>
        ) : (
          <div>
            {/* Intro text if present */}
            {sec.intro && (
              <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border-l-4 border-amber-500 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                {sec.intro.split('\n').map((line, idx) => (
                  <p key={idx} className={idx > 0 ? 'mt-1' : ''}>
                    {renderFormattedText(line)}
                  </p>
                ))}
              </div>
            )}

            {/* Bullets List */}
            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="space-y-2 mb-4">
                {sec.bullets.map((b, bIdx) => (
                  <li
                    key={bIdx}
                    className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    <span>{renderFormattedText(b.text)}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Special Section Metadata / Tables */}
            {sec.meta?.defectTable && (
              <div className="overflow-x-auto my-3">
                <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-lg">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-2 border-b">{isHi ? 'दिशा' : 'Direction'}</th>
                      <th className="p-2 border-b">{isHi ? 'तत्व' : 'Element'}</th>
                      <th className="p-2 border-b">{isHi ? 'वास्तु दोष / स्थिति' : 'Vastu Flaw'}</th>
                      <th className="p-2 border-b">{isHi ? 'संभावित प्रभाव' : 'Potential Impact'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sec.meta.defectTable.map((row: any, rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2 font-medium">{row.dirHi}</td>
                        <td className="p-2">{row.elemHi}</td>
                        <td className="p-2 text-rose-600 dark:text-rose-400">{row.flawHi}</td>
                        <td className="p-2 text-slate-600 dark:text-slate-300">{row.impactHi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Admin only notice for unregistered rules */}
            {isAdmin && sec.meta?.adminNotice && (
              <div className="my-2 p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-200 font-mono">
                [व्यवस्थापक सूचना: {sec.meta.adminNotice}]
              </div>
            )}
          </div>
        )}

        {/* Section Single Footer Disclaimer */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 italic">
          {sec.footerDisclaimer}
        </div>
      </div>
    );
  };

  const sections1to6 = dossier.sections.slice(0, 6);
  const sections7to9 = dossier.sections.slice(6, 9);
  const sections10to13 = dossier.sections.slice(9, 13);
  const sections14to16 = dossier.sections.slice(13, 16);

  return (
    <div className="addendum-consultation-dossier w-full">
      {/* Sections 1 to 6: Core Consultation Summary (Always Open) */}
      <div className="core-sections-block mb-6">
        {sections1to6.map(renderSectionCard)}
      </div>

      {/* Sections 7 to 9: Name, Mobile & Auspicious Elements (Expandable on screen, Always fully rendered in print) */}
      <div className="expandable-group-1 mb-6">
        <button
          type="button"
          onClick={() => toggleGroup('nameMobile')}
          className="screen-only no-print w-full flex items-center justify-between p-4 mb-4 bg-amber-50/80 dark:bg-slate-800/80 hover:bg-amber-100 dark:hover:bg-slate-800 rounded-xl border border-amber-200/60 dark:border-slate-700 text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                {isHi ? 'विस्तृत विश्लेषण: नाम, मोबाइल व अनुकूल तत्व (अनुभाग 07–09)' : 'Detailed Analysis: Name, Mobile & Lucky Elements (Sec 07–09)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? 'नाम संतुलन, 10-अंकीय मोबाइल ऑडिट, शुभ रंग, दिन, तारीख व कार्यक्षेत्र' : 'Name vibration, 10-digit mobile audit, lucky colours, dates, and professions'}
              </p>
            </div>
          </div>
          {expandedGroups.nameMobile ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        <div className={`${expandedGroups.nameMobile ? 'block' : 'hidden'} print:block`}>
          {sections7to9.map(renderSectionCard)}
        </div>
      </div>

      {/* Sections 10 to 13: Health, Remedies, Bank & Vastu (Expandable on screen, Always fully rendered in print) */}
      <div className="expandable-group-2 mb-6">
        <button
          type="button"
          onClick={() => toggleGroup('remediesVastu')}
          className="screen-only no-print w-full flex items-center justify-between p-4 mb-4 bg-teal-50/80 dark:bg-slate-800/80 hover:bg-teal-100 dark:hover:bg-slate-800 rounded-xl border border-teal-200/60 dark:border-slate-700 text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 text-white rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                {isHi ? 'स्वास्थ्य, व्यक्तिगत उपाय, बैंक खाता व न्यूमरो वास्तु (अनुभाग 10–13)' : 'Health, Remedies, Bank & Numero Vastu (Sec 10–13)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? 'सेहत के संकेत, 5-5 ठोस उपाय, खाता/ईमेल संतुलन और दिशात्मक वास्तु तालिका' : 'Wellness indications, 5 concrete remedies each, bank guidance, and Vastu defect matrix'}
              </p>
            </div>
          </div>
          {expandedGroups.remediesVastu ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        <div className={`${expandedGroups.remediesVastu ? 'block' : 'hidden'} print:block`}>
          {sections10to13.map(renderSectionCard)}
        </div>
      </div>

      {/* Sections 14 to 16: Yoga, Year Predictions & Closing Note (Expandable on screen, Always fully rendered in print) */}
      <div className="expandable-group-3 mb-6">
        <button
          type="button"
          onClick={() => toggleGroup('spiritualForecast')}
          className="screen-only no-print w-full flex items-center justify-between p-4 mb-4 bg-purple-50/80 dark:bg-slate-800/80 hover:bg-purple-100 dark:hover:bg-slate-800 rounded-xl border border-purple-200/60 dark:border-slate-700 text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 text-white rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                {isHi ? 'योग, प्रार्थना, वर्ष फल व परामर्श पाथेय (अनुभाग 14–16)' : 'Yoga, Prayer, Year Forecast & Closing Note (Sec 14–16)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? 'हो\'ओपोनोपोनो प्रार्थना, व्यक्तिगत वर्ष फल और परामर्शक का समापन संदेश' : 'Ho\'oponopono prayer, personal year forecast, and consultant closing blessings'}
              </p>
            </div>
          </div>
          {expandedGroups.spiritualForecast ? (
            <ChevronUp className="w-5 h-5 text-slate-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500" />
          )}
        </button>

        <div className={`${expandedGroups.spiritualForecast ? 'block' : 'hidden'} print:block`}>
          {sections14to16.map(renderSectionCard)}
        </div>
      </div>
    </div>
  );
};
