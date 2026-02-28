import { useState } from "react";
import { BlogResult } from "../../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { toast } from "sonner";

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

    const handleDownload = () => {
        const blob = new Blob([blog.final_markdown], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${blog.plan.blog_title.replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-").toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Markdown downloaded!");
    };

    return (
        <div className="flex flex-col h-full brutal-card bg-card border-2 border-border overflow-hidden animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b-2 border-border bg-card">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black tracking-tight truncate pb-1">
                        {blog.plan.blog_title}
                    </h2>
                    <span className="text-xs font-mono text-muted-foreground">
                        {format(new Date(blog.created_at), "MMMM d, yyyy")}
                    </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="brutal-btn text-xs"
                    >
                        {copied ? "Copied" : "Copy MD"}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="brutal-btn text-xs"
                    >
                        Download
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 sm:p-10 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    <MarkdownRenderer content={blog.final_markdown} />
                </div>
            </div>
        </div>
    );
}
