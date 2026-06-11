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
    }, 

    updateProduct: async (id: string, data: Partial<IProduct>) => {
       const updateProduct = await Product.findByIdAndUpdate(id, data, { new: true})
       return updateProduct;
    },

    deleteProduct: async (id: string) => {
       const deleteProduct = await Product.findByIdAndDelete(id);
       return deleteProduct; 
    }
}