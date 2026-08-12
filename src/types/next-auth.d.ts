import "next-auth";
import "next-auth/jwt";
import type { RoleId } from "@/lib/catalog";

declare module "next-auth" {
  interface User {
    role?: RoleId;
    providers?: string[];
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: RoleId;
      providers?: string[];
      validation?: "technical" | "commercial" | "both" | "pending";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: RoleId;
    providers?: string[];
  }
}
