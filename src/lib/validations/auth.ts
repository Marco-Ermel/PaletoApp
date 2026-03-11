import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen haben"),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen haben")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben haben")
    .regex(/[0-9]/, "Passwort muss mindestens eine Zahl haben"),
  organizationName: z
    .string()
    .min(2, "Firmenname muss mindestens 2 Zeichen haben"),
});

export const acceptInvitationSchema = z.object({
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen haben"),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen haben"),
  password: z
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen haben")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben haben")
    .regex(/[0-9]/, "Passwort muss mindestens eine Zahl haben"),
  token: z.string().min(1, "Token ist erforderlich"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
