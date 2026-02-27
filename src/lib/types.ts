export type BlogKind = "explainer" | "tutorial" | "news_roundup" | "comparison" | "system_design";

export interface BlogResult {
  id: string;
  plan: {
    blog_title: string;
    audience: string;
    tone: string;
    blog_kind: BlogKind;
    constraints: string[];
    tasks: Array<{
      id: number;
      title: string;
      goal: string;
      bullets: string[];
      target_words: number;
      tags: string[];
      requires_research: boolean;
      requires_citations: boolean;
      requires_code: boolean;
    }>;
  };
  evidence: Array<{
    title: string;
    url: string;
    published_at: string | null;
    snippet: string | null;
    source: string | null;
  }>;
  image_specs: Array<{
    placeholder: string;
    filename: string;
    alt: string;
    caption: string;
    prompt: string;
    size: string;
    quality: string;
  }>;
  final_markdown: string;
  created_at: string;
}

export interface PastBlog {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  word_count: number;
  has_images: boolean;
  blog_kind: BlogKind;
}

export type ProgressEvent = {
  type: "progress";
  node: string;
  data: {
    mode?: string;
    needs_research?: boolean;
    queries?: string[];
    evidence_count?: number;
    tasks_planned?: number;
    sections_done?: number;
    total_sections?: number;
    images_planned?: number;
    current_step?: string;
  };
};

export type FinalEvent = {
  type: "complete";
  data: BlogResult;
};

export type ErrorEvent = {
  type: "error";
  message: string;
};

export type SSEEvent = ProgressEvent | FinalEvent | ErrorEvent;
