"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Registrieren..." : "Konto erstellen"}
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">Vorname</Label>
          <Input
            id="firstName"
            name="firstName"
            required
            className="mt-1"
            placeholder="Max"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Nachname</Label>
          <Input
            id="lastName"
            name="lastName"
            required
            className="mt-1"
            placeholder="Muster"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1"
          placeholder="max@muster-bau.ch"
        />
      </div>

      <div>
        <Label htmlFor="organizationName">Firmenname</Label>
        <Input
          id="organizationName"
          name="organizationName"
          required
          className="mt-1"
          placeholder="Muster Bau AG"
        />
      </div>

      <div>
        <Label htmlFor="password">Passwort</Label>
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
