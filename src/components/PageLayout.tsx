import { PublicNavigation } from "@/components/PublicNavigation";
import { ParticleField } from "@/components/ParticleField";
import { HeroBackground } from "@/components/HeroBackground";

interface PageLayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
    customNav?: React.ReactNode;
}

export const PageLayout = ({ children, showNav = true, customNav }: PageLayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-600/20 relative">
            <HeroBackground />
            <ParticleField />
            {customNav ? customNav : (showNav && <PublicNavigation />)}
            <main className="flex-grow z-10 relative">
                {children}
            </main>
        </div>
    );
};
