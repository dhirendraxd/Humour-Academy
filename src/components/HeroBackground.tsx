import { useEffect, useState } from 'react';

export const HeroBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Arctic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-hero opacity-100"></div>

            {/* Gradient Mesh / Waves */}
            <div className="absolute top-0 left-0 w-full h-full opacity-40">
                {/* Large Cyan Blob (Top Left) - Brighter/Icy */}
                <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>

                {/* Large Sky Blob (Top Right) */}
                <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            {/* Noise Texture layer for "Frost" feel */}
            <div className="absolute inset-0 bg-transparent opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--brand) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
    );
};
