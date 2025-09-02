import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
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
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  currentRole: 'student' | 'faculty' | 'bod';
  currentUser: {
    name: string;
    rank: string;
    level: number;
  } | null;
  onRoleChange: (role: 'student' | 'faculty' | 'bod') => void;
}

export const Navigation = ({ currentRole, currentUser, onRoleChange }: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'faculty': return <Star className="h-4 w-4" />;
      case 'bod': return <Crown className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = () => {
    const variants = {
      student: 'bg-gradient-secondary text-secondary-foreground shadow-button',
      faculty: 'bg-gradient-primary text-primary-foreground shadow-button', 
      bod: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-button'
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
              variant={activeTab === '/' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('/');
                navigate('/');
              }}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>

            <Button
              variant={activeTab === '/faculty' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('/faculty');
                navigate('/faculty');
              }}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <Star className="h-4 w-4" />
              <span>Faculty</span>
            </Button>

            <Button
              variant={activeTab === '/students' ? 'default' : 'ghost'}
              onClick={() => {
                setActiveTab('/students');
                navigate('/students');
              }}
              className="flex items-center space-x-2 backdrop-blur-sm"
            >
              <GraduationCap className="h-4 w-4" />
              <span>Students</span>
            </Button>

          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground">{currentUser.rank || 'Member'}</div>
                </div>
                {getRoleBadge()}
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-10 w-10 shadow-glass border-2 border-border/20">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                  {currentUser && currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : '?'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center space-x-1">
                <ProfileEditDialog />
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                      navigate('/auth');
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};