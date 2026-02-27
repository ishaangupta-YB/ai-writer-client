import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useGeneration } from "../../context/GenerationContext";
import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface LogsTabProps {
    fromPastBlog?: boolean;
}

export function LogsTab({ fromPastBlog = false }: LogsTabProps) {
    const { logs } = useGeneration();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    if (fromPastBlog || logs.length === 0) {
        return (
            <div className="flex h-[500px] items-center justify-center brutal-card bg-card border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] rounded-none font-mono text-xl max-w-5xl mx-auto p-8 relative overflow-hidden">
                {/* Brutalist Warning Pattern */}
                <div className="absolute top-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000_0,#000_10px,#ffe200_10px,#ffe200_20px)] border-b-4 border-border" />
                <div className="absolute bottom-0 left-0 w-full h-4 bg-[repeating-linear-gradient(45deg,#000_0,#000_10px,#ffe200_10px,#ffe200_20px)] border-t-4 border-border" />

                <p className="bg-foreground text-background font-black uppercase tracking-widest px-4 py-2 border-4 border-primary shadow-[4px_4px_0_rgba(255,100,100,1)] transform -rotate-2 hover:rotate-2 transition-transform">No active telemetry block.</p>
            </div>
        );
    }

    const getNodeColor = (node: string) => {
        switch (node) {
            case "system": return "bg-foreground text-background border-border shadow-[2px_2px_0_rgba(0,0,0,0.5)]";
            case "router": return "bg-blue-500 text-white border-blue-900 shadow-[2px_2px_0_rgba(30,58,138,1)]";
            case "research": return "bg-primary text-primary-foreground border-border shadow-[2px_2px_0_rgba(0,0,0,1)]";
            case "orchestrator": return "bg-orange-500 text-white border-orange-900 shadow-[2px_2px_0_rgba(124,45,18,1)]";
            case "worker": return "bg-accent text-accent-foreground border-border shadow-[2px_2px_0_rgba(0,0,0,1)]";
            case "reducer": return "bg-destructive text-destructive-foreground border-border shadow-[2px_2px_0_rgba(0,0,0,1)]";
            default: return "bg-secondary text-secondary-foreground border-border shadow-[2px_2px_0_rgba(0,0,0,1)]";
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[700px] flex flex-col brutal-card rounded-none border-4 border-border overflow-hidden bg-card shadow-[12px_12px_0_rgba(0,0,0,1)] relative">
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-border bg-foreground">
                <div className="flex items-center gap-3 text-background font-black tracking-widest uppercase">
                    <Clock className="w-5 h-5 stroke-[3px] text-primary animate-pulse" />
                    Event Stream
                </div>
                <div className="text-sm font-black text-background bg-secondary px-3 py-1 border-2 border-border shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    PULSE: {logs.length}
                </div>
            </div>

            <ScrollArea className="flex-1 w-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] p-6 font-mono text-sm relative">
                {/* Vertical line decoration */}
                <div className="absolute top-0 bottom-0 left-[140px] w-1 bg-border/20 border-r-2 border-dashed border-border/40 pointer-events-none" />

                <div className="space-y-4 pb-8 relative z-10">
                    {logs.map((log, i) => {
                        const d = new Date(log.timestamp);
                        const time = d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
                        return (
                            <div key={i} className="flex items-start gap-6 w-full group relative">
                                {/* Hover highlight brutalist style */}
                                <div className="absolute -inset-2 bg-muted/50 border-2 border-border opacity-0 group-hover:opacity-100 transition-opacity -z-10 shadow-[4px_4px_0_rgba(0,0,0,1)]" />

                                <span className="text-muted-foreground font-black shrink-0 w-[110px] bg-background border-2 border-border px-2 py-0.5 shadow-[1px_1px_0_rgba(0,0,0,1)] group-hover:bg-foreground group-hover:text-background transition-colors">{time}</span>

                                <span className="shrink-0 w-[130px] flex justify-center">
                                    <span className={cn(
                                        "inline-flex items-center justify-center px-3 py-1 font-black uppercase tracking-widest border-2 w-full truncate",
                                        getNodeColor(log.node)
                                    )}>
                                        {log.node}
                                    </span>
                                </span>

                                <span className={cn(
                                    "font-bold break-words flex-1 p-2 border-l-4",
                                    log.message.startsWith("Error:") ? "text-destructive border-destructive bg-destructive/10" :
                                        log.message === "Generation successfully completed." ? "text-primary border-primary bg-primary/10" :
                                            "text-foreground/90 border-transparent bg-background/50 group-hover:bg-transparent"
                                )}>
                                    {'>'} {log.message}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} className="h-10" />
                </div>
            </ScrollArea>
        </div>
    );
}
