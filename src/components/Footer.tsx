import { Link } from "react-router-dom";
import { FooterParticles } from "@/components/FooterParticles";

interface FooterProps {
    intensity?: 'low' | 'high';
}

export const Footer = ({ intensity = 'low' }: FooterProps) => {
    const isHigh = intensity === 'high';

    return (
        <footer className="py-12 px-6 border-t border-blue-600/10 text-center text-sm text-muted-foreground relative overflow-hidden">
            {/* Atmospheric Gradients */}
            <div
                className={`absolute inset-0 bg-gradient-to-b from-background via-blue-900/${isHigh ? '10' : '5'} to-blue-900/${isHigh ? '20' : '10'} pointer-events-none transition-all duration-500`}
            />
            <div
                className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-600/${isHigh ? '20' : '10'} via-transparent to-transparent pointer-events-none transition-all duration-500`}
            />
            <FooterParticles />

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12 text-left relative z-10">
                <div>
                    <div className="font-bold text-foreground mb-4">Ramay Academy</div>
                    <p className="leading-relaxed">Building leaders through the power of humor since 2010.</p>
                </div>
                <div>
                    <div className="font-bold text-foreground mb-4">Programs</div>
                    <ul className="space-y-2">
                        <li><Link to="/executive-presence" className="hover:text-primary transition-colors">Executive Presence</Link></li>
                        <li><Link to="/team-dynamics" className="hover:text-primary transition-colors">Team Dynamics</Link></li>
                        <li><Link to="/storytelling" className="hover:text-primary transition-colors">Storytelling</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="font-bold text-foreground mb-4">Community</div>
                    <ul className="space-y-2">
                        <li><Link to="/alumni" className="hover:text-primary transition-colors">Alumni</Link></li>
                        <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                        <li><Link to="/open-mics" className="hover:text-primary transition-colors">Open Mics</Link></li>
                    </ul>
                </div>
                <div>
                    <div className="font-bold text-foreground mb-4">Legal</div>
                    <ul className="space-y-2">
                        <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                        <li><Link to="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-between items-center max-w-6xl mx-auto pt-8 border-t border-border/20 relative z-10">
                <p>&copy; 2024 Ramay Institute of Humour.</p>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
                    <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
                </div>
            </div>
        </footer>
    );
};
