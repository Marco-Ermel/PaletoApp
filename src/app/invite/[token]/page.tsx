import { prisma } from "@/lib/db";
import { AcceptInvitationForm } from "@/features/auth/components/AcceptInvitationForm";
import { Building2 } from "lucide-react";
import { notFound } from "next/navigation";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invitation || invitation.status !== "PENDING" || invitation.expiresAt < new Date()) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Einladung annehmen
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sie wurden von <strong>{invitation.organization.name}</strong> eingeladen.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AcceptInvitationForm token={token} email={invitation.email} />
        </div>
      </div>
    </div>
  );
}
