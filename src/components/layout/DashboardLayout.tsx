import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import type { Session } from "next-auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
}

export function DashboardLayout({ children, session }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar session={session} />
      <div className="lg:pl-64">
        <Header session={session} />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
