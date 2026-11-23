import { GradeTier, Subject, Chapter, PracticeQuestion } from '../types';

export const GRADE_TIERS: GradeTier[] = [
  {
    range: '1–5',
    hi: 'प्राथमिक',
    en: 'Primary',
    dhi: 'बहुत आसान शब्द, चित्र जैसे उदाहरण और छोटी गतिविधियाँ।',
    den: 'Very simple words, picture-like examples and short activities.'
  },
  {
    range: '6–8',
    hi: 'उच्च प्राथमिक',
    en: 'Middle',
    dhi: 'उदाहरण से अवधारणा बनाना और साथ में अभ्यास।',
    den: 'Building concepts from examples, with guided practice.'
  },
  {
    range: '9–10',
    hi: 'माध्यमिक',
    en: 'Secondary',
    dhi: 'बोर्ड परीक्षा जैसी साफ़ व्याख्या और संरचित अभ्यास।',
    den: 'Board-style explanations and structured practice.'
  },
  {
    range: '11–12',
    hi: 'उच्च माध्यमिक',
    en: 'Senior Secondary',
    dhi: 'गहरी समझ, विषय के अनुसार हल करने के तरीके और परीक्षा तैयारी।',
    den: 'Deeper concepts, subject-specific problem solving and exam preparation.'
  }
];

export interface BoardOption {
  id: string;
  name: string;
  code: string;
  description: string;
}

export const BOARDS: BoardOption[] = [
  { id: 'cbse', code: 'CBSE', name: 'Central Board of Secondary Education', description: 'National curriculum (NCERT aligned)' },
  { id: 'icse', code: 'ICSE / ISC', name: 'Council for the Indian School Certificate', description: 'Comprehensive English medium curriculum' },
  { id: 'jcert', code: 'JCERT / JAC', name: 'Jharkhand Academic Council', description: 'Jharkhand State Board curriculum' },
  { id: 'bseb', code: 'BSEB', name: 'Bihar School Examination Board', description: 'Bihar State Board curriculum' },
  { id: 'upmsp', code: 'UPMSP', name: 'Uttar Pradesh Madhyamik Shiksha Parishad', description: 'UP State Board curriculum' },
  { id: 'msbshse', code: 'MSBSHSE', name: 'Maharashtra State Board', description: 'Maharashtra SSC & HSC curriculum' },
  { id: 'rbse', code: 'RBSE', name: 'Rajasthan Board of Secondary Education', description: 'Rajasthan State Board curriculum' },
  { id: 'mpbse', code: 'MPBSE', name: 'Madhya Pradesh Board', description: 'MP State Board curriculum' },
  { id: 'wbbse', code: 'WBBSE', name: 'West Bengal Board of Secondary Education', description: 'West Bengal State Board' },
  { id: 'kseeb', code: 'KSEEB', name: 'Karnataka Secondary Education Examination Board', description: 'Karnataka State Board' },
  { id: 'other', code: 'Other Board', name: 'Other State / National Board', description: 'Standard NCERT / Foundation syllabus' }
];

export const STATES_AND_CITIES: Record<string, string[]> = {
  'Jharkhand': [
    'Ranchi', 'Dhanbad', 'Bokaro', 'Jamshedpur (East Singhbhum)', 'Deoghar', 'Hazaribagh',
    'Giridih', 'Ramgarh', 'Dumka', 'Palamu', 'Chaibasa (West Singhbhum)', 'Koderma',
    'Chatra', 'Garhwa', 'Godda', 'Gumla', 'Jamtara', 'Khunti', 'Latehar', 'Lohardaga',
    'Pakur', 'Sahebganj', 'Seraikela Kharsawan', 'Simdega'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif',
    'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Saharsa', 'Sasaram', 'Hajipur',
    'Dehri', 'Bettiah', 'Motihari', 'Samastipur', 'Siwan', 'Nawada', 'Buxar'
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Varanasi', 'Prayagraj (Allahabad)', 'Agra', 'Noida', 'Ghaziabad',
    'Meerut', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi',
    'Mathura', 'Ayodhya (Faizabad)', 'Muzaffarnagar', 'Firozabad', 'Budaun', 'Rampur'
  ],
  'Delhi (NCR)': [
    'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi',
    'Dwarka', 'Rohini', 'Connaught Place', 'Saket', 'Karol Bagh'
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Chhatrapati Sambhajinagar (Aurangabad)',
    'Solapur', 'Kolhapur', 'Navi Mumbai', 'Amravati', 'Nanded', 'Jalgaon', 'Akola'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Sikar',
    'Bharatpur', 'Pali', 'Sri Ganganagar'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Ratlam',
    'Chhindwara', 'Dewas'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Kharagpur',
    'Haldia', 'Darjeeling'
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi', 'Kalaburagi',
    'Davanagere', 'Ballari', 'Shivamogga', 'Tumakuru'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar',
    'Junagadh', 'Anand', 'Navsari'
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat',
    'Panchkula', 'Yamunanagar'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)',
    'Hoshiarpur', 'Pathankot'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Nainital', 'Rishikesh', 'Kashipur',
    'Rudrapur'
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore',
    'Bhadrak'
  ]
};

