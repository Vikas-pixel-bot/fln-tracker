import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: string;
      schoolId?: string | null;
      schoolName?: string | null;
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    schoolId?: string | null;
    schoolName?: string | null;
    id?: string;
  }
}
