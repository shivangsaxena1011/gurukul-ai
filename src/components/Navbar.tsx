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
  Users,
  Code2,
  LogIn,
  LogOut,
  User
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    user,
    isOnline,
    toggleOfflineMode,
    pendingSyncCount,
    setIsOnboardingOpen,
    setIsAuthModalOpen,
    signOutUser
  } = useAuth();

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
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-slate-900 truncate">
                  GURUKUL AI
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                  {user.board || 'CBSE'} • {t('कक्षा', 'Cl.')} {user.grade}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block truncate">
                {user.city || user.district}, {user.state || 'Jharkhand'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/90 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
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
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-1 text-amber-600">
                <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
                <span>{user.streakDays} {t('दिन', 'Days')}</span>
              </div>
              <div className="w-px h-3 bg-slate-200" />
              <div className="flex items-center gap-1 text-emerald-600">
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
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
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
                <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {pendingSyncCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 sm:p-1 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 sm:ml-1.5 mr-0.5 sm:mr-1" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                aria-label="Select Language"
                className="bg-transparent text-slate-800 font-medium focus:outline-none pr-1 sm:pr-2 cursor-pointer text-xs"
              >
                <option value="en" className="bg-white text-slate-800">English</option>
                <option value="hi" className="bg-white text-slate-800">हिन्दी</option>
                <option value="hg" className="bg-white text-slate-800">Hinglish</option>
              </select>
            </div>

            {/* Google Auth / Guest Mode Status */}
            {user.isGuest ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                title={t('Google से लॉगिन करें', 'Sign in with Google to save progress')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('लॉगिन करें', 'Sign In')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-xs text-slate-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-slate-200" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px]">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden md:inline font-bold text-slate-800 max-w-[80px] truncate">{user.name}</span>
                <button
                  onClick={signOutUser}
                  title={t('लॉगआउट', 'Sign Out')}
                  className="text-slate-400 hover:text-rose-500 ml-0.5 p-0.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Developer Credit Badge */}
            <div
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 shadow-sm select-none"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Dev: <strong className="text-slate-900 font-bold">Shivang Saxena</strong></span>
            </div>

            {/* Grade/District Profile Settings */}
            <button
              onClick={() => setIsOnboardingOpen(true)}
              aria-label="Profile and District Settings"
              className="p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Ergonomic Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-2 py-1.5 flex items-center justify-around md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
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
                  ? 'text-amber-600 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5px] text-amber-600' : 'stroke-[1.75px]'}`} />
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-extrabold text-slate-900' : 'font-medium'}`}>
                {t(item.labelHi, item.labelEn)}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
