import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Calendar, Sparkles, User, LogIn } from "lucide-react";

export const PublicNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Calculate progress from 0 to 1 over the first 100px of scroll
            const progress = Math.min(scrollY / 100, 1);
            setScrollProgress(progress);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: "Curriculum", path: "/curriculum", icon: BookOpen },
        { label: "Faculty", path: "/faculty", icon: GraduationCap },
        { label: "Events", path: "/events", icon: Calendar },
        { label: "About", path: "/about", icon: Sparkles },
    ];

    // Helper to interpolate values
    const interpolate = (start: number, end: number) => {
        return start + (end - start) * scrollProgress;
    };

    return (
        <header
            className="w-full px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40 transition-all duration-300"
            style={{
                paddingTop: `${interpolate(24, 12)}px`,
                paddingBottom: `${interpolate(24, 12)}px`,
                backgroundColor: `hsl(var(--background) / ${interpolate(0.8, 0.95)})` // Slightly more opaque on scroll
            }}
        >
            <div
                className="flex items-center gap-2 mr-12 cursor-pointer"
                onClick={() => navigate('/')}
            >
                {/* Logo Transformation */}
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
                {navItems.map((item) => (
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
                                transform: `scale(${interpolate(1, 1.3)})` // Enlarge icon
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
            </nav>

            <div className="ml-auto">
                <Button
                    onClick={() => navigate('/auth')}
                    className="rounded-full font-medium bg-foreground text-background hover:bg-foreground/90 transition-all shadow-none h-10 flex items-center overflow-hidden"
                    style={{
                        width: `${interpolate(160, 48)}px`, // Shrink width from full button to circle
                        paddingLeft: 0,
                        paddingRight: 0,
                        justifyContent: 'center'
                    }}
                >
                    <div className="flex items-center justify-center w-full relative">
                        {/* Text fades out */}
                        <span
                            className="absolute whitespace-nowrap"
                            style={{
                                opacity: interpolate(1, 0),
                                transform: `translateY(${interpolate(0, 20)}px)`
                            }}
                        >
                            Student Portal
                        </span>

                        {/* Icon fades in/slides up */}
                        <LogIn
                            className="w-5 h-5 absolute"
                            style={{
                                opacity: interpolate(0, 1),
                                transform: `translateY(${interpolate(20, 0)}px)`
                            }}
                        />
                    </div>
                </Button>
            </div>
        </header>
    );
};
