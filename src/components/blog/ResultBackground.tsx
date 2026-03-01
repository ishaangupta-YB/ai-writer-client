import React from 'react';
import { cn } from "../../lib/utils";

interface ResultBackgroundProps {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    className?: string;
}

export const ResultBackground: React.FC<ResultBackgroundProps> = ({ children, headerContent, className }) => {
    return (
        <div className={cn("flex flex-col items-center w-full h-full relative", className)}>

            {/* Ornate Scroll Banner Header */}
            <div className="w-full max-w-[1000px] mt-2 md:mt-4 mx-auto px-2 sm:px-8 relative z-20 flex flex-col items-center">

                {/* Scroll Banner SVG Container - Scales beautifully */}
                <div className="w-full relative drop-shadow-2xl flex justify-center">
                    <svg viewBox="0 0 1000 250" className="w-[1000px] max-w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            {/* Gold/Bronze Gradients for the vintage ornate framework */}
                            <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#876735" />
                                <stop offset="30%" stopColor="#BA9A5C" />
                                <stop offset="50%" stopColor="#F8DA90" />
                                <stop offset="70%" stopColor="#9C773D" />
                                <stop offset="100%" stopColor="#3A2912" />
                            </linearGradient>

                            <linearGradient id="dark-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1A1C1D" />
                                <stop offset="50%" stopColor="#2A3033" />
                                <stop offset="100%" stopColor="#0A0B0C" />
                            </linearGradient>

                            {/* Warm parchment paper for the unfurled scroll body */}
                            <linearGradient id="scroll-paper" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#C9AC7A" />
                                <stop offset="15%" stopColor="#E2CA9D" />
                                <stop offset="50%" stopColor="#F5E3BD" />
                                <stop offset="85%" stopColor="#E2CA9D" />
                                <stop offset="100%" stopColor="#A68853" />
                            </linearGradient>

                            {/* Drop shadow for 3D depth of the main scroll body */}
                            <filter id="scroll-shadow" x="-5%" y="-5%" width="110%" height="120%">
                                <feDropShadow dx="0" dy="15" stdDeviation="10" floodColor="#1A1105" floodOpacity="0.5" />
                            </filter>
                        </defs>

                        {/* =========================================
                            TOP ORNATE CENTERPIECE (Dark Metal & Gold)
                            ========================================= */}
                        <g transform="translate(350, 10)">
                            {/* Dark metal backplate */}
                            <path d="M50 80 Q150 0 250 80 L300 80 Q150 -60 0 80 Z" fill="url(#dark-metal)" />

                            {/* Intricate Gold Scrollwork - Left Side */}
                            <path d="M80 80 C80 40, 130 30, 140 10 C150 -10, 110 -10, 100 20 C90 50, 40 40, 40 80" fill="none" stroke="url(#bronze-grad)" strokeWidth="8" strokeLinecap="round" />
                            <circle cx="40" cy="80" r="10" fill="url(#bronze-grad)" />

                            {/* Intricate Gold Scrollwork - Right Side */}
                            <path d="M220 80 C220 40, 170 30, 160 10 C150 -10, 190 -10, 200 20 C210 50, 260 40, 260 80" fill="none" stroke="url(#bronze-grad)" strokeWidth="8" strokeLinecap="round" />
                            <circle cx="260" cy="80" r="10" fill="url(#bronze-grad)" />

                            {/* Center Crown */}
                            <ellipse cx="150" cy="15" rx="25" ry="15" fill="url(#bronze-grad)" />
                            <circle cx="150" cy="-5" r="8" fill="url(#bronze-grad)" />
                        </g>

                        {/* =========================================
                            BOTTOM ORNATE CENTERPIECE
                            ========================================= */}
                        <g transform="translate(390, 195)">
                            <path d="M30 0 Q110 50 190 0 L220 0 Q110 80 0 0 Z" fill="url(#dark-metal)" />
                            <path d="M60 0 C60 20, 100 30, 110 50 C120 30, 160 20, 160 0" fill="none" stroke="url(#bronze-grad)" strokeWidth="6" strokeLinecap="round" />
                        </g>

                        {/* =========================================
                            THE MAIN UNFURLED PAPER SCROLL
                            ========================================= */}
                        {/* Shadow casting paper backing */}
                        <rect x="120" y="75" width="760" height="110" rx="4" fill="url(#scroll-paper)" filter="url(#scroll-shadow)" />

                        {/* Inner stroke constraint indicating paper edge */}
                        <rect x="124" y="79" width="752" height="102" fill="none" stroke="#A88B52" strokeWidth="1.5" opacity="0.6" />

                        {/* Horizontal burn/stain marks on the paper */}
                        <ellipse cx="250" cy="85" rx="40" ry="10" fill="#93723E" opacity="0.3" filter="blur(4px)" />
                        <ellipse cx="800" cy="170" rx="60" ry="15" fill="#5C421B" opacity="0.2" filter="blur(6px)" />

                        {/* =========================================
                            LEFT ROLLED CYLINDER (Spindle)
                            ========================================= */}
                        <g transform="translate(90, 50)">
                            {/* Wooden/Bronze Roller Tube */}
                            <path d="M0 20 L30 20 L30 160 L0 160 Z" fill="url(#dark-metal)" />
                            {/* Shading on cylinder */}
                            <path d="M5 20 L12 20 L12 160 L5 160 Z" fill="#4A5559" opacity="0.4" />
                            <path d="M22 20 L27 20 L27 160 L22 160 Z" fill="#0A0B0C" opacity="0.6" />

                            {/* Paper wrap around spindle */}
                            <path d="M25 30 C50 30, 50 150, 25 150 L30 150 L30 30 Z" fill="#9C773D" />

                            {/* Top Finial / Cap */}
                            <ellipse cx="15" cy="20" rx="22" ry="8" fill="url(#bronze-grad)" />
                            <ellipse cx="15" cy="10" rx="15" ry="6" fill="url(#bronze-grad)" />
                            <circle cx="15" cy="0" r="6" fill="url(#bronze-grad)" />

                            {/* Bottom Finial / Cap */}
                            <ellipse cx="15" cy="160" rx="22" ry="8" fill="url(#bronze-grad)" />
                            <ellipse cx="15" cy="170" rx="15" ry="6" fill="url(#bronze-grad)" />
                            <circle cx="15" cy="180" r="6" fill="url(#bronze-grad)" />
                        </g>

                        {/* =========================================
                            RIGHT ROLLED CYLINDER (Spindle)
                            ========================================= */}
                        <g transform="translate(880, 50)">
                            {/* Wooden/Bronze Roller Tube */}
                            <path d="M0 20 L30 20 L30 160 L0 160 Z" fill="url(#dark-metal)" />
                            {/* Shading on cylinder */}
                            <path d="M5 20 L12 20 L12 160 L5 160 Z" fill="#4A5559" opacity="0.4" />
                            <path d="M22 20 L27 20 L27 160 L22 160 Z" fill="#0A0B0C" opacity="0.6" />

                            {/* Paper wrap around spindle */}
                            <path d="M5 30 C-20 30, -20 150, 5 150 L0 150 L0 30 Z" fill="#9C773D" />

                            {/* Top Finial / Cap */}
                            <ellipse cx="15" cy="20" rx="22" ry="8" fill="url(#bronze-grad)" />
                            <ellipse cx="15" cy="10" rx="15" ry="6" fill="url(#bronze-grad)" />
                            <circle cx="15" cy="0" r="6" fill="url(#bronze-grad)" />

                            {/* Bottom Finial / Cap */}
                            <ellipse cx="15" cy="160" rx="22" ry="8" fill="url(#bronze-grad)" />
                            <ellipse cx="15" cy="170" rx="15" ry="6" fill="url(#bronze-grad)" />
                            <circle cx="15" cy="180" r="6" fill="url(#bronze-grad)" />
                        </g>
                    </svg>

                    {/* Absolute positioned container over the "Unfurled Paper" section of the SVG */}
                    {/* Using a perfect absolute center wrapper within the SVG container to guarantee horizontal alignment */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[76%] h-[44%] mt-[-1%] pointer-events-auto flex items-center justify-center relative translate-x-[2px] right-[2px]">
                            <div className="w-full flex justify-center items-center">
                                {headerContent}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main flex container that takes up the rest of the height */}
            <div className="flex-1 w-full relative z-10 flex flex-col h-full mt-4">
                {children}
            </div>
        </div>
    );
};
