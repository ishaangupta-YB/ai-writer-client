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
            <div className="max-w-2xl mx-auto mt-12 sm:mt-24 flex flex-col items-center justify-center text-center animate-in fade-in duration-700 px-4">
                <div className="w-12 h-12 mb-6 opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                </div>
                <h3 className="font-display text-primary text-2xl mb-4 tracking-wide">The Archives Sleep</h3>
                <p className="text-lg font-serif italic text-muted-foreground/80 max-w-md leading-relaxed">
                    {mode === "closed_book"
                        ? "This chronicle was scribed directly from the agent's vast repository of knowledge, requiring no external scrolls."
                        : "No external ledgers were required. This manuscript was woven from pure thought and memory."}
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
        <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500 pb-8 px-2 sm:px-0">
            <div className="flex items-center justify-between border-b border-primary/20 pb-4">
                <h3 className="text-2xl font-display text-primary tracking-wide">Research Ledgers</h3>
                <Badge variant="outline" className="font-display tracking-widest uppercase text-[10px] border-primary/30 text-primary bg-primary/5">
                    {evidence.length} scrolls
                </Badge>
            </div>

            <div className="grid gap-4">
                {sortedEvidence.map((item, i) => (
                    <Card key={i} className="bg-transparent border border-primary/20 rounded-lg overflow-hidden group hover:bg-primary/5 transition-colors shadow-none">
                        <CardHeader className="p-4 sm:p-5 pb-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <CardTitle className="text-base font-serif font-semibold leading-tight text-primary/90">
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
