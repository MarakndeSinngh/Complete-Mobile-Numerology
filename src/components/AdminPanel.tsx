import React, { useState, useEffect } from 'react';
import { PersonalDetails } from '../types';
import { 
  Compass, User, Calendar, Award, Activity, Heart, Sparkles, 
  AlertTriangle, Check, FileText, Layers, Info, RefreshCw, 
  Star, BookOpen, TrendingUp, ShieldCheck, ChevronRight, 
  CheckCircle, SlidersHorizontal, Settings, Flame, Droplet, Trees, Hammer, Landmark
} from 'lucide-react';

interface AdminPanelProps {
  personalDetails?: PersonalDetails | null;
}

// ==========================================
// Letter to Number Mapping Grids
// ==========================================
const CHALDEAN_MAP: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8
};

const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];

// ==========================================
// Traditional Chaldean Compound Descriptions
// ==========================================
const CHALDEAN_COMPOUND_INFO: Record<number, { title: string; warning?: boolean; desc: string }> = {
  10: { title: "Wheel of Fortune", desc: "A number of rise and fall, but ultimate victory. It promises honor, execution of plans, and success if focused." },
  11: { title: "Clenched Fist", desc: "A master of hidden trials. Warns of betrayal, heavy emotional friction, and the need to guard secrets." },
  12: { title: "The Sacrifice / Martyr", desc: "Associated with sacrifice, anxiety, and being misunderstood. Success comes after personal compromise." },
  13: { title: "The Star of the Magician (Rahu Warn)", warning: true, desc: "Traditional Warning: Indicates upheaval, sudden blockages, and intense transformation. Power utilized selfishly leads to ruin. Prone to sudden cataclysms." },
  14: { title: "Star of Temperance (Mercury Warn)", warning: true, desc: "Traditional Warning: Associated with constant movement, physical strain, and risk. Prone to financial speculation losses. Demands moderation." },
  15: { title: "The Magician's Harmony", desc: "Highly magnetic and artistic. Possesses extreme physical charm, material luck, and power of speech." },
  16: { title: "The Shattered Citadel (Ketu Warn)", warning: true, desc: "Traditional Warning: The 'Broken Tower' symbol. Warns of sudden downfall, unexpected failure of plans, and loss. Demands deep spiritual realignment." },
  17: { title: "The Star of the Magi", desc: "A highly fortunate spiritual number. Indicates peace of mind, ultimate protection, and rising above obstacles." },
  18: { title: "Spiritual Strife", desc: "Represents conflict between material desires and the spiritual self. Prone to harsh competition and testing of faith." },
  19: { title: "The Prince of Heaven (Sun Success)", warning: false, desc: "Traditional Promise: Extremely auspicious! Represents ultimate victory, social honor, happiness, and sun-like success. Overcomes all blockages." },
  20: { title: "The Awakening / Judgement", desc: "Indicates a call to a higher purpose, delayed success, but deep mental and psychic realization." },
  21: { title: "The Crown of the Magi", desc: "Extremely fortunate. Promises elevation, security, success in major life campaigns, and ultimate victory." },
  22: { title: "The Blindfold Giant", desc: "A heavy master frequency. Indicates high potential but prone to illusion, errors of judgement, and warnings of deceit." },
  23: { title: "The Royal Star of the Lion", desc: "The most fortunate Chaldean number! Promises success, help from superiors, security, and immense professional luck." },
  24: { title: "The Weaver of Luck", desc: "Brings assistance from powerful friends and opposite gender associates. Highly lucky for domestic and financial matters." },
  25: { title: "The Disciple of Experience", desc: "Indicates success achieved through early struggles, spiritual learning, and profound wisdom gained over time." },
  26: { title: "The Gravestone of Warnings", desc: "Highly hazardous. Prone to heavy delays, disappointment, and bad partnerships. Carry deep Saturn lessons." },
  27: { title: "The Sceptre of Command", desc: "Highly active and intellectual. Guarantees leadership authority, military precision, and career rise." },
  28: { title: "The Trusting Friend (Warning)", warning: true, desc: "Prone to severe setbacks from relying too much on competitors. Success occurs if one works strictly alone." },
  29: { title: "The Mask of Deception", desc: "Warns of severe friction in relationships, sudden losses, and unreliable companions." },
  30: { title: "The Silent Sage", desc: "Reflects deep meditation, mental superiority, but relative social isolation. Highly creative." },
  31: { title: "The Isolated Genius", desc: "Similar to 30, but more detached. Prone to abrupt life turns. High intellectual wealth, low domestic sync." },
  32: { title: "The Royal Star of Wisdom", desc: "Highly favorable. Possesses magnetic communication, major success in public spheres, and financial elevation." },
  33: { title: "The Avatar of Love", desc: "High cosmic frequency. Associated with divine protection, healing others, and unconditional material ease." },
  37: { title: "The Royal Fortune Star", desc: "Extremely lucky. Promises rapid rise, loyal friendships, and major commercial success." },
  42: { title: "The Master Counselor", desc: "Brings peaceful family vibes, great advice, and successful, stable professional networks." },
  44: { title: "The Grounded Architect", desc: "Double- Saturn influence. Heavy material responsibilities, hard-won fortunes, and monumental structures." },
  51: { title: "The Celestial Warrior", desc: "Brings immense courage, sudden rise to military or administrative ranks, and protection from enemies." },
  55: { title: "The Cosmic Intellect", desc: "Unmatched mercury frequency. Rapid thinking, supreme commercial acumen, and technological mastery." }
};

