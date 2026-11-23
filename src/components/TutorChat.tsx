import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { ChatMessage, StructuredTutorResponse } from '../types';
import { soundFx } from '../utils/soundEffects';
import {
  Send,
  Mic,
  Camera,
  Sparkles,
  Volume2,
  VolumeX,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Copy,
  Check,
  Trash2,
  Zap,
  BookmarkCheck,
  AlertTriangle,
  RotateCcw,
  Target,
  ArrowRight
} from 'lucide-react';

interface TutorChatProps {
  onOpenVoice: () => void;
  onOpenPhoto: () => void;
  initialQuery?: string;
}

export const TutorChat: React.FC<TutorChatProps> = ({
  onOpenVoice,
  onOpenPhoto,
  initialQuery
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const isEn = language === 'en';

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-welcome',
      sender: 'assistant',
      content: isEn
        ? `Hello! I am your Socratic AI Tutor for Class ${user.grade} (${user.board || 'CBSE'}). Ask any math problem, science doubt, or exam question. I will guide you step-by-step to understand the concept first!`
        : `नमस्ते! मैं आपका गुरुकुल सॉक्रेटिक AI ट्यूटर हूँ। कक्षा ${user.grade} (${user.board || 'CBSE'}) का कोई भी सवाल पूछें। मैं आपको सीधे रटाने के बजाय पहले समझने में मदद करूँगा!`,
      mode: 'TEXT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structured: {
        language: isEn ? 'EN' : 'HI',
        conceptSnap: isEn
          ? `Socratic Learning Engine: Step-by-step guidance designed for Class ${user.grade} ${user.board || 'CBSE'} students.`
          : `सॉक्रेटिक शिक्षण: कक्षा ${user.grade} (${user.board || 'CBSE'}) के पाठ्यक्रम के अनुसार चरणबद्ध मार्गदर्शन।`,
        understanding: isEn
          ? `Ready to assist with your Class ${user.grade} (${user.board || 'CBSE'}) syllabus in ${user.city || user.district}, ${user.state || 'India'}.`
          : `मैं आपकी कक्षा ${user.grade} (${user.board || 'CBSE'}) के पाठ्यक्रम (${user.city || user.district}, ${user.state}) के लिए तैयार हूँ।`,
        hint: isEn
          ? 'Try asking: "Explain Euclid\'s division lemma", "How to balance redox reactions?", or "Derive the mirror formula".'
          : 'कोई भी प्रश्न पूछें — जैसे "यूक्लिड प्रमेयिका क्या है?", "रासायनिक समीकरण कैसे संतुलित करें?", या "लेंस सूत्र समझाएं"।',
        finalAnswer: isEn
          ? 'Type your question below, click the microphone for voice, or upload a photo of your book.'
          : 'सीखने के लिए तैयार हैं? नीचे अपना सवाल लिखें, बोलें या किताब की फोटो अपलोड करें।'
      }
    }
  ]);

  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedChallenges, setRevealedChallenges] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    soundFx.playClick();

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      content: query.trim(),
      mode: 'TEXT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await ApiService.askTutor({
        content: query.trim(),
        mode: 'TEXT',
        grade: user.grade,
        board: user.board,
        language: language.toUpperCase(),
      });

      const assistantMsg: ChatMessage = {
        id: 'a-' + Date.now(),
        sender: 'assistant',
        content: res.response.reply || res.response.understanding || (isEn ? 'Here is the guided breakdown:' : 'यहाँ आपका चरणबद्ध हल है:'),
        mode: 'TEXT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured: res.response
      };

      setMessages((prev) => [...prev, assistantMsg]);
      soundFx.playCorrect();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Text-To-Speech Playback
  const speakText = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (activeSpeechId === id) {
        window.speechSynthesis.cancel();
        setActiveSpeechId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isEn ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);
      setActiveSpeechId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleChallengeReveal = (msgId: string) => {
    soundFx.playClick();
    setRevealedChallenges((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const sampleChips = isEn
    ? [
        "Explain Euclid's division lemma with examples",
        "How to balance chemical equations step-by-step?",
        "Difference between convex and concave lens",
        "What are the laws of reflection of light?"
      ]
    : [
        'यूक्लिड विभाजन प्रमेयिका समझाइए',
        'रासायनिक समीकरण कैसे संतुलित करें?',
        'उत्तल और अवतल लेंस में अंतर',
        'प्रकाश संश्लेषण की क्रिया'
      ];

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
      {/* Light Theme Container Panel */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl flex flex-col h-[calc(100dvh-140px)] sm:h-[750px] min-h-[460px] max-h-[850px]">
        {/* Chat Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <span>{t('सॉक्रेटिक AI ट्यूटर', 'Socratic AI Tutor')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {t('सक्रिय', 'Live')}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {t('कक्षा', 'Class')} {user.grade} ({user.board || 'CBSE'}) • {t('तेज समझ, अधिकतम परीक्षा अंक', 'Speed-to-Clarity • Exam Mastery')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                if (messages.length > 1) {
                  setMessages([messages[0]]);
                  soundFx.playClick();
                }
              }}
              title={t('बातचीत साफ़ करें', 'Clear Conversation')}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenVoice}
              title="Voice Tutor"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-emerald-600 border border-slate-200 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPhoto}
              title="Camera Question"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 border border-slate-200 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#F8FAFC]">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const s = msg.structured;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Bubble Container */}
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium ml-8 rounded-tr-none shadow-md'
                      : 'bg-white border border-slate-200 text-slate-800 mr-8 rounded-tl-none space-y-4'
                  }`}
                >
                  {/* User Question */}
                  {isUser ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Top Action Bar with TTS & Copy */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                          <Lightbulb className="w-4 h-4 text-amber-600" />
                          {t('गुरुकुल सॉक्रेटिक मार्गदर्शन', 'Gurukul Socratic Breakdown')}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const text = s
                                ? [s.conceptSnap, s.keyFormula, s.hint, s.explanation, s.finalAnswer].filter(Boolean).join('\n\n')
                                : msg.content;
                              navigator.clipboard.writeText(text);
                              setCopiedId(msg.id);
                              soundFx.playClick();
                              setTimeout(() => setCopiedId(null), 2000);
                            }}
                            title={t('हल कॉपी करें', 'Copy Solution')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              const fullText = s
                                ? [s.conceptSnap, s.hint, s.explanation, s.finalAnswer].filter(Boolean).join('. ')
                                : msg.content;
                              speakText(msg.id, fullText);
                            }}
                            className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                              activeSpeechId === msg.id
                                ? 'bg-amber-500 text-white border-amber-600 font-bold animate-pulse'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            {activeSpeechId === msg.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>{t('रोकें', 'Stop')}</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{t('सुनें', 'Listen')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Structured Socratic Sections */}
                      {s && (
                        <div className="space-y-3.5 text-sm">
                          {/* 1. Quick Concept Snap (3-Second Comprehension) */}
                          {s.conceptSnap && (
                            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3.5 rounded-xl border border-amber-200/80">
                              <div className="text-xs font-black text-amber-900 flex items-center gap-1.5 mb-1">
                                <Zap className="w-4 h-4 text-amber-600" />
                                <span>{t('3-सेकंड अवधारणा स्पष्टता (Concept Snap)', 'Concept Snap (Fast Clarity)')}</span>
                              </div>
                              <p className="text-amber-950 text-xs sm:text-sm font-medium leading-relaxed">
                                {s.conceptSnap}
                              </p>
                            </div>
                          )}

                          {/* 2. Key Formula / High-Yield Theorem */}
                          {s.keyFormula && (
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 flex items-start gap-2">
                              <span className="font-sans font-bold text-slate-500 uppercase tracking-wider text-[11px] mt-0.5">
                                📐 {t('सूत्र/नियम:', 'Formula/Rule:')}
                              </span>
                              <span className="font-bold text-amber-800 break-all select-all">
                                {s.keyFormula}
                              </span>
                            </div>
                          )}

                          {/* 3. Socratic Clue (Hint before answer) */}
                          {s.hint && (
                            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                              <div className="text-xs font-bold text-amber-800 mb-1 flex items-center gap-1">
                                <span>💡 {t('सोचने का संकेत (Socratic Clue)', 'Socratic Clue (Think First)')}</span>
                              </div>
                              <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                                {s.hint}
                              </p>
                            </div>
                          )}

                          {/* 4. Detailed Step-by-Step Breakdown */}
                          {s.steps && s.steps.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                                <span>🪜 {t('चरणबद्ध समाधान (Step-by-Step)', 'Step-by-Step Action Plan')}</span>
                              </div>
                              <div className="space-y-2">
                                {s.steps.map((step, idx) => (
                                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/90 text-xs">
                                    <div className="font-bold text-slate-900 mb-0.5">{step.title}</div>
                                    <div className="text-slate-600 leading-relaxed">{step.detail}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 5. Exam Trap Warning */}
                          {s.examTip && (
                            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed font-medium">{s.examTip}</span>
                            </div>
                          )}

                          {/* 6. Final Conclusion */}
                          {s.finalAnswer && (
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                              <div className="text-xs font-bold text-emerald-800 mb-0.5 flex items-center gap-1">
                                <Target className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{t('अंतिम निष्कर्ष (Final Conclusion)', 'Final Conclusion')}</span>
                              </div>
                              <p className="text-slate-900 text-xs sm:text-sm font-semibold">
                                {s.finalAnswer}
                              </p>
                            </div>
                          )}

                          {/* 7. Interactive Retention Self-Check Challenge */}
                          {s.selfCheckChallenge && (
                            <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200/80 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                                  <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                                  <span>{t('स्वयं परखें (Retention Check)', 'Test Your Recall (Self-Check)')}</span>
                                </span>
                                <button
                                  onClick={() => toggleChallengeReveal(msg.id)}
                                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline decoration-indigo-400"
                                >
                                  {revealedChallenges[msg.id]
                                    ? t('उत्तर छुपाएं', 'Hide Answer')
                                    : t('उत्तर देखें', 'Reveal Answer')}
                                </button>
                              </div>
                              <p className="text-xs text-slate-800 font-medium">
                                {s.selfCheckChallenge.question}
                              </p>
                              {revealedChallenges[msg.id] && (
                                <div className="p-2.5 rounded-lg bg-white border border-indigo-200 text-xs font-semibold text-emerald-800 animate-fade-in">
                                  ✓ {s.selfCheckChallenge.answer}
                                </div>
                              )}
                            </div>
                          )}

                          {/* 8. 3-Point Efficiency Summary */}
                          {s.efficiencySummary && s.efficiencySummary.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                                📌 {t('त्वरित पुनरावलोकन बिंदु', '3-Point Revision Anchors')}
                              </div>
                              {s.efficiencySummary.map((pt, pIdx) => (
                                <div key={pIdx} className="text-slate-600 flex items-start gap-1.5">
                                  <span className="text-amber-500 font-bold">•</span>
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fallback simple content */}
                      {!s && <p className="text-sm leading-relaxed text-slate-800">{msg.content}</p>}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 text-slate-500 text-xs italic pl-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>{t('गुरुकुल AI सॉक्रेटिक संकेत और विश्लेषण तैयार कर रहा है…', 'Gurukul AI is reasoning and preparing Socratic steps…')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto no-scrollbar">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-xs text-slate-700 font-medium transition-all shadow-sm flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('अपना सवाल यहाँ लिखें (उदा. HCF कैसे निकालें?)...', 'Type your question here (e.g. How to find HCF?)...')}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 sm:py-3 text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send Message"
              className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-md flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
