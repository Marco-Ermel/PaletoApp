"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth/guards";
import { inviteUserSchema } from "@/lib/validations/invitation";
import { checkPlanLimit } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

export async function inviteUserAction(prevState: unknown, formData: FormData) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return { error: "Benutzer nicht gefunden." };

  if (!hasPermission(user.role, "invite:users")) {
    return { error: "Sie haben keine Berechtigung, Benutzer einzuladen." };
  }

  const raw = {
    email: formData.get("email"),
    role: formData.get("role"),
  };

  const parsed = inviteUserSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const limit = await checkPlanLimit(user.organizationId, "invitations");
  if (!limit.allowed) {
    return {
      error: `Ihr Plan erlaubt maximal ${limit.max} Einladungen. Bitte upgraden Sie Ihren Plan.`,
    };
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: parsed.data.email,
      organizationId: user.organizationId,
    },
  });

  if (existingUser) {
    return { error: "Dieser Benutzer gehört bereits zu Ihrer Organisation." };
  }

  const existingInvitation = await prisma.invitation.findFirst({
    where: {
      email: parsed.data.email,
      organizationId: user.organizationId,
      status: "PENDING",
    },
  });

  if (existingInvitation) {
    return { error: "Es gibt bereits eine ausstehende Einladung für diese E-Mail-Adresse." };
  }

  await prisma.invitation.create({
    data: {
      organizationId: user.organizationId,
      email: parsed.data.email,
      role: parsed.data.role,
      invitedById: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  revalidatePath("/team/invite");
  return { success: true };
}

export async function revokeInvitationAction(invitationId: string) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !hasPermission(user.role, "invite:users")) {
    return { error: "Keine Berechtigung." };
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      id: invitationId,
      organizationId: user.organizationId,
    },
  });

  if (!invitation) {
    return { error: "Einladung nicht gefunden." };
  }

  await prisma.invitation.delete({
    where: { id: invitationId },
  });

  revalidatePath("/team/invite");
  return { success: true };
}
