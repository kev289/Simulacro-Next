// userId
// products[
//   {
//     productId
//     productName
//     productPrice
//     quantity
//   }
// ]
// total
// createdAt

import mongoose, { Schema } from "mongoose";
import { ISale } from "../types/ISale";

const SaleSchema: Schema = new Schema<ISale>(
    {
        userId: { type: String, required: true, trim: true},
    }
)