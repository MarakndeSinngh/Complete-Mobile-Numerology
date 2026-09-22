/**
 * LEOFAMILY 90-DAY TRANSFORMATION & ACTION PLAN ENGINE
 * Generates structured, three-phase actionable remediation plan:
 * Phase 1: Days 1–30 (Foundation & Cleansing)
 * Phase 2: Days 31–60 (Remediation & Alignment)
 * Phase 3: Days 61–90 (Integration & Mastery)
 */

export interface ActionPlanPhase {
  phase: number;
  days: string;
  title: string;
  focus: string;
  objective: string;
  actions: string[];
  milestone: string;
}

export interface NinetyDayActionPlan {
  overview: string;
  phases: (ActionPlanPhase[] & {
    preparation?: ActionPlanPhase;
    remediation?: ActionPlanPhase;
    observation?: ActionPlanPhase;
  });
  dailyHabits: string[];
  keyHabits: string[];
  cautions: string[];
}

export function generate90DayActionPlan(input: {
  mulank: number;
  bhagyank: number;
  missingNumbers: number[];
  repeatedNumbers: number[];
  weakPlanes: string[];
}): NinetyDayActionPlan {
  const { mulank, bhagyank, missingNumbers, repeatedNumbers } = input;

  const phase1: ActionPlanPhase = {
    phase: 1,
    days: 'दिन 1–30',
    title: 'चरण 1: आधारशिला एवं ऊर्जा शोधन (Foundation & Cleansing)',
    focus: 'दैनिक दिनचर्या का नियमन एवं अवरोधित ऊर्जा का निष्कासन',
    objective: 'आंतरिक मानसिक शांति, शारीरिक शुद्धि और जन्म कुंडली के प्रमुख मूलांक-भाग्यांक को सकारात्मक गति देना।',
    actions: [
      `प्रातःकाल सूर्योदय के समय उठें और मूलांक #${mulank} के अनुकूल मंत्र जप या 10 मिनट शांत ध्यान करें।`,
      `अपने कार्यक्षेत्र (Office / Study Desk) और शयनकक्ष को पूरी तरह स्वच्छ व अव्यवस्था-मुक्त (Declutter) करें।`,
      `अनावश्यक वाद-विवाद, कटु वचनों और देर रात के भारी गरिष्ठ भोजन से पूर्ण दूरी बनाएं।`,
      missingNumbers.length > 0
        ? `अनुपस्थित अंक (${missingNumbers.slice(0, 2).map(n => `#${n}`).join(', ')}) के प्राथमिक वैदिक उपाय (जैसे उपयुक्त रंग व दिशा का सदुपयोग) आरंभ करें।`
        : 'दैनिक जीवन में सकारात्मक सोच और आत्म-संयम का निरंतर अभ्यास बनाए रखें।'
    ],
    milestone: '30 दिनों के भीतर मानसिक भटकाव में कमी, बेहतर नींद और कार्य निष्पादन में स्पष्ट स्थिरता का अनुभव।'
  };

  const phase2: ActionPlanPhase = {
    phase: 2,
    days: 'दिन 31–60',
    title: 'चरण 2: ग्रहीय संतुलन एवं सक्रिय उपाय (Remediation & Alignment)',
    focus: 'लक्ष्य केंद्रित प्रयास, अनुकूल दिशाओं का प्रयोग एवं व्यावहारिक उपाय',
    objective: 'व्यावसायिक, वित्तीय एवं व्यक्तिगत संबंधों में सकारात्मक ऊर्जा प्रवाह को सक्रिय रूप से बढ़ाना।',
    actions: [
      `भाग्यांक #${bhagyank} की शुभ दिशा (कुआ दिशा अनुसार) की ओर मुख करके महत्वपूर्ण व्यावसायिक निर्णय व कार्य करें।`,
      `साप्ताहिक अनुकूल उपवास अथवा सात्विक आहार का निष्ठापूर्वक पालन करें।`,
      `वित्तीय योजनाओं और बजट में अनुशासन लाएं; अनावश्यक दिखावे या जल्दबाजी के निवेश से बचें।`,
      repeatedNumbers.length > 0
        ? `अति-सक्रिय अंक (#${repeatedNumbers[0]}) की अतिरिक्त ऊर्जा को संतुलित करने हेतु शांत व्यायाम व संयम अपनाएं।`
        : 'कार्यक्षेत्र में सहयोगियों के साथ संवाद को स्पष्ट, विनम्र और पारदर्शी बनाए रखें।'
    ],
    milestone: '60 दिनों में वित्तीय फैसलों में स्पष्टता, रिश्तों में मधुरता और महत्वपूर्ण कार्यों में सकारात्मक प्रगति।'
  };

  const phase3: ActionPlanPhase = {
    phase: 3,
    days: 'दिन 61–90',
    title: 'चरण 3: स्थायित्व एवं जीवनशैली एकीकरण (Integration & Mastery)',
    focus: 'सकारात्मक आदतों को स्थायी दिनचर्या का स्वाभाविक अंग बनाना',
    objective: 'उपायों के दीर्घकालिक परिणामों को स्थिर रखना और जीवन के हर क्षेत्र में निरंतर समृद्धि प्राप्त करना।',
    actions: [
      'दैनिक सात्विक आदतों को अपने जीवन का स्वाभाविक और स्थायी अंग बनाएं।',
      'महीने में कम से कम एक बार अपनी प्रगति, ऊर्जा स्तर और प्राथमिकताओं का शांत आत्म-मूल्यांकन करें।',
      'सप्ताह में एक बार अपनी क्षमतानुसार किसी जरूरतमंद व्यक्ति या बेजुबान जीव की निस्वार्थ सेवा करें।',
      'वार्षिक पर्सनल ईयर (Personal Year) के ग्रहीय प्रवाह के अनुसार अपनी आगामी 6 माह की योजनाओं को निर्धारित करें।'
    ],
    milestone: '90 दिनों की पूर्णता पर पूर्ण मानसिक संतुलन, अटूट आत्म-विश्वास और जीवन पथ में स्पष्ट आध्यात्मिक व भौतिक उन्नति।'
  };

  const phasesList: ActionPlanPhase[] = [phase1, phase2, phase3];
  const phases = Object.assign(phasesList, {
    preparation: phase1,
    remediation: phase2,
    observation: phase3
  });

  const dailyHabits = [
    'प्रातःकाल तांबे या कांच के पात्र से गुनगुना शुद्ध जल पिएं और दिन की शुरुआत सकारात्मक संकल्प से करें।',
    'दिन में कम से कम 10 मिनट मौन रहकर अपने विचारों की गति को धीमा और एकाग्र करें।',
    'सोने से कम से कम 1 घंटा पहले मोबाइल फोन व इलेक्ट्रॉनिक स्क्रीन्स को बंद कर दें।',
    'प्रत्येक भोजन को बिना जल्दबाजी किए, शांत मन से और चबाकर ग्रहण करें।'
  ];

  const cautions = [
    'अचानक और बिना सोचे-समझे बड़े वित्तीय या भावनात्मक निर्णय लेने से बचें।',
    'दूसरों की नकारात्मक बातों या आलोचना को अपने मानसिक संतुलन पर हावी न होने दें।',
    'दैनिक दिनचर्या और नींद के समय में बार-बार अनावश्यक फेरबदल न करें।',
    'सफलता मिलने पर अहंकार या अति-उत्साह में अपने नैतिक सिद्धांतों से कभी समझौता न करें।'
  ];

  const overview = `यह 90-दिवसीय व्यक्तिगत कार्ययोजना आपके मूलांक ${mulank} और भाग्यांक ${bhagyank} की ग्रहीय ऊर्जाओं को संतुलित करने के लिए चरणबद्ध रूप से तैयार की गई है। 30-30 दिनों के तीन विशिष्ट चरणों में यह योजना आपके स्वास्थ्य, करियर, धन और संबंधों में स्थायी सकारात्मक परिवर्तन लाने में पूर्ण सक्षम है।`;

  return {
    overview,
    phases,
    dailyHabits,
    keyHabits: dailyHabits,
    cautions
  };
}
