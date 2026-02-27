import { useState } from "react";
import { useGeneration } from "../../context/GenerationContext";
import { format } from "date-fns";
import { Wand2, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export function EmptyState() {
    const { isGenerating, startGeneration } = useGeneration();
    const [topic, setTopic] = useState("");
    const date = new Date();

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || isGenerating) return;
        startGeneration(topic, format(date, "yyyy-MM-dd"));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (topic.trim() && !isGenerating) {
                startGeneration(topic, format(date, "yyyy-MM-dd"));
            }
        }
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-700 max-w-2xl w-full">

                {/* Hero Title */}
                <div className="text-center space-y-4 relative z-10 w-full">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)] mb-6">
                        Generate <br /> <span className="text-transparent bg-clip-text bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] text-primary stroke-foreground">Intelligence</span>
                    </h1>
                    <p className="font-mono text-lg font-bold bg-muted p-2 border-border inline-block px-4">
                        AI Blog Writer Pipeline
                    </p>
                </div>

                {/* Big Input Bar */}
                <form onSubmit={handleGenerate} className="w-full relative z-20 group">
                    <div className="absolute -inset-1 bg-primary border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform -z-10" />

                    <div className="brutal-card bg-card border-4 border-border p-2 sm:p-4 flex flex-col sm:flex-row gap-4 items-end sm:items-center relative z-10">
                        <div className="flex-1 w-full bg-background border-4 border-transparent focus-within:border-border transition-colors p-2 flex items-start gap-3">
                            <ChevronRight className="h-6 w-6 text-primary shrink-0 mt-3" strokeWidth={4} />
                            <Textarea
                                placeholder="Enter a topic for your next major article..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="min-h-[60px] max-h-[200px] text-lg sm:text-2xl font-bold resize-none border-none border-0 box-shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 bg-transparent py-2 shadow-none placeholder:text-muted-foreground/50"
                                disabled={isGenerating}
                                autoFocus
                            />
                        </div>

                        <div className="flex w-full sm:w-auto gap-3 shrink-0">
                            <Button
                                type="submit"
                                className="w-full sm:w-auto h-16 px-8 brutal-btn text-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)]"
                                disabled={isGenerating || !topic.trim()}
                            >
                                <Wand2 className="h-6 w-6 mr-3 stroke-[3px]" />
                                <span>Generate</span>
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs font-mono font-bold uppercase text-muted-foreground mt-4 ml-2">Press <kbd className="bg-foreground text-background px-1 border-2 border-border">Enter</kbd> to execute</p>
                </form>

            </div>
        </div>
    );
}
