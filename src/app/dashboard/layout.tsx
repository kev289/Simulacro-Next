import { requireAuth } from "@/src/lib/require-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/dashboard");
  return <>{children}</>;
}
