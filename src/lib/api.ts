import { SSEEvent } from "./types";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function startBlogGeneration(
    topic: string,
    as_of: string,
    onEvent: (event: SSEEvent) => void,
    onComplete: () => void,
    onError: (error: Error) => void
): () => void {
    const controller = new AbortController();

    const run = async () => {
        try {
            const response = await fetch(`${API_BASE}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, as_of }),
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`Failed to start generation: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error("No readable stream");
            }

            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.trim().startsWith("data:")) {
                        const dataStr = line.slice(5).trim();
                        if (!dataStr) continue;
                        try {
                            const event: SSEEvent = JSON.parse(dataStr);
                            onEvent(event);
                        } catch (e) {
                            console.error("Failed to parse SSE event", e);
                        }
                    }
                }
            }
            onComplete();
        } catch (e: any) {
            if (e.name === "AbortError") {
                return;
            }
            onError(e);
        }
    };

    run();

    return () => {
        controller.abort();
    };
}
