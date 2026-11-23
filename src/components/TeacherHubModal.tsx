import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../utils/soundEffects';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Plus,
  Send,
  BarChart3,
  Award,
  AlertCircle
} from 'lucide-react';

interface TeacherHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAssignment?: (code: string) => void;
}

export const TeacherHubModal: React.FC<TeacherHubModalProps> = ({
  isOpen,
  onClose,
  onStartAssignment
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';

  const [activeTab, setActiveTab] = useState<'TEACHER' | 'STUDENT'>('TEACHER');
  const [assignmentCode, setAssignmentCode] = useState('GK72');
  const [createdAssignments, setCreatedAssignments] = useState([
    {
      code: 'GK72',
      chapter: isEn ? 'Chemical Reactions & Equations' : 'रासायनिक अभिक्रियाएँ एवं समीकरण',
      grade: user.grade,
      submissions: 34,
      totalStudents: 40,
      avgScore: 82,
      misconception: isEn ? 'Balancing polyatomic ions' : 'बहुपरमाणुक आयनों का संतुलन'
    },
    {
      code: 'GK55',
      chapter: isEn ? 'Real Numbers (Euclid Lemma)' : 'वास्तविक संख्याएँ (यूक्लिड प्रमेयिका)',
      grade: user.grade,
      submissions: 39,
      totalStudents: 40,
      avgScore: 89,
      misconception: isEn ? 'Irrationality proof of √3' : '√3 के अपरिमेयता का निगमन'
    }
  ]);

  const [studentInputCode, setStudentInputCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateAssignment = () => {
    soundFx.playClick();
    const randomCode = 'GK' + Math.floor(10 + Math.random() * 90);
    const newAss = {
      code: randomCode,
      chapter: isEn ? 'Light: Reflection & Refraction' : 'प्रकाश: परावर्तन एवं अपवर्तन',
      grade: user.grade,
      submissions: 0,
      totalStudents: 40,
      avgScore: 0,
      misconception: isEn ? 'Sign conventions for concave mirror' : 'अवतल दर्पण की चिह्न परिपाटी'
    };
    setCreatedAssignments([newAss, ...createdAssignments]);
    setAssignmentCode(randomCode);
  };

  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentInputCode.trim().length >= 4) {
      soundFx.playCorrect();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onStartAssignment) onStartAssignment(studentInputCode);
        onClose();
      }, 1200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Teacher Hub"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('स्मार्ट क्लासरूम एवं शिक्षक केंद्र', 'Smart Classroom & Teacher Broadcast')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t('कक्षा असाइनमेंट एवं प्रगति विश्लेषण', 'Classroom Assignments & Live Diagnostics')}
          </h2>
          <p className="text-xs text-slate-600">
            {t(
              'शिक्षकों के लिए 4-अंकीय कोड से गृहकार्य प्रसारित करने और छात्रों की त्रुटियों का लाइव विश्लेषण करने की सुविधा।',
              'Allows teachers to broadcast chapter assignments via a 4-digit code and inspect class error heatmaps.'
            )}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('TEACHER')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'TEACHER'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('👨‍🏫 शिक्षक डैशबोर्ड (Teacher Mode)', '👨‍🏫 Teacher Dashboard')}
          </button>
          <button
            onClick={() => setActiveTab('STUDENT')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'STUDENT'
                ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-slate-950 font-extrabold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('🧑‍🎓 छात्र कोड प्रविष्टि (Join Assignment)', '🧑‍🎓 Student Join Code')}
          </button>
        </div>

        {/* Tab 1: TEACHER MODE */}
        {activeTab === 'TEACHER' && (
          <div className="space-y-5">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500">
                  {user.board || 'CBSE'} • {t('कक्षा', 'Class')} {user.grade}
                </span>
              </div>
              <button
                onClick={handleCreateAssignment}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('नया असाइनमेंट बनाएं', 'Broadcast New Assignment')}</span>
              </button>
            </div>

            {/* Assignments List */}
            <div className="space-y-3">
              {createdAssignments.map((ass) => (
                <div
                  key={ass.code}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-amber-700 text-base px-2.5 py-0.5 rounded-lg bg-amber-100/80 border border-amber-300">
                          {ass.code}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{ass.chapter}</h3>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {ass.submissions}/{ass.totalStudents} {t('छात्रों ने जमा किया', 'Submitted')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">{t('कक्षा औसत अंक', 'Class Average')}</span>
                      <span className="font-bold text-slate-900 text-sm">{ass.avgScore || 85}%</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-1 sm:col-span-2">
                      <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{t('प्रमुख सामान्य भ्रम (Misconception)', 'Top Misconception')}</span>
                      </span>
                      <span className="text-slate-700 text-xs truncate block">{ass.misconception}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: STUDENT JOIN MODE */}
        {activeTab === 'STUDENT' && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
                {t('शिक्षक द्वारा दिया गया कोड दर्ज करें', 'Enter Teacher Broadcast Code')}
              </span>
              <p className="text-xs text-slate-500">
                {t('उदा. GK72 लिखकर सीधे असाइनमेंट खोलें', 'e.g., Type GK72 to start your assigned test')}
              </p>
            </div>

            <form onSubmit={handleStudentJoin} className="space-y-3 max-w-xs mx-auto">
              <input
                type="text"
                value={studentInputCode}
                onChange={(e) => setStudentInputCode(e.target.value.toUpperCase())}
                placeholder="GK72"
                maxLength={6}
                className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-center font-mono text-2xl font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:border-saffron-500 shadow-inner"
              />

              <button
                type="submit"
                disabled={studentInputCode.length < 4}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-md shadow-saffron-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 transition-all cursor-pointer"
              >
                {isSuccess ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>{t('असाइनमेंट खुल रहा है…', 'Opening Assignment…')}</span>
                  </span>
                ) : (
                  <span>{t('असाइनमेंट शुरू करें', 'Start Assignment')}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
