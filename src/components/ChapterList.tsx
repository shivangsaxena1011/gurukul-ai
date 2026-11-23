import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getSubjectsForGrade, getChaptersForGradeAndBoard } from '../data/curriculum';
import { Card3DTilt } from './3d/Card3DTilt';
import { Chapter, Subject } from '../types';
import { soundFx } from '../utils/soundEffects';
import {
  BookOpen,
  CheckCircle2,
  Download,
  ArrowRight,
  Sparkles,
  Calculator,
  Atom,
  Globe,
  Languages,
  Radio,
  Filter,
  Check
} from 'lucide-react';

interface ChapterListProps {
  onSelectChapter: (chapter: Chapter) => void;
  onAskTutorAboutChapter: (title: string) => void;
  onOpenPodcast?: (chapter: Chapter) => void;
}

export const ChapterList: React.FC<ChapterListProps> = ({
  onSelectChapter,
  onAskTutorAboutChapter,
  onOpenPodcast
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  const subjects: Subject[] = getSubjectsForGrade(user.grade);
  const chapters: Chapter[] = getChaptersForGradeAndBoard(user.grade, user.board, selectedSubjectId);

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-amber-400" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Languages':
        return <Languages className="w-5 h-5 text-purple-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-rose-400" />;
    }
  };

  const handleSelectSubject = (subId: string) => {
    soundFx.playClick();
    setSelectedSubjectId(subId === selectedSubjectId ? 'all' : subId);
  };

  const handleAskAI = (chapter: Chapter) => {
    soundFx.playClick();
    const query = language === 'en'
      ? `Explain the key concepts, formulas, and board exam examples for Class ${user.grade} (${user.board}) ${chapter.title} in simple terms with step-by-step guidance.`
      : `${user.board || 'CBSE'} कक्षा ${user.grade} के अध्याय '${chapter.titleHi}' के मुख्य नियम, आवश्यक सूत्र और उदाहरण सरल भाषा में समझाएं।`;
    onAskTutorAboutChapter(query);
  };

  return (
    <section id="curriculum-section" className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('पाठ्यक्रम एवं विषय', 'Curriculum & Subjects')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} — {t('विषयवार अध्याय', 'Curriculum Chapters')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 mt-1">
            {t(
              'किसी भी विषय या अध्याय पर क्लिक करके तुरंत AI ट्यूटर से समझें, प्रश्न पूछें या 2-मिनट ऑडियो सुनें।',
              'Click any subject or chapter below for instant Socratic guidance, doubts, or 2-minute audio recaps.'
            )}
          </p>
        </div>

        {/* Selected Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleSelectSubject('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedSubjectId === 'all'
                ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 shadow-md font-extrabold'
                : 'bg-ink-900 border border-white/10 text-ink-300 hover:text-white'
            }`}
          >
            {t('सभी विषय (All)', 'All Subjects')}
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSubject(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedSubjectId === s.id
                  ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 shadow-md font-extrabold'
                  : 'bg-ink-900 border border-white/10 text-ink-300 hover:text-white'
              }`}
            >
              {language === 'en' ? s.name : s.nameHi}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Row (3D Tilt Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <Card3DTilt
              key={sub.id}
              onClick={() => handleSelectSubject(sub.id)}
              className={`glass-panel rounded-2xl p-4 text-center space-y-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-saffron-500 ring-2 ring-saffron-500/30 bg-saffron-500/10'
                  : 'glass-card-hover border-white/10'
              }`}
            >
              <div className="w-11 h-11 mx-auto rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center shadow-lg">
                {getSubjectIcon(sub.icon)}
              </div>
              <div>
                <h3 className="font-extrabold text-white text-xs sm:text-sm truncate">
                  {language === 'en' ? sub.name : sub.nameHi}
                </h3>
                <p className="text-[10px] text-ink-400 truncate">
                  {language === 'en' ? sub.nameHi : sub.name}
                </p>
              </div>
              <div className="text-[10px] uppercase font-bold text-saffron-400">
                {sub.chaptersCount} {t('अध्याय', 'Chapters')}
              </div>
            </Card3DTilt>
          );
        })}
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-saffron-400" />
            <span>
              {selectedSubjectId === 'all'
                ? t(`कक्षा ${user.grade} के प्रमुख अध्याय (${user.board || 'CBSE'})`, `Class ${user.grade} Core Chapters (${user.board || 'CBSE'})`)
                : t(`${subjects.find((s) => s.id === selectedSubjectId)?.nameHi || ''} — पाठ्यक्रम अध्याय`, `${subjects.find((s) => s.id === selectedSubjectId)?.name || ''} — Curriculum Chapters`)}
            </span>
          </h3>
          <span className="text-xs font-mono text-ink-400">
            {chapters.length} {t('अध्याय उपलब्ध', 'chapters available')}
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="p-8 text-center glass-panel border border-white/10 rounded-2xl text-ink-400 text-sm">
            {t('इस विषय के लिए अध्याय लोड हो रहे हैं…', 'Loading curriculum for this subject…')}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="glass-panel glass-card-hover border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-saffron-500/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20">
                      {chapter.subjectId.toUpperCase()} • {t('कक्षा', 'Cl.')} {chapter.grade}
                    </span>
                    {chapter.isDownloaded && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t('ऑफलाइन तैयार', 'Offline Ready')}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-white leading-snug">
                    {language === 'en' ? chapter.title : chapter.titleHi}
                  </h4>
                  <p className="text-xs text-ink-300 leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <button
                    onClick={() => handleAskAI(chapter)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-saffron-500/15 hover:bg-saffron-500/25 text-saffron-300 hover:text-white font-extrabold text-xs border border-saffron-500/30 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-saffron-400" />
                    <span>{t('AI से समझें', 'Ask AI')}</span>
                  </button>

                  {onOpenPodcast && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenPodcast(chapter);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center justify-center"
                      title={t('2-मिनट ऑडियो पॉडकास्ट', '2-Minute Audio Podcast')}
                    >
                      <Radio className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectChapter(chapter);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <span>{t('टॉपिक्स', 'Topics')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
