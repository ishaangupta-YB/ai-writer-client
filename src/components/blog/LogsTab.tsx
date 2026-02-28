import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useGeneration } from "../../context/GenerationContext";
import { cn } from "../../lib/utils";

export function LogsTab() {
    const { logs } = useGeneration();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    if (logs.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center brutal-card bg-card border-2 border-border max-w-4xl mx-auto">
                <p className="font-mono text-sm text-muted-foreground">No telemetry data available.</p>
            </div>
        );
    }

    const getNodeColor = (node: string) => {
        switch (node) {
            case "system": return "bg-foreground text-background";
            case "router": return "bg-blue-600 text-white";
            case "research": return "bg-primary text-primary-foreground";
            case "orchestrator": return "bg-orange-600 text-white";
            case "worker": return "bg-accent text-accent-foreground";
            case "reducer": return "bg-destructive text-destructive-foreground";
            default: return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[600px] flex flex-col brutal-card border-2 border-border overflow-hidden bg-card">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-border bg-muted">
                <span className="font-bold tracking-wider uppercase text-xs">Event Stream</span>
                <span className="text-xs font-mono text-muted-foreground">{logs.length} events</span>
            </div>

            <ScrollArea className="flex-1 w-full p-4 font-mono text-sm">
                <div className="space-y-2 pb-4">
                    {logs.map((log, i) => {
                        const d = new Date(log.timestamp);
                        const time = d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
                        return (
                            <div key={i} className="flex items-start gap-3 w-full hover:bg-muted/50 p-1.5 transition-colors">
                                <span className="text-muted-foreground font-bold shrink-0 text-xs tabular-nums mt-0.5">{time}</span>

                                <span className={cn(
                                    "shrink-0 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-border min-w-[80px] text-center",
                                    getNodeColor(log.node)
                                )}>
                                    {log.node}
                                </span>

                                <span className={cn(
                                    "text-sm break-words flex-1",
                                    log.message.startsWith("Error:") ? "text-destructive" :
                                        log.message === "Generation successfully completed." ? "text-primary font-bold" :
                                            "text-foreground/80"
                                )}>
                                    {log.message}
                                </span>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
        </div>
    );
}
