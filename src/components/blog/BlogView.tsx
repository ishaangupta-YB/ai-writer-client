import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGeneration } from "../../context/GenerationContext";
import { useAppContext } from "../../context/AppContext";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { PlanTab } from "./PlanTab";
import { EvidenceTab } from "./EvidenceTab";
import { PreviewTab } from "./PreviewTab";
import { LogsTab } from "./LogsTab";

export function BlogView() {
    const navigate = useNavigate();
    const { isGenerating } = useGeneration();
    const { currentBlog } = useAppContext();

    useEffect(() => {
        if (!currentBlog && !isGenerating) {
            navigate("/", { replace: true });
        }
    }, [currentBlog, isGenerating, navigate]);

    if (!currentBlog) {
        return null;
    }

    return (
        <div className="flex h-full w-full flex-col px-4 sm:px-8 py-6 max-w-[1200px] mx-auto overflow-hidden animate-in fade-in duration-500">
            <Tabs defaultValue="preview" className="flex flex-col h-full w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="flex w-full max-w-[600px] h-12 p-1.5 bg-muted border-2 border-border shadow-brutal gap-1">
                        <TabsTrigger value="plan" className="flex-1 border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-brutal font-bold uppercase tracking-wider text-xs transition-all hover:bg-card/50">
                            Plan
                        </TabsTrigger>
                        <TabsTrigger value="evidence" className="flex-1 border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-brutal font-bold uppercase tracking-wider text-xs transition-all hover:bg-card/50">
                            Evidence
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="flex-1 border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-brutal font-bold uppercase tracking-wider text-xs transition-all hover:bg-card/50">
                            Preview
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex-1 border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-brutal font-bold uppercase tracking-wider text-xs transition-all hover:bg-card/50">
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
                    <TabsContent value="logs" className="mt-0 h-full border-none p-0 outline-none">
                        <LogsTab />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
