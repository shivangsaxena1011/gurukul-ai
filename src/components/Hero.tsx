import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { KnowledgeOrb3D } from './3d/KnowledgeOrb3D';
import { Card3DTilt } from './3d/Card3DTilt';
import {
  Sparkles,
  Camera,
  Mic,
  MessageSquare,
  BookOpen,
  WifiOff,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Edit3,
  Swords,
  Target
} from 'lucide-react';

interface HeroProps {
  onStartTutor: (mode?: 'TEXT' | 'VOICE' | 'PHOTO') => void;
  onExploreChapters: () => void;
  onOpenMathCanvas?: () => void;
  onOpenPeerBattle?: () => void;
  onOpenExamPredictor?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartTutor,
  onExploreChapters,
  onOpenMathCanvas,
  onOpenPeerBattle,
  onOpenExamPredictor
}) => {
  const { t } = useLanguage();
  const { user, setIsOnboardingOpen } = useAuth();

  return (
    <section className="relative pt-6 pb-16 px-4 lg:px-8 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-saffron-500/10 via-emerald-500/10 to-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('हिन्दी-प्रथम AI ट्यूटर', 'Hindi-First AI Tutor')} • {t('कक्षा 1 से 12', 'Classes 1 to 12')}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              {t('सीधे उत्तर नहीं,', 'Not just answers,')}{' '}
              <span className="bg-gradient-to-r from-saffron-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent">
                {t('पहले समझें, फिर सीखें', 'Understand first, then learn')}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-ink-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t(
                'झारखंड के छात्रों के लिए विशेष रूप से तैयार किया गया AI गुरु। किताब की फोटो खींचकर पूछें, बोलकर बात करें, या बिना इंटरनेट के भी ऑफलाइन अभ्यास करें।',
                'Specially designed AI Guru for students in Jharkhand. Snap a photo of your textbook question, speak in your language, or practice offline without internet.'
              )}
            </p>

            {/* Interactive CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onStartTutor('TEXT')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-500 to-amber-600 text-ink-950 font-extrabold text-base shadow-xl shadow-saffron-500/25 hover:shadow-saffron-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 fill-ink-950" />
                <span>{t('AI ट्यूटर से पूछें', 'Ask AI Tutor')}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onStartTutor('VOICE')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-ink-900 border border-white/10 text-white font-bold text-sm hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>{t('बोलकर पूछें', 'Voice Question')}</span>
              </button>

              <button
                onClick={() => onStartTutor('PHOTO')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-ink-900 border border-white/10 text-white font-bold text-sm hover:border-blue-500/50 hover:bg-blue-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Camera className="w-4 h-4 text-blue-400" />
                <span>{t('फोटो से पूछें', 'Snap Photo')}</span>
              </button>
            </div>

            {/* Quick Feature Launch Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {onOpenMathCanvas && (
                <button
                  onClick={onOpenMathCanvas}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/20 hover:scale-105 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t('हस्तलिखित मैथ सॉल्वर', 'Math Canvas')}</span>
                </button>
              )}
              {onOpenPeerBattle && (
                <button
                  onClick={onOpenPeerBattle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/20 hover:scale-105 transition-all"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{t('1v1 ज्ञान मुकाबला', '1v1 Peer Battle')}</span>
                </button>
              )}
              {onOpenExamPredictor && (
                <button
                  onClick={onOpenExamPredictor}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold hover:bg-purple-500/20 hover:scale-105 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{t('AI बोर्ड प्रेडिक्टर', 'Board Predictor')}</span>
                </button>
              )}
            </div>

            {/* Current Student Profile Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-ink-400">
              <div
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1.5 bg-ink-900/80 px-3 py-1.5 rounded-lg border border-white/10 cursor-pointer hover:border-saffron-500/30 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-saffron-400" />
                <span>{user.city || user.district}, {user.state || 'Jharkhand'} • {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} ({t('बदलें', 'Change')})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('NCERT एवं राज्य बोर्ड आधारित पाठ्यक्रम', 'NCERT & State Board Aligned Curriculum')}</span>
              </div>
            </div>
          </div>

          {/* Right 3D Visual Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative mt-6 lg:mt-0">
            <div className="relative w-full max-w-[300px] sm:max-w-[360px] aspect-square flex items-center justify-center">
              {/* Three.js Canvas */}
              <KnowledgeOrb3D size={320} className="filter drop-shadow-[0_0_40px_rgba(245,158,11,0.2)]" />

              {/* Floating 3D Stat Badges */}
              <div className="absolute top-1 left-1 sm:-left-4 glass-panel-gold rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-xl animate-float-slow backdrop-blur-md">
                <div className="text-[9px] sm:text-[10px] uppercase font-bold text-saffron-400">
                  {t('सॉक्रेटिक शिक्षण', 'Socratic Tutor')}
                </div>
                <div className="text-[11px] sm:text-xs font-extrabold text-white">
                  {t('पहले संकेत, फिर उत्तर', 'Hints before answers')}
                </div>
              </div>

              <div className="absolute bottom-2 right-1 sm:-right-4 glass-panel rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-xl animate-float-slow backdrop-blur-md" style={{ animationDelay: '-3s' }}>
                <div className="flex items-center gap-1 text-[9px] sm:text-[10px] uppercase font-bold text-emerald-400">
                  <WifiOff className="w-3 h-3" />
                  <span>{t('100% ऑफलाइन', '100% Offline')}</span>
                </div>
                <div className="text-[11px] sm:text-xs font-extrabold text-white">
                  {t('बिना डेटा के पढ़ाई', 'Study without internet')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Value Pillars (3D Tilt Cards) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          <Card3DTilt className="glass-panel glass-card-hover rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              {t('सॉक्रेटिक संकेत (Hints First)', 'Socratic Hints First')}
            </h2>
            <p className="text-xs text-ink-300 leading-relaxed">
              {t(
                'AI तुरंत सीधा उत्तर नहीं देता। पहले सवाल की समझ, फिर सोचने के लिए संकेत और चरणबद्ध दिशा देता है।',
                'AI gives understanding and guided hints first, empowering you to solve it yourself.'
              )}
            </p>
          </Card3DTilt>

          <Card3DTilt className="glass-panel glass-card-hover rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              {t('फोटो से सवाल पूछें', 'Snap & Solve')}
            </h2>
            <p className="text-xs text-ink-300 leading-relaxed">
              {t(
                'किताब या कॉपी के किसी भी कठिन प्रश्न की तस्वीर लें। Qwen Vision AI उसे पढ़कर तुरंत मार्गदर्शन करेगा।',
                'Take a photo of your workbook question. Advanced Vision AI reads Devanagari and diagrams.'
              )}
            </p>
          </Card3DTilt>

          <Card3DTilt className="glass-panel glass-card-hover rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              {t('आवाज़ में बातचीत', 'Voice Interactive')}
            </h2>
            <p className="text-xs text-ink-300 leading-relaxed">
              {t(
                'टाइप करने की जरूरत नहीं। अपनी भाषा में बोलकर सवाल पूछें और प्राकृतिक हिंदी आवाज़ में व्याख्या सुनें।',
                'No typing needed. Ask questions speaking naturally and listen to clear Hindi voice explanations.'
              )}
            </p>
          </Card3DTilt>

          <Card3DTilt className="glass-panel glass-card-hover rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3">
              <WifiOff className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              {t('ऑफलाइन सिंक इंजन', 'Offline Sync Engine')}
            </h2>
            <p className="text-xs text-ink-300 leading-relaxed">
              {t(
                'चैप्टर पैक्स डाउनलोड करें। बिना इंटरनेट हल किए गए उत्तर कनेक्टिविटी आने पर खुद-ब-खुद सिंक हो जाते हैं।',
                'Download chapter packs. Solved questions and doubts sync automatically upon reconnection.'
              )}
            </p>
          </Card3DTilt>
        </div>

        {/* Live Production Readiness Metrics Banner */}
        <div className="mt-12 p-6 rounded-3xl glass-panel border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-white/10 shadow-2xl">
          <div className="pt-2 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">45,280+</div>
            <div className="text-xs text-ink-400 mt-1">{t('सॉक्रेटिक प्रश्न हल हुए', 'Questions Guided')}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">98.4%</div>
            <div className="text-xs text-ink-400 mt-1">{t('अवधारणा स्पष्टता दर', 'Concept Clarity Rate')}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-sky-400 font-display">14 {t('राज्य बोर्ड', 'Boards')}</div>
            <div className="text-xs text-ink-400 mt-1">{t('CBSE व राज्य पाठ्यक्रम', 'Curriculums Aligned')}</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-2xl sm:text-3xl font-black text-purple-400 font-display">100% {t('ऑफलाइन', 'Offline')}</div>
            <div className="text-xs text-ink-400 mt-1">{t('P2P QR डेटा-मुक्त इंजन', 'P2P Zero-Data Engine')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
