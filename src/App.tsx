import { AppProvider } from "./context/AppContext";
import { GenerationProvider, useGeneration } from "./context/GenerationContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainContent } from "./components/layout/MainContent";
import { BlogView } from "./components/blog/BlogView";
import { Toaster } from "sonner";
import { GenerationProgress } from "./components/generation/GenerationProgress";
import { useState } from "react";
import { format } from "date-fns";
import { Wand2, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

function HomeView() {
  const { isGenerating, startGeneration } = useGeneration();
  const [topic, setTopic] = useState("");
  const date = new Date();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || isGenerating) return;
    startGeneration(topic, format(date, "yyyy-MM-dd"));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (topic.trim() && !isGenerating) {
        startGeneration(topic, format(date, "yyyy-MM-dd"));
      }
    }
  };

  const hasContent = isGenerating;

  return (
    <div className={`flex flex-col items-center w-full transition-all duration-1000 ease-out-expo ${hasContent ? "pt-8" : "justify-center h-full min-h-[60vh]"}`}>

      {/* Hero Section */}
      <div className={`transition-all duration-1000 ease-out-expo w-full max-w-4xl px-4 ${hasContent ? "translate-y-0" : "scale-[1.02]"}`}>

        <div className={`text-center space-y-4 relative z-10 w-full transition-all duration-1000 ease-out-expo ${hasContent ? "mb-6" : "mb-10"}`}>
          <h1 className={`font-black uppercase tracking-tighter transition-all duration-1000 ease-out-expo ${hasContent ? "text-4xl text-left" : "text-6xl md:text-8xl text-center drop-shadow-[4px_4px_0_rgba(0,0,0,0.1)]"}`}>
            Generate <br className={hasContent ? "hidden" : "block"} /> <span className="text-transparent bg-clip-text bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIi8+Cjwvc3ZnPg==')] text-primary stroke-foreground drop-shadow-none">Intelligence.</span>
          </h1>
          {!hasContent && (
            <p className="font-mono text-lg font-bold bg-muted p-2 border-2 border-border inline-block px-4 shadow-[2px_2px_0_rgba(0,0,0,1)] transform -rotate-1">
              Autonomous Blog AI Pipeline
            </p>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleGenerate} className="w-full relative z-20 group">
          <div className={`absolute -inset-1 bg-primary border-4 border-border shadow-[8px_8px_0_rgba(0,0,0,1)] transition-transform -z-10 ${hasContent ? "translate-x-1 translate-y-1" : "translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3"}`} />

          <div className="brutal-card bg-card border-4 border-border p-2 sm:p-4 flex flex-col sm:flex-row gap-4 items-end sm:items-center relative z-10">
            <div className="flex-1 w-full bg-background border-4 border-transparent focus-within:border-border transition-colors p-2 flex items-start gap-3">
              <ChevronRight className="h-6 w-6 text-primary shrink-0 mt-3" strokeWidth={4} />
              <Textarea
                placeholder="Enter a topic for your next article..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[60px] max-h-[200px] text-lg sm:text-2xl font-bold resize-none border-none border-0 box-shadow-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 bg-transparent py-2 placeholder:text-muted-foreground/50"
                disabled={isGenerating}
                autoFocus
              />
            </div>

            <div className="flex w-full sm:w-auto gap-3 shrink-0">
              <Button
                type="submit"
                className={`w-full sm:w-auto px-8 brutal-btn text-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all ${hasContent ? "h-14" : "h-16"}`}
                disabled={isGenerating || !topic.trim()}
              >
                <Wand2 className="h-6 w-6 mr-3 stroke-[3px]" />
                <span>{isGenerating ? "Executing..." : "Generate"}</span>
              </Button>
            </div>
          </div>
          {!hasContent && (
            <p className="text-xs font-mono font-bold uppercase text-muted-foreground mt-4 ml-2 animate-in fade-in zoom-in duration-700 delay-300">
              Press <kbd className="bg-foreground text-background px-1 border-2 border-border shadow-[1px_1px_0_rgba(0,0,0,1)]">Enter</kbd> to execute
            </p>
          )}
        </form>

      </div>

      {/* Generation Progress Rendering below */}
      {isGenerating && (
        <div className="w-full mt-6 animate-in slide-in-from-bottom-24 fade-in duration-1000 ease-out-expo flex-1 flex flex-col items-center">
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
          className: 'brutal-card rounded-none border-4 border-border font-mono font-bold uppercase shadow-[4px_4px_0_rgba(0,0,0,1)]'
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
