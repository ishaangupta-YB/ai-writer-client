import { BlogResult } from "../../lib/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { DownloadButton } from "../shared/DownloadButton";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface PreviewTabProps {
    blog: BlogResult;
}

export function PreviewTab({ blog }: PreviewTabProps) {
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 brutal-card bg-card border-4 border-border rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-2 w-full bg-accent border-b-4 border-border flex">
                <div className="w-1/4 h-full bg-primary border-r-4 border-border" />
                <div className="w-1/4 h-full bg-secondary border-r-4 border-border" />
                <div className="w-1/4 h-full bg-destructive border-r-4 border-border" />
            </div>

            <div className="sticky top-0 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b-4 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-black tracking-tighter uppercase truncate pb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)]">
                        {blog.plan.blog_title}
                    </h2>
                    <div className="flex items-center gap-4 text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="flex items-center gap-2 bg-muted px-2 py-1 border-2 border-border shadow-[2px_2px_0_rgba(0,0,0,1)]">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(blog.created_at), "MMMM d, yyyy")}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <DownloadButton blogId={blog.id} type="markdown" />
                    {blog.image_specs && blog.image_specs.length > 0 && (
                        <DownloadButton blogId={blog.id} type="images" />
                    )}
                    <DownloadButton blogId={blog.id} type="bundle" />
                </div>
            </div>

            <div className="flex-1 p-8 sm:p-16 overflow-y-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz4KPC9zdmc+')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CiAgPGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz4KPC9zdmc+')]">
                <div className="max-w-4xl mx-auto bg-card border-4 border-border shadow-[12px_12px_0_rgba(0,0,0,1)] p-10 sm:p-16 relative">
                    {/* Folded corner effect */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-muted border-l-4 border-b-4 border-border shadow-[-4px_4px_0_rgba(0,0,0,1)] z-10" />

                    <MarkdownRenderer content={blog.final_markdown} blogId={blog.id} />
                </div>
            </div>
        </div>
    );
}