export const JHARKHAND_DISTRICTS = STATES_AND_CITIES['Jharkhand'];

export const SUBJECTS: Subject[] = [
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
    name: 'Social Studies',
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
    chaptersCount: 18
  },
  {
    id: 'english',
    name: 'English',
    nameHi: 'अंग्रेजी',
    icon: 'Languages',
    color: 'from-purple-500 to-violet-600',
    chaptersCount: 15
  }
];

export const SAMPLE_CHAPTERS: Chapter[] = [
  {
    id: 'c1',
    slug: 'real-numbers',
    subjectId: 'math',
    title: 'Real Numbers',
    titleHi: 'वास्तविक संख्याएँ',
    grade: 10,
    description: 'यूक्लिड विभाजन प्रमेयिका, अंकगणित की आधारभूत प्रमेय और अपरिमेय संख्याओं का पुनर्भ्रमण।',
    topicsCount: 5,
    isDownloaded: true
  },
  {
    id: 'c2',
    slug: 'polynomials',
    subjectId: 'math',
    title: 'Polynomials',
    titleHi: 'बहुपद',
    grade: 10,
    description: 'बहुपद के शून्यकों का ज्यामितीय अर्थ, गुणांकों और शून्यकों के बीच संबंध।',
    topicsCount: 4,
    isDownloaded: false
  },
  {
    id: 'c3',
    slug: 'chemical-reactions',
    subjectId: 'science',
    title: 'Chemical Reactions and Equations',
    titleHi: 'रासायनिक अभिक्रियाएँ एवं समीकरण',
    grade: 10,
    description: 'संतुलित रासायनिक समीकरण, संयोजन, वियोजन, विस्थापन और द्विविस्थापन अभिक्रियाएँ।',
    topicsCount: 6,
    isDownloaded: true
  },
  {
    id: 'c4',
    slug: 'light-reflection-refraction',
    subjectId: 'science',
    title: 'Light - Reflection and Refraction',
    titleHi: 'प्रकाश — परावर्तन तथा अपवर्तन',
    grade: 10,
    description: 'गोलीय दर्पण, किरण आरेख, दर्पण सूत्र, आवर्धन तथा लेंस की क्षमता।',
    topicsCount: 7,
    isDownloaded: false
  }
];

export const SAMPLE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 'q1',
    topicSlug: 'real-numbers',
    question: 'What is the HCF of 135 and 225 using Euclid’s division algorithm?',
    questionHi: 'यूक्लिड विभाजन एल्गोरिथ्म का प्रयोग करके 135 और 225 का HCF (म.स.) क्या होगा?',
    options: ['15', '45', '75', '135'],
    correctIndex: 1,
    explanation: '225 = 135 × 1 + 90, फिर 135 = 90 × 1 + 45, फिर 90 = 45 × 2 + 0. शेषफल 0 आने पर अंतिम भाजक 45 है, अतः HCF = 45.',
    difficulty: 'medium'
  },
  {
    id: 'q2',
    topicSlug: 'chemical-reactions',
    question: 'When quicklime (CaO) reacts with water, what type of reaction occurs?',
    questionHi: 'जब बिना बुझा चूना (CaO) जल के साथ क्रिया करता है, तो यह किस प्रकार की अभिक्रिया है?',
    options: ['संयोजन एवं ऊष्माक्षेपी (Combination & Exothermic)', 'वियोजन (Decomposition)', 'विस्थापन (Displacement)', 'ऊष्माशोषी (Endothermic)'],
    correctIndex: 0,
    explanation: 'CaO + H2O → Ca(OH)2 + ऊष्मा। दो अभिकारक मिलकर एकल उत्पाद बनाते हैं और भारी मात्रा में ऊष्मा निकलती है।',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    topicSlug: 'light-reflection-refraction',
    question: 'Which mirror is used as a rear-view mirror in vehicles?',
    questionHi: 'वाहनों में पश्च-दृश्य (rear-view) दर्पण के रूप में कौन-सा दर्पण प्रयोग किया जाता है?',
    options: ['अवतल दर्पण (Concave)', 'उत्तल दर्पण (Convex)', 'समतल दर्पण (Plane)', 'उभयोत्तल (Double Convex)'],
    correctIndex: 1,
    explanation: 'उत्तल दर्पण सदैव सीधा, आभासी और छोटा प्रतिबिम्ब बनाते हैं तथा इनका दृष्टि-क्षेत्र (field of view) बहुत विस्तृत होता है।',
    difficulty: 'easy'
  }
];
