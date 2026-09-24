import React, { useState, useEffect } from 'react';
import {
  Car,
  Shield,
  Compass,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  Calendar,
  Phone,
  User,
  Hash,
  Download,
  Printer,
  ChevronRight,
  Check,
  RefreshCw,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import {
  analyzeVehicleNumerologyPro,
  VehicleNumerologyReport,
  VehicleAnalysisInput,
  CompatibilityStatus
} from '../core/vehicleEngine';
import DateInput from './DateInput';
import { formatDateForDisplay, parseIndianDate } from '../utils/dateUtils';
import { useLanguage } from '../i18n';
import { getProfileIsolationKey } from '../core';

interface VehicleNumerologyDashboardProps {
  initialDob?: string;
  initialName?: string;
  initialMobile?: string;
  initialGender?: 'MALE' | 'FEMALE' | 'OTHER';
  onSyncToMasterReport?: (report: VehicleNumerologyReport) => void;
}

export const VehicleNumerologyDashboard: React.FC<VehicleNumerologyDashboardProps> = ({
  initialDob = '15/08/1990',
  initialName = 'Priya Sharma',
  initialMobile = '',
  initialGender = 'FEMALE',
  onSyncToMasterReport
}) => {
  const { t, language } = useLanguage();

  // Input Form States
  const [regNumber, setRegNumber] = useState('DL 01 AB 1234');
  const [vehicleNickname, setVehicleNickname] = useState('Honda City');
  const [vehicleType, setVehicleType] = useState<VehicleAnalysisInput['vehicleType']>('Car');
  const [vehiclePurpose, setVehiclePurpose] = useState<VehicleAnalysisInput['vehiclePurpose']>('Personal Use');
  const [ownerDob, setOwnerDob] = useState(initialDob);
  const [ownerName, setOwnerName] = useState(initialName);
  const [mobileNumber, setMobileNumber] = useState(initialMobile);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>(initialGender);

  // Active Report State
  const [report, setReport] = useState<VehicleNumerologyReport | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CHALDEAN' | 'COMPATIBILITY' | 'VASTU' | 'REMEDIES'>('OVERVIEW');
  const [showDetailedWhy, setShowDetailedWhy] = useState(false);
  const [syncedNotification, setSyncedNotification] = useState(false);

  // Initial Calculation on mount
  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = () => {
    if (!regNumber.trim()) return;

    const input: VehicleAnalysisInput = {
      registrationNumber: regNumber,
      ownerDob: ownerDob || initialDob,
      ownerName: ownerName || initialName,
      vehicleNickname,
      vehicleType,
      vehiclePurpose,
      purchaseDate: purchaseDate.trim() || undefined,
      registrationDate: registrationDate.trim() || undefined,
      mobileNumber: mobileNumber.trim() || undefined,
      gender
    };

    const res = analyzeVehicleNumerologyPro(input);
    setReport(res);

    // Save to localStorage with profile isolation key for Master Report synchronization
    try {
      const profileKey = getProfileIsolationKey({
        name: ownerName || initialName,
        dob: ownerDob || initialDob,
        gender
      });
      const payload = JSON.stringify({
        report: res,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`leofamily_saved_vehicle_audit_${profileKey}`, payload);
      localStorage.setItem('leofamily_saved_vehicle_audit', payload);
    } catch (e) {
      console.error('Failed to save vehicle audit to localStorage:', e);
    }

    if (onSyncToMasterReport) {
      onSyncToMasterReport(res);
    }
  };

  const handleSyncClick = () => {
    if (!report) return;
    try {
      const profileKey = getProfileIsolationKey({
        name: ownerName || initialName,
        dob: ownerDob || initialDob,
        gender
      });
      const payload = JSON.stringify({
        report,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(`leofamily_saved_vehicle_audit_${profileKey}`, payload);
      localStorage.setItem('leofamily_saved_vehicle_audit', payload);
      setSyncedNotification(true);
      setTimeout(() => setSyncedNotification(false), 3000);
      if (onSyncToMasterReport) {
        onSyncToMasterReport(report);
      }
    } catch (e) {
      console.error('Sync error:', e);
    }
  };

  const getStatusBadge = (status: CompatibilityStatus) => {
    switch (status) {
      case 'SUPPORTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Supportive (अनुकूल)
          </span>
        );
      case 'NEEDS_ATTENTION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5" /> Needs Attention (सावधानी)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Info className="w-3.5 h-3.5" /> Neutral (तटस्थ)
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-mono uppercase font-bold tracking-wider border border-amber-400/30">
              <Car className="w-3.5 h-3.5" /> LeoFamily Vehicle Numerology Pro
            </div>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight">
              वाहन अंकशास्त्र एवं गति वास्तु ब्लूप्रिंट
            </h1>
            <p className="text-xs md:text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              पारंपरिक चालडीन पद्धति, मूलांक-भाग्यांक मित्रता, अंक पुनरावृत्ति एवं कुआ दिशा वास्तु के आधार पर वाहन संख्या का व्यापक विश्लेषण।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSyncClick}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {syncedNotification ? 'Synced to Master Report!' : 'Sync to Master Report'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs transition flex items-center gap-1.5 border border-white/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Input Configuration Grid */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <div>
            <h2 className="font-playfair text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <Car className="w-5 h-5 text-amber-600" />
              वाहन एवं स्वामी विवरण (Vehicle & Owner Details)
            </h2>
            <p className="text-xs text-[#6B7280]">मूल नंबर, वाहन मॉडल, स्वामी की जन्मतिथि एवं उपयोग का उद्देश्य दर्ज करें।</p>
          </div>
          <button
            type="button"
            onClick={runAnalysis}
            className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-Calculate
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            runAnalysis();
          }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs"
        >
          {/* Registration Number */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="font-bold text-[#374151] flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-600" /> Vehicle Registration Number *
            </label>
            <div className="relative">
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. DL 01 AB 1234, MH 12 CD 5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm tracking-wide uppercase focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400">अक्षर एवं अंक (Alphabets & Digits) दोनों सम्मिलित करें।</span>
          </div>

          {/* Vehicle Nickname / Model */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#374151]">Model / Nickname</label>
            <input
              type="text"
              value={vehicleNickname}
              onChange={(e) => setVehicleNickname(e.target.value)}
              placeholder="e.g. Honda City, Fortuner"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Vehicle Type */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#374151]">Vehicle Type</label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
            >
              <option value="Car">कार (Car)</option>
              <option value="SUV">एसयूवी (SUV)</option>
              <option value="Motorcycle">मोटरसाइकिल (Motorcycle)</option>
              <option value="Scooter">स्कूटर (Scooter)</option>
              <option value="Commercial Vehicle">व्यावसायिक वाहन (Commercial)</option>
              <option value="Truck">ट्रक (Truck)</option>
              <option value="Bus">बस (Bus)</option>
              <option value="Other">अन्य (Other)</option>
            </select>
          </div>

          {/* Owner DOB */}
          <div className="space-y-1.5">
            <DateInput
              id="vehicle-owner-dob"
              label="Owner DOB (DD/MM/YYYY) *"
              value={ownerDob}
              outputFormat="indian"
              onChange={(val) => setOwnerDob(val)}
              className="py-2.5 px-3 text-xs"
              required
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#374151] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600" /> Owner Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#374151]">Vehicle Purpose</label>
            <select
              value={vehiclePurpose}
              onChange={(e) => setVehiclePurpose(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
            >
              <option value="Personal Use">व्यक्तिगत उपयोग (Personal)</option>
              <option value="Business Use">व्यापारिक उपयोग (Business)</option>
              <option value="Commercial Use">कमर्शियल ट्रांसपोर्ट (Commercial)</option>
              <option value="Family Use">पारिवारिक यात्रा (Family)</option>
              <option value="Travel">लंबी यात्राएं (Travel)</option>
            </select>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="font-bold text-[#374151] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-600" /> Mobile (Cross-Match)
            </label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>

          {/* Purchase Date (Optional) */}
          <div className="space-y-1.5">
            <DateInput
              id="vehicle-purchase-date"
              label="Purchase Date (DD/MM/YYYY)"
              value={purchaseDate}
              outputFormat="indian"
              onChange={(val) => setPurchaseDate(val)}
              className="py-2.5 px-3 text-xs"
              placeholder="Optional DD/MM/YYYY"
            />
          </div>

          {/* Registration Date (Optional) */}
          <div className="space-y-1.5">
            <DateInput
              id="vehicle-reg-date"
              label="Registration Date (DD/MM/YYYY)"
              value={registrationDate}
              outputFormat="indian"
              onChange={(val) => setRegistrationDate(val)}
              className="py-2.5 px-3 text-xs"
              placeholder="Optional DD/MM/YYYY"
            />
          </div>
        </form>
      </div>

      {report && (
        <div className="space-y-6" id="vehicle-report-pro-container">
          {/* Navigation Bar */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
            {[
              { id: 'OVERVIEW', label: '1. मुख्य अवलोकन (Overview)', icon: <Car className="w-3.5 h-3.5" /> },
              { id: 'CHALDEAN', label: '2. चालडीन विश्लेषण (Chaldean)', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'COMPATIBILITY', label: '3. स्वामी अनुकूलता (Compatibility)', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'VASTU', label: '4. दिशा वास्तु व कुआ (Vastu & Kua)', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'REMEDIES', label: '5. पारंपरिक उपाय व सारांश (Summary & Remedies)', icon: <Shield className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Scorecard Hero Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Vehicle Plate Card */}
                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider block">
                    Original Registration
                  </span>
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-inner inline-block">
                    <span className="font-mono text-lg font-extrabold text-slate-900 tracking-wider">
                      {report.originalRegistration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    प्रकार: <strong>{report.vehicleType}</strong> | उपयोग: <strong>{report.vehiclePurpose}</strong>
                  </p>
                </div>

                {/* Total Compound & Root */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono font-bold text-blue-800 uppercase tracking-wider block">
                    Chaldean Total Compound & Root
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-playfair text-3xl font-extrabold text-[#1E3A8A]">
                      {report.chaldean.totalCompound}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      → Root <strong className="text-xl text-amber-600 font-bold">{report.chaldean.totalRoot}</strong>
                    </span>
                  </div>
                  <p className="text-[11px] text-[#1E3A8A] font-medium">
                    स्वामी ग्रह: <strong>{report.chaldean.planetaryRulerHi}</strong>
                  </p>
                </div>

                {/* Mulank & Bhagyank Compatibility */}
                <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Owner Compatibility
                  </span>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">मूलांक #{report.ownerProfile.mulank}:</span>
                      {getStatusBadge(report.compatibility.mulankStatus)}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">भाग्यांक #{report.ownerProfile.bhagyank}:</span>
                      {getStatusBadge(report.compatibility.bhagyankStatus)}
                    </div>
                  </div>
                </div>

                {/* Purpose Alignment */}
                <div className="p-5 bg-white border border-slate-200 rounded-3xl space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Purpose Harmony
                  </span>
                  <span className="text-base font-bold text-slate-900 block">
                    {report.purposeAlignment.alignmentLevel === 'HIGH' ? 'उत्कृष्ट संरेखण' : 'संतुलित'}
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {report.purposeAlignment.notesHi}
                  </p>
                </div>
              </div>

              {/* Executive Summary Box */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-4">
                <div className="border-b pb-3 flex justify-between items-center">
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937] flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    कार्यकारी सारांश (Executive Synthesis)
                  </h3>
                  <span className="text-[10px] font-mono px-3 py-1 bg-amber-50 text-amber-800 rounded-full font-bold">
                    LeoFamily Vehicle Synthesis
                  </span>
                </div>

                <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                  {report.finalSummaryHi.leadStatement}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {report.finalSummaryHi.keyPoints.map((pt, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2.5">
                      <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
                  <strong>पारंपरिक परामर्श:</strong>
                  <p className="text-[11px] leading-relaxed">{report.finalSummaryHi.closingAdvice}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CHALDEAN ALPHANUMERIC BREAKDOWN */}
          {activeTab === 'CHALDEAN' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-6">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">
                    चालडीन अक्षर एवं अंक गणना (Chaldean Letter-by-Letter Breakdown)
                  </h3>
                  <p className="text-xs text-slate-500">
                    चालडीन प्रणाली में 1 से 8 तक के मान अक्षरों को आवंटित होते हैं (अंक 9 को पवित्र मानकर अक्षरों में शामिल नहीं किया जाता)।
                  </p>
                </div>

                {/* Letter Breakdown Visual Chips */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                    Alphanumeric Matrix & Values:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {report.chaldean.letterBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center bg-blue-50/80 border border-blue-200 rounded-xl px-3 py-2 min-w-[48px]"
                      >
                        <span className="font-mono text-sm font-bold text-[#1E3A8A]">{item.letter}</span>
                        <span className="text-[10px] font-mono text-amber-700 font-bold">={item.value}</span>
                      </div>
                    ))}
                    {report.numericAnalysis.numericString.split('').map((digit, idx) => (
                      <div
                        key={`dig-${idx}`}
                        className="flex flex-col items-center justify-center bg-amber-50/80 border border-amber-200 rounded-xl px-3 py-2 min-w-[48px]"
                      >
                        <span className="font-mono text-sm font-bold text-amber-900">{digit}</span>
                        <span className="text-[10px] font-mono text-slate-500">={digit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculations Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      अक्षरों का योग (Alphabetic Sum)
                    </span>
                    <span className="font-playfair text-xl font-bold text-[#1F2937]">
                      {report.chaldean.alphabeticSum}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      वाहन प्लेट में स्थित सभी अक्षरों का चालडीन मान योग।
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                      अंकों का योग (Numeric Digits Sum)
                    </span>
                    <span className="font-playfair text-xl font-bold text-[#1F2937]">
                      {report.chaldean.numericSum}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      प्लेट पर स्थित सभी अंकों का प्रत्यक्ष जोड़।
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-800 font-bold block">
                      कुल कम्पाउंड (Compound Number)
                    </span>
                    <span className="font-playfair text-xl font-bold text-amber-900">
                      {report.chaldean.totalCompound} → Root {report.chaldean.totalRoot}
                    </span>
                    <p className="text-[11px] text-amber-800">
                      {report.chaldean.compoundTitle}
                    </p>
                  </div>
                </div>

                {/* Deep Compound Meaning */}
                <div className="p-5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] space-y-2 text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#92400E] uppercase block">
                    Compound Number #{report.chaldean.totalCompound} — {report.chaldean.compoundTitle}
                  </span>
                  <p className="text-[#78350F] leading-relaxed text-[11px]">
                    {report.chaldean.compoundMeaning}
                  </p>
                  {report.chaldean.compoundPrediction && (
                    <p className="text-[#92400E] font-medium text-[11px] pt-1">
                      <strong>पारंपरिक प्रभाव:</strong> {report.chaldean.compoundPrediction}
                    </p>
                  )}
                </div>

                {/* Numeric Repetition & Frequency */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    प्लेट पर अंकों की आवृत्ति एवं पुनरावृत्ति (Digit Frequency & Repetition)
                  </h4>
                  {report.numericAnalysis.repeatedDigits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {report.numericAnalysis.repeatedDigits.map((rep, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-2xl border border-amber-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">अंक {rep.digit} ({rep.count} बार उपस्थित)</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                              Repeated Energy
                            </span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{rep.traditionalMeaning}</p>
                          <p className="text-amber-900 text-[10px]">
                            <strong>संतुलन उपाय:</strong> {rep.cautionHi}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                      वाहन नंबर में कोई अंक बार-बार नहीं दोहराया गया है। यह संतुलित ऊर्जा प्रवाह का संकेत देता है।
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: OWNER COMPATIBILITY */}
          {activeTab === 'COMPATIBILITY' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-6">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937]">
                    स्वामी एवं वाहन अनुकूलता (Owner & Vehicle Compatibility)
                  </h3>
                  <p className="text-xs text-slate-500">
                    स्वामी की जन्मतिथि ({report.ownerProfile.dob}) से प्राप्त मूलांक एवं भाग्यांक के साथ वाहन रूट अंक {report.chaldean.totalRoot} का संरेखण।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Mulank Card */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                          Mulank (Driver) #{report.ownerProfile.mulank}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {report.ownerProfile.mulankLord}
                        </span>
                      </div>
                      {getStatusBadge(report.compatibility.mulankStatus)}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {report.compatibility.mulankNotesHi}
                    </p>
                  </div>

                  {/* Bhagyank Card */}
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                          Bhagyank (Conductor) #{report.ownerProfile.bhagyank}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {report.ownerProfile.bhagyankLord}
                        </span>
                      </div>
                      {getStatusBadge(report.compatibility.bhagyankStatus)}
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {report.compatibility.bhagyankNotesHi}
                    </p>
                  </div>
                </div>

                {/* Lo Shu Grid Activation */}
                <div className="p-5 bg-blue-50/60 rounded-3xl border border-blue-200 space-y-2 text-xs">
                  <span className="text-[10px] font-mono font-bold text-[#1E3A8A] uppercase block">
                    लो शू ग्रिड संरेखण (Lo Shu Birth Grid Interaction)
                  </span>
                  <p className="text-slate-700 text-[11px] leading-relaxed">
                    {report.compatibility.gridSupportNotesHi}
                  </p>
                  {report.compatibility.missingNumberActivation && (
                    <span className="inline-block mt-1 px-3 py-1 bg-white text-[#1E3A8A] rounded-full text-[10px] font-bold border border-blue-300">
                      ✨ {report.compatibility.missingNumberActivation}
                    </span>
                  )}
                </div>

                {/* Cross-Profile: Name & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  {report.compatibility.nameCompatibility && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">नाम अंक संरेखण (Name Alignment)</span>
                        <span className="font-mono text-xs font-bold text-amber-700">
                          Root {report.compatibility.nameCompatibility.nameRoot}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {report.compatibility.nameCompatibility.notesHi}
                      </p>
                    </div>
                  )}

                  {report.compatibility.mobileComparison && (
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">मोबाइल अंक तुलना (Mobile Match)</span>
                        <span className="font-mono text-xs font-bold text-blue-700">
                          Root {report.compatibility.mobileComparison.mobileRoot}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        {report.compatibility.mobileComparison.notesHi}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VASTU & KUA */}
          {activeTab === 'VASTU' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-6">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937] flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-600" />
                    वाहन गति वास्तु एवं कुआ संरेखण (Vehicle Vastu & Kua Guidance)
                  </h3>
                  <p className="text-xs text-slate-500">
                    स्वामी का कुआ अंक #{report.vastuKua.kuaNumber} ({report.vastuKua.kuaGroup}) एवं वाहन की अनुशंसित पार्किंग व यात्रा दिशाएं।
                  </p>
                </div>

                {/* Kua Auspicious Directions Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-center">
                    <span className="text-[9px] font-mono text-emerald-800 uppercase font-bold block">
                      सफलता (Sheng Chi)
                    </span>
                    <span className="text-sm font-bold text-emerald-900 block">
                      {report.vastuKua.favourableDirections.shengChi}
                    </span>
                    <span className="text-[10px] text-emerald-700">करियर व व्यावसायिक यात्रा</span>
                  </div>

                  <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 space-y-1 text-center">
                    <span className="text-[9px] font-mono text-blue-800 uppercase font-bold block">
                      स्वास्थ्य व सुरक्षा (Tian Yi)
                    </span>
                    <span className="text-sm font-bold text-blue-900 block">
                      {report.vastuKua.favourableDirections.tianYi}
                    </span>
                    <span className="text-[10px] text-blue-700">शांत व सुरक्षित आवागमन</span>
                  </div>

                  <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-1 text-center">
                    <span className="text-[9px] font-mono text-purple-800 uppercase font-bold block">
                      संबंध व सौहार्द (Yan Nian)
                    </span>
                    <span className="text-sm font-bold text-purple-900 block">
                      {report.vastuKua.favourableDirections.yanNian}
                    </span>
                    <span className="text-[10px] text-purple-700">पारिवारिक सामंजस्य</span>
                  </div>

                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-center">
                    <span className="text-[9px] font-mono text-amber-800 uppercase font-bold block">
                      स्थिरता (Fu Wei)
                    </span>
                    <span className="text-sm font-bold text-amber-900 block">
                      {report.vastuKua.favourableDirections.fuWei}
                    </span>
                    <span className="text-[10px] text-amber-700">दैनिक आवागमन शांति</span>
                  </div>
                </div>

                {/* Parking Advice */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 block">अनुशंसित पार्किंग दिशा (Parking Orientation):</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {report.vastuKua.parkingAdviceHi}
                  </p>
                </div>

                {/* Optional Purchase / Registration Date Cycles */}
                {(report.purchaseDateAnalysis || report.registrationDateAnalysis) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    {report.purchaseDateAnalysis && (
                      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                        <span className="text-[10px] font-mono text-amber-800 uppercase font-bold block">
                          क्रय तिथि चक्र (Purchase Cycle)
                        </span>
                        <span className="font-bold text-amber-950">
                          {report.purchaseDateAnalysis.purchaseDate} (Personal Year {report.purchaseDateAnalysis.personalYear})
                        </span>
                        <p className="text-amber-900 text-[11px] leading-relaxed">
                          {report.purchaseDateAnalysis.timingNotesHi}
                        </p>
                      </div>
                    )}

                    {report.registrationDateAnalysis && (
                      <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 space-y-1">
                        <span className="text-[10px] font-mono text-blue-800 uppercase font-bold block">
                          पंजीकरण तिथि अंक (Registration Day)
                        </span>
                        <span className="font-bold text-blue-950">
                          {report.registrationDateAnalysis.registrationDate} (Day #{report.registrationDateAnalysis.dayNumber})
                        </span>
                        <p className="text-blue-900 text-[11px] leading-relaxed">
                          {report.registrationDateAnalysis.timingNotesHi}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: REMEDIES & GUIDANCE */}
          {activeTab === 'REMEDIES' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-white rounded-3xl border border-slate-200 space-y-6">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#1F2937] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-600" />
                    पारंपरिक वास्तु संतुलन एवं डैशबोर्ड उपाय (Traditional Balancing Guidance)
                  </h3>
                  <p className="text-xs text-slate-500">
                    वाहन में सकारात्मक ऊर्जा प्रवाह, स्वच्छता एवं सुरक्षात्मक सामंजस्य बनाए रखने हेतु सरल उपाय।
                  </p>
                </div>

                {/* Dashboard Talisman Remedies */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#92400E]">
                    डैशबोर्ड एवं इंटीरियर उपाय (Dashboard & Interior Placement):
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {report.vastuKua.dashboardRemediesHi.map((rem, idx) => (
                      <div key={idx} className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#FDE68A] flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-[#78350F] text-[11px] leading-relaxed">{rem}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Favourable Colors & Aesthetics */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">शुभ रंग एवं इंटीरियर टोन (Favourable Colors):</span>
                  <div className="flex flex-wrap gap-2">
                    {report.vastuKua.favourableColors.map((color, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-semibold text-slate-700">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Maintenance & Driving Caution */}
                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span className="font-bold text-amber-950">व्यावहारिक वाहन देखभाल एवं सुरक्षा नियम</span>
                  </div>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    {report.traditionalGuidance.maintenanceTipHi} {report.traditionalGuidance.travelPrecautionHi}
                  </p>
                </div>

                {/* Mandatory Safety Disclaimer */}
                <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 text-[11px] text-slate-600 leading-relaxed">
                  <strong>सुरक्षा अस्वीकरण (Disclaimer):</strong> {report.safetyDisclaimer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
