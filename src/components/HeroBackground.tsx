import { useEffect, useState } from 'react';

export const HeroBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
            {/* Gradient Mesh / Waves */}
            <div className="absolute top-0 left-0 w-full h-full opacity-60">
                {/* Large Blue Blob (Top Left) */}
                <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob opacity-70"></div>

                {/* Large Sky Blob (Top Right) */}
                <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-sky-400/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 opacity-70"></div>

                {/* Deep Blue Blob (Bottom Left) */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 opacity-70"></div>

                {/* Center/Random Ocean Accent */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-sky-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-6000 opacity-60"></div>
            </div>

            {/* Noise Texture layer for "organic" feel (Optional, keeping it clean for now) */}
            <div className="absolute inset-0 bg-transparent" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.1 }}></div>
        </div>
    );
};
