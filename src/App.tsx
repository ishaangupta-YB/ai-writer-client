import { AppProvider } from "./context/AppContext";
import { GenerationProvider, useGeneration } from "./context/GenerationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContent } from "./components/layout/MainContent";
import { BlogView } from "./components/blog/BlogView";
import { Toaster } from "sonner";
import { GenerationProgress } from "./components/generation/GenerationProgress";
import { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Button as StatefulButton } from "./components/ui/stateful-button";
import { Textarea } from "./components/ui/textarea";
import { Separator } from "./components/ui/separator";
import { cn } from "./lib/utils";

function HomeView() {
  const { isGenerating, startGeneration, resetGeneration } = useGeneration();
  const [topic, setTopic] = useState("");
  const [submittedTopic, setSubmittedTopic] = useState("");
  const [phase, setPhase] = useState<"input" | "exiting" | "generating">("input");
  const cancelRef = useRef<(() => void) | null>(null);

  const handleGenerate = useCallback(() => {
    if (!topic.trim() || isGenerating) return;
    setSubmittedTopic(topic.trim());
    setPhase("exiting");
    const cancel = startGeneration(topic, format(new Date(), "yyyy-MM-dd"));
    cancelRef.current = cancel;
    setTimeout(() => setPhase("generating"), 500);
  }, [topic, isGenerating, startGeneration]);

  const handleCancel = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    resetGeneration();
    setPhase("input");
    setSubmittedTopic("");
  }, [resetGeneration]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleGenerate();
  };

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Input Phase */}
      {phase !== "generating" && (
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-full min-h-[60vh] transition-all duration-500 ease-out",
            phase === "exiting" && "opacity-0 -translate-y-16 pointer-events-none"
          )}
        >
          <div className="w-full max-w-3xl px-4">
            <div className="text-center mb-10">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                Generate your next article.
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="brutal-card border-2 border-border p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                <Textarea
                  placeholder="What should we write about?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  rows={1}
                  className="flex-1 min-h-[48px] max-h-[160px] text-lg font-medium resize-none border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent placeholder:text-muted-foreground/50"
                  disabled={phase === "exiting"}
                  autoFocus={false}
                />
                <StatefulButton
                  type="button"
                  className="w-full sm:w-auto h-11 px-6"
                  disabled={!topic.trim() || phase === "exiting"}
                  onClick={handleGenerate}
                >
                  Generate
                </StatefulButton>
              </div>
              <p className="text-xs font-mono text-muted-foreground mt-3 ml-1">
                Press{" "}
                <kbd className="bg-muted px-1.5 py-0.5 border border-border text-xs font-bold">
                  Enter
                </kbd>{" "}
                to generate
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Generation Phase */}
      {phase === "generating" && (
        <div className="w-full flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Query Header */}
          <div className="w-full max-w-3xl mx-auto px-4 pt-10 pb-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 font-mono">
              Generating
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              {submittedTopic}
            </h2>
          </div>

          <Separator className="max-w-3xl mx-auto w-full" />

          {/* Scrollable Progress */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <GenerationProgress />
            <div className="flex justify-center pb-8">
              <button
                onClick={handleCancel}
                className="text-xs font-mono text-muted-foreground hover:text-destructive transition-colors underline underline-offset-4 decoration-border hover:decoration-destructive"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AppContent() {
  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans">
      <MainContent>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/blog/:id" element={<BlogView />} />
        </Routes>
      </MainContent>
      <Toaster
        toastOptions={{
          className: "border-2 border-border font-mono text-sm shadow-brutal",
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <GenerationProvider>
          <AppContent />
        </GenerationProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
