import { BlogResult } from "../../lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatDate } from "../../lib/utils";

interface EvidenceTabProps {
    evidence: BlogResult["evidence"] | undefined;
    mode?: string;
}

export function EvidenceTab({ evidence, mode }: EvidenceTabProps) {
    if (!evidence || evidence.length === 0) {
        return (
            <div className="max-w-3xl mx-auto mt-8 brutal-card bg-card border-2 border-border p-8 text-center animate-in fade-in duration-300">
                <h3 className="font-bold mb-1">No sources available</h3>
                <p className="text-sm text-muted-foreground">
                    {mode === "closed_book"
                        ? "This blog was generated in closed-book mode without web research."
                        : "No web sources were found for this topic."}
                </p>
            </div>
        );
    }

    const sortedEvidence = [...evidence].sort((a, b) => {
        if (!a.published_at) return 1;
        if (!b.published_at) return -1;
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300 pb-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-xl font-bold">Sources</h3>
                <Badge variant="outline" className="font-mono text-xs border-border">
                    {evidence.length} sources
                </Badge>
            </div>

            <div className="grid gap-4">
                {sortedEvidence.map((item, i) => (
                    <Card key={i} className="brutal-card bg-card border-2 border-border overflow-hidden group">
                        <CardHeader className="p-4 sm:p-5 pb-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <CardTitle className="text-base font-bold leading-tight">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground hover:text-primary transition-colors"
                                    >
                                        {item.title || item.url}
                                    </a>
                                </CardTitle>
                                <span className="text-xs font-mono text-muted-foreground shrink-0">
                                    {formatDate(item.published_at)}
                                </span>
                            </div>
                            <CardDescription className="text-xs font-mono text-muted-foreground mt-1">
                                {item.source || (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return item.url; } })()}
                            </CardDescription>
                        </CardHeader>
                        {item.snippet && (
                            <CardContent className="px-4 sm:px-5 pb-4 pt-0">
                                <p className="text-sm text-foreground/80 leading-relaxed border-l-2 border-primary pl-3">
                                    {item.snippet}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
