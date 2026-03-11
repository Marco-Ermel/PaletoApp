import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      organizationId: string;
      organizationName: string;
      organizationSlug: string;
      firstName: string;
      lastName: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizationId: string;
    organizationName: string;
    organizationSlug: string;
    firstName: string;
    lastName: string;
  }
}
