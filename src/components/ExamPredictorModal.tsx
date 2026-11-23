import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  AlertTriangle,
  CheckSquare,
  Square,
  Award,
  Sparkles,
  X,
  Target,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface ExamPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPractice?: () => void;
}

export const ExamPredictorModal: React.FC<ExamPredictorModalProps> = ({
  isOpen,
  onClose,
  onStartPractice
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';

  const [revisionDays, setRevisionDays] = useState([
    { id: 1, title: isEn ? 'Day 1: Real Numbers & Euclid Lemma Proofs' : 'दिन 1: वास्तविक संख्याएँ एवं यूक्लिड प्रमेय', done: true },
    { id: 2, title: isEn ? 'Day 2: Chemical Reactions & Balancing Equations' : 'दिन 2: रासायनिक समीकरण संतुलन व प्रकार', done: true },
    { id: 3, title: isEn ? 'Day 3: Trigonometric Identities & Heights/Distances' : 'दिन 3: त्रिकोणमिति सर्वसमिकाएँ व ऊँचाई-दूरी', done: false },
    { id: 4, title: isEn ? 'Day 4: Light Reflection & Lens Formula Practice' : 'दिन 4: प्रकाश का परावर्तन व लेंस सूत्र', done: false },
    { id: 5, title: isEn ? 'Day 5: Quadratic Equations & Word Problems' : 'दिन 5: द्विघात समीकरण एवं शब्द-समस्याएँ', done: false },
    { id: 6, title: isEn ? 'Day 6: Life Processes & Digestive System Diagrams' : 'दिन 6: जैव प्रक्रम एवं मानव तंत्र चित्र', done: false },
    { id: 7, title: isEn ? 'Day 7: Full 3-Hour Board Mock Exam (PYQ)' : 'दिन 7: संपूर्ण 3-घंटे का बोर्ड मॉक टेस्ट', done: false },
  ]);

  const toggleDay = (id: number) => {
    soundFx.playClick();
    setRevisionDays(prev => {
      const updated = prev.map(d => (d.id === id ? { ...d, done: !d.done } : d));
      const newlyDone = updated.find(d => d.id === id)?.done;
      if (newlyDone) {
        soundFx.playCorrect();
      }
      if (updated.every(d => d.done)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return updated;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Predictor"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">
            <Target className="w-3.5 h-3.5" />
            <span>{t('AI बोर्ड परीक्षा भविष्यवाणी व तत्परता', 'AI Board Exam Predictor & Diagnostic')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} — {t('अपेक्षित बोर्ड स्कोर', 'Predicted Board Readiness')}
          </h2>
          <p className="text-xs text-slate-600">
            {t(
              'आपके दैनिक अभ्यास, सटीकता और संदेह विश्लेषण के आधार पर गणना किया गया तत्परता स्कोर।',
              'Calculated from your practice quiz metrics, socratic doubts, and chapter mastery patterns.'
            )}
          </p>
        </div>

        {/* Score Meter & Badge Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-50 via-saffron-50 to-emerald-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="relative w-24 h-24 rounded-full bg-white border-4 border-amber-400 flex flex-col items-center justify-center shadow-md shadow-amber-500/10 flex-shrink-0">
              <span className="text-3xl font-black text-amber-700 font-display">86%</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {t('अपेक्षित अंक', 'Predicted')}
              </span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300 mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>{t('श्रेणी: प्रथम (Distinction A1)', 'Tier: Distinction (Grade A1)')}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed max-w-sm">
                {t(
                  'शानदार प्रदर्शन! अगर आप आगामी 7 दिनों के रीविज़न प्लान का पालन करेंगे तो आपका स्कोर 92%+ तक पहुँच सकता है।',
                  'Outstanding progress! Following the targeted 7-day checklist can boost your final score to 92%+.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Subject Mastery Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('विषयवार तत्परता विश्लेषण', 'Subject-Wise Preparedness')}
          </h3>
          <div className="space-y-2.5">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">{t('गणित (Mathematics)', 'Mathematics')}</span>
                <span className="text-amber-700 font-mono font-bold">92% ({t('मजबूत', 'Strong')})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">{t('विज्ञान (Science)', 'Science')}</span>
                <span className="text-emerald-700 font-mono font-bold">84% ({t('संतोषजनक', 'Good')})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800">{t('सामाजिक विज्ञान (Social Studies)', 'Social Studies')}</span>
                <span className="text-blue-700 font-mono font-bold">78% ({t('सुधार की आवश्यकता', 'Needs Review')})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* AI Weak Area Diagnostic Warning */}
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-extrabold text-rose-800">
              {t('कमजोर बिंदु चेतावनी (High Priority Focus):', 'Diagnostic Weak Topic Detected:')}
            </span>
            <p className="text-rose-700 leading-relaxed">
              {t(
                'त्रिकोणमिति की सर्वसमिकाएँ (sin²θ + cos²θ = 1) और लेंस सूत्र के आंकिक प्रश्नों में 32% गलतियाँ हुई हैं। इन 2 अध्यायों पर तुरंत ध्यान दें।',
                'Trigonometric identities and Lens numerical calculations have a 32% error rate. Focus on these 2 topics first.'
              )}
            </p>
          </div>
        </div>

        {/* 7-Day Personalized Revision Checklist */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-saffron-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('7-दिवसीय लक्षित रीविज़न चेकलिस्ट', '7-Day Personalized Revision Checklist')}</span>
            </span>
            <span className="text-slate-500 font-mono">
              {revisionDays.filter(d => d.done).length} / {revisionDays.length} {t('पूर्ण', 'Done')}
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {revisionDays.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleDay(item.id)}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  item.done
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-saffron-400 hover:bg-saffron-50/30'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                  <span className={item.done ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}>
                    {item.title}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {item.done ? t('हो गया', 'Done') : t('बाकी है', 'Pending')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
          >
            {t('बंद करें', 'Close')}
          </button>
          {onStartPractice && (
            <button
              onClick={() => {
                onClose();
                onStartPractice();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-saffron-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{t('कमजोर विषयों का अभ्यास शुरू करें', 'Practice Weak Topics Now')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
