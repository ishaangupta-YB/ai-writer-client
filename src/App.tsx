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
import { cn } from "./lib/utils";
import { ParchmentBackground } from "./components/landing/ParchmentBackground";

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
    <div className="flex flex-col items-center w-full h-full relative z-10">
      {/* Input Phase */}
      {phase !== "generating" && (
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full h-full min-h-[60vh] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
            phase === "exiting" && "opacity-0 -translate-y-8 pointer-events-none scale-95 filter blur-sm"
          )}
        >
          <div className="w-full max-w-2xl px-4 relative z-20 mt-[-10vh]">
            <div className="text-center mb-12">
              <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-primary drop-shadow-md">
                Chronicle Thy Thoughts.
              </h1>
              <p className="text-lg md:text-xl font-serif text-foreground/80 italic max-w-lg mx-auto leading-relaxed">
                Inscribe your prompt, and let the agents weave your next masterpiece.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full">
              <div className="elegant-card p-2 sm:p-3 flex flex-col sm:flex-row gap-3 items-end sm:items-center relative group">
                {/* Decorative border accent */}
                <div className="absolute inset-0 border border-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <Textarea
                  placeholder="What knowledge seeks to be written?"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                  rows={1}
                  className="flex-1 min-h-[56px] max-h-[160px] text-lg font-serif resize-none border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 bg-transparent placeholder:text-muted-foreground/60 placeholder:italic leading-relaxed"
                  disabled={phase === "exiting"}
                  autoFocus={false}
                />
                <StatefulButton
                  type="button"
                  className="w-full sm:w-auto h-14 px-8 elegant-btn text-sm"
                  disabled={!topic.trim() || phase === "exiting"}
                  onClick={handleGenerate}
                >
                  Generate
                </StatefulButton>
              </div>
              <div className="mt-4 flex justify-center text-center">
                <p className="text-xs font-serif text-muted-foreground italic flex items-center gap-2">
                  Press
                  <kbd className="px-2 py-0.5 rounded border border-border/60 bg-background/50 text-[10px] font-sans text-primary">
                    Enter
                  </kbd>
                  to manifest your article
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generation Phase */}
      {phase === "generating" && (
        <div className="w-full flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out z-20 relative bg-background/30 backdrop-blur-md">
          {/* Query Header */}
          <div className="w-full max-w-3xl mx-auto px-6 pt-12 pb-6 text-center">
             
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight text-foreground drop-shadow-sm">
              "{submittedTopic}"
            </h2>
          </div>
 

          {/* Scrollable Progress */}
          <div className="flex-1 overflow-y-auto hide-scrollbar scroll-smooth px-4">
            <div className="max-w-4xl mx-auto">
              <GenerationProgress />
            </div>
            <div className="flex justify-center pb-12 pt-8">
              <button
                onClick={handleCancel}
                className="text-sm font-serif italic text-muted-foreground hover:text-destructive transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-border hover:after:bg-destructive after:origin-center after:transition-all"
              >
                Halt Transcription
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
    <ParchmentBackground>
      <div className="flex bg-transparent text-foreground min-h-screen">
        <MainContent>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/blog/:id" element={<BlogView />} />
          </Routes>
        </MainContent>
        <Toaster
          toastOptions={{
            className: "border border-border/50 bg-card/80 backdrop-blur-md rounded-lg font-serif text-sm shadow-elegant text-foreground",
          }}
        />
      </div>
    </ParchmentBackground>
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
