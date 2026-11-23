import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { localDB } from '../services/indexedDB';
import {
  auth,
  signInWithGoogle as firebaseSignInWithGoogle,
  logOutFromFirebase,
  onAuthStateChanged
} from '../services/firebase';

interface AuthContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  isOnline: boolean;
  toggleOfflineMode: () => void;
  pendingSyncCount: number;
  triggerSync: () => Promise<void>;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  continueAsGuest: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'guest-student-01',
  name: 'Guest Scholar',
  isGuest: true,
  role: 'student',
  grade: 10,
  board: 'CBSE',
  state: 'Jharkhand',
  city: 'Ranchi',
  district: 'Ranchi',
  preferredLanguage: 'en',
  streakDays: 3,
  totalPoints: 350,
  linkCode: 'GK' + Math.floor(1000 + Math.random() * 9000)
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('gurukul_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_USER,
          ...parsed,
          board: parsed.board || 'CBSE',
          state: parsed.state || 'Jharkhand',
          city: parsed.city || parsed.district || 'Ranchi',
          isGuest: parsed.isGuest !== undefined ? parsed.isGuest : !parsed.email,
        };
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Synchronize with indexedDB and localStorage
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

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser((prev) => ({
          ...prev,
          id: fbUser.uid,
          name: fbUser.displayName || prev.name || 'Gurukul Scholar',
          email: fbUser.email || undefined,
          photoURL: fbUser.photoURL || undefined,
          isGuest: false,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const signInGoogle = async () => {
    try {
      const result = await firebaseSignInWithGoogle();
      setUser((prev) => ({
        ...prev,
        id: result.uid,
        name: result.name,
        email: result.email,
        photoURL: result.photoURL,
        isGuest: false,
        totalPoints: prev.totalPoints + 100, // Reward bonus points for signing in
      }));
      setIsAuthModalOpen(false);
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  const signOutUser = async () => {
    await logOutFromFirebase();
    setUser((prev) => ({
      ...prev,
      id: 'guest-' + Date.now().toString(36),
      name: 'Guest Scholar',
      email: undefined,
      photoURL: undefined,
      isGuest: true,
    }));
  };

  const continueAsGuest = () => {
    setUser((prev) => ({
      ...prev,
      isGuest: true,
      name: prev.name === 'Aryan Verma' ? 'Guest Scholar' : prev.name,
    }));
    setIsAuthModalOpen(false);
  };

  const toggleOfflineMode = () => {
    setIsOnline((prev) => !prev);
  };

  const triggerSync = async () => {
    const queue = await localDB.listQueue();
    if (queue.length === 0) return;
    try {
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
        isAuthModalOpen,
        setIsAuthModalOpen,
        signInGoogle,
        signOutUser,
        continueAsGuest,
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
