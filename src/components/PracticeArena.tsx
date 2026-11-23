import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_QUESTIONS } from '../data/constants';
import { PracticeQuestion } from '../types';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Flame,
  Lightbulb,
  Sparkles,
  Edit3,
  RotateCcw
} from 'lucide-react';

export const PracticeArena: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, updateUser } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);

  // Scratchpad canvas state
  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const question: PracticeQuestion = SAMPLE_QUESTIONS[currentIdx] || SAMPLE_QUESTIONS[0];
  const isCorrect = selectedOption === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    soundFx.playClick();
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    if (isCorrect) {
      soundFx.playCorrect();
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#F59E0B', '#10B981', '#38BDF8', '#FDE68A']
      });
      setScore((s) => s + 10);
      updateUser({ totalPoints: user.totalPoints + 10 });
    } else {
      soundFx.playIncorrect();
    }
  };

  const handleNext = () => {
    soundFx.playClick();
    setSelectedOption(null);
    setIsSubmitted(false);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % SAMPLE_QUESTIONS.length);
  };

  // Scratchpad drawing logic
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const clearScratchpad = () => {
    const canvas = scratchCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('दैनिक अभ्यास क्विज़', 'Daily Practice Quiz')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {t('अभ्यास से सफलता', 'Practice for Mastery')}
          </h2>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl text-amber-700 font-bold text-sm">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
            <span>+{score} pts</span>
          </div>
          <div className="text-xs font-bold text-slate-500 font-mono">
            {currentIdx + 1} / {SAMPLE_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl shadow-slate-200/50 relative">
        {/* Question Header & Scratchpad button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-saffron-600">
            {t('प्रश्न', 'Question')} #{currentIdx + 1} ({question.difficulty})
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                showScratchpad
                  ? 'bg-amber-500 text-slate-900 border-amber-400 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('रफ कार्य (Scratchpad)', 'Scratchpad')}</span>
            </button>

            {!isSubmitted && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  showHint
                    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>{t('संकेत (Hint)', 'Hint')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Scratchpad Area */}
        {showScratchpad && (
          <div className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>{t('रफ गणना यहाँ करें (Scratchpad):', 'Scratchpad for calculations:')}</span>
              <button
                onClick={clearScratchpad}
                className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t('साफ़ करें', 'Clear')}</span>
              </button>
            </div>
            <canvas
              ref={scratchCanvasRef}
              width={600}
              height={140}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={() => setIsDrawing(false)}
              className="w-full h-32 bg-white rounded-xl cursor-crosshair border border-amber-200 block touch-none shadow-inner"
            />
          </div>
        )}

        {/* Socratic Hint Clue */}
        {showHint && !isSubmitted && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block mb-0.5 font-bold text-amber-800">{t('सॉक्रेटिक संकेत:', 'Socratic Clue:')}</strong>
              <span className="text-amber-800/90">
                {language === 'en'
                  ? 'Identify the core law or formula associated with this topic before selecting your final answer.'
                  : 'उत्तर चुनने से पहले अध्याय के मूल नियम या समीकरण (जैसे द्रव्यमान संरक्षण या यूक्लिड प्रमेय) को याद करें।'}
              </span>
            </div>
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
          {t(question.questionHi, question.question)}
        </h3>

        {/* Options Grid */}
        <div className="grid gap-3">
          {question.options.map((option, idx) => {
            let optionStyles = 'border-slate-200 bg-slate-50/80 text-slate-700 hover:border-saffron-400 hover:bg-saffron-50/40 hover:text-slate-900 shadow-sm';

            if (selectedOption === idx) {
              optionStyles = 'border-saffron-500 bg-saffron-50 text-saffron-950 font-bold ring-2 ring-saffron-400/40 shadow-md';
            }

            if (isSubmitted) {
              if (idx === question.correctIndex) {
                optionStyles = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400/40';
              } else if (selectedOption === idx) {
                optionStyles = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
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
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                )}
                {isSubmitted && selectedOption === idx && idx !== question.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 text-slate-950 font-extrabold text-base shadow-lg shadow-saffron-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all cursor-pointer"
          >
            {t('उत्तर जाँचें (Check Answer)', 'Check Answer')}
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Feedback Box */}
            <div className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                {isCorrect
                  ? t('🎉 शाबाश! सही उत्तर (+10 अंक)', '🎉 Well done! Correct Answer (+10 pts)')
                  : t('💡 उत्तर सही नहीं है, व्याख्या देखें:', '💡 Incorrect, see explanation below:')}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {question.explanation}
              </p>
            </div>

            {/* Next Question CTA */}
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
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
