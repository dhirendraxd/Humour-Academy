import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  LogOut,
  BookOpen,
  Calendar,
  Sparkles,
  LogIn,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface NavigationProps {
  currentRole?: 'student' | 'faculty';
  currentUser?: {
    name: string;
    rank: string;
    level: number;
  } | null;
  onRoleChange?: (role: 'student' | 'faculty') => void;
}

export const Navigation = ({
  currentRole: propRole,
  currentUser: propUser,
  onRoleChange
}: NavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut: onSignOut } = useAuth();

  const [scrollProgress, setScrollProgress] = useState(0);

  // Use props if provided, otherwise use auth context
  const role = propRole || (profile?.role as 'student' | 'faculty') || 'student';
  const userData = propUser || (profile ? {
    name: profile.full_name,
    rank: profile.rank || 'Member',
    level: profile.level || 1
  } : null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / 100, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await onSignOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const interpolate = (start: number, end: number) => {
    return start + (end - start) * scrollProgress;
  };

  const navItems = [
    { label: "Curriculum", path: "/curriculum", icon: BookOpen, roles: ['student', 'faculty'] },
    { label: "Faculty", path: "/faculty", icon: GraduationCap, roles: ['student'] },
    { label: "Events", path: "/events", icon: Calendar, roles: ['student', 'faculty'] },
    { label: "About", path: "/about", icon: Sparkles, roles: ['student'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <header
      className="w-full px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40 transition-all duration-300"
      style={{
        paddingTop: `${interpolate(24, 12)}px`,
        paddingBottom: `${interpolate(24, 12)}px`,
        backgroundColor: `hsl(var(--background) / ${interpolate(0.8, 0.95)})`
      }}
    >
      <div
        className="flex items-center gap-2 mr-12 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-blue-600 text-2xl transition-transform" style={{ transform: `scale(${interpolate(1, 1.2)})` }}>▲</span>
          <span
            className="overflow-hidden whitespace-nowrap transition-all duration-300 origin-left"
            style={{
              width: `${interpolate(100, 0)}%`,
              opacity: interpolate(1, 0),
              transform: `translateX(${interpolate(0, -10)}px)`
            }}
          >
            Ramay Academy
          </span>
        </div>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
        {filteredNavItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            onClick={() => navigate(item.path)}
            className={`hover:text-blue-600 transition-colors bg-transparent hover:bg-transparent ${location.pathname === item.path ? "text-blue-600" : ""
              } flex items-center gap-2`}
          >
            <item.icon
              className="w-4 h-4 transition-transform duration-300"
              style={{
                transform: `scale(${interpolate(1, 1.3)})`
              }}
            />
            <span
              className="overflow-hidden whitespace-nowrap transition-all duration-300 origin-left"
              style={{
                maxWidth: `${interpolate(100, 0)}px`,
                opacity: interpolate(1, 0)
              }}
            >
              {item.label}
            </span>
          </Button>
        ))}
        {userData && (
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className={`hover:text-blue-600 transition-colors bg-transparent hover:bg-transparent ${location.pathname === '/dashboard' ? "text-blue-600" : ""
              } flex items-center gap-2`}
          >
            <LayoutDashboard
              className="w-4 h-4 transition-transform duration-300"
              style={{
                transform: `scale(${interpolate(1, 1.3)})`
              }}
            />
            <span
              className="overflow-hidden whitespace-nowrap transition-all duration-300 origin-left"
              style={{
                maxWidth: `${interpolate(100, 0)}px`,
                opacity: interpolate(1, 0)
              }}
            >
              Dashboard
            </span>
          </Button>
        )}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        {userData ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-600/10 transition-colors">
                <Avatar className="h-10 w-10 border-2 border-transparent hover:border-blue-600 transition-all bg-background">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`}
                    alt={userData.name}
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="bg-blue-600/10 text-blue-600 font-bold">
                    {userData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData.rank} • Lvl {userData.level}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {onRoleChange && (
                <>
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
                </>
              )}

              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => navigate('/auth')}
            className="rounded-full font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-none h-10 flex items-center overflow-hidden"
            style={{
              width: `${interpolate(160, 48)}px`,
              paddingLeft: 0,
              paddingRight: 0,
              justifyContent: 'center'
            }}
          >
            <div className="flex items-center justify-center w-full relative">
              <span
                className="absolute whitespace-nowrap"
                style={{
                  opacity: interpolate(1, 0),
                  transform: `translateY(${interpolate(0, 20)}px)`
                }}
              >
                Sign In
              </span>
              <LogIn
                className="w-5 h-5 absolute"
                style={{
                  opacity: interpolate(0, 1),
                  transform: `translateY(${interpolate(20, 0)}px)`
                }}
              />
            </div>
          </Button>
        )}
      </div>
    </header>
  );
};