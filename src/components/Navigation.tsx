import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileEditDialog } from "@/components/ProfileEditDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  GraduationCap,
  User,
  LogOut,
  Shield,
  Crown,
  Star,
  Settings,
  ChevronDown
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

import { useAuth } from "@/components/AuthProvider";

export const Navigation = ({ currentRole, currentUser, onRoleChange }: NavigationProps) => {
  const navigate = useNavigate();
  const { signOut: onSignOut } = useAuth(); // Get signOut from context
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
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <span>▲</span> Ramay Institute
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
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2 hover:bg-accent/50">
                  <Avatar className="h-9 w-9 shadow-glass border-2 border-border/20">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                      {currentUser && currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('') : '?'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 bg-background/95 backdrop-blur-sm border-border/50">
                {currentUser && (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                        <p className="text-xs text-muted-foreground">{currentUser.rank || 'Member'}</p>
                        <div className="pt-1">
                          {getRoleBadge()}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                )}

                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <ProfileEditDialog triggerAsMenuItem={true} />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      // await supabase.auth.signOut();
                      await onSignOut(); // Assuming we pass this or use useAuth
                      navigate('/auth');
                    } catch (error) {
                      console.error('Error signing out:', error);
                    }
                  }}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};