import { Sale } from "../models/Sale";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

export const SaleService = {
    getSaleByUserId: async (userId: string) => {
        return Sale.find({ userId }).sort({ createdAt: -1 }).lean();
    },
    createSale: async (userId: string) => {
        const cartItems = await Cart.find({ userId });
        if (cartItems.length === 0) {
            throw new Error("El carrito está vacío, no se puede realizar la venta");
        }

        const productIds = cartItems.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        const productosPorId = new Map(
            products.map((p) => [p._id.toString(), p])
        );

        for (const item of cartItems) {
            const product = productosPorId.get(item.productId);
            if (!product) {
                throw new Error("Uno de los productos del carrito ya no existe");
            }
            if (product.stock < item.quantity) {
                throw new Error(
                    `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
                );
            }
        }

        const productsForSale = cartItems.map((item) => {
            const product = productosPorId.get(item.productId)!;
            return {
                productId: item.productId,
                productName: product.name,
                productPrice: product.price,
                quantity: item.quantity,
            };
        });

        const total = productsForSale.reduce(
            (acc, item) => acc + item.productPrice * item.quantity,
            0
        );

        const newSale = await Sale.create({
            userId,
            products: productsForSale,
            total,
        });

        for (const item of cartItems) {
            const actualizado = await Product.findOneAndUpdate(
                { _id: item.productId, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!actualizado) {
                throw new Error(
                    `No se pudo descontar el stock de "${productosPorId.get(item.productId)?.name}"`
                );
            }
        }

        await Cart.deleteMany({ userId });
        return newSale;
    },
};
