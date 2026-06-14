import { NextResponse } from "next/server";
import { FavoriteService } from "@/src/services/favorite.service";
import connectDB from "@/src/lib/mongodb";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Requerido el id de usuario" }, { status: 400 });
        }

        const favorites = await FavoriteService.getFavoritesByUserId(userId);
        return NextResponse.json({ favorites }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { userId, productId } = await req.json();

        const result = await FavoriteService.toggleFavorite(userId, productId);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const favId = searchParams.get("favId");

        if (!favId) {
            return NextResponse.json({ message: "favId es requerido" }, { status: 400 });
        }

        const result = await FavoriteService.removeFavorite(favId);
        return NextResponse.json({ message: "Favorito eliminado", result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}