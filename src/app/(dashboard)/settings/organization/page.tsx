import { requireRole } from "@/lib/auth/guards";
import { UpdateOrganizationForm } from "@/features/organizations/components/UpdateOrganizationForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OrganizationSettingsPage() {
  const user = await requireRole("OWNER");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Unternehmen bearbeiten</h1>
        <p className="text-gray-600">Verwalten Sie die Stammdaten Ihrer Organisation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Firmendaten</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateOrganizationForm organization={user.organization} />
        </CardContent>
      </Card>
    </div>
  );
}
