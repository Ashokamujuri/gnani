// ============================================
// CropShield AI – Auth Context with Google Firebase Authentication
// ============================================
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  firebaseSignOut, 
  onAuthStateChanged, 
  type FirebaseUser 
} from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (role: UserRole) => void;
  loginWithGoogle: (role?: UserRole) => Promise<User>;
  loginWithEmail: (email: string, pass: string, role?: UserRole) => Promise<User>;
  signUpWithEmail: (email: string, pass: string, name: string, role?: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'cropshield_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const cached = localStorage.getItem(USER_SESSION_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync session state to storage
  const updateUser = useCallback((u: User | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(USER_SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  // Monitor Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setUser((prev) => {
          const currentRole: UserRole = prev?.role || 'farmer';
          const updatedUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || prev?.name || fbUser.email?.split('@')[0] || 'Agricultural Specialist',
            email: fbUser.email || prev?.email || '',
            role: currentRole,
            avatar: fbUser.photoURL || undefined,
            region: prev?.region || 'Punjab',
            language: prev?.language || 'en',
          };
          try {
            localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
          } catch {
            // ignore
          }
          return updatedUser;
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback((role: UserRole) => {
    const selected = mockUsers[role] || {
      id: `USR-${Date.now()}`,
      name: role === 'farmer' ? 'Rajesh Kumar' : role === 'officer' ? 'Dr. Priya Sharma' : 'Dr. Anil Verma',
      email: `${role}@cropshield.ai`,
      role,
      language: 'en',
      region: 'Punjab',
    };
    updateUser(selected);
  }, [updateUser]);

  const loginWithGoogle = useCallback(async (role: UserRole = 'farmer'): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const appUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || 'Google User',
      email: fbUser.email || '',
      role,
      avatar: fbUser.photoURL || undefined,
      region: 'Punjab',
      language: 'en',
    };
    updateUser(appUser);
    return appUser;
  }, [updateUser]);

  const loginWithEmail = useCallback(async (email: string, pass: string, role: UserRole = 'farmer'): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    const fbUser = result.user;
    const appUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      role,
      avatar: fbUser.photoURL || undefined,
      region: 'Punjab',
      language: 'en',
    };
    updateUser(appUser);
    return appUser;
  }, [updateUser]);

  const signUpWithEmail = useCallback(async (email: string, pass: string, name: string, role: UserRole = 'farmer'): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = result.user;
    const appUser: User = {
      id: fbUser.uid,
      name: name || fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      role,
      avatar: fbUser.photoURL || undefined,
      region: 'Punjab',
      language: 'en',
    };
    updateUser(appUser);
    return appUser;
  }, [updateUser]);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    updateUser(null);
  }, [updateUser]);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev) return mockUsers[role] || null;
      const updated = { ...prev, role };
      try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!user,
        loading,
        login,
        loginWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

