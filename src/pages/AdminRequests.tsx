import { useAuth } from "@/components/AuthProvider";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";

export default function AdminRequests() {
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

  if (!user || !profile || profile.role !== 'superadmin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-academic">
      <Navigation 
        currentRole={profile.role}
        currentUser={{
          name: profile.full_name,
          rank: profile.rank || 'Admin',
          level: profile.level
        }}
        onRoleChange={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SuperAdminDashboard 
          user={{
            name: profile.full_name,
            rank: profile.rank || 'Admin',
            level: profile.level
          }}
        />
      </main>
    </div>
  );
}