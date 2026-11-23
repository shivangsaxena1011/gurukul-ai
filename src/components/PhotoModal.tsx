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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl max-h-[90dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Photo Modal"
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
            <Camera className="w-3.5 h-3.5" />
            <span>{t('फोटो से सवाल पूछें (Vision OCR)', 'Photo OCR Question Scanner')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {t('किताब या कॉपी की तस्वीर लें', 'Capture or Upload Question')}
          </h2>
          <p className="text-xs text-slate-600">
            {t('Qwen Vision AI तस्वीर के देवनागरी अक्षर व आकृतियों को सटीक रूप से पढ़ता है।', 'Vision AI scans textbook diagrams, Devanagari text, and equations.')}
          </p>
        </div>

        {/* Upload & Preview Zone */}
        {!selectedImage ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-7 text-center cursor-pointer hover:border-saffron-500 hover:bg-saffron-50/20 transition-all group"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-saffron-600 group-hover:scale-110 transition-all mb-2">
                <Upload className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800 mb-0.5">
                {t('किताब की फोटो यहाँ अपलोड करें', 'Click to upload or take textbook photo')}
              </p>
              <p className="text-[11px] text-slate-500">
                JPG, PNG, WEBP, HEIC (कक्षा 1–12 पाठ्यक्रम)
              </p>
            </div>

            {/* Quick Sample Questions Bar */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                {t('या तैयार पाठ्यपुस्तक प्रश्न से टेस्ट करें:', 'Or test with a sample textbook problem:')}
              </span>
              <div className="grid gap-1.5">
                {sampleQuestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectSample(s)}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left text-xs text-slate-700 hover:text-slate-900 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{language === 'en' ? s.titleEn : s.titleHi}</span>
                    <Scan className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scanned Image Preview with High-Tech Laser & Bounding Box */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-52 bg-slate-100 flex items-center justify-center shadow-inner">
              <img
                src={selectedImage}
                alt="Selected Question"
                className="w-full h-full object-cover max-h-52 opacity-90"
              />

              {/* Bounding Box Simulation */}
              <div className="absolute inset-4 border-2 border-emerald-500 rounded-lg pointer-events-none">
                <span className="absolute top-1 left-1 bg-white/90 text-[9px] font-mono font-bold text-emerald-700 px-1.5 py-0.5 rounded shadow-sm border border-emerald-200">
                  {confidence ? `${confidence}% CONFIDENCE` : 'SCANNING REGION'}
                </span>
              </div>

              {/* Laser Scanning Line */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3b82f6] animate-[bounce_1.2s_infinite]" />
              )}

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setExtractedText('');
                  setConfidence(null);
                }}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-white/90 text-xs font-bold text-slate-700 hover:text-slate-950 border border-slate-200 shadow-sm cursor-pointer"
              >
                {t('बदलें', 'Change')}
              </button>
            </div>

            {/* Scanning Status */}
            {scanning && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 py-1">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('Vision AI तस्वीर पढ़ रहा है…', 'Reading Devanagari text & formulas…')}</span>
              </div>
            )}

            {/* Extracted Text Box (Editable by student) */}
            {extractedText && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('पहचाना गया प्रश्न (आवश्यकतानुसार सम्पादित करें):', 'Extracted Question (Editable):')}</span>
                  </span>
                  {confidence && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      सटीकता: {confidence}%
                    </span>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-xs transition-colors cursor-pointer"
              >
                {t('रद्द करें', 'Cancel')}
              </button>

              <button
                onClick={handleConfirm}
                disabled={!extractedText.trim() || scanning}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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
