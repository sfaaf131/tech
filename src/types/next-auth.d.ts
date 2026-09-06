// Amplía los tipos de NextAuth v5 para incluir `id` y `role` en la sesión y el JWT.
// Sin esto, `session.user.id` y `session.user.role` dan error de TypeScript en el build.
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
