// Necesitamos 
// userId
// productId
// quantity

import mongoose, { Schema, Model } from "mongoose";
import { ICart } from "../types/ICart";

const CartSchema: Schema = new Schema<ICart>(
    {
        userId: { type: String, required: true, trim: true},
        productId: { type: String, required: true, trim: true},
        quantity: { type: Number, required: true, min: 1}
    },
    { timestamps: true }
);

export const Cart: Model<ICart> = 
    mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

