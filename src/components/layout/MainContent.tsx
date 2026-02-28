import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function MainContent({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
            {/* Header */}
            <header className="flex items-center justify-between px-5 sm:px-8 h-14 border-b-2 border-border bg-card shrink-0">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                >
                    <span className="text-base font-black uppercase tracking-tight">
                        Agent Writer
                    </span>
                    {location.pathname !== "/" && (
                        <span className="text-[10px] font-mono text-muted-foreground ml-1">
                            ← back
                        </span>
                    )}
                </button>

                <a
                    href="https://twitter.com/ishaangtwt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:-translate-y-0.5 transition-all"
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Follow me
                </a>
            </header>

            <div className="flex-1 overflow-y-auto w-full h-full pt-0">
                {children}
            </div>
        </main>
    );
}
