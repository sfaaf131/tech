import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import LinkedIn from "next-auth/providers/linkedin";
import type { PortalKind } from "@/lib/portfolio";

function asPortal(value: unknown): PortalKind {
  return value === "startup" ? "startup" : "b2b";
}

const providers: NextAuthConfig["providers"] = [];

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

if (process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET) {
  providers.push(
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    id: "portal",
    name: "Portal Kondax",
    credentials: {
      portal: { label: "Portal", type: "text" },
      name: { label: "Nombre", type: "text" },
    },
    authorize: async (credentials) => {
      const portal = asPortal(credentials?.portal);
      const name =
        typeof credentials?.name === "string" && credentials.name.trim()
          ? credentials.name.trim()
          : portal === "startup"
            ? "Socio fundador"
            : "Cliente B2B";
      return {
        id: `portal-${portal}`,
        name,
        email: `${portal}@portal.kondax.tech`,
        image: null,
        portal,
      };
    },
  }),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "kondax-dev-secret-change-in-production",
  pages: {
    signIn: "/acceso",
  },
  providers,
  callbacks: {
    jwt({ token, user, account }) {
      if (user && "portal" in user) {
        token.portal = asPortal(user.portal);
      }
      if (account?.provider === "linkedin") {
        token.portal = token.portal ?? "startup";
      }
      if (account?.provider === "github") {
        token.portal = token.portal ?? "b2b";
      }
      return token;
    },
    session({ session, token }) {
      session.user.portal = asPortal(token.portal);
      return session;
    },
  },
});
