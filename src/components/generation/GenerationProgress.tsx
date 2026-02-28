import { useEffect, useRef } from "react";
import { useGeneration } from "../../context/GenerationContext";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";

const STAGES = [
    { id: "router", label: "Router" },
    { id: "research", label: "Research" },
    { id: "orchestrator", label: "Planner" },
    { id: "worker", label: "Writers" },
    { id: "reducer", label: "Reducer" },
];

export function GenerationProgress() {
    const { isGenerating, statusText, currentNode, progress, data, logs } = useGeneration();
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    const getStageStatus = (_stageId: string, index: number): "pending" | "current" | "complete" => {
        const currentIndex = STAGES.findIndex(s => s.id === currentNode);
        if (currentIndex === -1) {
            if (!isGenerating && statusText === "Generation complete!") return "complete";
            return index === 0 && isGenerating ? "current" : "pending";
        }
        if (index < currentIndex) return "complete";
        if (index === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
            {/* Pipeline */}
            <div className="brutal-card bg-card p-6">
                <div className="flex items-center justify-between mb-5">
                    {STAGES.map((stage, i) => (
                        <div key={stage.id} className={cn("flex items-center", i < STAGES.length - 1 ? "flex-1" : "flex-none")}>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className={cn(
                                    "w-2 h-2 transition-all duration-300",
                                    getStageStatus(stage.id, i) === "complete" && "bg-primary",
                                    getStageStatus(stage.id, i) === "current" && "bg-accent scale-150",
                                    getStageStatus(stage.id, i) === "pending" && "bg-border"
                                )} />
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors",
                                    getStageStatus(stage.id, i) === "complete" && "text-primary",
                                    getStageStatus(stage.id, i) === "current" && "text-accent font-black",
                                    getStageStatus(stage.id, i) === "pending" && "text-muted-foreground"
                                )}>
                                    {stage.label}
                                </span>
                            </div>
                            {i < STAGES.length - 1 && (
                                <div className="flex-1 px-3 -mt-4">
                                    <div className="h-px w-full bg-border relative overflow-hidden">
                                        <div className={cn(
                                            "h-full transition-all duration-700 ease-out",
                                            getStageStatus(stage.id, i) === "complete" ? "w-full bg-primary" : "w-0"
                                        )} />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <Progress value={progress} className="h-1.5 bg-muted border border-border" />
            </div>

            {/* Status */}
            <div className="space-y-1.5">
                <p className="text-base font-bold tracking-tight">{statusText}</p>
                {data.current_step && statusText !== data.current_step && (
                    <p className="font-mono text-sm text-muted-foreground">
                        {data.current_step}
                        <span className="inline-block w-1 h-3.5 bg-primary ml-1.5 animate-pulse align-middle" />
                    </p>
                )}
            </div>

            {/* Metadata */}
            {(data.mode || data.evidence_count !== undefined || (data.queries && data.queries.length > 0)) && (
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {data.mode && (
                            <span className="font-mono text-xs bg-muted px-2 py-1 border border-border">
                                <span className="text-muted-foreground">Mode</span>{" "}
                                <span className="font-bold uppercase">{data.mode.replace("_", " ")}</span>
                            </span>
                        )}
                        {data.evidence_count !== undefined && (
                            <span className="font-mono text-xs bg-muted px-2 py-1 border border-border">
                                <span className="text-muted-foreground">Sources</span>{" "}
                                <span className="font-bold">{data.evidence_count}</span>
                            </span>
                        )}
                    </div>

                    {data.queries && data.queries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {data.queries.map((q: string, i: number) => (
                                <span key={i} className="font-mono text-[11px] border border-border bg-muted/50 px-2 py-0.5">
                                    {q}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Section Progress */}
            {data.total_sections !== undefined && data.total_sections > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-bold">Writing sections</span>
                        <span className="font-mono text-xs text-muted-foreground">
                            {data.sections_done || 0} / {data.total_sections}
                        </span>
                    </div>
                    <Progress
                        value={Math.max(2, ((data.sections_done || 0) / data.total_sections) * 100)}
                        className="h-1.5 bg-muted border border-border"
                    />
                </div>
            )}

            {/* Event Stream */}
            {logs.length > 0 && (
                <div className="brutal-card border-2 border-border overflow-hidden bg-card">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Event Stream</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{logs.length}</span>
                    </div>
                    <ScrollArea className="h-[260px] w-full">
                        <div className="p-3 font-mono text-xs space-y-0.5">
                            {logs.map((log, i) => {
                                const d = new Date(log.timestamp);
                                const time = d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
                                return (
                                    <div key={i} className="flex items-start gap-3 py-1 hover:bg-muted/30 px-1 transition-colors">
                                        <span className="text-muted-foreground shrink-0 tabular-nums">{time}</span>
                                        <span className={cn(
                                            "shrink-0 uppercase font-bold text-[10px] min-w-[72px]",
                                            log.node === "system" && "text-foreground",
                                            log.node === "router" && "text-blue-600",
                                            log.node === "research" && "text-primary",
                                            log.node === "orchestrator" && "text-orange-600",
                                            log.node === "worker" && "text-accent",
                                            log.node === "reducer" && "text-destructive"
                                        )}>
                                            {log.node}
                                        </span>
                                        <span className={cn(
                                            "break-words flex-1",
                                            log.message.startsWith("Error:") ? "text-destructive" :
                                                log.message === "Generation successfully completed." ? "text-primary font-bold" :
                                                    "text-foreground/70"
                                        )}>
                                            {log.message}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={logsEndRef} />
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
