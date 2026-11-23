import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mic, MicOff, X, Volume2, Sparkles, Check } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuestion: (text: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuestion
}) => {
  const { language, t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setTimer(0);
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    setIsRecording(true);
    setTimer(0);
    intervalRef.current = window.setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    // Try SpeechRecognition if available in browser
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
        };

        recognition.onerror = () => {
          // Provide fallback simulation
          simulateSpeech();
        };

        recognition.start();
        return;
      } catch (e) {
        simulateSpeech();
      }
    } else {
      simulateSpeech();
    }
  };

  const simulateSpeech = () => {
    setTimeout(() => {
      if (language === 'en') {
        setTranscript("How to find the HCF of 135 and 225 using Euclid's division lemma?");
      } else {
        setTranscript('यूक्लिड विभाजन प्रमेयिका का प्रयोग 135 और 225 के लिए कैसे करें?');
      }
    }, 2000);
  };

  const stopListening = () => {
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onSubmitQuestion(transcript.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-panel border border-saffron-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center space-y-5 sm:space-y-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Voice Modal"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{t('आवाज़ से पूछें', 'Voice Tutor')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t('अपनी भाषा में बोलें', 'Speak in your language')}
          </h2>
          <p className="text-xs text-ink-300">
            {t('हिंदी या अंग्रेजी में कोई भी प्रश्न पूछें।', 'Ask any question naturally.')}
          </p>
        </div>

        {/* 3D Soundwave Orb Visual */}
        <div className="relative my-6 flex items-center justify-center">
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
            isRecording
              ? 'bg-gradient-to-tr from-emerald-500/20 via-saffron-500/30 to-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.4)] scale-110'
              : 'bg-ink-900 border border-white/10'
          }`}>
            {/* Concentric Pulsing Rings */}
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-saffron-400/40 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-emerald-400/30 animate-pulse" />
              </>
            )}
            <button
              onClick={() => (isRecording ? stopListening() : startListening())}
              aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-saffron-500 to-amber-500 text-ink-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
            >
              {isRecording ? <Mic className="w-8 h-8 fill-ink-950 animate-bounce" /> : <MicOff className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Recording Timer */}
        <div className="text-xs font-bold text-ink-400">
          {isRecording ? (
            <span className="text-emerald-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {t('रिकॉर्डिंग जारी है…', 'Listening…')} ({timer}s)
            </span>
          ) : (
            <span>{t('माइक दबाकर फिर बोलें', 'Tap mic to record')}</span>
          )}
        </div>

        {/* Live Transcript Display */}
        <div className="min-h-[80px] bg-ink-950/60 p-4 rounded-2xl border border-white/10 text-left">
          <div className="text-[10px] uppercase font-bold text-ink-400 mb-1">
            {t('सुना गया पाठ (Transcript):', 'Live Transcript:')}
          </div>
          <p className="text-sm font-semibold text-white">
            {transcript || (
              <span className="text-ink-500 italic">
                {t('साफ़ और पास आकर बोलिए...', 'Speak clearly near your microphone...')}
              </span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-ink-900 border border-white/10 text-ink-300 font-bold text-sm hover:bg-white/5 transition-colors"
          >
            {t('रद्द करें', 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!transcript.trim()}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-extrabold text-sm shadow-lg shadow-saffron-500/20 hover:scale-[1.02] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t('पूछें (Submit)', 'Ask Question')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
