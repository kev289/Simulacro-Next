import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth(ruta: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect(`/login?redirect=${encodeURIComponent(ruta)}`);
  }
}
