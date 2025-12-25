import { useEffect, useState } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
}

export const FooterParticles = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const particleCount = 20; // Fewer particles for footer

        const generateParticles = () => {
            const newParticles: Particle[] = [];
            for (let i = 0; i < particleCount; i++) {
                newParticles.push({
                    id: i,
                    x: Math.random() * 100, // %
                    y: Math.random() * 100, // %
                    size: Math.random() * 6 + 2, // 2-8px (Bubbles)
                    speed: Math.random() * 0.2 + 0.1, // Slow rise
                    opacity: Math.random() * 0.3 + 0.1,
                });
            }
            setParticles(newParticles);
        };

        generateParticles();

        const animateParticles = () => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    let newY = particle.y - particle.speed;
                    if (newY < -10) {
                        newY = 110; // Reset to bottom
                        return {
                            ...particle,
                            y: newY,
                            x: Math.random() * 100
                        };
                    }
                    return {
                        ...particle,
                        y: newY,
                    };
                })
            );
        };

        const interval = setInterval(animateParticles, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute rounded-full bg-blue-500 blur-[1px] transition-all duration-1000 ease-linear"
                    style={{
                        left: `${particle.x}%`,
                        top: `${particle.y}%`,
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        opacity: particle.opacity,
                    }}
                />
            ))}
        </div>
    );
};
