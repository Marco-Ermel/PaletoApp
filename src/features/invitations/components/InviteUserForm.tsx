"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { inviteUserAction } from "@/features/invitations/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Einladung senden..." : "Einladung senden"}
    </Button>
  );
}

export function InviteUserForm() {
  const [state, formAction] = useActionState(inviteUserAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          Einladung wurde erfolgreich gesendet!
        </div>
      )}

      <div>
        <Label htmlFor="email">E-Mail-Adresse</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1"
          placeholder="mitarbeiter@unternehmen.ch"
        />
      </div>

      <div>
        <Label htmlFor="role">Rolle</Label>
        <select
          id="role"
          name="role"
          required
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue="EMPLOYEE"
        >
          <option value="ADMIN">Administrator</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Mitarbeiter</option>
          <option value="ACCOUNTANT">Buchhalter</option>
        </select>
      </div>

      <SubmitButton />
    </form>
  );
}
