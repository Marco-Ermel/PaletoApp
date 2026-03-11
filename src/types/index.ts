import { UserRole, UserStatus, PlanType, InvitationStatus } from "@prisma/client";

export type { UserRole, UserStatus, PlanType, InvitationStatus };

export interface OrganizationWithSubscription {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  zip: string | null;
  city: string | null;
  country: string;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  subscription?: {
    plan: {
      type: PlanType;
      name: string;
      maxEmployees: number;
      maxInvitations: number;
      maxProjects: number;
    };
  } | null;
}

export interface UserWithOrganization {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  organization: OrganizationWithSubscription;
}

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
}

export interface PlanLimits {
  maxEmployees: number;
  maxInvitations: number;
  maxProjects: number;
  features: string[];
}