// ==========================================
// Standard Helper Functions
// ==========================================
function reduceToSingleDigit(num: number): number {
  if (num === 0) return 0;
  let s = Math.abs(num);
  while (s > 9) {
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return s;
}

function pythagoreanReduce(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  let s = Math.abs(num);
  while (s > 9) {
    if (s === 11 || s === 22 || s === 33) return s;
    s = s.toString().split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  }
  return s;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ personalDetails }) => {
  // Input states for standalone usage
  const [name, setName] = useState('Raajeev Singh Chauhann');
  const [preferredSpelling, setPreferredSpelling] = useState('Rajeevv Singh Chauhaann');
  const [dob, setDob] = useState('1984-11-23');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');

  // UI Tabs Control
  const [activeTab, setActiveTab] = useState<'FOUR_SYSTEMS' | 'KNOWLEDGE_BASE'>('FOUR_SYSTEMS');
  const [subSystemTab, setSubSystemTab] = useState<'CHALDEAN' | 'PYTHAGOREAN' | 'VEDIC' | 'LOSHU'>('CHALDEAN');

  // Knowledge base list (original)
  const [knowledgeBooks, setKnowledgeBooks] = useState([
    { name: 'Advanced Numerology Course by Raajeev Singh Chauhann.pdf', size: '12.4 MB', status: 'INDEXED & ACTIVATED', date: '2026-06-07' },
    { name: 'Planetary Relations & Remedies Matrix.pdf', size: '4.8 MB', status: 'INDEXED & ACTIVATED', date: '2026-06-07' }
  ]);
  const [newBookName, setNewBookName] = useState('');
  const [editingRemedy, setEditingRemedy] = useState('Lal Kitab Gemstone Remedy: Pukhraj for Conductor (Bhagyank) 3, Ruby for Conductor (Bhagyank) 1.');

  // Pre-populate if active user profile exists
  useEffect(() => {
    if (personalDetails) {
      if (personalDetails.name) {
        setName(personalDetails.name);
        // Default preferred spelling slightly altered for compatibility demonstration
        setPreferredSpelling(personalDetails.name + 'a');
      }
      if (personalDetails.dob) {
        setDob(personalDetails.dob);
      }
      if (personalDetails.gender) {
        setGender(personalDetails.gender);
      }
    }
  }, [personalDetails]);

  const syncWithProfile = () => {
    if (personalDetails) {
      setName(personalDetails.name || 'Vibrations Seeker');
      setPreferredSpelling(personalDetails.name ? personalDetails.name + 'a' : 'Vibrations Seeker');
      setDob(personalDetails.dob || '1994-05-15');
      setGender(personalDetails.gender || 'MALE');
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookName) return;
    setKnowledgeBooks([
      ...knowledgeBooks,
      { name: newBookName, size: '2.5 MB', status: 'INDEXED & ACTIVATED', date: new Date().toISOString().split('T')[0] }
    ]);
    setNewBookName('');
  };

  // ==========================================
  // SYSTEM A: CHALDEAN CALCULATIONS
  // ==========================================
  const calculateChaldeanName = (nameString: string) => {
    const norm = nameString.toUpperCase().replace(/[^A-Z]/g, '');
    let compound = 0;
    const details: { char: string; val: number }[] = [];

    for (let i = 0; i < norm.length; i++) {
      const char = norm[i];
      const val = CHALDEAN_MAP[char] || 0;
      compound += val;
      details.push({ char, val });
    }

    const reduced = reduceToSingleDigit(compound);
    return { compound, reduced, details };
  };

  const chaldeanBirth = calculateChaldeanName(name);
  const chaldeanPreferred = calculateChaldeanName(preferredSpelling);

  // Psychic/Radical number from birth day (1-31)
  const dobParts = dob.split('-');
  const rawDay = parseInt(dobParts[2], 10) || 15;
  const psychicNumber = reduceToSingleDigit(rawDay);

  // Compatibility Score between birth name and preferred spelling (Chaldean)
  const getChaldeanCompatibility = (r1: number, r2: number) => {
    // 1-9 friendship relations
    const compatibilityGrid: Record<number, { friends: number[]; enemies: number[] }> = {
      1: { friends: [1, 2, 3, 5, 9], enemies: [4, 7, 8] },
      2: { friends: [1, 3, 5], enemies: [8, 9] },
      3: { friends: [1, 2, 3, 5, 7, 9], enemies: [6] },
      4: { friends: [5, 6, 8], enemies: [1, 2, 9] },
      5: { friends: [1, 3, 5, 6, 8], enemies: [] },
      6: { friends: [5, 6, 7, 8], enemies: [3] },
      7: { friends: [1, 3, 5, 6], enemies: [8, 9] },
      8: { friends: [4, 5, 6], enemies: [1, 2, 9] },
      9: { friends: [1, 2, 3, 5], enemies: [4, 8] }
    };

    if (r1 === r2) return { score: 100, text: "Excellent Spiritual Harmony (Same Frequencies)", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    
    const rel = compatibilityGrid[r1];
    if (rel) {
      if (rel.friends.includes(r2)) {
        return { score: 90, text: "Highly Synchronized & Supportive", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
      } else if (rel.enemies.includes(r2)) {
        return { score: 45, text: "Frictional/Hostile Vibrational Clash", color: "text-red-600 bg-red-50 border-red-200" };
      }
    }
    return { score: 70, text: "Neutral Alignment", color: "text-amber-600 bg-amber-50 border-amber-200" };
  };

  const nameCompatibility = getChaldeanCompatibility(chaldeanBirth.reduced, chaldeanPreferred.reduced);

  // ==========================================
  // SYSTEM B: PYTHAGOREAN CALCULATIONS
  // ==========================================
  const rawYear = parseInt(dobParts[0], 10) || 1994;
  const rawMonth = parseInt(dobParts[1], 10) || 5;

  // Life Path Number (Pythagorean)
  const reducedDay = pythagoreanReduce(rawDay);
  const reducedMonth = pythagoreanReduce(rawMonth);
  const reducedYear = pythagoreanReduce(rawYear);
  const lifePathNumberPyth = pythagoreanReduce(reducedDay + reducedMonth + reducedYear);

  // Expression Number (Pythagorean full name)
  const calculatePythagoreanName = (nameString: string) => {
    const norm = nameString.toUpperCase().replace(/[^A-Z]/g, '');
    let exprSum = 0;
    let vowelSum = 0;
    let consonantSum = 0;
    const details: { char: string; val: number; isVowel: boolean }[] = [];

    for (let i = 0; i < norm.length; i++) {
      const char = norm[i];
      const val = PYTHAGOREAN_MAP[char] || 0;
      const isVowel = VOWELS.includes(char);
      exprSum += val;
      if (isVowel) vowelSum += val;
      else consonantSum += val;
      details.push({ char, val, isVowel });
    }

    return {
      expr: pythagoreanReduce(exprSum),
      vowels: pythagoreanReduce(vowelSum),
      consonants: pythagoreanReduce(consonantSum),
      details
    };
  };

  const pythNameData = calculatePythagoreanName(name);

  // Maturity Number (Life Path + Expression reduced)
  const maturityNumberPyth = pythagoreanReduce(lifePathNumberPyth + pythNameData.expr);

  // Birthday Number (Birth day reduced or kept as Master)
  const birthdayNumberPyth = pythagoreanReduce(rawDay);

  // ==========================================
  // SYSTEM C: VEDIC NUMEROLOGY
  // ==========================================
  const vedicMulank = reduceToSingleDigit(rawDay);
  
  // Conductor/Bhagyank (Sum of all digits of DOB)
  const dobDigits = dob.replace(/[^0-9]/g, '').split('').map(Number);
  const dobSum = dobDigits.reduce((acc, d) => acc + d, 0);
  const vedicBhagyank = reduceToSingleDigit(dobSum);

  const VEDIC_PLANETS: Record<number, { name: string; description: string; element: string; color: string }> = {
    1: { name: "Sun (Surya)", description: "Soul, ego, leadership power, father, authority, core vitality.", element: "Fire", color: "text-amber-600 bg-amber-50" },
    2: { name: "Moon (Chandra)", description: "Mind, emotions, intuition, peace, mother, sensory awareness.", element: "Water", color: "text-sky-600 bg-sky-50" },
    3: { name: "Jupiter (Guru)", description: "Wisdom, expansion, knowledge, spiritual wealth, teachers.", element: "Ether / Space", color: "text-yellow-600 bg-yellow-50" },
    4: { name: "Rahu (North Node)", description: "Material desires, sudden turns, revolutionary thinking, ambition.", element: "Shadow / Air", color: "text-indigo-600 bg-indigo-50" },
    5: { name: "Mercury (Budha)", description: "Speech, intellect, business intelligence, rapid logic, youth.", element: "Earth", color: "text-emerald-600 bg-emerald-50" },
    6: { name: "Venus (Shukra)", description: "Love, arts, luxury, relationships, beauty, vehicles, comfort.", element: "Water", color: "text-pink-600 bg-pink-50" },
    7: { name: "Ketu (South Node)", description: "Spirituality, detachment, research, sudden insights, liberation.", element: "Shadow / Fire", color: "text-violet-600 bg-violet-50" },
    8: { name: "Saturn (Shani)", description: "Karma, discipline, delay, structured systems, hard labor.", element: "Air / Metal", color: "text-slate-700 bg-slate-50" },
    9: { name: "Mars (Mangal)", description: "Energy, courage, assertion, physically active, defense.", element: "Fire", color: "text-rose-600 bg-rose-50" }
  };

  const getPlanetaryRelationship = (m: number, b: number) => {
    // Relationships mapping
    const relationsGrid: Record<number, { friends: number[]; enemies: number[]; neutrals: number[] }> = {
      1: { friends: [2, 3, 9], enemies: [7, 8], neutrals: [4, 5, 6] },
      2: { friends: [1, 3, 5], enemies: [4, 8, 9], neutrals: [6, 7] },
      3: { friends: [1, 2, 9], enemies: [6], neutrals: [4, 5, 7, 8] },
      4: { friends: [5, 6, 8], enemies: [1, 2, 9], neutrals: [3, 7] },
      5: { friends: [1, 6], enemies: [], neutrals: [2, 3, 4, 7, 8, 9] },
      6: { friends: [5, 8], enemies: [1, 2], neutrals: [3, 4, 7, 9] },
      7: { friends: [1, 3, 5, 6], enemies: [8, 9], neutrals: [2, 4] },
      8: { friends: [4, 5, 6], enemies: [1, 2, 9], neutrals: [3, 7] },
      9: { friends: [1, 2, 3], enemies: [4, 8], neutrals: [5, 6, 7] }
    };

    if (m === b) return { status: "Harmonious Sync (Identical Rulers)", level: "EXTREME", desc: "Your basic nature (Mulank) and path of fate (Bhagyank) are guided by the same planet, resulting in massive, unified energetic focus." };

    const map = relationsGrid[m];
    if (map) {
      if (map.friends.includes(b)) {
        return { status: "Planetary Friend Relationship", level: "HIGH", desc: "The psychic and destiny rulers support each other. Spiritual remedies and path expansion flow with ease and fewer delays." };
      } else if (map.enemies.includes(b)) {
        return { status: "Planetary Inimical Conflict", level: "LOW", desc: "Direct energetic friction between Mulank and Bhagyank. Life might present delays, hard struggles before victory, and requires regular planetary remedies." };
      }
    }
    return { status: "Neutral Alignment", level: "MEDIUM", desc: "Balanced planetary energies. Material and emotional rise progresses at a standard steady pace." };
  };

  const vedicRelation = getPlanetaryRelationship(vedicMulank, vedicBhagyank);

  // ==========================================
  // SYSTEM D: LO SHU GRID
  // ==========================================
  // Extract date of birth digits
  const dobRawDigits = dob.replace(/[^0-9]/g, '').split('').map(Number).filter(n => n !== 0);
  const gridCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  dobRawDigits.forEach(d => {
    if (d >= 1 && d <= 9) {
      gridCounts[d] = (gridCounts[d] || 0) + 1;
    }
  });

  const loshuLayout = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6]
  ];

  // Identifiers for missing and repeated numbers
  const missingNumbers = Object.keys(gridCounts).map(Number).filter(n => gridCounts[n] === 0);
  const repeatedNumbers = Object.entries(gridCounts)
    .map(([num, count]) => ({ num: parseInt(num, 10), count }))
    .filter(x => x.count > 1);

  // Lines definitions to check arrows
  const linesToCheck = [
    { name: "Arrow of Mental / Planning Plane", coords: [4, 9, 2], type: "Row 1" },
    { name: "Arrow of Emotional Strength / Will", coords: [3, 5, 7], type: "Row 2" },
    { name: "Arrow of Practical / Action Plane", coords: [8, 1, 6], type: "Row 3" },
    { name: "Arrow of Thought / Determination", coords: [4, 3, 8], type: "Col 1" },
    { name: "Arrow of Will / Success Plane", coords: [9, 5, 1], type: "Col 2" },
    { name: "Arrow of Action / Coordination", coords: [2, 7, 6], type: "Col 3" },
    { name: "Arrow of Prosperity / Success", coords: [4, 5, 6], type: "Diagonal 1" },
    { name: "Arrow of Spiritual Strength", coords: [2, 5, 8], type: "Diagonal 2" }
  ];

  const activeStrengthArrows = linesToCheck.filter(line => 
    line.coords.every(num => gridCounts[num] > 0)
  );

  const activeWeaknessArrows = linesToCheck.filter(line => 
    line.coords.every(num => gridCounts[num] === 0)
  );

  const getMissingNumberRemedy = (num: number) => {
    const remedies: Record<number, { element: string; remedy: string }> = {
      1: { element: "Water", remedy: "Wear a metallic brass or copper ring, hang a water-fountain picture in the North sector." },
      2: { element: "Earth", remedy: "Keep two crystal towers or rose-quartz spheres in the Southwest corner of the bedroom." },
      3: { element: "Wood", remedy: "Tie a sacred green thread on your left wrist, keep live green plants in the East room." },
      4: { element: "Wood", remedy: "Wear a silver ring on your thumb, display a small green aventurine tree in the Southeast." },
      5: { element: "Earth", remedy: "Wear yellow clothes on Thursday, place a brass metal bowl filled with river pebbles in the center of the house." },
      6: { element: "Metal", remedy: "Wear a golden watch, hang a metal wind chime with 6 hollow rods in the Northwest." },
      7: { element: "Metal", remedy: "Carry a small smoky quartz, wear light grey clothing, or wear a cat's eye bracelet." },
      8: { element: "Earth", remedy: "Feed crows or birds daily, place blue/black decorative crystals in the Northeast corner." },
      9: { element: "Fire", remedy: "Keep a red-colored bulb or oil lamp burning in the South sector, wear coral or carry red thread." }
    };
    return remedies[num] || { element: "General", remedy: "Vedic planetary mantra chanting." };
  };

  const getRepeatedInterpretation = (num: number, count: number) => {
    if (count === 2) {
      return `Doubled Intensity: Amplifies planet ${num} traits beautifully. Highly expressive and protective.`;
    } else if (count === 3) {
      return `Over-vibration: Prone to hyper-activation of ${num} energies, creating restlessness or mood fluctuations.`;
    } else {
      return `Extreme Cluster: Potential blockages. Requires specific metal or color grounding therapies.`;
    }
  };


  return (
    <div id="systems-hub-viewport" className="space-y-8 animate-in fade-in duration-500 text-left">
      
      {/* Upper Mode Selection Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-sm gap-4">
        <div className="space-y-1">
          <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#D97706]" /> LeoFamily Grand Systems Hub
          </h3>
          <p className="text-[#6B7280] text-[11px]">Compare independent Vedic, Chaldean, Pythagorean, and Lo Shu Grid systems side-by-side.</p>
        </div>

        <div className="flex bg-[#F8F4EF] p-1 rounded-2xl border border-[#E5E7EB] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('FOUR_SYSTEMS')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'FOUR_SYSTEMS'
                ? 'bg-[#D97706] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <Compass className="w-4 h-4 animate-spin-slow" /> Independent Calculators
          </button>
          <button
            onClick={() => setActiveTab('KNOWLEDGE_BASE')}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'KNOWLEDGE_BASE'
                ? 'bg-[#1E3A8A] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <Settings className="w-4 h-4" /> Systems Administration
          </button>
        </div>
      </div>

      {activeTab === 'FOUR_SYSTEMS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Dynamic Configuration Form Panel */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[35px] border border-[#E5E7EB] shadow-sm space-y-5">
            <div className="flex justify-between items-center border-b pb-3 border-[#E5E7EB]/70">
              <span className="text-[10px] font-mono text-[#D97706] uppercase tracking-widest font-bold">Input Alignment Control</span>
              {personalDetails && (
                <button
                  onClick={syncWithProfile}
                  className="text-[10px] font-semibold text-[#1E3A8A] bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-all border border-blue-100"
                >
                  <RefreshCw className="w-3 h-3" /> Sync Active Profile
                </button>
              )}
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#6B7280] font-bold">Full Birth Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#D97706]" />
                  <input
                    type="text"
                    className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 outline-none text-[#1F2937] focus:border-[#D97706] font-semibold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#6B7280] font-bold">Current / Preferred Spelling</label>
                <div className="relative">
                  <Star className="absolute left-3.5 top-3.5 h-4 w-4 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Compare with birth spelling..."
                    className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 outline-none text-[#1F2937] focus:border-[#D97706] font-semibold"
                    value={preferredSpelling}
                    onChange={(e) => setPreferredSpelling(e.target.value)}
                  />
                </div>
                <p className="text-[9px] text-slate-400">Used to calculate exact Chaldean phonetic compatibility offsets.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#6B7280] font-bold">Date of Birth (DOB)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-[#D97706]" />
                  <input
                    type="date"
                    className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 outline-none text-[#1F2937] focus:border-[#D97706] font-mono font-bold"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-[#6B7280] font-bold">Gender Alignment</label>
                <select
                  className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl px-4 py-3 outline-none text-[#1F2937] focus:border-[#D97706] font-semibold"
                  value={gender}
                  onChange={(e: any) => setGender(e.target.value)}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="bg-[#D97706]/5 p-4 rounded-2xl border border-[#D97706]/10 text-[10px] text-slate-500 leading-relaxed space-y-1.5">
              <span className="font-bold text-[#D97706] block uppercase tracking-wider">Independent Calculation Guarantee</span>
              <p>Each module isolates letter frequencies according to its respective ancient/standard mapping table. Numbers are NOT mixed or combined.</p>
            </div>
          </div>

          {/* Results Matrices Section */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* System selector navigation bar */}
            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-1">
              {[
                { id: 'CHALDEAN', label: 'A) Chaldean Frequencies' },
                { id: 'PYTHAGOREAN', label: 'B) Pythagorean Grid' },
                { id: 'VEDIC', label: 'C) Vedic Alignment' },
                { id: 'LOSHU', label: 'D) Lo Shu Grid' }
              ].map((subTab) => (
                <button
                  key={subTab.id}
                  onClick={() => setSubSystemTab(subTab.id as any)}
                  className={`px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                    subSystemTab === subTab.id
                      ? 'border-[#D97706] text-[#D97706] bg-[#D97706]/5'
                      : 'border-transparent text-[#6B7280] hover:text-[#1F2937]'
                  }`}
                >
                  {subTab.label}
                </button>
              ))}
            </div>

            {/* Content Stage */}
            <div className="bg-white p-6 rounded-[35px] border border-[#E5E7EB] shadow-sm text-left">
              
              {/* SYSTEM A: CHALDEAN VIEW */}
              {subSystemTab === 'CHALDEAN' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-3 border-[#E5E7EB]/50">
                    <div className="space-y-1">
                      <h4 className="font-playfair text-lg font-black text-slate-800">Authentic Chaldean Sound Frequencies</h4>
                      <p className="text-slate-400 text-[11px]">Primary phonetic sound system mapping values from 1 to 8 (no letter maps to 9).</p>
                    </div>
                    <span className="bg-[#D97706]/10 text-[#D97706] text-[9px] font-mono uppercase font-bold border border-[#D97706]/20 px-3 py-1.5 rounded-full">System A Active</span>
                  </div>

                  {/* Calculations metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Name Number (Compound)</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">{chaldeanBirth.compound}</span>
                      <p className="text-slate-400 text-[10px] mt-2">Cumulative unreduced phonetic energy sum of birth spelling.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Destiny Number (Reduced)</span>
                      <span className="text-3xl font-playfair font-black text-[#D97706] block mt-1">{chaldeanBirth.reduced}</span>
                      <p className="text-slate-400 text-[10px] mt-2">Phonetic expression of your character and opportunities.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 relative overflow-hidden">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Psychic Number (DOB)</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">{psychicNumber}</span>
                      <p className="text-slate-400 text-[10px] mt-2">Core conscious mind derived from birth day ({rawDay}) only.</p>
                    </div>
                  </div>

                  {/* Letter Details Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Phonetic Frequency Grid</span>
                    <div className="flex flex-wrap gap-1.5 p-3.5 bg-[#F8F4EF] rounded-2xl border border-[#E5E7EB]">
                      {chaldeanBirth.details.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm min-w-[36px]">
                          <span className="text-xs font-mono font-bold text-[#1F2937]">{item.char}</span>
                          <span className="text-[10px] font-mono text-[#D97706]">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Master Numbers Warning Displays */}
                  {CHALDEAN_COMPOUND_INFO[chaldeanBirth.compound] ? (
                    <div className={`p-5 rounded-3xl border ${
                      CHALDEAN_COMPOUND_INFO[chaldeanBirth.compound].warning 
                        ? 'bg-amber-50/50 border-amber-200 text-amber-900' 
                        : 'bg-emerald-50/30 border-emerald-100 text-slate-800'
                    } space-y-2`}>
                      <div className="flex items-center gap-2">
                        {CHALDEAN_COMPOUND_INFO[chaldeanBirth.compound].warning ? (
                          <AlertTriangle className="w-5 h-5 text-[#D97706] animate-bounce" />
                        ) : (
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        )}
                        <h5 className="font-playfair font-bold text-md">
                          Birth Compound Number {chaldeanBirth.compound} - {CHALDEAN_COMPOUND_INFO[chaldeanBirth.compound].title}
                        </h5>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600 font-lora italic">
                        "{CHALDEAN_COMPOUND_INFO[chaldeanBirth.compound].desc}"
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                      Birth Compound Total: <span className="font-bold text-slate-800 font-mono">{chaldeanBirth.compound}</span>. This is a balanced, neutral cosmic vibration.
                    </div>
                  )}

                  {/* Name Spelling Compatibility Scoring */}
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-[30px] space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-playfair text-sm font-bold text-slate-800 uppercase tracking-wider">Spelling Compatibility Analyzer</h5>
                      <span className="text-xs font-mono font-bold text-[#D97706]">{nameCompatibility.score}% MATCH</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-white border rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase">Birth spelling</span>
                        <span className="font-bold text-slate-800 block text-sm">{name}</span>
                        <span className="text-[10px] text-[#D97706] font-mono mt-1 block">Value: {chaldeanBirth.compound} ({chaldeanBirth.reduced})</span>
                      </div>
                      <div className="p-3 bg-white border rounded-xl">
                        <span className="text-[9px] text-slate-400 block uppercase font-mono">Preferred spelling</span>
                        <span className="font-bold text-slate-800 block text-sm">{preferredSpelling}</span>
                        <span className="text-[10px] text-[#D97706] font-mono mt-1 block">Value: {chaldeanPreferred.compound} ({chaldeanPreferred.reduced})</span>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${nameCompatibility.color}`}>
                      <span className="font-bold uppercase tracking-wider block mb-1">Result: {nameCompatibility.text}</span>
                      Comparing Birth Root Frequency <span className="font-bold font-mono">{chaldeanBirth.reduced}</span> against Corrected Preferred Spelling Root <span className="font-bold font-mono">{chaldeanPreferred.reduced}</span>. Adjusting spellings modifies active material success channels.
                    </div>
                  </div>

                </div>
              )}

              {/* SYSTEM B: PYTHAGOREAN VIEW */}
              {subSystemTab === 'PYTHAGOREAN' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-3 border-[#E5E7EB]/50">
                    <div className="space-y-1">
                      <h4 className="font-playfair text-lg font-black text-slate-800">Pythagorean Cross-Reference Matrix</h4>
                      <p className="text-slate-400 text-[11px]">Western secondary alignment grid. Standard 1 to 9 alpha-numerical coordinates.</p>
                    </div>
                    <span className="bg-[#1E3A8A]/10 text-[#1E3A8A] text-[9px] font-mono uppercase font-bold border border-[#1E3A8A]/20 px-3 py-1.5 rounded-full">System B Active</span>
                  </div>

                  {/* Calculations metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Life Path Number</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {lifePathNumberPyth}
                        {[11, 22, 33].includes(lifePathNumberPyth) && <span className="text-xs bg-amber-500 text-white ml-2 px-2 py-0.5 rounded font-mono">Master</span>}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">Sum of reduced DOB month, day, and year. Preserves master channels.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Expression Number</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {pythNameData.expr}
                        {[11, 22, 33].includes(pythNameData.expr) && <span className="text-xs bg-amber-500 text-white ml-2 px-2 py-0.5 rounded font-mono">Master</span>}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">Phonetic expression derived from full name under Pythagorean grid.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Soul Urge (Heart's Desire)</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {pythNameData.vowels}
                        {[11, 22, 33].includes(pythNameData.vowels) && <span className="text-xs bg-amber-500 text-white ml-2 px-2 py-0.5 rounded font-mono">Master</span>}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">Your inner, hidden motivations, determined from vowels' values only.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Personality Number</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {pythNameData.consonants}
                        {[11, 22, 33].includes(pythNameData.consonants) && <span className="text-xs bg-amber-500 text-white ml-2 px-2 py-0.5 rounded font-mono">Master</span>}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">The external impression you project, from consonants' values only.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Maturity Number</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {maturityNumberPyth}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">The potential of your mature years, calculated as LP + Expression.</p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">Birthday Number</span>
                      <span className="text-3xl font-playfair font-black text-slate-800 block mt-1">
                        {birthdayNumberPyth}
                      </span>
                      <p className="text-slate-400 text-[10px] mt-2">The core energy of your birth day date ({rawDay}), unreduced if Master.</p>
                    </div>
                  </div>

                  {/* Letter Details Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Pythagorean Standard Letter Mapping</span>
                    <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                      {pythNameData.details.map((item, idx) => (
                        <div key={idx} className={`flex flex-col items-center bg-white px-3 py-1.5 rounded-xl border shadow-sm min-w-[36px] ${
                          item.isVowel ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
                        }`}>
                          <span className="text-xs font-mono font-bold text-[#1F2937]">{item.char}</span>
                          <span className={`text-[10px] font-mono font-bold ${item.isVowel ? 'text-amber-600' : 'text-slate-500'}`}>{item.val}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-slate-400 px-1">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 inline-block"></span> Vowels (Soul Urge)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 inline-block"></span> Consonants (Personality)</span>
                    </div>
                  </div>

                  {/* Master Number Explanations */}
                  {([11, 22, 33].includes(lifePathNumberPyth) || [11, 22, 33].includes(pythNameData.expr)) && (
                    <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl space-y-2 text-xs text-amber-900">
                      <span className="font-bold uppercase tracking-wider block">Master Vibrations Detected</span>
                      <p className="leading-relaxed">
                        Your Pythagorean profile contains Master Numbers. Master Numbers (11, 22, 33) represent highly intense spiritual frequencies that should not be reduced further. They carry massive material or spiritual potential alongside heavier trial expectations.
                      </p>
                    </div>
                  )}

                </div>
              )}

              {/* SYSTEM C: VEDIC VIEW */}
              {subSystemTab === 'VEDIC' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-3 border-[#E5E7EB]/50">
                    <div className="space-y-1">
                      <h4 className="font-playfair text-lg font-black text-slate-800">Vedic Indian Cosmic Alignment</h4>
                      <p className="text-slate-400 text-[11px]">Vedic Indian standard analysis based on Mulank, Bhagyank, and planetary rulers.</p>
                    </div>
                    <span className="bg-[#D97706]/10 text-[#D97706] text-[9px] font-mono uppercase font-bold border border-[#D97706]/20 px-3 py-1.5 rounded-full">System C Active</span>
                  </div>

                  {/* Calculations metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Radical / Psychic (Mulank)</span>
                          <span className="text-4xl font-playfair font-black text-slate-800 block mt-1">{vedicMulank}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${VEDIC_PLANETS[vedicMulank]?.color}`}>
                          {VEDIC_PLANETS[vedicMulank]?.name}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Ruler planet: <span className="font-semibold text-slate-800">{VEDIC_PLANETS[vedicMulank]?.name}</span>. {VEDIC_PLANETS[vedicMulank]?.description}
                      </p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Destiny (Bhagyank)</span>
                          <span className="text-4xl font-playfair font-black text-slate-800 block mt-1">{vedicBhagyank}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${VEDIC_PLANETS[vedicBhagyank]?.color}`}>
                          {VEDIC_PLANETS[vedicBhagyank]?.name}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Ruler planet: <span className="font-semibold text-slate-800">{VEDIC_PLANETS[vedicBhagyank]?.name}</span>. {VEDIC_PLANETS[vedicBhagyank]?.description}
                      </p>
                    </div>
                  </div>

                  {/* Planetary Relationship Section */}
                  <div className="p-5 bg-[#FDFCF7] border border-[#F2E8DC] rounded-[30px] space-y-4">
                    <div className="flex justify-between items-center">
                      <h5 className="font-playfair text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#D97706]" /> Planetary Relationship Synastry
                      </h5>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                        vedicRelation.level === 'EXTREME' || vedicRelation.level === 'HIGH'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : vedicRelation.level === 'LOW'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {vedicRelation.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-lora italic">
                      "{vedicRelation.desc}"
                    </p>

                    {/* Vedic Remedies Alignment */}
                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      <span className="font-bold text-[#D97706] uppercase tracking-wider block text-[10px]">Planetary Remedy Recommendation:</span>
                      <div className="p-4 bg-white border rounded-2xl flex gap-3">
                        <Award className="w-6 h-6 text-[#D97706] flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">Supportive Colors & Metals:</p>
                          <p className="text-slate-500 mt-1 leading-relaxed">
                            {vedicMulank === 1 || vedicBhagyank === 1 ? 'Ruby or Copper accessories. Wear cream, orange, saffron.' : ''}
                            {vedicMulank === 2 || vedicBhagyank === 2 ? 'Pearl or Silver metals. Wear white, off-white, light blue.' : ''}
                            {vedicMulank === 3 || vedicBhagyank === 3 ? 'Yellow Sapphire or Brass. Wear yellow, gold, pastel colors.' : ''}
                            {vedicMulank === 4 || vedicBhagyank === 4 ? 'Gomed gemstone. Wear steel-grey, dark blue. Avoid pure black.' : ''}
                            {vedicMulank === 5 || vedicBhagyank === 5 ? 'Emerald or Bronze. Wear green, emerald shades.' : ''}
                            {vedicMulank === 6 || vedicBhagyank === 6 ? 'Diamond or Silver accessories. Wear pink, white, pastel rose.' : ''}
                            {vedicMulank === 7 || vedicBhagyank === 7 ? 'Cat\'s eye bracelet. Wear multi-colored, grey shades.' : ''}
                            {vedicMulank === 8 || vedicBhagyank === 8 ? 'Iron/Steel accessories. Feed birds, avoid bright red clothes.' : ''}
                            {vedicMulank === 9 || vedicBhagyank === 9 ? 'Red Coral or Copper. Wear vibrant red, saffron. Avoid pale shades.' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* SYSTEM D: LO SHU GRID VIEW */}
              {subSystemTab === 'LOSHU' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-3 border-[#E5E7EB]/50">
                    <div className="space-y-1">
                      <h4 className="font-playfair text-lg font-black text-slate-800">Interactive Lo Shu Magic Grid</h4>
                      <p className="text-slate-400 text-[11px]">3x3 Chinese Magic Square mapping. Digits represent basic elements and material planes.</p>
                    </div>
                    <span className="bg-[#1E3A8A]/10 text-[#1E3A8A] text-[9px] font-mono uppercase font-bold border border-[#1E3A8A]/20 px-3 py-1.5 rounded-full">System D Active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    
                    {/* Visual 3x3 Magic Square SVG Grid */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900 rounded-[28px] shadow-lg max-w-[240px] w-full aspect-square relative border border-slate-700">
                        {loshuLayout.map((row, rIdx) => 
                          row.map((num) => {
                            const count = gridCounts[num] || 0;
                            const isActive = count > 0;
                            return (
                              <div
                                key={`loshu-interactive-${rIdx}-${num}`}
                                className={`relative rounded-2xl flex flex-col justify-center items-center select-none transition-all duration-500 overflow-hidden ${
                                  isActive
                                    ? 'bg-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                                    : 'bg-slate-800/80 border border-slate-700/50 text-slate-600'
                                }`}
                              >
                                <span className="text-2xl font-playfair font-black">{num}</span>
                                {count > 0 && (
                                  <span className="absolute top-1 right-2 text-[9px] font-black bg-slate-950 text-amber-400 rounded-full h-4 w-4 flex items-center justify-center font-mono border border-amber-400/40">
                                    x{count}
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 block font-mono">Input DOB Digits mapped: {dobRawDigits.join(', ')}</span>
                    </div>

                    {/* Planes and Arrows of Strength */}
                    <div className="md:col-span-7 space-y-4 text-xs">
                      
                      {/* Strength Arrows */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Active Arrows of Strength ({activeStrengthArrows.length})
                        </span>
                        {activeStrengthArrows.length > 0 ? (
                          <div className="space-y-1.5">
                            {activeStrengthArrows.map((arrow, idx) => (
                              <div key={idx} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <p className="font-bold text-emerald-800">{arrow.name} ({arrow.coords.join('-')})</p>
                                <p className="text-slate-500 mt-0.5 text-[10px]">
                                  {arrow.coords.includes(4) && arrow.coords.includes(9) && arrow.coords.includes(2) ? 'Excellent analytical capability, high memory index.' : ''}
                                  {arrow.coords.includes(3) && arrow.coords.includes(5) && arrow.coords.includes(7) ? 'Unmatched emotional resilience, high spiritual focus.' : ''}
                                  {arrow.coords.includes(8) && arrow.coords.includes(1) && arrow.coords.includes(6) ? 'Excellent material execution, structured business acumen.' : ''}
                                  {arrow.coords.includes(4) && arrow.coords.includes(5) && arrow.coords.includes(6) ? 'Auspicous prosperity line! Rapid material elevation and monetary stability.' : ''}
                                  {arrow.coords.includes(2) && arrow.coords.includes(5) && arrow.coords.includes(8) ? 'Deep spiritual resilience, high intuition, peaceful attitude.' : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No fully completed lines of strength detected in birth date.</p>
                        )}
                      </div>

                      {/* Weakness Arrows */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Arrows of Weakness ({activeWeaknessArrows.length})
                        </span>
                        {activeWeaknessArrows.length > 0 ? (
                          <div className="space-y-1.5">
                            {activeWeaknessArrows.map((arrow, idx) => (
                              <div key={idx} className="p-3 bg-amber-50/40 border border-amber-100 rounded-xl">
                                <p className="font-bold text-amber-800">{arrow.name} ({arrow.coords.join('-')})</p>
                                <p className="text-slate-500 mt-0.5 text-[10px]">
                                  {arrow.coords.includes(4) && arrow.coords.includes(9) && arrow.coords.includes(2) ? 'Prone to mental fatigue or over-thinking. Blocked ideas.' : ''}
                                  {arrow.coords.includes(3) && arrow.coords.includes(5) && arrow.coords.includes(7) ? 'Prone to emotional isolation, loneliness, vulnerable trust.' : ''}
                                  {arrow.coords.includes(8) && arrow.coords.includes(1) && arrow.coords.includes(6) ? 'Difficulty converting thoughts to physical outcomes. Delay in actions.' : ''}
                                  {arrow.coords.includes(4) && arrow.coords.includes(5) && arrow.coords.includes(6) ? 'Struggles with financial flow. Requires metal wind chimes remedy.' : ''}
                                  {arrow.coords.includes(2) && arrow.coords.includes(5) && arrow.coords.includes(8) ? 'Prone to emotional insecurity or distrust.' : ''}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic">No completely missing lines of weakness detected.</p>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Missing Numbers Remedies table */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">Missing Numbers Remedies Guide</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {missingNumbers.map((num) => {
                        const rem = getMissingNumberRemedy(num);
                        return (
                          <div key={num} className="p-4 bg-slate-50 border rounded-2xl flex gap-3">
                            <span className="w-7 h-7 rounded-lg bg-red-100 border text-red-700 font-bold flex items-center justify-center font-mono flex-shrink-0">
                              {num}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800">Missing Element: {rem.element}</p>
                              <p className="text-slate-500 text-[10px] mt-0.5">{rem.remedy}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      ) : (
        /* ORIGINAL KNOWLEDGE BASE PANEL MANAGEMENT */
        <div className="space-y-8">
          
          {/* Knowledge Base Matrix Management */}
          <div className="glass-panel p-8 rounded-[40px] bg-white border border-[#E5E7EB] shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-playfair text-xl font-bold text-[#1F2937] tracking-wider">Astro-Numerology Knowledge Base Management</h3>
              <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#10B981] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-bold border border-[#10B981]/20">Vedic Engine Active</span>
            </div>
            <p className="text-[#6B7280] text-xs">
              Upload and index proprietary astrology or numerology textbook matrices to feed the AI Report Generator automatically.
            </p>

            {/* Upload form simulate */}
            <form onSubmit={handleUpload} className="flex gap-4 max-w-lg">
              <input
                type="text"
                placeholder="Astro textbook PDF file name..."
                className="flex-1 bg-[#F8F4EF] border border-[#E5E7EB] focus:border-[#D97706] rounded-2xl px-5 py-3 outline-none text-xs text-[#1F2937]"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-3 rounded-2xl transition duration-300 text-xs tracking-wider uppercase cursor-pointer"
              >
                Index PDF
              </button>
            </form>

            {/* Textbook lists */}
            <div className="space-y-4 pt-4">
              <h4 className="text-xs uppercase font-mono tracking-widest text-[#D97706] font-bold">Currently Indexed Books & Matrixes</h4>
              <div className="space-y-3">
                {knowledgeBooks.map((book, idx) => (
                  <div key={idx} className="p-5 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl flex justify-between items-center flex-wrap gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-[#1F2937] block">{book.name}</span>
                      <span className="text-[10px] text-[#6B7280] font-mono">Size: {book.size} | Uploaded on: {book.date}</span>
                    </div>
                    <span className="text-[9px] font-mono bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 px-3 py-1.5 rounded-full font-bold">
                      {book.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Forecast & Remedies editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Remedy template modifier */}
            <div className="glass-panel p-8 rounded-[40px] bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-playfair text-lg font-bold text-[#1F2937] tracking-wide">Planetary Remedies Template Modifier</h3>
              <p className="text-[#6B7280] text-xs">Edit core formula outputs compiled by the rule engine.</p>
              <div className="space-y-4 pt-2">
                <textarea
                  className="w-full bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl p-4 h-32 focus:border-[#D97706] outline-none text-xs text-[#1F2937] leading-relaxed font-mono"
                  value={editingRemedy}
                  onChange={(e) => setEditingRemedy(e.target.value)}
                />
                <button
                  onClick={() => alert('Remedy templates updated successfully!')}
                  className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold px-6 py-2.5 rounded-xl transition duration-300 text-xs tracking-wider uppercase cursor-pointer"
                >
                  Save Formula Base
                </button>
              </div>
            </div>

            {/* Analytics Insights */}
            <div className="glass-panel p-8 rounded-[40px] bg-white border border-[#E5E7EB] shadow-sm space-y-4">
              <h3 className="font-playfair text-lg font-bold text-[#1F2937] tracking-wide">Synthesized Systems Traffic Analytics</h3>
              <p className="text-[#6B7280] text-xs">Real-time statistics of report requests, downloads, and synastry matches.</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl">
                  <span className="text-xs text-[#6B7280] font-mono block uppercase font-bold">Reports Synced</span>
                  <span className="text-3xl font-playfair font-black text-[#D97706] mt-2 block">1,482</span>
                </div>

                <div className="p-4 bg-[#F8F4EF] border border-[#E5E7EB] rounded-2xl">
                  <span className="text-xs text-[#6B7280] font-mono block uppercase font-bold">Synastry Match</span>
                  <span className="text-3xl font-playfair font-black text-[#D97706] mt-2 block">949</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPanel;
