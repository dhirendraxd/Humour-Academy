import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { BODDashboard } from "@/components/BODDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { LoginForm } from "@/components/LoginForm";
import heroImage from "@/assets/ramay-institute-hero.jpg";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState<'student' | 'faculty' | 'bod' | 'superadmin'>('student');
  
  // Mock user data - in real app this would come from Supabase auth
  const mockUsers = {
    student: { name: "Alex Johnson", rank: "Pun Apprentice", level: 3 },
    faculty: { name: "Dr. Sarah Wilson", rank: "Comedy Professor", level: 8 },
    bod: { name: "Prof. Michael Chen", rank: "Humor Director", level: 10 },
    superadmin: { name: "System Administrator", rank: "Super Admin", level: 99 }
  };

  const handleLogin = (role: 'student' | 'faculty' | 'bod' | 'superadmin') => {
    setCurrentRole(role);
    setIsLoggedIn(true);
  };

  const handleRoleChange = (role: 'student' | 'faculty' | 'bod' | 'superadmin') => {
    setCurrentRole(role);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    const user = mockUsers[currentRole];
    
    switch (currentRole) {
      case 'student':
        return <StudentDashboard user={user} />;
      case 'faculty':
        return <FacultyDashboard user={user} />;
      case 'bod':
        return <BODDashboard user={user} />;
      case 'superadmin':
        return <SuperAdminDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentRole={currentRole}
        currentUser={mockUsers[currentRole]}
        onRoleChange={handleRoleChange}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>

      {/* Hero Image Credit - Hidden but imported for demo */}
      <div className="hidden">
        <img src={heroImage} alt="Ramay Institute" />
      </div>
    </div>
  );
};

export default Index;