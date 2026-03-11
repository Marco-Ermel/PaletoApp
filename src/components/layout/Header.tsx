import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/permissions";
import type { Session } from "next-auth";
import type { UserRole } from "@prisma/client";

interface HeaderProps {
  session: Session;
}

export function Header({ session }: HeaderProps) {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end items-center">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session.user.firstName} {session.user.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {ROLE_LABELS[session.user.role as UserRole]}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button variant="outline" size="sm" type="submit">
              Abmelden
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
