import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authLib } from "@/src/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "No autenticado" }, { status: 401 });
    }

    const payload = await authLib.verifyAccessToken(token);
    const userId = payload.userId as string;
    const name = payload.name as string;
    const email = payload.email as string;

    if (!userId || !name || !email) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    return NextResponse.json({
      user: { userId, name, email },
    });
  } catch {
    return NextResponse.json({ message: "Sesión expirada" }, { status: 401 });
  }
}
