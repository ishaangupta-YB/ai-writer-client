import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { startBlogGeneration } from "../lib/api";
import { SSEEvent, BlogResult } from "../lib/types";
import { useAppContext } from "./AppContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type GenerationState = {
    isGenerating: boolean;
    statusText: string;
    progress: number;
    currentNode: string;
    data: any;
    logs: Array<{ timestamp: string; node: string; message: string }>;
};

const initialState: GenerationState = {
    isGenerating: false,
    statusText: "Ready",
    progress: 0,
    currentNode: "",
    data: {},
    logs: [],
};

const NODE_STAGES = ["router", "research", "orchestrator", "worker", "reducer"];

interface GenerationContextType extends GenerationState {
    startGeneration: (topic: string, as_of: string) => () => void;
    resetGeneration: () => void;
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined);

export function GenerationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<GenerationState>(initialState);
    const { dispatch } = useAppContext();
    const navigate = useNavigate();

    const startGeneration = useCallback((topic: string, as_of: string) => {
        setState({
            ...initialState,
            isGenerating: true,
            statusText: "Initializing generation...",
            logs: [{ timestamp: new Date().toISOString(), node: "system", message: "Starting generation process" }]
        });

        const onEvent = (event: SSEEvent) => {
            setState(prev => {
                const next = { ...prev };

                if (event.type === "progress") {
                    next.currentNode = event.node;
                    if (event.data.current_step) {
                        next.statusText = event.data.current_step;
                    }
                    next.data = { ...prev.data, ...event.data };

                    const stageIndex = NODE_STAGES.indexOf(event.node);
                    if (stageIndex >= 0) {
                        next.progress = ((stageIndex + 1) / NODE_STAGES.length) * 100;
                    }

                    next.logs = [...prev.logs, {
                        timestamp: new Date().toISOString(),
                        node: event.node,
                        message: event.data.current_step || "Processing..."
                    }];
                } else if (event.type === "complete") {
                    next.isGenerating = false;
                    next.progress = 100;
                    next.statusText = "Generation complete!";
                    next.logs = [...prev.logs, {
                        timestamp: new Date().toISOString(),
                        node: "system",
                        message: "Generation successfully completed."
                    }];

                    const blog = event.data as BlogResult;
                    dispatch({ type: "SET_CURRENT_BLOG", payload: blog });
                    toast.success("Blog generated successfully!");
                    navigate(`/blog/${blog.id}`);
                } else if (event.type === "error") {
                    next.isGenerating = false;
                    next.statusText = "Error generating blog";
                    next.logs = [...prev.logs, {
                        timestamp: new Date().toISOString(),
                        node: "system",
                        message: `Error: ${event.message}`
                    }];
                    toast.error(`Generation failed: ${event.message}`);
                }

                return next;
            });
        };

        const onComplete = () => {
            setState(prev => prev.isGenerating ? {
                ...prev,
                isGenerating: false,
                statusText: prev.statusText === "Error generating blog" ? prev.statusText : "Generation finished."
            } : prev);
        };

        const onError = (error: Error) => {
            setState(prev => ({
                ...prev,
                isGenerating: false,
                statusText: "Connection error",
                logs: [...prev.logs, {
                    timestamp: new Date().toISOString(),
                    node: "system",
                    message: `Connection error: ${error.message}`
                }]
            }));
            toast.error(`Connection error: ${error.message}`);
        };

        const cancel = startBlogGeneration(topic, as_of, onEvent, onComplete, onError);
        return cancel;
    }, [dispatch, navigate]);

    const resetGeneration = useCallback(() => {
        setState(initialState);
    }, []);

    return (
        <GenerationContext.Provider value={{ ...state, startGeneration, resetGeneration }}>
            {children}
        </GenerationContext.Provider>
    );
}

export function useGeneration() {
    const context = useContext(GenerationContext);
    if (context === undefined) {
        throw new Error("useGeneration must be used within a GenerationProvider");
    }
    return context;
}
