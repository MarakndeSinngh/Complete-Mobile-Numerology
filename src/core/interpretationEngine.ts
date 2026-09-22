import { NUMBER_PROFILES } from './numberMeaningEngine';
import { EnhancedLoshuGridResult } from './enhancedLoshuEngine';
import { MulankBhagyankSynthesis } from './bhagyankEngine';

export interface DomainInterpretation {
  domain: string;
  score: number;
  headline: string;
  detailedAnalysis: string;
  strengths: string[];
  growthAreas: string[];
  actionableGuidance: string[];
}

export interface ComprehensiveInterpretationReport {
  personality: DomainInterpretation;
  career: DomainInterpretation;
  wealth: DomainInterpretation;
  relationships: DomainInterpretation;
  healthWellness: DomainInterpretation;
  spirituality: DomainInterpretation;
  synthesisSummary: string;
}

export function generateDomainInterpretations(
  mulank: number,
  bhagyank: number,
  synthesis: MulankBhagyankSynthesis,
  enhancedGrid: EnhancedLoshuGridResult
): ComprehensiveInterpretationReport {
  const pMulank = NUMBER_PROFILES[mulank] || NUMBER_PROFILES[1];
  const pBhagyank = NUMBER_PROFILES[bhagyank] || NUMBER_PROFILES[1];

  const personality: DomainInterpretation = {
    domain: 'व्यक्तित्व एवं आत्म-पहचान (Personality & Identity)',
    score: 85,
    headline: `${pMulank.grahaHi} मूलांक स्वभाव एवं ${pBhagyank.grahaHi} भाग्य दिशा`,
    detailedAnalysis: `आपका मूल स्वभाव ${pMulank.grahaHi} के विशिष्ट गुणों से संचालित है। ${pMulank.personality} दैनिक निर्णयों में ${synthesis.instinctiveNature}`,
    strengths: pMulank.positiveTraits.slice(0, 4),
    growthAreas: pMulank.shadowTraits.slice(0, 3),
    actionableGuidance: [
      `अपने व्यक्तित्व को ${pMulank.balancedExpression} में स्थिर रखें।`,
      `${pMulank.element} तत्व के ऊर्जा प्रवाह को नियमित ध्यान और शांति द्वारा संतुलित रखें।`
    ]
  };

  const career: DomainInterpretation = {
    domain: 'करियर एवं व्यावसायिक भाग्य (Career & Professional Destiny)',
    score: 88,
    headline: `रणनीतिक कार्यकुशलता एवं व्यावसायिक प्रगति`,
    detailedAnalysis: `करियर के क्षेत्र में आपकी राह ${pMulank.grahaHi} की पहल और ${pBhagyank.grahaHi} के अंतिम लक्ष्य के सुंदर समन्वय से तय होती है। आप ऐसे कार्यों में विशेष सफल होते हैं जहां ${pBhagyank.decisionMaking} की आवश्यकता हो।`,
    strengths: [...new Set([...pMulank.career.slice(0, 3), ...pBhagyank.career.slice(0, 3)])],
    growthAreas: ['तीव्र व्यक्तिगत पहल और संगठनात्मक धैर्य के बीच संतुलन बनाए रखना'],
    actionableGuidance: [
      `अपनी जन्म कुंडली के अनुकूल प्रमुख क्षेत्रों पर ध्यान दें: ${pBhagyank.career.slice(0, 3).join(', ')}।`,
      `करियर में महत्वपूर्ण बदलावों के लिए ${pBhagyank.grahaHi} से प्रभावित पर्सनल ईयर का लाभ उठाएं।`
    ]
  };

  const wealth: DomainInterpretation = {
    domain: 'धन एवं भौतिक समृद्धि (Wealth & Material Prosperity)',
    score: 82,
    headline: `दीर्घकालिक परिसंपत्ति निर्माण एवं आर्थिक स्थिरता`,
    detailedAnalysis: `आपकी वित्तीय समझ ${pMulank.wealth} को दर्शाती है, जिसे ${pBhagyank.business} का मजबूत सहयोग मिलता है।`,
    strengths: ['दीर्घकालिक संपत्ति निर्माण', 'व्यापारिक सूझबूझ', 'सुरक्षित पारिवारिक बचत'],
    growthAreas: ['अस्थिर बाजार के समय जल्दबाजी में जोखिम भरे निवेश से बचना'],
    actionableGuidance: [
      `अनुशासित और नैतिक तरीकों से निरंतर पूंजी संचय करें।`,
      `आर्थिक कागजात और बहीखाते हमेशा सुव्यवस्थित रखें।`
    ]
  };

  const relationships: DomainInterpretation = {
    domain: 'संबंध एवं पारिवारिक जीवन (Relationships & Family Dynamics)',
    score: 80,
    headline: `पारस्परिक आदर, निष्ठा एवं पारिवारिक समर्पण`,
    detailedAnalysis: `${pMulank.relationships} आपके संबंधों की गहरी सीख है: ${pBhagyank.relationships}`,
    strengths: ['भावनात्मक निष्ठा', 'पारिवारिक जिम्मेदारी', 'सुरक्षात्मक देखभाल'],
    growthAreas: ['अति-सुरक्षात्मक स्वभाव या साथी से अपने जैसी ही गति की अपेक्षा करना'],
    actionableGuidance: [
      `पारिवारिक सामंजस्य के लिए शांत और निष्कपट बातचीत का अभ्यास करें।`,
      `जीवनसाथी और सहयोगियों की व्यक्तिगत स्वतंत्रता का पूरा सम्मान करें।`
    ]
  };

  const healthWellness: DomainInterpretation = {
    domain: 'स्वास्थ्य एवं प्राण ऊर्जा (Wellness & Energy Vitality)',
    score: 78,
    headline: `प्राकृतिक तत्व संतुलन एवं ऊर्जा सामंजस्य`,
    detailedAnalysis: `पारंपरिक रूप से यह ऊर्जा ${pMulank.healthSymbolism} से जुड़ी है। निरंतर उच्च कार्यक्षमता के लिए नियमित जीवनशैली और शरीर की सीमाओं का सम्मान जरूरी है।`,
    strengths: ['प्राकृतिक जीवन शक्ति', 'सहनशीलता व ऊर्जा'],
    growthAreas: ['अत्यधिक काम के दबाव में मानसिक व शारीरिक तनाव'],
    actionableGuidance: [
      `दैनिक दिनचर्या में प्राणायाम और भरपूर जलपान को शामिल करें।`,
      `चिकित्सीय सलाह का यह विकल्प नहीं है; किसी भी शारीरिक परेशानी में डॉक्टर से परामर्श लें।`
    ]
  };

  const spirituality: DomainInterpretation = {
    domain: 'आध्यात्मिक विकास एवं उच्च चेतना (Spiritual Growth)',
    score: 90,
    headline: `अंतःप्रकाश जागरण एवं कर्म योग सिद्धि`,
    detailedAnalysis: `${pBhagyank.spirituality} आपकी आत्मिक यात्रा सांसारिक कर्तव्यों (कर्म योग) को निभाते हुए अंतर्मुखी ज्ञान प्राप्त करने का मार्ग है।`,
    strengths: ['अंतर्ज्ञान और विवेक', 'सृष्टि के नियमों के प्रति आदर', 'परोपकारी मानवीय भावना'],
    growthAreas: ['कठिन समय में विरक्ति या निराशा से बचना'],
    actionableGuidance: [
      `दैनिक शांत ध्यान अथवा मंत्र जप करें: ${pMulank.remedialTheme}।`,
      `अपने मुख्य ग्रह के दिन निःस्वार्थ सेवा (दान) करें।`
    ]
  };

  const synthesisSummary = `LeoFamily वैदिक अंकज्योतिष के अनुसार, आपकी जन्म कुंडली में मूलांक (ड्राइवर) ${mulank} और भाग्यांक (कंडक्टर) ${bhagyank} के बीच ${synthesis.relationship === 'harmonious' ? 'अत्यंत मित्रवत व शुभ' : synthesis.relationship === 'supportive' ? 'सहयोगात्मक' : 'विशेष साधना योग्य'} संबंध है, और आपके Lo Shu ग्रिड में ${enhancedGrid.effectivePresentDigits.length} अंक सक्रिय हैं।`;

  return {
    personality,
    career,
    wealth,
    relationships,
    healthWellness,
    spirituality,
    synthesisSummary
  };
}
