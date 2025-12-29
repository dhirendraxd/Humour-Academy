import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, auth } from '@/lib/auth';
import { Profile } from '@/data/mockData';

// Define context type
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => { },
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
      // Capture token from URL (Google OAuth callback), then clean URL
      const url = new URL(window.location.href);
      const tokenParam = url.searchParams.get('token');
      if (tokenParam) {
        tokenManager.setToken(tokenParam);
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.toString());
      }

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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};