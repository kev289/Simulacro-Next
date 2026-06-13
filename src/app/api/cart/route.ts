import { NextResponse } from "next/server";
import { CartService } from "@/src/services/cart.service";
import connectDB from "@/src/lib/mongodb";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "userId es requerido" }, { status: 400 });
        }

        const cart = await CartService.getCardService(userId);
        return NextResponse.json({ cart }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener el carrito", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { userId, productId, quantity } = await req.json();

        if (!userId || !productId || !quantity) {
            return NextResponse.json({ message: "userId, productId y quantity son requeridos" }, { status: 400 });
        }

        const result = await CartService.addItemToCart(userId, productId, quantity);
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al agregar al carrito", error }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const cartItemId = searchParams.get("cartItemId");

        if (!cartItemId) {
            return NextResponse.json({ message: "cartItemId es requerido" }, { status: 400 });
        }

        const deletedItem = await CartService.removeItemFromCart(cartItemId);
        return NextResponse.json({ message: "Item eliminado", deletedItem }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al eliminar del carrito", error }, { status: 500 });
    }
}