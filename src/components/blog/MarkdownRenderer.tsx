import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-neutral max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:border-b prose-headings:border-border prose-headings:pb-2 prose-p:leading-relaxed prose-a:font-bold prose-a:text-primary prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:text-primary/80 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:p-4 prose-blockquote:not-italic prose-code:font-mono prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-li:marker:text-foreground">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    img: ({ src, alt }) => {
                        if (!src) return null;
                        return (
                            <figure className="my-8 flex flex-col items-center">
                                <img
                                    src={src}
                                    alt={alt || "Blog image"}
                                    className="border-2 border-border bg-card object-cover max-h-[500px] w-full"
                                    loading="lazy"
                                />
                                {alt && (
                                    <figcaption className="mt-3 text-sm text-muted-foreground font-mono text-center">
                                        {alt}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    },
                    pre: ({ children, className }) => {
                        return (
                            <div className="relative group my-6 border-2 border-border bg-card overflow-hidden shadow-brutal">
                                <div className="flex items-center px-4 h-8 bg-muted border-b border-border gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-accent/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
                                </div>
                                <pre className={cn("p-4 bg-card border-none overflow-x-auto text-foreground font-mono text-sm", className)}>
                                    {children}
                                </pre>
                                <CopyButton content={extractText(children)} />
                            </div>
                        );
                    },
                    code: ({ inline, className, children, ...props }: any) => {
                        if (inline) {
                            return (
                                <code className="bg-muted font-mono px-1.5 py-0.5 text-sm" {...props}>
                                    {children}
                                </code>
                            );
                        }
                        return (
                            <code className={cn("font-mono", className)} {...props}>
                                {children}
                            </code>
                        );
                    },
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline decoration-2 decoration-primary underline-offset-2 hover:text-primary transition-colors"
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
            className="absolute top-1 right-1 p-1.5 bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
            title="Copy code"
        >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="sr-only">Copy</span>
        </button>
    );
}
