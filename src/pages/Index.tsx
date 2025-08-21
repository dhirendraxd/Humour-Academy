import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { BODDashboard } from "@/components/BODDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-academic">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in or no profile
  if (!user || !profile || !profile.approved_status) {
    return <Navigate to="/auth" replace />;
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
        return <FacultyDashboard user={userData} />;
      case 'bod':
        return <BODDashboard user={userData} />;
      case 'superadmin':
        return <SuperAdminDashboard user={userData} />;
      default:
        return <StudentDashboard user={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-academic">
      <Navigation 
        currentRole={profile.role}
        currentUser={{
          name: profile.full_name,
          rank: profile.rank || 'Member',
          level: profile.level
        }}
        onRoleChange={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;