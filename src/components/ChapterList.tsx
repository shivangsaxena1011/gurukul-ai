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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('पाठ्यक्रम एवं विषय', 'Curriculum & Subjects')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} — {t('विषयवार अध्याय', 'Curriculum Chapters')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
              selectedSubjectId === 'all'
                ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('सभी विषय (All)', 'All Subjects')}
          </button>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelectSubject(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-xs ${
                selectedSubjectId === s.id
                  ? 'bg-amber-600 text-white shadow-sm font-extrabold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
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
              className={`rounded-2xl p-4 text-center space-y-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-2 border-amber-500 bg-amber-50/70 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300'
              }`}
            >
              <div className="w-11 h-11 mx-auto rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                {getSubjectIcon(sub.icon)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {language === 'en' ? sub.name : sub.nameHi}
                </h3>
                <p className="text-[10px] text-slate-500 truncate">
                  {language === 'en' ? sub.nameHi : sub.name}
                </p>
              </div>
              <div className="text-[10px] uppercase font-bold text-amber-700">
                {sub.chaptersCount} {t('अध्याय', 'Chapters')}
              </div>
            </Card3DTilt>
          );
        })}
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <span>
              {selectedSubjectId === 'all'
                ? t(`कक्षा ${user.grade} के प्रमुख अध्याय (${user.board || 'CBSE'})`, `Class ${user.grade} Core Chapters (${user.board || 'CBSE'})`)
                : t(`${subjects.find((s) => s.id === selectedSubjectId)?.nameHi || ''} — पाठ्यक्रम अध्याय`, `${subjects.find((s) => s.id === selectedSubjectId)?.name || ''} — Curriculum Chapters`)}
            </span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            {chapters.length} {t('अध्याय उपलब्ध', 'chapters available')}
          </span>
        </div>

        {chapters.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-sm shadow-sm">
            {t('इस विषय के लिए अध्याय लोड हो रहे हैं…', 'Loading curriculum for this subject…')}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {chapter.subjectId.toUpperCase()} • {t('कक्षा', 'Cl.')} {chapter.grade}
                    </span>
                    {chapter.isDownloaded && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t('ऑफलाइन तैयार', 'Offline Ready')}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {language === 'en' ? chapter.title : chapter.titleHi}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {chapter.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleAskAI(chapter)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs border border-amber-200 transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('AI से समझें', 'Ask AI')}</span>
                  </button>

                  {onOpenPodcast && (
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenPodcast(chapter);
                      }}
                      className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 transition-colors flex items-center justify-center shadow-xs"
                      title={t('2-मिनट ऑडियो पॉडकास्ट', '2-Minute Audio Podcast')}
                    >
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onSelectChapter(chapter);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center gap-1 shadow-xs"
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
