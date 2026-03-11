"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { acceptInvitationAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Konto erstellen..." : "Konto erstellen"}
    </Button>
  );
}

interface AcceptInvitationFormProps {
  token: string;
  email: string;
}

export function AcceptInvitationForm({ token, email }: AcceptInvitationFormProps) {
  const [state, formAction] = useActionState(acceptInvitationAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <input type="hidden" name="token" value={token} />

      <div>
        <Label>E-Mail</Label>
        <Input value={email} disabled className="mt-1 bg-gray-50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input id="firstName" name="firstName" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input id="lastName" name="lastName" required className="mt-1" />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Passwort wählen</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1"
        />
        <p className="mt-1 text-xs text-gray-500">
          Mindestens 8 Zeichen, ein Großbuchstabe und eine Zahl
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}
