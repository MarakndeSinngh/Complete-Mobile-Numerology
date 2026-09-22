export interface DetailedRepetitionEntry {
  number: number;
  count: number; // 1, 2, 3, 4, 5+
  level: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUADRUPLE_PLUS';
  meaning: string;
  strengthenedQualities: string;
  possibleExcess: string;
  practicalExpression: string;
  careerExpression: string;
  relationshipExpression: string;
  traditionalWellnessReflection: string;
  balancingRecommendation: string;
  source: string;
}

export const REPETITION_DETAILED_DATABASE: Record<number, Record<number, DetailedRepetitionEntry>> = {
  1: {
    1: {
      number: 1,
      count: 1,
      level: 'SINGLE',
      meaning: 'सूर्य का संतुलित प्रभाव; स्वस्थ आत्मविश्वास, स्पष्ट बातचीत, स्वतंत्र सोच और स्वाभाविक गरिमा।',
      strengthenedQualities: 'मानसिक स्पष्टता, आत्मसम्मान, निष्पक्ष निर्णय लेने की क्षमता और स्वाभाविक नेतृत्व।',
      possibleExcess: 'नगण्य; बिना अहंकार के संतुलित आत्म-सम्मान।',
      practicalExpression: 'दूसरों के विचारों का सम्मान करते हुए अपनी बात स्पष्टता और शालीनता से रखना।',
      careerExpression: 'भरोसेमंद व्यक्तिगत योगदानकर्ता या संतुलित टीम लीडर।',
      relationshipExpression: 'स्वावलंबी साथी जो स्वस्थ भावनात्मक जुड़ाव और सम्मान बनाए रखता है।',
      traditionalWellnessReflection: 'संतुलित सौर ऊर्जा, स्थिर हृदय गति और अच्छी जीवन शक्ति।',
      balancingRecommendation: 'प्रातःकाल 10 मिनट सूर्य के प्रकाश में बैठें और पर्याप्त जल पिएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 1,
      count: 2,
      level: 'DOUBLE',
      meaning: 'प्रभावी व्यक्तित्व, प्रभावशाली वाणी, नेतृत्व क्षमता और महत्वाकांक्षी सोच।',
      strengthenedQualities: 'त्वरित निर्णय क्षमता, बुलंद आवाज और आकर्षक नेतृत्व कौशल।',
      possibleExcess: 'दूसरों की धीमी गति या निर्णय न ले पाने पर कभी-कभी अधीरता।',
      practicalExpression: 'ग्रुप चर्चाओं और बैठकों में आत्मविश्वास से आगे बढ़कर पहल करना।',
      careerExpression: 'एग्जीक्यूटिव मैनेजमेंट, उद्यमिता (Entrepreneurship), पब्लिक स्पीकिंग और प्रशासनिक पद।',
      relationshipExpression: 'सक्रिय, परिवार की रक्षा करने वाले और समर्पित साथी; परस्पर सम्मान की अपेक्षा।',
      traditionalWellnessReflection: 'हल्का शारीरिक ताप; कैफीन और चाय का सेवन सीमित रखें।',
      balancingRecommendation: 'दूसरों को ध्यान से सुनने का अभ्यास करें और दिन में तांबे के बर्तन में रखा जल पिएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 1,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अत्यधिक आत्मनिर्भरता, प्रचंड व्यक्तिगत महत्वाकांक्षा, स्वतंत्र कार्यशैली और वर्चस्व।',
      strengthenedQualities: 'अटल संकल्प, एकाग्र ध्यान और नए क्षेत्रों में पहल करने का अदम्य साहस।',
      possibleExcess: 'अधिकारवादी व्यवहार, टीम की सहमति पर अधीरता और अत्यधिक खरी-खरी बात कहना।',
      practicalExpression: 'सरकारी या संस्थागत मंजूरी के इंतजार के बजाय अपने दम पर स्वतंत्र रूप से काम करना पसंद करते हैं।',
      careerExpression: 'संस्थापक (Founder), स्वतंत्र दूरदर्शी उद्यमी और संकट में तेजी से सुधार लाने वाले विशेषज्ञ।',
      relationshipExpression: 'पारिवारिक निर्णयों में हावी होने की संभावना; बातचीत में कोमलता और लचीलापन अपनाएं।',
      traditionalWellnessReflection: 'तनाव में सिरदर्द, गर्दन या कंधे में जकड़न की संभावना।',
      balancingRecommendation: 'शीतली प्राणायाम करें और उत्तर देने से पहले 5 सेकंड मौन रहने का अभ्यास करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 1,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-सूर्य ऊर्जा; क्लासिकल अंकशास्त्र के अनुसार कुप्रबंधन, चिड़चिड़ापन/गुस्सा, अहंकार का टकराव और तालमेल में कठिनाई।',
      strengthenedQualities: 'अडिग इच्छाशक्ति और असाधारण व्यक्तिगत रफ्तार।',
      possibleExcess: 'कुप्रबंधन, तेज गुस्सा, मानसिक तनाव, अहंकारी रुख और समझौते या सामंजस्य से इनकार।',
      practicalExpression: 'अत्यधिक आंतरिक दबाव; दूसरों को काम सौंपने के बजाय सब कुछ खुद नियंत्रित करने की आदत।',
      careerExpression: 'अकेले काम करने वाले विजनरी; सहयोगी टीम संरचनाओं में सामंजस्य बैठाने में संघर्ष।',
      relationshipExpression: 'अहंकार के टकराव के कारण रिश्तों में खिंचाव; साथी को अनसुना महसूस हो सकता है।',
      traditionalWellnessReflection: 'ब्लड प्रेशर में उतार-चढ़ाव, सिरदर्द या सर्वाइकल तनाव की संभावना; नियमित स्वास्थ्य जांच कराएं।',
      balancingRecommendation: 'प्रातःकाल शांत मन से सूर्य को जल (अर्घ्य) दें, गहरे श्वास का अभ्यास करें और रविवार को जरूरतमंदों को गुड़ या गेहूं दान करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  2: {
    1: {
      number: 2,
      count: 1,
      level: 'SINGLE',
      meaning: 'चंद्रमा का संतुलित प्रभाव; सौम्य अंतर्ज्ञान, कूटनीतिक समझदारी, भावनात्मक बुद्धिमत्ता और सहयोग की भावना।',
      strengthenedQualities: 'धैर्य, दूसरों को ध्यान से सुनना, संवेदनशील परामर्श और शांतिप्रिय स्वभाव।',
      possibleExcess: 'नगण्य; भावनात्मक संवेदनशीलता और व्यक्तिगत सीमाओं का सुंदर संतुलन।',
      practicalExpression: 'विवादों को शांति से सुलझाने वाले कुशल मध्यस्थ के रूप में कार्य करना।',
      careerExpression: 'मानव संसाधन (HR), टीम समन्वय, क्लाइंट रिलेशंस, काउंसलिंग और स्वास्थ्य सेवा।',
      relationshipExpression: 'स्नेही, केयरिंग, वफादार और हर कदम पर साथ निभाने वाले जीवनसाथी।',
      traditionalWellnessReflection: 'संतुलित शारीरिक जल तत्व, गहरी नींद और स्वस्थ दिनचर्या।',
      balancingRecommendation: 'चांदी के पात्र या कांच के गिलास से पानी पिएं और शाम को शांत टहलें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 2,
      count: 2,
      level: 'DOUBLE',
      meaning: 'तीव्र भावनात्मक संवेदनशीलता, कलात्मक प्रतिभा, गहरा अंतर्ज्ञान (Intuitive radar) और सहानुभूति।',
      strengthenedQualities: 'रचनात्मकता, माहौल की ऊर्जा को तुरंत भांप लेना और गहरी हीलिंग क्षमता।',
      possibleExcess: 'आस-पास के माहौल से जल्दी प्रभावित होना और सामान्य आलोचना को भी दिल पर ले लेना।',
      practicalExpression: 'कमरे में प्रवेश करते ही बिना कुछ बोले लोगों की भावनाओं को समझ लेना।',
      careerExpression: 'मनोविज्ञान, ललित कलाएं, रचनात्मक लेखन, डिप्लोमैटिक काउंसलिंग और हीलिंग।',
      relationshipExpression: 'अत्यंत रोमांटिक और कोमल स्वभाव; समय-समय पर भावनात्मक संबल और प्यार की अपेक्षा।',
      traditionalWellnessReflection: 'नींद के समय में उतार-चढ़ाव या मौसम बदलने पर सर्दी-जुकाम की संवेदनशीलता।',
      balancingRecommendation: 'अपनी भावनात्मक सीमाएं स्पष्ट रखें और देर रात तक जागने से बचें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 2,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अत्यधिक भावुकता, भावनात्मक रूप से जल्दी आहत होना, मूड स्विंग्स और दूसरों पर निर्भरता।',
      strengthenedQualities: 'गहरी आध्यात्मिक करुणा और विलक्षण काव्यात्मक कल्पनाशीलता।',
      possibleExcess: 'बार-बार मूड बदलना, अनिर्णय की स्थिति और दूसरों के दुखों को अपने ऊपर ओढ़ लेना।',
      practicalExpression: 'सामाजिक मेलजोल के बाद ऊर्जा बहाल करने के लिए एकांत में समय की आवश्यकता।',
      careerExpression: 'एकांत कलात्मक कार्य, विशेष चिकित्सीय परामर्श और सामाजिक सेवा।',
      relationshipExpression: 'भावनात्मक रूप से अत्यधिक अपेक्षाएं; उपेक्षित महसूस होने पर गहरी निराशा।',
      traditionalWellnessReflection: 'तनाव से सिरदर्द, भावनात्मक तनाव के कारण पाचन में गड़बड़ी और ऊर्जा में गिरावट।',
      balancingRecommendation: 'हल्के चांदी के आभूषण पहनें, चांदी के गिलास में पानी पिएं और ध्यान करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 2,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-चंद्र प्रभाव; क्लासिकल अंकशास्त्र के अनुसार मूड स्विंग्स, डिप्रेशन की प्रवृत्ति, ओवरथिंकिंग और भावनात्मक नाजुकता।',
      strengthenedQualities: 'अलौकिक अंतर्ज्ञान और असीम कलात्मक कल्पना।',
      possibleExcess: 'गंभीर मूड स्विंग्स, निराशावादी विचार, अत्यधिक ओवरथिंकिंग और भावनात्मक रूप से कमजोर पड़ना।',
      practicalExpression: 'काल्पनिक आशंकाओं के कारण निर्णय न ले पाना (Paralysis by analysis)।',
      careerExpression: 'कठोर और आक्रामक कॉर्पोरेट माहौल में असहज; शांत और रचनात्मक माहौल में श्रेष्ठ कार्य।',
      relationshipExpression: 'दिल टूटने और अत्यधिक संवेदनशीलता का गहरा जोखिम; छोटी बातों पर आहत होना।',
      traditionalWellnessReflection: 'चिंता, भय, लो ब्लड प्रेशर की संभावना और पाचन की कमजोरी; नियमित जांच कराएं।',
      balancingRecommendation: 'शुद्ध चांदी के गिलास से पानी पिएं, अनुलोम-विलोम प्राणायाम करें, माता की सेवा करें और पूर्णिमा को ध्यान करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  3: {
    1: {
      number: 3,
      count: 1,
      level: 'SINGLE',
      meaning: 'बृहस्पति (गुरु) का संतुलित विवेक; आशावाद, सीखने की ललक, स्पष्ट वक्ता और उच्च नैतिक मूल्य।',
      strengthenedQualities: 'बौद्धिक गहराई, उत्साह, परामर्श देने की स्वाभाविक प्रतिभा और उदार दृष्टिकोण।',
      possibleExcess: 'नगण्य; ज्ञान बांटने और दूसरों से सीखने का सुंदर संतुलन।',
      practicalExpression: 'जटिल विचारों को भी सरल और रोचक अंदाज में दूसरों को समझाना।',
      careerExpression: 'शिक्षा, कानूनी परामर्श, मैनेजमेंट कंसल्टेंसी, मीडिया व प्रकाशन।',
      relationshipExpression: 'संस्कारित, उत्साहवर्धक, ज्ञानवान और खुशमिजाज जीवनसाथी।',
      traditionalWellnessReflection: 'संतुलित मेटाबॉलिज्म, स्वस्थ पाचन और नियमित दिनचर्या।',
      balancingRecommendation: 'प्रेरक साहित्य पढ़ें और अपना ज्ञान निस्वार्थ भाव से दूसरों के साथ साझा करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 3,
      count: 2,
      level: 'DOUBLE',
      meaning: 'विद्वत्तापूर्ण अधिकार, उत्कृष्ट शिक्षण क्षमता, विशाल रचनात्मकता और दार्शनिक गहराई।',
      strengthenedQualities: 'प्रभावशाली वक्तृत्व कला, प्रेरक मार्गदर्शन, विपुल लेखन और सकारात्मक सोच।',
      possibleExcess: 'परिवार व मित्रों को बार-बार उपदेश देने की आदत और कभी-कभी अव्यावहारिक आदर्शवाद।',
      practicalExpression: 'किसी भी संस्था या समूह में स्वाभाविक रूप से मेंटर और सलाहकार की भूमिका निभाना।',
      careerExpression: 'विश्वविद्यालय प्रोफेसर, लेखक, एग्जीक्यूटिव कोच और वरिष्ठ आध्यात्मिक सलाहकार।',
      relationshipExpression: 'उदार और स्नेहशील; घर में ज्ञानवर्धक और दार्शनिक चर्चाओं को महत्व देते हैं।',
      traditionalWellnessReflection: 'मीठे या भारी भोजन की ओर रुझान; आहार में संतुलन बनाए रखें।',
      balancingRecommendation: 'माथे पर केसर या चंदन का तिलक लगाएं और गुरुवार को सात्विक आहार लें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 3,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अथाह बौद्धिक विस्तार, लगातार बोलने की आदत, अत्यधिक आदर्शवाद और व्यावहारिक कार्यों से दूरी।',
      strengthenedQualities: 'ज्ञान का विशाल भंडार, दूरगामी विजन और प्रेरणादायक भाषण शैली।',
      possibleExcess: 'लगातार बोलते रहना, दूसरों की बात बीच में काटना और जमीनी अमल में आलस्य।',
      practicalExpression: 'बिना मांगे लंबी सलाह देकर कभी-कभी सामने वाले को थका देना।',
      careerExpression: 'सैद्धांतिक शोधकर्ता, अंतरराष्ट्रीय वक्ता और थिंक-टैंक दार्शनिक।',
      relationshipExpression: 'दार्शनिक विचारों में खोए रहने के कारण घरेलू जिम्मेदारियों में कभी-कभी अनदेखी।',
      traditionalWellnessReflection: 'वजन बढ़ने की प्रवृत्ति, सुस्त पाचन और शारीरिक निष्क्रियता।',
      balancingRecommendation: 'गुरुवार को 1-2 घंटे मौन व्रत का अभ्यास करें और दैनिक शारीरिक व्यायाम अवश्य करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 3,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-गुरु विस्तार; क्लासिकल अंकशास्त्र के अनुसार वजन बढ़ना, अत्यधिक बातूनी स्वभाव और किसी की भी बात न सुनने की जिद।',
      strengthenedQualities: 'असीमित सैद्धांतिक ज्ञान और विशाल वैचारिक क्षमता।',
      possibleExcess: 'वजन बढ़ना, किसी की बात न सुनना, लगातार बोलते रहना और वैचारिक हठ।',
      practicalExpression: 'बातचीत में पूरा नियंत्रण रखना और व्यावहारिक साथियों के सुझावों को नकारना।',
      careerExpression: 'टीम में तालमेल बैठाने में कठिनाई; केवल अपने सिद्धांतों पर काम करने की जिद।',
      relationshipExpression: 'जीवनसाथी को बातचीत में अनसुना महसूस होना; एकतरफा संवाद का जोखिम।',
      traditionalWellnessReflection: 'मोटापा, लिवर/पाचन पर भार और ब्लड शुगर में उतार-चढ़ाव; स्वास्थ्य का ध्यान रखें।',
      balancingRecommendation: 'गुरुवार को मौन व्रत रखें, केला व अत्यधिक मीठे से परहेज करें और निर्धन छात्रों को पुस्तकें या पीली वस्तुएं दान करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  4: {
    1: {
      number: 4,
      count: 1,
      level: 'SINGLE',
      meaning: 'राहु/यूरेनस का संतुलित प्रभाव; व्यावहारिक व्यवस्था, तकनीकी कौशल और नए ढंग से समस्या समाधान।',
      strengthenedQualities: 'व्यवस्थित कार्यप्रणाली, सिस्टम थिंकिंग और संगठनात्मक तार्किकता।',
      possibleExcess: 'नगण्य; बिना जिद्दीपन के स्वस्थ तार्किक दृष्टिकोण।',
      practicalExpression: 'मजबूत और सुरक्षित चरणबद्ध प्रक्रियाएं बनाना जिससे काम में कोई चूक न हो।',
      careerExpression: 'सॉफ्टवेयर इंजीनियरिंग, प्रोजेक्ट आर्किटेक्चर, ऑपरेशंस मैनेजमेंट और अकाउंटिंग।',
      relationshipExpression: 'भरोसेमंद, वफादार और व्यावहारिक साथी जो परिवार को मजबूत आधार प्रदान करता है।',
      traditionalWellnessReflection: 'स्थिर नर्वस सिस्टम, अच्छी सहनशक्ति और मजबूत शारीरिक ढांचा।',
      balancingRecommendation: 'दैनिक दिनचर्या को व्यवस्थित रखें और प्रकृति के बीच समय बिताएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 4,
      count: 2,
      level: 'DOUBLE',
      meaning: 'तेज कुशाग्र बुद्धि, लीक से हटकर सोचने का हुनर, तकनीकी दक्षता और तेज गति से काम।',
      strengthenedQualities: 'तकनीकी नवाचार, पैटर्न पहचानना और व्यवस्थाओं का रणनीतिक पुनर्गठन।',
      possibleExcess: 'अपने तरीकों पर अड़े रहना और पारंपरिक नियमों पर अचानक खीझना।',
      practicalExpression: 'धीमी और पुरानी कार्यप्रणालियों को नए, आधुनिक और प्रभावी तरीकों से बदलना।',
      careerExpression: 'साइबर सिक्योरिटी, फिनटेक इनोवेशन, आधुनिक इंजीनियरिंग और कॉर्पोरेट रीस्ट्रक्चरिंग।',
      relationshipExpression: 'गहरे निष्ठावान, लेकिन अपने निजी स्पेस और स्वतंत्र आदतों को पसंद करते हैं।',
      traditionalWellnessReflection: 'स्क्रीन के ज्यादा इस्तेमाल पर नसों में तनाव या नींद में खलल की संभावना।',
      balancingRecommendation: 'कमरे में शुद्ध चंदन की सुगंध रखें, शनिवार को श्वान (कुत्तों) को भोजन दें और स्क्रीन टाइम सीमित करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 4,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अत्यधिक मानसिक सक्रियता, क्रांतिकारी विचार, निरंतर बेचैनी और गहरा संदेह।',
      strengthenedQualities: 'जीनियस स्तर की पैटर्न पहचान और विलक्षण तकनीकी अंतर्ज्ञान।',
      possibleExcess: 'अकारण चिंता, करियर में अचानक बदलाव, सहयोगियों पर संदेह और अनिद्रा।',
      practicalExpression: 'सिस्टम में छोटी से छोटी कमी या खामी ढूंढने में घंटों लगे रहना।',
      careerExpression: 'क्रिप्टोग्राफी, फॉरेंसिक इंटेलिजेंस और उन्नत तकनीकी उद्यम।',
      relationshipExpression: 'कभी-कभी अप्रत्याशित और अलग-थलग व्यवहार; जीवनसाथी से अत्यधिक धैर्य की आवश्यकता।',
      traditionalWellnessReflection: 'मानसिक तनाव, अचानक सिरदर्द और अनियमित नींद चक्र।',
      balancingRecommendation: 'घर की छत साफ रखें, नंगे पैर हरी घास पर चलें और ॐ राहवे नमः का जप करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 4,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-राहु तीव्रता; क्लासिकल अंकशास्त्र के अनुसार अचानक भारी लाभ-हानि, मानसिक भ्रम/वहम, किसी पर विश्वास न कर पाना और लगातार सिरदर्द।',
      strengthenedQualities: 'जटिल डिजिटल, वर्चुअल और तकनीकी मायाजाल को सुलझाने में असाधारण महारत।',
      possibleExcess: 'अचानक वित्तीय या शारीरिक उतार-चढ़ाव, वहम और भ्रम में जीना, किसी पर भरोसा न होना और लगातार सिरदर्द।',
      practicalExpression: 'हर जगह छुपे हुए इरादे देखना और लंबे समय तक साझेदारी निभाने में परेशानी।',
      careerExpression: 'करियर में अचानक बड़े मोड़, कानूनी जांच का जोखिम और अत्यधिक जोखिम भरे सौदे।',
      relationshipExpression: 'संदेही स्वभाव से वैवाहिक जीवन में तनाव; पारदर्शी संवाद बनाए रखना आवश्यक।',
      traditionalWellnessReflection: 'लगातार सिरदर्द, नसों में तनाव और अनिद्रा; नियमित चिकित्सीय सलाह लें।',
      balancingRecommendation: 'घर की छत और ईशान कोण को बिल्कुल साफ रखें, श्वान को रोटी दें, चंदन का उपयोग करें और राहु शांति के उपाय करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  5: {
    1: {
      number: 5,
      count: 1,
      level: 'SINGLE',
      meaning: 'बुध का संतुलित प्रभाव; फुर्तीला संवाद, व्यापारिक सूझबूझ, हर माहौल में ढलने की कला और आकर्षण।',
      strengthenedQualities: 'जल्दी सीखना, सामाजिक कुशलता, वित्तीय समझ और हाजिरजवाबी।',
      possibleExcess: 'नगण्य; बिना चंचलता के स्वस्थ जिज्ञासा।',
      practicalExpression: 'बदलती परिस्थितियों में आसानी से ढलना और हर वर्ग के लोगों से सहज संवाद करना।',
      careerExpression: 'सेल्स, मार्केटिंग, पत्रकारिता, रिटेल व्यापार, पब्लिक रिलेशंस और कंसल्टिंग।',
      relationshipExpression: 'जीवंत, मनोरंजक, स्पष्टवादी और भावनात्मक रूप से सुलझे हुए साथी।',
      traditionalWellnessReflection: 'संतुलित नर्वस सिस्टम और स्पष्ट, मधुर वाणी प्रवाह।',
      balancingRecommendation: 'कार्यस्थल पर एक हरा पौधा रखें और नियमित सामाजिक संवाद बनाए रखें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 5,
      count: 2,
      level: 'DOUBLE',
      meaning: 'तीव्र गणना गति, शानदार नेटवर्किंग, उच्च व्यापारिक वाक्पटुता और एक साथ कई काम करने का हुनर।',
      strengthenedQualities: 'प्रभावशाली बातचीत (Negotiation), बाजार की नब्ज पहचानना और बड़ा संपर्क दायरा।',
      possibleExcess: 'चंचलता, एक साथ कई प्रोजेक्ट शुरू करके उन्हें अधूरा छोड़ देना।',
      practicalExpression: 'कई डील्स, कॉल्स और प्रोजेक्ट्स को सहजता और आकर्षण के साथ संभालना।',
      careerExpression: 'अंतरराष्ट्रीय व्यापार, फिनटेक, मीडिया डायरेक्शन और वेंचर नेगोशिएशन।',
      relationshipExpression: 'उत्साही, सहज और मिलनसार; नीरस दिनचर्या से ऊब जाते हैं।',
      traditionalWellnessReflection: 'मानसिक बेचैनी और अत्यधिक स्क्रीन या सूचनाओं से मानसिक थकान।',
      balancingRecommendation: 'बुधवार को गाय को हरा चारा खिलाएं और शाम को डिजिटल उपकरणों से दूरी बनाएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 5,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अत्यधिक तेज दिमाग, बिखरा हुआ ध्यान, हाइपरएक्टिव बातचीत और अधीरता।',
      strengthenedQualities: 'तीव्र विचार प्रवाह, वाक्चातुर्य और तुरंत नई योजनाएं बनाने का कौशल।',
      possibleExcess: 'सतहीपन, दूसरों की बात काटना, वित्तीय चंचलता और बिना सोचे-समझे सौदे करना।',
      practicalExpression: 'एक प्रोजेक्ट 80% पूरा होते ही किसी नए विचार के पीछे भागना।',
      careerExpression: 'डे-ट्रेडिंग, वायरल न्यूज, त्वरित ब्रोकरेज और फ्रीलांस कॉमर्स।',
      relationshipExpression: 'शांत और स्थिर दिनचर्या में टिकना मुश्किल; लगातार नएपन और मानसिक रोमांच की चाह।',
      traditionalWellnessReflection: 'अनिद्रा, पाचन में गैस/तनाव, जल्दी-जल्दी बोलने से थकान और बेचैनी।',
      balancingRecommendation: 'शांत ध्यान का अभ्यास करें, तुलसी के पौधे की सेवा करें और हरी सब्जियों का सेवन करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 5,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-बुध विचलन; क्लासिकल अंकशास्त्र के अनुसार धन हानि, आलस्य/सुस्ती, तर्कहीन बातें करना और धोखे/घोटाले के चक्कर में फंसना।',
      strengthenedQualities: 'अत्यंत तेज भाषाई फुर्ती और त्वरित गणना रिफ्लेक्स।',
      possibleExcess: 'धन का नुकसान, आलस्य व सुस्ती, बेतुकी बातें करना, सट्टेबाजी/शॉर्टकट में नुकसान और अविश्वसनीय अनुबंध।',
      practicalExpression: 'जल्दी अमीर बनने की योजनाओं में कूदना और उत्तेजित होने पर असंगत बातें करना।',
      careerExpression: 'जल्दबाजी के फैसलों या शॉर्टकट्स के कारण व्यापार में अचानक गिरावट का जोखिम।',
      relationshipExpression: 'पारिवारिक जिम्मेदारी में अस्थिरता और वित्तीय लापरवाही के कारण कलह।',
      traditionalWellnessReflection: 'लगातार बेचैनी, नींद का चक्र बिगड़ना, त्वचा विकार और नसों में कमजोरी।',
      balancingRecommendation: 'प्रत्येक बुधवार गाय को हरा चारा खिलाएं, तुलसी जी में नित्य जल अर्पित करें, सट्टेबाजी से पूरी तरह दूर रहें और दीर्घकालिक सुरक्षित निवेश करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  6: {
    1: {
      number: 6,
      count: 1,
      level: 'SINGLE',
      meaning: 'शुक्र का संतुलित सौहार्द; सुरुचिपूर्ण सौंदर्यबोध, पारिवारिक निष्ठा, आतिथ्य सत्कार और चुंबकीय आकर्षण।',
      strengthenedQualities: 'कलात्मक समझ, पारिवारिक जिम्मेदारी, सौम्य व्यवहार और सुख-सुविधाओं का आनंद।',
      possibleExcess: 'नगण्य; बिना दिखावे के उत्तम जीवनशैली का आनंद।',
      practicalExpression: 'सुंदर और सुखद माहौल बनाना जहां परिवार और अतिथि सम्मानित महसूस करें।',
      careerExpression: 'इंटीरियर डिजाइन, फैशन, लक्जरी हॉस्पिटैलिटी, पारिवारिक व्यवसाय और जनसंपर्क।',
      relationshipExpression: 'समर्पित, रोमांटिक, उदार और साथी का पूरा ख्याल रखने वाले जीवनसाथी।',
      traditionalWellnessReflection: 'संतुलित शारीरिक चमक, स्वस्थ त्वचा और उत्तम ऊर्जा।',
      balancingRecommendation: 'घर में सुगंधित वातावरण और स्वच्छता बनाए रखें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 6,
      count: 2,
      level: 'DOUBLE',
      meaning: 'उत्कृष्ट कलात्मक सुरुचि, लक्जरी और वैभव को आकर्षित करने की शक्ति, चुंबकीय आकर्षण और शानदार पारिवारिक देखभाल।',
      strengthenedQualities: 'रचनात्मक दक्षता, उच्च सौंदर्य मानक, आतिथ्य सत्कार और सामाजिक शिष्टता।',
      possibleExcess: 'महंगी लक्जरी चीजों पर अत्यधिक खर्च और सीमाओं को लागू करने में झिझक।',
      practicalExpression: 'प्रीमियम और खूबसूरत माहौल बनाना और समाज में स्वाभाविक सम्मान प्राप्त करना।',
      careerExpression: 'फैशन डिजाइनिंग, लक्जरी रियल एस्टेट, फिल्म व मीडिया, कॉस्मेटिक्स और खान-पान उद्योग।',
      relationshipExpression: 'अत्यंत रोमांटिक और खुले दिल वाले; घर और वैवाहिक जीवन को जीवन का केंद्र मानते हैं।',
      traditionalWellnessReflection: 'मीठे और गरिष्ठ भोजन की ओर रुझान; जीवनशैली में संतुलन रखें।',
      balancingRecommendation: 'शुक्रवार को जरूरतमंद कन्याओं को सफेद मिठाई या वस्त्र भेंट करें और चंदन का इत्र लगाएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 6,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अत्यधिक विलासिता, प्रेम संबंधों में अति-भावुकता, फिजूलखर्ची और बाहरी दिखावे पर अत्यधिक जोर।',
      strengthenedQualities: 'अद्भुत कलात्मक परख, सम्मोहक आकर्षण और सामाजिक लोकप्रियता।',
      possibleExcess: 'हैसियत से ज्यादा खर्च करना, ईर्ष्या का भाव और केवल बाहरी रूप-रंग पर मोहित होना।',
      practicalExpression: 'बचत की अनदेखी करके वाहनों, कपड़ों और मनोरंजन पर भारी धनराशि खर्च करना।',
      careerExpression: 'सेलिब्रिटी स्टाइलिंग, लक्जरी इवेंट्स मैनेजमेंट और ग्लैमर इंडस्ट्री।',
      relationshipExpression: 'अधिकारवादी और अत्यधिक अपेक्षाएं रखने वाले; लगातार प्रशंसा और विलासिता की चाह।',
      traditionalWellnessReflection: 'विलासी खान-पान से सुस्ती, यूरिनरी/किडनी संवेदनशीलता और त्वचा पर असर।',
      balancingRecommendation: 'शुक्रवार को सादा भोजन करें या व्रत रखें और सफेद फूल या कपूर का दान करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 6,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-शुक्र अधिकता; क्लासिकल अंकशास्त्र के अनुसार चालाकी/मैनिपुलेशन, बदनामी का खतरा, कई रिश्तों में उलझाव, विलासिता की लत और भारी फिजूलखर्ची।',
      strengthenedQualities: 'असाधारण सम्मोहन, चुंबकीय आकर्षण और विलक्षण कलात्मक प्रतिभा।',
      possibleExcess: 'चालाकी भरा व्यवहार, बदनामी का जोखिम, एक से अधिक प्रेम संबंधों में उलझना, विलासिता की लत और भारी फिजूलखर्ची।',
      practicalExpression: 'दिखावे के लिए अंधाधुंध खर्च करना और अपनी बात मनवाने के लिए भावनात्मक दबाव बनाना।',
      careerExpression: 'ग्लैमर या क्रिएटिव फील्ड में विवादों या सार्वजनिक बदनामी का जोखिम।',
      relationshipExpression: 'वैवाहिक जीवन में गंभीर उथल-पुथल, विश्वासघात और जटिल रिश्ते।',
      traditionalWellnessReflection: 'असंतुलित जीवनशैली, सुस्ती और हार्मोनल असंतुलन; चिकित्सकीय सलाह लें।',
      balancingRecommendation: 'नैतिक आचरण का सख्ती से पालन करें, महिलाओं का सम्मान करें, शुक्रवार को दूध/कपूर दान करें और सादा जीवन अपनाएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  7: {
    1: {
      number: 7,
      count: 1,
      level: 'SINGLE',
      meaning: 'केतु का संतुलित प्रभाव; विश्लेषणात्मक जिज्ञासा, आध्यात्मिक गहराई, तकनीकी शोध और सही-गलत की गहरी समझ।',
      strengthenedQualities: 'स्वतंत्र विचार, शांत अवलोकन, वैज्ञानिक दृष्टिकोण और नैतिक निष्ठा।',
      possibleExcess: 'नगण्य; बिना सामाजिक दूरी के स्वस्थ निजता।',
      practicalExpression: 'किसी भी बात को यूं ही स्वीकार करने के बजाय गहराई से उसकी जड़ तक जाना।',
      careerExpression: 'वैज्ञानिक अनुसंधान, सॉफ्टवेयर आर्किटेक्चर, फॉरेंसिक, उच्च शिक्षा और मनोविज्ञान।',
      relationshipExpression: 'निष्ठावान, विचारशील और शांत साथी; आत्मिक स्तर के जुड़ाव को महत्व देते हैं।',
      traditionalWellnessReflection: 'मानसिक शांति, गहरी नींद और सात्विक जीवन में स्वाभाविक रुचि।',
      balancingRecommendation: 'प्रकृति के सानिध्य में समय बिताएं और प्रतिदिन ध्यान या प्रार्थना करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 7,
      count: 2,
      level: 'DOUBLE',
      meaning: 'गहरा आध्यात्मिक अंतर्ज्ञान, असाधारण शोध क्षमता, सांसारिक अनासक्ति और गलतियों को तुरंत पकड़ने की नजर।',
      strengthenedQualities: 'सटीक फॉरेंसिक दृष्टि, गूढ़ विद्याओं की समझ और सूक्ष्म पैटर्न पहचानना।',
      possibleExcess: 'समाज से कटने की प्रवृत्ति और पुरानी भावनात्मक कड़वाहटों को बार-बार याद करना।',
      practicalExpression: 'डेटा, कोड या खातों में उन गलतियों को पकड़ लेना जिन्हें दूसरे अनदेखा कर देते हैं।',
      careerExpression: 'क्लिनिकल डायग्नोस्टिक्स, गूढ़ विज्ञान (Occult), डेटा फॉरेंसिक और क्लिनिकल साइकोलॉजी।',
      relationshipExpression: 'गंभीर और अंतर्मुखी; ऐसे साथी की चाह जो उनके पर्सनल स्पेस का सम्मान करे।',
      traditionalWellnessReflection: 'अत्यधिक सोचने से मानसिक थकान और जोड़ों या पैरों में संवेदनशीलता।',
      balancingRecommendation: 'भगवान श्री गणेश की आराधना करें, जेब में चांदी का सिक्का रखें और पैर साफ रखें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 7,
      count: 3,
      level: 'TRIPLE',
      meaning: 'गहरी सांसारिक विरक्ति, व्यापारिक माहौल में बेगानापन महसूस होना, अतींद्रिय संवेदनशीलता और संदेह।',
      strengthenedQualities: 'आध्यात्मिक अंतर्दृष्टि, परा-वैज्ञानिक शोध क्षमता और पूर्ण अनासक्ति।',
      possibleExcess: 'गंभीर सामाजिक अकेलापन, उदासी और व्यावसायिक सौदों को निभाने में अनिच्छा।',
      practicalExpression: 'भौतिक दुनिया के दांव-पेच और ऑफिस की राजनीति से बिल्कुल दूर अपने वैचारिक संसार में रहना।',
      careerExpression: 'आध्यात्मिक साधना, एकांत वैज्ञानिक लेखन और विशेष गूढ़ शोध।',
      relationshipExpression: 'सांसारिक रोमांटिक अपेक्षाओं से दूरी; शांत और स्वतंत्र वातावरण की चाह।',
      traditionalWellnessReflection: 'अचेतन मन के अति-सक्रिय रहने से नींद में खलल और ऊर्जा की कमी।',
      balancingRecommendation: 'शनिवार को साधुओं या जरूरतमंदों को ऊनी कंबल/वस्त्र दान करें और गणेश मंत्र का जप करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 7,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-केतु विरक्ति; क्लासिकल अंकशास्त्र के अनुसार लगातार ओवरथिंकिंग, रिश्तों में उलझाव और व्यापार/वित्तीय या प्रेम में बार-बार धोखा खाना।',
      strengthenedQualities: 'रहस्यमयी अंतर्ज्ञान और ब्रह्मांडीय सत्य को भेदने की अद्भुत समझ।',
      possibleExcess: 'लगातार ओवरथिंकिंग, रिश्तों में निराशा, व्यापार, वित्त या प्रेम में धोखा खाना और समाज से गहरा अलगाव।',
      practicalExpression: 'सांसारिक संस्थानों पर अविश्वास के कारण निर्णय न ले पाना या गलत लोगों पर आंख मूंदकर भरोसा कर लेना।',
      careerExpression: 'बिजनेस में बार-बार धोखे का जोखिम जब तक कि सख्त कानूनी अनुबंध न हों।',
      relationshipExpression: 'भावनात्मक मोहभंग; बार-बार गलत समझे जाने और अकेले छूट जाने का अहसास।',
      traditionalWellnessReflection: 'मानसिक थकान, गहरी उदासी, पैरों/जोड़ों में दर्द और सुस्ती; चिकित्सकीय सलाह लें।',
      balancingRecommendation: 'बुधवार को 21 दूर्वा से भगवान गणेश का पूजन करें, सोने से पहले पैर धोएं, चांदी का छल्ला पहनें, अतीत के धोखों को भूलें और ॐ गं गणपतये नमः का जप करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  8: {
    1: {
      number: 8,
      count: 1,
      level: 'SINGLE',
      meaning: 'शनि का संतुलित अनुशासन; अटूट धैर्य, व्यावहारिक संगठन क्षमता, सत्यनिष्ठा और सहनशीलता।',
      strengthenedQualities: 'विश्वसनीयता, यथार्थवादी निर्णय, प्रशासनिक लगन और केंद्रित कार्यशैली।',
      possibleExcess: 'नगण्य; बिना नकारात्मकता के स्वस्थ यथार्थवाद।',
      practicalExpression: 'कठिन और उबाऊ जिम्मेदारियों को भी बिना शिकायत के व्यवस्थित ढंग से पूरा करना।',
      careerExpression: 'कॉर्पोरेट फाइनेंस, सिविल इंफ्रास्ट्रक्चर, न्यायपालिका, अनुपालन (Compliance) और भारी प्रबंधन।',
      relationshipExpression: 'अडिग, भरोसेमंद और हर परिस्थिति में साथ देने वाले जीवनसाथी जो स्थायी सुरक्षा देते हैं।',
      traditionalWellnessReflection: 'मजबूत शारीरिक ढांचा, स्वस्थ जोड़ और उत्कृष्ट सहनशक्ति।',
      balancingRecommendation: 'बुजुर्ग श्रमिकों की सेवा करें और कार्यस्थल को साफ-सुथरा व व्यवस्थित रखें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 8,
      count: 2,
      level: 'DOUBLE',
      meaning: 'अथाह सहनशक्ति, प्रशासनिक धैर्य, विशाल औद्योगिक जटिलताओं को संभालने की क्षमता और कड़ा अनुशासन।',
      strengthenedQualities: 'कठोर कार्य नैतिकता, रणनीतिक जोखिम प्रबंधन और स्थायी संपत्ति निर्माण।',
      possibleExcess: 'अत्यधिक गंभीरता, खुलकर न हंस पाना और आराम को हमेशा टालते रहना।',
      practicalExpression: 'वर्षों की अथक मेहनत से ईंट-दर-ईंट जोड़कर मजबूत संस्थान और संपत्तियां खड़ी करना।',
      careerExpression: 'हैवी इंजीनियरिंग, खनन, न्यायपालिका, कॉर्पोरेट सुधार और रियल एस्टेट इंफ्रास्ट्रक्चर।',
      relationshipExpression: 'अत्यंत वफादार और सुरक्षात्मक; ठोस सुरक्षा और सुख-साधन देकर अपना प्यार निभाते हैं।',
      traditionalWellnessReflection: 'जोड़ों में जकड़न, मांसपेशियों में खिंचाव या शरीर में शुष्कता की संभावना।',
      balancingRecommendation: 'शनिवार को पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और श्रमिकों को भोजन दें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 8,
      count: 3,
      level: 'TRIPLE',
      meaning: 'भारी कर्मिक बोझ, धीमी गति से देर से मिलने वाले परिणाम, भावहीन गंभीरता और कठिन श्रम।',
      strengthenedQualities: 'लौह सहनशक्ति, कठिनाइयों से न डरने का हौसला और पूर्ण कर्तव्यनिष्ठा।',
      possibleExcess: 'निराशावाद, अत्यधिक आत्म-आलोचना, हद से ज्यादा बोझ अपने सिर लेना और कठोरता।',
      practicalExpression: 'यह मानकर चलना कि बिना भीषण संघर्ष के कुछ नहीं मिलेगा; दूसरों को काम सौंपने में परेशानी।',
      careerExpression: 'क्राइसिस मैनेजमेंट, कानूनी रक्षा, भारी औद्योगिक संचालन और कॉरपोरेट पुनर्गठन।',
      relationshipExpression: 'अत्यधिक गंभीर और भावनाओं को दबाकर रखने वाले; समझदार साथी की जरूरत।',
      traditionalWellnessReflection: 'जोड़ों में दर्द, दांतों में संवेदनशीलता, सुस्त पाचन और शारीरिक थकान।',
      balancingRecommendation: 'शनिवार को काले तिल व सरसों के तेल का दान करें और नियमित योग-स्ट्रेचिंग करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 8,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-शनि दबाव; क्लासिकल अंकशास्त्र के अनुसार भारी रुकावटें/बाधाएं, संपत्ति का नुकसान या विवाद, बार-बार कोर्ट-कचहरी और पुलिस/कानूनी झंझट।',
      strengthenedQualities: 'अडिग धैर्य और दुनिया की कठिनतम परीक्षाओं को भी झेल जाने की क्षमता।',
      possibleExcess: 'अंतहीन रुकावटें, संपत्ति के विवाद या हानि, बार-बार कोर्ट के चक्कर, पुलिस या कानूनी अड़चनें और हर काम में अत्यधिक देरी।',
      practicalExpression: 'हर काम में लगातार प्रशासनिक, संस्थागत और कानूनी अड़चनों का सामना करना।',
      careerExpression: 'कॉर्पोरेट या सरकारी व्यवस्थाओं में भारी संघर्ष; सभी दस्तावेजों की कानूनी जांच अनिवार्य।',
      relationshipExpression: 'बाहरी कानूनी या वित्तीय उलझनों के कारण पारिवारिक जीवन में भारी तनाव।',
      traditionalWellnessReflection: 'जोड़ों व हड्डियों में जकड़न, पुरानी थकान, एसिडिटी और कमजोरी; चिकित्सीय सलाह लें।',
      balancingRecommendation: 'श्रमिकों व सफाई कर्मचारियों की सेवा करें, शनिवार को सरसों के तेल का दीपक जलाएं, काले तिल दान करें, शनि गायत्री मंत्र का जप करें और किसी भी अनैतिक शॉर्टकट से बचें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  },
  9: {
    1: {
      number: 9,
      count: 1,
      level: 'SINGLE',
      meaning: 'मंगल का संतुलित साहस; ऊर्जा, मानवीय संवेदना, त्वरित क्रियान्वयन और सुरक्षा की भावना।',
      strengthenedQualities: 'बहादुरी, उदारता, काम शुरू करने की फुर्ती, निर्णायक कदम और नेतृत्व।',
      possibleExcess: 'नगण्य; बिना गुस्से के स्वस्थ मुखरता।',
      practicalExpression: 'मुश्किल समय में कमजोर साथियों की मदद के लिए तुरंत आगे आना और संकट सुलझाना।',
      careerExpression: 'आपातकालीन सेवाएं, रक्षा क्षेत्र, सर्जरी, खेलकूद, रियल एस्टेट और पुलिस।',
      relationshipExpression: 'उत्साही, गर्मजोश, परिवार की ढाल बनने वाले और खुले दिल के साथी।',
      traditionalWellnessReflection: 'मजबूत मांसपेशियां, सक्रिय रक्तसंचार और बीमारियों से तेजी से उबरने की क्षमता।',
      balancingRecommendation: 'दैनिक कार्डियो या खेलकूद में भाग लें और अपनी ऊर्जा को सही दिशा दें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    2: {
      number: 9,
      count: 2,
      level: 'DOUBLE',
      meaning: 'उच्च जीवन शक्ति, अदम्य साहस, समाज सेवा का जुनून और प्रभावशाली कमांडिंग ऊर्जा।',
      strengthenedQualities: 'संकट के समय तुरंत एक्शन, अद्भुत शारीरिक बहादुरी और उदार परोपकार।',
      possibleExcess: 'जल्दी गुस्सा आना, धीमी गति पर झुंझलाहट और कमजोरी बर्दाश्त न कर पाना।',
      practicalExpression: 'मुश्किल और जोखिम भरे कार्यों में बिना डरे उतरना और तुरंत परिणाम निकालना।',
      careerExpression: 'सैन्य कमान, ट्रॉमा सर्जरी, प्रतिस्पर्धी खेल, आपदा प्रबंधन और बड़े प्रोजेक्ट्स।',
      relationshipExpression: 'गहरे सुरक्षात्मक, स्वाभिमानी और उत्साही; घर में शांत माहौल वाले साथी की जरूरत।',
      traditionalWellnessReflection: 'शरीर में अतिरिक्त गर्मी, मांसपेशियों में सूजन या कटने-छिलने का जोखिम।',
      balancingRecommendation: 'नित्य हनुमान चालीसा का पाठ करें, मिट्टी के घड़े का पानी पिएं और ज्यादा तीखे भोजन से बचें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    3: {
      number: 9,
      count: 3,
      level: 'TRIPLE',
      meaning: 'अग्नि जैसी उग्रता, विस्फोटक गुस्सा, आक्रामक प्रतिक्रियाएं और शारीरिक बर्नआउट।',
      strengthenedQualities: 'अदम्य बहादुरी, न्याय के लिए अंत तक लड़ना और साहसिक आत्म-बलिदान।',
      possibleExcess: 'बार-बार गुस्से का फटना, तेज गाड़ी चलाना, शारीरिक थकान और वैवाहिक कलह।',
      practicalExpression: 'छोटी-मोटी असहमति को भी बड़ी सैद्धांतिक लड़ाई बना देना।',
      careerExpression: 'फ्रंटलाइन डिफेंस, जोखिम भरे अभियान और तीव्र प्रतिस्पर्धी क्षेत्र।',
      relationshipExpression: 'अत्यधिक उग्र और जिद्दी; जीवनसाथी को तनाव को प्यार से शांत करना आना चाहिए।',
      traditionalWellnessReflection: 'ब्लड प्रेशर का अचानक बढ़ना, एसिडिटी और जलन संबंधी समस्याएं।',
      balancingRecommendation: 'शीतली प्राणायाम करें, मंगलवार को लाल मसूर की दाल दान करें और लाल मिर्च से परहेज करें।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    },
    4: {
      number: 9,
      count: 4,
      level: 'QUADRUPLE_PLUS',
      meaning: 'अति-मंगल प्रज्वलन; क्लासिकल अंकशास्त्र के अनुसार गंभीर क्रोध, रूखा/अहंकारी व्यवहार, सर्जरी या दुर्घटना का जोखिम और कर्ज/लोन के झंझट।',
      strengthenedQualities: 'परम योद्धा भावना और किसी भी शारीरिक या मानसिक प्रतिद्वंद्वी से टकराने का हौसला।',
      possibleExcess: 'गंभीर गुस्सा, रूखा व्यवहार, चोट/सर्जरी का जोखिम, दुर्घटना की संभावना और कर्ज व लोन के पचड़े।',
      practicalExpression: 'बिना सोचे-समझे कदम उठाना, गुस्से में रिश्ते तोड़ लेना और जल्दबाजी में वित्तीय देनदारियां बढ़ाना।',
      careerExpression: 'अत्यधिक जोखिम भरे कार्य; साझेदारों से गंभीर विवाद या अनुशासनात्मक कार्रवाई का जोखिम।',
      relationshipExpression: 'घर में अचानक भयंकर झगड़े; धैर्य और शांति बनाए रखने का सचेत संकल्प जरूरी।',
      traditionalWellnessReflection: 'हाई ब्लड प्रेशर, गंभीर एसिडिटी, मांसपेशियों में खिंचाव और चोट लगने का खतरा; चिकित्सकीय सलाह लें।',
      balancingRecommendation: 'प्रतिदिन श्रद्धा से हनुमान चालीसा पढ़ें, अत्यधिक मिर्च-मसाले से पूरी तरह बचें, वर्ष में एक बार सुरक्षित रक्तदान करें, मंगलवार को श्रमिकों को मीठा बांटें और शांत श्वास क्रिया अपनाएं।',
      source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
    }
  }
};

export function getDetailedRepetitionAnalysis(num: number, count: number): DetailedRepetitionEntry {
  const safeCount = Math.min(Math.max(1, count), 4);
  const numData = REPETITION_DETAILED_DATABASE[num];
  if (numData && numData[safeCount]) {
    return numData[safeCount];
  }
  // Fallback
  return {
    number: num,
    count,
    level: count >= 4 ? 'QUADRUPLE_PLUS' : count === 3 ? 'TRIPLE' : count === 2 ? 'DOUBLE' : 'SINGLE',
    meaning: `अंक ${num} की आवृत्ति स्तर ${count}`,
    strengthenedQualities: `अंक ${num} के ग्रहों का बढ़ता प्रभाव`,
    possibleExcess: count >= 3 ? 'ग्रहीय ऊर्जा की अत्यधिक प्रबलता' : 'संतुलित प्रभाव',
    practicalExpression: `अंक ${num} के गुणों की सक्रिय अभिव्यक्ति`,
    careerExpression: `अंक ${num} के अनुरूप करियर प्रदर्शन`,
    relationshipExpression: `अंक ${num} के अनुसार पारिवारिक सामंजस्य`,
    traditionalWellnessReflection: 'संतुलित दिनचर्या और नियमित स्वास्थ्य जांच बनाए रखें।',
    balancingRecommendation: 'प्रतिदिन ध्यान करें और संतुलित जीवनशैली अपनाएं।',
    source: 'Advanced Numerology Course by Raajeev Singh Chauhann (PDF 2, Pages 44-46)'
  };
}
