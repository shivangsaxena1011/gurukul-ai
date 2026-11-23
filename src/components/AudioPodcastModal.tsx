import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Chapter } from '../types';
import { soundFx } from '../utils/soundEffects';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  Radio,
  Clock,
  BookOpen,
  CheckCircle2
} from 'lucide-react';

interface AudioPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter?: Chapter | null;
}

export const AudioPodcastModal: React.FC<AudioPodcastModalProps> = ({
  isOpen,
  onClose,
  chapter
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [progress, setProgress] = useState(0); // 0 to 100
  const timerRef = useRef<number | null>(null);

  const title = chapter ? (isEn ? chapter.title : chapter.titleHi) : (isEn ? 'Chemical Reactions & Equations' : 'रासायनिक अभिक्रियाएँ एवं समीकरण');

  const podcastScriptHi = `नमस्कार! गुरुकुल AI 2-मिनट ऑडियो रीविज़न पॉडकास्ट में आपका स्वागत है। आज का अध्याय है: ${title}। 
पहला मुख्य बिंदु: रासायनिक अभिक्रिया में पदार्थ का रासायनिक संगठन बदलता है। मुख्य लक्षण हैं - गैस का निकलना, तापमान में परिवर्तन, और रंग में बदलाव। 
दूसरा मुख्य बिंदु: द्रव्यमान संरक्षण के नियम के अनुसार, किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है और न ही विनाश। इसलिए अभिकारकों और उत्पादों के परमाणुओं की संख्या हमेशा संतुलित होनी चाहिए।
तीसरा मुख्य बिंदु: संयोजन अभिक्रिया, वियोजन अभिक्रिया, विस्थापन अभिक्रिया, और रेडॉक्स अभिक्रियाएं बोर्ड परीक्षा के लिए अत्यंत महत्वपूर्ण हैं। 
परीक्षा टिप: कॉपर सल्फेट और लोहे की कील के प्रयोग का रंग परिवर्तन (नीले से हरा) 3-अंकों के प्रश्न में अक्सर पूछा जाता है। ध्यानपूर्वक अभ्यास करें!`;

  const podcastScriptEn = `Hello and welcome to the Gurukul AI 2-Minute Chapter Audio Revision Podcast! Today's focus is on: ${title}.
Key Point 1: A chemical reaction involves the breaking and forming of chemical bonds to create new substances. Key indicators include evolution of gas, change in temperature, and color shifts.
Key Point 2: According to the Law of Conservation of Mass, matter is neither created nor destroyed. Hence, the number of atoms in reactants must strictly equal the number in products.
Key Point 3: Master the 4 core reaction types for your board exams: Combination, Decomposition, Displacement, and Redox reactions.
Exam Tip: The reaction of Iron nails in Copper Sulphate solution and the color shift from blue to light green is a high-probability board question. Keep practicing!`;

  const activeScript = isEn ? podcastScriptEn : podcastScriptHi;

  useEffect(() => {
    if (!isOpen) {
      stopAudio();
      setProgress(0);
    }
  }, [isOpen]);

  const startAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(activeScript);
    utterance.lang = isEn ? 'en-IN' : 'hi-IN';
    utterance.rate = playbackRate;

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);

    // Simulate progress bar over ~120s / playbackRate
    const durationEstimate = 65 / playbackRate; // ~65 seconds audio
    let elapsed = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      elapsed += 0.5;
      const pct = Math.min(100, Math.round((elapsed / durationEstimate) * 100));
      setProgress(pct);
      if (pct >= 100 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 500);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    soundFx.playClick();
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const changeRate = (rate: number) => {
    soundFx.playClick();
    setPlaybackRate(rate);
    if (isPlaying) {
      stopAudio();
      setTimeout(() => {
        startAudio();
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => {
            stopAudio();
            onClose();
          }}
          aria-label="Close Audio Podcast"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('2-मिनट स्मार्ट ऑडियो पॉडकास्ट', '2-Minute Smart Audio Revision')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {title}
          </h2>
          <p className="text-xs text-ink-300">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} • {t('परीक्षा पूर्व त्वरित पुनरावलोकन', 'High-Yield Quick Revision')}
          </p>
        </div>

        {/* Visual Equalizer Waves */}
        <div className="p-6 rounded-2xl bg-ink-950/70 border border-white/10 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center gap-1.5 h-16 w-full">
            {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 65, 90, 40].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-gradient-to-t from-emerald-500 via-amber-400 to-saffron-400'
                    : 'bg-white/20'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (h * (progress + 20)) % 100)}%` : '15%',
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full space-y-1">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-saffron-500 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-ink-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{Math.floor((progress * 0.65) / 60)}:{(Math.floor((progress * 0.65) % 60)).toString().padStart(2, '0')}</span>
              </span>
              <span>1:05 min</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-4 pt-1">
            <button
              onClick={() => changeRate(playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ink-300 hover:text-white transition-colors"
            >
              {playbackRate}x
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-saffron-500 to-amber-500 text-ink-950 flex items-center justify-center shadow-xl shadow-saffron-500/30 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-ink-950" />
              ) : (
                <Play className="w-6 h-6 fill-ink-950 ml-1" />
              )}
            </button>

            <button
              onClick={() => {
                stopAudio();
                setProgress(0);
                setTimeout(() => startAudio(), 100);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bilingual Transcript Card */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-ink-400">
            <div className="flex items-center gap-1.5 text-saffron-400">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('पॉडकास्ट ट्रांसक्रिप्ट (Transcript)', 'Podcast Transcript')}</span>
            </div>
            <span className="text-[10px] text-ink-500">
              {isPlaying ? t('🔊 चल रहा है', '🔊 Playing') : t('रोक दिया गया', 'Paused')}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-ink-900/80 border border-white/10 text-xs sm:text-sm text-ink-200 leading-relaxed max-h-36 overflow-y-auto">
            {activeScript}
          </div>
        </div>

        {/* Board Exam High-Yield Summary Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <div className="font-bold flex items-center gap-1 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('महत्वपूर्ण समीकरण', 'Crucial Formulas')}</span>
            </div>
            <p className="text-[11px] text-ink-300">
              Fe + CuSO₄ → FeSO₄ + Cu
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
            <div className="font-bold flex items-center gap-1 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('अपेक्षित प्रश्न', 'Expected Question')}</span>
            </div>
            <p className="text-[11px] text-ink-300">
              {t('रेडॉक्स अभिक्रिया की परिभाषा (3 अंक)', 'Redox reaction proof (3 Marks)')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
