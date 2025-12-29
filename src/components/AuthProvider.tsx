import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth } from '@/lib/auth';
import { Profile } from '@/data/mockData';

// Define context type
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, fullName: string, password: string, role: string, additionalData?: any) => Promise<User>;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
  signIn: async () => { return Promise.resolve(null as any) },
  signUp: async () => { return Promise.resolve(null as any) },
  isAuthenticated: false,
});

// Hook to use auth context
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

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (auth.isAuthenticated()) {
        try {
          const currentUser = await auth.getUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          auth.logout(); // Clear invalid token
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await auth.login({ email, password });
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, fullName: string, password: string, role: string, additionalData?: any) => {
    setLoading(true);
    try {
      const response = await auth.register({
        name: fullName,
        email,
        password,
        password_confirmation: password,
        role,
        ...additionalData
      });
      setUser(response.user);
      return response.user;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    try {
      await auth.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Derive profile from user
  const profile: Profile | null = user ? {
    id: user.id.toString(),
    user_id: user.id.toString(),
    full_name: user.name,
    email: user.email,
    role: (user.role as 'student' | 'faculty' | 'bod') || 'student',
    bio: user.bio || undefined,
    city: user.city || undefined,
    phone: user.phone || undefined,
    interests: user.interests || [],
    level: user.level || 1,
    rank: user.rank || 'Novice',
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        signIn,
        signUp,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};