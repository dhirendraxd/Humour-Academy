import { useEffect, useState } from 'react';

export const HeroBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Global Atmospheric Sweep */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-transparent to-cyan-50/5"></div>

            {/* Arctic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-hero opacity-100"></div>

            {/* Gradient Mesh / Waves */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                {/* Large Cyan Blob (Top Left) */}
                <div className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vh] bg-blue-600/5 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>

                {/* Large Sky Blob (Top Right) */}
                <div className="absolute top-[-20%] right-[-20%] w-[100vw] h-[100vh] bg-cyan-400/5 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>

                {/* Bottom Center Depth */}
                <div className="absolute bottom-[-30%] left-[-10%] w-[120vw] h-[100vh] bg-blue-400/5 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
            </div>

            {/* Noise Texture layer for "Frost" feel */}
            <div className="absolute inset-0 bg-transparent opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--brand) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
    );
};
