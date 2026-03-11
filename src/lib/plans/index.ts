import type { PlanType } from "@prisma/client";

export interface PlanConfig {
  type: PlanType;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  maxEmployees: number;
  maxInvitations: number;
  maxProjects: number;
  features: string[];
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  STARTER: {
    type: "STARTER",
    name: "Starter",
    description: "Perfekt für kleine Betriebe",
    priceMonthly: 29,
    priceYearly: 290,
    maxEmployees: 3,
    maxInvitations: 5,
    maxProjects: 10,
    features: [
      "Bis zu 3 Mitarbeiter",
      "Bis zu 10 Projekte",
      "Grundlegende Zeiterfassung",
      "E-Mail Support",
    ],
  },
  PRO: {
    type: "PRO",
    name: "Pro",
    description: "Für wachsende Unternehmen",
    priceMonthly: 79,
    priceYearly: 790,
    maxEmployees: 15,
    maxInvitations: 20,
    maxProjects: 50,
    features: [
      "Bis zu 15 Mitarbeiter",
      "Bis zu 50 Projekte",
      "Erweiterte Zeiterfassung",
      "Lohnverwaltung",
      "Prioritäts-Support",
    ],
  },
  BUSINESS: {
    type: "BUSINESS",
    name: "Business",
    description: "Für grosse Unternehmen",
    priceMonthly: 199,
    priceYearly: 1990,
    maxEmployees: 100,
    maxInvitations: 150,
    maxProjects: 999,
    features: [
      "Bis zu 100 Mitarbeiter",
      "Unbegrenzte Projekte",
      "Vollständige Zeiterfassung",
      "Lohnverwaltung",
      "Offerten & Rechnungen",
      "Dedizierter Support",
      "API-Zugang",
    ],
  },
};

export function getPlanConfig(planType: PlanType): PlanConfig {
  return PLAN_CONFIGS[planType];
}
