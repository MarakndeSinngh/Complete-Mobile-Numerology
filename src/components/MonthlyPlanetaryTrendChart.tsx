import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Compass,
  Calendar,
  Activity,
  Sliders,
  Info,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Sun,
  Moon,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { reduceToDigit } from '../core/numerologyEngine';

interface MonthlyPlanetaryTrendChartProps {
  driverNumber: number;
  conductorNumber: number;
  personalYear: number;
  userName?: string;
  year?: number;
}

export interface MonthlyTrendDataPoint {
  monthIndex: number;
  monthName: string;
  monthNameHi: string;
  shortName: string;
  personalMonth: number;
  governingPlanet: string;
  governingPlanetHi: string;
  intensityScore: number; // 0 - 100
  transitSupportScore: number; // 0 - 100
  vitalityScore: number; // 0 - 100
  opportunityLevel: 'HIGH' | 'MODERATE' | 'STEADY';
  focusThemeHi: string;
  keyFavorableDays: string;
  transitCyclePhase: string;
}

const MONTH_NAMES = [
  { en: 'January', hi: 'जनवरी', short: 'Jan' },
  { en: 'February', hi: 'फ़रवरी', short: 'Feb' },
  { en: 'March', hi: 'मार्च', short: 'Mar' },
  { en: 'April', hi: 'अप्रैल', short: 'Apr' },
  { en: 'May', hi: 'मई', short: 'May' },
  { en: 'June', hi: 'जून', short: 'Jun' },
  { en: 'July', hi: 'जुलाई', short: 'Jul' },
  { en: 'August', hi: 'अगस्त', short: 'Aug' },
  { en: 'September', hi: 'सितंबर', short: 'Sep' },
  { en: 'October', hi: 'अक्टूबर', short: 'Oct' },
  { en: 'November', hi: 'नवंबर', short: 'Nov' },
  { en: 'December', hi: 'दिसंबर', short: 'Dec' }
];

const PLANET_MAP: Record<number, { name: string; nameHi: string; element: string }> = {
  1: { name: 'Sun', nameHi: 'सूर्य देव', element: 'Fire' },
  2: { name: 'Moon', nameHi: 'चन्द्र देव', element: 'Water' },
  3: { name: 'Jupiter', nameHi: 'बृहस्पति देव', element: 'Wood / Ether' },
  4: { name: 'Rahu', nameHi: 'राहु ग्रह', element: 'Wood' },
  5: { name: 'Mercury', nameHi: 'बुध देव', element: 'Earth' },
  6: { name: 'Venus', nameHi: 'शुक्र देव', element: 'Metal' },
  7: { name: 'Ketu', nameHi: 'केतु ग्रह', element: 'Metal' },
  8: { name: 'Saturn', nameHi: 'शनि देव', element: 'Earth' },
  9: { name: 'Mars', nameHi: 'मंगल देव', element: 'Fire' }
};

// Friendly relationship matrix for planetary intensity modulation
const PLANETARY_FRIENDSHIP: Record<number, { friends: number[]; neutral: number[]; challenges: number[] }> = {
  1: { friends: [1, 2, 3, 5, 9], neutral: [4, 7], challenges: [6, 8] },
  2: { friends: [1, 2, 3, 5], neutral: [6, 7, 9], challenges: [4, 8] },
  3: { friends: [1, 2, 3, 5, 9], neutral: [8], challenges: [4, 6, 7] },
  4: { friends: [1, 4, 5, 6, 7, 8], neutral: [3], challenges: [2, 9] },
  5: { friends: [1, 2, 3, 4, 5, 6], neutral: [7, 8, 9], challenges: [] },
  6: { friends: [4, 5, 6, 7, 8], neutral: [2, 3], challenges: [1, 9] },
  7: { friends: [1, 4, 5, 6, 7], neutral: [2, 8], challenges: [3, 9] },
  8: { friends: [3, 4, 5, 6, 7, 8], neutral: [2], challenges: [1, 9] },
  9: { friends: [1, 2, 3, 5, 9], neutral: [7], challenges: [4, 6, 8] }
};

