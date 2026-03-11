"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  CreditCard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "next-auth";
import type { UserRole } from "@prisma/client";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/team",
    label: "Team",
    icon: Users,
    roles: ["OWNER", "ADMIN", "MANAGER", "ACCOUNTANT"],
  },
  {
    href: "/team/invite",
    label: "Einladen",
    icon: UserPlus,
    roles: ["OWNER", "ADMIN"],
  },
  {
    href: "/settings/organization",
    label: "Unternehmen",
    icon: Building2,
    roles: ["OWNER"],
  },
  {
    href: "/settings/subscription",
    label: "Abonnement",
    icon: CreditCard,
    roles: ["OWNER"],
  },
  {
    href: "/profile",
    label: "Profil",
    icon: User,
  },
];

interface SidebarProps {
  session: Session;
}

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname();
  const role = session.user.role as UserRole;

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-bold text-gray-900">PaletoApp</span>
        </div>

        <div className="px-3 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {session.user.organizationName}
          </p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 flex-shrink-0",
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
