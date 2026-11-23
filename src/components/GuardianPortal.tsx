import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { TeacherHubModal } from './TeacherHubModal';
import {
  Users,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  Award,
  GraduationCap
} from 'lucide-react';

export const GuardianPortal: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [inputCode, setInputCode] = useState('');
  const [isLinked, setIsLinked] = useState(true); // Linked by default with Aryan Verma
  const [isTeacherHubOpen, setIsTeacherHubOpen] = useState(false);

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().length === 6) {
      setIsLinked(true);
      setInputCode('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold w-fit">
            <Users className="w-3.5 h-3.5" />
            <span>{t('अभिभावक एवं शिक्षक पोर्टल', 'Guardian & Teacher Portal')}</span>
          </div>

          <button
            onClick={() => setIsTeacherHubOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all w-fit"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t('👨‍🏫 शिक्षक क्लासरूम केंद्र (Teacher Broadcast Hub)', 'Teacher Broadcast Hub')}</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t('छात्र की प्रगति और अध्ययन निगरानी', 'Track Ward Progress and Mastery')}
        </h2>
        <p className="text-xs sm:text-sm text-ink-300 max-w-2xl">
          {t(
            'अपने बच्चे के सवाल पूछने के तरीके, कमजोर विषयों और दैनिक अभ्यास समय पर नज़र रखें।',
            'Gain transparent insights into concepts explored, practice accuracy, and doubts asked.'
          )}
        </p>
      </div>

      {/* Link Code Display & Connector */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Student Code Box */}
        <div className="glass-panel border border-saffron-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-saffron-400 font-bold text-sm">
            <KeyRound className="w-4 h-4" />
            <span>{t('छात्र का लिंकिंग कोड (Student Link Code)', 'Student Link Code')}</span>
          </div>
          <div className="p-4 bg-ink-950/80 rounded-xl border border-white/10 text-center">
            <span className="font-mono text-3xl font-extrabold tracking-widest text-amber-300">
              {user.linkCode}
            </span>
          </div>
          <p className="text-xs text-ink-400 leading-relaxed">
            {t(
              'इस 6-अक्षरों के कोड को माता-पिता या शिक्षक अपने फ़ोन में दर्ज करके छात्र की रिपोर्ट देख सकते हैं।',
              'Share this 6-character code with parents or teachers to link progress reports.'
            )}
          </p>
        </div>

        {/* Enter Code Box */}
        <div className="glass-panel border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('नया छात्र जोड़ें (Link a Ward)', 'Link a Student')}</span>
          </div>
          <form onSubmit={handleLink} className="space-y-3">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="उदा. GK8821"
              maxLength={6}
              className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-2.5 text-center font-mono text-lg uppercase tracking-wider text-white focus:outline-none focus:border-saffron-500"
            />
            <button
              type="submit"
              disabled={inputCode.length !== 6}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-bold text-sm disabled:opacity-40 transition-all shadow-md"
            >
              {t('रिपोर्ट से जोड़ें', 'Verify & Link')}
            </button>
          </form>
        </div>
      </div>

      {/* Linked Student Performance Dashboard */}
      {isLinked && (
        <div className="glass-panel border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t('सक्रिय छात्र रिपोर्ट', 'Linked Student Report')}
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {user.name} ({user.city || user.district}, {user.state || 'Jharkhand'})
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-300 font-semibold bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('कक्षा', 'Class')} {user.grade} • {user.board || 'CBSE'} {t('बोर्ड', 'Board')}</span>
            </div>
          </div>

          {/* Stat Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-ink-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-ink-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('अध्ययन समय', 'Study Time')}</span>
              </div>
              <div className="text-xl font-extrabold text-white">4.8 {t('घंटे', 'hrs')}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5">{t('↑ 18% इस सप्ताह', '↑ 18% this week')}</div>
            </div>

            <div className="bg-ink-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-ink-400 text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t('क्विज़ सटीकता', 'Accuracy')}</span>
              </div>
              <div className="text-xl font-extrabold text-amber-400">82.4%</div>
              <div className="text-[10px] text-ink-400 mt-0.5">{t('38 सवाल हल किए', '38 questions solved')}</div>
            </div>

            <div className="bg-ink-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-ink-400 text-xs mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('पूरे हुए अध्याय', 'Chapters Done')}</span>
              </div>
              <div className="text-xl font-extrabold text-sky-400">6 / 14</div>
              <div className="text-[10px] text-ink-400 mt-0.5">{t('गणित एवं विज्ञान', 'Math & Science')}</div>
            </div>

            <div className="bg-ink-950/60 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-1.5 text-ink-400 text-xs mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>{t('पूछे गए संशय', 'Doubts Asked')}</span>
              </div>
              <div className="text-xl font-extrabold text-purple-400">14 {t('संशय', 'Doubts')}</div>
              <div className="text-[10px] text-purple-400 mt-0.5">{t('AI ट्यूटर द्वारा हल', 'Solved by AI')}</div>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-300">
              {t('विषयवार निपुणता (Subject Mastery)', 'Subject Mastery Breakdown')}
            </h4>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">गणित (Mathematics)</span>
                  <span className="text-amber-400">88%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-saffron-400 rounded-full w-[88%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">विज्ञान (Science)</span>
                  <span className="text-emerald-400">76%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[76%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-white">सामाजिक विज्ञान (Social Studies)</span>
                  <span className="text-sky-400">68%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-950 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full w-[68%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Hub Modal */}
      <TeacherHubModal
        isOpen={isTeacherHubOpen}
        onClose={() => setIsTeacherHubOpen(false)}
      />
    </div>
  );
};
