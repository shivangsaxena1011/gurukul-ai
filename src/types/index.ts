export type Language = 'hi' | 'en' | 'hg';

export interface GradeTier {
  range: string;
  hi: string;
  en: string;
  dhi: string;
  den: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  photoURL?: string;
  isGuest?: boolean;
  role: 'student' | 'guardian';
  grade: number; // 1 to 12
  board: string; // e.g. 'CBSE', 'ICSE', 'JCERT', 'BSEB', 'UPMSP'
  state: string; // e.g. 'Jharkhand', 'Bihar', 'Uttar Pradesh'
  city: string; // selected city inside state
  district: string; // alias/fallback for city
  preferredLanguage: Language;
  streakDays: number;
  totalPoints: number;
  linkCode: string;
}

export interface Subject {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
  color: string;
  chaptersCount: number;
}

export interface Chapter {
  id: string;
  slug: string;
  subjectId: string;
  title: string;
  titleHi: string;
  grade: number;
  description: string;
  topicsCount: number;
  isDownloaded?: boolean;
}

export interface Topic {
  id: string;
  slug: string;
  chapterSlug: string;
  title: string;
  titleHi: string;
  content: string;
  keyPoints: string[];
}

export interface TutorStep {
  title: string;
  detail: string;
}

export interface StructuredTutorResponse {
  reply?: string;
  conceptSnap?: string; // 3-second quick big-picture clarity
  understanding?: string;
  hint?: string;
  keyFormula?: string; // High-yield formula, equation, or theorem
  explanation?: string;
  steps?: TutorStep[];
  examTip?: string; // Common exam trap / mark-saving tip
  finalAnswer?: string;
  selfCheckChallenge?: {
    question: string;
    answer: string;
  };
  efficiencySummary?: string[]; // 3 rapid memory anchors
  followUp?: string[];
  demo?: boolean;
  outOfSyllabus?: boolean;
  language: 'HI' | 'EN' | 'HG' | 'TE';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  mode: 'TEXT' | 'VOICE' | 'PHOTO';
  timestamp: string;
  structured?: StructuredTutorResponse;
  audioUrl?: string;
}

export interface PracticeQuestion {
  id: string;
  topicSlug: string;
  question: string;
  questionHi: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface OfflinePack {
  slug: string;
  title: string;
  subject: string;
  grade: number;
  sizeBytes: number;
  savedAt: string;
  questionsCount: number;
}

export interface SyncRecord {
  clientId: string;
  kind: 'answer' | 'lesson-complete' | 'doubt';
  createdAt: string;
  payload: any;
  attempts: number;
}
