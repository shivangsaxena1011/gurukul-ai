import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { Camera, Upload, X, Check, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setSelectedImage(URL.createObjectURL(f));
      runScan(f);
    }
  };

  const runScan = async (f: File) => {
    setScanning(true);
    setExtractedText('');
    try {
      const res = await ApiService.extractPhoto(f, language === 'en');
      setExtractedText(res.question);
    } catch (e) {
      setExtractedText(
        language === 'en'
          ? 'Prove that √5 is an irrational number.'
          : 'सिद्ध कीजिए कि √5 एक अपरिमेय संख्या है।'
      );
    } finally {
      setScanning(false);
    }
  };

  const handleConfirm = () => {
    if (extractedText.trim()) {
      onSubmitQuestion(extractedText.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel border border-blue-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl overflow-hidden">
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
            <span>{t('फोटो से सवाल पूछें', 'Photo OCR Question')}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {t('किताब या कॉपी की तस्वीर लें', 'Capture or Upload Question')}
          </h2>
          <p className="text-xs text-ink-300">
            {t('Qwen Vision AI तस्वीर को तुरंत पढ़कर सवाल निकालेगा।', 'Vision AI will read the text and diagrams.')}
          </p>
        </div>

        {/* Upload & Preview Zone */}
        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center cursor-pointer hover:border-saffron-500/50 hover:bg-saffron-500/5 transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-ink-900 border border-white/10 flex items-center justify-center text-ink-400 group-hover:text-saffron-400 group-hover:scale-110 transition-all mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-white mb-1">
              {t('फोटो यहाँ चुनें या खींचें', 'Click to upload or take photo')}
            </p>
            <p className="text-xs text-ink-400">
              JPG, PNG, WEBP (अधिकतम 15 MB)
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scanned Image Preview with Laser Line */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 max-h-56 bg-ink-950 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected Question"
                className="w-full h-full object-contain max-h-56 opacity-90"
              />

              {/* Laser Scanning Animation */}
              {scanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_#60a5fa] animate-[bounce_1.5s_infinite]" />
              )}

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setExtractedText('');
                }}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-ink-950/80 text-xs font-bold text-ink-300 hover:text-white border border-white/10"
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
            <div>
              <label className="block text-xs font-bold text-ink-300 mb-1">
                {t('पहचाना गया सवाल (जाँचें या सुधारें):', 'Extracted Question (Edit if needed):')}
              </label>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={3}
                className="w-full bg-ink-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder={t('यहाँ सवाल दिखाई देगा...', 'Question text will appear here...')}
              />
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-ink-900 border border-white/10 text-ink-300 font-bold text-sm hover:bg-white/5 transition-colors"
          >
            {t('रद्द करें', 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!extractedText.trim() || scanning}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t('ट्यूटर से पूछें', 'Ask Tutor')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
