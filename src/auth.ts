import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import GitLab from "next-auth/providers/gitlab";
import LinkedIn from "next-auth/providers/linkedin";
import { roles, type RoleId } from "@/lib/catalog";

const roleIds = roles.map((role) => role.id);

function asRole(value: unknown): RoleId {
  return roleIds.includes(value as RoleId) ? (value as RoleId) : "fundador";
}

function validationFor(role: RoleId, providers: string[]) {
  const technical = providers.some((item) => item === "github" || item === "gitlab");
  const commercial = providers.includes("linkedin") || providers.includes("credentials");
  if (role === "programador") {
    return technical || providers.includes("credentials") ? "technical" : "pending";
  }
  if (technical && commercial) return "both";
  if (commercial) return "commercial";
  if (technical) return "technical";
  return "pending";
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

if (process.env.AUTH_GITLAB_ID && process.env.AUTH_GITLAB_SECRET) {
  providers.push(
    GitLab({
      clientId: process.env.AUTH_GITLAB_ID,
      clientSecret: process.env.AUTH_GITLAB_SECRET,
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
    id: "passport-demo",
    name: "Kondax Passport",
    credentials: {
      role: { label: "Rol", type: "text" },
      name: { label: "Nombre", type: "text" },
    },
    authorize: async (credentials) => {
      const role = asRole(credentials?.role);
      const name =
        typeof credentials?.name === "string" && credentials.name.trim()
          ? credentials.name.trim()
          : `Passport ${role}`;
      return {
        id: `passport-${role}`,
        name,
        email: `${role}@passport.kondax.tech`,
        image: null,
        role,
        providers: role === "programador" ? ["github"] : ["linkedin"],
      };
    },
  }),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "kondax-dev-secret-change-in-production",
  pages: {
    signIn: "/passport",
  },
  providers,
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.role = "role" in user ? asRole(user.role) : asRole(token.role);
        token.providers =
          "providers" in user && Array.isArray(user.providers)
            ? user.providers
            : [];
      }
      if (account?.provider && account.provider !== "passport-demo") {
        const current = Array.isArray(token.providers) ? token.providers : [];
        if (!current.includes(account.provider)) {
          token.providers = [...current, account.provider];
        }
        if (account.provider === "github" || account.provider === "gitlab") {
          token.role = token.role ?? "programador";
        }
        if (account.provider === "linkedin") {
          token.role = token.role ?? "fundador";
        }
      }
      return token;
    },
    session({ session, token }) {
      const role = asRole(token.role);
      const connected = Array.isArray(token.providers) ? token.providers : [];
      session.user.role = role;
      session.user.providers = connected;
      session.user.validation = validationFor(role, connected);
      return session;
    },
  },
});

export const oauthReady = {
  github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
  gitlab: Boolean(process.env.AUTH_GITLAB_ID && process.env.AUTH_GITLAB_SECRET),
  linkedin: Boolean(process.env.AUTH_LINKEDIN_ID && process.env.AUTH_LINKEDIN_SECRET),
};
