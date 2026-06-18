import { ProductService } from "@/src/services/product.service";
import { NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        const products = await ProductService.getProducts();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Error al obtener los productos", error },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const createProduct = await ProductService.createProduct(body)
        return NextResponse.json({ message: `${createProduct.name} Creado correctamente` }, { status: 201} )
    } catch (error) {
        return NextResponse.json({ message: "Error al crear el producto", error }, { status: 500 })
    }
}
