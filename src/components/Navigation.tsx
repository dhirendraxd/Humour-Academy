import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Home, 
  Users, 
  GraduationCap, 
  User, 
  LogOut, 
  Shield,
  Crown,
  Star
} from "lucide-react";

interface NavigationProps {
  currentRole: 'student' | 'faculty' | 'bod' | 'superadmin';
  currentUser: {
    name: string;
    rank: string;
    level: number;
  };
  onRoleChange: (role: 'student' | 'faculty' | 'bod' | 'superadmin') => void;
}

export const Navigation = ({ currentRole, currentUser, onRoleChange }: NavigationProps) => {
  const [activeTab, setActiveTab] = useState('home');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'faculty': return <Star className="h-4 w-4" />;
      case 'bod': return <Crown className="h-4 w-4" />;
      case 'superadmin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = () => {
    const variants = {
      student: 'bg-gradient-secondary text-secondary-foreground shadow-button',
      faculty: 'bg-gradient-primary text-primary-foreground shadow-button', 
      bod: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-button',
      superadmin: 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-button'
    };
    
    return (
      <Badge className={`${variants[currentRole]} border-0 backdrop-blur-sm`}>
        {getRoleIcon(currentRole)}
        <span className="ml-1 capitalize">{currentRole}</span>
      </Badge>
    );
  };

  return (
    <nav className="bg-gradient-glass/50 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Ramay Institute
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant={activeTab === 'home' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>

            <Button
              variant={activeTab === 'faculty' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('faculty')}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <Star className="h-4 w-4" />
              <span>Faculty</span>
            </Button>

            <Button
              variant={activeTab === 'students' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('students')}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Students</span>
            </Button>

            {currentRole === 'superadmin' && (
              <Button
                variant={activeTab === 'requests' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('requests')}
                className="flex items-center space-x-2 backdrop-blur-sm"
              >
                <Shield className="h-4 w-4" />
                <span>Requests</span>
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
                <div className="text-xs text-muted-foreground">Level {currentUser.level}</div>
              </div>
              
              <Avatar className="h-8 w-8 shadow-glass">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              {getRoleBadge()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};