"use server";

import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth/guards";
import { updateOrganizationSchema } from "@/lib/validations/organization";
import { revalidatePath } from "next/cache";

export async function updateOrganizationAction(prevState: unknown, formData: FormData) {
  const user = await requireRole("OWNER");

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    zip: formData.get("zip"),
    city: formData.get("city"),
    country: formData.get("country"),
  };

  const parsed = updateOrganizationSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data: parsed.data,
  });

  revalidatePath("/settings/organization");
  return { success: true };
}
