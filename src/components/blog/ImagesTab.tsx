import { BlogResult } from "../../lib/types";
import { getImageUrl } from "../../lib/api";
import { Card, CardContent } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../ui/collapsible";
import { Button } from "../ui/button";
import { DownloadButton } from "../shared/DownloadButton";
import { Info, Image as ImageIcon, ChevronDown, Frame } from "lucide-react";

interface ImagesTabProps {
    blog: BlogResult;
}

export function ImagesTab({ blog }: ImagesTabProps) {
    if (!blog.image_specs || blog.image_specs.length === 0) {
        return (
            <div className="max-w-3xl mx-auto mt-12 animate-in slide-in-from-bottom-8 duration-500">
                <Alert className="brutal-card bg-accent text-accent-foreground border-4 border-border rounded-none p-8 font-mono">
                    <Info className="h-8 w-8 text-accent-foreground mb-4" />
                    <AlertTitle className="text-2xl font-black uppercase tracking-tighter mb-2">Visual Assets Empty</AlertTitle>
                    <AlertDescription className="font-bold text-base">
                        {'>'} No images were scheduled or generated for this blog post.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-12 max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-500 pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b-4 border-border pb-6 decoration-wavy decoration-muted">
                <div>
                    <h3 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <div className="bg-secondary text-secondary-foreground p-2 border-4 border-border shadow-[4px_4px_0_rgba(0,0,0,1)]">
                            <Frame className="h-8 w-8 stroke-[3px]" />
                        </div>
                        Visual Assets
                    </h3>
                    <p className="font-mono font-bold text-sm bg-foreground text-background inline-block px-3 py-1 mt-4 border-2 border-border shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                        GEN_COUNT: {blog.image_specs.length}
                    </p>
                </div>
                <div className="shrink-0 brutal-card inline-block border-2">
                    <DownloadButton blogId={blog.id} type="images" />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {blog.image_specs.map((img, i) => (
                    <Card key={i} className="brutal-card rounded-none overflow-hidden border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] group bg-card flex flex-col h-full">
                        <div className="w-full aspect-video relative bg-foreground border-b-4 border-border flex items-center justify-center overflow-hidden">
                            {/* Decorative frame corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-8 border-l-8 border-primary z-20 m-4" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-8 border-r-8 border-accent z-20 m-4" />

                            <img
                                src={getImageUrl(blog.id, img.filename)}
                                alt={img.alt}
                                className="object-cover w-full h-full filter sepia-[0.3] contrast-125 transition-all duration-700 group-hover:scale-105 group-hover:sepia-0 relative z-10"
                                loading="lazy"
                            />
                        </div>
                        <CardContent className="p-0 flex-1 flex flex-col">
                            <div className="p-6 sm:p-8 flex-1 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.03)_25%,rgba(0,0,0,0.03)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.03)_75%,rgba(0,0,0,0.03)_100%)] bg-[length:20px_20px]">
                                <p className="font-black text-xl md:text-2xl uppercase tracking-tighter leading-tight bg-background inline-block mb-3 px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,1)] border-2 border-border rotate-1 lg:-rotate-1">{img.caption || img.alt}</p>
                                <div className="bg-background border-l-4 border-primary p-3 shadow-sm">
                                    <p className="text-sm font-bold text-foreground/80 line-clamp-3 leading-relaxed" title={img.alt}>
                                        {img.alt}
                                    </p>
                                </div>
                            </div>

                            <Collapsible className="mt-auto border-t-4 border-border bg-muted/50">
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full flex justify-between rounded-none p-4 h-auto font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-primary-foreground transition-colors group/btn">
                                        <span className="flex items-center gap-3"><ImageIcon className="h-5 w-5 stroke-[3px]" /> Generation Specs</span>
                                        <ChevronDown className="h-5 w-5 stroke-[3px] transition-transform duration-300 group-data-[state=open]/btn:-rotate-180" />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="border-t-4 border-border bg-background p-6 font-mono text-sm space-y-6">
                                    <div>
                                        <span className="font-black uppercase text-xs tracking-widest bg-foreground text-background px-2 py-0.5 inline-block mb-3">Prompt</span>
                                        <p className="font-bold text-sm bg-muted p-4 border-2 border-border shadow-[2px_2px_0_rgba(0,0,0,1)] leading-relaxed">{img.prompt}</p>
                                    </div>
                                    <div className="flex gap-6 border-t-4 border-border/20 pt-4">
                                        <div className="bg-secondary/20 p-3 border-2 border-secondary flex-1">
                                            <span className="font-black uppercase text-[10px] tracking-widest text-secondary-foreground block mb-1">Dimensions</span>
                                            <span className="font-bold text-base">{img.size.replace('size_', '')}</span>
                                        </div>
                                        <div className="bg-accent/20 p-3 border-2 border-accent flex-1">
                                            <span className="font-black uppercase text-[10px] tracking-widest text-accent-foreground block mb-1">Quality</span>
                                            <span className="font-bold text-base">{img.quality.replace('quality_', '')}</span>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
