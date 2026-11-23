import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { SUBJECTS, SAMPLE_CHAPTERS } from '../data/constants';
import { Card3DTilt } from './3d/Card3DTilt';
import { Chapter } from '../types';
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
  Radio
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
  const { t } = useLanguage();
  const { user } = useAuth();

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

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('पाठ्यक्रम एवं विषय', 'Curriculum & Subjects')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade} — {t('प्रमुख विषय', 'Core Subjects')}
          </h2>
        </div>
      </div>

      {/* Subjects Row (3D Tilt Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {SUBJECTS.map((sub) => (
          <Card3DTilt
            key={sub.id}
            className="glass-panel glass-card-hover rounded-2xl p-4 text-center space-y-3 cursor-pointer"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center shadow-lg">
              {getSubjectIcon(sub.icon)}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{sub.nameHi}</h3>
              <p className="text-[11px] text-ink-400">{sub.name}</p>
            </div>
            <div className="text-[10px] uppercase font-bold text-saffron-400">
              {sub.chaptersCount} {t('अध्याय', 'Chapters')}
            </div>
          </Card3DTilt>
        ))}
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-saffron-400" />
          <span>{t('महत्वपूर्ण अध्याय (JCERT / NCERT)', 'Highlighted Chapters')}</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {SAMPLE_CHAPTERS.map((chapter) => (
            <div
              key={chapter.id}
              className="glass-panel glass-card-hover border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-saffron-400">
                    {chapter.subjectId.toUpperCase()} • कक्षा {chapter.grade}
                  </span>
                  {chapter.isDownloaded && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('ऑफलाइन उपलब्ध', 'Offline Ready')}
                    </span>
                  )}
                </div>
                <h4 className="text-base font-extrabold text-white">
                  {chapter.titleHi}
                </h4>
                <p className="text-xs text-ink-300 leading-relaxed">
                  {chapter.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => onAskTutorAboutChapter(chapter.titleHi)}
                  className="flex-1 py-2 px-3 rounded-xl bg-saffron-500/10 hover:bg-saffron-500/20 text-saffron-300 font-bold text-xs border border-saffron-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('AI से समझें', 'Ask AI')}</span>
                </button>

                {onOpenPodcast && (
                  <button
                    onClick={() => onOpenPodcast(chapter)}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-colors flex items-center justify-center"
                    title={t('2-मिनट ऑडियो पॉडकास्ट', '2-Minute Audio Podcast')}
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onSelectChapter(chapter)}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center gap-1"
                >
                  <span>{t('विषय', 'Topics')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
