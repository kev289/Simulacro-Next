import { authLib } from "@/src/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI2YTJhYjc1NWNjMTczMzA5ZWY2NDc0MDQiLCJuYW1lIjoia2V2aW4iLCJlbWFpbCI6ImtldmluQGtldmluLmNvbSIsImV4cCI6MTc4MTE5MTM1MH0.lCdEmfSAHS5uVnYUKZNyJOYY6fI82-rbRsdzQij5jzg";

    const payload = await authLib.verifyAccessToken(accessToken);
    return NextResponse.json({ payload });
}
