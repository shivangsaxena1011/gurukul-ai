import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Code2,
  ExternalLink,
  Github,
  Sparkles,
  X,
  Layers,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Database
} from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const techStack = [
    { name: 'React 18 & TypeScript', desc: 'Type-safe component architecture with concurrent rendering' },
    { name: 'Three.js & WebGL', desc: 'Physically based 3D interactive Knowledge Orb with gyroscopic gimbal' },
    { name: 'Web Audio API', desc: 'Zero-latency synthesized UI audio, decibel frequency analyser & microphone visualizer' },
    { name: 'Groq Socratic & Vision AI', desc: 'High-throughput multimodal reasoning (Qwen Vision OCR + Socratic prompt chains)' },
    { name: 'IndexedDB v3 Offline Engine', desc: 'Local device persistence for curriculum chapter packs with zero cellular data requirement' },
    { name: 'Tailwind CSS & Glassmorphism', desc: 'Hardware-accelerated cyber-gurukul visual design with responsive safe-area insets' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel border border-saffron-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Developer Profile"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-saffron-500 via-amber-400 to-emerald-400 p-0.5 shadow-xl shadow-saffron-500/25">
              <div className="w-full h-full bg-ink-950 rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                👨‍💻
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-ink-950 text-[10px] font-black uppercase tracking-wider shadow">
              PRO
            </div>
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('मुख्य वास्तुकार एवं डेवलपर', 'Lead Architect & Full-Stack Developer')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Shivang Saxena
            </h2>
            <p className="text-xs sm:text-sm text-ink-300 leading-relaxed max-w-lg">
              {t(
                'झारखंड एवं संपूर्ण भारत के छात्रों के लिए अत्याधुनिक AI, 3D तकनीक और ऑफलाइन-फर्स्ट आर्किटेक्चर से युक्त गुरुकुल AI का निर्माण।',
                'Architected Gurukul AI with cutting-edge Edge AI, Three.js 3D, and offline-first infrastructure to democratize high-quality bilingual education.'
              )}
            </p>
          </div>
        </div>

        {/* Key Developer Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-ink-950/70 p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-amber-300 font-mono">100%</div>
            <div className="text-[10px] uppercase font-bold text-ink-400 mt-0.5">Offline Ready</div>
          </div>
          <div className="bg-ink-950/70 p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-emerald-400 font-mono">&lt; 35ms</div>
            <div className="text-[10px] uppercase font-bold text-ink-400 mt-0.5">Audio Latency</div>
          </div>
          <div className="bg-ink-950/70 p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-sky-400 font-mono">14 Boards</div>
            <div className="text-[10px] uppercase font-bold text-ink-400 mt-0.5">Aligned Curriculum</div>
          </div>
          <div className="bg-ink-950/70 p-3 rounded-2xl border border-white/5">
            <div className="text-lg font-black text-purple-400 font-mono">60 FPS</div>
            <div className="text-[10px] uppercase font-bold text-ink-400 mt-0.5">WebGL 3D Orbit</div>
          </div>
        </div>

        {/* Technical Architecture Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>{t('तकनीकी स्टैक एवं सिस्टम आर्किटेक्चर', 'Technical Architecture & Stack')}</span>
          </h3>

          <div className="grid sm:grid-cols-2 gap-2.5">
            {techStack.map((tech, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-ink-900/80 border border-white/5 space-y-0.5">
                <span className="text-xs font-bold text-white block">{tech.name}</span>
                <span className="text-[11px] text-ink-400 leading-tight block">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub & Contact Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
          <span className="text-xs text-ink-400">
            GitHub: <strong className="text-white">@shivangsaxena1011</strong>
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-ink-300 hover:text-white transition-colors"
            >
              {t('बंद करें', 'Close')}
            </button>

            <a
              href="https://github.com/shivangsaxena1011"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-extrabold text-xs shadow-lg shadow-saffron-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Github className="w-4 h-4" />
              <span>{t('गिटहब प्रोफ़ाइल देखें', 'View GitHub Profile')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
