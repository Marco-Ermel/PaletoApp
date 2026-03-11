"use server";

import { prisma } from "@/lib/db";
import { registerSchema, acceptInvitationSchema } from "@/lib/validations/auth";
import { generateSlug, ensureUniqueSlug } from "@/lib/utils/slug";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function registerAction(prevState: unknown, formData: FormData) {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    organizationName: formData.get("organizationName"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, email, password, organizationName } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Diese E-Mail-Adresse wird bereits verwendet." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const baseSlug = generateSlug(organizationName);
  const slug = await ensureUniqueSlug(baseSlug, async (s) => {
    const org = await prisma.organization.findUnique({ where: { slug: s } });
    return !!org;
  });

  const starterPlan = await prisma.plan.findUnique({
    where: { type: "STARTER" },
  });

  if (!starterPlan) {
    return { error: "Pläne sind nicht konfiguriert. Bitte kontaktieren Sie den Support." };
  }

  await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName,
        slug,
      },
    });

    await tx.user.create({
      data: {
        organizationId: organization.id,
        firstName,
        lastName,
        email,
        passwordHash,
        role: "OWNER",
        status: "ACTIVE",
      },
    });

    await tx.subscription.create({
      data: {
        organizationId: organization.id,
        planId: starterPlan.id,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  });

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });
}

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Ungültige E-Mail oder Passwort." };
        default:
          return { error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." };
      }
    }
    throw error;
  }
}

export async function acceptInvitationAction(prevState: unknown, formData: FormData) {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    password: formData.get("password"),
    token: formData.get("token"),
  };

  const parsed = acceptInvitationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { firstName, lastName, password, token } = parsed.data;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invitation) {
    return { error: "Ungültiger Einladungslink." };
  }

  if (invitation.status !== "PENDING") {
    return { error: "Diese Einladung wurde bereits verwendet oder ist abgelaufen." };
  }

  if (invitation.expiresAt < new Date()) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "EXPIRED" },
    });
    return { error: "Diese Einladung ist abgelaufen." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: invitation.email },
  });
  if (existingUser) {
    return { error: "Diese E-Mail-Adresse wird bereits verwendet." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        organizationId: invitation.organizationId,
        firstName,
        lastName,
        email: invitation.email,
        passwordHash,
        role: invitation.role,
        status: "ACTIVE",
        invitedBy: invitation.invitedById,
      },
    });

    await tx.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });
  });

  await signIn("credentials", {
    email: invitation.email,
    password,
    redirectTo: "/dashboard",
  });
}
