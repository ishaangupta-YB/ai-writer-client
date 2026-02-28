import { ReactNode } from "react";  
export function MainContent({ children }: { children: ReactNode }) {

    return (
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-background">
            <div className="flex-1 overflow-y-auto w-full h-full pt-0">
                {children}
            </div>
        </main>
    );
}
