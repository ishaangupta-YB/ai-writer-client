import { GitFork, Search, LayoutList, PenTool, Combine, Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface PipelineStepProps {
    id: string;
    index: number;
    label: string;
    status: "pending" | "current" | "complete";
    isLast: boolean;
}

const ICONS: Record<string, React.ElementType> = {
    router: GitFork,
    research: Search,
    orchestrator: LayoutList,
    worker: PenTool,
    reducer: Combine,
};

export function PipelineStep({ id, label, status, isLast }: PipelineStepProps) {
    const Icon = ICONS[id] || Combine;

    return (
        <div className={cn("flex items-center", isLast ? "flex-none" : "flex-1")}>
            <div className="flex flex-col items-center gap-3 group relative z-10">
                <div
                    className={cn(
                        "relative flex h-14 w-14 items-center justify-center border-4 border-border transition-all duration-300 overflow-hidden",
                        status === "complete" && "bg-secondary text-secondary-foreground shadow-brutal",
                        status === "current" && "bg-primary text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-110 -rotate-6",
                        status === "pending" && "bg-muted text-muted-foreground shadow-none translate-y-2 translate-x-2"
                    )}
                >
                    {status === "complete" ? (
                        <Check className="h-7 w-7 stroke-[3px]" />
                    ) : (
                        <Icon className="h-6 w-6 stroke-[2.5px]" />
                    )}

                    {/* Brutalist diagonal stripes for current state */}
                    {status === "current" && (
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[length:10px_10px] animate-[slide_1s_linear_infinite]" />
                    )}
                </div>

                <div className={cn(
                    "absolute -bottom-10 border-2 border-border px-2 py-1 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all",
                    status === "complete" && "bg-secondary text-secondary-foreground shadow-brutal translate-y-0",
                    status === "current" && "bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3 scale-110 origin-top",
                    status === "pending" && "bg-background text-muted-foreground opacity-50 translate-y-2 translate-x-2"
                )}>
                    {label}
                </div>
            </div>

            {!isLast && (
                <div className="flex-1 px-1 mb-8">
                    <div className="h-2 w-full bg-border border-y-2 border-foreground relative overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000 ease-in-out font-mono text-[8px] flex items-center overflow-hidden whitespace-nowrap text-background uppercase tracking-widest",
                                status === "complete" ? "w-full bg-foreground" : "w-0 bg-transparent"
                            )}
                        >
              //////////////////////
                        </div>
                        {/* Dashed background for pending path */}
                        {status !== "complete" && (
                            <div className="absolute inset-0 border-t-2 border-dashed border-muted-foreground opacity-30 z-[-1]" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
