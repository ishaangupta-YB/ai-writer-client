import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function MainContent({ children }: { children: ReactNode }) {
    return (
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background relative z-0">

            {/* Brutalist geometric decorative background elements */}
            <div className="absolute top-10 right-10 w-48 h-48 bg-secondary border-4 border-border brutal-card -z-10 animate-in spin-in-12 duration-1000 origin-center opacity-70" />
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary rounded-full border-4 border-border brutal-card -z-10 animate-pulse transition-transform opacity-70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-accent/10 border-8 border-dashed border-border/10 rounded-full -z-20 animate-[spin_120s_linear_infinite] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-destructive border-4 border-border brutal-card -z-10 transform rotate-45 opacity-60" />

            {/* Top Navigation Bar / Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b-4 border-border z-40 flex items-center justify-between px-6 shadow-brutal">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-primary text-primary-foreground transform -rotate-6 transition-transform hover:rotate-0">
                        <Sparkles className="h-5 w-5 fill-background" />
                    </div>
                    <span className="font-black tracking-widest uppercase text-2xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Agent Writer
                    </span>
                </div>
            </header>

            {/* Content wrapper with scroll container */}
            <div className="flex-1 overflow-y-auto w-full h-full relative z-10 custom-scrollbar pt-16">
                {children}
            </div>
        </main>
    );
}
