import { z } from "zod";
import { UserRole } from "@prisma/client";

export const inviteUserSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  role: z.nativeEnum(UserRole).refine(
    (val) => val !== "OWNER",
    "Owner-Rolle kann nicht per Einladung vergeben werden"
  ),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
