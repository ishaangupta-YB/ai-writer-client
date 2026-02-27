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
            <div className="flex flex-col items-center gap-2 relative z-10">
                <div
                    className={cn(
                        "flex h-12 w-12 items-center justify-center border-2 border-border transition-all duration-300",
                        status === "complete" && "bg-primary text-primary-foreground shadow-brutal",
                        status === "current" && "bg-accent text-accent-foreground shadow-brutalHover scale-110",
                        status === "pending" && "bg-muted text-muted-foreground"
                    )}
                >
                    {status === "complete" ? (
                        <Check className="h-5 w-5 stroke-[3px]" />
                    ) : (
                        <Icon className="h-5 w-5 stroke-[2px]" />
                    )}
                </div>

                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                    status === "complete" && "text-primary",
                    status === "current" && "text-accent font-black",
                    status === "pending" && "text-muted-foreground"
                )}>
                    {label}
                </span>
            </div>

            {!isLast && (
                <div className="flex-1 px-2 -mt-6">
                    <div className="h-0.5 w-full bg-border relative overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-700 ease-out",
                                status === "complete" ? "w-full bg-primary" : "w-0"
                            )}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
