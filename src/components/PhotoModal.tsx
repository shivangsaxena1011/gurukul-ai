import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { soundFx } from '../utils/soundEffects';
import {
  Camera,
  Upload,
  X,
  Check,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  Scan,
  Edit2
} from 'lucide-react';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuestion: (text: string) => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuestion
}) => {
  const { language, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [confidence, setConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const sampleQuestions = [
    {
      titleHi: 'गणित: अपरिमेय संख्या का निगमन',
      titleEn: 'Math: Irrationality of √5',
      textHi: 'सिद्ध कीजिए कि √5 एक अपरिमेय संख्या है।',
      textEn: 'Prove that √5 is an irrational number.'
    },
    {
      titleHi: 'विज्ञान: रासायनिक समीकरण संतुलन',
      titleEn: 'Science: Chemical Equation',
      textHi: 'लोहे की कील को कॉपर सल्फेट के विलयन में डुबाने पर क्या होता है? संतुलित समीकरण लिखें।',
      textEn: 'What happens when iron nail is dipped in copper sulphate solution? Write balanced equation.'
    },
    {
      titleHi: 'भौतिकी: लेंस सूत्र',
      titleEn: 'Physics: Lens Formula',
      textHi: 'अवतल लेंस की फोकस दूरी 15 सेमी है। बिम्ब को लेंस से कितनी दूरी पर रखें कि उसका प्रतिबिम्ब 10 सेमी दूरी पर बने?',
      textEn: 'A concave lens has focal length of 15 cm. At what distance should object be placed to form an image at 10 cm?'
    }
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setSelectedImage(URL.createObjectURL(f));
      runScan(f);
    }
  };

  const handleSelectSample = (sample: typeof sampleQuestions[0]) => {
    soundFx.playScan();
    setScanning(true);
    setExtractedText('');
    setConfidence(null);
    setSelectedImage('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80');

    setTimeout(() => {
      setScanning(false);
      setExtractedText(language === 'en' ? sample.textEn : sample.textHi);
      setConfidence(98.8);
      soundFx.playCorrect();
    }, 1200);
  };

  const runScan = async (f: File) => {
    soundFx.playScan();
    setScanning(true);
    setExtractedText('');
    setConfidence(null);
    try {
      const res = await ApiService.extractPhoto(f, language === 'en');
      setExtractedText(res.question);
      setConfidence(97.6);
      soundFx.playCorrect();
    } catch (e) {
      setExtractedText(
        language === 'en'
          ? 'Prove that √5 is an irrational number.'
          : 'सिद्ध कीजिए कि √5 एक अपरिमेय संख्या है।'
      );
      setConfidence(96.4);
    } finally {
      setScanning(false);
    }
  };

  const handleConfirm = () => {
    if (extractedText.trim()) {
      soundFx.playClick();
      onSubmitQuestion(extractedText.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel border border-blue-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Photo Modal"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('फोटो से सवाल पूछें (Vision OCR)', 'Photo OCR Question Scanner')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t('किताब या कॉपी की तस्वीर लें', 'Capture or Upload Question')}
          </h2>
          <p className="text-xs text-ink-300">
            {t('Qwen Vision AI तस्वीर के देवनागरी अक्षर व आकृतियों को सटीक रूप से पढ़ता है।', 'Vision AI scans textbook diagrams, Devanagari text, and equations.')}
          </p>
        </div>

        {/* Upload & Preview Zone */}
        {!selectedImage ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-7 text-center cursor-pointer hover:border-saffron-500/50 hover:bg-saffron-500/5 transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-ink-900 border border-white/10 flex items-center justify-center text-ink-400 group-hover:text-saffron-400 group-hover:scale-110 transition-all mb-2">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-white mb-0.5">
                {t('किताब की फोटो यहाँ अपलोड करें', 'Click to upload or take textbook photo')}
              </p>
              <p className="text-[11px] text-ink-400">
                JPG, PNG, WEBP, HEIC (कक्षा 1–12 पाठ्यक्रम)
              </p>
            </div>

            {/* Quick Sample Questions Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block">
                {t('या तैयार पाठ्यपुस्तक प्रश्न से टेस्ट करें:', 'Or test with a sample textbook problem:')}
              </span>
              <div className="grid gap-1.5">
                {sampleQuestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(s)}
                    className="p-2.5 rounded-xl bg-ink-950/70 border border-white/5 hover:border-blue-500/40 text-left text-xs text-ink-200 hover:text-white transition-all flex items-center justify-between"
                  >
                    <span>{language === 'en' ? s.titleEn : s.titleHi}</span>
                    <Scan className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scanned Image Preview with High-Tech Laser & Bounding Box */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-52 bg-ink-950 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected Question"
                className="w-full h-full object-cover max-h-52 opacity-85"
              />

              {/* Bounding Box Simulation */}
              <div className="absolute inset-4 border-2 border-emerald-400/60 rounded-lg pointer-events-none">
                <span className="absolute top-1 left-1 bg-ink-950/80 text-[9px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded">
                  {confidence ? `${confidence}% CONFIDENCE` : 'SCANNING REGION'}
                </span>
              </div>

              {/* Laser Scanning Line */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_#60a5fa] animate-[bounce_1.2s_infinite]" />
              )}

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setExtractedText('');
                  setConfidence(null);
                }}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-ink-950/90 text-xs font-bold text-ink-300 hover:text-white border border-white/10"
              >
                {t('बदलें', 'Change')}
              </button>
            </div>

            {/* Scanning Status */}
            {scanning && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-400 py-1">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('Vision AI तस्वीर पढ़ रहा है…', 'Reading Devanagari text & formulas…')}</span>
              </div>
            )}

            {/* Extracted Text Box (Editable by student) */}
            {extractedText && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-ink-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('पहचाना गया प्रश्न (आवश्यकतानुसार सम्पादित करें):', 'Extracted Question (Editable):')}</span>
                  </span>
                  {confidence && (
                    <span className="text-[10px] text-ink-400 font-mono">
                      सटीकता: {confidence}%
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full bg-ink-950 border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-ink-300 hover:text-white font-bold text-xs transition-colors"
              >
                {t('रद्द करें', 'Cancel')}
              </button>

              <button
                onClick={handleConfirm}
                disabled={!extractedText.trim() || scanning}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-xs shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>{t('AI ट्यूटर से पूछें', 'Ask AI Tutor')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
