import { Subject, Chapter } from '../types';

// Dynamic Subject Configurations by Grade Tier
export const getSubjectsForGrade = (grade: number): Subject[] => {
  if (grade >= 11) {
    return [
      {
        id: 'physics',
        name: 'Physics',
        nameHi: 'भौतिक विज्ञान',
        icon: 'Atom',
        color: 'from-amber-500 to-orange-600',
        chaptersCount: 14
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        nameHi: 'रसायन विज्ञान',
        icon: 'Sparkles',
        color: 'from-emerald-500 to-teal-600',
        chaptersCount: 14
      },
      {
        id: 'math',
        name: 'Mathematics',
        nameHi: 'गणित',
        icon: 'Calculator',
        color: 'from-blue-500 to-indigo-600',
        chaptersCount: 16
      },
      {
        id: 'biology',
        name: 'Biology',
        nameHi: 'जीव विज्ञान',
        icon: 'Atom',
        color: 'from-green-500 to-emerald-600',
        chaptersCount: 16
      },
      {
        id: 'economics',
        name: 'Economics / Commerce',
        nameHi: 'अर्थशास्त्र एवं वाणिज्य',
        icon: 'Globe',
        color: 'from-purple-500 to-violet-600',
        chaptersCount: 12
      },
      {
        id: 'english',
        name: 'English Core',
        nameHi: 'अंग्रेजी',
        icon: 'Languages',
        color: 'from-rose-500 to-pink-600',
        chaptersCount: 10
      }
    ];
  }

  if (grade >= 9) {
    return [
      {
        id: 'math',
        name: 'Mathematics',
        nameHi: 'गणित',
        icon: 'Calculator',
        color: 'from-amber-500 to-orange-600',
        chaptersCount: 15
      },
      {
        id: 'science',
        name: 'Science',
        nameHi: 'विज्ञान',
        icon: 'Atom',
        color: 'from-emerald-500 to-teal-600',
        chaptersCount: 16
      },
      {
        id: 'social',
        name: 'Social Studies',
        nameHi: 'सामाजिक विज्ञान',
        icon: 'Globe',
        color: 'from-blue-500 to-indigo-600',
        chaptersCount: 14
      },
      {
        id: 'hindi',
        name: 'Hindi',
        nameHi: 'हिन्दी',
        icon: 'BookOpen',
        color: 'from-rose-500 to-pink-600',
        chaptersCount: 12
      },
      {
        id: 'english',
        name: 'English',
        nameHi: 'अंग्रेजी',
        icon: 'Languages',
        color: 'from-purple-500 to-violet-600',
        chaptersCount: 11
      }
    ];
  }

  if (grade >= 6) {
    return [
      {
        id: 'math',
        name: 'Mathematics',
        nameHi: 'गणित',
        icon: 'Calculator',
        color: 'from-amber-500 to-orange-600',
        chaptersCount: 14
      },
      {
        id: 'science',
        name: 'Science',
        nameHi: 'विज्ञान',
        icon: 'Atom',
        color: 'from-emerald-500 to-teal-600',
        chaptersCount: 16
      },
      {
        id: 'social',
        name: 'Social Science',
        nameHi: 'सामाजिक विज्ञान',
        icon: 'Globe',
        color: 'from-blue-500 to-indigo-600',
        chaptersCount: 12
      },
      {
        id: 'hindi',
        name: 'Hindi',
        nameHi: 'हिन्दी',
        icon: 'BookOpen',
        color: 'from-rose-500 to-pink-600',
        chaptersCount: 10
      },
      {
        id: 'english',
        name: 'English',
        nameHi: 'अंग्रेजी',
        icon: 'Languages',
        color: 'from-purple-500 to-violet-600',
        chaptersCount: 10
      }
    ];
  }

  // Primary Classes 1-5
  return [
    {
      id: 'math',
      name: 'Mathematics',
      nameHi: 'गणित (गिनती व आकार)',
      icon: 'Calculator',
      color: 'from-amber-500 to-orange-600',
      chaptersCount: 10
    },
    {
      id: 'evs',
      name: 'Environmental Studies',
      nameHi: 'पर्यावरण एवं आस-पास',
      icon: 'Globe',
      color: 'from-emerald-500 to-teal-600',
      chaptersCount: 12
    },
    {
      id: 'hindi',
      name: 'Hindi',
      nameHi: 'हिन्दी (भाषा व कहानियाँ)',
      icon: 'BookOpen',
      color: 'from-rose-500 to-pink-600',
      chaptersCount: 12
    },
    {
      id: 'english',
      name: 'English',
      nameHi: 'अंग्रेजी (Words & Rhymes)',
      icon: 'Languages',
      color: 'from-purple-500 to-violet-600',
      chaptersCount: 10
    }
  ];
};

