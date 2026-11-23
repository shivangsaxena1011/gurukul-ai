import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_QUESTIONS } from '../data/constants';
import { soundFx } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Swords,
  Timer,
  Award,
  Zap,
  CheckCircle,
  XCircle,
  Sparkles,
  X,
  RotateCcw,
  Trophy
} from 'lucide-react';

interface PeerBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeerBattleModal: React.FC<PeerBattleModalProps> = ({
  isOpen,
  onClose
}) => {
  const { language, t } = useLanguage();
  const { user, updateUser } = useAuth();
  const isEn = language === 'en';

  const [questionIdx, setQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [peerScore, setPeerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const peerNames = [
    { name: isEn ? 'Ananya (Ranchi)' : 'अनन्या (राँची)', avatar: '👩‍🎓' },
    { name: isEn ? 'Rohit (Patna)' : 'रोहित (पटना)', avatar: '🧑‍🎓' },
    { name: isEn ? 'Pooja (Dhanbad)' : 'पूजा (धनबाद)', avatar: '👩‍💻' },
    { name: isEn ? 'Aarav (Jamshedpur)' : 'आरव (जमशेदपुर)', avatar: '🧑‍💻' },
  ];
  const [peer] = useState(() => peerNames[Math.floor(Math.random() * peerNames.length)]);

  const questions = SAMPLE_QUESTIONS.slice(0, 5);
  const currentQ = questions[questionIdx] || questions[0];

  useEffect(() => {
    if (!isOpen) {
      resetGame();
      return;
    }
  }, [isOpen]);

  // Countdown timer for each question
  useEffect(() => {
    if (!isOpen || isAnswered || isFinished) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isAnswered, isFinished]);

  const handleTimeout = () => {
    setIsAnswered(true);
    // Peer might get it right (75% probability)
    if (Math.random() > 0.3) {
      setPeerScore(s => s + 10);
    }
    setTimeout(nextQuestion, 2000);
  };

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isUserCorrect = idx === currentQ.correctIndex;
    if (isUserCorrect) {
      soundFx.playCorrect();
      setUserScore(s => s + 10);
    } else {
      soundFx.playIncorrect();
    }

    // Simulate peer answer
    const peerCorrect = Math.random() > 0.35;
    if (peerCorrect) {
      setPeerScore(s => s + 10);
    }

    setTimeout(nextQuestion, 2000);
  };

  const nextQuestion = () => {
    if (questionIdx + 1 >= questions.length) {
      setIsFinished(true);
      soundFx.playVictory();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Give points bonus to user
      updateUser({ totalPoints: user.totalPoints + 30 });
    } else {
      setQuestionIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(15);
    }
  };

  const resetGame = () => {
    setQuestionIdx(0);
    setUserScore(0);
    setPeerScore(0);
    setTimeLeft(15);
    setSelectedOpt(null);
    setIsAnswered(false);
    setIsFinished(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Peer Battle"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-700 text-xs font-bold">
            <Swords className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('1v1 लाइव सोक्रेटिक बैटल', '1v1 Live Socratic Peer Battle')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t('ज्ञान का मुकाबला', 'Battle of Knowledge')}
          </h2>
          <p className="text-xs text-slate-500">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} • 5 {t('तीव्र प्रश्न', 'Fast-Paced Questions')}
          </p>
        </div>

        {/* Competitor Scoreboard Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
          {/* User Side */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-sm">
              🧑‍🎓
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 truncate max-w-[100px] sm:max-w-none">
                {user.name} ({t('आप', 'You')})
              </div>
              <div className="text-base font-extrabold text-saffron-700 font-mono">
                {userScore} pts
              </div>
            </div>
          </div>

          {/* VS & Timer */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">VS</span>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold mt-1 ${
              timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-bounce' : 'bg-amber-100 text-amber-800'
            }`}>
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Peer Side */}
          <div className="flex items-center gap-3 text-right flex-row-reverse">
            <div className="w-12 h-12 rounded-xl bg-blue-100 border border-blue-300 flex items-center justify-center text-2xl shadow-sm">
              {peer.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800 truncate max-w-[100px] sm:max-w-none">
                {peer.name}
              </div>
              <div className="text-base font-extrabold text-blue-700 font-mono">
                {peerScore} pts
              </div>
            </div>
          </div>
        </div>

        {/* Main Battle Content */}
        {!isFinished ? (
          <div className="space-y-4">
            {/* Question Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700">
                {t('प्रश्न', 'Question')} #{questionIdx + 1} / {questions.length}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {t(currentQ.questionHi, currentQ.question)}
              </h3>
            </div>

            {/* Options */}
            <div className="grid gap-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-saffron-400 hover:bg-saffron-50/30 shadow-sm';

                if (selectedOpt === idx) {
                  btnStyle = 'border-saffron-500 bg-saffron-50 text-slate-950 font-bold ring-2 ring-saffron-400/40';
                }

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400/40';
                  } else if (selectedOpt === idx) {
                    btnStyle = 'border-rose-400 bg-rose-50 text-rose-800 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />
                    )}
                    {isAnswered && selectedOpt === idx && idx !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Victory / Match Result Screen */
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-white border border-amber-200 text-center space-y-4 animate-fade-in shadow-md">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                {userScore >= peerScore
                  ? t('🎉 शानदार विजय! आप विजेता बने!', '🎉 Victory! You Won the Match!')
                  : t('कड़ा मुकाबला! अच्छा प्रयास!', 'Great Effort! Close Match!')}
              </h3>
              <p className="text-xs text-slate-600">
                {userScore} pts vs {peerScore} pts
              </p>
            </div>

            <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300 text-xs font-bold text-amber-900 inline-block">
              +30 {t('बोनस गुरुकुल अंक आपके खाते में जोड़े गए!', 'Bonus Points Added to Profile!')}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={resetGame}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('फिर से खेलें', 'Play Again')}</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {t('बंद करें', 'Close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
