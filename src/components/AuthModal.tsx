import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GurukulLogo } from './GurukulLogo';
import { soundFx } from '../utils/soundEffects';
import {
  X,
  Sparkles,
  CheckCircle2,
  Compass,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthModalOpen, setIsAuthModalOpen, signInGoogle, continueAsGuest } = useAuth();

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    soundFx.playClick();
    await signInGoogle();
  };

  const handleGuestClick = () => {
    soundFx.playClick();
    continueAsGuest();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          aria-label="Close Auth Modal"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <GurukulLogo size="lg" />
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            GURUKUL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">AI</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
            {t(
              'सीखने की शुरुआत करें — गूगल से सुरक्षित लॉगिन करें या बिना लॉगिन तुरंत आज़माएँ।',
              'Start learning — Sign in securely with Google or try once as a guest immediately.'
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* 1. Google Sign-In Button */}
          <button
            onClick={handleGoogleClick}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{t('Google से लॉगिन करें', 'Sign in with Google')}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider absolute">
              {t('या', 'OR')}
            </span>
          </div>

          {/* 2. Try Once / Guest Access Button */}
          <button
            onClick={handleGuestClick}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 hover:from-saffron-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm shadow-md shadow-saffron-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>{t('बिना लॉगिन सीधे आज़माएँ (Try Once)', 'Try Once without Login (Guest Mode)')}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{t('कक्षा 1 से 12 तक सभी NCERT व राज्य बोर्ड पाठ्यक्रम', 'All classes 1 to 12 NCERT & State Board curriculums')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{t('सॉक्रेटिक AI ट्यूटर — समझ पहले, उत्तर बाद में', 'Socratic AI Tutor — Concept hints before final answer')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{t('100% डेटा-मुक्त ऑफलाइन P2P QR अध्ययन', '100% Offline study packs with zero mobile data')}</span>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-400">
          {t('छात्रों के लिए 100% निःशुल्क एवं सुरक्षित शिक्षा', '100% Free & Safe Educational Platform for Students')}
        </p>
      </div>
    </div>
  );
};
