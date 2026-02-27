import { PastBlog } from "../../lib/types";
import { formatRelativeDate } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { Calendar, FileText, Image as ImageIcon } from "lucide-react";

interface BlogCardProps {
    blog: PastBlog;
    isActive: boolean;
    onClick: () => void;
}

export function BlogCard({ blog, isActive, onClick }: BlogCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group cursor-pointer p-4 brutal-card bg-card block w-full text-left relative overflow-hidden",
                isActive
                    ? "border-primary bg-primary/10 shadow-brutalActive translate-y-0.5 translate-x-0.5"
                    : "border-border shadow-brutal hover:shadow-brutalHover hover:-translate-y-1 hover:-translate-x-1"
            )}
        >
            {/* Decorative brutalist corner */}
            <div className="absolute -right-6 -top-6 w-12 h-12 bg-secondary transform rotate-45 border-b-2 border-border z-0 opacity-50 transition-transform group-hover:scale-150 group-hover:opacity-100" />

            <div className="flex flex-col gap-3 relative z-10">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="line-clamp-2 text-base font-bold leading-tight uppercase">
                        {blog.title}
                    </h4>
                </div>

                <div className="flex items-center gap-2">
                    <Badge className="text-[10px] uppercase font-bold border-2 border-border bg-accent text-accent-foreground rounded-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        {blog.blog_kind.replace("_", " ")}
                    </Badge>
                    {blog.has_images && (
                        <div className="bg-primary/20 border-2 border-border p-1">
                            <ImageIcon className="h-3 w-3 text-primary" />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground mt-2 border-t-2 border-border/20 pt-2">
                    <div className="flex items-center gap-1.5 bg-background border-2 border-border px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Calendar className="h-3 w-3" />
                        <span className="uppercase">{formatRelativeDate(blog.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary text-secondary-foreground border-2 border-border px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <FileText className="h-3 w-3" />
                        <span>{blog.word_count} W</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
