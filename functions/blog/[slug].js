/**
 * Cloudflare Pages Function: server-side 301 redirect for legacy timestamp-suffix blog slugs.
 *
 * Handles URLs like:
 *   /blog/pro-labore-medico-socio-2025-ir-e-contabilidade-1766653361521
 * → /blog/pro-labore-medico-socio-2025-ir-e-contabilidade
 *
 * This is a proper HTTP 301 so Googlebot follows it correctly,
 * unlike the client-side navigate() fallback in BlogPost.tsx.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname; // e.g. /blog/some-slug-1766653361521

  // Match slug ending with a 13+ digit Unix timestamp in milliseconds
  const match = pathname.match(/^(\/blog\/.+?)-(\d{13,})(\/?)?$/);
  if (match) {
    const cleanPath = match[1]; // /blog/some-slug (without timestamp)
    url.pathname = cleanPath;
    return Response.redirect(url.toString(), 301);
  }

  // No timestamp — pass through to the SPA
  return context.next();
}
