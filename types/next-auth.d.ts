import { Researcher } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "RESEARCHER" | "SUPERVISOR" | "GENERAL_USER";
      researcher?: Researcher | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "ADMIN" | "RESEARCHER" | "SUPERVISOR" | "GENERAL_USER";
    researcher?: Researcher | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: "ADMIN" | "RESEARCHER" | "SUPERVISOR" | "GENERAL_USER";
    researcher?: Researcher | null;
  }
}
