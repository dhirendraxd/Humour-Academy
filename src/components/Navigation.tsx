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
  Users,
  GraduationCap,
  User,
  LogOut,
  Crown,
  Settings,
  Star,
  BookOpen,
  Calendar,
  Sparkles
} from "lucide-react";

interface NavigationProps {
  currentRole: 'student' | 'faculty';
  currentUser: {
    name: string;
    rank: string;
    level: number;
  } | null;
  onRoleChange: (role: 'student' | 'faculty') => void;
}

import { useAuth } from "@/components/AuthProvider";

export const Navigation = ({ currentRole, currentUser, onRoleChange }: NavigationProps) => {
  const navigate = useNavigate();
  const { signOut: onSignOut } = useAuth();
  const location = useLocation();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await onSignOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="w-full py-6 px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40 mb-8 transition-all duration-300">
      <div
        className="flex items-center gap-2 mr-12 cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-blue-600 text-2xl">▲</span>
          Ramay Academy
        </div>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/curriculum')}
          className={`hover:text-blue-600 transition-colors ${location.pathname === '/curriculum' ? 'text-blue-600' : ''}`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Curriculum
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/faculty')}
          className={`hover:text-blue-600 transition-colors ${location.pathname === '/faculty' ? 'text-blue-600' : ''}`}
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          Faculty
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className={`hover:text-blue-600 transition-colors ${location.pathname === '/events' ? 'text-blue-600' : ''}`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Events
        </Button>
        <Button
          variant="ghost"
          onClick={() => navigate('/about')}
          className={`hover:text-blue-600 transition-colors ${location.pathname === '/about' ? 'text-blue-600' : ''}`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          About
        </Button>
      </nav>

      <div className="ml-auto flex items-center gap-4">
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-600/10 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-transparent hover:border-blue-600 transition-all bg-background">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="bg-blue-600/10 text-blue-600 font-bold">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.rank} • Lvl {currentUser.level}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onRoleChange('student')}>
                <Users className="mr-2 h-4 w-4" />
                Student View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRoleChange('faculty')}>
                <GraduationCap className="mr-2 h-4 w-4" />
                Teacher View
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        )}
      </div>

      <ProfileEditDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </header>
  );
};