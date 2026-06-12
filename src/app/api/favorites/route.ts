import { NextResponse } from "next/server";
import { FavoriteService } from "@/src/services/favorite.service";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ message: "Requerido el id de usuario" }, { status: 400 });
    }

    const favorites = await FavoriteService.getFavoritesByUserId(userId);
    return NextResponse.json({ favorites }, { status: 200 });
}

export async function POST(req: Request) {
    const { userId, productId } = await req.json();

    const result = await FavoriteService.toggleFavorite(userId, productId);
    return NextResponse.json(result, { status: 200 });
}