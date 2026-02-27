import { useGeneration } from "../../context/GenerationContext";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { PipelineStep } from "./PipelineStep";
import { FileText, Search, Settings2 } from "lucide-react";

const STAGES = [
    { id: "router", label: "Router" },
    { id: "research", label: "Research" },
    { id: "orchestrator", label: "Planner" },
    { id: "worker", label: "Writers" },
    { id: "reducer", label: "Reducer" },
];

export function GenerationProgress() {
    const { isGenerating, statusText, currentNode, data } = useGeneration();

    const getStageStatus = (_stageId: string, index: number) => {
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
        <div className="flex flex-col items-center p-6 w-full max-w-3xl mx-auto space-y-8">

            {/* Pipeline */}
            <div className="w-full brutal-card bg-card p-8">
                <div className="flex justify-between items-start w-full">
                    {STAGES.map((stage, i) => (
                        <PipelineStep
                            key={stage.id}
                            id={stage.id}
                            index={i}
                            label={stage.label}
                            status={getStageStatus(stage.id, i)}
                            isLast={i === STAGES.length - 1}
                        />
                    ))}
                </div>
            </div>

            {/* Status + Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Status */}
                <div className="brutal-card bg-card p-6 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</span>
                    <h2 className="text-xl font-black tracking-tight leading-tight">
                        {statusText}
                    </h2>
                    {data.current_step && statusText !== data.current_step && (
                        <p className="font-mono text-sm text-muted-foreground bg-muted p-3 border border-border">
                            {data.current_step}
                            <span className="w-1.5 h-3.5 bg-primary inline-block ml-2 animate-pulse align-middle" />
                        </p>
                    )}
                </div>

                {/* Telemetry */}
                <Card className="brutal-card bg-card border-2 border-border">
                    <CardContent className="p-0 flex flex-col h-full">
                        <div className="border-b-2 border-border bg-muted px-4 py-2 font-bold uppercase tracking-wider text-xs flex items-center justify-between">
                            <span>Telemetry</span>
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        </div>

                        <div className="p-4 space-y-4">
                            {(data.mode || typeof data.evidence_count !== 'undefined') && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {data.mode && (
                                        <div className="flex items-center gap-2 font-mono text-sm">
                                            <Settings2 className="h-4 w-4 text-primary" />
                                            <span className="font-bold uppercase">{data.mode.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                    {data.evidence_count !== undefined && (
                                        <div className="flex items-center gap-2 font-mono text-sm">
                                            <Search className="h-4 w-4 text-accent" />
                                            <span className="font-bold">{data.evidence_count} sources</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {data.queries && data.queries.length > 0 && (
                                <div className="space-y-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Queries</span>
                                    <ScrollArea className="h-20 w-full">
                                        <div className="gap-1.5 flex flex-wrap">
                                            {data.queries.map((q: string, i: number) => (
                                                <span key={i} className="font-mono text-xs border border-border bg-muted px-2 py-1">
                                                    {q}
                                                </span>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {data.total_sections !== undefined && data.total_sections > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-bold">
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            Writing
                                        </span>
                                        <span className="font-mono">
                                            {data.sections_done || 0}/{data.total_sections}
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.max(2, ((data.sections_done || 0) / data.total_sections) * 100)}
                                        className="h-2 bg-muted border border-border"
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
