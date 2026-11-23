import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  BookOpen,
  WifiOff,
  GraduationCap,
  Award,
  Globe2,
  Zap,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AuthLandingPageProps {
  onEnter: () => void;
}

export const AuthLandingPage: React.FC<AuthLandingPageProps> = ({ onEnter }) => {
  const { language, setLanguage, t } = useLanguage();
  const { signInGoogle, continueAsGuest } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    soundFx.playClick();
    setIsSubmitting(true);
    try {
      await signInGoogle();
      onEnter();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryOnce = () => {
    soundFx.playClick();
    continueAsGuest();
    onEnter();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-950 relative overflow-hidden">
      {/* Background Decorative Ambient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-200/40 via-saffron-100/30 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-emerald-100/40 blur-3xl pointer-events-none -z-10" />

      {/* Top Bar with Language Selector */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-saffron-500 via-amber-500 to-amber-600 p-0.5 shadow-md shadow-saffron-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">GURUKUL AI</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                PROD v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {t('अग्रणी सॉक्रेटिक शिक्षण मंच', 'Next-Gen Socratic Learning Engine')}
            </p>
          </div>
        </div>

        {/* Language Toggle Pills */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200/90 shadow-sm text-xs font-bold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              language === 'hi'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिन्दी
          </button>
          <button
            onClick={() => setLanguage('hg')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              language === 'hg'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hinglish
          </button>
        </div>
      </header>

      {/* Main Center Entry Card Section */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Educational Value Proposition */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-800 text-xs font-bold shadow-sm">
            <Zap className="w-4 h-4 text-amber-600 animate-bounce" />
            <span>{t('कक्षा 1 से 12 • NCERT एवं राज्य बोर्ड', 'Classes 1–12 • NCERT & State Board Curriculums')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {t(
              'सीखिए समझ के साथ, बिना किसी रटंत प्रणाली के',
              'Master concepts intuitively with India’s 1st Socratic AI'
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto md:mx-0">
            {t(
              'गुरुकुल AI छात्रों को सीधे उत्तर देने के बजाय चरणबद्ध संकेत (Socratic Clues), आवश्यक सूत्र और परीक्षा युक्तियाँ प्रदान करता है — जिससे आपकी समझ और परीक्षा में प्रदर्शन दोनों 10 गुना बेहतर होते हैं।',
              'Instead of dumping blind answers, Gurukul AI guides students with step-by-step Socratic clues, Cartesian sign rules, active-recall challenges, and high-probability board exam traps.'
            )}
          </p>

          {/* Core Feature Bullet Highlights */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2 text-left">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 text-amber-700">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('सॉक्रेटिक AI ट्यूटर', 'Socratic AI Tutor')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('3-सेकंड कॉन्सेप्ट स्नैप व सूत्र कार्ड', '3-sec concept snap & formula cards')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-700">
                <WifiOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('100% डेटा-मुक्त P2P QR', 'Zero-Data P2P QR')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('बिना इंटरनेट फ़ोन-से-फ़ोन चैप्टर शेयर', 'Device-to-device offline chapter share')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('हस्तलिखित मैथ कैनवस', 'Math Canvas & Vision')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('हाथ से सूत्र लिखें, AI चरणबद्ध हल देगा', 'Draw math equations with step-by-step proofs')}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center flex-shrink-0 text-purple-700">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{t('1v1 पीयर बैटल क्विज़', '1v1 Socratic Peer Battle')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('साथियों के साथ खेलें व अंक अर्जित करें', 'Compete live with students across India')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dedicated Gate Entry Card */}
        <div className="md:col-span-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative">
            {/* Top Accent Pill */}
            <div className="text-center space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('तुरंत प्रवेश द्वार (Quick Access)', 'Instant Student Gateway')}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {t('शिक्षा की दुनिया में प्रवेश करें', 'Enter Gurukul AI')}
              </h2>
              <p className="text-xs text-slate-600">
                {t('गूगल से लॉगिन करें या बिना लॉगिन सीधे अध्ययन शुरू करें', 'Choose your login option to launch into your workspace')}
              </p>
            </div>

            {/* Entry Actions */}
            <div className="space-y-3.5">
              {/* Option 1: Google Login Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border border-slate-300 shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t('गूगल से लॉगिन करें (Google Login)', 'Continue with Google')}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:text-slate-700" />
              </button>

              {/* Visual Divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest absolute">
                  {t('या तुरंत शुरू करें', 'OR TRY ONCE')}
                </span>
              </div>

              {/* Option 2: Try Once / Guest Entrance (Highlighted) */}
              <button
                onClick={handleTryOnce}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-saffron-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <Compass className="w-5 h-5 text-slate-950 flex-shrink-0" />
                <span>{t('बिना लॉगिन सीधे आज़माएँ (Try Once)', 'Try Once Without Login')}</span>
                <ArrowRight className="w-4 h-4 ml-auto text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Privacy & Guarantee note */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('कोई क्रेडिट कार्ड या शुल्क नहीं — 100% निःशुल्क', 'No credit card or payments — 100% Free Forever')}</span>
              </div>
              <p>
                {t(
                  'छात्र का डेटा स्थानीय रूप से सुरक्षित रहता है। बाद में किसी भी समय Google सिंक कर सकते हैं।',
                  'Your study logs are preserved offline in IndexedDB and can be synced anytime.'
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Bottom Footer with Developer Attribution */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>GURUKUL AI — {t('झारखंड एवं भारत के छात्रों को समर्पित', 'Dedicated to students across Jharkhand and India')}</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
          <span>{t('डेवलपर: शिवांग सक्सेना', 'Architected & Developed by: Shivang Saxena')}</span>
        </div>
      </footer>
    </div>
  );
};
