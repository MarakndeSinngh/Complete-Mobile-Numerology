export interface SpecialGoalCombination {
  goalId: string;
  goalName: string;
  hindiTitle: string;
  patterns: string[];
  description: string;
  traditionalInterpretation: string;
  source: string;
}

export const SPECIAL_GOAL_COMBINATIONS: Record<string, SpecialGoalCombination> = {
  married_life: {
    goalId: 'GOAL_MARRIED_LIFE',
    goalName: 'Good Married Life & Domestic Bliss',
    hindiTitle: 'सुखी दांपत्य जीवन',
    patterns: ['2567', '5666', '5667'],
    description: 'चंद्रमा (2) की भावनात्मक समझ, बुध (5) का संवाद, शुक्र (6) का प्रेम और केतु (7) का आत्मिक जुड़ाव लाता है।',
    traditionalInterpretation: '2567 या 5 के साथ 666 का संयोग दांपत्य जीवन में मधुरता, आपसी निष्ठा और पारिवारिक सुख-शांति प्रदान करता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  education: {
    goalId: 'GOAL_EDUCATION',
    goalName: 'Higher Education & Academic Excellence',
    hindiTitle: 'उच्च शिक्षा और शैक्षणिक सफलता',
    patterns: ['6555', '3569'],
    description: 'शुक्र (6) की एकाग्रता, बुध (555) की गणना व याददाश्त, गुरु (3) का ज्ञान और मंगल (9) की प्रतिस्पर्धात्मक ऊर्जा को जोड़ता है।',
    traditionalInterpretation: 'कठिन बोर्ड परीक्षाओं, उच्च शिक्षा, विश्वविद्यालय प्रवेश और शोध कार्यों में संलग्न विद्यार्थियों के लिए अत्यंत शुभ।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  foreign_travel: {
    goalId: 'GOAL_FOREIGN_TRAVEL',
    goalName: 'Foreign Travel & Overseas Opportunities',
    hindiTitle: 'विदेश यात्रा और अंतरराष्ट्रीय अवसर',
    patterns: ['3567', '1113', '3579', '2756'],
    description: 'गुरु (3), बुध (5), शुक्र (6), केतु (7) और मंगल (9) के समन्वय से विदेश गमन और यात्रा के मजबूत योग बनते हैं।',
    traditionalInterpretation: 'अंतरराष्ट्रीय स्तर पर नौकरी, वर्क परमिट, विदेश व्यापार विस्तार और वैश्विक पुनर्वास के अवसरों को आकर्षित करता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  health: {
    goalId: 'GOAL_HEALTH',
    goalName: 'Vitality & Traditional Wellness Harmony',
    hindiTitle: 'आरोग्य और जीवन शक्ति',
    patterns: ['3569'],
    description: 'गुरु (3) का आंतरिक ज्ञान, बुध (5) की मानसिक सजगता, शुक्र (6) की ताजगी और मंगल (9) की शारीरिक ऊर्जा का संतुलन।',
    traditionalInterpretation: 'शारीरिक स्फूर्ति, ऊर्जा और समग्र स्वास्थ्य संतुलन में सहायक सिद्ध होता है। (यह पारम्परिक सलाह है, चिकित्सकीय उपचार नहीं)।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  relationships: {
    goalId: 'GOAL_RELATIONSHIPS',
    goalName: 'Harmonious Relationships & Social Support',
    hindiTitle: 'मधुर संबंध और सामाजिक सहयोग',
    patterns: ['3567'],
    description: 'गुरु (3), बुध (5), शुक्र (6) और केतु (7) मिलकर आपसी सम्मान, स्पष्ट बातचीत और सौहार्द का वातावरण बनाते हैं।',
    traditionalInterpretation: 'सामाजिक और पारिवारिक तनाव दूर करने, अच्छे मित्रों और सच्चे मार्गदर्शकों का सहयोग पाने में लाभकारी।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  promotion: {
    goalId: 'GOAL_PROMOTION',
    goalName: 'Career Promotion & Corporate Elevation',
    hindiTitle: 'पदोन्नति और करियर में प्रगति',
    patterns: ['4368'],
    description: 'राहु (4) की रणनीतिक सूझबूझ, गुरु (3) की सलाह, शुक्र (6) का सहयोग और शनि (8) का प्रशासनिक प्रभाव जोड़ता है।',
    traditionalInterpretation: 'वरिष्ठ प्रबंधकीय पदों, पदोन्नति (Promotion) और कॉरपोरेट क्षेत्र में मान-सम्मान पाने में सहायक।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  luck_factor: {
    goalId: 'GOAL_LUCK_FACTOR',
    goalName: 'Luck Factor & Auspicious Synchronicity',
    hindiTitle: 'भाग्य वृद्धि और शुभ संयोग',
    patterns: ['4566'],
    description: 'राहु (4) का अचानक लाभ, बुध (5) की सही व्यापारिक समझ और दोहरे शुक्र (66) का वैभव व भाग्य योग।',
    traditionalInterpretation: 'सही समय पर उचित अवसर, उच्चाधिकारियों का सहयोग और अटके हुए कार्यों में अचानक सफलता दिलाता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  will_power: {
    goalId: 'GOAL_WILL_POWER',
    goalName: 'Will Power, Resolve & Unyielding Focus',
    hindiTitle: 'दृढ़ इच्छाशक्ति और आत्मबल',
    patterns: ['1159'],
    description: 'दोहरे सूर्य (11) का दृढ़ संकल्प, बुध (5) की व्यावहारिक योजना और मंगल (9) की निर्भीक क्रियाशीलता का संगम।',
    traditionalInterpretation: 'आलस्य और टालमटोल की आदत दूर कर जीवन में अटूट अनुशासन और इच्छाशक्ति का निर्माण करता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  court_case: {
    goalId: 'GOAL_COURT_CASE',
    goalName: 'Legal Defense & Court Case Settlement',
    hindiTitle: 'विधिक रक्षा और न्यायालयीन विवाद निपटारा',
    patterns: ['4488'],
    description: 'दोहरे राहु (44) की कुशाग्र रणनीति और दोहरे शनि (88) का धैर्य, जो जटिल कानूनी व अदालती विवादों में शक्ति देता है।',
    traditionalInterpretation: 'दीर्घकालिक कानूनी प्रक्रियाओं और संस्थागत विवादों में संबल और सही निर्णय लेने की क्षमता बढ़ाता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  money_attraction: {
    goalId: 'GOAL_MONEY_ATTRACTION',
    goalName: 'Money Attraction & Financial Abundance',
    hindiTitle: 'धन आकर्षण और वित्तीय समृद्धि',
    patterns: ['3467'],
    description: 'गुरु (3) का धन-ज्ञान, राहु (4) का बड़ा लेन-देन, शुक्र (6) का नगद प्रवाह (Cash Flow) और केतु (7) की बचत।',
    traditionalInterpretation: 'आमदनी के नए स्रोत खोलने, लाभकारी सौदों और आर्थिक मजबूती व तरलता को गति देता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  property: {
    goalId: 'GOAL_PROPERTY',
    goalName: 'Property Acquisition & Real Estate Wealth',
    hindiTitle: 'भूमि-भवन और अचल संपत्ति लाभ',
    patterns: ['2588'],
    description: 'चंद्रमा (2) का गृह सुख, बुध (5) के स्पष्ट दस्तावेज और दोहरे शनि (88) का विशाल भूमि व अचल संपत्ति योग।',
    traditionalInterpretation: 'आवासीय मकान, प्लॉट, कमर्शियल प्रॉपर्टी और अचल संपत्ति खरीदने के लिए अत्यंत प्रभावशाली योग।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  govt_job: {
    goalId: 'GOAL_GOVT_JOB',
    goalName: 'Government Job & Public Sector Authority',
    hindiTitle: 'सरकारी सेवा और प्रशासनिक अधिकार',
    patterns: ['1458'],
    description: 'सूर्य (1) का राजसत्ता अधिकार, राहु (4) की प्रतियोगी परीक्षा सूझबूझ, बुध (5) का साक्षात्कार और शनि (8) का स्थायी पद।',
    traditionalInterpretation: 'सिविल सेवा, राज्य प्रशासनिक सेवाओं और सरकारी उपक्रमों की तैयारी करने वालों के लिए अनुकूल।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  construction_house: {
    goalId: 'GOAL_CONSTRUCTION_HOUSE',
    goalName: 'Construction of House & Infrastructure Building',
    hindiTitle: 'गृह निर्माण और भवन विस्तार',
    patterns: ['4568'],
    description: 'राहु (4) का वास्तु ब्लूप्रिंट, बुध (5) की स्वीकृतियां, शुक्र (6) का आंतरिक सौंदर्य और शनि (8) का भवन निर्माण।',
    traditionalInterpretation: 'मकान निर्माण की शुरुआत, प्रगति और आवासीय या व्यावसायिक भवन पूर्ण करने में आ रही रुकावटें दूर करता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  business_growth: {
    goalId: 'GOAL_BUSINESS_GROWTH',
    goalName: 'Business Growth & Commercial Expansion',
    hindiTitle: 'व्यापार वृद्धि और व्यावसायिक विस्तार',
    patterns: ['1159', '1559'],
    description: 'सूर्य-बुध-मंगल का शक्तिशाली योग, जो ग्राहक आधार, उत्पादों की बिक्री और बाजार में दबदबा बढ़ाने में सक्षम है।',
    traditionalInterpretation: 'व्यापारिक टर्नओवर, डीलरशिप नेटवर्क और व्यावसायिक मुनाफे में तेज वृद्धि सुनिश्चित करता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  politics: {
    goalId: 'GOAL_POLITICS',
    goalName: 'Political Influence & Mass Leadership',
    hindiTitle: 'राजनीतिक प्रभाव और जनसमर्थन',
    patterns: ['1348'],
    description: 'सूर्य (1) का नेतृत्व, गुरु (3) का मार्गदर्शन, राहु (4) का जनसमर्थन और शनि (8) का निरंतर जनसेवा समर्पण।',
    traditionalInterpretation: 'जनप्रतिनिधियों, सामाजिक कार्यकर्ताओं और राजनीतिक रणनीतिकारों के लिए प्रतिष्ठा व प्रभाव बढ़ाता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  prosperity: {
    goalId: 'GOAL_PROSPERITY',
    goalName: 'Overall Prosperity & Auspicious Lifestyle',
    hindiTitle: 'समग्र समृद्धि और ऐश्वर्य',
    patterns: ['1668'],
    description: 'सूर्य (1) की प्रतिष्ठा, दोहरे शुक्र (66) का सर्वोच्च भौतिक व पारिवारिक सुख और शनि (8) का स्थायी स्थायित्व।',
    traditionalInterpretation: 'पीढ़ी-दर-पीढ़ी चलने वाली पारिवारिक समृद्धि, विलासिता और समाज में सम्मानित दर्जा दिलाता है।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  },
  peace_of_mind: {
    goalId: 'GOAL_PEACE_OF_MIND',
    goalName: 'Peace of Mind & Mental Tranquility',
    hindiTitle: 'मानसिक शांति और सौहार्द',
    patterns: ['4556', '5151'],
    description: 'बुध और शुक्र के सौम्य संतुलन से तंत्रिका तंत्र को शांत कर मानसिक शांति और सहजता प्रदान करता है।',
    traditionalInterpretation: 'मानसिक तनाव और बेचैनी कम करता है, गहरी नींद लाने और पारिवारिक सुख-शांति स्थापित करने में सहायक।',
    source: 'Mobile PIN & Combination Reference (PDF 2, Pages 46-47)'
  }
};
