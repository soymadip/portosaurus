// List of domains allowed to USE this proxy.
// Leave empty [] to allow any domain, or add your site
const ALLOWED_ORIGINS = [
  "https://soymadip.github.io",
  "https://soymadip.is-a.dev",
];

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");

    // Protect your proxy from being used by arbitrary websites
    if (
      ALLOWED_ORIGINS.length > 0 &&
      origin &&
      !ALLOWED_ORIGINS.includes(origin)
    ) {
      return new Response("Forbidden: Origin not allowed", { status: 403 });
    }

    // We only accept GET requests
    if (request.method !== "GET" && request.method !== "OPTIONS") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Missing 'url' query parameter", { status: 400 });
    }

    // Handle preflight CORS requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") || "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      // Fetch the actual file
      const fetchResponse = await fetch(decodeURIComponent(targetUrl), {
        headers: {
          "User-Agent": "Portosaurus-Worker-Proxy/1.0",
        },
      });

      if (!fetchResponse.ok) {
        return new Response(
          `Target URL responded with ${fetchResponse.status}`,
          {
            status: fetchResponse.status,
          },
        );
      }

      // Stream the response back exactly as is
      const responseHeaders = new Headers(fetchResponse.headers);

      // Inject our CORS override headers!
      responseHeaders.set("Access-Control-Allow-Origin", origin || "*");
      responseHeaders.set("Access-Control-Expose-Headers", "*");

      // Drop headers that might cause security issues if mirrored verbatim
      responseHeaders.delete("content-security-policy");
      responseHeaders.delete("x-frame-options");

      return new Response(fetchResponse.body, {
        status: fetchResponse.status,
        headers: responseHeaders,
      });
    } catch (error) {
      return new Response(`Proxy Error: ${error.message}`, { status: 500 });
    }
  },
};
