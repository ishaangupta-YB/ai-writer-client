import React from 'react';
import { cn } from "@/lib/utils";

interface ParchmentBackgroundProps {
    children: React.ReactNode;
    className?: string;
    showQuill?: boolean;
}

export const ParchmentBackground: React.FC<ParchmentBackgroundProps> = ({ children, className, showQuill = true }) => {
    return (
        <div className={cn("relative min-h-screen w-full overflow-hidden bg-[#E8D69A]", className)}>
            {/*
        Parchment Texture Layers
        1. Base color
        2. SVG Filter for turbulence (paper grain)
        3. Vignette (radial gradient for darker edges)
        4. Grunge/Cracks elements
      */}

            {/* SVG Turbulence Filter for Paper Texture */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-multiply" style={{ zIndex: 0 }}>
                <filter id="parchment-texture">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                    {/* Convert noise to grayscale and adjust opacity */}
                    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.25 0" in="noise" result="coloredNoise" />
                </filter>
                <filter id="distort">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.15" numOctaves="3" result="waves" />
                    <feDisplacementMap in="SourceGraphic" in2="waves" scale="10" xChannelSelector="R" yChannelSelector="G" />
                </filter>
                <rect width="100%" height="100%" filter="url(#parchment-texture)" fill="#D4B670" />
            </svg>

            {/* Vignette Effect (Darker/Burnt Edges) */}
            <div className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(150, 100, 40, 0.4) 80%, rgba(90, 50, 15, 0.7) 130%)',
                    zIndex: 1
                }}
            />

            {/* Vintage Grunge, Cracks, and Folds */}
            <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.15] mix-blend-multiply" preserveAspectRatio="none" style={{ zIndex: 1 }}>
                {/* Fold down the middle and sides */}
                <line x1="500" y1="0" x2="510" y2="1000" stroke="#4a3621" strokeWidth="2" filter="url(#distort)" opacity="0.4" vectorEffect="non-scaling-stroke" />
                <line x1="495" y1="0" x2="500" y2="1000" stroke="#fff" strokeWidth="1" filter="url(#distort)" opacity="0.2" vectorEffect="non-scaling-stroke" />

                <line x1="150" y1="0" x2="140" y2="1000" stroke="#3a2510" strokeWidth="1.5" filter="url(#distort)" opacity="0.25" vectorEffect="non-scaling-stroke" />
                <line x1="850" y1="0" x2="860" y2="1000" stroke="#3a2510" strokeWidth="1.5" filter="url(#distort)" opacity="0.2" vectorEffect="non-scaling-stroke" />

                {/* Random organic cracks */}
                <path d="M 0 150 Q 150 200 300 180 T 600 250" stroke="#3a2510" fill="none" strokeWidth="1.5" filter="url(#distort)" opacity="0.5" vectorEffect="non-scaling-stroke" />
                <path d="M 800 0 Q 750 150 820 300 T 780 600" stroke="#3a2510" fill="none" strokeWidth="2" filter="url(#distort)" opacity="0.4" vectorEffect="non-scaling-stroke" />
                <path d="M 1000 700 Q 800 750 700 850 T 500 1000" stroke="#221508" fill="none" strokeWidth="1" filter="url(#distort)" opacity="0.6" vectorEffect="non-scaling-stroke" />

                {/* Additional heavy cracks for burnt look */}
                <path d="M 100 0 Q 150 100 120 250 T 200 400" stroke="#221105" fill="none" strokeWidth="2" filter="url(#distort)" opacity="0.5" vectorEffect="non-scaling-stroke" />
                <path d="M 0 800 Q 200 780 300 850 T 400 1000" stroke="#1c0e04" fill="none" strokeWidth="2.5" filter="url(#distort)" opacity="0.4" vectorEffect="non-scaling-stroke" />
                <path d="M 1000 200 Q 850 300 900 450 T 800 650" stroke="#3d2310" fill="none" strokeWidth="1.5" filter="url(#distort)" opacity="0.5" vectorEffect="non-scaling-stroke" />

                {/* Ink blotches / smudges */}
                <circle cx="150" cy="800" r="40" fill="#2c1f12" filter="url(#distort)" opacity="0.15" />
                <circle cx="850" cy="100" r="80" fill="#3d2a17" filter="url(#distort)" opacity="0.1" />
                <circle cx="50" cy="200" r="20" fill="#1c130b" filter="url(#distort)" opacity="0.2" />
                <circle cx="950" cy="850" r="60" fill="#221105" filter="url(#distort)" opacity="0.12" />
            </svg>

            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                    background: `
               repeating-linear-gradient(to bottom, transparent, transparent 15px, rgba(200, 170, 110, 0.15) 16px, transparent 25px),
               repeating-linear-gradient(to right, transparent, transparent 50px, rgba(160, 120, 70, 0.1) 51px, transparent 65px)
             `,
                    zIndex: 1
                }}
            />

            {/* The Quill SVG - Hidden on smaller screens, scaled gracefully */}
            {showQuill && (
                <div className="absolute right-[-10%] md:right-[0%] lg:right-[5%] top-[10%] h-[80%] max-h-[800px] w-auto pointer-events-none hidden sm:block opacity-30 md:opacity-100"
                    style={{ zIndex: 2, aspectRatio: '200/800' }}>
                    <svg viewBox="0 0 200 800" className="w-full h-full drop-shadow-2xl quill-animation" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Shadow */}
                        <path d="M110 750 C120 780, 130 790, 140 780 C150 770, 160 700, 140 650 C120 600, 110 500, 110 400 C110 300, 100 200, 130 150 C160 100, 170 50, 150 30 C130 10, 100 20, 90 40 C80 60, 90 100, 70 150 C50 200, 40 300, 50 400 C60 500, 70 600, 80 650 C90 700, 100 720, 110 750 Z"
                            fill="rgba(0,0,0,0.3)" filter="url(#shadow-blur)" transform="translate(15, 15)" />

                        <defs>
                            <filter id="shadow-blur">
                                <feGaussianBlur stdDeviation="12" />
                            </filter>

                            <filter id="roughen">
                                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
                            </filter>

                            {/* Gold Gradient for Handle - Darker, more tarnished */}
                            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8A6E35" />
                                <stop offset="25%" stopColor="#C6A863" />
                                <stop offset="50%" stopColor="#5C4210" />
                                <stop offset="75%" stopColor="#A88B42" />
                                <stop offset="100%" stopColor="#4A340C" />
                            </linearGradient>

                            {/* Feather Gradient - Richer, darker teal/emerald */}
                            <linearGradient id="feather-grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1A2016" />
                                <stop offset="20%" stopColor="#6B8E6D" />
                                <stop offset="40%" stopColor="#107C7D" />
                                <stop offset="70%" stopColor="#0B4B4B" />
                                <stop offset="100%" stopColor="#050C0E" />
                            </linearGradient>
                        </defs>

                        {/* Quill Geometry with #roughen filter for aged look */}
                        <g filter="url(#roughen)">
                            {/* Feather Base (Dark silhouette/underlayer) */}
                            <path d="M100 480
                   C60 600, 30 700, 80 770
                   C100 790, 110 790, 120 780
                   C160 740, 160 620, 100 480 Z"
                                fill="#050C0E" />

                            {/* Feather Main Body */}
                            <path d="M100 480
                   C70 550, 40 680, 85 765
                   C100 795, 115 780, 120 760
                   C150 680, 140 550, 100 480 Z"
                                fill="url(#feather-grad2)" />

                            {/* Feather Barbs (Detailed texture) */}
                            <g stroke="#128A89" strokeWidth="1" opacity="0.6">
                                <path d="M100 490 Q80 520 60 550" />
                                <path d="M100 500 Q75 540 50 580" />
                                <path d="M100 510 Q70 560 45 610" />
                                <path d="M100 520 Q70 580 40 640" />
                                <path d="M100 540 Q70 610 50 680" />
                                <path d="M100 560 Q75 640 60 710" />
                                <path d="M100 580 Q85 670 70 740" />

                                <path d="M100 490 Q120 520 130 550" />
                                <path d="M100 510 Q125 550 140 590" />
                                <path d="M100 530 Q130 580 145 630" />
                                <path d="M100 550 Q130 610 145 670" />
                                <path d="M100 570 Q125 640 135 710" />
                            </g>

                            <g stroke="#062E30" strokeWidth="1.5" opacity="0.8">
                                <path d="M98 600 Q70 680 75 750" />
                                <path d="M100 620 Q80 690 85 750" />
                                <path d="M100 650 Q110 700 115 740" />
                            </g>

                            {/* Feather Stem (Rachis) */}
                            <path d="M100 460 Q98 620 95 780" stroke="#030A0B" strokeWidth="3" fill="none" />
                            <path d="M101 460 Q99 620 96 780" stroke="#0C3435" strokeWidth="1" fill="none" />

                            {/* Ink stain at bottom */}
                            <ellipse cx="95" cy="780" rx="4" ry="10" fill="#050604" transform="rotate(-15 95 780)" />

                            {/* Gold Handle Assembly */}
                            <g transform="translate(0, -20)">
                                {/* Nib */}
                                <path d="M100 50 L90 120 L100 140 L110 120 Z" fill="#5C4210" />
                                <path d="M100 55 L95 115 L100 135 L105 115 Z" fill="url(#gold-gradient)" />
                                <line x1="100" y1="90" x2="100" y2="135" stroke="#2A1B0A" strokeWidth="1" />
                                <circle cx="100" cy="110" r="2" fill="#2A1B0A" />

                                {/* Handle Base (connects nib to main body) */}
                                <path d="M85 140 C85 130, 115 130, 115 140 C120 160, 110 170, 100 170 C90 170, 80 160, 85 140 Z" fill="url(#gold-gradient)" />
                                <path d="M82 155 Q100 160 118 155" stroke="#3D2A0C" strokeWidth="2" fill="none" />

                                {/* Main Handle Body (The bone/gold looking part) */}
                                <path d="M90 170
                     C85 200, 92 250, 93 300
                     C94 350, 85 400, 88 430
                     C92 450, 108 450, 112 430
                     C115 400, 106 350, 107 300
                     C108 250, 115 200, 110 170 Z"
                                    fill="url(#gold-gradient)" />

                                {/* 3D Shading lines for handle */}
                                <path d="M93 170 C90 250, 95 350, 95 430" stroke="#D1AB57" strokeWidth="2" opacity="0.4" fill="none" />
                                <path d="M107 170 C109 250, 105 350, 105 430" stroke="#3D2A0C" strokeWidth="3" opacity="0.6" fill="none" />

                                {/* Horizontal rings/details on handle */}
                                <ellipse cx="100" cy="220" rx="12" ry="3" fill="#C6A863" />
                                <ellipse cx="100" cy="223" rx="12" ry="3" fill="#4A340C" opacity="0.8" />

                                <ellipse cx="100" cy="320" rx="11" ry="3" fill="#C6A863" />
                                <ellipse cx="100" cy="323" rx="11" ry="3" fill="#4A340C" opacity="0.8" />

                                {/* The ornate center clamp piece holding the feather (Fleur-de-lis inspired) */}
                                <g transform="translate(100, 450)">
                                    {/* Central jewel/nodule */}
                                    <ellipse cx="0" cy="0" rx="18" ry="8" fill="url(#gold-gradient)" />
                                    <ellipse cx="0" cy="0" rx="14" ry="4" fill="#D1AB57" />

                                    {/* Top flourishes */}
                                    <path d="M -5 -5 C -15 -25, -25 -10, 0 -15 C 25 -10, 15 -25, 5 -5" fill="url(#gold-gradient)" stroke="#3D2A0C" strokeWidth="1" />

                                    {/* Bottom flourishes */}
                                    <path d="M -8 5 C -25 25, -15 35, 0 15 C 15 35, 25 25, 8 5" fill="url(#gold-gradient)" stroke="#3D2A0C" strokeWidth="1" />

                                    {/* Little red gems - Tarnished */}
                                    <circle cx="0" cy="-6" r="2" fill="#5A0000" />
                                    <circle cx="-12" cy="15" r="1.5" fill="#5A0000" />
                                    <circle cx="12" cy="15" r="1.5" fill="#5A0000" />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            )}

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full min-h-screen">
                {children}
            </div>
        </div>
    );
};
