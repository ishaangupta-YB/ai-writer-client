import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function MainContent({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isBlogView = location.pathname.startsWith('/blog/');

    return (
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-transparent relative z-10">
            {/* Header */}
            {!isBlogView ? (
                <header className="flex items-center justify-between px-5 sm:px-8 h-16 border-b border-border/40 bg-background/30 backdrop-blur-sm shrink-0 relative z-50">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
                    >
                        <span className="text-xl font-display tracking-widest text-primary drop-shadow-sm">
                            Agent Writer
                        </span>
                        {location.pathname !== "/" && (
                            <span className="text-xs font-serif italic text-muted-foreground ml-2">
                                Return
                            </span>
                        )}
                    </button>

                    <a
                        href="https://twitter.com/ishaangtwt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-border/50 bg-background/40 hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-serif tracking-widest transition-all duration-300 rounded shadow-sm hover:shadow-elegantHover"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Follow me
                    </a>
                </header>
            ) : (
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[60] shrink-0">
                    <a
                        href="https://twitter.com/ishaangtwt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-primary/30 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary text-xs font-serif tracking-widest transition-all duration-300 rounded shadow-sm hover:shadow-elegantHover backdrop-blur-sm shadow-elegant"
                    >
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        Follow me
                    </a>
                </div>
            )}

            <div className="flex-1 overflow-y-auto w-full h-full pt-0 hide-scrollbar scroll-smooth">
                {children}
            </div>
        </main>
    );
}
