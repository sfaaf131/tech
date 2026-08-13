import "next-auth";
import "next-auth/jwt";
import type { PortalKind } from "@/lib/portfolio";

declare module "next-auth" {
  interface User {
    portal?: PortalKind;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      portal?: PortalKind;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    portal?: PortalKind;
  }
}
