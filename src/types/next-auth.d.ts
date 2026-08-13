import { type DefaultSession } from "next-auth";
import type { PortalKind } from "@/lib/portfolio";

declare module "next-auth" {
  interface User {
    portal?: PortalKind;
  }

  interface Session {
    user: DefaultSession["user"] & {
      portal: PortalKind;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    portal?: PortalKind;
  }
}
