import { Cart } from "../models/Cart";

export const CartService = {
    getCardService: async (userId: string) => {
        const getCart = await Cart.find({ userId }).populate("productId")
        return getCart;
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
}
}