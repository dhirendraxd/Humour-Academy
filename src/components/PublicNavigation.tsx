import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const PublicNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "Curriculum", path: "/curriculum" },
        { label: "Faculty", path: "/faculty" },
        { label: "Events", path: "/events" },
        { label: "About", path: "/about" },
    ];

    return (
        <header className="w-full py-6 px-6 md:px-12 lg:px-16 flex items-center bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border/40">
            <div
                className="flex items-center gap-2 mr-12 cursor-pointer"
                onClick={() => navigate('/')}
            >
                <div className="text-xl font-bold tracking-tight flex items-center gap-2">
                    <span className="text-blue-600 text-2xl">▲</span>
                    Ramay Academy
                </div>
            </div>

            <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground items-center">
                {navItems.map((item) => (
                    <Button
                        key={item.path}
                        variant="ghost"
                        onClick={() => navigate(item.path)}
                        className={`hover:text-blue-600 transition-colors bg-transparent hover:bg-transparent ${location.pathname === item.path ? "text-blue-600" : ""
                            }`}
                    >
                        {item.label}
                    </Button>
                ))}
            </nav>

            <div className="ml-auto">
                <Button
                    onClick={() => navigate('/auth')}
                    className="rounded-full px-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-opacity shadow-none h-10"
                >
                    Student Portal
                </Button>
            </div>
        </header>
    );
};
