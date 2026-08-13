import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const security = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "off",
};

function withSecurity(response: NextResponse) {
  for (const [key, value] of Object.entries(security)) {
    response.headers.set(key, value);
  }
  return response;
}

function hasSession(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("authjs.session-token"));
}

const privatePaths = ["/dashboard", "/proyectos"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const gated = privatePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (gated && !hasSession(request)) {
    const login = new URL("/acceso", request.url);
    login.searchParams.set("next", pathname);
    return withSecurity(NextResponse.redirect(login));
  }

  return withSecurity(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
