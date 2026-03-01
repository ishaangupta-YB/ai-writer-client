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
            <div className="flex h-[400px] items-center justify-center bg-transparent border border-primary/20 rounded-lg max-w-4xl mx-auto">
                <p className="font-serif italic text-sm text-muted-foreground/80">No telemetry data available.</p>
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
        <div className="max-w-4xl mx-auto h-[600px] flex flex-col border border-primary/20 rounded-lg overflow-hidden bg-transparent mb-8">
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-primary/5">
                <span className="font-display tracking-widest uppercase text-[10px] text-primary">Event Stream</span>
                <span className="text-xs font-serif italic text-primary/80">{logs.length} events</span>
            </div>

            <ScrollArea className="flex-1 w-full p-4 font-mono text-sm">
                <div className="space-y-2 pb-4">
                    {logs.map((log, i) => {
                        const d = new Date(log.timestamp);
                        const time = d.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + String(d.getMilliseconds()).padStart(3, '0');
                        return (
                            <div key={i} className="flex items-start gap-3 w-full hover:bg-primary/5 p-1.5 transition-colors">
                                <span className="text-primary/60 font-serif italic shrink-0 text-[10px] tabular-nums mt-0.5">{time}</span>

                                <span className={cn(
                                    "shrink-0 inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-display font-bold uppercase tracking-widest border border-primary/20 min-w-[80px] text-center rounded text-primary bg-primary/10",
                                    // Optionally override background based on node if desired, but stripping brutal colors fits better.
                                    // For now, keeping the nodeColor as an override.
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
