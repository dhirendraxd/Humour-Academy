import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { MOCK_PROFILES, MOCK_USER, Profile } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, role?: 'student' | 'faculty' | 'bod') => Promise<void>;
  signUp: (email: string, fullName: string, role: 'student' | 'faculty' | 'bod') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signOut: async () => { },
  signIn: async () => { },
  signUp: async () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem('mock_user_role');
    if (storedUser) {
      const role = storedUser as 'student' | 'faculty' | 'bod';
      // Find a mock profile that matches the role, or default to first student
      const mockProfile = MOCK_PROFILES.find(p => p.role === role) || MOCK_PROFILES[0];

      setUser({ ...MOCK_USER, id: mockProfile.user_id } as User);
      setProfile(mockProfile);
      setSession({ user: { ...MOCK_USER, id: mockProfile.user_id } } as Session);
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, role: 'student' | 'faculty' | 'bod' = 'student') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // For demo purposes, we'll assign a profile based on the requested role
    // In a real mock, we might lookup by email, but here we just want to switch roles easily
    const mockProfile = MOCK_PROFILES.find(p => p.role === role) || MOCK_PROFILES[0];

    setUser({ ...MOCK_USER, id: mockProfile.user_id } as User);
    setProfile(mockProfile);
    setSession({ user: { ...MOCK_USER, id: mockProfile.user_id } } as Session);

    localStorage.setItem('mock_user_role', role);
    setLoading(false);
  };

  const signUp = async (email: string, fullName: string, role: 'student' | 'faculty' | 'bod') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProfile: Profile = {
      id: `new-${Date.now()}`,
      user_id: `new-user-${Date.now()}`,
      full_name: fullName,
      email: email,
      role: role,
      level: 1,
      rank: 'Newcomer'
    };

    // Note: This won't persist across reloads since MOCK_PROFILES is constant
    // But it works for the current session
    setUser({ ...MOCK_USER, id: newProfile.user_id } as User);
    setProfile(newProfile);
    setSession({ user: { ...MOCK_USER, id: newProfile.user_id } } as Session);

    localStorage.setItem('mock_user_role', role);
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    localStorage.removeItem('mock_user_role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signOut,
        signIn,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};