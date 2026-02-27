import { BlogResult } from "../../lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { formatDate } from "../../lib/utils";
import { Info, ExternalLink, Globe } from "lucide-react";

interface EvidenceTabProps {
    evidence: BlogResult["evidence"] | undefined;
    mode?: string;
}

export function EvidenceTab({ evidence, mode }: EvidenceTabProps) {
    if (!evidence || evidence.length === 0) {
        return (
            <div className="max-w-3xl mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
                <Alert className="brutal-card bg-secondary text-secondary-foreground border-4 border-border rounded-none p-8 font-mono">
                    <Info className="h-8 w-8 text-secondary-foreground mb-4" />
                    <AlertTitle className="text-2xl font-black uppercase tracking-tighter mb-2">No External Telemetry</AlertTitle>
                    <AlertDescription className="font-bold text-base">
                        {mode === "closed_book"
                            ? "> SYSTEM_MODE: CLOSED_BOOK. Internal weights utilized."
                            : "> No web sources located for this generation cycle."}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Sort by date descending, nulls at bottom
    const sortedEvidence = [...evidence].sort((a, b) => {
        if (!a.published_at) return 1;
        if (!b.published_at) return -1;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b-4 border-border pb-4 decoration-wavy decoration-muted">
                <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground p-2 border-4 border-border shadow-[4px_4px_0_rgba(0,0,0,1)] transform -rotate-6">
                        <Globe className="h-8 w-8 stroke-[3px]" />
                    </div>
                    Knowledge Base
                </h3>
                <Badge variant="outline" className="px-4 py-2 text-lg font-black uppercase border-4 border-border bg-accent text-accent-foreground shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-none">
                    {evidence.length} Sources
                </Badge>
            </div>

            <div className="grid gap-8">
                {sortedEvidence.map((item, i) => (
                    <Card key={i} className="group brutal-card bg-card border-4 border-border rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:-translate-y-2 hover:-translate-x-2 transition-all relative overflow-hidden">
                        {/* Index number background decoration */}
                        <div className="absolute -top-6 -right-6 text-9xl font-black text-muted opacity-20 transform rotate-12 pointer-events-none font-mono">
                            {(i + 1).toString().padStart(2, '0')}
                        </div>

                        <CardHeader className="p-6 sm:p-8 pb-4 border-b-4 border-dashed border-border/30 relative z-10">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <CardTitle className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-tight bg-background inline-block">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground hover:bg-primary hover:text-primary-foreground hover:underline decoration-4 decoration-border underline-offset-4 flex items-center gap-2 focus:outline-none transition-colors px-1"
                                    >
                                        {item.title || item.url}
                                        <ExternalLink className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 -translate-x-4 group-hover:translate-x-0" />
                                    </a>
                                </CardTitle>
                                <div className="text-sm font-black font-mono uppercase text-foreground bg-accent px-3 py-1 border-2 border-border shadow-[2px_2px_0_rgba(0,0,0,1)] shrink-0 transform rotate-2 group-hover:rotate-0 transition-transform">
                                    {formatDate(item.published_at)}
                                </div>
                            </div>
                            <CardDescription className="flex items-center gap-3 mt-4">
                                <span className="text-sm font-black uppercase tracking-widest text-background bg-foreground px-2 py-1 transform -skew-x-12">
                                    {item.source || new URL(item.url).hostname.replace('www.', '')}
                                </span>
                                <span className="font-mono text-xs font-bold text-muted-foreground break-all max-w-[200px] sm:max-w-md truncate">
                                    {item.url}
                                </span>
                            </CardDescription>
                        </CardHeader>
                        {item.snippet && (
                            <CardContent className="p-6 sm:p-8 pt-6 relative z-10 bg-[linear-gradient(45deg,transparent,transparent,rgba(0,0,0,0.02))]">
                                <div className="relative">
                                    <span className="absolute -top-4 -left-2 text-6xl font-black text-primary opacity-50 font-serif">"</span>
                                    <p className="text-base sm:text-lg font-bold text-foreground/90 leading-relaxed max-w-4xl relative z-10 pl-6 border-l-4 border-primary">
                                        {item.snippet}
                                    </p>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
