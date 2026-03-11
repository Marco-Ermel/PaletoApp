import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Mail, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();

  const [employeeCount, pendingInvitations] = await Promise.all([
    prisma.user.count({
      where: {
        organizationId: user.organizationId,
        status: { not: "DISABLED" },
      },
    }),
    prisma.invitation.count({
      where: {
        organizationId: user.organizationId,
        status: "PENDING",
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Willkommen zurück, {user.firstName} {user.lastName}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitarbeiter</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
            <p className="text-xs text-muted-foreground">Aktive Mitarbeiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Einladungen</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations}</div>
            <p className="text-xs text-muted-foreground">Ausstehende Einladungen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisation</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{user.organization.name}</div>
            <p className="text-xs text-muted-foreground">Ihr Unternehmen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.organization.subscription?.plan.type ?? "Kein Plan"}
            </div>
            <p className="text-xs text-muted-foreground">Aktuelles Abonnement</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Willkommen bei PaletoApp</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Ihr professionelles Bau-Management-System. Verwalten Sie Ihre Projekte,
            Mitarbeiter und Finanzen an einem Ort.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
