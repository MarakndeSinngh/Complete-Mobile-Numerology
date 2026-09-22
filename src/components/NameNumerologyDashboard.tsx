import React, { useState } from 'react';
import {
  ComprehensiveNameAnalysis,
  analyzeComprehensiveName,
  CHALDEAN_MAP,
  PYTHAGOREAN_MAP
} from '../core/nameNumerologyEngine';
import {
  Sparkles,
  User,
  Heart,
  Shield,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Briefcase,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Volume2,
  RefreshCw,
  Award,
  Zap,
  Globe
} from 'lucide-react';

interface NameNumerologyDashboardProps {
  nameAnalysis: ComprehensiveNameAnalysis;
  mulank: number;
  bhagyank: number;
  mobile?: string;
  dob?: string;
}

export const NameNumerologyDashboard: React.FC<NameNumerologyDashboardProps> = ({
  nameAnalysis: initialData,
  mulank,
  bhagyank,
  mobile,
  dob
}) => {
  const [activeTab, setActiveTab] = useState<'chaldean' | 'pythagorean' | 'correction' | 'pronology' | 'comparison'>('chaldean');
  const [testSpelling, setTestSpelling] = useState(initialData.fullName);
  const [testAnalysis, setTestAnalysis] = useState<ComprehensiveNameAnalysis>(initialData);

  const handleTestSpellingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTestSpelling(val);
    const calculated = analyzeComprehensiveName({
      name: val,
      dob,
      mulank,
      bhagyank,
      mobile
    });
    setTestAnalysis(calculated);
  };

  const data = initialData;
  const chaldean = data.chaldean;
  const pythagorean = data.pythagorean;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-8 -translate-y-8 pointer-events-none">
          <Sparkles className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LEOFAMILY PHASE 5 • MASTER NAME NUMEROLOGY</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif">
              नाम अंक ज्योतिष एवं ध्वनिशास्त्र (Name Numerology)
            </h2>
            <p className="text-amber-100 text-sm mt-1 max-w-2xl">
              वैदिक-चालडियन (Chaldean Phonetics 1–8) एवं पश्चिमी पाइथागोरियन (Pythagorean 1–9) की स्वतंत्र व वैज्ञानिक गणना।
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
            <div className="text-center px-2">
              <span className="text-xs uppercase tracking-wider block text-amber-200">Chaldean Root</span>
              <span className="text-2xl font-bold">{chaldean.rootNumber}</span>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div className="text-center px-2">
              <span className="text-xs uppercase tracking-wider block text-amber-200">Compound</span>
              <span className="text-2xl font-bold">{chaldean.compoundNumber}</span>
            </div>
            <div className="h-8 w-px bg-white/30" />
            <div className="text-center px-2">
              <span className="text-xs uppercase tracking-wider block text-amber-200">Pythagorean</span>
              <span className="text-2xl font-bold">{pythagorean.rootNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-amber-200/80 pb-2">
        <button
          onClick={() => setActiveTab('chaldean')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'chaldean'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>चालडियन नाम विश्लेषण (Chaldean)</span>
        </button>

        <button
          onClick={() => setActiveTab('correction')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'correction'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>नाम सुधार टूल (Correction)</span>
        </button>

        <button
          onClick={() => setActiveTab('pronology')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'pronology'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>ध्वनिशास्त्र (Pronology & Sounds)</span>
        </button>

        <button
          onClick={() => setActiveTab('pythagorean')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'pythagorean'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>पाइथागोरियन (Pythagorean 1-9)</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'comparison'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>तुलनात्मक अध्ययन (Comparison)</span>
        </button>
      </div>

      {/* TAB 1: CHALDEAN PRIMARY ANALYSIS */}
      {activeTab === 'chaldean' && (
        <div className="space-y-6">
          {/* Key Numbers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm text-center">
              <span className="text-xs font-bold text-amber-700 uppercase block">Chaldean Total</span>
              <span className="text-2xl font-bold text-gray-900 mt-1 block">{chaldean.compoundNumber}</span>
              <span className="text-[11px] text-gray-500 block mt-0.5">Compound No.</span>
            </div>

            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 shadow-sm text-center">
              <span className="text-xs font-bold text-amber-900 uppercase block">Root Number</span>
              <span className="text-2xl font-bold text-amber-700 mt-1 block"># {chaldean.rootNumber}</span>
              <span className="text-[11px] text-amber-800 block mt-0.5">मूल अंक (Single)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm text-center">
              <span className="text-xs font-bold text-blue-700 uppercase block">Talent Number</span>
              <span className="text-2xl font-bold text-blue-900 mt-1 block"># {data.talent.number}</span>
              <span className="text-[11px] text-blue-600 block mt-0.5">मूलांक + नाम योग</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm text-center">
              <span className="text-xs font-bold text-rose-700 uppercase block">Heart / Soul</span>
              <span className="text-2xl font-bold text-rose-900 mt-1 block"># {data.heart.number}</span>
              <span className="text-[11px] text-rose-600 block mt-0.5">स्वरों का योग (Vowels)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm text-center">
              <span className="text-xs font-bold text-emerald-700 uppercase block">Personality</span>
              <span className="text-2xl font-bold text-emerald-900 mt-1 block"># {data.personality.number}</span>
              <span className="text-[11px] text-emerald-600 block mt-0.5">व्यंजन योग (Consonants)</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm text-center">
              <span className="text-xs font-bold text-purple-700 uppercase block">Habit Number</span>
              <span className="text-2xl font-bold text-purple-900 mt-1 block"># {data.habit.number}</span>
              <span className="text-[11px] text-purple-600 block mt-0.5">अक्षरों की कुल संख्या</span>
            </div>
          </div>

          {/* Compound Title & Interpretation */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                {chaldean.compoundNumber}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">{chaldean.compoundTitle}</h3>
                <span className="text-xs text-amber-700 font-medium">कंपाउंड अंक {chaldean.compoundNumber} का गूढ़ वैदिक व चालडियन प्रभाव</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              {chaldean.compoundInterpretationHi}
            </p>
          </div>

          {/* Letter by Letter Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>नाम के प्रत्येक अक्षर का चालडियन मान (Letter-by-Letter Values)</span>
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {chaldean.nameBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border min-w-[54px] ${
                    item.isVowel
                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                      : 'bg-amber-50/60 border-amber-200 text-gray-900'
                  }`}
                >
                  <span className="text-lg font-bold">{item.letter}</span>
                  <span className="text-sm font-semibold text-amber-700">{item.chaldeanValue}</span>
                  <span className="text-[9px] uppercase tracking-tighter opacity-70 mt-0.5">
                    {item.isVowel ? 'Vowel' : 'Cons'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-rose-200 inline-block" /> स्वर (Vowel - Inner Desire)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-amber-200 inline-block" /> व्यंजन (Consonant - Outer Impression)
              </span>
            </div>
          </div>

          {/* First Letter Profile (आद्य अक्षर प्रभाव) */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center text-3xl font-bold font-serif shadow-md shrink-0">
                {data.firstLetter.letter}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    प्रथम अक्षर प्रभाव: अक्षर '{data.firstLetter.letter}' ({data.firstLetter.planet})
                  </h3>
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                    मान: {data.firstLetter.chaldeanValue} • {data.firstLetter.element}
                  </span>
                </div>
                <p className="text-xs text-amber-800 font-medium mt-0.5">{data.firstLetter.traditionalMeaning}</p>
                
                <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <strong className="text-gray-900 block mb-1">व्यक्तित्व पर प्रभाव:</strong>
                    <p className="text-gray-600 leading-relaxed">{data.firstLetter.personalityInfluenceHi}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <strong className="text-gray-900 block mb-1">संवाद एवं वाणी:</strong>
                    <p className="text-gray-600 leading-relaxed">{data.firstLetter.communicationInfluenceHi}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <strong className="text-gray-900 block mb-1">करियर एवं कार्यक्षेत्र:</strong>
                    <p className="text-gray-600 leading-relaxed">{data.firstLetter.careerInfluenceHi}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vowels & Consonants Double Card */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Vowels Card */}
            <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  <h4 className="font-bold text-gray-900">Heart / Soul Number (हृदय अंक)</h4>
                </div>
                <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold text-xs">
                  Root # {data.vowels.chaldeanRoot}
                </span>
              </div>
              <p className="text-xs text-gray-500 italic mb-3">"{data.vowels.standardExplanation}"</p>
              <div className="text-xs space-y-2 text-gray-700 bg-rose-50/40 p-3.5 rounded-xl border border-rose-100">
                <p><strong>उपस्थित स्वर:</strong> {data.vowels.vowelsPresent.join(', ') || 'कोई नहीं'} (कुल योग: {data.vowels.chaldeanTotal})</p>
                <p><strong>आंतरिक प्रेरणा:</strong> {data.vowels.heartSoulMeaningHi}</p>
                <p><strong>भावनात्मक दृष्टिकोण:</strong> {data.vowels.emotionalPreferenceHi}</p>
              </div>
            </div>

            {/* Consonants Card */}
            <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-gray-900">Personality Number (व्यक्तित्व अंक)</h4>
                </div>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                  Root # {data.consonants.chaldeanRoot}
                </span>
              </div>
              <p className="text-xs text-gray-500 italic mb-3">
                "व्यंजन समाज और बाहरी दुनिया में आपकी प्रथम छाप और सामाजिक शैली को दर्शाते हैं।"
              </p>
              <div className="text-xs space-y-2 text-gray-700 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100">
                <p><strong>उपस्थित व्यंजन:</strong> {data.consonants.consonantsPresent.join(', ')} (कुल योग: {data.consonants.chaldeanTotal})</p>
                <p><strong>बाहरी प्रभाव:</strong> {data.consonants.personalityMeaningHi}</p>
                <p><strong>सामाजिक आचरण:</strong> {data.consonants.socialDemeanorHi}</p>
              </div>
            </div>
          </div>

          {/* DOB & Mobile Compatibility Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* DOB Compatibility */}
            <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-gray-900">Name + DOB Compatibility (जन्म अंक सामंजस्य)</h4>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    data.dobCompatibility.status === 'SUPPORTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : data.dobCompatibility.status === 'NEEDS_ATTENTION'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {data.dobCompatibility.ratingLabel}
                </span>
              </div>
              <p className="text-xs text-gray-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100 mb-3">
                {data.dobCompatibility.comprehensiveReasonWhyHi}
              </p>
              <div className="text-xs space-y-1.5 text-gray-600">
                <div>• <strong>मूलांक सामंजस्य:</strong> {data.dobCompatibility.mulankHarmonicsHi}</div>
                <div>• <strong>भाग्यांक सामंजस्य:</strong> {data.dobCompatibility.bhagyankHarmonicsHi}</div>
                <div>• <strong>लो शू ग्रिड तालमेल:</strong> {data.dobCompatibility.loshuGridSynergyHi}</div>
              </div>
            </div>

            {/* Mobile Compatibility */}
            {data.mobileCompatibility ? (
              <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-gray-900">Name + Mobile Compatibility (मोबाइल सामंजस्य)</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      data.mobileCompatibility.status === 'SUPPORTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {data.mobileCompatibility.status === 'SUPPORTIVE' ? 'शुभ तालमेल' : 'संतुलन अपेक्षित'}
                  </span>
                </div>
                <p className="text-xs text-gray-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100 mb-3">
                  {data.mobileCompatibility.compatibilitySummaryHi}
                </p>
                <div className="text-xs text-gray-600">
                  <p>{data.mobileCompatibility.synergyDetailsHi}</p>
                  <div className="mt-2 flex gap-4 text-[11px] font-semibold text-blue-900">
                    <span>नाम अंक: {data.mobileCompatibility.nameRoot}</span>
                    <span>मोबाइल रूट: {data.mobileCompatibility.mobileRoot}</span>
                    <span>मोबाइल योग: {data.mobileCompatibility.mobileCompound}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-center text-center">
                <p className="text-xs text-gray-500">मोबाइल नंबर दर्ज होने पर Name + Mobile सामंजस्य सक्रिय होगा।</p>
              </div>
            )}
          </div>

          {/* Repeated Numbers in Name */}
          {data.repeatedNameNumbers.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-purple-200 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>नाम में आवर्ती अंक प्रभाव (Repeated Letter Vibrations)</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {data.repeatedNameNumbers.map((rep, idx) => (
                  <div key={idx} className="bg-purple-50/40 p-3.5 rounded-xl border border-purple-100 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-purple-900">
                      <span>अंक {rep.number} ({rep.letters.join(', ')})</span>
                      <span className="px-2 py-0.5 bg-purple-200 rounded-md text-[10px]">{rep.count} बार उपस्थित</span>
                    </div>
                    <p className="text-gray-700"><strong>सकारात्मक प्रभाव:</strong> {rep.positiveExpressionHi}</p>
                    <p className="text-amber-800"><strong>अतिरेक से बचाव:</strong> {rep.possibleExcessHi}</p>
                    <p className="text-purple-800"><strong>संतुलन उपाय:</strong> {rep.balancingSuggestionHi}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lucky Info & Traditional Recommendations */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-amber-900">शुभ तत्व एवं पारंपरिक निर्देश (Traditional Auspicious Attributes)</h4>
              <span className="text-[11px] text-amber-800 font-medium">Traditional Numerology Suggestions</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-1">शुभ अंक (Lucky Numbers):</strong>
                <span className="text-gray-800 font-semibold">{chaldean.luckyInfo.luckyNumbers.join(', ')}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-1">शुभ रंग (Lucky Colours):</strong>
                <span className="text-gray-800">{chaldean.luckyInfo.luckyColours.join(', ')}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-1">शुभ दिन (Supportive Days):</strong>
                <span className="text-gray-800">{chaldean.luckyInfo.supportiveDays.join(', ')}</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200">
                <strong className="text-amber-900 block mb-1">अनुकूल क्षेत्र (Domains):</strong>
                <span className="text-gray-800">{chaldean.luckyInfo.professionThemes.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE NAME CORRECTION TOOL */}
      {activeTab === 'correction' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
              नाम सुधार एवं वर्तनी संतुलन टूल (Interactive Name Correction)
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              वर्तनी में एक या दो अक्षर बदलकर देखें कि कुल चालडियन योग (Compound Number) और रूट अंक पर क्या प्रभाव पड़ता है।
            </p>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={testSpelling}
                  onChange={handleTestSpellingChange}
                  placeholder="नया नाम या स्पेलिंग लिखें..."
                  className="w-full px-4 py-3 border border-amber-300 rounded-xl font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase tracking-wider"
                />
              </div>
              <button
                onClick={() => {
                  setTestSpelling(initialData.fullName);
                  setTestAnalysis(initialData);
                }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>मूल नाम रीसेट करें</span>
              </button>
            </div>

            {/* Comparison Stats between Original and Tested */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Chaldean Compound</span>
                <span className="text-2xl font-bold text-gray-900 mt-0.5 block">{testAnalysis.chaldean.compoundNumber}</span>
                <span className="text-[10px] text-gray-500 block">
                  मूल: {initialData.chaldean.compoundNumber}
                </span>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">Chaldean Root</span>
                <span className="text-2xl font-bold text-amber-700 mt-0.5 block"># {testAnalysis.chaldean.rootNumber}</span>
                <span className="text-[10px] text-gray-500 block">
                  मूल: #{initialData.chaldean.rootNumber}
                </span>
              </div>

              <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase block">DOB Compatibility</span>
                <span className="text-xs font-bold text-emerald-900 mt-2 block">
                  {testAnalysis.dobCompatibility.ratingLabel.split(' ')[0]}
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  मूलांक {mulank} व भाग्यांक {bhagyank}
                </span>
              </div>

              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-800 uppercase block">Compound Title</span>
                <span className="text-xs font-bold text-blue-900 mt-2 block truncate">
                  {testAnalysis.chaldean.compoundTitle}
                </span>
                <span className="text-[10px] text-blue-700 block mt-0.5">शास्त्रीय योग</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-900">
              <strong className="block mb-0.5">परीक्षित नाम का विश्लेषण:</strong>
              {testAnalysis.chaldean.compoundInterpretationHi}
            </div>
          </div>

          {/* Pre-Computed Auspicious Spelling Suggestions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>अनुशंसित वैकल्पिक वर्तनी सुझाव (Auspicious Alternative Suggestions)</span>
            </h4>
            <div className="space-y-3">
              {data.recommendations.suggestedAdjustments.map((sug, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-amber-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-gray-900 uppercase tracking-wider">{sug.suggestedName}</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold text-xs">
                        Compound {sug.suggestedChaldeanCompound} (रूट {sug.suggestedChaldeanRoot})
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{sug.benefitsDescriptionHi}</p>
                    <div className="flex gap-4 text-[11px] font-medium text-emerald-800 mt-1.5">
                      <span>मूलांक: {sug.mulankCompatibility}</span>
                      <span>भाग्यांक: {sug.bhagyankCompatibility}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setTestSpelling(sug.suggestedName);
                      const calc = analyzeComprehensiveName({
                        name: sug.suggestedName,
                        dob,
                        mulank,
                        bhagyank,
                        mobile
                      });
                      setTestAnalysis(calc);
                    }}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    इस स्पेलिंग को जांचें
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong>महत्वपूर्ण सूचना / Disclaimer:</strong> "{data.recommendations.disclaimer}" नाम में परिवर्तन केवल एक सहायक ऊर्जा सामंजस्य है, जो कर्म और पुरुषार्थ को सकारात्मक गति प्रदान करता है।
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRONOLOGY & PHONETICS */}
      {activeTab === 'pronology' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
              ध्वनिशास्त्र एवं प्रोनोलॉजी विश्लेषण (Pronology & Phonetics)
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              नाम के उच्चारण की लय, स्वरों व व्यंजनों का अनुपात तथा बोलने पर उत्पन्न होने वाली ध्वनि तरंगों का प्रभाव।
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-2">
                <strong className="text-amber-900 block text-sm">स्वर-व्यंजन अनुपात (Ratio):</strong>
                <p className="text-gray-800 font-semibold">{data.pronology.vowelConsonantRatio}</p>
                <p className="text-gray-600 leading-relaxed">{data.pronology.energyFlowHi}</p>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-xs space-y-2">
                <strong className="text-blue-900 block text-sm">आद्य ध्वनि तरंग (First Sound):</strong>
                <p className="text-gray-800 font-semibold">अक्षर '{data.pronology.firstSound}' की ऊर्जा</p>
                <p className="text-gray-600 leading-relaxed">{data.pronology.pronunciationQualityHi}</p>
              </div>

              <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 text-xs space-y-2">
                <strong className="text-purple-900 block text-sm">ध्वनिक कंपन (Vibration Mode):</strong>
                <p className="text-gray-800 font-semibold">Chaldean Phonetic Harmony</p>
                <p className="text-gray-600 leading-relaxed">{data.pronology.phoneticVibrationHi}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WESTERN / PYTHAGOREAN SYSTEM */}
      {activeTab === 'pythagorean' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-white/20 rounded-full text-xs font-semibold mb-2">
              <Globe className="w-3.5 h-3.5" />
              <span>WESTERN / PYTHAGOREAN NUMEROLOGY (1 to 9)</span>
            </div>
            <h3 className="text-xl font-bold font-serif">पाइथागोरियन नाम विश्लेषण</h3>
            <p className="text-blue-100 text-xs mt-1">
              पश्चिमी अंक प्रणाली में वर्णमाला के 26 अक्षरों को क्रमबद्ध 1 से 9 तक विभाजित किया जाता है।
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm text-center">
              <span className="text-xs font-bold text-blue-700 uppercase block">Expression Number</span>
              <span className="text-2xl font-bold text-blue-900 mt-1 block"># {pythagorean.expressionNumber}</span>
              <span className="text-[11px] text-gray-500 block mt-0.5">Total: {pythagorean.totalSum}</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm text-center">
              <span className="text-xs font-bold text-indigo-700 uppercase block">Soul Urge (Heart)</span>
              <span className="text-2xl font-bold text-indigo-900 mt-1 block"># {pythagorean.soulUrgeNumber}</span>
              <span className="text-[11px] text-gray-500 block mt-0.5">Vowels Sum</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-cyan-200 shadow-sm text-center">
              <span className="text-xs font-bold text-cyan-700 uppercase block">Personality</span>
              <span className="text-2xl font-bold text-cyan-900 mt-1 block"># {pythagorean.personalityNumber}</span>
              <span className="text-[11px] text-gray-500 block mt-0.5">Consonants Sum</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm text-center">
              <span className="text-xs font-bold text-purple-700 uppercase block">Master Number</span>
              <span className="text-2xl font-bold text-purple-900 mt-1 block">
                {pythagorean.masterNumber ? `# ${pythagorean.masterNumber}` : 'None'}
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5">11 / 22 / 33 Check</span>
            </div>
          </div>

          {/* Pythagorean 1-9 Grid */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-3">पाइथागोरियन 1–9 नाम ग्रिड (Letter Frequencies 1-9)</h4>
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const count = pythagorean.pythagoreanGrid[num] || 0;
                return (
                  <div
                    key={num}
                    className={`p-3 rounded-xl border text-center ${
                      count > 0 ? 'bg-blue-50/70 border-blue-300 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <span className="text-xs font-bold block">Digit {num}</span>
                    <span className="text-xl font-bold mt-0.5 block">{count}</span>
                    <span className="text-[9px] uppercase tracking-tighter block mt-0.5">
                      {count > 0 ? 'Present' : 'Missing'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <strong className="text-gray-900 block mb-1">Missing Numbers (Karmic Lessons in Name):</strong>
                <p className="text-gray-600">
                  {pythagorean.missingNumbers.length > 0
                    ? `अंक ${pythagorean.missingNumbers.join(', ')} नाम में अनुपस्थित हैं। इन्हें कर्म क्षेत्र में सीखने योग्य पाठ माना जाता है।`
                    : 'नाम में सभी 1 से 9 अंक संतुलित रूप से उपस्थित हैं।'}
                </p>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <strong className="text-gray-900 block mb-1">Traditional Western Interpretation:</strong>
                <p className="text-gray-600">{pythagorean.traditionalInterpretationHi}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM COMPARISON */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
              Chaldean vs Pythagorean Side-by-Side Comparison
            </h3>
            <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 mb-4">
              <strong>महत्वपूर्ण नियम:</strong> "{data.comparison.differenceExplanationHi}"
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/80 border-b border-amber-200 text-amber-900 font-bold">
                    <th className="p-3">विशेषता (Attribute)</th>
                    <th className="p-3">चालडियन प्रणाली (Chaldean)</th>
                    <th className="p-3">पाइथागोरियन प्रणाली (Pythagorean)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">अंक मान परास (Value Range)</td>
                    <td className="p-3">1 से 8 (अंक 9 पवित्र व अप्रयुक्त)</td>
                    <td className="p-3">1 से 9 (वर्णमाला का सीधा क्रम A=1, B=2...)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">गणना का आधार (Foundation)</td>
                    <td className="p-3">ध्वनि तरंगे व वैदिक ग्रहीय ध्वनिशास्त्र (Phonetics)</td>
                    <td className="p-3">पश्चिमी वर्णमाला अनुक्रम (Alphabetical sequence)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">कुल योग (Compound Number)</td>
                    <td className="p-3 font-bold text-amber-700">{chaldean.compoundNumber} ({chaldean.compoundTitle})</td>
                    <td className="p-3 font-bold text-blue-700">{pythagorean.compoundNumber}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">मूल अभिव्यक्ति अंक (Root Expression)</td>
                    <td className="p-3 font-bold text-amber-900"># {chaldean.rootNumber}</td>
                    <td className="p-3 font-bold text-blue-900"># {pythagorean.rootNumber}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">हृदय / आंतरिक प्रेरणा (Heart / Soul)</td>
                    <td className="p-3"># {data.heart.number} (Chaldean Vowels)</td>
                    <td className="p-3"># {pythagorean.soulUrgeNumber} (Pythagorean Vowels)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">व्यक्तित्व / बाह्य छाप (Personality)</td>
                    <td className="p-3"># {data.personality.number} (Chaldean Consonants)</td>
                    <td className="p-3"># {pythagorean.personalityNumber} (Pythagorean Consonants)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NameNumerologyDashboard;
