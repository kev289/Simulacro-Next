import { ProductService } from "@/src/services/product.service";
import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const getProductById = await ProductService.getProductById(id)
        return NextResponse.json({ getProductById }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Error al obtener el producto", error }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const updateProduct = await ProductService.updateProduct(id, body);

        if (!updateProduct) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: `${updateProduct.name} se ha actualizado correctamente` })
    } catch (error) {
        return NextResponse.json({ message:"Error", error}, { status: 500})
    }

}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const deleteProduct = await ProductService.deleteProduct(id)
        if (!deleteProduct) {
            return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: `${deleteProduct.name} se ha eliminado correctamente` })
    } catch (error) {
        return NextResponse.json({ message:"Error", error}, { status: 500})
    }
}