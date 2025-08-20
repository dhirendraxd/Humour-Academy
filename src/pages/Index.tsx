import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacultyDashboard } from "@/components/FacultyDashboard";
import { BODDashboard } from "@/components/BODDashboard";
import { SuperAdminDashboard } from "@/components/SuperAdminDashboard";
import { LoginForm } from "@/components/LoginForm";
import { HomePage } from "@/components/HomePage";
import heroImage from "@/assets/ramay-institute-hero.jpg";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
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
    setShowLogin(false);
  };

  const handleRoleChange = (role: 'student' | 'faculty' | 'bod' | 'superadmin') => {
    setCurrentRole(role);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  // Show login form if user clicked login
  if (!isLoggedIn && showLogin) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Show homepage if not logged in and not showing login
  if (!isLoggedIn) {
    return <HomePage onLoginClick={handleShowLogin} />;
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
    <div className="min-h-screen bg-gradient-background">
      <Navigation 
        currentRole={currentRole}
        currentUser={mockUsers[currentRole]}
        onRoleChange={handleRoleChange}
      />
      
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
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