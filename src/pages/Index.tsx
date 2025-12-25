import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { HomePage } from "@/components/HomePage";
import { Navigation } from "@/components/Navigation";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { BODDashboard } from "@/components/BODDashboard";


const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-primary font-bold text-xl animate-pulse">
            ▲
          </div>
        </div>
        <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading Academy...</p>
      </div>
    );
  }

  // Show public homepage for non-authenticated users
  if (!user || !profile) {
    return <HomePage onLoginClick={() => navigate('/auth')} />;
  }

  const renderDashboard = () => {
    const userData = {
      name: profile.full_name,
      rank: profile.rank || 'Member',
      level: profile.level
    };

    switch (profile.role) {
      case 'student':
        return <StudentDashboard user={userData} />;
      case 'faculty':
        return <FacultyDashboard user={userData} userId={user.id} />;
      case 'bod':
        return <BODDashboard user={userData} />;
      default:
        return <StudentDashboard user={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background glacier-theme">
      <Navigation
        currentRole={profile.role}
        currentUser={{
          name: profile.full_name,
          rank: profile.rank || 'Member',
          level: profile.level
        }}
        onRoleChange={() => { }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;