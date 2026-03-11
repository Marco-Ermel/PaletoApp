import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function requireUser() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      organization: {
        include: {
          subscription: {
            include: { plan: true },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(roles: UserRole | UserRole[]) {
  const user = await requireUser();
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}

export async function canInviteUsers(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user?.role === "OWNER" || user?.role === "ADMIN";
}

export async function canManageOrganization(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return user?.role === "OWNER";
}

export async function checkPlanLimit(
  organizationId: string,
  limitType: "employees" | "invitations" | "projects"
): Promise<{ allowed: boolean; current: number; max: number }> {
  const subscription = await prisma.subscription.findUnique({
    where: { organizationId },
    include: { plan: true },
  });

  if (!subscription) {
    return { allowed: false, current: 0, max: 0 };
  }

  const plan = subscription.plan;

  if (limitType === "employees") {
    const current = await prisma.user.count({
      where: {
        organizationId,
        status: { not: "DISABLED" },
      },
    });
    const max = plan.maxEmployees;
    return { allowed: current < max, current, max };
  }

  if (limitType === "invitations") {
    const current = await prisma.invitation.count({
      where: {
        organizationId,
        status: "PENDING",
      },
    });
    const max = plan.maxInvitations;
    return { allowed: current < max, current, max };
  }

  if (limitType === "projects") {
    const max = plan.maxProjects;
    return { allowed: true, current: 0, max };
  }

  return { allowed: false, current: 0, max: 0 };
}
