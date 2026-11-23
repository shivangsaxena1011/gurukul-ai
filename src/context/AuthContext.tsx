import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { localDB } from '../services/indexedDB';

interface AuthContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  isOnline: boolean;
  toggleOfflineMode: () => void;
  pendingSyncCount: number;
  triggerSync: () => Promise<void>;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'student-01',
  name: 'Aryan Verma',
  role: 'student',
  grade: 10,
  board: 'CBSE',
  state: 'Jharkhand',
  city: 'Ranchi',
  district: 'Ranchi',
  preferredLanguage: 'en',
  streakDays: 7,
  totalPoints: 1450,
  linkCode: 'GK8821'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gurukul_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_USER,
        ...parsed,
        board: parsed.board || 'CBSE',
        state: parsed.state || 'Jharkhand',
        city: parsed.city || parsed.district || 'Ranchi',
      };
    }
    return DEFAULT_USER;
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    localDB.setKV('cachedUser', user);
    localStorage.setItem('gurukul_user', JSON.stringify(user));
  }, [user]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check of queue
    localDB.listQueue().then((items) => setPendingSyncCount(items.length));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const toggleOfflineMode = () => {
    setIsOnline((prev) => !prev);
  };

  const triggerSync = async () => {
    const queue = await localDB.listQueue();
    if (queue.length === 0) return;
    try {
      // Simulate /sync
      await new Promise((r) => setTimeout(r, 600));
      await localDB.clearQueue(queue.map((q) => q.clientId));
      setPendingSyncCount(0);
    } catch (e) {
      console.error('Sync failed:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        updateUser,
        isOnline,
        toggleOfflineMode,
        pendingSyncCount,
        triggerSync,
        isOnboardingOpen,
        setIsOnboardingOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
