import { requireUser } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { InviteUserForm } from "@/features/invitations/components/InviteUserForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/permissions";
import { RevokeInvitationButton } from "@/features/invitations/components/RevokeInvitationButton";

export default async function InvitePage() {
  const user = await requireUser();

  if (!hasPermission(user.role, "invite:users")) {
    redirect("/dashboard");
  }

  const pendingInvitations = await prisma.invitation.findMany({
    where: {
      organizationId: user.organizationId,
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mitarbeiter einladen</h1>
        <p className="text-gray-600">Laden Sie neue Mitarbeiter zu Ihrer Organisation ein.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Neue Einladung senden</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteUserForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ausstehende Einladungen ({pendingInvitations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingInvitations.length === 0 ? (
              <p className="text-gray-500 text-sm">Keine ausstehenden Einladungen.</p>
            ) : (
              <div className="space-y-3">
                {pendingInvitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{invitation.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {ROLE_LABELS[invitation.role]}
                        </span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs text-gray-500">
                          Läuft ab: {formatDate(invitation.expiresAt)}
                        </span>
                      </div>
                    </div>
                    <RevokeInvitationButton invitationId={invitation.id} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
