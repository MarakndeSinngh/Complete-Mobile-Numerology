import React, { useState, useMemo } from 'react';
import { CompleteNumerologyProfile } from '../core/types';
import { analyzeNumeroVastu, UnifiedVastuAnalysis, PropertyNumberAnalysis } from '../core/vastuEngine';
import { Compass, Home, Briefcase, Sparkles, Shield, AlertTriangle, CheckCircle, Info, ChevronRight, Layers, ArrowRight, Eye, RefreshCw } from 'lucide-react';

interface NumeroVastuDashboardProps {
  profile?: CompleteNumerologyProfile | null;
  dob?: string;
  name?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
}

export const NumeroVastuDashboard: React.FC<NumeroVastuDashboardProps> = ({
  profile,
  dob = '1990-01-01',
  name = 'User',
  gender = 'MALE'
}) => {
  // Local state for interactive property testing
  const [houseInput, setHouseInput] = useState<string>('42');
  const [flatInput, setFlatInput] = useState<string>('304');
  const [floorInput, setFloorInput] = useState<string>('3');
  const [buildingInput, setBuildingInput] = useState<string>('Tower B');
  const [entranceInput, setEntranceInput] = useState<string>('42A');
  const [facingDir, setFacingDir] = useState<string>('North');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FUSION' | 'KUA' | 'PROPERTY' | 'WORKSPACE' | 'REMEDIES'>('OVERVIEW');

  const effectiveDOB = profile?.identity?.dob || (profile as any)?.dob || dob;
  const effectiveGender = (profile?.identity?.gender as 'MALE' | 'FEMALE') || ((profile as any)?.gender as 'MALE' | 'FEMALE') || gender;
  const mulank = profile?.coreNumbers?.mulank || profile?.driver || (profile as any)?.mulank || 1;
  const bhagyank = profile?.coreNumbers?.bhagyank || profile?.bhagyank || (profile as any)?.bhagyank || 1;
  const missingNumbers = profile?.loshu?.missingNumbers ? profile.loshu.missingNumbers.map((m: any) => m.digit || m.number || m) : (profile?.missingNumbers || []);

  // Compute live Vastu Analysis
  const vastuData: UnifiedVastuAnalysis = useMemo(() => {
    return analyzeNumeroVastu({
      dob: effectiveDOB,
      gender: effectiveGender,
      mulank,
      bhagyank,
      houseNumber: houseInput,
      flatNumber: flatInput,
      floor: floorInput,
      buildingNumber: buildingInput,
      entranceNumber: entranceInput,
      facingDirection: facingDir,
      missingNumbers
    });
  }, [effectiveDOB, effectiveGender, mulank, bhagyank, houseInput, flatInput, floorInput, buildingInput, entranceInput, facingDir, missingNumbers]);

  const kuaNumber = vastuData.kuaNumber;
  const isEastGroup = vastuData.groupType === 'EAST_GROUP';
  const groupLabel = isEastGroup ? 'ईस्ट ग्रुप (East Group)' : 'वेस्ट ग्रुप (West Group)';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white p-6 md:p-8 rounded-[32px] shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-8">
          <Compass size={240} />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold uppercase">
              LeoFamily 5-Layered Architecture
            </span>
            <span className="bg-amber-400 text-amber-950 font-bold px-3 py-1 rounded-full text-[11px]">
              Kua Number #{kuaNumber} • {groupLabel}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-white tracking-wide">
            Numero Vastu & Directional Harmonics
          </h2>
          <p className="text-amber-100 text-xs md:text-sm max-w-2xl leading-relaxed">
            पारंपरिक भारतीय न्यूमरो-वास्तु, 8-दिशा ऊर्जा सिद्धांत और Lo Shu ग्रिड फ्यूजन पर आधारित संपूर्ण निवास एवं कार्यक्षेत्र सामंजस्य रिपोर्ट।
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'OVERVIEW', label: '1. Overview & Core', icon: Home },
          { id: 'FUSION', label: '2. Lo Shu + Vastu Fusion', icon: Layers },
          { id: 'KUA', label: '3. Kua 8 Directions', icon: Compass },
          { id: 'PROPERTY', label: '4. House & Property Audit', icon: Shield },
          { id: 'WORKSPACE', label: '5. Workspace Vastu', icon: Briefcase },
          { id: 'REMEDIES', label: '6. Traditional Remedies', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-[#D97706] text-white shadow-md shadow-[#D97706]/20'
                  : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-[#D97706] border border-gray-200'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CORE ZONES */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-[#D97706] block font-bold">Kua Number (दिशा अंक)</span>
              <span className="text-3xl font-playfair font-bold text-gray-900 mt-1 block">#{kuaNumber}</span>
              <span className="text-xs font-semibold text-[#D97706] mt-1 block">{groupLabel}</span>
              <p className="text-gray-500 text-[11px] mt-2">आपकी जन्म ऊर्जा के लिए शुभ दिशाओं और चुंबकीय प्रवाह का नियंत्रक अंक।</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-[#D97706] block font-bold">Driver & Conductor</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-playfair font-bold text-gray-900">#{mulank}</span>
                <span className="text-xs text-gray-400 font-mono">/</span>
                <span className="text-3xl font-playfair font-bold text-[#D97706]">#{bhagyank}</span>
              </div>
              <span className="text-xs font-semibold text-gray-700 mt-1 block">मूलांक & भाग्यांक</span>
              <p className="text-gray-500 text-[11px] mt-2">आपके व्यक्तिगत गुणधर्म एवं कर्म-पथ का आधारभूत अंक युग्म।</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-[#D97706] block font-bold">Primary Success Direction</span>
              <span className="text-xl font-playfair font-bold text-emerald-700 mt-2 block">
                {vastuData.compatibleDirections[0]?.direction || 'North'}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">Sheng Chi (शेंग ची)</span>
              <p className="text-gray-500 text-[11px] mt-2">करियर वृद्धि, व्यापारिक विस्तार और धन आकर्षण हेतु सर्वोत्तम दिशा।</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-[#D97706] block font-bold">Sitting Direction (कार्य मुख)</span>
              <span className="text-base font-playfair font-bold text-indigo-900 mt-2 block">
                {vastuData.workspaceVastu.recommendedSittingDirection}
              </span>
              <span className="text-[11px] font-semibold text-indigo-600 block mt-1">बौद्धिक एकाग्रता व लाभ</span>
              <p className="text-gray-500 text-[11px] mt-2">कार्य करते समय इस दिशा की ओर मुख करना सर्वाधिक लाभकारी है।</p>
            </div>
          </div>

          {/* Group Description Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6">
            <div className="flex items-start gap-3">
              <Compass className="w-6 h-6 text-[#D97706] flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-playfair font-bold text-gray-900 text-base">
                  {groupLabel} — ऊर्जा एवं दिशा सामंजस्य विवरण
                </h4>
                <p className="text-gray-700 text-xs leading-relaxed">
                  {vastuData.groupDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Core Functional Vastu Zones Grid */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-playfair text-xl font-bold text-gray-900">
                  Core Functional Vastu Zones (प्रमुख वास्तु क्षेत्र)
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  घर एवं कार्यस्थल के 6 प्रमुख जीवन क्षेत्रों की दिशा, तत्व एवं ऊर्जा संतुलन दिशा-निर्देश।
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#D97706] bg-amber-50 px-3 py-1 rounded-full font-bold border border-amber-200">
                Traditional Numero Vastu
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Career Zone */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">💼 Career & Opportunities</span>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">North (उत्तर)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.careerZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.careerZone.remedy}
                </div>
              </div>

              {/* Wealth Zone */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">💰 Wealth & Liquidity</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">South-East (आग्नेय)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.wealthZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-amber-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.wealthZone.remedy}
                </div>
              </div>

              {/* Health Zone */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">🌿 Health & Vitality</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">East / North-East</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.healthZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.healthZone.remedy}
                </div>
              </div>

              {/* Relationship Zone */}
              <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-900 uppercase tracking-wide">❤️ Relationships & Harmony</span>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">South-West (नैऋत्य)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.relationshipZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-rose-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.relationshipZone.remedy}
                </div>
              </div>

              {/* Fame Zone */}
              <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">👑 Fame & Recognition</span>
                  <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">South (दक्षिण)</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.fameZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-purple-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.fameZone.remedy}
                </div>
              </div>

              {/* Success Zone */}
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">🌟 Overall Success & Expansion</span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">{vastuData.zonesSummary.successZone.direction}</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{vastuData.zonesSummary.successZone.hindiGuidance}</p>
                <div className="pt-2 border-t border-indigo-200 text-[11px] text-[#B45309]">
                  <strong>उपाय:</strong> {vastuData.zonesSummary.successZone.remedy}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LO SHU + VASTU FUSION */}
      {activeTab === 'FUSION' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">Layer 2: Grid Alignment</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mt-1">
                Lo Shu + Numero Vastu Fusion (ग्रिड एवं वास्तु संगम)
              </h3>
              <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                Lo Shu ग्रिड के प्रत्येक अंक का संबंध एक निश्चित दिशा (Direction) और जीवन-क्षेत्र (Life Domain) से होता है। जन्म ग्रिड में जो अंक अनुपस्थित (Missing) होते हैं, उस दिशा के वास्तु ऊर्जा संतुलन द्वारा जीवन में सामंजस्य स्थापित किया जा सकता है।
              </p>
            </div>

            {/* Note on Vastu vs Grid */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
              <strong>स्पष्टीकरण:</strong> वास्तु उपाय जन्मतिथि के गणितीय अंकों को परिवर्तित नहीं करते हैं, बल्कि संबंधित दिशा के भौतिक एवं चुंबकीय वातावरण को संतुलित करके शुभ ऊर्जा का संचार करते हैं।
            </div>

            {/* 1-9 Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vastuData.loShuVastuFusion.map(item => {
                const isMissing = item.status === 'MISSING';
                return (
                  <div
                    key={item.digit}
                    className={`p-5 rounded-2xl border transition-all duration-300 space-y-3 ${
                      isMissing
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-400'
                        : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl font-playfair font-black text-base flex items-center justify-center ${
                          isMissing ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {item.digit}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-gray-900 block">{item.associatedDirection}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{item.planetName}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        isMissing ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isMissing ? 'Missing Node' : 'Present Node'}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-600">
                      <strong>क्षेत्र:</strong> {item.associatedZone}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {item.explanationHindi}
                    </p>

                    <div className={`p-2.5 rounded-xl text-[11px] ${
                      isMissing ? 'bg-white border border-rose-200 text-rose-900' : 'bg-white border border-emerald-200 text-emerald-900'
                    }`}>
                      <strong>पारंपरिक उपाय:</strong> {item.balancingSuggestionHindi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KUA NUMBER & 8 DIRECTIONS */}
      {activeTab === 'KUA' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">Layer 3: Eight Mansions</span>
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mt-1">
                  Kua Number #{kuaNumber} — 8 Directions Detailed Audit
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  दिशाओं का संपूर्ण विश्लेषण (Life Area, Planetary Ruler, Harmony Status, Remedies).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#D97706]/10 text-[#D97706] px-3 py-1 rounded-full border border-[#D97706]/20">
                  {groupLabel}
                </span>
              </div>
            </div>

            {/* Directions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-amber-50/50 text-[#B45309] font-mono uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Direction & Hindi Name</th>
                    <th className="py-3 px-4">Ruling Planet & Element</th>
                    <th className="py-3 px-4">Life Domain</th>
                    <th className="py-3 px-4">Status & Kua Impact</th>
                    <th className="py-3 px-4">Traditional Remedy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {vastuData.directionsAnalysis.map((dir, idx) => {
                    const isSupportive = dir.status === 'SUPPORTIVE';
                    return (
                      <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-gray-900 block">{dir.direction}</span>
                          <span className="text-[11px] text-[#D97706] font-medium">{dir.hindiName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-700 font-medium">
                          <div>{dir.rulingPlanet}</div>
                          <span className="text-[10px] text-gray-400 font-mono">{dir.element}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 font-medium">
                          {dir.lifeDomain}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSupportive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {dir.statusLabelHindi}
                          </span>
                          <span className="text-[10px] text-gray-500 block mt-1 leading-tight">{dir.kuaInfluence}</span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 text-[11px] max-w-xs leading-relaxed">
                          {dir.traditionalRemedy}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PROPERTY, HOUSE, FLAT & ENTRANCE AUDIT */}
      {activeTab === 'PROPERTY' && (
        <div className="space-y-6">
          {/* Interactive Property Tester */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">Layer 4: Property Audit</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mt-1">
                House, Flat, Floor & Entrance Numerology
              </h3>
              <p className="text-gray-600 text-xs mt-1">
                अपने निवास के नंबर दर्ज करें और जानिए कि क्या उनका Chaldean संयुक्त योग आपके मूलांक (#{mulank}) और भाग्यांक (#{bhagyank}) के साथ सामंजस्य रखता है।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">House Number</label>
                <input
                  type="text"
                  value={houseInput}
                  onChange={(e) => setHouseInput(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">Flat / Apt No.</label>
                <input
                  type="text"
                  value={flatInput}
                  onChange={(e) => setFlatInput(e.target.value)}
                  placeholder="e.g. 304"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">Floor No.</label>
                <input
                  type="text"
                  value={floorInput}
                  onChange={(e) => setFloorInput(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">Building / Wing</label>
                <input
                  type="text"
                  value={buildingInput}
                  onChange={(e) => setBuildingInput(e.target.value)}
                  placeholder="e.g. Tower B"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">Main Entrance No.</label>
                <input
                  type="text"
                  value={entranceInput}
                  onChange={(e) => setEntranceInput(e.target.value)}
                  placeholder="e.g. 42A"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-600 font-bold uppercase block mb-1">Facing Direction</label>
                <select
                  value={facingDir}
                  onChange={(e) => setFacingDir(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]"
                >
                  {['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Evaluated Property Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                vastuData.propertyAnalysis.house,
                vastuData.propertyAnalysis.flat,
                vastuData.propertyAnalysis.building,
                vastuData.propertyAnalysis.floor,
                vastuData.propertyAnalysis.entrance
              ].filter(Boolean).map((prop, idx) => {
                const p = prop as PropertyNumberAnalysis;
                const isSupportive = p.compatibilityStatus === 'SUPPORTIVE';
                const isAttention = p.compatibilityStatus === 'NEEDS_ATTENTION';
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isSupportive
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : isAttention
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-amber-50/40 border-amber-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-gray-500 uppercase">{p.label}</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold font-playfair text-gray-900">{p.rawInput}</span>
                          <span className="text-xs text-[#D97706] font-mono font-bold">Compound {p.compound} → #{p.root}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        isSupportive ? 'bg-emerald-100 text-emerald-800' : isAttention ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.compatibilityLabel}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-600 font-medium">
                      <strong>Ruling Planet:</strong> {p.rulingPlanet} ({p.element})
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {p.explanationHindi}
                    </p>

                    <div className="pt-2 border-t border-gray-200/80 text-[11px] text-[#B45309]">
                      <strong>पारंपरिक सुधार उपाय:</strong> {p.traditionalRemedy}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Facing Direction Harmonic Box */}
            {vastuData.propertyAnalysis.facing && (
              <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    🚪 Main Entrance Facing: {vastuData.propertyAnalysis.facing.direction}
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full">
                    {vastuData.propertyAnalysis.facing.statusLabelHindi}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {vastuData.propertyAnalysis.facing.explanationHindi}
                </p>
                <div className="text-[11px] text-indigo-900 pt-1">
                  <strong>दिशा उपाय:</strong> {vastuData.propertyAnalysis.facing.remedyHindi}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: WORKSPACE VASTU */}
      {activeTab === 'WORKSPACE' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">Layer 5: Commercial Chi</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mt-1">
                Workspace & Office Vastu (व्यापारिक एवं कार्यक्षेत्र वास्तु)
              </h3>
              <p className="text-gray-600 text-xs mt-1">
                कार्य करते समय बैठने की दिशा, टेबल की स्थिति और कार्यालय के वित्तीय कोनों का अनुकूलन।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Compass size={18} />
                  <span>अनुशंसित बैठने की दिशा (Sitting Direction)</span>
                </div>
                <div className="text-lg font-playfair font-bold text-gray-900">
                  {vastuData.workspaceVastu.recommendedSittingDirection}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {vastuData.workspaceVastu.sittingDirectionReasonHindi}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <Briefcase size={18} />
                  <span>Career & Wealth Zone Guidance</span>
                </div>
                <div className="text-xs text-gray-700 space-y-2">
                  <p><strong>करियर क्षेत्र (North):</strong> {vastuData.workspaceVastu.careerZoneNorthGuidance}</p>
                  <p><strong>धन क्षेत्र (South-East):</strong> {vastuData.workspaceVastu.wealthZoneSouthEastGuidance}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair font-bold text-gray-900 text-sm">कार्य वातावरण संतुलन नियम (Work Environment Balancing)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vastuData.workspaceVastu.workEnvironmentBalancing.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-gray-700 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair font-bold text-[#B45309] text-sm">पारंपरिक कार्यक्षेत्र उपाय (Traditional Workspace Remedies)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {vastuData.workspaceVastu.traditionalWorkspaceRemedies.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#D97706] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRADITIONAL REMEDIES */}
      {activeTab === 'REMEDIES' && (
        <div className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">पारंपरिक वास्तु उपाय</span>
              <h3 className="font-playfair text-xl md:text-2xl font-bold text-gray-900 mt-1">
                Traditional Numero Vastu Remedies (व्यावहारिक एवं सरल उपाय)
              </h3>
              <p className="text-gray-600 text-xs mt-1">
                रंग, दिशा, वनस्पति, धातु और जीवनशैली के माध्यम से बिना किसी तोड़-फोड़ के वास्तु ऊर्जा का सहज संतुलन।
              </p>
            </div>

            {/* Colour Harmonization */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 space-y-4">
              <h4 className="font-playfair font-bold text-gray-900 text-sm">रंग सामंजस्य दिशा-निर्देश (Colour Harmonization)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-emerald-200">
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-800 block">शुभ रंग (Lucky Colours)</span>
                  <p className="font-bold text-gray-800 mt-1">{vastuData.layeredReport.layer5_traditionalRemedies.colourHarmonization.luckyColours.join(', ')}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-200">
                  <span className="text-[10px] font-mono uppercase font-bold text-blue-800 block">संतुलन रंग (Balance Colours)</span>
                  <p className="font-bold text-gray-800 mt-1">{vastuData.layeredReport.layer5_traditionalRemedies.colourHarmonization.balanceColours.join(', ')}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-rose-200">
                  <span className="text-[10px] font-mono uppercase font-bold text-rose-800 block">वर्जित रंग (Avoid Excessive)</span>
                  <p className="font-bold text-gray-800 mt-1">{vastuData.layeredReport.layer5_traditionalRemedies.colourHarmonization.avoidColours.join(', ')}</p>
                </div>
              </div>
              <p className="text-xs text-gray-700">
                <strong>कमरों के रंग का चयन:</strong> {vastuData.layeredReport.layer5_traditionalRemedies.colourHarmonization.roomGuidance}
              </p>
            </div>

            {/* Categorized Remedies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Home & Direction */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-gray-900 uppercase font-mono tracking-wider">🏠 गृह एवं दिशा संतुलन</h5>
                <ul className="space-y-2 text-xs text-gray-700">
                  {vastuData.layeredReport.layer5_traditionalRemedies.homeRemedies.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#D97706] font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objects & Botanicals */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-gray-900 uppercase font-mono tracking-wider">🌿 शुभ वस्तुएं एवं पौधे</h5>
                <ul className="space-y-2 text-xs text-gray-700">
                  {vastuData.layeredReport.layer5_traditionalRemedies.traditionalObjects.concat(vastuData.layeredReport.layer5_traditionalRemedies.botanicalAndPlants).map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Environment */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-gray-900 uppercase font-mono tracking-wider">🌬️ वातावरण एवं प्रकाश व्यवस्था</h5>
                <ul className="space-y-2 text-xs text-gray-700">
                  {vastuData.layeredReport.layer5_traditionalRemedies.environmentalAdjustments.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charity & Lifestyle */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h5 className="font-bold text-xs text-gray-900 uppercase font-mono tracking-wider">🙏 दान एवं जीवनशैली</h5>
                <ul className="space-y-2 text-xs text-gray-700">
                  {vastuData.layeredReport.layer5_traditionalRemedies.charityAndLifestyle.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
              <Info className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-[#B45309] block uppercase tracking-wide text-[10px]">पारंपरिक वास्तु एवं न्यूमरोलॉजी सूचना:</strong>
                {vastuData.layeredReport.layer5_traditionalRemedies.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NumeroVastuDashboard;