export const MonthlyPlanetaryTrendChart: React.FC<MonthlyPlanetaryTrendChartProps> = ({
  driverNumber = 1,
  conductorNumber = 5,
  personalYear = 5,
  userName = 'User',
  year = 2026
}) => {
  const [activeMetric, setActiveMetric] = useState<'ALL' | 'INTENSITY' | 'TRANSIT' | 'VITALITY'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Compute 12-month trend data
  const monthlyData: MonthlyTrendDataPoint[] = useMemo(() => {
    const driver = driverNumber || 1;
    const conductor = conductorNumber || 1;
    const py = personalYear || 5;

    return MONTH_NAMES.map((m, idx) => {
      const monthNum = idx + 1;
      const personalMonth = reduceToDigit(py + monthNum);
      const planetInfo = PLANET_MAP[personalMonth] || PLANET_MAP[1];

      // Resonance with Driver & Conductor
      const driverHarmony = PLANETARY_FRIENDSHIP[driver]?.friends.includes(personalMonth)
        ? 25
        : PLANETARY_FRIENDSHIP[driver]?.challenges.includes(personalMonth)
        ? -10
        : 10;

      const conductorHarmony = PLANETARY_FRIENDSHIP[conductor]?.friends.includes(personalMonth)
        ? 20
        : PLANETARY_FRIENDSHIP[conductor]?.challenges.includes(personalMonth)
        ? -8
        : 8;

      // Seasonal / Transit Cycle Wave Modulation (Vedic Ephemeris rhythm)
      // Months 4-5 (Spring Aries/Taurus transit), Months 9-10 (Autumn Libra/Scorpio transit) provide natural inflection waves
      const seasonalWave = Math.sin(((monthNum - 1) / 12) * Math.PI * 2) * 12;
      const transitPhaseMod = Math.cos(((monthNum + 2) / 12) * Math.PI * 2) * 10;

      // Base Intensity (50-95 scale)
      let intensityScore = Math.round(58 + driverHarmony + conductorHarmony + seasonalWave);
      intensityScore = Math.min(96, Math.max(42, intensityScore));

      // Transit Support (Saturn & Rahu alignment)
      let transitSupportScore = Math.round(52 + conductorHarmony * 1.2 + transitPhaseMod + (personalMonth === 3 || personalMonth === 5 ? 14 : 0));
      transitSupportScore = Math.min(95, Math.max(40, transitSupportScore));

      // Action / Vitality Index (Pranic rhythm)
      let vitalityScore = Math.round((intensityScore * 0.55) + (transitSupportScore * 0.45) + (personalMonth === 1 || personalMonth === 9 ? 8 : -4));
      vitalityScore = Math.min(98, Math.max(45, vitalityScore));

      let opportunityLevel: 'HIGH' | 'MODERATE' | 'STEADY' = 'MODERATE';
      if (vitalityScore >= 78) opportunityLevel = 'HIGH';
      else if (vitalityScore < 62) opportunityLevel = 'STEADY';

      // Astrological Themes
      const themesMap: Record<number, string> = {
        1: 'नवाचार, स्वतंत्र निर्णय व नेतृत्व पहल',
        2: 'सहयोग, भावनात्मक संतुलन व नेटवर्किंग',
        3: 'ज्ञान विस्तार, योजना निर्माण व परामर्श',
        4: 'व्यावहारिक व्यवस्था, तकनीकी कार्य व शोध',
        5: 'व्यापारिक यात्रा, संवाद व तीव्र विस्तार',
        6: 'पारिवारिक सुख, रचनात्मक कला व सौंदर्य',
        7: 'आत्म-चिंतन, शोध व आध्यात्मिक स्थिरता',
        8: 'कठोर परिश्रम, दीर्घकालिक निवेश व न्याय',
        9: 'परियोजना पूर्णता, ऊर्जा निष्पादन व साहस'
      };

      const daysMap: Record<number, string> = {
        1: '1, 10, 19, 28 तारीखें (रविवार / मंगलवार)',
        2: '2, 11, 20, 29 तारीखें (सोमवार / गुरुवार)',
        3: '3, 12, 21, 30 तारीखें (गुरुवार / मंगलवार)',
        4: '4, 13, 22, 31 तारीखें (शनिवार / बुधवार)',
        5: '5, 14, 23 तारीखें (बुधवार / शुक्रवार)',
        6: '6, 15, 24 तारीखें (शुक्रवार / बुधवार)',
        7: '7, 16, 25 तारीखें (सोमवार / गुरुवार)',
        8: '8, 17, 26 तारीखें (शनिवार / शुक्रवार)',
        9: '9, 18, 27 तारीखें (मंगलवार / रविवार)'
      };

      const transitCycles: Record<number, string> = {
        1: 'Direct Solar Push (सूर्य गति संरेखण)',
        2: 'Lunar Tides & Emotional Depth',
        3: 'Brihaspati Expansion Wave',
        4: 'Rahu Innovative Spark Phase',
        5: 'Budha Commercial Velocity',
        6: 'Shukra Aesthetic Alignment',
        7: 'Ketu Intuitive Deep Focus',
        8: 'Shani Karmic Consolidation',
        9: 'Mangal Executive Drive'
      };

      return {
        monthIndex: monthNum,
        monthName: m.en,
        monthNameHi: m.hi,
        shortName: m.short,
        personalMonth,
        governingPlanet: planetInfo.name,
        governingPlanetHi: planetInfo.nameHi,
        intensityScore,
        transitSupportScore,
        vitalityScore,
        opportunityLevel,
        focusThemeHi: themesMap[personalMonth] || themesMap[1],
        keyFavorableDays: daysMap[personalMonth] || daysMap[1],
        transitCyclePhase: transitCycles[personalMonth] || transitCycles[1]
      };
    });
  }, [driverNumber, conductorNumber, personalYear]);

  const selectedMonthData = useMemo(() => {
    return monthlyData.find(d => d.monthIndex === selectedMonth) || monthlyData[0];
  }, [monthlyData, selectedMonth]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthlyTrendDataPoint = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md border border-[#E5E7EB] p-4 rounded-2xl shadow-xl text-left text-xs font-sans space-y-2 z-50 max-w-xs">
          <div className="flex items-center justify-between border-b pb-1.5 gap-3">
            <span className="font-playfair font-bold text-sm text-[#1E3A8A]">
              {data.monthName} ({data.monthNameHi})
            </span>
            <span className="font-mono text-[10px] bg-[#D97706]/10 text-[#D97706] px-2 py-0.5 rounded font-bold">
              Month #{data.personalMonth} ({data.governingPlanet})
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between items-center text-indigo-700">
              <span className="font-medium">समग्र ग्रह तीव्रता (Intensity):</span>
              <strong className="font-mono">{data.intensityScore}%</strong>
            </div>
            <div className="flex justify-between items-center text-emerald-700">
              <span className="font-medium">गोचर अनुकूलता (Transit Support):</span>
              <strong className="font-mono">{data.transitSupportScore}%</strong>
            </div>
            <div className="flex justify-between items-center text-amber-700">
              <span className="font-medium">कर्म शक्ति (Vitality Index):</span>
              <strong className="font-mono">{data.vitalityScore}%</strong>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 border-t pt-1.5 leading-tight">
            <strong>प्रमुख ध्यान:</strong> {data.focusThemeHi}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-[40px] space-y-6 bg-white border border-[#E5E7EB] shadow-md text-left transition-all relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative z-10 border-b border-[#E5E7EB] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-[#1E3A8A]/10 text-[#1E3A8A] px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border border-[#1E3A8A]/20">
              <TrendingUp className="w-3.5 h-3.5 text-[#D97706]" /> 12-Month Ephemeris Wave
            </span>
            <span className="text-[10px] font-mono text-slate-400">Personal Year #{personalYear}</span>
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wide">
            मासिक ग्रहीय तीव्रता एवं गोचर चक्र वेधशाला (Monthly Planetary Trend)
          </h3>
          <p className="text-xs text-[#6B7280] font-sans max-w-2xl leading-relaxed">
            मूलांक #{driverNumber}, भाग्यांक #{conductorNumber} एवं पर्सनल ईयर #{personalYear} के आधार पर 12 महीनों के ग्रहीय उतार-चढ़ाव, गोचर तरंगों और कर्म शक्ति का वास्तविक समय दृश्य (Recharts Visualization)।
          </p>
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border text-xs">
          {[
            { id: 'ALL', label: 'समस्त तरंगें (All)', icon: Sliders },
            { id: 'INTENSITY', label: 'ग्रह तीव्रता', icon: Sparkles },
            { id: 'TRANSIT', label: 'गोचर सहयोग', icon: Compass },
            { id: 'VITALITY', label: 'कर्म शक्ति', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMetric === tab.id
                  ? 'bg-white text-[#1E3A8A] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RECHARTS TREND LINE / AREA CHART */}
      <div className="w-full h-72 sm:h-80 relative z-10 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={monthlyData}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setSelectedMonth(Number(state.activeTooltipIndex) + 1);
              }
            }}
          >
            <defs>
              {/* Gradient for Vitality Area */}
              <linearGradient id="vitalityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97706" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="intensityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="shortName"
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 11, fontFamily: 'monospace' }}
            />
            <YAxis
              domain={[35, 100]}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'sans-serif' }}
              iconType="circle"
            />

            {/* Baseline threshold */}
            <ReferenceLine y={70} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.5} label={{ value: 'अनुकूल क्षेत्र (70%)', position: 'insideTopRight', fill: '#10B981', fontSize: 9 }} />

            {/* Lines / Areas depending on filter */}
            {(activeMetric === 'ALL' || activeMetric === 'INTENSITY') && (
              <Line
                type="monotone"
                dataKey="intensityScore"
                name="ग्रह तीव्रता (Planetary Intensity)"
                stroke="#1E3A8A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#1E3A8A', strokeWidth: 1, stroke: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#1E3A8A' }}
              />
            )}

            {(activeMetric === 'ALL' || activeMetric === 'TRANSIT') && (
              <Line
                type="monotone"
                dataKey="transitSupportScore"
                name="गोचर सामंजस्य (Transit Support)"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3.5, fill: '#10B981', strokeWidth: 1, stroke: '#FFFFFF' }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            )}

            {(activeMetric === 'ALL' || activeMetric === 'VITALITY') && (
              <Area
                type="monotone"
                dataKey="vitalityScore"
                name="कर्म शक्ति (Vitality & Execution)"
                stroke="#D97706"
                strokeWidth={2.5}
                fill="url(#vitalityGradient)"
                dot={{ r: 4, fill: '#D97706', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                activeDot={{ r: 7, fill: '#D97706' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* SELECTED MONTH DEEP BREAKDOWN CARD */}
      <div className="bg-[#FAF5EE] border border-[#FDE68A] rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#FDE68A]/70 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#D97706] text-white font-playfair font-black text-lg flex items-center justify-center shadow-sm">
              {selectedMonthData.monthIndex}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-playfair font-bold text-base text-[#1E3A8A]">
                  {selectedMonthData.monthName} ({selectedMonthData.monthNameHi} {year})
                </h4>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  selectedMonthData.opportunityLevel === 'HIGH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedMonthData.opportunityLevel === 'STEADY'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {selectedMonthData.opportunityLevel === 'HIGH' ? 'शीर्ष अनुकूल काल' : 'संतुलित काल'}
                </span>
              </div>
              <span className="text-[11px] text-[#78350F] font-sans">
                मासिक मूलांक: <strong>#{selectedMonthData.personalMonth}</strong> • अधिष्ठाता: <strong>{selectedMonthData.governingPlanetHi} ({selectedMonthData.governingPlanet})</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <span className="bg-white/80 border border-amber-300 px-2.5 py-1 rounded-xl text-[#92400E]">
              तीव्रता: {selectedMonthData.intensityScore}%
            </span>
            <span className="bg-white/80 border border-emerald-300 px-2.5 py-1 rounded-xl text-emerald-800">
              गोचर: {selectedMonthData.transitSupportScore}%
            </span>
          </div>
        </div>

        {/* 3-Column Month Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white/70 rounded-2xl border border-[#FDE68A]/60 space-y-1">
            <span className="text-[10px] font-mono text-[#92400E] uppercase font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D97706]" /> मुख्य मासिक ध्यान (Core Focus)
            </span>
            <p className="text-[#4B5563] text-[11px] leading-relaxed">
              {selectedMonthData.focusThemeHi}
            </p>
          </div>

          <div className="p-3.5 bg-white/70 rounded-2xl border border-[#FDE68A]/60 space-y-1">
            <span className="text-[10px] font-mono text-[#92400E] uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-emerald-600" /> शुभ तिथियां एवं दिन (Key Days)
            </span>
            <p className="text-[#4B5563] text-[11px] leading-relaxed">
              {selectedMonthData.keyFavorableDays}
            </p>
          </div>

          <div className="p-3.5 bg-white/70 rounded-2xl border border-[#FDE68A]/60 space-y-1">
            <span className="text-[10px] font-mono text-[#92400E] uppercase font-bold flex items-center gap-1">
              <Compass className="w-3 h-3 text-indigo-600" /> गोचर तरंग (Transit Phase)
            </span>
            <p className="text-[#4B5563] text-[11px] leading-relaxed">
              {selectedMonthData.transitCyclePhase}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPlanetaryTrendChart;
