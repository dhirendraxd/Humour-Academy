import { useEffect, useState } from 'react';

export const HeroBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
            {/* Arctic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-900 to-black opacity-10"></div>

            {/* Gradient Mesh / Waves */}
            <div className="absolute top-0 left-0 w-full h-full opacity-60">
                {/* Large Cyan Blob (Top Left) - Brighter/Icy */}
                <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-cyan-400/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob opacity-60"></div>

                {/* Large Sky Blob (Top Right) */}
                <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-sky-300/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 opacity-60"></div>

                {/* Deep Ice Blue Blob (Bottom Left) */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 opacity-60"></div>

                {/* Center/Random Ocean Accent - White/Cyber */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-cyan-100/10 rounded-full mix-blend-overlay filter blur-[100px] animate-blob animation-delay-6000 opacity-50"></div>
            </div>

            {/* Noise Texture layer for "Frost" feel */}
            <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>
        </div>
    );
};
