// Ref: https://next-auth.js.org/getting-started/typescript#module-augmentation

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    schoolName: string;
    sessionToken: string;
    error: string;
  }

  interface User extends DefaultUser {
    role: string;
    given_name: string;
    family_name: string;
    accessToken: string;
    accessTokenExpires: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    given_name: string;
    family_name: string;
    accessToken: string;
    accessTokenExpires: number;
  }
}
