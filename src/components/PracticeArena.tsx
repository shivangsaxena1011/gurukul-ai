import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_QUESTIONS } from '../data/constants';
import { PracticeQuestion } from '../types';
import {
  Award,
  CheckCircle,
  XCircle,
  ArrowRight,
  Flame,
  HelpCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const question: PracticeQuestion = SAMPLE_QUESTIONS[currentIdx] || SAMPLE_QUESTIONS[0];
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (isCorrect) {
      setScore((s) => s + 10);
      updateUser({ totalPoints: user.totalPoints + 10 });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setCurrentIdx((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('दैनिक अभ्यास क्विज़', 'Daily Practice Quiz')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {t('अभ्यास से सफलता', 'Practice for Mastery')}
          </h2>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-400 font-bold text-sm">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>+{score} pts</span>
          </div>
          <div className="text-xs font-bold text-ink-400">
            {currentIdx + 1} / {SAMPLE_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Question Prompt */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-400">
            {t('प्रश्न', 'Question')} #{currentIdx + 1} ({question.difficulty})
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {t(question.questionHi, question.question)}
          </h3>
        </div>

        {/* Options Grid */}
        <div className="grid gap-3">
          {question.options.map((option, idx) => {
            let optionStyles = 'border-white/10 bg-ink-950/60 text-ink-200 hover:border-saffron-500/40 hover:bg-white/5';

            if (selectedOption === idx) {
              optionStyles = 'border-saffron-500 bg-saffron-500/10 text-white font-bold ring-2 ring-saffron-500/20';
            }

            if (isSubmitted) {
              if (idx === question.correctIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold ring-2 ring-emerald-500/30';
              } else if (selectedOption === idx) {
                optionStyles = 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-center justify-between ${optionStyles}`}
              >
                <span>{option}</span>
                {isSubmitted && idx === question.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />
                )}
                {isSubmitted && selectedOption === idx && idx !== question.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Button */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-extrabold text-base shadow-xl shadow-saffron-500/25 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all"
          >
            {t('उत्तर जाँचें (Check Answer)', 'Check Answer')}
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Feedback Box */}
            <div className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                {isCorrect
                  ? t('🎉 शाबाश! सही उत्तर (+10 अंक)', '🎉 Well done! Correct Answer (+10 pts)')
                  : t('💡 उत्तर सही नहीं है, व्याख्या देखें:', '💡 Incorrect, see explanation below:')}
              </div>
              <p className="text-xs sm:text-sm text-ink-200 leading-relaxed font-normal">
                {question.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>{t('अगला प्रश्न', 'Next Question')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
