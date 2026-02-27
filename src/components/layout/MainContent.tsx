import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MainContent({ children }: { children: ReactNode }) {
    const navigate = useNavigate();

    return (
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
            <header className="sticky top-0 h-14 bg-card border-b-2 border-border z-40 flex items-center px-6 shadow-brutal">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <span className="font-black tracking-wider uppercase text-lg">
                        Agent Writer
                    </span>
                </button>
            </header>

            <div className="flex-1 overflow-y-auto w-full h-full pt-0">
                {children}
            </div>
        </main>
    );
}
