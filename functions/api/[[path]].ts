/// <reference types="@cloudflare/workers-types" />
// Proxy all /api/* requests to the backend ALB.
// [[path]] is a Cloudflare Pages catch-all route segment.

interface Env {
  BACKEND_ORIGIN: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const backendOrigin = context.env.BACKEND_ORIGIN;

  if (!backendOrigin) {
    return new Response("BACKEND_ORIGIN not configured", { status: 502 });
  }

  const url = new URL(context.request.url);

  // Rebuild the URL pointing to the backend ALB
  const backendUrl = `${backendOrigin}${url.pathname}${url.search}`;

  // Forward method, headers, and body to the backend
  const backendRequest = new Request(backendUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "follow",
  });

  // Remove headers that shouldn't be forwarded to the backend
  backendRequest.headers.delete("host");

  const response = await fetch(backendRequest);

  // Return the backend response as-is (preserves SSE streaming)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};
