"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateOrganizationAction } from "@/features/organizations/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Organization } from "@prisma/client";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Speichern..." : "Änderungen speichern"}
    </Button>
  );
}

interface UpdateOrganizationFormProps {
  organization: Organization;
}

export function UpdateOrganizationForm({ organization }: UpdateOrganizationFormProps) {
  const [state, formAction] = useActionState(updateOrganizationAction, null);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          Änderungen wurden gespeichert.
        </div>
      )}

      <div>
        <Label htmlFor="name">Firmenname *</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={organization.name}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={organization.email ?? ""}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={organization.phone ?? ""}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          name="address"
          defaultValue={organization.address ?? ""}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="zip">PLZ</Label>
          <Input
            id="zip"
            name="zip"
            defaultValue={organization.zip ?? ""}
            className="mt-1"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="city">Ort</Label>
          <Input
            id="city"
            name="city"
            defaultValue={organization.city ?? ""}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="country">Land</Label>
        <Input
          id="country"
          name="country"
          defaultValue={organization.country}
          className="mt-1"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
