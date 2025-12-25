import { PublicNavigation } from "@/components/PublicNavigation";
import { ParticleField } from "@/components/ParticleField";
import { HeroBackground } from "@/components/HeroBackground";
import { Footer } from "@/components/Footer";

interface PageLayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
    showFooter?: boolean;
    footerIntensity?: 'low' | 'high';
    customNav?: React.ReactNode;
}

export const PageLayout = ({
    children,
    showNav = true,
    showFooter = true,
    footerIntensity = 'high', // Default to high for "other pages"
    customNav
}: PageLayoutProps) => {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-600/20 relative">
            <HeroBackground />
            <ParticleField />
            {customNav ? customNav : (showNav && <PublicNavigation />)}
            <main className="flex-grow z-10 relative">
                {children}
            </main>
            {showFooter && <Footer intensity={footerIntensity} />}
        </div>
    );
};
