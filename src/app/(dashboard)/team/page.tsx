import { requireUser } from "@/lib/auth/guards";
import { prisma } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/permissions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TeamPage() {
  const user = await requireUser();

  const members = await prisma.user.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "asc" },
  });

  const canInvite = hasPermission(user.role, "invite:users");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600">Mitarbeiter Ihrer Organisation</p>
        </div>
        {canInvite && (
          <Button asChild>
            <Link href="/team/invite">Mitarbeiter einladen</Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mitarbeiter ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">E-Mail</th>
                  <th className="pb-3 font-medium">Rolle</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Seit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => (
                  <tr key={member.id} className="py-3">
                    <td className="py-3 font-medium">
                      {member.firstName} {member.lastName}
                      {member.id === user.id && (
                        <span className="ml-2 text-xs text-gray-400">(Sie)</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600">{member.email}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[member.role]}`}>
                        {ROLE_LABELS[member.role]}
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={member.status === "ACTIVE" ? "default" : "secondary"}
                      >
                        {member.status === "ACTIVE" ? "Aktiv" : member.status === "INVITED" ? "Eingeladen" : "Deaktiviert"}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-600">
                      {formatDate(member.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
