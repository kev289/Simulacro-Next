import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" });
  response.cookies.set("accessToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  response.cookies.set("refreshToken", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
