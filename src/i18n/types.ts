export type SupportedLanguage = 'hi' | 'en' | 'mr' | 'bn' | 'gu';

export interface LanguageInfo {
  code: SupportedLanguage;
  label: string;
  nativeName: string;
  shortName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', shortName: 'हि' },
  { code: 'en', label: 'English', nativeName: 'English', shortName: 'EN' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', shortName: 'म' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', shortName: 'বা' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', shortName: 'ગુ' },
];

export interface TranslationDictionary {
  common: {
    brandName: string;
    brandSubtitle: string;
    tagline: string;
    loading: string;
    calculating: string;
    error: string;
    retry: string;
    save: string;
    cancel: string;
    edit: string;
    reset: string;
    loadDemo: string;
    viewDetails: string;
    backToHub: string;
    printDossier: string;
    downloadPdf: string;
    shareReport: string;
    dateOfBirth: string;
    fullName: string;
    mobileNumber: string;
    gender: string;
    male: string;
    female: string;
    other: string;
    email: string;
    optional: string;
    required: string;
    mulank: string;
    bhagyank: string;
    kuaNumber: string;
    personalYear: string;
    luckyNumbers: string;
    luckyDays: string;
    luckyColors: string;
    luckyGems: string;
    disclaimerTitle: string;
    disclaimerText: string;
    copyright: string;
    authorityNote: string;
    quickDirectory: string;
    faqMulankBhagyankQ: string;
    faqMulankBhagyankA: string;
    language: string;
    selectLanguage: string;
    searchTools: string;
    allTools: string;
    explore: string;
  };
  nav: {
    home: string;
    coreCategory: string;
    personalCategory: string;
    lifeHomeCategory: string;
    businessCategory: string;
    compatibilityCategory: string;
    reportCategory: string;
    consultationCategory: string;
    coreLoshu: string;
    coreDashboard: string;
    mobileScanner: string;
    nameNumerology: string;
    signatureAudit: string;
    medicalNumerology: string;
    numeroVastu: string;
    kuaEnergy: string;
    vehicleNumerology: string;
    houseNumerology: string;
    businessNumerology: string;
    luckyDatesFinder: string;
    childLuckyNames: string;
    marriageCompatibility: string;
    masterReport: string;
    aiConsultation: string;
  };
  profile: {
    quickProfileTitle: string;
    activeProfile: string;
    noProfileSet: string;
    setupProfilePrompt: string;
    editProfileTitle: string;
    editProfileDesc: string;
    profileUpdated: string;
  };
  hub: {
    heroTitle: string;
    heroSubtitle: string;
    masterDossierCardTitle: string;
    masterDossierCardDesc: string;
    viewMasterDossierBtn: string;
    activeMatrixTitle: string;
    driverConductorMatch: string;
    toolsGridTitle: string;
    toolsGridSubtitle: string;
    vedicMethodologyTitle: string;
    vedicMethodologyDesc: string;
    launchTool: string;
  };
  loshu: {
    title: string;
    subtitle: string;
    birthKundaliGrid: string;
    presentNumbers: string;
    missingNumbers: string;
    repeatedNumbers: string;
    driverReinforced: string;
    destinyAdded: string;
    destinyReinforced: string;
    birthLayer: string;
    driverLayer: string;
    destinyLayer: string;
    planesTitle: string;
    arrowsTitle: string;
    mentalPlane: string;
    emotionalPlane: string;
    practicalPlane: string;
    thoughtPlane: string;
    willPlane: string;
    actionPlane: string;
    goldenRajYog: string;
    silverRajYog: string;
    karmicLessons: string;
    remediesTitle: string;
  };
  mobile: {
    title: string;
    subtitle: string;
    enterMobileNumber: string;
    mobileNumberHelp: string;
    calculateBtn: string;
    totalCompoundVibration: string;
    singleDigitRoot: string;
    yogasTitle: string;
    pairsTitle: string;
    planetaryFrequencies: string;
    wealthEffect: string;
    relationshipEffect: string;
    carrierEffect: string;
    remedySuggestions: string;
  };
  name: {
    title: string;
    subtitle: string;
    chaldeanSystem: string;
    pythagoreanSystem: string;
    compoundNameNumber: string;
    singleNameRoot: string;
    vowelHeartDesire: string;
    consonantPersonality: string;
    nameCorrectionAdvice: string;
    spellingSuggestions: string;
  };
  marriage: {
    title: string;
    subtitle: string;
    groomDetails: string;
    brideDetails: string;
    compatibilityScore: string;
    sevenLayerAnalysis: string;
    emotionalHarmony: string;
    intellectualHarmony: string;
    destinyHarmony: string;
    remediesForCouples: string;
  };
  luckyDates: {
    title: string;
    subtitle: string;
    selectPurpose: string;
    dateRange: string;
    findDatesBtn: string;
    auspiciousDatesFound: string;
    vibrationAnalysis: string;
    planetaryTransit: string;
    avoidDates: string;
  };
  report: {
    masterReportTitle: string;
    executiveSummary: string;
    coreVibrations: string;
    lifeCycleForecast: string;
    vastuKuaBlueprint: string;
    signatureGuidelines: string;
    gemstoneGuidance: string;
    mantraRemedies: string;
    finalCounsel: string;
    printReadyDossier: string;
  };
  dynamic: {
    mulankIs: string;
    bhagyankIs: string;
    kuaIs: string;
    personalYearIs: string;
    destinyAddedExplanation: string;
    driverReinforcedExplanation: string;
    missingNumberExplanation: string;
    repeatedNumberExplanation: string;
    compoundInterpretation: string;
    compatibilityResultText: string;
  };
}
