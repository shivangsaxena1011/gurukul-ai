import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Wifi,
  WifiOff,
  Flame,
  Award,
  Globe,
  Settings,
  Home,
  MessageSquare,
  Download,
  Users
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isOnline, toggleOfflineMode, pendingSyncCount, setIsOnboardingOpen } = useAuth();

  const navItems = [
    { id: 'home', labelHi: 'होम', labelEn: 'Home', icon: Home },
    { id: 'tutor', labelHi: 'AI ट्यूटर', labelEn: 'AI Tutor', icon: MessageSquare },
    { id: 'practice', labelHi: 'अभ्यास', labelEn: 'Practice', icon: Award },
    { id: 'offline', labelHi: 'ऑफलाइन', labelEn: 'Offline', icon: Download },
    { id: 'guardian', labelHi: 'अभिभावक', labelEn: 'Guardian', icon: Users },
  ];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-saffron-500 to-amber-300 p-0.5 shadow-lg shadow-saffron-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="w-full h-full bg-ink-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-saffron-400 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-saffron-300 via-amber-200 to-white bg-clip-text text-transparent truncate">
                  GURUKUL AI
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 whitespace-nowrap">
                  {user.board || 'CBSE'} • {t('कक्षा', 'Cl.')} {user.grade}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-ink-400 font-medium hidden sm:block truncate">
                {user.city || user.district}, {user.state || 'Jharkhand'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-ink-900/60 p-1.5 rounded-2xl border border-white/5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 shadow-md shadow-saffron-500/20 font-bold'
                      : 'text-ink-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(item.labelHi, item.labelEn)}
                </button>
              );
            })}
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Streak & Points Badges (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 bg-ink-900/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold">
              <div className="flex items-center gap-1 text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400 animate-bounce" />
                <span>{user.streakDays} {t('दिन', 'Days')}</span>
              </div>
              <div className="w-px h-3 bg-white/10" />
              <div className="flex items-center gap-1 text-emerald-400">
                <Award className="w-4 h-4" />
                <span>{user.totalPoints} pts</span>
              </div>
            </div>

            {/* Online/Offline Status Toggle */}
            <button
              onClick={toggleOfflineMode}
              title={isOnline ? 'Online (Click to test offline)' : 'Offline mode active'}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('ऑनलाइन', 'Online')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="text-[11px] sm:text-xs">{t('ऑफलाइन', 'Offline')}</span>
                </>
              )}
              {pendingSyncCount > 0 && (
                <span className="bg-saffron-500 text-ink-950 px-1.5 py-0.2 rounded-full text-[10px]">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-ink-900 border border-white/10 rounded-xl p-0.5 sm:p-1 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-ink-400 ml-1 sm:ml-1.5 mr-0.5 sm:mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Language"
                className="bg-transparent text-white font-medium focus:outline-none pr-1 sm:pr-2 cursor-pointer text-xs"
              >
                <option value="en" className="bg-ink-900 text-white">EN</option>
                <option value="hi" className="bg-ink-900 text-white">हिंदी</option>
                <option value="hg" className="bg-ink-900 text-white">Hinglish</option>
              </select>
            </div>

            {/* Grade/District Profile Settings */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              aria-label="Profile and District Settings"
              className="p-1.5 sm:p-2 rounded-xl bg-ink-900 border border-white/10 hover:border-saffron-500/40 text-ink-300 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Ergonomic Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0B0F19]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 flex items-center justify-around md:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-saffron-400 scale-105'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-saffron-400' : 'stroke-[1.75px]'}`} />
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-extrabold text-white' : 'font-medium'}`}>
                {t(item.labelHi, item.labelEn)}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
