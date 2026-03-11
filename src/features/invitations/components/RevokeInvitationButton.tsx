"use client";

import { revokeInvitationAction } from "@/features/invitations/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface RevokeInvitationButtonProps {
  invitationId: string;
}

export function RevokeInvitationButton({ invitationId }: RevokeInvitationButtonProps) {
  return (
    <form
      action={async () => {
        await revokeInvitationAction(invitationId);
      }}
    >
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}
