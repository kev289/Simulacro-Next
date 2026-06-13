import { Sale } from "../models/Sale";
import { Cart } from "../models/Cart";

export const SaleService = {
    getSaleByUserId: async (userId: string) => {
        const sales = await Sale.find({ userId }).populate("products.productId");
        return sales;
    },
    createSale: async (userId: string, total: number) => {
        const cartItems = await Cart.find({ userId });
        if (cartItems.length === 0) {
            throw new Error("El carrito está vacío, no se puede realizar la venta");
        }
        const productsForSale = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));
        const newSale = await Sale.create({
            userId,
            products: productsForSale,
            total
        });
        await Cart.deleteMany({ userId });
        return newSale;
    }
};