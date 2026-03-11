import { PrismaClient, UserRole, UserStatus, PlanType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const starterPlan = await prisma.plan.upsert({
    where: { type: PlanType.STARTER },
    update: {},
    create: {
      type: PlanType.STARTER,
      name: "Starter",
      description: "Perfekt für kleine Betriebe",
      maxEmployees: 3,
      maxInvitations: 5,
      maxProjects: 10,
      priceMonthly: 29,
      priceYearly: 290,
      features: [
        "Bis zu 3 Mitarbeiter",
        "Bis zu 10 Projekte",
        "Grundlegende Zeiterfassung",
        "E-Mail Support",
      ],
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { type: PlanType.PRO },
    update: {},
    create: {
      type: PlanType.PRO,
      name: "Pro",
      description: "Für wachsende Unternehmen",
      maxEmployees: 15,
      maxInvitations: 20,
      maxProjects: 50,
      priceMonthly: 79,
      priceYearly: 790,
      features: [
        "Bis zu 15 Mitarbeiter",
        "Bis zu 50 Projekte",
        "Erweiterte Zeiterfassung",
        "Lohnverwaltung",
        "Prioritäts-Support",
      ],
    },
  });

  const businessPlan = await prisma.plan.upsert({
    where: { type: PlanType.BUSINESS },
    update: {},
    create: {
      type: PlanType.BUSINESS,
      name: "Business",
      description: "Für grosse Unternehmen",
      maxEmployees: 100,
      maxInvitations: 150,
      maxProjects: 999,
      priceMonthly: 199,
      priceYearly: 1990,
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
  });

  console.log("✅ Plans created");

  const org1 = await prisma.organization.upsert({
    where: { slug: "muster-bau-ag" },
    update: {},
    create: {
      name: "Muster Bau AG",
      slug: "muster-bau-ag",
      email: "info@muster-bau.ch",
      phone: "+41 44 123 45 67",
      address: "Bahnhofstrasse 1",
      zip: "8001",
      city: "Zürich",
      country: "CH",
    },
  });

  const owner1Password = await bcrypt.hash("Password1", 12);
  const owner1 = await prisma.user.upsert({
    where: { email: "owner@muster-bau.ch" },
    update: {},
    create: {
      organizationId: org1.id,
      firstName: "Max",
      lastName: "Muster",
      email: "owner@muster-bau.ch",
      passwordHash: owner1Password,
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@muster-bau.ch" },
    update: {},
    create: {
      organizationId: org1.id,
      firstName: "Anna",
      lastName: "Admin",
      email: "admin@muster-bau.ch",
      passwordHash: await bcrypt.hash("Password1", 12),
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      invitedBy: owner1.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "mitarbeiter@muster-bau.ch" },
    update: {},
    create: {
      organizationId: org1.id,
      firstName: "Peter",
      lastName: "Polier",
      email: "mitarbeiter@muster-bau.ch",
      passwordHash: await bcrypt.hash("Password1", 12),
      role: UserRole.EMPLOYEE,
      status: UserStatus.ACTIVE,
      invitedBy: owner1.id,
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: org1.id },
    update: {},
    create: {
      organizationId: org1.id,
      planId: proPlan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  const org2 = await prisma.organization.upsert({
    where: { slug: "demo-gmbh" },
    update: {},
    create: {
      name: "Demo GmbH",
      slug: "demo-gmbh",
      email: "info@demo-gmbh.ch",
      address: "Dorfstrasse 10",
      zip: "3000",
      city: "Bern",
      country: "CH",
    },
  });

  await prisma.user.upsert({
    where: { email: "owner@demo-gmbh.ch" },
    update: {},
    create: {
      organizationId: org2.id,
      firstName: "Lisa",
      lastName: "Demo",
      email: "owner@demo-gmbh.ch",
      passwordHash: await bcrypt.hash("Password1", 12),
      role: UserRole.OWNER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.subscription.upsert({
    where: { organizationId: org2.id },
    update: {},
    create: {
      organizationId: org2.id,
      planId: starterPlan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✅ Demo organizations and users created");
  console.log("\n🎉 Seeding complete!");
  console.log("\n📝 Demo accounts:");
  console.log("  Owner (Pro Plan):    owner@muster-bau.ch  / Password1");
  console.log("  Admin:               admin@muster-bau.ch   / Password1");
  console.log("  Employee:            mitarbeiter@muster-bau.ch / Password1");
  console.log("  Owner (Starter):     owner@demo-gmbh.ch    / Password1");

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
