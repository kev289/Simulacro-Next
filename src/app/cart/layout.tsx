import { requireAuth } from "@/src/lib/require-auth";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/cart");
  return <>{children}</>;
}
