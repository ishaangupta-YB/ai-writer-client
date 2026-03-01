import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGeneration } from "../../context/GenerationContext";
import { useAppContext } from "../../context/AppContext";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { PlanTab } from "./PlanTab";
import { EvidenceTab } from "./EvidenceTab";
import { PreviewTab } from "./PreviewTab";
import { LogsTab } from "./LogsTab";
import { ResultBackground } from "./ResultBackground";
import { motion, AnimatePresence } from "framer-motion";

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

    const ScrollTabsHeader = (
        <TabsList className="flex w-full max-w-[600px] h-8 sm:h-12 bg-transparent p-0 gap-0 sm:gap-2">
            <TabsTrigger
                value="plan"
                className="flex-1 border-none shadow-none bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-display font-bold uppercase tracking-widest text-[8px] sm:text-xs transition-colors hover:bg-black/5 rounded px-1 sm:px-3 whitespace-nowrap"
            >
                Overview
            </TabsTrigger>
            <TabsTrigger
                value="evidence"
                className="flex-1 border-none shadow-none bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-display font-bold uppercase tracking-widest text-[8px] sm:text-xs transition-colors hover:bg-black/5 rounded px-1 sm:px-3 whitespace-nowrap"
            >
                Research
            </TabsTrigger>
            <TabsTrigger
                value="preview"
                className="flex-1 border-none shadow-none bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-display font-bold uppercase tracking-widest text-[8px] sm:text-xs transition-colors hover:bg-black/5 rounded px-1 sm:px-3 whitespace-nowrap"
            >
                Chronicle
            </TabsTrigger>
            <TabsTrigger
                value="logs"
                className="flex-1 border-none shadow-none bg-transparent data-[state=active]:bg-primary/10 data-[state=active]:text-primary font-display font-bold uppercase tracking-widest text-[8px] sm:text-xs transition-colors hover:bg-black/5 rounded px-1 sm:px-3 whitespace-nowrap"
            >
                Ledger
            </TabsTrigger>
        </TabsList>
    );

    return (
        <Tabs defaultValue="preview" className="flex flex-col h-full w-full">
            <ResultBackground headerContent={ScrollTabsHeader} className="px-0 py-0">
                <div className="flex-1 w-full pt-6">
                    <div className="max-w-[900px] mx-auto px-4 sm:px-8 pb-16 min-h-full">
                        <AnimatePresence mode="wait">
                            <TabsContent key="plan" value="plan" className="mt-0 h-full border-none p-0 outline-none data-[state=inactive]:hidden">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <PlanTab plan={currentBlog.plan} />
                                </motion.div>
                            </TabsContent>
                            <TabsContent key="evidence" value="evidence" className="mt-0 h-full border-none p-0 outline-none data-[state=inactive]:hidden">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <EvidenceTab evidence={currentBlog.evidence} mode={currentBlog.plan.blog_kind} />
                                </motion.div>
                            </TabsContent>
                            <TabsContent key="preview" value="preview" className="mt-0 h-full border-none p-0 outline-none data-[state=inactive]:hidden">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <PreviewTab blog={currentBlog} />
                                </motion.div>
                            </TabsContent>
                            <TabsContent key="logs" value="logs" className="mt-0 h-full border-none p-0 outline-none data-[state=inactive]:hidden">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                    <LogsTab />
                                </motion.div>
                            </TabsContent>
                        </AnimatePresence>
                    </div>
                </div>
            </ResultBackground>
        </Tabs>
    );
}
