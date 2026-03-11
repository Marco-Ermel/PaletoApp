import { z } from "zod";

export const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Firmenname muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
