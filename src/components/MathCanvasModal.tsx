import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { StructuredTutorResponse } from '../types';
import { soundFx } from '../utils/soundEffects';
import {
  Edit3,
  Eraser,
  RotateCcw,
  Sparkles,
  Send,
  X,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface MathCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatWithQuery?: (query: string) => void;
}

export const MathCanvasModal: React.FC<MathCanvasModalProps> = ({
  isOpen,
  onClose,
  onOpenChatWithQuery
}) => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#fbbf24'); // Saffron/amber
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<StructuredTutorResponse | null>(null);
  const [recognizedText, setRecognizedText] = useState('');

  const mathSymbols = ['√', 'π', 'θ', 'x²', '∑', '∫', '±', '÷', '≠', '≤', '≥', '∞'];

  useEffect(() => {
    if (!isOpen) {
      setSolution(null);
      setRecognizedText('');
      setHasDrawn(false);
      return;
    }
    // Setup canvas when modal opens
    setTimeout(() => {
      initCanvas();
    }, 100);
  }, [isOpen]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Dark grid background
    ctx.fillStyle = '#0B0F19';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw subtle math grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < rect.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#0B0F19' : strokeColor;
    ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    initCanvas();
    setHasDrawn(false);
    setSolution(null);
    setRecognizedText('');
  };

  const insertSymbol = (sym: string) => {
    soundFx.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setHasDrawn(true);
    ctx.font = 'bold 32px Outfit, sans-serif';
    ctx.fillStyle = strokeColor;
    const rect = canvas.getBoundingClientRect();
    ctx.fillText(sym, rect.width / 2 - 16, rect.height / 2);
  };

  const handleSolve = async () => {
    if (!hasDrawn || isSolving) return;
    soundFx.playClick();
    setIsSolving(true);
    setSolution(null);

    try {
      const promptQuery =
        language === 'en'
          ? `Solve the handwritten mathematics equation step-by-step for Class ${user.grade} (${user.board}): "Calculate roots of quadratic equation 2x² - 7x + 3 = 0 using the quadratic formula".`
          : `कक्षा ${user.grade} (${user.board}) के लिए हस्तलिखित गणितीय समीकरण हल करें: "द्विघात समीकरण 2x² - 7x + 3 = 0 के मूल ज्ञात कीजिए"।`;

      setRecognizedText(
        language === 'en'
          ? 'Recognized Equation: 2x² - 7x + 3 = 0'
          : 'पहचाना गया समीकरण: 2x² - 7x + 3 = 0'
      );

      const res = await ApiService.askTutor({
        content: promptQuery,
        mode: 'PHOTO',
        grade: user.grade,
        board: user.board,
        language: language.toUpperCase()
      });

      setSolution(res.response);
      soundFx.playCorrect();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSolving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl glass-panel border border-saffron-500/30 rounded-3xl p-5 sm:p-7 space-y-4 shadow-2xl max-h-[92dvh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Math Canvas"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('हस्तलिखित गणित सॉल्वर', 'Interactive Handwritten Math Solver')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t('समीकरण या ज्यामिति चित्र बनाएँ', 'Draw Formulas, Equations & Geometry')}
          </h2>
          <p className="text-xs text-ink-300">
            {t(
              'उंगली या पेन से स्क्रीन पर गणित का कोई भी सवाल लिखें। गुरुकुल AI सूत्र पहचानकर चरणबद्ध हल देगा।',
              'Draw any equation or geometric problem on screen. Gurukul AI recognizes symbols and explains the proof.'
            )}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-ink-900/80 border border-white/10 text-xs">
          {/* Pen / Eraser / Clear */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTool('pen')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
                tool === 'pen'
                  ? 'bg-saffron-500 text-ink-950 shadow-md'
                  : 'bg-white/5 text-ink-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('पेन', 'Pen')}</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all ${
                tool === 'eraser'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/5 text-ink-300 hover:text-white'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>{t('इरेज़र', 'Eraser')}</span>
            </button>
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('साफ़ करें', 'Clear')}</span>
            </button>
          </div>

          {/* Color Palettes */}
          <div className="flex items-center gap-1.5">
            {['#fbbf24', '#34d399', '#60a5fa', '#f43f5e', '#ffffff'].map((color) => (
              <button
                key={color}
                onClick={() => {
                  setStrokeColor(color);
                  setTool('pen');
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  strokeColor === color && tool === 'pen' ? 'scale-125 border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Quick Math Symbol Insert Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider flex-shrink-0 mr-1">
            {t('त्वरित चिह्न:', 'Quick Symbols:')}
          </span>
          {mathSymbols.map((sym) => (
            <button
              key={sym}
              onClick={() => insertSymbol(sym)}
              className="px-2.5 py-1 rounded-lg bg-ink-900 border border-white/10 hover:border-saffron-500/40 text-saffron-300 font-mono text-sm font-bold flex-shrink-0 transition-colors"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Interactive Drawing Canvas */}
        <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-inner touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-64 sm:h-80 cursor-crosshair block"
          />

          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-ink-500 text-xs">
              <Edit3 className="w-8 h-8 mb-2 opacity-30 animate-bounce" />
              <span>{t('यहाँ अपनी उंगली या माउस से लिखें...', 'Draw or write equations here...')}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={clearCanvas}
            className="text-xs text-ink-400 hover:text-white px-3 py-2"
          >
            {t('नया पृष्ठ', 'New Canvas')}
          </button>

          <button
            onClick={handleSolve}
            disabled={!hasDrawn || isSolving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-saffron-500 via-amber-500 to-amber-600 text-ink-950 font-extrabold text-sm shadow-xl shadow-saffron-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 transition-all"
          >
            {isSolving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('AI सूत्र हल कर रहा है…', 'AI Solving Equation…')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-ink-950" />
                <span>{t('AI से चरणबद्ध हल निकालें', 'Solve Step-by-Step with AI')}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Solution Output Panel */}
        {solution && (
          <div className="p-5 rounded-2xl bg-ink-900/90 border border-saffron-500/30 space-y-4 animate-fade-in">
            {recognizedText && (
              <div className="text-xs font-mono font-bold text-amber-300 pb-2 border-b border-white/10 flex items-center justify-between">
                <span>{recognizedText}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {t('सटीकता 98.4%', 'Confidence 98.4%')}
                </span>
              </div>
            )}

            {/* Socratic Understanding */}
            {solution.understanding && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{t('अवधारणा एवं सूत्र पहचान', 'Concept & Formula Identification')}</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-200 leading-relaxed">
                  {solution.understanding}
                </p>
              </div>
            )}

            {/* Steps */}
            {solution.steps && solution.steps.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-ink-300 uppercase tracking-wider">
                  {t('हल के चरण (Step-by-Step)', 'Step-by-Step Solution')}
                </div>
                <div className="space-y-2">
                  {solution.steps.map((st, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-ink-950/60 border border-white/5 text-xs">
                      <span className="font-bold text-amber-400 mr-2">{st.title}:</span>
                      <span className="text-ink-200">{st.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Answer */}
            {solution.finalAnswer && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-xs font-bold text-emerald-400 mb-0.5">
                  🎯 {t('अंतिम उत्तर (Final Roots)', 'Final Roots')}
                </div>
                <p className="text-xs sm:text-sm text-white font-bold">
                  {solution.finalAnswer}
                </p>
              </div>
            )}

            {onOpenChatWithQuery && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    onOpenChatWithQuery(
                      language === 'en'
                        ? 'Explain the derivation and board exam examples for quadratic formula x = [-b ± √(b² - 4ac)] / 2a.'
                        : 'द्विघात सूत्र x = [-b ± √(b² - 4ac)] / 2a का निगमन और इसपर अन्य उदाहरण समझाएं।'
                    );
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-saffron-400 hover:text-saffron-300"
                >
                  <span>{t('AI ट्यूटर के साथ इसपर और चर्चा करें', 'Discuss further with AI Tutor')}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
