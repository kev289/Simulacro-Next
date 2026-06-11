import mongoose, { Model, Schema } from "mongoose";
import { ISale } from "../types/ISale";

const SaleSchema: Schema = new Schema<ISale>(
  {
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        productName: {
          type: String,
          required: true,
          trim: true,
        },
        productPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "sales",
  }
);

export const Sale: Model<ISale> =
  mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);