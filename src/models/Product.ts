// Necesitamos: 
// Imagen de referencia
// Nombre de referencia
// Precio 
// Descripcion
// Stock

import mongoose, { Model, Schema } from "mongoose";
import { IProduct } from "../types/IProduct";

const ProductSchema: Schema = new Schema<IProduct>(
    {
        image: { type: String, required: true},
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, trim: true },
        stock: { type: Number, required: true, min: 0 }
    },
    { timestamps: true,
        collection: 'products'
    }
);

export const Product: Model<IProduct> = 
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)