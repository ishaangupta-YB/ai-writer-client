import { AppProvider } from "./context/AppContext";
import { GenerationProvider, useGeneration } from "./context/GenerationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContent } from "./components/layout/MainContent";
import { BlogView } from "./components/blog/BlogView";
import { Toaster } from "sonner";
import { GenerationProgress } from "./components/generation/GenerationProgress";
import { useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Wand2, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

function HomeView() {
  const { isGenerating, startGeneration, resetGeneration } = useGeneration();
  const [topic, setTopic] = useState("");
  const cancelRef = useRef<(() => void) | null>(null);

  const handleGenerate = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;
    const cancel = startGeneration(topic, format(new Date(), "yyyy-MM-dd"));
    cancelRef.current = cancel;
  }, [topic, isGenerating, startGeneration]);

  const handleCancel = useCallback(() => {
    cancelRef.current?.();
    cancelRef.current = null;
    resetGeneration();
  }, [resetGeneration]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (topic.trim() && !isGenerating) {
        const cancel = startGeneration(topic, format(new Date(), "yyyy-MM-dd"));
        cancelRef.current = cancel;
      }
    }
  };

  return (
    <div className={`flex flex-col items-center w-full transition-all duration-700 ${isGenerating ? "pt-8" : "justify-center h-full min-h-[60vh]"}`}>
      <div className="w-full max-w-3xl px-4">

        {/* Hero */}
        {!isGenerating && (
          <div className="text-center mb-10 animate-in fade-in duration-500">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
              Generate your next article.
            </h1> 
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleGenerate} className="w-full">
          <div className="brutal-card border-2 border-border p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-end sm:items-center">
            <Textarea
              placeholder="What should we write about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              rows={1}
              className="flex-1 min-h-[48px] max-h-[160px] text-lg font-medium resize-none border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent placeholder:text-muted-foreground/50"
              disabled={isGenerating}
              autoFocus
            />

            <div className="flex w-full sm:w-auto gap-2 shrink-0">
              {isGenerating ? (
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto brutal-btn h-11 px-6 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full sm:w-auto brutal-btn h-11 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!topic.trim()}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              )}
            </div>
          </div>
          {!isGenerating && (
            <p className="text-xs font-mono text-muted-foreground mt-3 ml-1">
              Press <kbd className="bg-muted px-1.5 py-0.5 border border-border text-xs font-bold">Enter</kbd> to generate
            </p>
          )}
        </form>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="w-full mt-8 flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-500">
          <GenerationProgress />
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
          className: 'border-2 border-border font-mono text-sm shadow-brutal'
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
