import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { ChatMessage, StructuredTutorResponse } from '../types';
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
  ChevronDown,
  ChevronUp,
  RefreshCw
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
        ? `Hello! I am your Gurukul AI Tutor. You can ask any question from Class ${user.grade} (${user.board || 'CBSE'}). You can also ask by voice or upload a photo of your textbook question!`
        : `नमस्ते! मैं आपका गुरुकुल AI ट्यूटर हूँ। आप कक्षा ${user.grade} (${user.board || 'CBSE'}) से जुड़ा कोई भी सवाल पूछ सकते हैं। आप बोलकर या फोटो खींचकर भी पूछ सकते हैं!`,
      mode: 'TEXT',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structured: {
        language: isEn ? 'EN' : 'HI',
        understanding: isEn
          ? `I am aligned with your Class ${user.grade} (${user.board || 'CBSE'}) syllabus in ${user.city || user.district}, ${user.state || 'India'}.`
          : `मैं आपकी कक्षा ${user.grade} (${user.board || 'CBSE'}) के पाठ्यक्रम (${user.city || user.district}, ${user.state}) के अनुसार तैयार हूँ।`,
        hint: isEn
          ? 'Try asking: "Explain Euclid\'s division lemma" or "What are laws of reflection of light?".'
          : 'कोई भी प्रश्न पूछें — जैसे "यूक्लिड प्रमेयिका क्या है?" या "प्रकाश का परावर्तन समझाएं"।',
        finalAnswer: isEn
          ? 'Ready to learn? Type your question below, click the microphone, or snap a photo!'
          : 'सीखने के लिए तैयार हैं? नीचे अपना सवाल लिखें, बोलें या फोटो लें!'
      }
    }
  ]);

  const [input, setInput] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);
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
        content: res.response.reply || res.response.understanding || (isEn ? 'Here is the guided solution:' : 'यहाँ आपका हल है:'),
        mode: 'TEXT',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured: res.response
      };

      setMessages((prev) => [...prev, assistantMsg]);
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
      {/* Container Panel */}
      <div className="glass-panel border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[calc(100dvh-140px)] sm:h-[750px] min-h-[460px] max-h-[850px]">
        {/* Chat Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-ink-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-300 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-ink-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-saffron-400" />
              </div>
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{t('सॉक्रेटिक AI ट्यूटर', 'Socratic AI Tutor')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {t('सक्रिय', 'Live')}
                </span>
              </h2>
              <p className="text-xs text-ink-400">
                {t('कक्षा', 'Class')} {user.grade} • {t('पहले समझ, फिर समाधान', 'Understand first, solve step-by-step')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenVoice}
              title="Voice Tutor"
              className="p-2.5 rounded-xl bg-ink-800 text-emerald-400 hover:bg-emerald-500/10 border border-white/10 transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPhoto}
              title="Camera Question"
              className="p-2.5 rounded-xl bg-ink-800 text-blue-400 hover:bg-blue-500/10 border border-white/10 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
                  className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-bold ml-8 rounded-tr-none'
                      : 'glass-panel border border-white/10 text-ink-100 mr-8 rounded-tl-none space-y-4'
                  }`}
                >
                  {/* Message Text */}
                  {isUser ? (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Top Bar with Audio TTS */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-saffron-400" />
                          {t('गुरुकुल AI मार्गदर्शन', 'Gurukul Guidance')}
                        </span>
                        <button
                          onClick={() => {
                            const fullText = s
                              ? [s.understanding, s.hint, s.explanation, s.finalAnswer].filter(Boolean).join('. ')
                              : msg.content;
                            speakText(msg.id, fullText);
                          }}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                            activeSpeechId === msg.id
                              ? 'bg-saffron-500 text-ink-950 border-saffron-400 font-bold animate-pulse'
                              : 'bg-white/5 text-ink-300 border-white/10 hover:text-white'
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

                      {/* Structured Socratic Sections */}
                      {s && (
                        <div className="space-y-3 text-sm">
                          {/* 1. Understanding */}
                          {s.understanding && (
                            <div className="bg-ink-900/60 p-3 rounded-xl border border-white/5">
                              <div className="text-xs font-bold text-amber-300 mb-1">
                                🧠 {t('प्रश्न की समझ', 'Understanding')}
                              </div>
                              <p className="text-ink-200 text-xs sm:text-sm leading-relaxed">
                                {s.understanding}
                              </p>
                            </div>
                          )}

                          {/* 2. Hint */}
                          {s.hint && (
                            <div className="bg-saffron-500/10 p-3 rounded-xl border border-saffron-500/20">
                              <div className="text-xs font-bold text-saffron-400 mb-1">
                                💡 {t('सोचने का संकेत (Hint)', 'Socratic Hint')}
                              </div>
                              <p className="text-ink-100 text-xs sm:text-sm font-medium leading-relaxed">
                                {s.hint}
                              </p>
                            </div>
                          )}

                          {/* 3. Explanation */}
                          {s.explanation && (
                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                              <div className="text-xs font-bold text-emerald-400 mb-1">
                                📖 {t('विस्तार से समझें', 'Detailed Explanation')}
                              </div>
                              <p className="text-ink-300 text-xs sm:text-sm leading-relaxed">
                                {s.explanation}
                              </p>
                            </div>
                          )}

                          {/* 4. Steps */}
                          {s.steps && s.steps.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <div className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                                🪜 {t('चरणबद्ध समाधान', 'Step-by-Step Breakdown')}
                              </div>
                              {s.steps.map((step, idx) => (
                                <div key={idx} className="bg-ink-950/50 p-2.5 rounded-lg border border-white/5 text-xs">
                                  <span className="font-bold text-amber-400 mr-2">{step.title}:</span>
                                  <span className="text-ink-300">{step.detail}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 5. Final Answer */}
                          {s.finalAnswer && (
                            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                              <div className="text-xs font-bold text-emerald-400 mb-0.5">
                                🎯 {t('अंतिम निष्कर्ष', 'Final Conclusion')}
                              </div>
                              <p className="text-white text-xs sm:text-sm font-semibold">
                                {s.finalAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Fallback content */}
                      {!s && <p className="text-sm leading-relaxed">{msg.content}</p>}
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-ink-500 mt-1 px-1 font-medium">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center gap-3 text-ink-400 text-xs italic pl-2">
              <RefreshCw className="w-4 h-4 animate-spin text-saffron-400" />
              <span>{t('गुरुकुल AI सोच रहा है और संकेत तैयार कर रहा है…', 'Gurukul AI is reasoning and preparing hints…')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-ink-950/60 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-ink-300 hover:text-white hover:border-saffron-500/40 hover:bg-saffron-500/10 transition-all flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-ink-900/90">
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
              className="flex-1 bg-ink-950 border border-white/10 rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-ink-500 focus:outline-none focus:border-saffron-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send Message"
              className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-bold hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-lg shadow-saffron-500/20 flex-shrink-0"
            >
              <Send className="w-4 h-4 fill-ink-950" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
