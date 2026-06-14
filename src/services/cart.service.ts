import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

export const CartService = {
    getCardService: async (userId: string) => {
        const items = await Cart.find({ userId }).lean();
        const productIds = items.map((item) => item.productId);

        if (productIds.length === 0) return [];

        const products = await Product.find({ _id: { $in: productIds } }).lean();
        const productosPorId = new Map(
            products.map((p) => [p._id.toString(), p])
        );

        return items.map((item) => ({
            ...item,
            productId: productosPorId.get(item.productId) ?? {
                _id: item.productId,
                name: "Producto",
                price: 0,
            },
        }));
    },
    addItemToCart: async (userId: string, productId: string, quantity: number) => {
        const exist = await Cart.findOne({ userId, productId });

        if (!exist) {
            const newItem = await Cart.create({ userId, productId, quantity });
            return newItem;
        } else {
            exist.quantity += quantity; 
            await exist.save();        
            return exist;
        }
    },
    removeItemFromCart: async (cartItemId: string) => {
        const deletedItem = await Cart.findByIdAndDelete(cartItemId);
        return deletedItem;
    },
    updateItemQuantity: async (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            throw new Error("La cantidad debe ser al menos 1");
        }

        const item = await Cart.findById(cartItemId);
        if (!item) {
            throw new Error("Item del carrito no encontrado");
        }

        const product = await Product.findById(item.productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        if (product.stock < quantity) {
            throw new Error(
                `Stock insuficiente para "${product.name}". Disponible: ${product.stock}`
            );
        }

        item.quantity = quantity;
        await item.save();
        return item;
    },
}
