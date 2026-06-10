// Necesitamos: 
// UserId
// ProductId

import mongoose, { Model, Schema } from "mongoose";
import { IFavorite } from "../types/IFavorite";

const FavoriteSchema: Schema = new Schema<IFavorite>(
    {
        userId: { type: String, required: true, trim: true },
        productId: { type: String, required: true, trim: true}
    },
    { timestamps: true,
        collection: 'favorites'
     }
);

export const Favorite: Model<IFavorite> = 
    mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema)