import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGeneration } from "../../context/GenerationContext";
import { useAppContext } from "../../context/AppContext";
import { usePastBlogs } from "../../hooks/usePastBlogs";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { GenerationProgress } from "../generation/GenerationProgress";
import { PlanTab } from "./PlanTab";
import { EvidenceTab } from "./EvidenceTab";
import { PreviewTab } from "./PreviewTab";
import { ImagesTab } from "./ImagesTab";
import { LogsTab } from "./LogsTab";

import { LayoutList, Search, FileText, Image as ImageIcon, ScrollText, Loader2 } from "lucide-react";
import { EmptyState } from "../shared/EmptyState";

export function BlogView() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isGenerating } = useGeneration();
    const { loadBlog, isFetchingBlog } = usePastBlogs();
    const { currentBlog, dispatch } = useAppContext();

    useEffect(() => {
        if (id) {
            if (!currentBlog || currentBlog.id !== id) {
                loadBlog(id).then(blog => {
                    if (!blog) navigate("/");
                });
            }
        } else {
            if (currentBlog && !isGenerating) {
                dispatch({ type: "SET_CURRENT_BLOG_ID", payload: null });
                dispatch({ type: "SET_CURRENT_BLOG", payload: null });
            }
        }
    }, [id, currentBlog, isGenerating, loadBlog, navigate, dispatch]);

    if (isGenerating) {
        return <GenerationProgress />;
    }

    if (isFetchingBlog) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-foreground animate-in fade-in zoom-in duration-300 brutal-card p-12 bg-accent shadow-[8px_8px_0_rgba(0,0,0,1)] border-4 border-border transform rotate-2">
                    <Loader2 className="h-12 w-12 animate-spin text-accent-foreground stroke-[3px]" />
                    <p className="font-mono font-black uppercase tracking-widest text-lg">Acquiring Data...</p>
                </div>
            </div>
        );
    }

    if (!currentBlog) {
        return <EmptyState />;
    }

    return (
        <div className="flex h-full w-full flex-col px-4 sm:px-8 py-6 max-w-[1400px] mx-auto overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out-expo">
            <Tabs defaultValue="preview" className="flex flex-col h-full w-full relative z-10">
                <div className="flex justify-center mb-8 relative">
                    {/* Decorative background for tabs */}
                    <div className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-full w-3/4 mx-auto" />

                    <TabsList className="flex w-full max-w-[800px] h-16 p-2 bg-background border-4 border-border shadow-[6px_6px_0_rgba(0,0,0,1)] rounded-none gap-2">

                        <TabsTrigger value="plan" className="flex-1 rounded-none border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[2px_2px_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-muted">
                            <span className="hidden sm:inline-block mr-2"><LayoutList className="h-4 w-4 stroke-[2.5px]" /></span>
                            Plan
                        </TabsTrigger>

                        <TabsTrigger value="evidence" className="flex-1 rounded-none border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-[2px_2px_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-muted">
                            <span className="hidden sm:inline-block mr-2"><Search className="h-4 w-4 stroke-[2.5px]" /></span>
                            Evidence
                        </TabsTrigger>

                        <TabsTrigger value="preview" className="flex-1 rounded-none border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-[2px_2px_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-muted">
                            <span className="hidden sm:inline-block mr-2"><FileText className="h-4 w-4 stroke-[2.5px]" /></span>
                            Preview
                        </TabsTrigger>

                        <TabsTrigger value="images" className="flex-1 rounded-none border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-[2px_2px_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-muted">
                            <span className="hidden sm:inline-block mr-2"><ImageIcon className="h-4 w-4 stroke-[2.5px]" /></span>
                            Images
                        </TabsTrigger>

                        <TabsTrigger value="logs" className="flex-1 rounded-none border-2 border-transparent data-[state=active]:border-border data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:shadow-[2px_2px_0_rgba(0,0,0,1)] font-bold uppercase tracking-widest text-xs sm:text-sm transition-all hover:bg-muted">
                            <span className="hidden sm:inline-block mr-2"><ScrollText className="h-4 w-4 stroke-[2.5px]" /></span>
                            Logs
                        </TabsTrigger>

                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto w-full pb-8 hide-scrollbar">
                    <TabsContent value="plan" className="mt-0 h-full border-none p-0 outline-none">
                        <PlanTab plan={currentBlog.plan} />
                    </TabsContent>

                    <TabsContent value="evidence" className="mt-0 h-full border-none p-0 outline-none">
                        <EvidenceTab evidence={currentBlog.evidence} mode={currentBlog.plan.blog_kind} />
                    </TabsContent>

                    <TabsContent value="preview" className="mt-0 h-full border-none p-0 outline-none">
                        <PreviewTab blog={currentBlog} />
                    </TabsContent>

                    <TabsContent value="images" className="mt-0 h-full border-none p-0 outline-none">
                        <ImagesTab blog={currentBlog} />
                    </TabsContent>

                    <TabsContent value="logs" className="mt-0 h-full border-none p-0 outline-none">
                        <LogsTab fromPastBlog={true} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
