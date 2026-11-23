import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BOARDS, STATES_AND_CITIES } from '../data/constants';
import { X, Check, MapPin, GraduationCap, Sparkles, Building2, Compass } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { t } = useLanguage();
  const { user, updateUser, isOnboardingOpen, setIsOnboardingOpen } = useAuth();

  const [selectedBoard, setSelectedBoard] = useState(user.board || 'CBSE');
  const [selectedGrade, setSelectedGrade] = useState(user.grade || 10);
  const [selectedState, setSelectedState] = useState(user.state || 'Jharkhand');
  const [selectedCity, setSelectedCity] = useState(user.city || user.district || 'Ranchi');
  const [studentName, setStudentName] = useState(user.name);

  if (!isOnboardingOpen) return null;

  const states = Object.keys(STATES_AND_CITIES);
  const availableCities = STATES_AND_CITIES[selectedState] || [];

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const cities = STATES_AND_CITIES[newState] || [];
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  };

  const handleSave = () => {
    updateUser({
      name: studentName,
      board: selectedBoard,
      grade: selectedGrade,
      state: selectedState,
      city: selectedCity,
      district: selectedCity, // preserve backward compatibility
    });
    setIsOnboardingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel border border-saffron-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsOnboardingOpen(false)}
          aria-label="Close Settings"
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-ink-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('कक्षा, बोर्ड एवं शहर सेटिंग्स', 'Board, Class & City Settings')}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {t('अपनी कक्षा, बोर्ड और शहर चुनें', 'Customize your Learning Profile')}
          </h2>
          <p className="text-xs text-ink-300">
            {t(
              'AI आपके चुने हुए बोर्ड, राज्य और शहर के पाठ्यक्रम के अनुसार उत्तर और अभ्यास तैयार करेगा।',
              'AI adapts curriculum, syllabus, and dialect to your selected board and region.'
            )}
          </p>
        </div>

        {/* Student Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink-300">
            {t('छात्र का नाम (Student Name)', 'Student Name')}
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full bg-ink-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-saffron-500"
          />
        </div>

        {/* 1. Educational Board Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-saffron-400" />
            <span>{t('शिक्षा बोर्ड चुनें (Select Board):', 'Select Education Board:')}</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BOARDS.map((board) => {
              const isSelected = selectedBoard === board.code;
              return (
                <button
                  key={board.id}
                  type="button"
                  onClick={() => setSelectedBoard(board.code)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-saffron-500/20 border-saffron-400 text-white font-bold ring-1 ring-saffron-400/40'
                      : 'bg-ink-950/60 border-white/10 text-ink-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-extrabold text-amber-300">{board.code}</div>
                  <div className="text-[10px] text-ink-400 line-clamp-1">{board.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grade Selection (1 to 12) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>{t('कक्षा चुनें (Select Class 1–12):', 'Select Class (1–12):')}</span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => {
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={`p-2.5 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-saffron-500 to-amber-600 text-ink-950 font-black border-saffron-400 shadow-lg shadow-saffron-500/25 scale-105'
                      : 'bg-ink-950/60 border-white/10 text-white hover:border-white/30 hover:bg-white/5 font-bold'
                  }`}
                >
                  <div className="text-[10px] uppercase opacity-80">{t('कक्षा', 'Class')}</div>
                  <div className="text-lg font-extrabold">{grade}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. State & City Selection (Cascading) */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* State Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-400" />
              <span>{t('राज्य चुनें (Select State):', 'Select State:')}</span>
            </label>

            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {states.map((st) => (
                <option key={st} value={st} className="bg-ink-900 text-white">
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* City Picker inside State */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('शहर / जिला चुनें (Select City):', 'Select City / District:')}</span>
            </label>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-ink-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              {availableCities.map((ct) => (
                <option key={ct} value={ct} className="bg-ink-900 text-white">
                  {ct}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Selection Pills of Cities in selected state */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-ink-400">
            {t(`${selectedState} के लोकप्रिय शहर / जिले:`, `Cities in ${selectedState}:`)}
          </div>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-ink-950/40 rounded-xl border border-white/5">
            {availableCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/5 text-ink-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setIsOnboardingOpen(false)}
            className="flex-1 py-3 rounded-xl bg-ink-900 border border-white/10 text-ink-300 font-bold text-sm hover:bg-white/5 transition-colors"
          >
            {t('रद्द करें', 'Cancel')}
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-600 text-ink-950 font-extrabold text-sm shadow-lg shadow-saffron-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{t('सुरक्षित करें (Save)', 'Save Settings')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
