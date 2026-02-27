import { useGeneration } from "../../context/GenerationContext";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { PipelineStep } from "./PipelineStep";
import { FileText, Search, Settings2, Image as ImageIcon } from "lucide-react";

const STAGES = [
    { id: "router", label: "Router" },
    { id: "research", label: "Research" },
    { id: "orchestrator", label: "Planner" },
    { id: "worker", label: "Writers" },
    { id: "reducer", label: "Reducer" },
];

export function GenerationProgress() {
    const { isGenerating, statusText, currentNode, data } = useGeneration();

    const getStageStatus = (stageId: string, index: number) => {
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
        <div className="flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto h-full space-y-16 animate-in slide-in-from-bottom-12 duration-700 ease-out-expo">

            {/* Visual Pipeline */}
            <div className="w-full relative px-6 brutal-card bg-card p-12 overflow-visible">
                {/* Decorative brutalist elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-destructive border-4 border-border rounded-full z-20 shadow-brutal" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-accent border-4 border-border z-20 shadow-[4px_4px_0_rgba(0,0,0,1)] rotate-45" />

                <div className="flex justify-between items-center w-full relative z-10 pt-4 pb-12">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* Status Text Area */}
                <div className="text-left space-y-4 brutal-card bg-secondary text-secondary-foreground p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] opacity-20 transform rotate-12 transition-transform group-hover:scale-150" />

                    <div className="inline-block border-4 border-border bg-background text-foreground px-3 py-1 font-mono font-bold text-sm uppercase shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-2 mb-2">
                        System Status
                    </div>

                    <h2 className="text-3xl font-black uppercase tracking-tighter leading-none relative z-10 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        {statusText}
                    </h2>
                    {data.current_step && statusText !== data.current_step && (
                        <p className="font-mono text-sm font-bold bg-background/80 text-foreground p-3 border-2 border-border border-dashed relative z-10">
                            {'>'} {data.current_step}
                            <span className="w-2 h-4 bg-foreground inline-block ml-2 animate-pulse align-middle" />
                        </p>
                    )}
                </div>

                {/* Details Card */}
                <Card className="brutal-card bg-card border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    <CardContent className="p-0 flex flex-col h-full">
                        {/* Header */}
                        <div className="border-b-4 border-border bg-accent text-accent-foreground p-3 font-bold uppercase tracking-widest text-sm flex items-center justify-between">
                            <span>Telemetry</span>
                            <span className="w-3 h-3 rounded-full bg-destructive border-2 border-border animate-pulse" />
                        </div>

                        <div className="p-6 grid gap-6 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px]">
                            {/* Mode & Basic Info */}
                            {(data.mode || typeof data.evidence_count !== 'undefined') && (
                                <div className="flex flex-wrap items-center gap-4 border-4 border-border p-3 bg-background">
                                    {data.mode && (
                                        <div className="flex items-center gap-2 font-mono font-bold text-sm">
                                            <Settings2 className="h-5 w-5 bg-primary text-primary-foreground border-2 border-border p-0.5" />
                                            MODE: <span className="uppercase text-primary">{data.mode.replace('_', ' ')}</span>
                                        </div>
                                    )}
                                    {data.evidence_count !== undefined && (
                                        <div className="flex items-center gap-2 font-mono font-bold text-sm">
                                            <Search className="h-5 w-5 bg-secondary text-secondary-foreground border-2 border-border p-0.5" />
                                            SRC_COUNT: <span className="uppercase text-secondary text-lg">{data.evidence_count}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Research Queries */}
                            {data.queries && data.queries.length > 0 && (
                                <div className="space-y-2 border-4 border-border bg-background p-3">
                                    <span className="text-xs font-black uppercase flex items-center gap-2 bg-foreground text-background inline-block px-2 py-0.5 tracking-wider">
                                        <Search className="h-3 w-3 inline" /> Active_Queries
                                    </span>
                                    <ScrollArea className="h-24 w-full border-2 border-border bg-muted/50 p-2">
                                        <div className="gap-2 flex flex-wrap">
                                            {data.queries.map((q: string, i: number) => (
                                                <div key={i} className="font-mono text-xs font-bold border-2 border-border bg-card px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all cursor-default">
                                                    {q}
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </div>
                            )}

                            {/* Writers Progress */}
                            {data.total_sections !== undefined && data.total_sections > 0 && (
                                <div className="space-y-2 border-4 border-border p-4 bg-primary text-primary-foreground shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-1 transform mt-4">
                                    <div className="flex items-center justify-between font-black uppercase text-sm tracking-wider">
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" /> Write_Operation
                                        </span>
                                        <span className="text-lg bg-background text-foreground px-2 border-2 border-border">
                                            {data.sections_done || 0}/{data.total_sections}
                                        </span>
                                    </div>
                                    <Progress
                                        value={Math.max(2, ((data.sections_done || 0) / data.total_sections) * 100)}
                                        className="h-4 bg-background border-2 border-border rounded-none shadow-[2px_2px_0_rgba(0,0,0,1)]"
                                    />
                                </div>
                            )}

                            {/* Image Generation status */}
                            {data.images_planned !== undefined && (
                                <div className="flex items-center gap-2 text-sm font-bold font-mono tracking-tight bg-background border-4 border-border p-3 border-dashed">
                                    <div className="bg-accent p-1 border-2 border-border inline-block shadow-[2px_2px_0_rgba(0,0,0,1)]">
                                        <ImageIcon className="h-5 w-5 text-accent-foreground" />
                                    </div>
                                    <span className="uppercase ml-2">IMG_SCHEDULE: <span className="text-lg text-accent animate-pulse">{data.images_planned}</span></span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
