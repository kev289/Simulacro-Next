import { ProductService } from "@/src/services/product.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const products = await ProductService.getProducts();
    return NextResponse.json( products , { status: 200 })
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const createProduct = await ProductService.createProduct(body)
        return NextResponse.json({ message: `${createProduct.name} Creado correctamente` }, { status: 201} )
    } catch (error) {
        return NextResponse.json({ message: "Error al crear el producto", error }, { status: 500 })
    }
}