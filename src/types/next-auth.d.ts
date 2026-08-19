// import type { AdminRole } from "@prisma/client";
// import type { DefaultSession } from "next-auth";

// // A signed-in principal is either an Admin (role = one of AdminRole) or a
// // plain site User (role = "USER"). Widening the type this way lets every
// // callback and every consuming component check `session.user.role` without
// // caring which table the account actually lives in.
// export type AppRole = AdminRole | "USER";

// declare module "next-auth" {
//   interface User {
//     role: AppRole;
//   }

//   interface Session {
//     user: {
//       id: string;
//       role: AppRole;
//     } & DefaultSession["user"];
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     role: AppRole;
//   }
// }


import type { AdminRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

export type AppRole = AdminRole | "USER";

declare module "next-auth" {
  interface User {
    role: AppRole;
  }

  interface Session {
    user: {
      id: string;
      role: AppRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}