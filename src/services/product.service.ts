import { IProduct } from "../types/IProduct";
import { Product } from "../models/Product";

export const ProductService = {
    getProducts: async () => {
      const getAll = await Product.find()
      return getAll;
    },

    getProductById: async (_id: string) => {
        const getById = await Product.findById(_id)
        return getById;
    },

    createProduct: async (productData: IProduct) => {
        const newProduct = new Product(productData)

        const savedProduct = await newProduct.save()
        return savedProduct;
    }
}