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

export function proxy(request: NextRequest) {
  void request;
  return withSecurity(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
