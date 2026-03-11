import { requireUser } from "@/lib/auth/guards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600">Ihre persönlichen Daten und Einstellungen.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Persönliche Daten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">E-Mail</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rolle</p>
              <Badge variant="outline">{ROLE_LABELS[user.role]}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                {user.status === "ACTIVE" ? "Aktiv" : "Inaktiv"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account-Informationen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Organisation</p>
              <p className="font-medium">{user.organization.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mitglied seit</p>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
            {user.lastLoginAt && (
              <div>
                <p className="text-sm text-gray-500">Letzter Login</p>
                <p className="font-medium">{formatDateTime(user.lastLoginAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
