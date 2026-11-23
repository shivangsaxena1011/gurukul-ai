import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ChapterList } from './components/ChapterList';
import { TutorChat } from './components/TutorChat';
import { PracticeArena } from './components/PracticeArena';
import { OfflineManager } from './components/OfflineManager';
import { GuardianPortal } from './components/GuardianPortal';
import { VoiceModal } from './components/VoiceModal';
import { PhotoModal } from './components/PhotoModal';
import { OnboardingModal } from './components/OnboardingModal';
import { Chapter } from './types';
import { Sparkles, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'tutor' | 'practice' | 'offline' | 'guardian'>('home');
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [tutorInitialQuery, setTutorInitialQuery] = useState('');

  const handleStartTutorWithMode = (mode?: 'TEXT' | 'VOICE' | 'PHOTO') => {
    if (mode === 'VOICE') {
      setIsVoiceOpen(true);
    } else if (mode === 'PHOTO') {
      setIsPhotoOpen(true);
    } else {
      setActiveTab('tutor');
    }
  };

  const handleModalQuestionSubmit = (questionText: string) => {
    setTutorInitialQuery(questionText);
    setActiveTab('tutor');
  };

  const handleAskAboutChapter = (chapterTitle: string) => {
    setTutorInitialQuery(`${chapterTitle} के मुख्य बिंदु और उदाहरण सरल हिंदी में समझाइए।`);
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-ink-100 selection:bg-saffron-500 selection:text-ink-950">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab as any)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-6">
        {activeTab === 'home' && (
          <>
            <Hero
              onStartTutor={handleStartTutorWithMode}
              onExploreChapters={() => {}}
            />
            <ChapterList
              onSelectChapter={(ch) => handleAskAboutChapter(ch.titleHi)}
              onAskTutorAboutChapter={handleAskAboutChapter}
            />
          </>
        )}

        {activeTab === 'tutor' && (
          <div className="py-4">
            <TutorChat
              onOpenVoice={() => setIsVoiceOpen(true)}
              onOpenPhoto={() => setIsPhotoOpen(true)}
              initialQuery={tutorInitialQuery}
            />
          </div>
        )}

        {activeTab === 'practice' && <PracticeArena />}

        {activeTab === 'offline' && <OfflineManager />}

        {activeTab === 'guardian' && <GuardianPortal />}
      </main>

      {/* Modals */}
      <VoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSubmitQuestion={handleModalQuestionSubmit}
      />

      <PhotoModal
        isOpen={isPhotoOpen}
        onClose={() => setIsPhotoOpen(false)}
        onSubmitQuestion={handleModalQuestionSubmit}
      />

      <OnboardingModal />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-xs text-ink-500 space-y-2 bg-ink-950/40">
        <div className="flex items-center justify-center gap-1.5 font-bold text-ink-400">
          <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
          <span>GURUKUL AI — {t('झारखंड एवं भारत के छात्रों को समर्पित', 'Dedicated to students of Jharkhand and India')}</span>
        </div>
        <p className="text-[11px] text-ink-500">
          सॉक्रेटिक संकेत आधारित शिक्षण • 3D इंटरैक्टिव शिक्षा • पूर्णतः ऑफलाइन सक्षम
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
