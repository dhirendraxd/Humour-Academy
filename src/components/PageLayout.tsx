import { Navigation } from "@/components/Navigation";
import { ParticleField } from "@/components/ParticleField";
import { HeroBackground } from "@/components/HeroBackground";
import { Footer } from "@/components/Footer";
import { SkipToContent } from "@/components/SkipToContent";
import { useAuth } from "@/components/AuthProvider";

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
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-blue-600/20 relative">
            <SkipToContent />
            <HeroBackground />
            <ParticleField />
            {customNav ? customNav : (showNav && <Navigation />)}
            <main id="main-content" className="flex-grow z-10 relative">
                {children}
            </main>
            {showFooter && <Footer intensity={footerIntensity} />}
        </div>
    );
};
