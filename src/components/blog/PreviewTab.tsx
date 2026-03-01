import { useState } from "react";
import { BlogResult } from "../../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";

interface PreviewTabProps {
    blog: BlogResult;
}

export function PreviewTab({ blog }: PreviewTabProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blog.final_markdown);
            setCopied(true);
            toast.success("Markdown copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy markdown");
        }
    };



    return (
        <div className="flex flex-col h-full bg-transparent animate-in fade-in duration-500 relative group w-full">
            {/* Content */}
            <div className="flex-1 p-2 sm:p-8 w-full">

                <div className="max-w-3xl mx-auto relative group/prose">
                    <div className="absolute top-2 right-2 sm:-right-4 md:-right-12 z-10 opacity-60 hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                            title="Copy Scroll"
                        >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>

                    <div className="prose prose-stone lg:prose-lg prose-headings:font-display prose-headings:text-primary prose-p:font-serif prose-p:text-foreground/90 prose-a:text-primary min-w-full">
                        <MarkdownRenderer content={blog.final_markdown} />
                    </div>
                </div>
            </div>
        </div>
    );
}
