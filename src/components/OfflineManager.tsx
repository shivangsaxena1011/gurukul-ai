import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { localDB } from '../services/indexedDB';
import { SAMPLE_CHAPTERS } from '../data/constants';
import { OfflinePack, Chapter } from '../types';
import {
  Download,
  Trash2,
  HardDrive,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const OfflineManager: React.FC = () => {
  const { t } = useLanguage();
  const { isOnline, pendingSyncCount, triggerSync } = useAuth();
  const [downloadedPacks, setDownloadedPacks] = useState<OfflinePack[]>([]);
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    const list = await localDB.listPacks();
    setDownloadedPacks(list);
  };

  const handleDownload = async (chapter: Chapter) => {
    setDownloadingSlug(chapter.slug);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const pack: OfflinePack = {
        slug: chapter.slug,
        title: chapter.titleHi,
        subject: chapter.subjectId,
        grade: chapter.grade,
        sizeBytes: 1024 * 1024 * (Math.floor(Math.random() * 4) + 2), // 2 to 5 MB
        savedAt: new Date().toLocaleDateString(),
        questionsCount: 25
      };
      await localDB.savePack(pack);
      await loadPacks();
    } finally {
      setDownloadingSlug(null);
    }
  };

  const handleDelete = async (slug: string) => {
    await localDB.deletePack(slug);
    await loadPacks();
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      await triggerSync();
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="glass-panel border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>{t('ऑफलाइन अध्ययन केंद्र', 'Offline Learning Hub')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {t('बिना इंटरनेट पूरा अध्याय पढ़ें', 'Learn without Internet Connection')}
          </h2>
          <p className="text-xs sm:text-sm text-ink-300 max-w-xl">
            {t(
              'गाँव या यात्रा के दौरान इंटरनेट न होने पर भी अध्याय, नोट्स और अभ्यास प्रश्न उपलब्ध रहते हैं।',
              'Download complete chapter packs once over Wi-Fi/mobile data, then practice anytime offline.'
            )}
          </p>
        </div>

        {/* Sync Trigger Card */}
        <div className="bg-ink-950/80 border border-white/10 rounded-2xl p-4 text-center space-y-2 min-w-[200px]">
          <div className="text-[11px] uppercase font-bold text-ink-400">
            {t('लंबित सिंक रिकॉर्ड्स', 'Pending Sync Queue')}
          </div>
          <div className="text-2xl font-extrabold text-saffron-400">
            {pendingSyncCount}
          </div>
          <button
            onClick={handleSyncNow}
            disabled={pendingSyncCount === 0 || syncing || !isOnline}
            className="w-full py-2 px-3 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:opacity-40 text-ink-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? t('सिंक हो रहा है…', 'Syncing…') : t('अभी सिंक करें', 'Sync Now')}</span>
          </button>
        </div>
      </div>

      {/* Downloaded Packs Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          <span>{t('डाउनलोड किए गए पैक्स (IndexedDB Storage)', 'Stored Offline Packs')}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
            {downloadedPacks.length}
          </span>
        </h3>

        {downloadedPacks.length === 0 ? (
          <div className="glass-panel border border-white/10 rounded-2xl p-8 text-center text-ink-400 text-sm">
            {t('अभी कोई पैक डाउनलोड नहीं हुआ है। नीचे दी गई सूची से अध्याय चुनें।', 'No packs downloaded yet. Pick chapters below.')}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {downloadedPacks.map((pack) => (
              <div
                key={pack.slug}
                className="glass-panel border border-emerald-500/30 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-lg"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    कक्षा {pack.grade} • {pack.subject}
                  </div>
                  <h4 className="text-base font-extrabold text-white mt-0.5">
                    {pack.title}
                  </h4>
                  <div className="text-xs text-ink-400 mt-1">
                    {(pack.sizeBytes / (1024 * 1024)).toFixed(1)} MB • {pack.questionsCount} प्रश्न • {pack.savedAt}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(pack.slug)}
                  title="Delete Pack"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-ink-400 hover:text-rose-400 border border-white/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Chapters to Download */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-saffron-400" />
          <span>{t('उपलब्ध अध्याय (JCERT / NCERT)', 'Available Curriculum Chapters')}</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {SAMPLE_CHAPTERS.map((ch) => {
            const isSaved = downloadedPacks.some((p) => p.slug === ch.slug);
            const isCurrentlyDownloading = downloadingSlug === ch.slug;

            return (
              <div
                key={ch.slug}
                className="glass-panel border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-saffron-400">
                    {ch.subjectId.toUpperCase()} • कक्षा {ch.grade}
                  </div>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {ch.titleHi}
                  </h4>
                  <p className="text-xs text-ink-400 mt-1 line-clamp-1">
                    {ch.description}
                  </p>
                </div>

                {isSaved ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('सुरक्षित', 'Saved')}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(ch)}
                    disabled={isCurrentlyDownloading}
                    className="p-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-extrabold hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1.5 flex-shrink-0"
                  >
                    <Download className={`w-4 h-4 ${isCurrentlyDownloading ? 'animate-bounce' : ''}`} />
                    <span className="text-xs">{isCurrentlyDownloading ? '...' : t('डाउनलोड', 'Download')}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
