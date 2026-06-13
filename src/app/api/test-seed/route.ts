import { NextResponse } from "next/server";
import { Product } from "@/src/models/Product"; // Ajusta la ruta de tu modelo
import connectDB from "@/src/lib/mongodb";

const SEED_PRODUCTS = [
  {
    name: "Monitor 24",
    description: "Pantalla IPS plana de 24 pulgadas. Contraste estricto de blancos y negros. Tasa de refresco optimizada para entornos de desarrollo.",
    price: 299.99,
    stock: 12,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=Monitor+24"
  },
  {
    name: "Teclado Mecanico",
    description: "Teclado mecánico compacto con switches táctiles silenciosos. Keycaps de PBT monocromáticas sin retroiluminación distractora.",
    price: 145.00,
    stock: 8,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=Teclado"
  },
  {
    name: "Mouse Gamer",
    description: "Mouse ergonómico inalámbrico con sensor óptico de alta precisión. Acabado texturizado negro mate, botones planos sin ruido.",
    price: 89.90,
    stock: 25,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=Mouse"
  },
  {
    name: "Audifonos",
    description: "Audífonos de estudio cerrados. Respuesta de frecuencia plana para aislamiento total durante sesiones extensas de ejecución.",
    price: 180.00,
    stock: 5,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=Audifonos"
  },
  {
    name: "SSD 1TB",
    description: "Unidad de almacenamiento masivo NVMe. Velocidades de lectura secuencial nativas de alto rendimiento. Factor de forma m.2.",
    price: 110.00,
    stock: 15,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=SSD+1TB"
  },
  {
    name: "MousePad",
    description: "Tapete de escritorio de fieltro industrial gris oscuro. Bordes cosidos con precisión milimétrica. Optimizado para tracking óptico.",
    price: 35.00,
    stock: 40,
    image: "https://placehold.co/400x400/111111/FFFFFF/png?text=MousePad"
  }
];

export async function GET() {
  try {
    await connectDB();
    await Product.deleteMany({});
    
    const products = await Product.insertMany(SEED_PRODUCTS);
    
    return NextResponse.json({ 
      message: "DATABASE_SEED_SUCCESS: Catálogo de productos inicializado.", 
      count: products.length 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "DATABASE_SEED_FAILED", error }, { status: 500 });
  }
}