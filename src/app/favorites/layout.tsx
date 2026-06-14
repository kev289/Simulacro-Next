import { requireAuth } from "@/src/lib/require-auth";

export default async function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth("/favorites");
  return <>{children}</>;
}