// Curriculum Database for all Classes 1-12
export const getChaptersForGradeAndBoard = (grade: number, board: string = 'CBSE', subjectId?: string): Chapter[] => {
  const allChapters: Chapter[] = [];

  // Grade 11-12 (Senior Secondary)
  if (grade >= 11) {
    allChapters.push(
      {
        id: `g${grade}-phy-1`,
        slug: `g${grade}-physics-mechanics`,
        subjectId: 'physics',
        title: grade === 11 ? 'Kinematics & Laws of Motion' : 'Electrostatics & Electric Currents',
        titleHi: grade === 11 ? 'गति के नियम एवं यांत्रिकी' : 'स्थिर वैद्युतिकी एवं विद्युत धारा',
        grade,
        description: grade === 11 ? 'न्यूटन के गति नियम, संवेग संरक्षण एवं घर्षण बल की गणना।' : 'कूलॉम का नियम, विद्युत क्षेत्र तीव्रता एवं किरचॉफ के नियम।',
        topicsCount: 6,
        isDownloaded: true
      },
      {
        id: `g${grade}-phy-2`,
        slug: `g${grade}-physics-optics`,
        subjectId: 'physics',
        title: grade === 11 ? 'Thermodynamics & Oscillations' : 'Ray & Wave Optics',
        titleHi: grade === 11 ? 'ऊष्मागतिकी एवं दोलन' : 'किरण एवं तरंग प्रकाशिकी',
        grade,
        description: grade === 11 ? 'ऊष्मागतिकी का प्रथम व द्वितीय नियम, कार्नो इंजन एवं तरंग गति।' : 'लेंस मेकर सूत्र, प्रिज्म अपवर्तन, हाइगेंस सिद्धांत एवं व्यतिकरण।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-chem-1`,
        slug: `g${grade}-chemistry-structure`,
        subjectId: 'chemistry',
        title: grade === 11 ? 'Structure of Atom & Chemical Bonding' : 'Chemical Kinetics & Solutions',
        titleHi: grade === 11 ? 'परमाणु की संरचना एवं रासायनिक आबंधन' : 'रासायनिक बलगतिकी एवं विलयन',
        grade,
        description: grade === 11 ? 'बोहर मॉडल, क्वांटम संख्याएँ एवं VSEPR सिद्धांत।' : 'अभिक्रिया की दर, कोटि, राउल्ट का नियम एवं अणुसंख्य गुणधर्म।',
        topicsCount: 7,
        isDownloaded: true
      },
      {
        id: `g${grade}-chem-2`,
        slug: `g${grade}-chemistry-organic`,
        subjectId: 'chemistry',
        title: grade === 11 ? 'Hydrocarbons & Organic Chemistry' : 'Aldehydes, Ketones & Biomolecules',
        titleHi: grade === 11 ? 'हाइड्रोकार्बन एवं कार्बनिक यौगिक' : 'एल्डिहाइड, कीटोन एवं जैव-अणु',
        grade,
        description: grade === 11 ? 'एल्केन, एल्कीन, एल्काइन एवं बेंजीन की एरोमैटिकता।' : 'नाभिकस्नेही योग अभिक्रियाएँ, कार्बोहाइड्रेट एवं प्रोटीन संरचना।',
        topicsCount: 6,
        isDownloaded: false
      },
      {
        id: `g${grade}-math-1`,
        slug: `g${grade}-math-calculus`,
        subjectId: 'math',
        title: grade === 11 ? 'Sets, Relations & Trigonometry' : 'Calculus: Derivatives & Integrals',
        titleHi: grade === 11 ? 'समुच्चय, संबंध एवं त्रिकोणमिति' : 'कलन: अवकलन एवं समाकलन',
        grade,
        description: grade === 11 ? 'समुच्चय संक्रियाएँ, संबंध, फलन एवं त्रिकोणमितीय सर्वसमिकाएँ।' : 'श्रृंखला नियम, अवकलज के अनुप्रयोग, निश्चित समाकलन एवं क्षेत्रफल।',
        topicsCount: 8,
        isDownloaded: true
      },
      {
        id: `g${grade}-bio-1`,
        slug: `g${grade}-biology-cell`,
        subjectId: 'biology',
        title: grade === 11 ? 'Cell Biology & Plant Physiology' : 'Genetics & Molecular Inheritance',
        titleHi: grade === 11 ? 'कोशिका जैविकी एवं पादप कार्यिकी' : 'आनुवंशिकी एवं आण्विक वंशागति',
        grade,
        description: grade === 11 ? 'कोशिका अंगक, समसूत्री व अर्धसूत्री विभाजन एवं प्रकाश संश्लेषण।' : 'मेंडल के नियम, डीएनए संरचना, प्रतिकृतियन एवं प्रोटीन संश्लेषण।',
        topicsCount: 6,
        isDownloaded: false
      }
    );
  }

  // Grade 9-10 (Secondary)
  else if (grade >= 9) {
    allChapters.push(
      {
        id: `g${grade}-math-1`,
        slug: `g${grade}-math-real-numbers`,
        subjectId: 'math',
        title: grade === 10 ? 'Real Numbers' : 'Number Systems',
        titleHi: grade === 10 ? 'वास्तविक संख्याएँ' : 'संख्या पद्धति',
        grade,
        description: grade === 10 ? 'यूक्लिड विभाजन प्रमेयिका, अंकगणित की आधारभूत प्रमेय और अपरिमेयता का निगमन।' : 'परिमेय एवं अपरिमेय संख्याएँ, वास्तविक संख्याओं पर संक्रियाएँ एवं घातांक नियम।',
        topicsCount: 5,
        isDownloaded: true
      },
      {
        id: `g${grade}-math-2`,
        slug: `g${grade}-math-polynomials`,
        subjectId: 'math',
        title: 'Polynomials & Equations',
        titleHi: 'बहुपद एवं द्विघात समीकरण',
        grade,
        description: 'शून्यकों का ज्यामितीय अर्थ, गुणांकों का संबंध एवं द्विघात सूत्र द्वारा मूल ज्ञात करना।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-math-3`,
        slug: `g${grade}-math-trigonometry`,
        subjectId: 'math',
        title: grade === 10 ? 'Introduction to Trigonometry' : 'Coordinate Geometry & Triangles',
        titleHi: grade === 10 ? 'त्रिकोणमिति का परिचय एवं अनुप्रयोग' : 'निर्देशांक ज्यामिति व त्रिभुज',
        grade,
        description: grade === 10 ? 'त्रिकोणमितीय अनुपात (sin, cos, tan), सर्वसमिकाएँ तथा ऊँचाई एवं दूरी के प्रश्न।' : 'दूरी सूत्र, विभाजन सूत्र एवं त्रिभुजों की सर्वांगसमता।',
        topicsCount: 6,
        isDownloaded: false
      },
      {
        id: `g${grade}-sci-1`,
        slug: `g${grade}-science-reactions`,
        subjectId: 'science',
        title: grade === 10 ? 'Chemical Reactions & Equations' : 'Matter in Our Surroundings',
        titleHi: grade === 10 ? 'रासायनिक अभिक्रियाएँ एवं समीकरण' : 'हमारे आस-पास के पदार्थ',
        grade,
        description: grade === 10 ? 'संतुलित समीकरण, संयोजन, वियोजन, विस्थापन एवं रेडॉक्स अभिक्रियाएँ।' : 'पदार्थ की अवस्थाएँ (ठोस, द्रव, गैस), वाष्पीकरण एवं गलनांक-क्वथनांक।',
        topicsCount: 6,
        isDownloaded: true
      },
      {
        id: `g${grade}-sci-2`,
        slug: `g${grade}-science-light`,
        subjectId: 'science',
        title: grade === 10 ? 'Light: Reflection & Refraction' : 'Force & Laws of Motion',
        titleHi: grade === 10 ? 'प्रकाश: परावर्तन एवं अपवर्तन' : 'बल तथा गति के नियम',
        grade,
        description: grade === 10 ? 'गोलीय दर्पण, लेंस सूत्र, आवर्धन, अपवर्तनांक एवं किरण आरेख।' : 'न्यूटन के गति के तीनों नियम, जड़त्व, संवेग एवं संवेग संरक्षण।',
        topicsCount: 7,
        isDownloaded: false
      },
      {
        id: `g${grade}-sci-3`,
        slug: `g${grade}-science-life`,
        subjectId: 'science',
        title: grade === 10 ? 'Life Processes' : 'The Fundamental Unit of Life: Cell',
        titleHi: grade === 10 ? 'जैव प्रक्रम' : 'जीवन की मौलिक इकाई: कोशिका',
        grade,
        description: grade === 10 ? 'पोषण (पाचन तंत्र), श्वसन, वहन (हृदय व रक्त संचार) तथा उत्सर्जन तंत्र।' : 'पादप एवं जंतु कोशिका में अंतर, प्लाज्मा झिल्ली, माइटोकॉन्ड्रिया व केंद्रक।',
        topicsCount: 6,
        isDownloaded: true
      },
      {
        id: `g${grade}-soc-1`,
        slug: `g${grade}-social-history`,
        subjectId: 'social',
        title: grade === 10 ? 'Nationalism in India & Europe' : 'The French Revolution',
        titleHi: grade === 10 ? 'भारत एवं यूरोप में राष्ट्रवाद का उदय' : 'फ्रांसीसी क्रांति',
        grade,
        description: grade === 10 ? 'सत्याग्रह आंदोलन, असहयोग आंदोलन, दांडी यात्रा एवं भारत छोड़ो आंदोलन।' : 'क्रांति के कारण, बास्तील का पतन, समानता के अधिकार एवं नेपोलियन का उदय।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-soc-2`,
        slug: `g${grade}-social-geo`,
        subjectId: 'social',
        title: grade === 10 ? 'Resources & Agriculture' : 'India: Size, Location & Physical Features',
        titleHi: grade === 10 ? 'संसाधन, विकास एवं कृषि' : 'भारत का आकार, स्थिति व भौतिक स्वरूप',
        grade,
        description: grade === 10 ? 'मृदा के प्रकार, जल संसाधन, प्रमुख फसलें (रबी, खरीफ) एवं सतत विकास।' : 'हिमालय पर्वतमाला, उत्तरी मैदान, प्रायद्वीपीय पठार एवं तटीय मैदान।',
        topicsCount: 4,
        isDownloaded: false
      }
    );
  }

  // Grade 6-8 (Middle)
  else if (grade >= 6) {
    allChapters.push(
      {
        id: `g${grade}-math-1`,
        slug: `g${grade}-math-integers`,
        subjectId: 'math',
        title: grade === 8 ? 'Rational Numbers & Linear Equations' : 'Integers & Fractions',
        titleHi: grade === 8 ? 'परिमेय संख्याएँ एवं एक चर वाले रैखिक समीकरण' : 'पूर्णांक एवं भिन्न',
        grade,
        description: 'धनात्मक व ऋणात्मक संख्याएँ, संख्या रेखा, समीकरण हल करना एवं पक्षांतरण नियम।',
        topicsCount: 5,
        isDownloaded: true
      },
      {
        id: `g${grade}-math-2`,
        slug: `g${grade}-math-geometry`,
        subjectId: 'math',
        title: grade === 8 ? 'Squares, Square Roots & Mensuration' : 'Lines, Angles & Triangles',
        titleHi: grade === 8 ? 'वर्ग, वर्गमूल एवं क्षेत्रमिति' : 'रेखाएँ, कोण एवं त्रिभुज',
        grade,
        description: 'आयत, वर्ग, वृत्त का क्षेत्रफल और परिमाप एवं ज्यामितीय कोण संबंध।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-sci-1`,
        slug: `g${grade}-science-force`,
        subjectId: 'science',
        title: grade === 8 ? 'Force, Pressure & Friction' : 'Motion & Measurement of Distances',
        titleHi: grade === 8 ? 'बल, दाब तथा घर्षण' : 'गति एवं दूरियों का मापन',
        grade,
        description: 'सम्पर्क व असम्पर्क बल, वायुमंडलीय दाब, घर्षण के लाभ-हानि एवं सरल गति।',
        topicsCount: 5,
        isDownloaded: true
      },
      {
        id: `g${grade}-sci-2`,
        slug: `g${grade}-science-living`,
        subjectId: 'science',
        title: grade === 8 ? 'Microorganisms & Crop Production' : 'Components of Food & Living Organisms',
        titleHi: grade === 8 ? 'सूक्ष्मजीव: मित्र एवं शत्रु' : 'भोजन के घटक एवं सजीव जगत',
        grade,
        description: 'जीवाणु, विषाणु, कवक, फसल उत्पादन के चरण, खाद व उर्वरक में अंतर।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-soc-1`,
        slug: `g${grade}-social-history`,
        subjectId: 'social',
        title: grade === 8 ? 'How, When and Where: Modern India' : 'Early Civilizations & Harappa',
        titleHi: grade === 8 ? 'कब, कहाँ और कैसे: आधुनिक भारत का इतिहास' : 'आरंभिक नगर: हड़प्पा सभ्यता',
        grade,
        description: 'ईस्ट इंडिया कंपनी का भारत आगमन, जनजातीय विद्रोह (बिरसा मुंडा) एवं 1857 की क्रांति।',
        topicsCount: 4,
        isDownloaded: false
      }
    );
  }

  // Grade 1-5 (Primary)
  else {
    allChapters.push(
      {
        id: `g${grade}-math-1`,
        slug: `g${grade}-math-numbers`,
        subjectId: 'math',
        title: `Numbers, Addition & Shapes (Class ${grade})`,
        titleHi: `संख्याएँ, जोड़-घटाव एवं आकृतियाँ (कक्षा ${grade})`,
        grade,
        description: 'आसानी से गिनना, वस्तुओं का मिलान, 2-अंकीय जोड़-घटाव एवं ज्यामितीय आकृतियाँ।',
        topicsCount: 4,
        isDownloaded: true
      },
      {
        id: `g${grade}-evs-1`,
        slug: `g${grade}-evs-nature`,
        subjectId: 'evs',
        title: `Our Environment, Family & Plants (Class ${grade})`,
        titleHi: `हमारा परिवार, पेड़-पौधे एवं आस-पास (कक्षा ${grade})`,
        grade,
        description: 'पेड़-पौधों के भाग, पालतू व जंगली पशु, स्वच्छ पानी एवं व्यक्तिगत स्वच्छता की आदतें।',
        topicsCount: 4,
        isDownloaded: true
      },
      {
        id: `g${grade}-hin-1`,
        slug: `g${grade}-hindi-reading`,
        subjectId: 'hindi',
        title: `वर्णमाला, शब्द रचना एवं बाल कहानियाँ (कक्षा ${grade})`,
        titleHi: `वर्णमाला, शब्द रचना एवं बाल कहानियाँ (कक्षा ${grade})`,
        grade,
        description: 'स्वर, व्यंजन, मात्राओं का ज्ञान, सरल वाक्य पठन एवं सचित्र प्रेरक कहानियाँ।',
        topicsCount: 5,
        isDownloaded: false
      },
      {
        id: `g${grade}-eng-1`,
        slug: `g${grade}-english-basics`,
        subjectId: 'english',
        title: `Alphabets, Rhymes & Daily Words (Class ${grade})`,
        titleHi: `अल्फाबेट, कविताएँ व दैनिक बोलचाल शब्द (कक्षा ${grade})`,
        grade,
        description: 'A to Z letters, simple phonics sounds, animal names, and fun storytelling.',
        topicsCount: 4,
        isDownloaded: false
      }
    );
  }

  // Filter by subject if specified
  if (subjectId && subjectId !== 'all') {
    return allChapters.filter((c) => c.subjectId === subjectId);
  }

  return allChapters;
};
