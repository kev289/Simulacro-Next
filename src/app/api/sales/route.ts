import { NextResponse } from "next/server";
import { SaleService } from "@/src/services/sale.service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "Id es requerido" }, { status: 400 });
        }

        const sales = await SaleService.getSaleByUserId(userId);
        return NextResponse.json({ sales }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener el historial de ventas", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId, total } = await req.json();

        if (!userId || !total) {
            return NextResponse.json({ message: "Id y total son requeridos" }, { status: 400 });
        }

        const newSale = await SaleService.createSale(userId, total);
        return NextResponse.json({ message: "Compra realizada con éxito", newSale }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Error al procesar la venta", error }, { status: 500 });
    }
}