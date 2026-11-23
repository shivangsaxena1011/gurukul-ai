import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { localDB } from '../services/indexedDB';
import { OfflinePack } from '../types';
import { soundFx } from '../utils/soundEffects';
import QRCode from 'qrcode';
import {
  QrCode,
  Share2,
  Download,
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  WifiOff,
  Copy,
  Check
} from 'lucide-react';

interface OfflineQRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack?: OfflinePack | null;
  onPackImported?: () => void;
}

export const OfflineQRShareModal: React.FC<OfflineQRShareModalProps> = ({
  isOpen,
  onClose,
  pack,
  onPackImported
}) => {
  const { language, t } = useLanguage();
  const [mode, setMode] = useState<'SHARE' | 'IMPORT'>('SHARE');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [importPayload, setImportPayload] = useState('');
  const [copied, setCopied] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (pack) {
      generateQR(pack);
    }
  }, [isOpen, pack]);

  const generateQR = async (p: OfflinePack) => {
    try {
      const payload = JSON.stringify({
        g_id: 'GURUKUL_P2P',
        slug: p.slug,
        title: p.title,
        grade: p.grade,
        sub: p.subject,
        qc: p.questionsCount || 25,
        v: 1
      });
      const url = await QRCode.toDataURL(payload, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0B0F19',
          light: '#FDE68A'
        }
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyPayload = () => {
    if (!pack) return;
    soundFx.playClick();
    const payload = JSON.stringify({
      g_id: 'GURUKUL_P2P',
      slug: pack.slug,
      title: pack.title,
      grade: pack.grade,
      sub: pack.subject,
      qc: pack.questionsCount || 25
    });
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = async () => {
    if (!importPayload.trim()) return;
    try {
      const data = JSON.parse(importPayload.trim());
      const newPack: OfflinePack = {
        slug: data.slug || `p2p-pack-${Date.now()}`,
        title: data.title || 'P2P Shared Offline Chapter',
        subject: data.sub || 'science',
        grade: data.grade || 10,
        sizeBytes: 1024 * 1024 * 3,
        savedAt: new Date().toLocaleDateString(),
        questionsCount: data.qc || 25
      };

      await localDB.savePack(newPack);
      soundFx.playCorrect();
      setImportSuccess(true);
      if (onPackImported) onPackImported();
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      alert(language === 'en' ? 'Invalid pack payload' : 'अमान्य पैक डेटा');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-panel border border-emerald-500/30 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close QR Share"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold">
            <WifiOff className="w-3.5 h-3.5" />
            <span>{t('0% डेटा: P2P ऑफ़लाइन QR शेयरिंग', 'Zero-Data P2P QR Pack Sharing')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t('बिना इंटरनेट पैक साझा करें', 'Share Offline Packs Device-to-Device')}
          </h2>
          <p className="text-xs text-ink-300">
            {t(
              'एक फोन से दूसरे फोन में QR कोड स्कैन करके बिना किसी इंटरनेट या मोबाइल डेटा के पूरे चैप्टर पैक्स ट्रांसफर करें।',
              'Transfer entire chapter question packs between student phones via QR without cellular data.'
            )}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-2xl bg-ink-900/80 p-1 border border-white/10 text-xs font-bold">
          <button
            onClick={() => setMode('SHARE')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'SHARE'
                ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 shadow-md'
                : 'text-ink-400 hover:text-white'
            }`}
          >
            {t('QR कोड दिखाएं (Share)', 'Show QR Code (Share)')}
          </button>
          <button
            onClick={() => setMode('IMPORT')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'IMPORT'
                ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 shadow-md'
                : 'text-ink-400 hover:text-white'
            }`}
          >
            {t('QR / कोड से प्राप्त करें (Import)', 'Receive Pack (Import)')}
          </button>
        </div>

        {/* Mode 1: SHARE QR */}
        {mode === 'SHARE' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            {pack ? (
              <>
                <div className="p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-400">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Offline Pack QR Code"
                      className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl"
                    />
                  ) : (
                    <div className="w-52 h-52 flex items-center justify-center text-xs text-ink-500">
                      QR कोड बन रहा है…
                    </div>
                  )}
                </div>

                <div className="text-center space-y-0.5">
                  <div className="text-sm font-extrabold text-white">{pack.title}</div>
                  <div className="text-xs text-ink-400">
                    {pack.questionsCount} {t('प्रश्न', 'Questions')} • {t('कक्षा', 'Class')} {pack.grade}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleCopyPayload}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white border border-white/10 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? t('कॉपी हुआ!', 'Copied Payload!') : t('पैक कोड कॉपी करें', 'Copy Code')}</span>
                  </button>

                  {qrDataUrl && (
                    <a
                      href={qrDataUrl}
                      download={`${pack.slug}-qr.png`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 border border-amber-500/30 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t('QR डाउनलोड करें', 'Save QR')}</span>
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-xs text-ink-400 py-8">
                {t('कृपया पहले एक चैप्टर पैक चुनें', 'Select an offline chapter pack first')}
              </div>
            )}
          </div>
        )}

        {/* Mode 2: IMPORT QR */}
        {mode === 'IMPORT' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-ink-900/90 border border-white/10 space-y-3">
              <label className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>{t('साझा किया गया कोड यहाँ पेस्ट करें:', 'Paste Pack Code / Scanned Text:')}</span>
              </label>
              <textarea
                rows={3}
                value={importPayload}
                onChange={(e) => setImportPayload(e.target.value)}
                placeholder='{"g_id":"GURUKUL_P2P","slug":"real-numbers","title":"वास्तविक संख्याएँ"...}'
                className="w-full bg-ink-950 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleImport}
                disabled={!importPayload.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-ink-950 font-extrabold text-xs shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all"
              >
                {importSuccess ? (
                  <span className="flex items-center justify-center gap-1 text-ink-950">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('पैक सफलतापूर्वक इंस्टॉल हुआ!', 'Pack Successfully Installed!')}
                  </span>
                ) : (
                  t('IndexedDB में पैक इंस्टॉल करें (0% डेटा)', 'Install Pack into Offline Storage (0% Data)')
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
