import { requireAuth } from "@/lib/auth/guards";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  return (
    <DashboardLayout session={session}>
      {children}
    </DashboardLayout>
  );
}
