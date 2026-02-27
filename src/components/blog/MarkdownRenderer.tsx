import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { getImageUrl } from "../../lib/api";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

interface MarkdownRendererProps {
    content: string;
    blogId: string;
}

export function MarkdownRenderer({ content, blogId }: MarkdownRendererProps) {
    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:border-b-4 prose-headings:border-border prose-headings:pb-2 prose-p:font-sans prose-p:leading-relaxed prose-a:font-bold prose-a:text-primary prose-a:underline prose-a:decoration-4 prose-a:underline-offset-4 hover:prose-a:bg-primary hover:prose-a:text-primary-foreground prose-strong:font-black prose-strong:bg-accent/30 prose-strong:px-1 prose-em:italic prose-blockquote:border-l-8 prose-blockquote:border-primary prose-blockquote:bg-primary/10 prose-blockquote:p-4 prose-blockquote:font-mono prose-blockquote:not-italic prose-code:font-mono prose-code:font-bold prose-code:bg-secondary/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-secondary-foreground prose-li:marker:text-foreground">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    img: ({ src, alt }) => {
                        if (!src) return null;
                        // Resolve local image paths to API URLs
                        const resolvedSrc = src.startsWith("images/")
                            ? getImageUrl(blogId, src.replace("images/", ""))
                            : src;

                        return (
                            <figure className="my-12 flex flex-col items-center group relative">
                                {/* Brutalist image decoration */}
                                <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 border-4 border-border z-0 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                                <img
                                    src={resolvedSrc}
                                    alt={alt || "Generated image"}
                                    className="relative z-10 border-4 border-border bg-card object-cover max-h-[600px] w-full filter sepia-[0.2] contrast-125 saturate-150 transition-all duration-500 group-hover:sepia-0"
                                    loading="lazy"
                                />
                                {alt && (
                                    <figcaption className="relative z-20 mt-6 bg-foreground text-background font-mono font-bold text-xs p-3 border-4 border-border shadow-[4px_4px_0_rgba(255,255,255,0.2)] dark:shadow-[4px_4px_0_rgba(0,0,0,1)] max-w-lg text-center transform -rotate-1 group-hover:rotate-0 transition-transform">
                                        {alt}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    },
                    pre: ({ children, className }) => {
                        return (
                            <div className="relative group my-8 brutal-card border-4 border-border rounded-none shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-foreground flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-destructive border-2 border-background" />
                                    <div className="w-3 h-3 rounded-full bg-accent border-2 border-background" />
                                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-background" />
                                </div>
                                <pre className={cn("p-6 pt-12 bg-background border-none overflow-x-auto text-foreground font-mono text-sm", className)}>
                                    {children}
                                </pre>
                                <CopyButton content={extractText(children)} />
                            </div>
                        );
                    },
                    code: ({ node, inline, className, children, ...props }: any) => {
                        if (inline) {
                            return (
                                <code className="bg-secondary/20 border-b-2 border-secondary font-mono font-bold px-1.5 py-0.5 text-secondary-foreground" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className={cn("font-mono font-bold", className)} {...props}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline decoration-4 decoration-primary underline-offset-4 hover:bg-primary hover:text-primary-foreground transition-colors px-1"
                        >
                            {children}
                        </a>
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

function extractText(node: any): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node && node.props && node.props.children) return extractText(node.props.children);
    return "";
}

function CopyButton({ content }: { content: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy", err);
        }
    };

    return (
        <button
            onClick={copy}
            className={cn(
                "absolute top-8 right-0 -translate-y-1/2 translate-x-1/2 p-3 bg-accent text-accent-foreground border-4 border-border shadow-[4px_4px_0_rgba(0,0,0,1)] transition-all",
                "hover:bg-primary hover:text-primary-foreground hover:-translate-y-1",
                "active:translate-y-0 active:shadow-none font-bold"
            )}
            title="Copy code"
        >
            {copied ? <Check className="h-5 w-5 stroke-[3px]" /> : <Copy className="h-5 w-5 stroke-[2.5px]" />}
            <span className="sr-only">Copy</span>
        </button>
    );
}
